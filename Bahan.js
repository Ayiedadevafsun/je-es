const TOOLS = {

"about-us": `

<div id="about-us" class="tool-page">

<div class="legal-tool">
<h2>About Us Generator</h2>

<input type="text" id="nama" placeholder="Nama Situs">
<input type="text" id="url" placeholder="URL Situs">
<input type="text" id="owner" placeholder="Nama Pemilik / Admin">
<input type="text" id="deskripsi" placeholder="Deskripsi singkat situs">
<input type="email" id="email" placeholder="Email Kontak">

<select id="about_language">
<option value="id">🇮🇩 Indonesia</option>
<option value="en">🇺🇸 English</option>
</select>

<button onclick="generateAbout()">Generate About</button>
<button onclick="copyAbout()">Copy</button>

<textarea id="hasilAbout" placeholder="Hasil akan muncul di sini..."></textarea>
</div>

</div>
`,

"contact-us": `

<div id="contact-us" class="tool-page">

<div class="contact-tool">
<h2>Contact Page Generator</h2>

<input type="text" id="namaWeb" placeholder="Nama Website">
<input type="text" id="alamat" placeholder="Alamat (opsional)">
<input type="email" id="emailKontak" placeholder="Email Tujuan">
<input type="text" id="wa" placeholder="Nomor WhatsApp (628xxxx)">
<input type="text" id="jam" placeholder="Jam Operasional">

<select id="contact_language">
<option value="id">🇮🇩 Indonesia</option>
<option value="en">🇺🇸 English</option>
</select>

<button onclick="generateContactTool()">Generate Contact</button>
<button onclick="copyContactTool()">Copy</button>

<textarea id="hasilContact"></textarea>
</div>

</div>
`,

"privacy-policy": `

<div id="privacy-policy" class="tool-page">

<div class="pp-tool">
<h2>Privacy Policy Generator</h2>

<input type="text" id="judul" placeholder="Judul Situs">
<input type="text" id="link" placeholder="Link Situs">
<input type="email" id="pp_email" placeholder="Email Anda">

<select id="pp_language">
<option value="id">🇮🇩 Indonesia</option>
<option value="en">🇺🇸 English</option>
</select>

<button onclick="generatePP()">Generate</button>
<button onclick="copyPP()">Copy</button>

<textarea id="hasil"></textarea>

</div>

</div>
`,

"disclaimer": `

<div id="disclaimer" class="tool-page">

<div class="legal-tool">

<h2>Disclaimer Generator</h2>

<input type="text" id="d_siteName" placeholder="Nama Website">
<input type="text" id="d_siteUrl" placeholder="URL Website">

<select id="language">
<option value="id">🇮🇩 Indonesia</option>
<option value="en">🇺🇸 English</option>
</select>

<button onclick="generateDisclaimer()">
Generate Disclaimer
</button>

<textarea id="hasilDisclaimer"></textarea>

<button onclick="copyText('hasilDisclaimer')">
Copy
</button>

</div>

</div>
`,

"terms": `

<div id="terms" class="tool-page">

<div class="legal-tool">

<h2>Terms & Conditions Generator</h2>

<input type="text" id="t_siteName" placeholder="Nama Website">
<input type="text" id="t_siteUrl" placeholder="URL Website">
<input type="email" id="t_siteEmail" placeholder="Email Kontak">

<select id="terms_language">
<option value="id">🇮🇩 Indonesia</option>
<option value="en">🇺🇸 English</option>
</select>

<button onclick="generateTerms()">
Generate Terms
</button>

<textarea id="hasilTerms"></textarea>

<button onclick="copyText('hasilTerms')">
Copy
</button>

</div>

</div>
`,

"dmca": `

<div id="dmca" class="tool-page">

<div class="legal-tool">

<h2>DMCA Policy Generator</h2>

<input type="text" id="dmca_siteName" placeholder="Nama Website">
<input type="text" id="dmca_siteUrl" placeholder="URL Website">
<input type="email" id="dmca_siteEmail" placeholder="Email Kontak">

<select id="dmca_language">
<option value="id">🇮🇩 Indonesia</option>
<option value="en">🇺🇸 English</option>
</select>

<button onclick="generateDmca()">
Generate DMCA
</button>

<textarea id="hasilDmca"></textarea>

<button onclick="copyText('hasilDmca')">
Copy
</button>

</div>

</div>
`

};

