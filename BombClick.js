window.addEventListener('DOMContentLoaded', ()=>{

const WA_ADMIN = "6285777411667";
const MIN_SALDO = 10000;
const SECRET_LIFETIME = 2 * 60 * 60 * 1000; // 2 JAM

// ===============================
// GENERATE SECRET (TIDAK DIUBAH)
// ===============================
function generateSecretCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < 16; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out + Date.now().toString(36);
}

// ===============================
// LOAD / RESET SECRET & EXPIRE
// ===============================
let savedSecret = localStorage.getItem("secretKey");
let secretTime = parseInt(localStorage.getItem("secretExpire") || "0", 10);
let now = Date.now();

// jika tidak ada atau sudah kadaluarsa → buat baru dan hapus session lama
if (!savedSecret || now > secretTime) {
  savedSecret = generateSecretCode();
  secretTime = now + SECRET_LIFETIME;
  localStorage.setItem("secretKey", savedSecret);
  localStorage.setItem("secretExpire", secretTime);

  // hapus data sesi lama kalau ada (expired)
  localStorage.removeItem("saldoUser");
  localStorage.removeItem("lastTopup");
  localStorage.removeItem("scoreUser");
  localStorage.removeItem("sessionInitialized");
  localStorage.removeItem("sessionStart");
  sessionStorage.removeItem("gridData");
}

const SECRET_CODE = savedSecret;

// ===============================
// AMBIL PARAMETER URL (iframe & key)
// ===============================
const params = new URLSearchParams(window.location.search);
const paramIframe = params.get("iframe");
const urlKey = params.get("key");
let decodedSaldo = 0;
if (urlKey) {
  try { decodedSaldo = parseInt(atob(urlKey), 10) || 0; } catch(e) { decodedSaldo = 0; }
}

// ===============================
// RESTORE SALDO & SCORE DARI localStorage (jika ada)
// ===============================
let saldo = parseInt(localStorage.getItem("saldoUser") || "0", 10);
let lastTopup = parseInt(localStorage.getItem("lastTopup") || "0", 10);
let scoreStored = parseInt(localStorage.getItem("scoreUser") || "0", 10);

// ===============================
// INISIALISASI SESSION HANYA SEKALI (jika dibuka via URL valid)
// ===============================
const sessionInitFlag = localStorage.getItem("sessionInitialized");

if (paramIframe === SECRET_CODE && now < secretTime) {
  // valid URL dan belum expired
  if (!sessionInitFlag) {
    // pertama kali membuka session premium dengan URL yang valid
    localStorage.setItem("sessionInitialized", "1");
    localStorage.setItem("sessionStart", String(now));

    if (decodedSaldo > 0) {
      saldo = decodedSaldo;
      lastTopup = decodedSaldo;
      scoreStored = 0; // reset score di awal session
      localStorage.setItem("saldoUser", String(saldo));
      localStorage.setItem("lastTopup", String(lastTopup));
      localStorage.setItem("scoreUser", String(scoreStored));
    } else {
      // kalau tidak ada key: kalau localStorage kosong, biarkan 0 (atau admin bisa set manual)
      localStorage.setItem("scoreUser", String(scoreStored));
    }
  } else {
    // session sudah diinisialisasi sebelumnya -> restore dari storage (tidak override)
    saldo = parseInt(localStorage.getItem("saldoUser") || "0", 10);
    lastTopup = parseInt(localStorage.getItem("lastTopup") || "0", 10);
    scoreStored = parseInt(localStorage.getItem("scoreUser") || "0", 10);
  }
  showGame(); // buka game
} else {
  // akses tidak valid atau expired -> tampilkan topup screen (sama seperti sebelumnya)
  if (now > secretTime) {
    localStorage.removeItem("sessionInitialized");
    localStorage.removeItem("sessionStart");
    // saldo & score sudah dihapus lebih atas saat reset secret
    sessionStorage.removeItem("gridData");
  }
  showTopupScreen();
}

// ===============================
// SHOW TOPUP (TIDAK DIUBAH LOGIKA)
// ===============================
function showTopupScreen() {
  document.getElementById("premium-gate").innerHTML = `
    <div style="padding:20px;text-align:center">
      <h2>Akses Premium</h2>
      <p style="display:none">Kode Transaksi: <b>${SECRET_CODE}</b></p>
      <p>Kode berlaku 2 jam</p>

      <h3>Pilih Nominal Topup</h3>
      <div class="topup-buttons">
        ${[10000,15000,20000,50000].map(n => `
          <button onclick="topup(${n})">Rp ${n.toLocaleString()}</button>
        `).join("")}
      </div>

      <div id="barcodeArea" style="margin-top:20px;"></div>
    </div>
  `;
}

// ===============================
// TOPUP (HANYA KIRIM SECRET_CODE KE WA) - LOGIKA TETAP
// ===============================
function topup(nominal) {
  localStorage.setItem("lastTopup", String(nominal));

  document.getElementById("barcodeArea").innerHTML = `
    <p>Silakan scan Qris untuk bayar topup Rp ${nominal.toLocaleString()}:</p>
    <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjntEMQ1J9RRFz2JwerY7vKyA-ljGYl-1eQ4yhjYybiEaxS_e0sOtf3kTNo8YVCGvfAIoX-oOI1LhbXkGAqH_wn83BRpdqiCvcvsoo4upzboV7iM0qtuls7yIubh1IE8zr9v9PTmH-wfFCmNFETRscIAFMj-21iyfWcRA-9Cxbq_pYGlsRxt60fOgPyWeSL/s660/qris.jpg" style="width:240px;height:240px;display:block;margin:12px auto;">
    <p style="display:none">ID Transaksi: <b>${SECRET_CODE}</b></p>
    <p style="font-weight:700">ID Transaksi: <b>${SECRET_CODE}</b></p>
  `;

  const pesan = encodeURIComponent(
    `Topup Baru\nNominal: Rp ${nominal.toLocaleString()}\nID Transaksi: ${SECRET_CODE}`
  );
  window.open(`https://wa.me/${WA_ADMIN}?text=${pesan}`, "_blank");
}

// ===============================
// ADMIN MANUAL SET SALDO (TETAP ADA)
// ===============================
function setSaldo(n) {
  saldo = n;
  localStorage.setItem("saldoUser", String(n));
  alert("Saldo diupdate: Rp " + n.toLocaleString());
}

// ===============================
// BANTUAN: GRID MANAGEMENT (9 kotak) 
// - Disimpan di sessionStorage agar bertahan saat reload selama sesi
// - Format: array objek {type:'B'|'R', val:number, opened:bool}
// ===============================
function generateGridData(){
  const arr = [];
  // 7 reward
  for(let i=0;i<7;i++) arr.push({type:'R', val: Math.floor(Math.random()*500)+1, opened:false});
  // 2 bom
  arr.push({type:'B', val:0, opened:false});
  arr.push({type:'B', val:0, opened:false});
  // shuffle
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]] = [arr[j],arr[i]];
  }
  sessionStorage.setItem('gridData', JSON.stringify(arr));
  return arr;
}

