(function crmV2(SB,K){
var H={apikey:K,Authorization:'Bearer '+K};
var HC=Object.assign({},H,{'Content-Type':'application/json'});
var _page=1,_ps=100,_fil={},_sort='skor.desc.nullslast',_sel=new Set(),_data=[];

function toast(m,t){var d=document.createElement('div');d.style.cssText='position:fixed;top:20px;right:20px;background:#1a1a24;border:2px solid '+(t==='err'?'#ef4444':t==='warn'?'#f59e0b':'#22c55e')+';border-radius:10px;padding:12px 18px;z-index:99999;font-size:13px;color:#f0ede8;box-shadow:0 8px 24px rgba(0,0,0,.5);max-width:320px';d.textContent=m;document.body.appendChild(d);setTimeout(function(){d.remove();},3200);}

function bgl(v,c,t){return '<span style="padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;background:'+c+';color:'+t+'">'+v+'</span>';}
function ilgiBadge(v){return v==='yuksek'?bgl('Yüksek','rgba(34,197,94,.2)','#22c55e'):v==='orta'?bgl('Orta','rgba(251,191,36,.2)','#fbbf24'):v==='dusuk'?bgl('Düşük','rgba(239,68,68,.15)','#ef4444'):'<span style="color:#5a566a">—</span>';}
function sdBadge(v){var m={yeni:['rgba(96,165,250,.2)','#60a5fa','Yeni'],araniyor:['rgba(251,191,36,.2)','#fbbf24','Aranıyor'],ilgileniyor:['rgba(34,197,94,.2)','#22c55e','İlgileniyor'],teklif:['rgba(201,169,110,.2)','#C9A96E','Teklif'],satildi:['rgba(168,85,247,.2)','#a855f7','SATILDI'],vazgecti:['rgba(239,68,68,.15)','#ef4444','Vazgeçti']};var e=m[v]||m['yeni'];return bgl(e[2],e[0],e[1]);}

async function load(){
  var tb=document.getElementById('am-tb');
  if(tb)tb.innerHTML='<tr><td colspan="13" style="text-align:center;padding:30px;color:#5a566a">Yükleniyor...</td></tr>';
  var f=_fil;
  var q=SB+'/rest/v1/calls?agent_name=eq.Ayse&select=id,skor,ilgi_seviyesi,outcome,assigned_to,assigned_name,satis_durumu,summary,itiraz,takip_notu,personel_notu,etiket,customers(full_name,phone),created_at&limit='+_ps+'&offset='+((_page-1)*_ps)+'&order='+_sort;
  if(f.ilgi&&f.ilgi!=='all')q+='&ilgi_seviyesi=eq.'+f.ilgi;
  if(f.skor)q+='&skor=gte.'+f.skor;
  if(f.sd&&f.sd!=='all')q+='&satis_durumu=eq.'+f.sd;
  if(f.asgn==='yes')q+='&assigned_to=not.is.null';
  if(f.asgn==='no')q+='&assigned_to=is.null';
  var cq=SB+'/rest/v1/calls?agent_name=eq.Ayse&select=id';
  if(f.ilgi&&f.ilgi!=='all')cq+='&ilgi_seviyesi=eq.'+f.ilgi;
  if(f.skor)cq+='&skor=gte.'+f.skor;
  if(f.sd&&f.sd!=='all')cq+='&satis_durumu=eq.'+f.sd;
  if(f.asgn==='yes')cq+='&assigned_to=not.is.null';
  if(f.asgn==='no')cq+='&assigned_to=is.null';
  var [rows,cr]=await Promise.all([
    fetch(q,{headers:H}).then(function(r){return r.json();}).catch(function(){return[];}),
    fetch(cq,{headers:Object.assign({},H,{'Prefer':'count=exact'}),method:'HEAD'}).then(function(r){return r.headers.get('content-range');}).catch(function(){return null;})
  ]);
  _data=rows||[];
  var tot=cr?parseInt(cr.split('/')[1]||0):0;
  render(tot);
}

function render(tot){
  var tb=document.getElementById('am-tb');if(!tb)return;
  if(!_data.length){tb.innerHTML='<tr><td colspan="13" style="text-align:center;padding:40px;color:#5a566a">Sonuç bulunamadı</td></tr>';pager(tot);return;}
  tb.innerHTML=_data.map(function(c){
    var sk=c.skor||0,bp=sk>0?(sk*10)+'%':'—',bc=sk>=7?'#22c55e':sk>=4?'#C9A96E':'#ef4444';
    var nm=c.customers&&c.customers.full_name||'?';
    var ph=(c.customers&&c.customers.phone||'').replace(/[^0-9+]/g,'');
    var sm=c.summary?c.summary.substring(0,55)+(c.summary.length>55?'…':''):'—';
    var chk=_sel.has(c.id)?'checked':'';
    var tag=c.etiket?'<span style="background:rgba(201,169,110,.15);color:#C9A96E;border-radius:3px;padding:1px 5px;font-size:10px">'+c.etiket+'</span>':'';
    var hasNote=c.personel_notu?'<span title="Not var" style="color:#60a5fa;font-size:11px">📝</span>':'';
    return '<tr data-id="'+c.id+'" style="border-bottom:1px solid rgba(255,255,255,.04)" onmouseover="this.style.background=\'rgba(255,255,255,.025)\'" onmouseout="this.style.background=\'\'">'
      +'<td style="padding:6px 10px;text-align:center"><input type="checkbox" class="am-ck" data-id="'+c.id+'" '+chk+' onchange="window._amToggle(\''+c.id+'\')" style="accent-color:#C9A96E;width:14px;height:14px"></td>'
      +'<td style="padding:6px 10px"><span onclick="window._amDetail(\''+c.id+'\',\''+nm.replace(/'/g,'').replace(/"/g,'')+'\',this)" style="color:#f0ede8;font-weight:600;cursor:pointer;font-size:13px">'+nm+'</span> '+tag+' '+hasNote+'</td>'
      +'<td style="padding:6px 10px;font-size:11px;color:#5a566a">'+(ph?ph.substring(0,13):'—')+'</td>'
      +'<td style="padding:6px 10px;text-align:center"><span style="font-size:15px;font-weight:700;color:'+bc+'">'+(sk>0?bp:'—')+'</span></td>'
      +'<td style="padding:6px 6px;text-align:center">'+ilgiBadge(c.ilgi_seviyesi||'')+'</td>'
      +'<td style="padding:6px 4px;text-align:center">'+sdBadge(c.satis_durumu||'yeni')+'</td>'
      +'<td style="padding:6px 10px;font-size:11px;color:#a8a4b0;max-width:170px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="'+sm+'">'+sm+'</td>'
      +'<td style="padding:6px 10px;font-size:11px;color:#5a566a">'+(c.assigned_name||'—')+'</td>'
      +'<td style="padding:6px 10px;font-size:10px;color:#5a566a">'+(c.outcome||'—').substring(0,16)+'</td>'
      +'<td style="padding:6px 6px;text-align:center">'
        +(ph?'<div style="display:flex;gap:3px">'
          +'<a href="tel:+'+ph+'" title="Ara" style="background:#21212e;border:1px solid rgba(34,197,94,.3);border-radius:4px;padding:3px 5px;font-size:11px;text-decoration:none">📞</a>'
          +'<a href="msteams:?call&number=+'+ph+'" title="Teams" style="background:#21212e;border:1px solid rgba(96,165,250,.3);border-radius:4px;padding:3px 5px;font-size:11px;text-decoration:none">🎯</a>'
          +'<a href="skype:+'+ph+'?call" title="Skype" style="background:#21212e;border:1px solid rgba(124,58,237,.3);border-radius:4px;padding:3px 5px;font-size:11px;text-decoration:none">💬</a>'
          +'</div>':'—')
      +'</td>'
      +'<td style="padding:6px 6px;text-align:center"><button onclick="window._amDetail(\''+c.id+'\',\''+nm.replace(/'/g,'').replace(/"/g,'')+'\',null)" style="background:#21212e;border:1px solid rgba(201,169,110,.2);border-radius:5px;padding:3px 8px;font-size:10px;color:#C9A96E;cursor:pointer">Detay</button></td>'
      +'<td style="padding:6px 10px;font-size:10px;color:#5a566a">'+(c.created_at?c.created_at.substring(5,10):'—')+'</td>'
      +'</tr>';
  }).join('');
  pager(tot);
  selBar();
}

function pager(tot){
  var el=document.getElementById('am-pager');if(!el)return;
  var pages=Math.max(1,Math.ceil(tot/_ps));
  var s=Math.max(1,_page-2),e=Math.min(pages,s+4);
  if(e-s<4)s=Math.max(1,e-4);
  var b='<span style="color:#5a566a;font-size:12px;margin-right:8px">'+tot+' kayıt</span>';
  if(s>1)b+='<button onclick="window._amPage(1)" style="background:#21212e;color:#a8a4b0;border:1px solid rgba(255,255,255,.08);border-radius:5px;padding:4px 8px;cursor:pointer;font-size:12px;margin:2px">1</button><span style="color:#5a566a"> … </span>';
  for(var i=s;i<=e;i++){var ac=i===_page?'background:#C9A96E;color:#000;font-weight:700':'background:#21212e;color:#a8a4b0';b+='<button onclick="window._amPage('+i+')" style="'+ac+';border:1px solid rgba(255,255,255,.08);border-radius:5px;padding:4px 8px;cursor:pointer;font-size:12px;margin:2px">'+i+'</button>';}
  if(e<pages)b+='<span style="color:#5a566a"> … </span><button onclick="window._amPage('+pages+')" style="background:#21212e;color:#a8a4b0;border:1px solid rgba(255,255,255,.08);border-radius:5px;padding:4px 8px;cursor:pointer;font-size:12px;margin:2px">'+pages+'</button>';
  b+='<span style="color:#5a566a;font-size:12px;margin-left:8px">Sayfa '+_page+'/'+pages+'</span>';
  el.innerHTML=b;
}

function selBar(){
  var bar=document.getElementById('am-sbar');if(!bar)return;
  bar.style.display=_sel.size?'flex':'none';
  var cnt=document.getElementById('am-scnt');if(cnt)cnt.textContent=_sel.size+' seçildi';
}

window._amPage=function(p){_page=p;load();};
window._amToggle=function(id){_sel.has(id)?_sel.delete(id):_sel.add(id);selBar();};
window._amSelAll=function(v){document.querySelectorAll('.am-ck').forEach(function(c){c.checked=v;v?_sel.add(c.dataset.id):_sel.delete(c.dataset.id);});selBar();};
window._amFilter=function(){_fil={ilgi:document.getElementById('am-filgi')?.value,skor:document.getElementById('am-fskor')?.value,sd:document.getElementById('am-fsd')?.value,asgn:document.getElementById('am-fasgn')?.value};_page=1;load();};
window._amSort=function(col){var cur=_sort.split('.')[0];_sort=col===(cur)?(_sort.includes('asc')?col+'.desc.nullslast':col+'.asc.nullslast'):col+'.desc.nullslast';load();};
window._amPS=function(v){_ps=parseInt(v);_page=1;load();};

// Toplu ata
window._amAssign=async function(){
  if(!_sel.size){toast('Önce satır seçin!','warn');return;}
  var ud=await fetch(SB+'/rest/v1/users?select=id,full_name&order=full_name',{headers:H}).then(function(r){return r.json();}).catch(function(){return[];});
  var m=document.createElement('div');m.id='am-assignm';
  m.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:9999;display:flex;align-items:center;justify-content:center';
  m.innerHTML='<div style="background:#1a1a24;border:1px solid rgba(201,169,110,.3);border-radius:14px;padding:24px;min-width:300px">'
    +'<div style="font-size:15px;font-weight:700;color:#f0ede8;margin-bottom:14px">'+_sel.size+' Aramayı Ata</div>'
    +'<select id="am-aus" style="width:100%;background:#21212e;color:#f0ede8;border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:10px;font-size:13px;margin-bottom:14px"><option value="">-- Personel Seç --</option>'
    +ud.map(function(u){return'<option value="'+u.id+'" data-n="'+u.full_name+'">'+u.full_name+'</option>';}).join('')+'</select>'
    +'<div style="display:flex;gap:8px;justify-content:flex-end">'
    +'<button onclick="document.getElementById(\'am-assignm\').remove()" style="background:rgba(255,255,255,.08);color:#a8a4b0;border:none;border-radius:8px;padding:8px 16px;cursor:pointer">İptal</button>'
    +'<button id="am-aok" style="background:#C9A96E;color:#000;border:none;border-radius:8px;padding:8px 16px;font-weight:700;cursor:pointer">Ata</button>'
    +'</div></div>';
  document.body.appendChild(m);
  m.onclick=function(e){if(e.target===m)m.remove();};
  document.getElementById('am-aok').onclick=async function(){
    var sel=document.getElementById('am-aus');var uid=sel.value,uname=sel.selectedOptions[0]?.text;
    if(!uid){toast('Personel seçin!','warn');return;}
    var ids=Array.from(_sel);var done=0;
    for(var i=0;i<ids.length;i+=10){
      await Promise.all(ids.slice(i,i+10).map(async function(id){
        var r=await fetch(SB+'/rest/v1/calls?id=eq.'+id,{method:'PATCH',headers:HC,body:JSON.stringify({assigned_to:uid,assigned_name:uname,satis_durumu:'yeni'})});
        if(r.status===204)done++;
      }));
    }
    m.remove();_sel.clear();toast(done+' arama '+uname+"'a atandı",'ok');load();
  };
};

// Excel export
window._amExport=function(){
  var ids=Array.from(_sel);var rows=_data.filter(function(c){return!ids.length||ids.includes(c.id);});
  var csv='\uFEFFAd Soyad,Telefon,Skor,İlgi,Durum,Özet,Personel Not,Personel,Sonuç,Tarih\n';
  csv+=rows.map(function(c){return[c.customers?.full_name||'',c.customers?.phone||'',c.skor||0,c.ilgi_seviyesi||'',c.satis_durumu||'','"'+(c.summary||'').replace(/"/g,"''")+'"','"'+(c.personel_notu||'').replace(/"/g,"''")+'"',c.assigned_name||'',c.outcome||'',(c.created_at||'').substring(0,10)].join(',');}).join('\n');
  var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='aramalar_'+(new Date().toISOString().substring(0,10))+'.csv';a.click();
  toast((ids.length||rows.length)+' satır export edildi','ok');
};

// Detay paneli
window._amDetail=async function(cid,cn){
  var old=document.getElementById('am-dp');if(old){old.remove();return;}
  var p=document.createElement('div');p.id='am-dp';
  p.style.cssText='position:fixed;right:0;top:0;width:440px;height:100vh;background:#13131a;border-left:1px solid rgba(255,255,255,.1);z-index:9998;display:flex;flex-direction:column;box-shadow:-6px 0 30px rgba(0,0,0,.6)';
  p.innerHTML='<div style="padding:13px 16px;background:#1a1a24;border-bottom:1px solid rgba(255,255,255,.08);display:flex;justify-content:space-between;align-items:center;flex-shrink:0">'
    +'<div style="font-size:14px;font-weight:700;color:#f0ede8">'+cn+'</div>'
    +'<button onclick="document.getElementById(\'am-dp\').remove()" style="background:none;border:none;color:#5a566a;cursor:pointer;font-size:22px">×</button></div>'
    +'<div id="am-dpb" style="flex:1;overflow-y:auto;padding:14px"><div style="color:#5a566a;text-align:center;padding:40px">Yükleniyor...</div></div>';
  document.body.appendChild(p);

  var data=await fetch(SB+'/rest/v1/calls?id=eq.'+cid+'&select=*,customers(full_name,phone)',{headers:H}).then(function(r){return r.json();}).catch(function(){return[];});
  var c=data&&data[0];
  if(!c){
    var all=await fetch(SB+'/rest/v1/calls?agent_name=eq.Ayse&select=*,customers(full_name,phone)&order=created_at.desc&limit=200',{headers:H}).then(function(r){return r.json();}).catch(function(){return[];});
    c=all.find(function(x){return x.customers?.full_name?.substring(0,5).toLowerCase()===cn.substring(0,5).toLowerCase();});
  }
  var b=document.getElementById('am-dpb');if(!b)return;
  if(!c){b.innerHTML='<p style="color:#ef4444;padding:20px;text-align:center">Veri bulunamadı</p>';return;}

  var sk=c.skor||0,bp=sk>0?(sk*10)+'%':'—',bc=sk>=7?'#22c55e':sk>=4?'#C9A96E':'#ef4444';
  var ph=(c.customers?.phone||'').replace(/[^0-9+]/g,'');
  var sd=c.satis_durumu||'yeni';
  var tr=(c.transcript||'').split('\n').map(function(l){
    if(!l.trim())return '';
    if(l.startsWith('AI:'))return'<div style="margin:3px 0;padding:6px 10px;background:rgba(201,169,110,.1);border-radius:5px;color:#C9A96E;font-size:12px;line-height:1.4"><b>Ayşe:</b> '+l.slice(3).trim()+'</div>';
    if(l.startsWith('User:'))return'<div style="margin:3px 0;padding:6px 10px;background:rgba(255,255,255,.05);border-radius:5px;color:#f0ede8;font-size:12px;line-height:1.4"><b>Müşteri:</b> '+l.slice(5).trim()+'</div>';
    return '';
  }).join('');

  b.innerHTML=
    '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">'
    +'<div style="background:#21212e;border-radius:8px;padding:8px;text-align:center"><div style="font-size:20px;font-weight:700;color:'+bc+'">'+bp+'</div><div style="font-size:9px;color:#5a566a;margin-top:2px">BAŞARI</div></div>'
    +'<div style="background:#21212e;border-radius:8px;padding:8px;text-align:center"><div style="font-size:12px;font-weight:600;color:#60a5fa;margin-top:3px">'+(c.ilgi_seviyesi||'—')+'</div><div style="font-size:9px;color:#5a566a;margin-top:2px">İLGİ</div></div>'
    +'<div style="background:#21212e;border-radius:8px;padding:8px;text-align:center"><div style="font-size:10px;color:#f87171;margin-top:3px">'+(c.outcome||'—').substring(0,14)+'</div><div style="font-size:9px;color:#5a566a;margin-top:2px">SONUÇ</div></div>'
    +'</div>'
    +(ph?'<div style="display:flex;gap:6px;margin-bottom:12px">'
      +'<a href="tel:+'+ph+'" style="flex:1;text-align:center;background:#21212e;border:1px solid rgba(34,197,94,.3);border-radius:7px;padding:7px;font-size:12px;text-decoration:none;color:#22c55e;font-weight:600">📞 Ara</a>'
      +'<a href="msteams:?call&number=+'+ph+'" style="flex:1;text-align:center;background:#21212e;border:1px solid rgba(96,165,250,.3);border-radius:7px;padding:7px;font-size:12px;text-decoration:none;color:#60a5fa;font-weight:600">🎯 Teams</a>'
      +'<a href="skype:+'+ph+'?call" style="flex:1;text-align:center;background:#21212e;border:1px solid rgba(124,58,237,.3);border-radius:7px;padding:7px;font-size:12px;text-decoration:none;color:#7c3aed;font-weight:600">💬 Skype</a>'
      +'</div>':'')
    +'<div style="margin-bottom:12px"><div style="font-size:10px;color:#a8a4b0;margin-bottom:5px">SATIŞ DURUMU</div>'
    +'<select id="am-dpsd" onchange="window._amUpdSD(\''+cid+'\',this.value)" style="width:100%;background:#21212e;color:#f0ede8;border:1px solid rgba(255,255,255,.1);border-radius:7px;padding:8px;font-size:13px">'
    +'<option value="yeni"'+(sd==='yeni'?' selected':'')+'>Yeni</option>'
    +'<option value="araniyor"'+(sd==='araniyor'?' selected':'')+'>Aranıyor</option>'
    +'<option value="ilgileniyor"'+(sd==='ilgileniyor'?' selected':'')+'>İlgileniyor</option>'
    +'<option value="teklif"'+(sd==='teklif'?' selected':'')+'>Teklif Verildi</option>'
    +'<option value="satildi"'+(sd==='satildi'?' selected':'')+'>✅ SATILDI</option>'
    +'<option value="vazgecti"'+(sd==='vazgecti'?' selected':'')+'>Vazgeçti</option>'
    +'</select></div>'
    +'<div style="margin-bottom:12px"><div style="font-size:10px;color:#a8a4b0;margin-bottom:5px">ETİKET</div>'
    +'<div style="display:flex;gap:6px;flex-wrap:wrap">'
    +['🔥 Sıcak','⭐ VIP','🔄 Geri Ara','💰 Yüksek Bütçe','⚡ Acil'].map(function(t){var act=(c.etiket||'')==t;return'<button onclick="window._amSetTag(\''+cid+'\',\''+t+'\')" style="background:'+(act?'rgba(201,169,110,.3)':'rgba(255,255,255,.05)')+';color:'+(act?'#C9A96E':'#a8a4b0')+';border:1px solid rgba(255,255,255,.1);border-radius:5px;padding:4px 8px;font-size:11px;cursor:pointer">'+t+'</button>';}).join('')
    +'</div></div>'
    +(c.summary?'<div style="background:#21212e;border-radius:8px;padding:10px;margin-bottom:10px"><div style="font-size:10px;color:#a8a4b0;margin-bottom:5px">AYŞE ÖZETİ</div><div style="font-size:12px;color:#f0ede8;line-height:1.5">'+c.summary+'</div></div>':'')
    +(c.itiraz&&c.itiraz!=='-'?'<div style="background:rgba(251,191,36,.08);border-radius:7px;padding:8px;margin-bottom:8px;font-size:12px;color:#fbbf24">⚠️ İtiraz: '+c.itiraz+'</div>':'')
    +(c.takip_notu?'<div style="background:rgba(96,165,250,.08);border-radius:7px;padding:8px;margin-bottom:10px;font-size:12px;color:#60a5fa">📌 '+c.takip_notu+'</div>':'')
    +'<div style="margin-bottom:12px"><div style="font-size:10px;color:#a8a4b0;margin-bottom:5px">PERSONEL NOTU</div>'
    +'<textarea id="am-dpnote" placeholder="Not ekleyin..." style="width:100%;background:#21212e;color:#f0ede8;border:1px solid rgba(255,255,255,.1);border-radius:7px;padding:9px;font-size:12px;resize:vertical;min-height:80px;font-family:inherit;box-sizing:border-box">'+( c.personel_notu||'')+'</textarea>'
    +'<button onclick="window._amSaveNote(\''+cid+'\')" style="width:100%;margin-top:5px;background:#C9A96E;color:#000;border:none;border-radius:7px;padding:8px;font-weight:700;cursor:pointer;font-size:12px">Notu Kaydet</button></div>'
    +'<div style="font-size:10px;color:#a8a4b0;margin-bottom:7px">KONUŞMA</div>'
    +(tr||'<p style="color:#5a566a;font-size:12px;text-align:center;padding:16px">Transkript yok</p>');
};

window._amUpdSD=async function(cid,val){await fetch(SB+'/rest/v1/calls?id=eq.'+cid,{method:'PATCH',headers:HC,body:JSON.stringify({satis_durumu:val})});toast(val==='satildi'?'🎉 SATILDI!':'Durum güncellendi','ok');load();};
window._amSetTag=async function(cid,tag){
  var c=_data.find(function(x){return x.id===cid;});
  var newTag=(c&&c.etiket===tag)?null:tag;
  await fetch(SB+'/rest/v1/calls?id=eq.'+cid,{method:'PATCH',headers:HC,body:JSON.stringify({etiket:newTag})});
  toast(newTag?'Etiket: '+newTag:'Etiket kaldırıldı','ok');
  var old=document.getElementById('am-dp');if(old)old.remove();
  load();
};
window._amSaveNote=async function(cid){
  var n=document.getElementById('am-dpnote')?.value||'';
  await fetch(SB+'/rest/v1/calls?id=eq.'+cid,{method:'PATCH',headers:HC,body:JSON.stringify({personel_notu:n})});
  toast('Not kaydedildi ✓','ok');
};

// Ana panel aç
window.showAramaMerkezi=async function(){
  var old=document.getElementById('am-pg');if(old){old.remove();return;}
  var pg=document.createElement('div');pg.id='am-pg';
  pg.style.cssText='position:fixed;inset:0;background:#0d0d12;z-index:7000;display:flex;flex-direction:column;overflow:hidden;font-family:system-ui,sans-serif';
  pg.innerHTML=
    '<div style="background:#1a1a24;border-bottom:1px solid rgba(255,255,255,.08);padding:10px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0;flex-wrap:wrap">'
    +'<div style="font-size:15px;font-weight:700;color:#f0ede8;flex-shrink:0">📋 Arama Merkezi</div>'
    +'<select id="am-filgi" onchange="window._amFilter()" style="background:#21212e;color:#f0ede8;border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:5px 8px;font-size:12px"><option value="all">Tüm İlgi</option><option value="yuksek">Yüksek</option><option value="orta">Orta</option><option value="dusuk">Düşük</option></select>'
    +'<select id="am-fskor" onchange="window._amFilter()" style="background:#21212e;color:#f0ede8;border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:5px 8px;font-size:12px"><option value="">Tüm Skor</option><option value="3">3+</option><option value="5">5+</option><option value="7">7+ (Sıcak)</option></select>'
    +'<select id="am-fsd" onchange="window._amFilter()" style="background:#21212e;color:#f0ede8;border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:5px 8px;font-size:12px"><option value="all">Tüm Durum</option><option value="yeni">Yeni</option><option value="araniyor">Aranıyor</option><option value="ilgileniyor">İlgileniyor</option><option value="teklif">Teklif</option><option value="satildi">Satıldı</option><option value="vazgecti">Vazgeçti</option></select>'
    +'<select id="am-fasgn" onchange="window._amFilter()" style="background:#21212e;color:#f0ede8;border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:5px 8px;font-size:12px"><option value="all">Tüm Atama</option><option value="yes">Atanmış</option><option value="no">Atanmamış</option></select>'
    +'<select onchange="window._amPS(this.value)" style="background:#21212e;color:#f0ede8;border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:5px 8px;font-size:12px"><option value="100">100/sayfa</option><option value="200">200/sayfa</option><option value="500">500/sayfa</option></select>'
    +'<button onclick="window._amExport()" style="background:#21212e;color:#60a5fa;border:1px solid rgba(96,165,250,.3);border-radius:6px;padding:5px 10px;font-size:12px;cursor:pointer">📥 Excel</button>'
    +'<button onclick="document.getElementById(\'am-pg\').remove()" style="margin-left:auto;background:rgba(255,255,255,.08);color:#a8a4b0;border:none;border-radius:6px;padding:6px 12px;cursor:pointer;font-size:12px;flex-shrink:0">✕ Kapat</button>'
    +'</div>'
    +'<div id="am-sbar" style="display:none;background:rgba(201,169,110,.1);border-bottom:1px solid rgba(201,169,110,.2);padding:8px 16px;align-items:center;gap:10px;flex-shrink:0">'
    +'<span id="am-scnt" style="color:#C9A96E;font-weight:700;font-size:13px"></span>'
    +'<button onclick="window._amAssign()" style="background:#C9A96E;color:#000;border:none;border-radius:6px;padding:5px 12px;font-weight:700;cursor:pointer;font-size:12px">Personele Ata</button>'
    +'<button onclick="window._amExport()" style="background:#21212e;color:#60a5fa;border:1px solid rgba(96,165,250,.3);border-radius:6px;padding:5px 12px;cursor:pointer;font-size:12px">Excel İndir</button>'
    +'<button onclick="window._amSelAll(false);_sel.clear()" style="background:rgba(255,255,255,.05);color:#a8a4b0;border:none;border-radius:6px;padding:5px 10px;cursor:pointer;font-size:12px">Temizle</button>'
    +'</div>'
    +'<div style="flex:1;overflow:auto">'
    +'<table style="width:100%;border-collapse:collapse;font-size:12px">'
    +'<thead><tr style="background:#1a1a24;position:sticky;top:0;z-index:10">'
    +'<th style="padding:8px 10px;width:32px"><input type="checkbox" id="am-chkall" onchange="window._amSelAll(this.checked)" style="accent-color:#C9A96E;width:14px;height:14px"></th>'
    +'<th onclick="window._amSort(\'customers.full_name\')" style="padding:8px 10px;text-align:left;color:#a8a4b0;font-weight:600;cursor:pointer;white-space:nowrap">MÜŞTERİ ↕</th>'
    +'<th style="padding:8px 10px;text-align:left;color:#a8a4b0;font-weight:600">TELEFON</th>'
    +'<th onclick="window._amSort(\'skor\')" style="padding:8px 10px;text-align:center;color:#a8a4b0;font-weight:600;cursor:pointer">SKOR ↕</th>'
    +'<th style="padding:8px 6px;text-align:center;color:#a8a4b0;font-weight:600">İLGİ</th>'
    +'<th style="padding:8px 4px;text-align:center;color:#a8a4b0;font-weight:600">DURUM</th>'
    +'<th style="padding:8px 10px;text-align:left;color:#a8a4b0;font-weight:600">AYŞE ÖZETİ</th>'
    +'<th style="padding:8px 10px;text-align:left;color:#a8a4b0;font-weight:600">PERSONEL</th>'
    +'<th style="padding:8px 10px;text-align:left;color:#a8a4b0;font-weight:600">SONUÇ</th>'
    +'<th style="padding:8px 6px;text-align:center;color:#a8a4b0;font-weight:600">ARA</th>'
    +'<th style="padding:8px 6px;text-align:center;color:#a8a4b0;font-weight:600">DETAY</th>'
    +'<th onclick="window._amSort(\'created_at\')" style="padding:8px 10px;text-align:center;color:#a8a4b0;font-weight:600;cursor:pointer">TARİH ↕</th>'
    +'</tr></thead>'
    +'<tbody id="am-tb"></tbody>'
    +'</table></div>'
    +'<div id="am-pager" style="background:#1a1a24;border-top:1px solid rgba(255,255,255,.08);padding:10px 16px;flex-shrink:0"></div>';
  document.body.appendChild(pg);
  _page=1;_sel.clear();_fil={};_sort='skor.desc.nullslast';
  load();
};

// Topbar butonu
function addBtn(){
  if(document.getElementById('am-btn'))return;
  var t=document.querySelector('.topbar');if(!t)return;
  var b=document.createElement('button');b.id='am-btn';
  b.textContent='📋 Arama Merkezi';
  b.style.cssText='background:linear-gradient(135deg,rgba(201,169,110,.2),rgba(201,169,110,.08));color:#C9A96E;border:1px solid rgba(201,169,110,.3);border-radius:7px;padding:5px 12px;font-size:12px;cursor:pointer;margin-left:8px;font-weight:700';
  b.onclick=function(){window.showAramaMerkezi();};
  t.appendChild(b);
}
new MutationObserver(function(){addBtn();}).observe(document.body,{childList:true,subtree:true});
setInterval(addBtn,1000);setTimeout(addBtn,400);
})("https://muwynsxukmxjquoqcbac.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11d3luc3h1a214anF1b3FjYmFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjExMzQwMCwiZXhwIjoyMDkxNjg5NDAwfQ.33AsVo1mIeNHznTKnr6IUjVTLP_puNeNFJMS8-GsO30");
