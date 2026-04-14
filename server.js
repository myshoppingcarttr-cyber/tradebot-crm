require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

function calculateScore(outcome, duration, currentScore) {
  const delta = {
    'account_opened': +40, 'appointment': +25, 'callback': +15,
    'info_given': +10, 'no_answer': -5, 'not_interested': -10,
  }[outcome] ?? 0;
  const durationBonus = duration > 180 ? 5 : 0;
  return Math.max(0, Math.min(100, currentScore + delta + durationBonus));
}

app.get('/health', (req, res) => res.json({ ok: true, time: new Date() }));

app.post('/vapi/webhook', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.json({ ok: true });
  const type = message.type;

  if (type === 'end-of-call-report') {
    const call = message.call;
    const phone = call.customer?.number;
    let lead = null;
    if (phone) {
      const { data } = await supabase.from('leads').select('id, score').eq('phone', phone).single().catch(() => ({ data: null }));
      if (data) { lead = data; }
      else if (call.type === 'inbound') {
        const { data: newLead } = await supabase.from('leads').insert({ phone, source: 'inbound', status: 'cold', score: 0 }).select().single().catch(() => ({ data: null }));
        lead = newLead;
      }
    }
    const transcript = message.transcript ?? '';
    const outcome = detectOutcome(transcript, message.analysis);
    const newScore = lead ? calculateScore(outcome, call.duration, lead.score) : 0;
    await supabase.from('calls').insert({
      lead_id: lead?.id, vapi_call_id: call.id, direction: call.type,
      phone_from: call.customer?.number, phone_to: call.phoneNumber?.number,
      duration_sec: call.duration, status: 'completed', transcript,
      summary: message.analysis?.summary, sentiment: message.analysis?.sentiment,
      outcome, lead_score_after: newScore, escalated: message.analysis?.escalated ?? false,
    }).catch(console.error);
    if (lead) {
      await supabase.from('lead_score_log').insert({ lead_id: lead.id, old_score: lead.score, new_score: newScore, reason: outcome }).catch(console.error);
    }
    console.log('[Call]', phone, outcome, newScore);
    return res.json({ ok: true });
  }

  if (type === 'tool-calls') {
    const results = [];
    for (const toolCall of message.toolCallList ?? []) {
      const { name, parameters } = toolCall;
      let result = '';
      if (name === 'get_market_analysis') { result = await getMarketAnalysisForCall(); }
      if (name === 'save_lead_info') {
        await supabase.from('leads').upsert({ phone: parameters.phone, full_name: parameters.name, city: parameters.city, interests: parameters.interests, source: 'inbound' }, { onConflict: 'phone' }).catch(console.error);
        result = 'Lead kaydedildi.';
      }
      results.push({ toolCallId: toolCall.id, result });
    }
    return res.json({ results });
  }
  res.json({ ok: true });
});

app.post('/admin/fetch-market', async (req, res) => {
  await fetchAndSaveMarketAnalysis();
  res.json({ ok: true, message: 'Piyasa analizi güncellendi' });
});

app.get('/admin/todays-analysis', async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const { data } = await supabase.from('daily_analysis').select('*').eq('analysis_date', today).single().catch(() => ({ data: null }));
  res.json(data ?? { error: 'Bugün analiz yok' });
});

async function fetchAndSaveMarketAnalysis() {
  try {
    const marketData = await fetchMarketPrices();
    const analysisPrompt = buildAnalysisPrompt(marketData);
    const claudeRes = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-sonnet-4-20250514', max_tokens: 1500,
      messages: [{ role: 'user', content: analysisPrompt }],
    }, { headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' } });
    const analysisText = claudeRes.data.content[0].text;
    let parsed = {};
    try { parsed = JSON.parse(analysisText.replace(/```json|```/g, '').trim()); } catch {}
    const vapiInject = buildVapiInject(marketData, parsed);
    await supabase.from('daily_analysis').upsert({
      analysis_date: new Date().toISOString().split('T')[0],
      market_data: marketData, gold_analysis: parsed.gold ?? '', fx_analysis: parsed.fx ?? '',
      crypto_analysis: parsed.crypto ?? '', stocks_analysis: parsed.stocks ?? '',
      general_summary: parsed.summary ?? '', sales_scripts: parsed.scripts ?? {},
      news_events: parsed.news ?? [], vapi_prompt_inject: vapiInject, fetched_at: new Date().toISOString(),
    }, { onConflict: 'analysis_date' });
    console.log('[Market] Analiz kaydedildi');
  } catch (err) { console.error('[Market] Hata:', err.message); }
}

