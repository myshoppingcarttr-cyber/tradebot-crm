/* crm.js v3 - Global Eksbina CRM */
var _SB="https://muwynsxukmxjquoqcbac.supabase.co";
var _SK="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11d3luc3h1a214anF1b3FjYmFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjExMzQwMCwiZXhwIjoyMDkxNjg5NDAwfQ.33AsVo1mIeNHznTKnr6IUjVTLP_puNeNFJMS8-GsO30";
var _SH={apikey:_SK,Authorization:"Bearer "+_SK};
var _SC=Object.assign({},_SH,{"Content-Type":"application/json"});
var _p=1,_ps=100,_flt={},_srt="skor.desc.nullslast",_sel=new Set(),_dat=[];
var _PER=[
  {id:"94cfd7da-c8da-42fc-96e2-0f93472c524a",ad:"Sistem Yoneticisi"},
  {id:"61dd9140-5210-49dc-9790-ca4cae5eed77",ad:"Furkan Ekmen"},
  {id:"39dcb015-3a96-4026-8bd7-5d236df2b74a",ad:"Melis Dogan"},
  {id:"638053e4-e25a-4e5a-8084-4c7ec417002e",ad:"Ayse"}
];

function _toast(msg,tp){
  var d=document.createElement("div");
  var c=tp==="e"?"#ef4444":tp==="w"?"#f59e0b":"#22c55e";
  d.style.cssText="position:fixed;top:20px;right:20px;background:#1a1a24;border:2px solid "+c+";border-radius:10px;padding:12px 18px;z-index:99999;font-size:13px;color:#f0ede8;max-width:320px";
  d.textContent=msg;
  document.body.appendChild(d);
  setTimeout(function(){if(d.parentNode)d.parentNode.removeChild(d);},3500);
}

function _ilgi(v){
  if(v==="yuksek")return"<span style='background:rgba(34,197,94,.2);color:#22c55e;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700'>Yuksek</span>";
  if(v==="orta")return"<span style='background:rgba(251,191,36,.2);color:#fbbf24;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700'>Orta</span>";
  if(v==="dusuk")return"<span style='background:rgba(239,68,68,.15);color:#ef4444;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700'>Dusuk</span>";
  return"<span style='color:#5a566a'>-</span>";
}

function _sdB(v){
  if(v==="araniyor")return"<span style='background:rgba(251,191,36,.2);color:#fbbf24;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700'>Araniyor</span>";
  if(v==="ilgileniyor")return"<span style='background:rgba(34,197,94,.2);color:#22c55e;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700'>Ilgileniyor</span>";
  if(v==="teklif")return"<span style='background:rgba(201,169,110,.2);color:#C9A96E;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700'>Teklif</span>";
  if(v==="satildi")return"<span style='background:rgba(168,85,247,.2);color:#a855f7;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700'>SATILDI</span>";
  if(v==="vazgecti")return"<span style='background:rgba(239,68,68,.15);color:#ef4444;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700'>Vazgecti</span>";
  return"<span style='background:rgba(96,165,250,.2);color:#60a5fa;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700'>Yeni</span>";
}

function _loadAM(){
  var tb=document.getElementById("am-tb");
  if(tb)tb.innerHTML="<tr><td colspan='11' style='text-align:center;padding:30px;color:#5a566a'>Yukleniyor...</td></tr>";
  var q=_SB+"/rest/v1/calls?agent_name=eq.Ayse";
  q+="&select=id,skor,ilgi_seviyesi,outcome,assigned_to,assigned_name,satis_durumu,summary,itiraz,takip_notu,personel_notu,etiket,vapi_call_id,duration_seconds,customers(full_name,phone),created_at";
  q+="&limit="+_ps+"&offset="+((_p-1)*_ps)+"&order="+_srt;
  if(_flt.ilgi&&_flt.ilgi!=="all")q+="&ilgi_seviyesi=eq."+_flt.ilgi;
  if(_flt.skor)q+="&skor=gte."+_flt.skor;
  if(_flt.sd&&_flt.sd!=="all")q+="&satis_durumu=eq."+_flt.sd;
  if(_flt.asgn==="yes")q+="&assigned_to=not.is.null";
  else if(_flt.asgn==="no")q+="&assigned_to=is.null";
  fetch(q,{headers:_SH})
    .then(function(r){return r.json();})
    .catch(function(){return[];})
    .then(function(rows){_dat=rows||[];_renderAM();});
}

