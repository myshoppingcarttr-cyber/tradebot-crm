(function(){
var SB="https://muwynsxukmxjquoqcbac.supabase.co",K="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11d3luc3h1a214anF1b3FjYmFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjExMzQwMCwiZXhwIjoyMDkxNjg5NDAwfQ.33AsVo1mIeNHznTKnr6IUjVTLP_puNeNFJMS8-GsO30";
var H={apikey:K,Authorization:"Bearer "+K},HC=Object.assign({},H,{"Content-Type":"application/json"});
var _p=1,_ps=100,_f={},_s="skor.desc.nullslast",_sel=new Set(),_d=[];

function T(m,t){var e=document.createElement("div");e.style.cssText="position:fixed;top:20px;right:20px;background:#1a1a24;border:2px solid "+(t==="e"?"#ef4444":t==="w"?"#f59e0b":"#22c55e")+";border-radius:10px;padding:12px 18px;z-index:99999;font-size:13px;color:#f0ede8;box-shadow:0 8px 24px rgba(0,0,0,.5);max-width:300px";e.textContent=m;document.body.appendChild(e);setTimeout(function(){e.remove();},3000);}

function IB(v){if(v==="yuksek")return"<span style='background:rgba(34,197,94,.2);color:#22c55e;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700'>Y\u00fcksek</span>";if(v==="orta")return"<span style='background:rgba(251,191,36,.2);color:#fbbf24;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700'>Orta</span>";if(v==="dusuk")return"<span style='background:rgba(239,68,68,.15);color:#ef4444;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700'>D\u00fc\u015f\u00fck</span>";return"<span style='color:#5a566a'>&#8212;</span>";}

function DB(v){var m={yeni:"rgba(96,165,250,.2)|#60a5fa|Yeni",araniyor:"rgba(251,191,36,.2)|#fbbf24|Aran\u0131yor",ilgileniyor:"rgba(34,197,94,.2)|#22c55e|\u0130lgileniyor",teklif:"rgba(201,169,110,.2)|#C9A96E|Teklif",satildi:"rgba(168,85,247,.2)|#a855f7|SAT\u0130LD\u0130",vazgecti:"rgba(239,68,68,.15)|#ef4444|Vazge\u00e7ti"};var e=(m[v]||m.yeni).split("|");return"<span style='background:"+e[0]+";color:"+e[1]+";padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700'>"+e[2]+"</span>";}

function LD(){
  var tb=document.getElementById("am-tb");
  if(tb)tb.innerHTML="<tr><td colspan='11' style='text-align:center;padding:30px;color:#5a566a'>Y\u00fckleniyor...</td></tr>";
  var q=SB+"/rest/v1/calls?agent_name=eq.Ayse&select=id,skor,ilgi_seviyesi,outcome,assigned_to,assigned_name,satis_durumu,summary,itiraz,takip_notu,personel_notu,etiket,customers(full_name,phone),created_at&limit="+_ps+"&offset="+((_p-1)*_ps)+"&order="+_s;
  if(_f.ilgi&&_f.ilgi!=="all")q+="&ilgi_seviyesi=eq."+_f.ilgi;
  if(_f.skor)q+="&skor=gte."+_f.skor;
  if(_f.sd&&_f.sd!=="all")q+="&satis_durumu=eq."+_f.sd;
  if(_f.asgn==="yes")q+="&assigned_to=not.is.null";
  if(_f.asgn==="no")q+="&assigned_to=is.null";
  var cq=SB+"/rest/v1/calls?agent_name=eq.Ayse&select=id";
  if(_f.ilgi&&_f.ilgi!=="all")cq+="&ilgi_seviyesi=eq."+_f.ilgi;
  if(_f.skor)cq+="&skor=gte."+_f.skor;
  if(_f.sd&&_f.sd!=="all")cq+="&satis_durumu=eq."+_f.sd;
  if(_f.asgn==="yes")cq+="&assigned_to=not.is.null";
  if(_f.asgn==="no")cq+="&assigned_to=is.null";
  Promise.all([
    fetch(q,{headers:H}).then(function(r){return r.json();}).catch(function(){return[];}),
    fetch(cq,{headers:Object.assign({},H,{"Prefer":"count=exact"}),method:"HEAD"}).then(function(r){return r.headers.get("content-range");}).catch(function(){return null;})
  ]).then(function(rs){_d=rs[0]||[];RD(rs[1]?parseInt(rs[1].split("/")[1]||0):0);});
}

function RD(tot){
  var tb=document.getElementById("am-tb");if(!tb)return;
  if(!_d.length){tb.innerHTML="<tr><td colspan='11' style='text-align:center;padding:40px;color:#5a566a'>Sonu\u00e7 bulunamad\u0131</td></tr>";PG(tot);return;}
  var html="";
  for(var i=0;i<_d.length;i++){
    var c=_d[i];
    var sk=c.skor||0,bp=sk>0?(sk*10)+"%":"&#8212;",bc=sk>=7?"#22c55e":sk>=4?"#C9A96E":"#ef4444";
    var nm=(c.customers&&c.customers.full_name||"?").replace(/["'<>]/g,"");
    var ph=(c.customers&&c.customers.phone||"").replace(/[^0-9+]/g,"");
    var sm=c.summary?c.summary.substring(0,55)+(c.summary.length>55?"\u2026":""):"&#8212;";
    html+="<tr data-id='"+c.id+"' style='border-bottom:1px solid rgba(255,255,255,.04)'>";
    html+="<td style='padding:6px 10px;text-align:center'><input type='checkbox' class='am-ck' data-id='"+c.id+"' "+((_sel.has(c.id))?"checked":"")+" onchange='_amTog(\""+c.id+"\")' style='accent-color:#C9A96E;width:14px;height:14px'></td>";
    html+="<td style='padding:6px 10px'><span onclick='_amDet(\""+c.id+"\",\""+nm+"\")' style='color:#f0ede8;font-weight:600;cursor:pointer;font-size:13px'>"+nm+"</span>"+(c.etiket?"<span style='background:rgba(201,169,110,.15);color:#C9A96E;border-radius:3px;padding:1px 5px;font-size:10px;margin-left:4px'>"+c.etiket+"</span>":"")+(c.personel_notu?"<span style='color:#60a5fa;font-size:10px;margin-left:3px'>&#128221;</span>":"")+"</td>";
    html+="<td style='padding:6px 10px;font-size:11px;color:#5a566a'>"+(ph||"&#8212;")+"</td>";
    html+="<td style='padding:6px 10px;text-align:center;font-size:15px;font-weight:700;color:"+bc+"'>"+(sk>0?bp:"&#8212;")+"</td>";
    html+="<td style='padding:6px 6px;text-align:center'>"+IB(c.ilgi_seviyesi||"")+"</td>";
    html+="<td style='padding:6px 4px;text-align:center'>"+DB(c.satis_durumu||"yeni")+"</td>";
    html+="<td style='padding:6px 10px;font-size:11px;color:#a8a4b0;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap' title='"+sm+"'>"+sm+"</td>";
    html+="<td style='padding:6px 10px;font-size:11px;color:#5a566a'>"+(c.assigned_name||"&#8212;")+"</td>";
    html+="<td style='padding:6px 10px;font-size:10px;color:#5a566a'>"+(c.outcome||"&#8212;").substring(0,14)+"</td>";
    html+="<td style='padding:6px 6px;text-align:center'>"+(ph?"<a href='tel:+"+ph+"' style='background:#21212e;border:1px solid rgba(34,197,94,.3);border-radius:5px;padding:4px 10px;font-size:11px;text-decoration:none;color:#22c55e;font-weight:600'>&#128222; Ara</a>":"&#8212;")+"</td>";
    html+="<td style='padding:6px 4px;text-align:center'><button onclick='_amDet(\""+c.id+"\",\""+nm+"\")' style='background:#21212e;border:1px solid rgba(201,169,110,.2);border-radius:5px;padding:3px 8px;font-size:10px;color:#C9A96E;cursor:pointer'>Detay</button></td>";
    html+="</tr>";
  }
  tb.innerHTML=html;PG(tot);SLB();
}

function PG(tot){var el=document.getElementById("am-pager");if(!el)return;var pages=Math.max(1,Math.ceil(tot/_ps)),s=Math.max(1,_p-2),e2=Math.min(pages,s+4);if(e2-s<4)s=Math.max(1,e2-4);var b="<span style='color:#5a566a;font-size:12px;margin-right:8px'>"+tot+" kay\u0131t</span>";if(s>1)b+="<button onclick='_amPg(1)' style='background:#21212e;color:#a8a4b0;border:1px solid rgba(255,255,255,.08);border-radius:5px;padding:4px 8px;cursor:pointer;font-size:12px;margin:2px'>1</button><span style='color:#5a566a'>&#8230;</span>";for(var i=s;i<=e2;i++)b+="<button onclick='_amPg("+i+")' style='"+(i===_p?"background:#C9A96E;color:#000;font-weight:700":"background:#21212e;color:#a8a4b0")+";border:1px solid rgba(255,255,255,.08);border-radius:5px;padding:4px 8px;cursor:pointer;font-size:12px;margin:2px'>"+i+"</button>";if(e2<pages)b+="<span style='color:#5a566a'>&#8230;</span><button onclick='_amPg("+pages+")' style='background:#21212e;color:#a8a4b0;border:1px solid rgba(255,255,255,.08);border-radius:5px;padding:4px 8px;cursor:pointer;font-size:12px;margin:2px'>"+pages+"</button>";el.innerHTML=b+"<span style='color:#5a566a;font-size:12px;margin-left:8px'>Sayfa "+_p+"/"+pages+"</span>";}
function SLB(){var bar=document.getElementById("am-sbar");if(!bar)return;bar.style.display=_sel.size?"flex":"none";var cnt=document.getElementById("am-scnt");if(cnt)cnt.textContent=_sel.size+" se\u00e7ildi";}

window._amPg=function(p){_p=p;LD();};
window._amTog=function(id){_sel.has(id)?_sel.delete(id):_sel.add(id);SLB();};
window._amSA=function(v){document.querySelectorAll(".am-ck").forEach(function(c){c.checked=v;v?_sel.add(c.dataset.id):_sel.delete(c.dataset.id);});SLB();};
window._amFil=function(){_f={ilgi:document.getElementById("am-filgi")&&document.getElementById("am-filgi").value,skor:document.getElementById("am-fskor")&&document.getElementById("am-fskor").value,sd:document.getElementById("am-fsd")&&document.getElementById("am-fsd").value,asgn:document.getElementById("am-fasgn")&&document.getElementById("am-fasgn").value};_p=1;LD();};
window._amSrt=function(col){_s=_s.startsWith(col)&&_s.includes("desc")?col+".asc.nullslast":col+".desc.nullslast";LD();};
window._amPS=function(v){_ps=parseInt(v);_p=1;LD();};
window._amExp=function(){var ids=Array.from(_sel);var rows=ids.length?_d.filter(function(c){return ids.includes(c.id);}):_d;var csv="\uFEFFAd Soyad,Telefon,Skor,Ilgi,Durum,Ozet,Personel,Tarih\n";csv+=rows.map(function(c){return[(c.customers&&c.customers.full_name||""),(c.customers&&c.customers.phone||""),c.skor||0,c.ilgi_seviyesi||"",c.satis_durumu||"","\""+(c.summary||"").replace(/"/g,"''")+"\"",c.assigned_name||"",(c.created_at||"").substring(0,10)].join(",");}).join("\n");var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));a.download="aramalar_"+(new Date().toISOString().substring(0,10))+".csv";a.click();T((ids.length||rows.length)+" sat\u0131r export edildi");};

window._amAsgn=function(){
  if(!_sel.size){T("\u00d6nce sat\u0131r se\u00e7in!","w");return;}
  fetch(SB+"/rest/v1/users?select=id,full_name&order=full_name",{headers:H}).then(function(r){return r.json();}).then(function(ud){
    var m=document.createElement("div");m.id="am-am";m.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:9999;display:flex;align-items:center;justify-content:center";
    m.innerHTML="<div style='background:#1a1a24;border:1px solid rgba(201,169,110,.3);border-radius:14px;padding:24px;min-width:300px'><div style='font-size:15px;font-weight:700;color:#f0ede8;margin-bottom:14px'>"+_sel.size+" Aramay\u0131 Ata</div><select id='am-aus' style='width:100%;background:#21212e;color:#f0ede8;border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:10px;font-size:13px;margin-bottom:14px'><option value=''>-- Personel Se\u00e7 --</option>"+ud.map(function(u){return"<option value='"+u.id+"'>"+u.full_name+"</option>";}).join("")+"</select><div style='display:flex;gap:8px;justify-content:flex-end'><button onclick="document.getElementById('am-am').remove()" style='background:rgba(255,255,255,.08);color:#a8a4b0;border:none;border-radius:8px;padding:8px 16px;cursor:pointer'>\u0130ptal</button><button id='am-aok' style='background:#C9A96E;color:#000;border:none;border-radius:8px;padding:8px 16px;font-weight:700;cursor:pointer'>Ata</button></div></div>";
    document.body.appendChild(m);
    m.onclick=function(e){if(e.target===m)m.remove();};
    document.getElementById("am-aok").onclick=function(){
      var sel=document.getElementById("am-aus");var uid=sel.value,un=sel.selectedOptions[0]&&sel.selectedOptions[0].text;
      if(!uid){T("Personel se\u00e7in!","w");return;}
      var ids=Array.from(_sel);var done=0;
      var proc=function(i){if(i>=ids.length){m.remove();_sel.clear();T(done+" arama "+un+"'a atand\u0131");LD();return;}
        fetch(SB+"/rest/v1/calls?id=eq."+ids[i],{method:"PATCH",headers:HC,body:JSON.stringify({assigned_to:uid,assigned_name:un,satis_durumu:"yeni"})}).then(function(r){if(r.status===204)done++;proc(i+1);});
      };proc(0);
    };
  });
};

window._amUpdSD=function(cid,val){fetch(SB+"/rest/v1/calls?id=eq."+cid,{method:"PATCH",headers:HC,body:JSON.stringify({satis_durumu:val})}).then(function(){T(val==="satildi"?"\ud83c\udf89 SAT\u0130LD\u0130!":"Durum g\u00fcncellendi");LD();});};
window._amTag=function(cid,tag){var c=null;for(var i=0;i<_d.length;i++){if(_d[i].id===cid){c=_d[i];break;}}var nt=(c&&c.etiket===tag)?null:tag;fetch(SB+"/rest/v1/calls?id=eq."+cid,{method:"PATCH",headers:HC,body:JSON.stringify({etiket:nt})}).then(function(){T(nt?"Etiket: "+nt:"Etiket kald\u0131r\u0131ld\u0131");var dp=document.getElementById("am-dp");if(dp)dp.remove();LD();});};
window._amNote=function(cid){var n=document.getElementById("am-dpnote")&&document.getElementById("am-dpnote").value||"";fetch(SB+"/rest/v1/calls?id=eq."+cid,{method:"PATCH",headers:HC,body:JSON.stringify({personel_notu:n})}).then(function(){T("Not kaydedildi \u2713");});};

window._amDet=function(cid,cn){
  var old=document.getElementById("am-dp");if(old){old.remove();return;}
  var p=document.createElement("div");p.id="am-dp";
  p.style.cssText="position:fixed;right:0;top:0;width:430px;height:100vh;background:#13131a;border-left:1px solid rgba(255,255,255,.1);z-index:9998;display:flex;flex-direction:column;box-shadow:-6px 0 30px rgba(0,0,0,.6)";
  p.innerHTML="<div style='padding:12px 16px;background:#1a1a24;border-bottom:1px solid rgba(255,255,255,.08);display:flex;justify-content:space-between;align-items:center;flex-shrink:0'><span style='font-size:14px;font-weight:700;color:#f0ede8'>"+cn+"</span><button onclick="document.getElementById('am-dp').remove()" style='background:none;border:none;color:#5a566a;cursor:pointer;font-size:22px'>&#215;</button></div><div id='am-dpb' style='flex:1;overflow-y:auto;padding:14px'><div style='color:#5a566a;text-align:center;padding:40px'>Y\u00fckleniyor...</div></div>";
  document.body.appendChild(p);
  fetch(SB+"/rest/v1/calls?id=eq."+cid+"&select=*,customers(full_name,phone)",{headers:H}).then(function(r){return r.json();}).then(function(data){
    var c=data&&data[0];
    if(!c){fetch(SB+"/rest/v1/calls?agent_name=eq.Ayse&select=*,customers(full_name,phone)&order=created_at.desc&limit=200",{headers:H}).then(function(r){return r.json();}).then(function(all){var found=null;for(var i=0;i<all.length;i++){if(all[i].customers&&all[i].customers.full_name&&all[i].customers.full_name.substring(0,5).toLowerCase()===cn.substring(0,5).toLowerCase()){found=all[i];break;}}renderDet(found,cid);});return;}
    renderDet(c,cid);
  });
};

function renderDet(c,cid){
  var b=document.getElementById("am-dpb");if(!b)return;
  if(!c){b.innerHTML="<p style='color:#ef4444;padding:20px;text-align:center'>Veri bulunamad\u0131</p>";return;}
  var sk=c.skor||0,bp=sk>0?(sk*10)+"%":"&#8212;",bc=sk>=7?"#22c55e":sk>=4?"#C9A96E":"#ef4444";
  var ph=(c.customers&&c.customers.phone||"").replace(/[^0-9+]/g,"");var sd=c.satis_durumu||"yeni";
  var trLines=(c.transcript||"").split("\n");var tr="";
  for(var i=0;i<trLines.length;i++){var l=trLines[i];if(!l.trim())continue;if(l.indexOf("AI:")===0)tr+="<div style='margin:3px 0;padding:5px 9px;background:rgba(201,169,110,.1);border-radius:5px;color:#C9A96E;font-size:12px'><b>Ay\u015fe:</b> "+l.slice(3).trim()+"</div>";else if(l.indexOf("User:")===0)tr+="<div style='margin:3px 0;padding:5px 9px;background:rgba(255,255,255,.05);border-radius:5px;color:#f0ede8;font-size:12px'><b>M\u00fc\u015fteri:</b> "+l.slice(5).trim()+"</div>";}
  var sdOpts=["yeni|Yeni","araniyor|Aran\u0131yor","ilgileniyor|\u0130lgileniyor","teklif|Teklif Verildi","satildi|&#10003; SAT\u0130LD\u0130","vazgecti|Vazge\u00e7ti"];
  var selO="";for(var i=0;i<sdOpts.length;i++){var pts=sdOpts[i].split("|");selO+="<option value='"+pts[0]+"'"+(sd===pts[0]?" selected":"")+">"+pts[1]+"</option>";}
  var tags=["\ud83d\udd25 S\u0131cak","\u2b50 VIP","\ud83d\udd04 Geri Ara","\ud83d\udcb0 Y\u00fcksek B\u00fct\u00e7e","\u26a1 Acil"];
  var tagBtns="";for(var i=0;i<tags.length;i++){var act=(c.etiket||"")===tags[i];tagBtns+="<button onclick=\"_amTag('"+cid+"','"+tags[i]+"')\" style='background:"+(act?"rgba(201,169,110,.3)":"rgba(255,255,255,.05)")+";color:"+(act?"#C9A96E":"#a8a4b0")+";border:1px solid rgba(255,255,255,.08);border-radius:5px;padding:4px 8px;font-size:11px;cursor:pointer'>"+tags[i]+"</button>";}
  b.innerHTML=
    "<div style='display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px'>"
    +"<div style='background:#21212e;border-radius:8px;padding:8px;text-align:center'><div style='font-size:20px;font-weight:700;color:"+bc+"'>"+bp+"</div><div style='font-size:9px;color:#5a566a;margin-top:2px'>BA&#350;ARI</div></div>"
    +"<div style='background:#21212e;border-radius:8px;padding:8px;text-align:center'><div style='font-size:12px;font-weight:600;color:#60a5fa;margin-top:3px'>"+(c.ilgi_seviyesi||"&#8212;")+"</div><div style='font-size:9px;color:#5a566a;margin-top:2px'>&#304;LG&#304;</div></div>"
    +"<div style='background:#21212e;border-radius:8px;padding:8px;text-align:center'><div style='font-size:10px;color:#f87171;margin-top:3px'>"+(c.outcome||"&#8212;").substring(0,14)+"</div><div style='font-size:9px;color:#5a566a;margin-top:2px'>SONU&#199;</div></div></div>"
    +(ph?"<a href='tel:+"+ph+"' style='display:block;text-align:center;background:#21212e;border:1px solid rgba(34,197,94,.3);border-radius:8px;padding:10px;font-size:13px;text-decoration:none;color:#22c55e;font-weight:600;margin-bottom:12px'>&#128222; "+ph+" ile Ara</a>":"")
    +"<div style='margin-bottom:10px'><div style='font-size:10px;color:#a8a4b0;margin-bottom:5px'>SATI&#350; DURUMU</div><select id='am-dpsd' onchange=\"_amUpdSD('"+cid+"',this.value)\" style='width:100%;background:#21212e;color:#f0ede8;border:1px solid rgba(255,255,255,.1);border-radius:7px;padding:8px;font-size:13px'>"+selO+"</select></div>"
    +"<div style='margin-bottom:10px'><div style='font-size:10px;color:#a8a4b0;margin-bottom:5px'>ET&#304;KET</div><div style='display:flex;gap:5px;flex-wrap:wrap'>"+tagBtns+"</div></div>"
    +(c.summary?"<div style='background:#21212e;border-radius:8px;padding:10px;margin-bottom:10px'><div style='font-size:10px;color:#a8a4b0;margin-bottom:5px'>AY&#350;E &#214;ZET&#304;</div><div style='font-size:12px;color:#f0ede8;line-height:1.5'>"+c.summary+"</div></div>":"")
    +(c.itiraz&&c.itiraz!=="-"?"<div style='background:rgba(251,191,36,.08);border-radius:7px;padding:8px;margin-bottom:8px;font-size:12px;color:#fbbf24'>&#9888; "+c.itiraz+"</div>":"")
    +(c.takip_notu?"<div style='background:rgba(96,165,250,.08);border-radius:7px;padding:8px;margin-bottom:10px;font-size:12px;color:#60a5fa'>&#128204; "+c.takip_notu+"</div>":"")
    +"<div style='margin-bottom:12px'><div style='font-size:10px;color:#a8a4b0;margin-bottom:5px'>PERSONEL NOTU</div><textarea id='am-dpnote' placeholder='Not ekleyin...' style='width:100%;background:#21212e;color:#f0ede8;border:1px solid rgba(255,255,255,.1);border-radius:7px;padding:9px;font-size:12px;resize:vertical;min-height:80px;font-family:inherit;box-sizing:border-box'>"+(c.personel_notu||"")+"</textarea><button onclick=\"_amNote('"+cid+"')\" style='width:100%;margin-top:5px;background:#C9A96E;color:#000;border:none;border-radius:7px;padding:8px;font-weight:700;cursor:pointer;font-size:12px'>Notu Kaydet</button></div>"
    +"<div style='font-size:10px;color:#a8a4b0;margin-bottom:7px;border-top:1px solid rgba(255,255,255,.06);padding-top:10px'>KONU&#350;MA</div>"+(tr||"<p style='color:#5a566a;font-size:12px;text-align:center;padding:16px'>Transkript yok</p>");
}

window.updateSD=function(cid,val){fetch(SB+"/rest/v1/calls?id=eq."+cid,{method:"PATCH",headers:HC,body:JSON.stringify({satis_durumu:val})}).then(function(){T(val==="satildi"?"\ud83c\udf89 SAT\u0130LD\u0130!":"G\u00fcncellendi");});};

window.loadSalesPanel=function(){
  var uid=document.getElementById("st-usel")&&document.getElementById("st-usel").value;
  var stf=document.getElementById("st-sf")&&document.getElementById("st-sf").value||"";
  var body=document.getElementById("st-body");if(!body)return;
  if(!uid){body.innerHTML="<p style='color:#5a566a;text-align:center;padding:40px'>Personel se\u00e7in...</p>";return;}
  body.innerHTML="<p style='color:#5a566a;text-align:center;padding:40px'>Y\u00fckleniyor...</p>";
  var q=SB+"/rest/v1/calls?agent_name=eq.Ayse&assigned_to=eq."+uid+"&select=id,skor,ilgi_seviyesi,summary,outcome,itiraz,takip_notu,satis_durumu,customers(full_name,phone)&order=skor.desc.nullslast&limit=500";
  if(stf)q+="&satis_durumu=eq."+stf;
  fetch(q,{headers:H}).then(function(r){return r.json();}).then(function(rows){
    var cnt=document.getElementById("st-cnt");if(cnt)cnt.textContent=(rows.length)+" lead";
    if(!rows.length){body.innerHTML="<p style='color:#5a566a;text-align:center;padding:40px'>Bu personele atan\u0131m\u015f lead yok</p>";return;}
    var html="";
    for(var i=0;i<rows.length;i++){
      var c=rows[i];var sk=c.skor||0,bp=sk>0?(sk*10)+"%":"&#8212;",bc=sk>=7?"#22c55e":sk>=4?"#C9A96E":"#ef4444";
      var ph=(c.customers&&c.customers.phone||"").replace(/[^0-9+]/g,"");var sd=c.satis_durumu||"yeni";
      var sdBg={satildi:"rgba(168,85,247,.2)",ilgileniyor:"rgba(34,197,94,.2)",teklif:"rgba(251,191,36,.2)",vazgecti:"rgba(239,68,68,.15)",araniyor:"rgba(251,191,36,.15)"}[sd]||"rgba(96,165,250,.2)";
      var sdLb={satildi:"SAT\u0130LD\u0130",ilgileniyor:"\u0130lgileniyor",teklif:"Teklif",vazgecti:"Vazge\u00e7ti",araniyor:"Aran\u0131yor",yeni:"Yeni"}[sd]||"Yeni";
      var nm=c.customers&&c.customers.full_name||"?";
      var sdOpts2="";var sv=["yeni|Yeni","araniyor|Aran\u0131yor","ilgileniyor|\u0130lgileniyor","teklif|Teklif","satildi|SAT\u0130LD\u0130","vazgecti|Vazge\u00e7ti"];
      for(var j=0;j<sv.length;j++){var pts2=sv[j].split("|");sdOpts2+="<option value='"+pts2[0]+"'"+(sd===pts2[0]?" selected":"")+">"+pts2[1]+"</option>";}
      html+="<div style='background:#1a1a24;border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:14px;margin-bottom:10px'>";
      html+="<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:8px'><span style='font-size:14px;font-weight:700;color:#f0ede8'>"+nm+"</span><span style='padding:3px 8px;border-radius:4px;font-size:11px;font-weight:600;background:"+sdBg+"'>"+sdLb+"</span></div>";
      html+="<div style='display:flex;gap:8px;align-items:center;margin-bottom:8px'><span style='font-size:16px;font-weight:700;color:"+bc+"'>"+bp+"</span><span style='font-size:11px;color:#5a566a'>"+(c.ilgi_seviyesi||"&#8212;")+"</span>"+(ph?"<a href='tel:+"+ph+"' style='background:#22c55e;color:#000;border-radius:5px;padding:3px 9px;font-size:11px;font-weight:700;text-decoration:none;margin-left:auto'>&#128222; Ara</a>":"")+"</div>";
      if(c.summary)html+="<div style='font-size:12px;color:#a8a4b0;line-height:1.5;background:rgba(255,255,255,.03);border-radius:6px;padding:8px;margin-bottom:8px'>"+c.summary.substring(0,180)+(c.summary.length>180?"...":"")+"</div>";
      if(c.itiraz&&c.itiraz!=="-")html+="<div style='font-size:11px;color:#fbbf24;margin-bottom:4px'>&#9888; "+c.itiraz+"</div>";
      if(c.takip_notu)html+="<div style='font-size:11px;color:#60a5fa;margin-bottom:6px'>&#128204; "+c.takip_notu+"</div>";
      html+="<select onchange=\"updateSD(this.dataset.c,this.value)\" data-c='"+c.id+"' style='background:#21212e;color:#f0ede8;border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:4px 8px;font-size:11px'>"+sdOpts2+"</select></div>";
    }
    body.innerHTML=html;
  });
};

window.showBulkAssign=function(){
  fetch(SB+"/rest/v1/users?select=id,full_name&order=full_name",{headers:H}).then(function(r){return r.json();}).then(function(ud){
    var old=document.getElementById("ba-modal");if(old)old.remove();
    var m=document.createElement("div");m.id="ba-modal";m.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:9999;display:flex;align-items:center;justify-content:center";
    m.innerHTML="<div style='background:#1a1a24;border:1px solid rgba(201,169,110,.3);border-radius:14px;padding:28px;width:500px;max-height:85vh;overflow-y:auto'><div style='font-size:16px;font-weight:700;color:#f0ede8;margin-bottom:18px'>&#9889; Toplu Atama</div><div style='display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px'><div><label style='font-size:11px;color:#a8a4b0;display:block;margin-bottom:5px'>M\u0130N\u0130MUM SKOR</label><select id='ba-minskor' style='width:100%;background:#21212e;color:#f0ede8;border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:9px;font-size:13px'><option value='1'>1+</option><option value='3'>3+</option><option value='5' selected>5+</option><option value='7'>7+</option></select></div><div><label style='font-size:11px;color:#a8a4b0;display:block;margin-bottom:5px'>MEVCUT ATAMA</label><select id='ba-filter' style='width:100%;background:#21212e;color:#f0ede8;border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:9px;font-size:13px'><option value='unassigned' selected>Sadece atan\u0131mam\u0131\u015f</option><option value='all'>T\u00fcm\u00fcn\u00fc yeniden da\u011f\u0131t</option></select></div></div><div style='margin-bottom:16px'><div style='display:flex;justify-content:space-between;margin-bottom:8px'><label style='font-size:11px;color:#a8a4b0'>PERSONELLER</label><button onclick="document.querySelectorAll('.ba-user').forEach(function(c){c.checked=true;})" style='font-size:11px;color:#C9A96E;background:none;border:none;cursor:pointer'>T\u00fcm\u00fcn\u00fc Se\u00e7</button></div><div style='display:grid;grid-template-columns:1fr 1fr;gap:8px'>"+ud.map(function(u){return"<label style='display:flex;align-items:center;gap:8px;background:#21212e;border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:8px 10px;cursor:pointer'><input type='checkbox' class='ba-user' value='"+u.id+"' data-name='"+u.full_name+"' style='accent-color:#C9A96E;width:14px;height:14px'><span style='font-size:13px;color:#f0ede8'>"+u.full_name+"</span></label>";}).join("")+"</div></div><div id='ba-preview' style='background:#21212e;border-radius:8px;padding:10px;margin-bottom:16px;font-size:12px;color:#5a566a;text-align:center'>\u00d6nizleme i\u00e7in Hesapla butonuna bas</div><div style='display:flex;gap:10px;justify-content:flex-end'><button onclick="document.getElementById('ba-modal').remove()" style='background:rgba(255,255,255,.08);color:#a8a4b0;border:none;border-radius:8px;padding:9px 18px;cursor:pointer'>\u0130ptal</button><button onclick='calcBulkAssign()' style='background:#21212e;color:#C9A96E;border:1px solid rgba(201,169,110,.3);border-radius:8px;padding:9px 18px;cursor:pointer'>Hesapla</button><button id='ba-confirm' onclick='doBulkAssign()' disabled style='background:#C9A96E;color:#000;border:none;border-radius:8px;padding:9px 18px;font-weight:700;cursor:pointer;opacity:.5'>Da\u011f\u0131t</button></div></div>";
    document.body.appendChild(m);m.onclick=function(e){if(e.target===m)m.remove();};
  });
};

window.calcBulkAssign=function(){
  var ms=parseInt(document.getElementById("ba-minskor").value),fm=document.getElementById("ba-filter").value;
  var chks=document.querySelectorAll(".ba-user:checked"),sel=[];for(var i=0;i<chks.length;i++)sel.push({id:chks[i].value,name:chks[i].dataset.name});
  if(!sel.length){T("En az 1 personel se\u00e7in!","w");return;}
  var pv=document.getElementById("ba-preview");pv.innerHTML="<span style='color:#C9A96E'>Hesaplan\u0131yor...</span>";
  var q=SB+"/rest/v1/calls?agent_name=eq.Ayse&skor=gte."+ms+"&select=id&order=skor.desc&limit=1000";
  if(fm==="unassigned")q+="&assigned_to=is.null";
  fetch(q,{headers:H}).then(function(r){return r.json();}).then(function(calls){
    window._bulkCalls=calls;window._bulkUsers=sel;
    var perP=Math.floor(calls.length/sel.length),rem=calls.length%sel.length;
    var html="<div style='color:#f0ede8;margin-bottom:8px;font-size:13px;font-weight:600'>"+calls.length+" arama &#8594; "+sel.length+" personele</div><div style='display:grid;grid-template-columns:1fr 1fr;gap:6px'>";
    for(var i=0;i<sel.length;i++)html+="<div style='background:rgba(201,169,110,.1);border-radius:6px;padding:6px 10px;display:flex;justify-content:space-between'><span style='color:#f0ede8'>"+sel[i].name+"</span><span style='color:#C9A96E;font-weight:700'>"+(perP+(i<rem?1:0))+"</span></div>";
    pv.innerHTML=html+"</div>";
    var btn=document.getElementById("ba-confirm");if(btn){btn.disabled=false;btn.style.opacity="1";}
  });
};

window.doBulkAssign=function(){
  var calls=window._bulkCalls,users=window._bulkUsers;if(!calls||!users)return;
  var btn=document.getElementById("ba-confirm");if(btn){btn.textContent="Da\u011f\u0131t\u0131l\u0131yor...";btn.disabled=true;}
  var done=0,stats={};for(var i=0;i<users.length;i++)stats[users[i].name]=0;
  var proc=function(i){
    if(i>=calls.length){
      var modal=document.getElementById("ba-modal");if(modal)modal.remove();
      var t=document.createElement("div");t.style.cssText="position:fixed;top:20px;right:20px;background:#1a1a24;border:2px solid #22c55e;border-radius:12px;padding:16px 20px;z-index:99999;min-width:260px;box-shadow:0 8px 32px rgba(0,0,0,.5)";
      var sh="";var ks=Object.keys(stats);for(var j=0;j<ks.length;j++)sh+="<div style='display:flex;justify-content:space-between;margin-top:4px'><span style='color:#a8a4b0;font-size:12px'>"+ks[j]+"</span><span style='color:#22c55e;font-size:12px;font-weight:700'>"+stats[ks[j]]+" arama</span></div>";
      t.innerHTML="<div style='font-size:15px;font-weight:700;color:#22c55e;margin-bottom:6px'>&#10003; "+done+" Arama Da\u011f\u0131t\u0131ld\u0131!</div>"+sh;
      document.body.appendChild(t);setTimeout(function(){t.remove();},5000);return;
    }
    var user=users[i%users.length];
    fetch(SB+"/rest/v1/calls?id=eq."+calls[i].id,{method:"PATCH",headers:HC,body:JSON.stringify({assigned_to:user.id,assigned_name:user.name,satis_durumu:"yeni"})}).then(function(r){if(r.status===204){done++;stats[user.name]=(stats[user.name]||0)+1;}proc(i+1);});
  };proc(0);
};

function addNav(){
  var tb=document.querySelector(".topbar,.top-bar,nav,.navbar,header");
  if(!tb){setTimeout(addNav,500);return;}
  if(document.getElementById("am-btn"))return;
  var b=document.createElement("button");b.id="am-btn";b.textContent="\ud83d\udccb Arama Merkezi";
  b.style.cssText="background:linear-gradient(135deg,rgba(201,169,110,.2),rgba(201,169,110,.08));color:#C9A96E;border:1px solid rgba(201,169,110,.3);border-radius:7px;padding:5px 12px;font-size:12px;cursor:pointer;margin-left:8px;font-weight:700";
  b.onclick=function(){showAramaMerkezi();};tb.appendChild(b);
  var b2=document.createElement("button");b2.id="st-nav";b2.textContent="\ud83c\udfaf Sat\u0131\u015f Takip";
  b2.style.cssText="background:rgba(201,169,110,.1);color:#C9A96E;border:1px solid rgba(201,169,110,.25);border-radius:7px;padding:5px 12px;font-size:12px;cursor:pointer;margin-left:6px;font-weight:600";
  b2.onclick=function(){
    var pg=document.getElementById("st-pg");if(pg){pg.style.display=pg.style.display==="none"?"block":"none";return;}
    fetch(SB+"/rest/v1/users?select=id,full_name&order=full_name",{headers:H}).then(function(r){return r.json();}).then(function(users){
      var opts="";for(var i=0;i<users.length;i++)opts+="<option value='"+users[i].id+"'>"+users[i].full_name+"</option>";
      pg=document.createElement("div");pg.id="st-pg";pg.style.cssText="position:fixed;top:0;left:0;right:0;bottom:0;background:#0d0d12;z-index:8000;overflow-y:auto;padding:20px";
      pg.innerHTML="<div style='max-width:1100px;margin:0 auto'><div style='display:flex;align-items:center;gap:12px;margin-bottom:20px;flex-wrap:wrap'><h2 style='color:#f0ede8;font-size:18px;margin:0'>&#127919; Sat\u0131\u015f Takip</h2><select id='st-usel' onchange='loadSalesPanel()' style='background:#21212e;color:#f0ede8;border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:7px 12px;font-size:13px'><option value=''>-- Personel Se\u00e7 --</option>"+opts+"</select><select id='st-sf' onchange='loadSalesPanel()' style='background:#21212e;color:#f0ede8;border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:7px 12px;font-size:13px'><option value=''>T\u00fcm Durumlar</option><option value='yeni'>Yeni</option><option value='araniyor'>Aran\u0131yor</option><option value='ilgileniyor'>\u0130lgileniyor</option><option value='teklif'>Teklif</option><option value='satildi'>Sat\u0131ld\u0131</option><option value='vazgecti'>Vazge\u00e7ti</option></select><span id='st-cnt' style='color:#5a566a;font-size:13px'></span><button onclick="document.getElementById('st-pg').style.display='none'" style='margin-left:auto;background:rgba(255,255,255,.08);color:#a8a4b0;border:none;border-radius:8px;padding:7px 14px;cursor:pointer'>Kapat</button></div><div id='st-body'><p style='color:#5a566a;text-align:center;padding:40px'>Personel se\u00e7in...</p></div></div>";
      document.body.appendChild(pg);
    });
  };
  tb.appendChild(b2);
}
setTimeout(addNav,800);
new MutationObserver(function(){if(!document.getElementById("am-btn"))addNav();}).observe(document.body,{childList:true,subtree:true});

window.showAramaMerkezi=window.showAM=function(){
  var old=document.getElementById("am-pg");if(old){old.remove();return;}
  var pg=document.createElement("div");pg.id="am-pg";pg.style.cssText="position:fixed;inset:0;background:#0d0d12;z-index:7000;display:flex;flex-direction:column;overflow:hidden;font-family:system-ui,sans-serif";
  pg.innerHTML="<div style='background:#1a1a24;border-bottom:1px solid rgba(255,255,255,.08);padding:10px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0;flex-wrap:wrap'>"
  +"<div style='font-size:15px;font-weight:700;color:#f0ede8;flex-shrink:0'>&#128203; Arama Merkezi</div>"
  +"<select id='am-filgi' onchange='_amFil()' style='background:#21212e;color:#f0ede8;border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:5px 8px;font-size:12px'><option value='all'>T\u00fcm \u0130lgi</option><option value='yuksek'>Y\u00fcksek</option><option value='orta'>Orta</option><option value='dusuk'>D\u00fc\u015f\u00fck</option></select>"
  +"<select id='am-fskor' onchange='_amFil()' style='background:#21212e;color:#f0ede8;border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:5px 8px;font-size:12px'><option value=''>T\u00fcm Skor</option><option value='3'>3+</option><option value='5'>5+</option><option value='7'>7+</option></select>"
  +"<select id='am-fsd' onchange='_amFil()' style='background:#21212e;color:#f0ede8;border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:5px 8px;font-size:12px'><option value='all'>T\u00fcm Durum</option><option value='yeni'>Yeni</option><option value='araniyor'>Aran\u0131yor</option><option value='ilgileniyor'>\u0130lgileniyor</option><option value='teklif'>Teklif</option><option value='satildi'>Sat\u0131ld\u0131</option><option value='vazgecti'>Vazge\u00e7ti</option></select>"
  +"<select id='am-fasgn' onchange='_amFil()' style='background:#21212e;color:#f0ede8;border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:5px 8px;font-size:12px'><option value='all'>T\u00fcm Atama</option><option value='yes'>Atan\u0131m\u0131\u015f</option><option value='no'>Atan\u0131mam\u0131\u015f</option></select>"
  +"<select onchange='_amPS(this.value)' style='background:#21212e;color:#f0ede8;border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:5px 8px;font-size:12px'><option value='100'>100/sayfa</option><option value='200'>200/sayfa</option><option value='500'>500/sayfa</option></select>"
  +"<button onclick='_amExp()' style='background:#21212e;color:#60a5fa;border:1px solid rgba(96,165,250,.3);border-radius:6px;padding:5px 10px;font-size:12px;cursor:pointer'>&#128229; Excel</button>"
  +"<button onclick='showBulkAssign()' style='background:linear-gradient(135deg,#C9A96E,#a07840);color:#000;border:none;border-radius:6px;padding:5px 10px;font-size:12px;cursor:pointer;font-weight:700'>&#9889; Toplu Ata</button>"
  +"<button onclick="document.getElementById('am-pg').remove()" style='margin-left:auto;background:rgba(255,255,255,.08);color:#a8a4b0;border:none;border-radius:6px;padding:6px 12px;cursor:pointer;font-size:12px'>&#10005; Kapat</button></div>"
  +"<div id='am-sbar' style='display:none;background:rgba(201,169,110,.1);border-bottom:1px solid rgba(201,169,110,.2);padding:8px 16px;align-items:center;gap:10px;flex-shrink:0'>"
  +"<span id='am-scnt' style='color:#C9A96E;font-weight:700;font-size:13px'></span>"
  +"<button onclick='_amAsgn()' style='background:#C9A96E;color:#000;border:none;border-radius:6px;padding:5px 12px;font-weight:700;cursor:pointer;font-size:12px'>Personele Ata</button>"
  +"<button onclick='_amExp()' style='background:#21212e;color:#60a5fa;border:1px solid rgba(96,165,250,.3);border-radius:6px;padding:5px 12px;cursor:pointer;font-size:12px'>Excel</button>"
  +"<button onclick='_amSA(false)' style='background:rgba(255,255,255,.05);color:#a8a4b0;border:none;border-radius:6px;padding:5px 10px;cursor:pointer;font-size:12px'>Temizle</button></div>"
  +"<div style='flex:1;overflow:auto'><table style='width:100%;border-collapse:collapse;font-size:12px'><thead><tr style='background:#1a1a24;position:sticky;top:0;z-index:10'>"
  +"<th style='padding:8px 10px;width:32px'><input type='checkbox' id='am-chkall' onchange='_amSA(this.checked)' style='accent-color:#C9A96E;width:14px;height:14px'></th>"
  +"<th onclick="_amSrt('customers.full_name')" style='padding:8px 10px;text-align:left;color:#a8a4b0;font-weight:600;cursor:pointer'>M\u00dc\u015eTER\u0130 &#8645;</th>"
  +"<th style='padding:8px 10px;text-align:left;color:#a8a4b0;font-weight:600'>TELEFON</th>"
  +"<th onclick="_amSrt('skor')" style='padding:8px 10px;text-align:center;color:#a8a4b0;font-weight:600;cursor:pointer'>SKOR &#8645;</th>"
  +"<th style='padding:8px 6px;text-align:center;color:#a8a4b0;font-weight:600'>\u0130LG\u0130</th>"
  +"<th style='padding:8px 4px;text-align:center;color:#a8a4b0;font-weight:600'>DURUM</th>"
  +"<th style='padding:8px 10px;text-align:left;color:#a8a4b0;font-weight:600'>AY\u015eE \u00d6ZET\u0130</th>"
  +"<th style='padding:8px 10px;text-align:left;color:#a8a4b0;font-weight:600'>PERSONEL</th>"
  +"<th style='padding:8px 10px;text-align:left;color:#a8a4b0;font-weight:600'>SONU\u00c7</th>"
  +"<th style='padding:8px 6px;text-align:center;color:#a8a4b0;font-weight:600'>ARA</th>"
  +"<th style='padding:8px 6px;text-align:center;color:#a8a4b0;font-weight:600'>DETAY</th>"
  +"</tr></thead><tbody id='am-tb'><tr><td colspan='11' style='text-align:center;padding:40px;color:#5a566a'>Y\u00fckleniyor...</td></tr></tbody></table></div>"
  +"<div id='am-pager' style='background:#1a1a24;border-top:1px solid rgba(255,255,255,.08);padding:10px 16px;flex-shrink:0'></div>";
  document.body.appendChild(pg);
  _p=1;_sel.clear();_f={};_s="skor.desc.nullslast";LD();
};
})();