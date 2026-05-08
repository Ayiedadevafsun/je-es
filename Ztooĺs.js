const TOOLS = {

  "about-us": `

<div class="about-tool">
  <h2>About Us Generator</h2>

  <input type="text" id="nama" placeholder="Nama Situs">
  <input type="text" id="url" placeholder="URL Situs">
  <input type="text" id="owner" placeholder="Nama Pemilik / Admin">
  <input type="text" id="deskripsi" placeholder="Deskripsi singkat situs">
  <input type="email" id="email" placeholder="Email Kontak">

  <button onclick="generateAbout()">Generate</button>
  <button onclick="copyAbout()">Copy</button>

  <textarea id="hasilAbout" placeholder="Hasil akan muncul di sini..."></textarea>
</div>

<style>
.about-tool{
  max-width:700px;
  margin:auto;
  padding:15px;
  font-family:Arial;
}
.about-tool input,
.about-tool textarea{
  width:100%;
  margin:8px 0;
  padding:10px;
  border-radius:8px;
  border:1px solid #ccc;
  box-sizing:border-box;
}
.about-tool button{
  padding:10px 15px;
  margin:5px 3px;
  border:none;
  border-radius:8px;
  background:#3498db;
  color:#fff;
  cursor:pointer;
}
.about-tool textarea{
  height:300px;
}
</style>

`,

  "contact-us": `

<div class="contact-tool">
  <h2>Contact Page Generator</h2>

  <input type="text" id="namaWeb" placeholder="Nama Website">
  <input type="text" id="alamat" placeholder="Alamat">
  <input type="email" id="emailKontak" placeholder="Email">
  <input type="text" id="wa" placeholder="WhatsApp">
  <input type="text" id="jam" placeholder="Jam Operasional">

  <button onclick="generateContact()">Generate</button>
  <button onclick="copyContact()">Copy</button>

  <textarea id="hasilContact"></textarea>
</div>

<style>
.contact-tool{
  max-width:700px;
  margin:auto;
  padding:15px;
  font-family:Arial;
}
.contact-tool input,
.contact-tool textarea{
  width:100%;
  margin:8px 0;
  padding:10px;
  border-radius:8px;
  border:1px solid #ccc;
  box-sizing:border-box;
}
.contact-tool button{
  padding:10px 15px;
  margin:5px;
  border:none;
  border-radius:8px;
  background:#e67e22;
  color:#fff;
  cursor:pointer;
}
.contact-tool textarea{
  height:320px;
}
</style>

`,

  "terms": `

<div class="legal-tool">
  <h2>Terms & Conditions Generator</h2>

  <input type="text" id="t_siteName" placeholder="Nama Website">
  <input type="text" id="t_siteUrl" placeholder="URL Website">
  <input type="email" id="t_siteEmail" placeholder="Email Kontak">

  <select id="language">
    <option value="id">🇮🇩 Indonesia</option>
    <option value="en">🇺🇸 English</option>
  </select>

  <button onclick="generateTerms()">Generate Terms</button>

  <textarea id="hasilTerms"></textarea>

  <button onclick="copyText('hasilTerms')">Copy</button>
</div>

<style>
.legal-tool{
  max-width:700px;
  margin:auto;
  padding:15px;
  font-family:Arial;
}
.legal-tool input,
.legal-tool textarea,
.legal-tool select{
  width:100%;
  margin:8px 0;
  padding:12px;
  border-radius:10px;
  border:1px solid #ccc;
  box-sizing:border-box;
}
.legal-tool button{
  padding:12px 18px;
  margin:5px 0;
  border:none;
  border-radius:10px;
  background:#8e44ad;
  color:#fff;
  cursor:pointer;
  width:100%;
}
.legal-tool textarea{
  height:260px;
}
</style>

`,

  "privacy-policy": `

<div class="pp-tool">
  <h2>Privacy Policy Generator</h2>

  <input type="text" id="judul" placeholder="Judul Situs">
  <input type="text" id="link" placeholder="Link Situs">
  <input type="email" id="emailPP" placeholder="Email">

  <button onclick="generatePP()">Generate</button>
  <button onclick="copyPP()">Copy</button>

  <textarea id="hasilPP"></textarea>
</div>

<style>
.pp-tool{
  max-width:700px;
  margin:auto;
  padding:15px;
  font-family:Arial;
}
.pp-tool input,
.pp-tool textarea{
  width:100%;
  margin:8px 0;
  padding:10px;
  border:1px solid #ccc;
  border-radius:8px;
  box-sizing:border-box;
}
.pp-tool button{
  padding:10px 15px;
  margin:5px 3px;
  border:none;
  border-radius:8px;
  background:#2ecc71;
  color:#fff;
  cursor:pointer;
}
.pp-tool textarea{
  height:300px;
}
</style>

`

};