function _renderAM(){
  var tb=document.getElementById("am-tb");
  if(!tb)return;
  if(!_dat.length){
    tb.innerHTML="<tr><td colspan='11' style='text-align:center;padding:40px;color:#5a566a'>Sonuc bulunamadi</td></tr>";
    return;
  }
  var html="";
  for(var i=0;i<_dat.length;i++){
    var c=_dat[i];
    var sk=c.skor||0;
    var bp=sk>0?(sk*10)+"%":"-";
    var bc=sk>=7?"#22c55e":sk>=4?"#C9A96E":"#ef4444";
    var nm=(c.customers&&c.customers.full_name||"?").replace(/[<>"&]/g,"");
    var ph=(c.customers&&c.customers.phone||"").replace(/[^0-9+]/g,"");
    var sm=c.summary?c.summary.substring(0,55)+(c.summary.length>55?"...":""):"-";
    var chk=_sel.has(c.id)?"checked":"";
    var et=c.etiket?"<span style='background:rgba(201,169,110,.15);color:#C9A96E;border-radius:3px;padding:1px 5px;font-size:10px;margin-left:4px'>"+c.etiket+"</span>":"";
    var tel=ph?"<a href='tel:+"+ph+"' style='background:#21212e;border:1px solid rgba(34,197,94,.3);border-radius:5px;padding:4px 10px;font-size:11px;text-decoration:none;color:#22c55e;font-weight:600'>Ara</a>":"-";
    html+="<tr style='border-bottom:1px solid rgba(255,255,255,.04)'>";
    html+="<td style='padding:6px 10px;text-align:center'>";
    html+="<input type='checkbox' class='am-ck' data-id='"+c.id+"' "+chk;
    html+=" onchange='_selTog(\""+c.id+"\")' style='accent-color:#C9A96E;width:14px;height:14px'></td>";
    html+="<td style='padding:6px 10px'>";
    html+="<span onclick='_detay(\""+c.id+"\")' style='color:#f0ede8;font-weight:600;cursor:pointer'>"+nm+"</span>"+et+"</td>";
    html+="<td style='padding:6px 10px;font-size:11px;color:#5a566a'>"+(ph||"-")+"</td>";
    html+="<td style='padding:6px 10px;text-align:center;font-weight:700;color:"+bc+"'>"+bp+"</td>";
    html+="<td style='padding:6px;text-align:center'>"+_ilgi(c.ilgi_seviyesi||"")+"</td>";
    html+="<td style='padding:6px 4px;text-align:center'>"+_sdB(c.satis_durumu||"yeni")+"</td>";
    html+="<td style='padding:6px 10px;font-size:11px;color:#a8a4b0;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap'>"+sm+"</td>";
    html+="<td style='padding:6px 10px;font-size:11px;color:#5a566a'>"+(c.assigned_name||"-")+"</td>";
    html+="<td style='padding:6px 10px;font-size:10px;color:#5a566a'>"+(c.outcome||"-").substring(0,14)+"</td>";
    html+="<td style='padding:6px;text-align:center'>"+tel+"</td>";
    html+="<td style='padding:6px 4px;text-align:center'>";
    html+="<button onclick='_detay(\""+c.id+"\")' style='background:#21212e;border:1px solid rgba(201,169,110,.2);border-radius:5px;padding:3px 8px;font-size:10px;color:#C9A96E;cursor:pointer'>Detay</button></td>";
    html+="</tr>";
  }
  tb.innerHTML=html;
  _pager(_dat.length);
  _selBar();
}

function _pager(tot){
  var el=document.getElementById("am-pager");
  if(!el)return;
  var pages=Math.max(1,Math.ceil(tot/_ps));
  var s=Math.max(1,_p-2);
  var e=Math.min(pages,s+4);
  if(e-s<4)s=Math.max(1,e-4);
  var b="<span style='color:#5a566a;font-size:12px;margin-right:8px'>"+tot+" kayit</span>";
  for(var i=s;i<=e;i++){
    var st=i===_p?"background:#C9A96E;color:#000;font-weight:700":"background:#21212e;color:#a8a4b0";
    b+="<button onclick='_goPg("+i+")' style='"+st+";border:1px solid rgba(255,255,255,.08);border-radius:5px;padding:4px 8px;cursor:pointer;font-size:12px;margin:2px'>"+i+"</button>";
  }
  b+="<span style='color:#5a566a;font-size:12px;margin-left:8px'>Sayfa "+_p+"/"+pages+"</span>";
  el.innerHTML=b;
}

function _selBar(){
  var bar=document.getElementById("am-sbar");
  if(!bar)return;
  bar.style.display=_sel.size?"flex":"none";
  var cnt=document.getElementById("am-scnt");
  if(cnt)cnt.textContent=_sel.size+" secildi";
}

function _goPg(n){_p=n;_loadAM();}

function _selTog(id){
  if(_sel.has(id))_sel.delete(id);
  else _sel.add(id);
  _selBar();
}

function _selAll(v){
  document.querySelectorAll(".am-ck").forEach(function(cb){
    cb.checked=v;
    if(v)_sel.add(cb.dataset.id);
    else _sel.delete(cb.dataset.id);
  });
  _selBar();
}

function _amFil(){
  var fi=document.getElementById("am-filgi");
  var fs=document.getElementById("am-fskor");
  var fd=document.getElementById("am-fsd");
  var fa=document.getElementById("am-fasgn");
  _flt={ilgi:fi?fi.value:"",skor:fs?fs.value:"",sd:fd?fd.value:"",asgn:fa?fa.value:""};
  _p=1;_loadAM();
}

function _amSrt(col){
  _srt=(_srt.startsWith(col)&&_srt.includes("desc"))?col+".asc.nullslast":col+".desc.nullslast";
  _loadAM();
}

function _amPS(v){_ps=parseInt(v);_p=1;_loadAM();}

function _amExp(){
  var ids=Array.from(_sel);
  var rows=ids.length?_dat.filter(function(c){return ids.includes(c.id);}):_dat;
  var csv="\uFEFFAd Soyad,Telefon,Skor,Ilgi,Durum,Ozet,Personel,Tarih\n";
  rows.forEach(function(c){
    var nm=(c.customers&&c.customers.full_name||"").replace(/,/g," ");
    var ph=c.customers&&c.customers.phone||"";
    var sm=(c.summary||"").replace(/"/g,"'").substring(0,100);
    csv+=nm+","+ph+","+(c.skor||0)+","+(c.ilgi_seviyesi||"")+","+(c.satis_durumu||"")+",\""+sm+"\","+(c.assigned_name||"")+","+(c.created_at||"").substring(0,10)+"\n";
  });
  var a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
  a.download="aramalar_"+(new Date().toISOString().substring(0,10))+".csv";
  a.click();
  _toast(rows.length+" satir export edildi");
}

function _topluAta(){
  var ids=Array.from(_sel);
  if(!ids.length){_toast("Once kayit secin","w");return;}
  var ov=document.createElement("div");
  ov.id="ta-ov";
  ov.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:9000;display:flex;align-items:center;justify-content:center";
  var opts="";
  _PER.forEach(function(p){
    opts+="<option value='"+p.id+"|"+p.ad+"'>"+p.ad+"</option>";
  });
  ov.innerHTML="<div style='background:#1a1a24;border:1px solid rgba(201,169,110,.3);border-radius:14px;padding:28px;width:360px;max-width:90vw'>"
    +"<h3 style='color:#C9A96E;margin:0 0 18px;font-size:16px'>Toplu Ata ("+ids.length+" kayit)</h3>"
    +"<select id='ta-per' style='width:100%;background:#12121a;border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:10px;color:#f0ede8;font-size:14px;margin-bottom:16px'>"
    +"<option value=''>-- Personel Sec --</option>"+opts+"</select>"
    +"<div style='display:flex;gap:10px'>"
    +"<button onclick='_taOK()' style='flex:1;background:#C9A96E;color:#000;border:none;border-radius:8px;padding:10px;font-size:14px;font-weight:700;cursor:pointer'>Ata</button>"
    +"<button onclick='document.getElementById(\"ta-ov\").remove()' style='flex:1;background:#21212e;color:#a8a4b0;border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:10px;font-size:14px;cursor:pointer'>Iptal</button>"
    +"</div></div>";
  document.body.appendChild(ov);
}

function _taOK(){
  var sel=document.getElementById("ta-per");
  if(!sel||!sel.value){_toast("Personel secin","w");return;}
  var parts=sel.value.split("|");
  var pid=parts[0],pad=parts[1];
  var ids=Array.from(_sel);
  var done=0;
  ids.forEach(function(id){
    fetch(_SB+"/rest/v1/calls?id=eq."+id,{
      method:"PATCH",headers:_SC,
      body:JSON.stringify({assigned_to:pid,assigned_name:pad})
    }).then(function(){
      done++;
      if(done===ids.length){
        var ov=document.getElementById("ta-ov");
        if(ov)ov.remove();
        _sel.clear();
        _toast(ids.length+" kayit "+pad+" atandi");
        _loadAM();
      }
    });
  });
}

function _detay(id){
  var c=_dat.find(function(x){return x.id===id;});
  if(!c)return;
  var nm=(c.customers&&c.customers.full_name||"?").replace(/[<>"&]/g,"");
  var ph=(c.customers&&c.customers.phone||"").replace(/[^0-9+]/g,"");
  var sdOpts=["yeni","araniyor","ilgileniyor","teklif","satildi","vazgecti"];
  var sdLabels={yeni:"Yeni",araniyor:"Araniyor",ilgileniyor:"Ilgileniyor",teklif:"Teklif",satildi:"SATILDI",vazgecti:"Vazgecti"};
  var sdHtml="";
  sdOpts.forEach(function(v){
    var sel=(c.satis_durumu||"yeni")===v?"selected":"";
    sdHtml+="<option value='"+v+"' "+sel+">"+sdLabels[v]+"</option>";
  });
  var etList=["","Sicak","VIP","Geri Ara","Yuksek Butce","Acil"];
  var etHtml=etList.map(function(e){
    return"<option value='"+e+"'"+(c.etiket===e?" selected":"")+">"+( e||"-- Etiket --")+"</option>";
  }).join("");
  var vid=c.vapi_call_id||"";
  var sid=id.substring(0,8);
  var sesHtml=vid.length>10?"<div id='sbx"+sid+"' style='padding:6px 0 2px'><button id='sb"+sid+"' onclick='_sesAc(\""+id+"\",\""+vid+"\")'style='background:rgba(34,197,94,.15);border:1px solid rgba(34,197,94,.3);border-radius:6px;padding:5px 14px;color:#22c55e;cursor:pointer;font-size:12px;font-weight:600'>▶ Sesi Dinle</button></div>":"";
  var telBtn=ph?"<a href='tel:+"+ph+"' style='flex:1;background:#21212e;border:1px solid rgba(34,197,94,.3);border-radius:8px;padding:10px;font-size:14px;text-decoration:none;color:#22c55e;font-weight:600;text-align:center'>Ara</a>":"";
  var ov=document.createElement("div");
  ov.id="det-ov";
  ov.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:9000;display:flex;align-items:center;justify-content:center;padding:16px";
  ov.innerHTML="<div style='background:#1a1a24;border:1px solid rgba(201,169,110,.25);border-radius:14px;padding:24px;width:560px;max-width:95vw;max-height:85vh;overflow-y:auto'>"
    +"<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:18px'>"
    +"<h3 style='color:#C9A96E;margin:0;font-size:17px'>"+nm+"</h3>"
    +"<button onclick='document.getElementById(\"det-ov\").remove()' style='background:none;border:none;color:#5a566a;font-size:22px;cursor:pointer;line-height:1'>&times;</button>"
    +"</div>"
    +"<div style='background:#12121a;border-radius:8px;padding:14px;margin-bottom:14px;font-size:13px;color:#a8a4b0;line-height:1.6'>"
    +sesHtml+"<b style='color:#C9A96E'>Ozet:</b> "+(c.summary||"-")+"<br>"
    +"<b style='color:#C9A96E'>Itiraz:</b> "+(c.itiraz||"-")+"<br>"
    +"<b style='color:#C9A96E'>Takip:</b> "+(c.takip_notu||"-")+"</div>"
    +"<div style='display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px'>"
    +"<div><label style='color:#5a566a;font-size:11px'>Satis Durumu</label>"
    +"<select id='det-sd' style='width:100%;background:#12121a;border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:8px;color:#f0ede8;font-size:13px;margin-top:4px'>"+sdHtml+"</select></div>"
    +"<div><label style='color:#5a566a;font-size:11px'>Etiket</label>"
    +"<select id='det-et' style='width:100%;background:#12121a;border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:8px;color:#f0ede8;font-size:13px;margin-top:4px'>"+etHtml+"</select></div>"
    +"</div>"
    +"<div style='margin-bottom:14px'><label style='color:#5a566a;font-size:11px'>Personel Notu</label>"
    +"<textarea id='det-pn' style='width:100%;background:#12121a;border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:8px;color:#f0ede8;font-size:13px;margin-top:4px;resize:vertical;min-height:70px;box-sizing:border-box' placeholder='Not ekle...'>"+(c.personel_notu||"")+"</textarea></div>"
    +"<div style='display:flex;gap:10px'>"
    +"<button onclick='_kaydet(\""+id+"\")' style='flex:1;background:#C9A96E;color:#000;border:none;border-radius:8px;padding:10px;font-size:14px;font-weight:700;cursor:pointer'>Kaydet</button>"
    +telBtn
    +"<button onclick='document.getElementById(\"det-ov\").remove()' style='flex:1;background:#21212e;color:#a8a4b0;border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:10px;font-size:14px;cursor:pointer'>Kapat</button>"
    +"</div></div>";
  document.body.appendChild(ov);
}

function _sesAc(callId,vid){
  var sid=callId.substring(0,8);
  var btn=document.getElementById("sb"+sid);
  var box=document.getElementById("sbx"+sid);
  if(!box)return;
  var ex=document.getElementById("spl"+sid);
  if(ex){ex.remove();if(btn)btn.textContent="▶ Sesi Dinle";return;}
  if(btn){btn.textContent="...";btn.disabled=true;}
  fetch("https://api.vapi.ai/call/"+vid,{headers:{Authorization:"Bearer 74b7b21d-f286-4a56-b1ac-2bf37a91d088"}})
  .then(function(r){return r.json();}).then(function(v){
    if(btn){btn.disabled=false;btn.textContent="⏹ Kapat";}
    var url=v.recordingUrl||(v.artifact&&v.artifact.recordingUrl)||"";
    if(!url){box.insertAdjacentHTML("beforeend","<span style='color:#ef4444;font-size:11px;margin-left:6px'>Ses kaydi yok</span>");return;}
    var a=document.createElement("audio");
    a.id="spl"+sid;a.controls=true;a.src=url;
    a.style.cssText="max-width:300px;height:32px;margin-left:6px;vertical-align:middle";
    box.appendChild(a);a.play().catch(function(){});
  }).catch(function(e){
    if(btn){btn.disabled=false;btn.textContent="▶ Sesi Dinle";}
  });
}
function _kaydet(id){
  var sd=document.getElementById("det-sd");
  var et=document.getElementById("det-et");
  var pn=document.getElementById("det-pn");
  if(!sd)return;
  fetch(_SB+"/rest/v1/calls?id=eq."+id,{
    method:"PATCH",headers:_SC,
    body:JSON.stringify({satis_durumu:sd.value,etiket:et?et.value:"",personel_notu:pn?pn.value:""})
  }).then(function(r){
    if(r.ok){
      _toast("Kaydedildi");
      var ov=document.getElementById("det-ov");
      if(ov)ov.remove();
      _loadAM();
    }else{
      _toast("Hata olustu","e");
    }
  });
}

function showAramaMerkezi(){
  document.querySelectorAll('[id^="pg-"]').forEach(function(p){p.style.display="none";});

  var main=document.querySelector(".main")||document.getElementById("main-content");
  if(!main)return;
  _p=1;_sel.clear();_flt={};
  main.innerHTML="<div style='padding:20px'>"
    +"<div style='display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:20px'>"
    +"<h2 style='color:#C9A96E;margin:0;font-size:18px'>Arama Merkezi</h2>"
    +"<div style='display:flex;flex-wrap:wrap;gap:8px'>"
    +"<select id='am-filgi' onchange='_amFil()' style='background:#21212e;border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:6px 10px;color:#a8a4b0;font-size:12px'>"
    +"<option value='all'>Tum Ilgi</option><option value='yuksek'>Yuksek</option><option value='orta'>Orta</option><option value='dusuk'>Dusuk</option></select>"
    +"<input id='am-fskor' type='number' min='0' max='10' placeholder='Min Skor' onchange='_amFil()' style='background:#21212e;border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:6px 10px;color:#a8a4b0;font-size:12px;width:90px'>"
    +"<select id='am-fsd' onchange='_amFil()' style='background:#21212e;border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:6px 10px;color:#a8a4b0;font-size:12px'>"
    +"<option value='all'>Tum Durum</option><option value='yeni'>Yeni</option><option value='araniyor'>Araniyor</option>"
    +"<option value='ilgileniyor'>Ilgileniyor</option><option value='teklif'>Teklif</option>"
    +"<option value='satildi'>Satildi</option><option value='vazgecti'>Vazgecti</option></select>"
    +"<select id='am-fasgn' onchange='_amFil()' style='background:#21212e;border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:6px 10px;color:#a8a4b0;font-size:12px'>"
    +"<option value='all'>Tumu</option><option value='no'>Atanmamis</option><option value='yes'>Atanmis</option></select>"
    +"<select onchange='_amPS(this.value)' style='background:#21212e;border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:6px 10px;color:#a8a4b0;font-size:12px'>"
    +"<option value='100'>100</option><option value='200'>200</option><option value='500'>500</option></select>"
    +"</div></div>"
    +"<div id='am-sbar' style='display:none;background:rgba(201,169,110,.08);border:1px solid rgba(201,169,110,.2);border-radius:8px;padding:10px 16px;margin-bottom:14px;gap:10px;align-items:center'>"
    +"<span id='am-scnt' style='color:#C9A96E;font-weight:700;font-size:13px'></span>"
    +"<button onclick='_selAll(true)' style='background:#21212e;border:1px solid rgba(255,255,255,.1);border-radius:5px;padding:5px 12px;color:#a8a4b0;cursor:pointer;font-size:12px'>Tumunu Sec</button>"
    +"<button onclick='_selAll(false)' style='background:#21212e;border:1px solid rgba(255,255,255,.1);border-radius:5px;padding:5px 12px;color:#a8a4b0;cursor:pointer;font-size:12px'>Secimi Kaldir</button>"
    +"<button onclick='_topluAta()' style='background:#C9A96E;color:#000;border:none;border-radius:5px;padding:5px 14px;font-weight:700;cursor:pointer;font-size:12px'>Toplu Ata</button>"
    +"<button onclick='_amExp()' style='background:#21212e;border:1px solid rgba(34,197,94,.3);border-radius:5px;padding:5px 12px;color:#22c55e;cursor:pointer;font-size:12px'>Excel Export</button>"
    +"</div>"
    +"<div style='overflow-x:auto'><table style='width:100%;border-collapse:collapse'>"
    +"<thead><tr style='background:#12121a'>"
    +"<th style='padding:10px;text-align:center;color:#5a566a;font-size:11px;width:36px'><input type='checkbox' onchange='_selAll(this.checked)' style='accent-color:#C9A96E'></th>"
    +"<th style='padding:10px;color:#5a566a;font-size:11px;cursor:pointer;text-align:left' onclick='_amSrt(\"customers.full_name\")'>Ad Soyad</th>"
    +"<th style='padding:10px;color:#5a566a;font-size:11px;text-align:left'>Telefon</th>"
    +"<th style='padding:10px;color:#5a566a;font-size:11px;cursor:pointer;text-align:center' onclick='_amSrt(\"skor\")'>Skor</th>"
    +"<th style='padding:10px;color:#5a566a;font-size:11px;text-align:center'>Ilgi</th>"
    +"<th style='padding:10px;color:#5a566a;font-size:11px;cursor:pointer;text-align:center' onclick='_amSrt(\"satis_durumu\")'>Durum</th>"
    +"<th style='padding:10px;color:#5a566a;font-size:11px;text-align:left'>Ozet</th>"
    +"<th style='padding:10px;color:#5a566a;font-size:11px;text-align:left'>Personel</th>"
    +"<th style='padding:10px;color:#5a566a;font-size:11px;text-align:left'>Sonuc</th>"
    +"<th style='padding:10px;color:#5a566a;font-size:11px;text-align:center'>Ara</th>"
    +"<th style='padding:10px;color:#5a566a;font-size:11px;text-align:center'>Detay</th>"
    +"</tr></thead>"
    +"<tbody id='am-tb'>"
    +"<tr><td colspan='11' style='text-align:center;padding:30px;color:#5a566a'>Yukleniyor...</td></tr>"
    +"</tbody></table></div>"
    +"<div id='am-pager' style='display:flex;flex-wrap:wrap;align-items:center;margin-top:14px;gap:4px'></div>"
    +"</div>";
  _loadAM();
}

function showSatisTakip(){
  document.querySelectorAll('[id^="pg-"]').forEach(function(p){p.style.display="none";});

  var main=document.querySelector(".main")||document.getElementById("main-content");
  if(!main)return;
  var perOpts=_PER.map(function(p){
    return"<option value='"+p.id+"'>"+p.ad+"</option>";
  }).join("");
  main.innerHTML="<div style='padding:20px'>"
    +"<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:20px'>"
    +"<h2 style='color:#C9A96E;margin:0;font-size:18px'>Satis Takip</h2>"
    +"<select id='st-per' onchange='_loadST()' style='background:#21212e;border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:8px 12px;color:#a8a4b0;font-size:13px'>"
    +"<option value=''>Tum Personel</option>"+perOpts+"</select></div>"
    +"<div id='st-cards' style='display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px'>"
    +"<div style='text-align:center;padding:40px;color:#5a566a;grid-column:1/-1'>Yukleniyor...</div>"
    +"</div></div>";
  _loadST();
}

function _loadST(){
  var sel=document.getElementById("st-per");
  var pid=sel?sel.value:"";
  var q=_SB+"/rest/v1/calls?agent_name=eq.Ayse&assigned_to=not.is.null";
  q+="&select=id,skor,satis_durumu,summary,assigned_name,personel_notu,etiket,customers(full_name,phone)";
  q+="&order=skor.desc.nullslast&limit=200";
  if(pid)q=q.replace("&assigned_to=not.is.null","&assigned_to=eq."+pid);
  fetch(q,{headers:_SH})
    .then(function(r){return r.json();})
    .catch(function(){return[];})
    .then(function(rows){
      var cards=document.getElementById("st-cards");
      if(!cards)return;
      if(!rows.length){
        cards.innerHTML="<div style='text-align:center;padding:40px;color:#5a566a;grid-column:1/-1'>Kayit bulunamadi</div>";
        return;
      }
      var html="";
      rows.forEach(function(c){
        var nm=(c.customers&&c.customers.full_name||"?").replace(/[<>"&]/g,"");
        var ph=(c.customers&&c.customers.phone||"").replace(/[^0-9+]/g,"");
        var sk=c.skor||0;
        var bc=sk>=7?"#22c55e":sk>=4?"#C9A96E":"#ef4444";
        var telBtn=ph?"<a href='tel:+"+ph+"' style='flex:1;background:#21212e;border:1px solid rgba(34,197,94,.3);border-radius:6px;padding:7px;text-align:center;text-decoration:none;color:#22c55e;font-size:12px;font-weight:600'>Ara</a>":"";
        var notDiv=c.personel_notu?"<div style='background:rgba(201,169,110,.08);border-radius:6px;padding:8px;font-size:12px;color:#C9A96E;margin-bottom:10px'>Not: "+c.personel_notu+"</div>":"";
        html+="<div style='background:#12121a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:16px'>"
          +"<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:8px'>"
          +"<span style='color:#f0ede8;font-weight:700;font-size:14px'>"+nm+"</span>"
          +"<span style='color:"+bc+";font-weight:700;font-size:16px'>%"+(sk*10)+"</span></div>"
          +"<div style='font-size:11px;color:#5a566a;margin-bottom:8px'>"+_sdB(c.satis_durumu||"yeni")+" "+(c.assigned_name||"")+"</div>"
          +"<div style='font-size:12px;color:#a8a4b0;margin-bottom:10px;line-height:1.5'>"+(c.summary||"-").substring(0,100)+(c.summary&&c.summary.length>100?"...":"")+"</div>"
          +notDiv
          +"<div style='display:flex;gap:8px'>"
          +telBtn
          +"<button onclick='_detay(\""+c.id+"\")' style='flex:1;background:#21212e;border:1px solid rgba(201,169,110,.2);border-radius:6px;padding:7px;color:#C9A96E;cursor:pointer;font-size:12px;font-weight:600'>Detay / Guncelle</button>"
          +"</div></div>";
      });
      cards.innerHTML=html;
    });
}

function _crmInit(){
  if(document.getElementById("am-btn"))return;
  var main=document.querySelector(".main")||document.getElementById("main-content");
  if(!main)return;
  var bar=document.createElement("div");
  bar.id="crm-bar";
  bar.style.cssText="display:flex;gap:10px;padding:10px 20px;background:rgba(201,169,110,.05);border-bottom:1px solid rgba(201,169,110,.15);flex-wrap:wrap";
  var b1=document.createElement("button");
  b1.id="am-btn";
  b1.innerHTML="&#128203; Arama Merkezi";
  b1.onclick=showAramaMerkezi;
  b1.style.cssText="background:rgba(201,169,110,.15);border:1px solid rgba(201,169,110,.3);border-radius:7px;padding:8px 16px;color:#C9A96E;cursor:pointer;font-size:13px;font-weight:600";
  var b2=document.createElement("button");
  b2.id="st-btn";
  b2.innerHTML="&#127919; Satis Takip";
  b2.onclick=showSatisTakip;
  b2.style.cssText="background:rgba(168,85,247,.15);border:1px solid rgba(168,85,247,.3);border-radius:7px;padding:8px 16px;color:#a855f7;cursor:pointer;font-size:13px;font-weight:600";
  bar.appendChild(b1);
  bar.appendChild(b2);
  main.insertBefore(bar,main.firstChild);
  var _origLP2=window.loadPage;
  window.loadPage=function(pg){
    // AM/ST icerigi temizle
    var _main=document.querySelector(".main");if(_main)_main.innerHTML="";
    // pg- sayfalarini geri goster
    document.querySelectorAll('[id^="pg-"]').forEach(function(p){p.style.display="";});
    if(_origLP2)_origLP2(pg);
  };
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",_crmInit);
}else{
  setTimeout(_crmInit,800);
}
