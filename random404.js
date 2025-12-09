// ===============================
// RANDOM 404 PAGE BY CHATGPT
// ===============================
// Author: Mang Ayi Service
// Support Blogspot (CDATA Friendly)
// ===============================

(function(){

  const container = document.getElementById("random-404");
  if(!container) return;

  // ===========================
  // DESIGNS ARRAY
  // ===========================
  const designs = [

    /* ========== DESAIN 1 — GLITCH ========== */
    {
      html: `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:90vh;color:#0ff;font-family:monospace;text-align:center;">
        <h1 id="gltx" style="font-size:60px;">404</h1>
        <p>Halaman tidak ditemukan...</p>
        <a href="/" style="margin-top:20px;padding:10px 20px;border:1px solid #0ff;color:#0ff;text-decoration:none;">Kembali ke Beranda</a>
      </div>
      `,
      init: function(root){
        const el = root.querySelector("#gltx");
        let t = 0;
        el._int = setInterval(()=>{
          t++;
          el.style.textShadow =
            (Math.sin(t/2)*6|0)+"px 0 red," +
            (-(Math.sin(t/3)*6|0))+"px 0 blue";
        },120);
      },
      destroy: function(root){
        const el = root.querySelector("#gltx");
        if(el && el._int) clearInterval(el._int);
      }
    },

    /* ========== DESAIN 2 — TYPEWRITER ========== */
    {
      html: `
      <div style="padding:40px;font-family:'Courier New',monospace;text-align:center;">
        <h1 style="font-size:50px;">404</h1>
        <p id="typeErr" style="font-size:20px;white-space:pre;"></p>
        <a href="/" style="display:inline-block;margin-top:25px;padding:10px 20px;border:1px solid #222;text-decoration:none;">Back to Home</a>
      </div>
      `,
      init: function(root){
        let text = "Oops... halaman yang kamu cari tidak ada.";
        let i = 0;
        const el = root.querySelector("#typeErr");
        el._typing = true;

        (function run(){
          if(!el._typing) return;
          if(i < text.length){
            el.textContent += text.charAt(i++);
            setTimeout(run, 40 + (Math.random()*40|0));
          }
        })();
      },
      destroy: function(root){
        const el = root.querySelector("#typeErr");
        if(el) el._typing = false;
      }
    },

    /* ========== DESAIN 3 — LOADING BAR ========== */
    {
      html: `
      <div style="text-align:center;padding-top:80px;">
        <h1 style="font-size:70px;margin-bottom:10px;">404</h1>
        <p>Memuat halaman... gagal!</p>
        <div style="width:80%;max-width:400px;height:10px;background:#ddd;margin:20px auto;border-radius:10px;overflow:hidden;">
          <div id="bar404" style="height:100%;width:0%;background:#ff0066;"></div>
        </div>
        <a href="/" style="padding:10px 20px;border:1px solid #ff0066;color:#ff0066;text-decoration:none;">Kembali</a>
      </div>
      `,
      init: function(root){
        const bar = root.querySelector("#bar404");
        let w = 0;
        bar._int = setInterval(()=>{
          if(w >= 100) clearInterval(bar._int);
          w += 5;
          bar.style.width = w + "%";
        },80);
      },
      destroy: function(root){
        const bar = root.querySelector("#bar404");
        if(bar && bar._int) clearInterval(bar._int);
      }
    },

    /* ========== DESAIN 4 — EMOJI SHAKE ========== */
    {
      html: `
      <div style="text-align:center;padding-top:50px;font-family:sans-serif;">
        <div id="emo404" style="font-size:70px;">😢</div>
        <h2>404 - Halaman Ga Ketemu</h2>
        <p>Mungkin sudah dipindahkan atau dihapus...</p>
        <a href="/" style="padding:10px 20px;border:1px solid #333;text-decoration:none;">Balik ke Beranda</a>
      </div>
      `,
      init: function(root){
        const e = root.querySelector("#emo404");
        e._int = setInterval(()=>{
          e.style.transform = "translateX(" + ((Math.random()*8-4)|0) + "px)";
        },120);
      },
      destroy: function(root){
        const e = root.querySelector("#emo404");
        if(e && e._int) clearInterval(e._int);
      }
    },

    /* ========== DESAIN 5 — MATRIX RAIN ========== */
    {
      html: `
      <div style="height:100vh;background:black;color:#0f0;overflow:hidden;font-family:monospace;position:relative;">
        <canvas id="matrix404" style="display:block;width:100%;height:100%;"></canvas>
        <div style="position:absolute;top:40%;width:100%;text-align:center;color:#0f0;">
          <h1 style="font-size:50px;">404</h1>
          <p>Halaman tidak ditemukan...</p>
          <a href="/" style="color:#0f0;text-decoration:underline;">Kembali</a>
        </div>
      </div>
      `,
      init: function(root){
        const c = root.querySelector("#matrix404");
        const ctx = c.getContext("2d");

        c.width = window.innerWidth;
        c.height = window.innerHeight;

        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@$%&*".split("");
        const font = 12;
        let columns = Math.floor(c.width / font);
        let drops = Array(columns).fill(1);

        function draw(){
          ctx.fillStyle = "rgba(0,0,0,0.08)";
          ctx.fillRect(0,0,c.width,c.height);
          ctx.fillStyle = "#0f0";
          ctx.font = font+"px monospace";

          for(let i=0;i<drops.length;i++){
            const char = chars[Math.floor(Math.random()*chars.length)];
            ctx.fillText(char, i*font, drops[i]*font);

            if(drops[i]*font > c.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
          }

          c._raf = requestAnimationFrame(draw);
        }

        draw();
      },
      destroy: function(root){
        const c = root.querySelector("#matrix404");
        if(c && c._raf) cancelAnimationFrame(c._raf);
      }
    }

  ];

  // ===========================
  // PICK RANDOM
  // ===========================
  const idx = Math.floor(Math.random() * designs.length);
  container.innerHTML = designs[idx].html;

  // INIT DESIGN
  try { designs[idx].init(container); } catch(e){}

})();