/* =========================
FUNCTIONS
========================= */

function generateAbout(){

var nama = document.getElementById("nama").value;
var url = document.getElementById("url").value;
var owner = document.getElementById("owner").value;
var deskripsi = document.getElementById("deskripsi").value;
var email = document.getElementById("email").value;
var lang = document.getElementById("about_language").value;

let hasil = "";

if(lang === "id"){

hasil = `
<h1>ISI Tentang Kami</h1>
`;

}else{

hasil = `
<h1>About Us</h1>
<p>ISI_ABOUT_ENGLISH!</p>
`;

}

document.getElementById("hasilAbout").value = hasil;

}

function copyAbout(){

var teks = document.getElementById("hasilAbout");

teks.select();

document.execCommand("copy");

alert("Berhasil di copy!");

}

function generateContactTool(){

var nama = document.getElementById("namaWeb").value;
var alamat = document.getElementById("alamat").value;
var email = document.getElementById("emailKontak").value;
var wa = document.getElementById("wa").value;
var jam = document.getElementById("jam").value;
var lang = document.getElementById("contact_language").value;

let contact = "";

if(lang === "id"){

contact = `
<h1>ISI Hubungi Kami</h1>
`;

}else{

contact = `
<h1>ISI Contact Us</h1>
`;

}

document.getElementById("hasilContact").value = contact;

}

function copyContactTool(){

var teks = document.getElementById("hasilContact");

navigator.clipboard.writeText(teks.value);

alert("Berhasil di copy!");

}

function generatePP(){

var judul = document.getElementById("judul").value;
var link = document.getElementById("link").value;
var email = document.getElementById("pp_email").value;
var lang = document.getElementById("pp_language").value;

let hasil = "";

if(lang === "id"){

hasil = `
<h1>ISI Kebijakan Privasi</h1>
`;

}else{

hasil = `
<h1>ISI Privacy Policy</h1>
`;

}

document.getElementById("hasil").value = hasil;

}

function copyPP(){

var teks = document.getElementById("hasil");

teks.select();

document.execCommand("copy");

alert("Berhasil di copy!");

}

function generateDisclaimer(){

var nama = document.getElementById("d_siteName").value;
var lang = document.getElementById("language").value;

let disclaimer = "";

if(lang === "id"){

disclaimer = `
<h1>Disclaimer untuk ${nama}</h1>
`;

}else{

disclaimer = `
<h1>Disclaimer for ${nama}</h1>
`;

}

document.getElementById("hasilDisclaimer").value = disclaimer;

}

function generateTerms(){

var nama = document.getElementById("t_siteName").value;
var lang = document.getElementById("terms_language").value;

let terms = "";

if(lang === "id"){

terms = `
<h1>Syarat & Ketentuan ${nama}</h1>
`;

}else{

terms = `
<h1>Terms & Conditions ${nama}</h1>
`;

}

document.getElementById("hasilTerms").value = terms;

}

function generateDmca(){

var nama = document.getElementById("dmca_siteName").value;
var lang = document.getElementById("dmca_language").value;

let dmca = "";

if(lang === "id"){

dmca = `
<h1>DMCA Policy ${nama}</h1>
`;

}else{

dmca = `
<h1>DMCA Policy ${nama}</h1>
`;

}

document.getElementById("hasilDmca").value = dmca;

}

function copyText(id){

var teks = document.getElementById(id);

teks.select();

document.execCommand("copy");

alert("Berhasil di copy!");

}