function loadGridData(){
  const raw = sessionStorage.getItem('gridData');
  if(!raw) return generateGridData();
  try { 
    const data = JSON.parse(raw);
    if(!Array.isArray(data) || data.length!==9) return generateGridData();
    return data;
  } catch(e){
    return generateGridData();
  }
}

function saveGridData(grid){
  sessionStorage.setItem('gridData', JSON.stringify(grid));
}

// ===============================
// SHOW GAME (DITERAPKAN 9 KOTAK DI SINI)
// ===============================
function showGame() {
  document.getElementById("premium-gate").style.display = "none";
  document.getElementById("game-area").style.display = "block";

  // restore latest values from storage (safety)
  saldo = parseInt(localStorage.getItem("saldoUser") || String(saldo), 10);
  lastTopup = parseInt(localStorage.getItem("lastTopup") || String(lastTopup), 10);
  scoreStored = parseInt(localStorage.getItem("scoreUser") || String(scoreStored), 10);

  // build game area
  document.getElementById("game-area").innerHTML = `
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

  // attach withdraw
  document.getElementById('btnWithdraw').addEventListener('click', withdraw);
  document.getElementById('btnRefreshGrid').addEventListener('click', ()=>{
    sessionStorage.removeItem('gridData');
    renderGrid();
  });

  renderGrid();
}

// ===============================
// RENDER GRID ke DOM
// ===============================
function renderGrid(){
  // check expire
  now = Date.now();
  if(now > secretTime){
    alert("Session telah berakhir. Silakan minta akses ulang.");
    // cleanup minimal
    localStorage.removeItem("sessionInitialized");
    localStorage.removeItem("sessionStart");
    localStorage.removeItem("saldoUser");
    localStorage.removeItem("lastTopup");
    localStorage.removeItem("scoreUser");
    sessionStorage.removeItem("gridData");
    location.reload();
    return;
  }

  let grid = loadGridData();
  // jika semua opened -> buat grid baru
  const allOpened = grid.every(c=>c.opened);
  if(allOpened) grid = generateGridData();

  const container = document.getElementById('gridContainer');
  container.innerHTML = '';
  grid.forEach((cell, idx)=>{
    const el = document.createElement('div');
    el.className = 'box' + (cell.opened ? ' open' : '');
    el.id = 'box_' + idx;
    el.innerText = cell.opened ? (cell.type==='B' ? '💣' : '+'+cell.val) : '?';
    if(!cell.opened){
      el.addEventListener('click', ()=> openBox(idx));
    } else {
      // prevent clicking opened boxes
      el.style.pointerEvents = 'none';
    }
    container.appendChild(el);
  });
  saveGridData(grid);
}

// ===============================
// BUKA KOTAK (LOGIKA KLIK)
// ===============================
function openBox(index){
  // expire safety
  now = Date.now();
  if(now > secretTime){
    alert("Session telah berakhir. Silakan minta akses ulang.");
    location.reload();
    return;
  }

  // reload grid to be safe
  let grid = loadGridData();
  const cell = grid[index];
  if(!cell || cell.opened) return;

  // cek saldo cukup
  saldo = parseInt(localStorage.getItem('saldoUser') || '0', 10);
  if(saldo < 100){
    alert('Saldo tidak cukup! Silakan topup.');
    return;
  }

  // potong biaya klik (Rp100)
  saldo -= 100;

  // jika bom -> rugi 100 saja (sudah dipotong); tidak hilangkan sisa saldo
  if(cell.type === 'B'){
    cell.opened = true;
    // simpan saldo dan tampilkan result
    localStorage.setItem('saldoUser', String(saldo));
    // update score (count clicks)
    let sc = parseInt(localStorage.getItem('scoreUser') || '0', 10);
    sc += 1;
    localStorage.setItem('scoreUser', String(sc));
    // visual & alert
    renderGrid();
    updateUI();
    alert('💥 BOM! Anda rugi Rp 100 (sesuai klik).');
    // small delay lalu auto-regenerate jika semua terbuka
    setTimeout(()=>{ 
      let g = loadGridData();
      if(g.every(c=>c.opened)) { sessionStorage.removeItem('gridData'); renderGrid(); }
    }, 600);
    return;
  }

  // jika reward
  if(cell.type === 'R'){
    const reward = cell.val || (Math.floor(Math.random()*500)+1);
    cell.opened = true;

    // tambahkan reward ke saldo
    saldo += reward;

    // update score (count wins/clicks)
    let sc = parseInt(localStorage.getItem('scoreUser') || '0', 10);
    sc += 1;
    localStorage.setItem('scoreUser', String(sc));

    // simpan saldo & grid, update UI
    localStorage.setItem('saldoUser', String(saldo));
    saveGridData(grid);
    renderGrid();
    updateUI();
    alert('🎉 Berhasil! Anda mendapat Rp ' + reward.toLocaleString());
    // auto new grid if all opened after delay
    setTimeout(()=>{ 
      let g = loadGridData();
      if(g.every(c=>c.opened)) { sessionStorage.removeItem('gridData'); renderGrid(); }
    }, 700);
    return;
  }
}

// ===============================
// UPDATE UI (saldo & score)
// ===============================
function updateUI(){
  const sd = parseInt(localStorage.getItem('saldoUser') || '0', 10);
  const sc = parseInt(localStorage.getItem('scoreUser') || '0', 10);
  const sdEl = document.getElementById('saldoDisplay');
  const scEl = document.getElementById('scoreDisplay');
  if(sdEl) sdEl.textContent = sd.toLocaleString();
  if(scEl) scEl.textContent = sc;
}

// ===============================
// WITHDRAW (SAMA LOGIKA TETAP)
// ===============================
function withdraw() {
  const currentSaldo = parseInt(localStorage.getItem("saldoUser") || "0", 10);
  const required = parseInt(localStorage.getItem("lastTopup") || "0", 10);
  if (currentSaldo < required) {
    alert("Minimal WD adalah Rp " + required.toLocaleString());
    return;
  }

  const pesan = encodeURIComponent(
    `Permintaan Withdraw\n` +
    `Saldo: Rp ${currentSaldo}\n` +
    `Minimal WD: Rp ${required}\n` +
    `ID Transaksi: ${SECRET_CODE}`
  );
  window.open(`https://wa.me/${WA_ADMIN}?text=${pesan}`, "_blank");
}

// initial update
updateUI();

</script>

<!-- SARENG SAFEBOX (tampilan link aman), tidak diubah -->
<script>
(function() {
    const params = new URLSearchParams(window.location.search);
    const iframe = params.get("iframe");
    const key = params.get("key");

    if (!iframe || !key) {
        document.getElementById("safeBoxContainer").innerHTML = "";
        return;
    }

    const originalURL = `${location.origin + location.pathname}?iframe=${iframe}&key=${key}`;
    const encoded = btoa(originalURL);
    const safeURL = `https://serlok-app.blogspot.com/p/premium-member.html?akses=${encoded}`;

    document.getElementById("safeBoxContainer").innerHTML = `
        <div class="card" style="background:#f0faff;border:1px solid #b0e6ff">
            <h3 style="margin:0;color:#0078c7;">🔐 Akses Premium Valid</h3>
            <p>Gunakan link aman berikut untuk kembali ke halaman premium Anda:</p>
            <pre>${safeURL}</pre>
            <a href="${safeURL}" style="display:inline-block;padding:10px 14px;border-radius:8px;background:#0078c7;color:#fff;text-decoration:none;font-weight:700">🔗 Buka Akses Premium</a>
        </div>
    `;
})();