/* =========================
ABOUT US
========================= */

function generateAbout(){

  var nama = document.getElementById("nama").value;
  var url = document.getElementById("url").value;
  var owner = document.getElementById("owner").value;
  var deskripsi = document.getElementById("deskripsi").value;
  var email = document.getElementById("email").value;

  var hasil = `
<h1>Tentang Kami</h1>

<p>Selamat datang di <strong>${nama}</strong>!</p>

<p>${nama} adalah platform yang menyediakan ${deskripsi}.</p>

<p>Dikelola oleh <strong>${owner}</strong>.</p>

<h3>Kontak</h3>

<p>Email:
<a href="mailto:${email}">
${email}
</a>
</p>

<p>
Website:
<a href="${url}" target="_blank">
${url}
</a>
</p>
`;

  document.getElementById("hasilAbout").value = hasil;
}

function copyAbout(){

  var teks = document.getElementById("hasilAbout");

  teks.select();

  document.execCommand("copy");

  alert("Berhasil di copy!");
}





/* =========================
CONTACT US
========================= */

function generateContact(){

  var nama = document.getElementById("namaWeb").value;
  var alamat = document.getElementById("alamat").value;
  var email = document.getElementById("emailKontak").value;
  var wa = document.getElementById("wa").value;
  var jam = document.getElementById("jam").value;

  var hasil = `
<h1>Hubungi Kami</h1>

<p>Website:
<strong>${nama}</strong>
</p>

<ul>
<li>Email: ${email}</li>
<li>WhatsApp: ${wa}</li>
<li>Alamat: ${alamat}</li>
<li>Jam Operasional: ${jam}</li>
</ul>
`;

  document.getElementById("hasilContact").value = hasil;
}

function copyContact(){

  var teks = document.getElementById("hasilContact");

  teks.select();

  document.execCommand("copy");

  alert("Berhasil di copy!");
}





/* =========================
TERMS
========================= */

function generateTerms(){

  var nama  = document.getElementById("t_siteName").value;
  var url   = document.getElementById("t_siteUrl").value;
  var email = document.getElementById("t_siteEmail").value;
  var lang  = document.getElementById("language").value;

  let terms = "";

  if(lang === "id"){

    terms = `
<h1>Syarat & Ketentuan ${nama}</h1>

<p>Dengan mengakses website ini Anda setuju terhadap syarat berikut.</p>

<p>Website:
${url}</p>

<p>Email:
${email}</p>
`;

  } else {

    terms = `
<h1>Terms & Conditions ${nama}</h1>

<p>By accessing this website you agree to the following terms.</p>

<p>Website:
${url}</p>

<p>Email:
${email}</p>
`;

  }

  document.getElementById("hasilTerms").value = terms;
}

function copyText(id){

  var teks = document.getElementById(id);

  teks.select();

  document.execCommand("copy");

  alert("Berhasil di copy!");
}





/* =========================
PRIVACY POLICY
========================= */

function generatePP(){

  var judul = document.getElementById("judul").value;
  var link = document.getElementById("link").value;
  var email = document.getElementById("emailPP").value;

  var hasil = `
<h1>Privacy Policy</h1>

<p>Privacy Policy untuk ${judul}</p>

<p>Website:
${link}</p>

<p>Email:
${email}</p>
`;

  document.getElementById("hasilPP").value = hasil;
}

function copyPP(){

  var teks = document.getElementById("hasilPP");

  teks.select();

  document.execCommand("copy");

  alert("Berhasil di copy!");
}
