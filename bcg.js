// bcg.js
document.addEventListener("DOMContentLoaded", function(){

  const WA_ADMIN = "6285777411667";
  const MIN_SALDO = 10000;
  const SECRET_LIFETIME = 2 * 60 * 60 * 1000; // 2 JAM

  function generateSecretCode() {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let out = "";
      for (let i=0;i<16;i++) out += chars[Math.floor(Math.random()*chars.length)];
      return out + Date.now().toString(36);
  }

  // ======= LOAD SECRET =======
  let savedSecret = localStorage.getItem("secretKey");
  let secretTime = parseInt(localStorage.getItem("secretExpire") || "0",10);
  let now = Date.now();

  if(!savedSecret || now>secretTime){
      savedSecret = generateSecretCode();
      secretTime = now + SECRET_LIFETIME;
      localStorage.setItem("secretKey", savedSecret);
      localStorage.setItem("secretExpire", secretTime);
      // reset session lama
      localStorage.removeItem("saldoUser");
      localStorage.removeItem("lastTopup");
      localStorage.removeItem("scoreUser");
      localStorage.removeItem("sessionInitialized");
      localStorage.removeItem("sessionStart");
      sessionStorage.removeItem("gridData");
  }

  const SECRET_CODE = savedSecret;

  // ======= AMBIL PARAMETER URL =======
  const params = new URLSearchParams(window.location.search);
  const paramIframe = params.get("iframe");
  const urlKey = params.get("key");
  let decodedSaldo = 0;
  if(urlKey){
      try { decodedSaldo = parseInt(atob(urlKey),10) || 0; }
      catch(e){ decodedSaldo = 0; }
  }

  // ======= RESTORE SALDO & SCORE =======
  let saldo = parseInt(localStorage.getItem("saldoUser")||"0",10);
  let lastTopup = parseInt(localStorage.getItem("lastTopup")||"0",10);
  let scoreStored = parseInt(localStorage.getItem("scoreUser")||"0",10);
  const sessionInitFlag = localStorage.getItem("sessionInitialized");

  // ======= TAMPILKAN GAME / TOPUP =======
  function showTopupScreen(){
      const pg = document.getElementById("premium-gate");
      if(!pg) return;
      pg.style.display = "block";
      pg.innerHTML = `
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

  function showGame(){
      const pg = document.getElementById("premium-gate");
      const ga = document.getElementById("game-area");
      if(!pg || !ga) return;
      pg.style.display = "none";
      ga.style.display = "block";

      // restore
      saldo = parseInt(localStorage.getItem("saldoUser")||String(saldo),10);
      lastTopup = parseInt(localStorage.getItem("lastTopup")||String(lastTopup),10);
      scoreStored = parseInt(localStorage.getItem("scoreUser")||String(scoreStored),10);

      // build game
      ga.innerHTML = `
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

      document.getElementById('btnWithdraw').addEventListener('click', withdraw);
      document.getElementById('btnRefreshGrid').addEventListener('click', ()=>{ sessionStorage.removeItem('gridData'); renderGrid(); });

      renderGrid();
      updateUI();
  }

  // ======= LOGIKA URL PREMIUM =======
  if(paramIframe === SECRET_CODE && now < secretTime){
      if(!sessionInitFlag){
          localStorage.setItem("sessionInitialized","1");
          localStorage.setItem("sessionStart", String(now));
          if(decodedSaldo>0){
              saldo = decodedSaldo;
              lastTopup = decodedSaldo;
              scoreStored = 0;
              localStorage.setItem("saldoUser", String(saldo));
              localStorage.setItem("lastTopup", String(lastTopup));
              localStorage.setItem("scoreUser", String(scoreStored));
          }else{
              localStorage.setItem("scoreUser", String(scoreStored));
          }
      }else{
          saldo = parseInt(localStorage.getItem("saldoUser")||"0",10);
          lastTopup = parseInt(localStorage.getItem("lastTopup")||"0",10);
          scoreStored = parseInt(localStorage.getItem("scoreUser")||"0",10);
      }
      showGame();
  }else{
      showTopupScreen();
  }

  // ======= EXPOSE TOPUP / WITHDRAW =======
  window.topup = function(n){
      localStorage.setItem("lastTopup", String(n));
      const barcodeArea = document.getElementById("barcodeArea");
      if(barcodeArea){
          barcodeArea.innerHTML = `
          <p>Silakan scan Qris untuk bayar topup Rp ${n.toLocaleString()}:</p>
          <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjntEMQ1J9RRFz2JwerY7vKyA-ljGYl-1eQ4yhjYybiEaxS_e0sOtf3kTNo8YVCGvfAIoX-oOI1LhbXkGAqH_wn83BRpdqiCvcvsoo4upzboV7iM0qtuls7yIubh1IE8zr9v9PTmH-wfFCmNFETRscIAFMj-21iyfWcRA-9Cxbq_pYGlsRxt60fOgPyWeSL/s660/qris.jpg" style="width:240px;height:240px;display:block;margin:12px auto;">
          <p style="font-weight:700">ID Transaksi: <b>${SECRET_CODE}</b></p>
          `;
      }
      const pesan = encodeURIComponent(`Topup Baru\nNominal: Rp ${n.toLocaleString()}\nID Transaksi: ${SECRET_CODE}`);
      window.open(`https://wa.me/${WA_ADMIN}?text=${pesan}`, "_blank");
  };

  window.withdraw = function(){
      const currentSaldo = parseInt(localStorage.getItem("saldoUser")||"0",10);
      const required = parseInt(localStorage.getItem("lastTopup")||"0",10);
      if(currentSaldo<required){ alert("Minimal WD adalah Rp "+required.toLocaleString()); return; }
      const pesan = encodeURIComponent(`Permintaan Withdraw\nSaldo: Rp ${currentSaldo}\nMinimal WD: Rp ${required}\nID Transaksi: ${SECRET_CODE}`);
      window.open(`https://wa.me/${WA_ADMIN}?text=${pesan}`,"_blank");
  };

  // ======= SAFEBOX (link aman) =======
  (function(){
      const sb = document.getElementById("safeBoxContainer");
      if(!sb) return;
      const iframe = params.get("iframe");
      const key = params.get("key");
      if(!iframe || !key){ sb.innerHTML=""; return; }
      const originalURL = `${location.origin + location.pathname}?iframe=${iframe}&key=${key}`;
      const encoded = btoa(originalURL);
      const safeURL = `https://serlok-app.blogspot.com/p/premium-member.html?akses=${encoded}`;
      sb.innerHTML = `
      <div class="card" style="background:#f0faff;border:1px solid #b0e6ff">
          <h3 style="margin:0;color:#0078c7;">🔐 Akses Premium Valid</h3>
          <p>Gunakan link aman berikut untuk kembali ke halaman premium Anda:</p>
          <pre>${safeURL}</pre>
          <a href="${safeURL}" style="display:inline-block;padding:10px 14px;border-radius:8px;background:#0078c7;color:#fff;text-decoration:none;font-weight:700">🔗 Buka Akses Premium</a>
      </div>
      `;
  })();

});