function buildAnalysisPrompt(data) {
  return 'Sen uzman bir finansal analistsin. Aşağıdaki piyasa verisini analiz et ve Global Eksbina satış ajanı için Türkçe script yaz.\n\nVeri: ' + JSON.stringify(data) + '\n\nSADECE JSON döndür: {"gold":"...","fx":"...","crypto":"...","stocks":"...","summary":"...","scripts":{"gold_opener":"...","crypto_opener":"...","fx_opener":"...","urgency_hook":"..."},"news":[]}';
}

function buildVapiInject(data, analysis) {
  const btc = data.BTCUSD;
  const gold = data.XAUUSD;
  return 'GÜNLÜK PİYASA (' + new Date().toLocaleDateString('tr-TR') + '):\n- Bitcoin: ' + (btc?.price ? Math.round(btc.price).toLocaleString('tr-TR') + ' dolar (' + (btc.change_pct > 0 ? '+' : '') + btc.change_pct + '%)' : 'veri yok') + '\n- Altın: ' + (gold?.price ? gold.price + ' dolar (' + (gold.change_pct > 0 ? '+' : '') + gold.change_pct + '%)' : 'veri yok') + '\n\n' + (analysis.summary ?? '') + '\n\nAçılış: ' + (analysis.scripts?.gold_opener ?? '');
}

async function fetchMarketPrices() {
  try {
    const key = process.env.TWELVE_DATA_API_KEY;
    const symbols = ['BTC/USD', 'XAU/USD', 'EUR/USD'];
    const results = {};
    for (const sym of symbols) {
      const r = await axios.get('https://api.twelvedata.com/price?symbol=' + sym + '&apikey=' + key);
      const prev = await axios.get('https://api.twelvedata.com/eod?symbol=' + sym + '&apikey=' + key);
      const price = parseFloat(r.data.price);
      const prevClose = parseFloat(prev.data.close);
      const change = ((price - prevClose) / prevClose * 100).toFixed(2);
      const key2 = sym.replace('/', '');
      results[key2] = { price, change_pct: parseFloat(change), direction: price > prevClose ? 'up' : 'down' };
    }
    return results;
  } catch (e) {
    console.error('[Market] API hatası:', e.message);
    return { BTCUSD: { price: 72000, change_pct: 1.2, direction: 'up' }, XAUUSD: { price: 2350, change_pct: 0.8, direction: 'up' }, EURUSD: { price: 1.089, change_pct: 0.3, direction: 'up' } };
  }
}

async function getMarketAnalysisForCall() {
  const today = new Date().toISOString().split('T')[0];
  const { data } = await supabase.from('daily_analysis').select('vapi_prompt_inject').eq('analysis_date', today).single().catch(() => ({ data: null }));
  return data?.vapi_prompt_inject ?? 'Piyasa verisi yükleniyor.';
}

function detectOutcome(transcript, analysis) {
  const t = (transcript + ' ' + (analysis?.summary ?? '')).toLowerCase();
  if (t.includes('hesap aç') || t.includes('kayıt ol')) return 'account_opened';
  if (t.includes('randevu') || t.includes('toplantı')) return 'appointment';
  if (t.includes('geri ara') || t.includes('sonra ara')) return 'callback';
  if (t.includes('ilgilenmiyorum') || t.includes('hayır')) return 'not_interested';
  return 'info_given';
}

cron.schedule('0 8 * * 1-5', () => { fetchAndSaveMarketAnalysis(); });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('[Server] Port', PORT, 'çalışıyor');
  fetchAndSaveMarketAnalysis().catch(console.error);
});
