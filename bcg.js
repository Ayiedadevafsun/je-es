window.addEventListener('DOMContentLoaded', ()=>{

const WA_ADMIN = "6285777411667";
const MIN_SALDO = 10000;
const SECRET_LIFETIME = 2*60*60*1000;

// ===============================
// GENERATE SECRET
// ===============================
function generateSecretCode(){
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for(let i=0;i<16;i++) out += chars[Math.floor(Math.random()*chars.length)];
  return out + Date.now().toString(36);
}

// ===============================
// LOAD / RESET SECRET
// ===============================
let savedSecret = localStorage.getItem("secretKey");
let secretTime = parseInt(localStorage.getItem("secretExpire")||"0",10);
let now = Date.now();

if(!savedSecret || now>secretTime){
  savedSecret = generateSecretCode();
  secretTime = now+SECRET_LIFETIME;
  localStorage.setItem("secretKey", savedSecret);
  localStorage.setItem("secretExpire", secretTime);
  localStorage.removeItem("saldoUser");
  localStorage.removeItem("lastTopup");
  localStorage.removeItem("scoreUser");
  localStorage.removeItem("sessionInitialized");
  localStorage.removeItem("sessionStart");
  sessionStorage.removeItem("gridData");
}

const SECRET_CODE = savedSecret;

// ===============================
// AMBIL PARAMETER URL
// ===============================
const params = new URLSearchParams(window.location.search);
const paramIframe = params.get("iframe");
const urlKey = params.get("key");
let decodedSaldo = 0;
if(urlKey){
  try{ decodedSaldo = parseInt(atob(urlKey),10)||0; }catch(e){decodedSaldo=0;}
}

// ===============================
// RESTORE SALDO & SCORE
// ===============================
let saldo = parseInt(localStorage.getItem("saldoUser")||"0",10);
let lastTopup = parseInt(localStorage.getItem("lastTopup")||"0",10);
let scoreStored = parseInt(localStorage.getItem("scoreUser")||"0",10);

// ===============================
// INISIALISASI SESSION
// ===============================
const sessionInitFlag = localStorage.getItem("sessionInitialized");

if(paramIframe===SECRET_CODE && now<secretTime){
  if(!sessionInitFlag){
    localStorage.setItem("sessionInitialized","1");
    localStorage.setItem("sessionStart",String(now));
    if(decodedSaldo>0){
      saldo = decodedSaldo;
      lastTopup = decodedSaldo;
      scoreStored = 0;
      localStorage.setItem("saldoUser",String(saldo));
      localStorage.setItem("lastTopup",String(lastTopup));
      localStorage.setItem("scoreUser",String(scoreStored));
    } else {
      localStorage.setItem("scoreUser",String(scoreStored));
    }
  } else {
    saldo = parseInt(localStorage.getItem("saldoUser")||"0",10);
    lastTopup = parseInt(localStorage.getItem("lastTopup")||"0",10);
    scoreStored = parseInt(localStorage.getItem("scoreUser")||"0",10);
  }
  showGame();
} else {
  if(now>secretTime){
    localStorage.removeItem("sessionInitialized");
    localStorage.removeItem("sessionStart");
    sessionStorage.removeItem("gridData");
  }
  showTopupScreen();
}

// ===============================
// SHOW TOPUP
// ===============================
function showTopupScreen(){
  document.getElementById("premium-gate").innerHTML = `
    <div style="padding:20px;text-align:center">
      <h2>Akses Premium</h2>
      <p>Kode berlaku 2 jam</p>
      <h3>Pilih Nominal Topup</h3>
      <div class="topup-buttons">
        ${[10000,15000,20000,50000].map(n=>`<button onclick="topup(${n})">Rp ${n.toLocaleString()}</button>`).join("")}
      </div>
      <div id="barcodeArea" style="margin-top:20px;"></div>
    </div>
  `;
}

// ===============================
// TOPUP
// ===============================
window.topup = function(nominal){
  localStorage.setItem("lastTopup",String(nominal));
  document.getElementById("barcodeArea").innerHTML = `
    <p>Silakan scan Qris untuk bayar topup Rp ${nominal.toLocaleString()}:</p>
    <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjntEMQ1J9RRFz2JwerY7vKyA-ljGYl-1eQ4yhjYybiEaxS_e0sOtf3kTNo8YVCGvfAIoX-oOI1LhbXkGAqH_wn83BRpdqiCvcvsoo4upzboV7iM0qtuls7yIubh1IE8zr9v9PTmH-wfFCmNFETRscIAFMj-21iyfWcRA-9Cxbq_pYGlsRxt60fOgPyWeSL/s660/qris.jpg" style="width:240px;height:240px;display:block;margin:12px auto;">
    <p style="font-weight:700">ID Transaksi: <b>${SECRET_CODE}</b></p>
  `;
  const pesan = encodeURIComponent(`Topup Baru\nNominal: Rp ${nominal.toLocaleString()}\nID Transaksi: ${SECRET_CODE}`);
  window.open(`https://wa.me/${WA_ADMIN}?text=${pesan}`,"_blank");
}

// ===============================
// SHOW GAME + GRID + OPEN BOX
// ===============================
window.showGame = function(){
  document.getElementById("premium-gate").style.display="none";
  document.getElementById("game-area").style.display="block";
  updateUI();
  document.getElementById("game-area").innerHTML=`
    <div style="padding:12px;text-align:center">
      <h2>Game 9 Kotak — Bom Click</h2>
      <div class="saldo">Saldo: <span id="saldoDisplay">${saldo.toLocaleString()}</span></div>
      <div id="gridContainer" class="grid"></div>
      <div class="actions">
        <button class="btn wd" id="btnWithdraw">Ajukan Withdraw</button>
        <button class="btn" id="btnRefreshGrid">Refresh Kotak</button>
      </div>
      <div class="muted">Klik salah satu kotak untuk membuka. Biaya tiap klik Rp 100. BOM rugi Rp100 saja.</div>
      <div style="margin-top:12px">Skor: <span id="scoreDisplay">${scoreStored}</span></div>
    </div>
  `;
  document.getElementById('btnWithdraw').addEventListener('click',withdraw);
  document.getElementById('btnRefreshGrid').addEventListener('click',()=>{sessionStorage.removeItem('gridData'); renderGrid();});
  renderGrid();
}

// ===============================
// GRID MANAGEMENT
// ===============================
function generateGridData(){
  const arr=[];
  for(let i=0;i<7;i++) arr.push({type:'R',val:Math.floor(Math.random()*500)+1,opened:false});
  arr.push({type:'B',val:0,opened:false});
  arr.push({type:'B',val:0,opened:false});
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  sessionStorage.setItem('gridData',JSON.stringify(arr));
  return arr;
}
function loadGridData(){
  const raw=sessionStorage.getItem('gridData');
  if(!raw) return generateGridData();
  try{
    const data=JSON.parse(raw);
    if(!Array.isArray(data)||data.length!==9) return generateGridData();
    return data;
  }catch(e){return generateGridData();}
}
function saveGridData(grid){sessionStorage.setItem('gridData',JSON.stringify(grid));}

// ===============================
// RENDER GRID
// ===============================
function renderGrid(){
  now=Date.now();
  if(now>secretTime){alert("Session telah berakhir. Silakan minta akses ulang."); location.reload(); return;}
  let grid=loadGridData();
  if(grid.every(c=>c.opened)) grid=generateGridData();
  const container=document.getElementById('gridContainer');
  container.innerHTML='';
  grid.forEach((cell,idx)=>{
    const el=document.createElement('div');
    el.className='box'+(cell.opened?' open':'');
    el.id='box_'+idx;
    el.innerText=cell.opened?(cell.type==='B'?'💣':'+'+cell.val):'?';
    if(!cell.opened){el.addEventListener('click',()=>openBox(idx));} else {el.style.pointerEvents='none';}
    container.appendChild(el);
  });
  saveGridData(grid);
}

// ===============================
// OPEN BOX
// ===============================
function openBox(index){
  now=Date.now();
  if(now>secretTime){alert("Session telah berakhir. Silakan minta akses ulang."); location.reload(); return;}
  let grid=loadGridData();
  const cell=grid[index];
  if(!cell||cell.opened) return;
  saldo=parseInt(localStorage.getItem('saldoUser')||'0',10);
  if(saldo<100){alert('Saldo tidak cukup! Silakan topup.'); return;}
  saldo-=100;
  if(cell.type==='B'){
    cell.opened=true;
    localStorage.setItem('saldoUser',String(saldo));
    let sc=parseInt(localStorage.getItem('scoreUser')||'0',10);
    sc+=1;
    localStorage.setItem('scoreUser',String(sc));
    renderGrid();
    updateUI();
    alert('💥 BOM! Anda rugi Rp 100.');
    setTimeout(()=>{let g=loadGridData(); if(g.every(c=>c.opened)){sessionStorage.removeItem('gridData'); renderGrid();}},600);
    return;
  }
  if(cell.type==='R'){
    const reward=cell.val||Math.floor(Math.random()*500)+1;
    cell.opened=true;
    saldo+=reward;
    let sc=parseInt(localStorage.getItem('scoreUser')||'0',10);
    sc+=1;
    localStorage.setItem('scoreUser',String(sc));
    localStorage.setItem('saldoUser',String(saldo));
    saveGridData(grid);
    renderGrid();
    updateUI();
    alert('🎉 Berhasil! Anda mendapat Rp '+reward.toLocaleString());
    setTimeout(()=>{let g=loadGridData(); if(g.every(c=>c.opened)){sessionStorage.removeItem('gridData'); renderGrid();}},700);
    return;
  }
}

// ===============================
// UPDATE UI
// ===============================
function updateUI(){
  const sd=parseInt(localStorage.getItem('saldoUser')||'0',10);
  const sc=parseInt(localStorage.getItem('scoreUser')||'0',10);
  const sdEl=document.getElementById('saldoDisplay');
  const scEl=document.getElementById('scoreDisplay');
  if(sdEl) sdEl.textContent=sd.toLocaleString();
  if(scEl) scEl.textContent=sc;
}

// ===============================
// WITHDRAW
// ===============================
function withdraw(){
  const currentSaldo=parseInt(localStorage.getItem("saldoUser")||"0",10);
  const required=parseInt(localStorage.getItem("lastTopup")||"0",10);
  if(currentSaldo<required){alert("Minimal WD adalah Rp "+required.toLocaleString()); return;}
  const pesan=encodeURIComponent(`Permintaan Withdraw\nSaldo: Rp ${currentSaldo}\nMinimal WD: Rp ${required}\nID Transaksi: ${SECRET_CODE}`);
  window.open(`https://wa.me/${WA_ADMIN}?text=${pesan}`,"_blank");
}

updateUI();

}); // end DOMContentLoaded
