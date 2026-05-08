const TOOLS = {

  "about-us": createTool({
    title: "About Us Generator",
    color: "#3498db",
    button: "Generate About Us",
    result: "hasilAbout",
    action: "generateAbout()"
  }),

  "contact-us": createTool({
    title: "Contact Us Generator",
    color: "#e67e22",
    button: "Generate Contact Us",
    result: "hasilContact",
    action: "generateContact()"
  }),

  "terms": createTool({
    title: "Terms & Conditions Generator",
    color: "#8e44ad",
    button: "Generate Terms",
    result: "hasilTerms",
    action: "generateTerms()"
  }),

  "privacy-policy": createTool({
    title: "Privacy Policy Generator",
    color: "#2ecc71",
    button: "Generate Privacy Policy",
    result: "hasilPP",
    action: "generatePP()"
  })

};



/* =========================
GLOBAL TEMPLATE TOOL
========================= */

function createTool(data){

return `

<div class="tool-box">

<h2>${data.title}</h2>

<input type="text" id="nama" placeholder="Nama Website">

<input type="text" id="url" placeholder="URL Website">

<input type="text" id="owner" placeholder="Nama Pemilik">

<input type="text" id="alamat" placeholder="Alamat">

<input type="text" id="wa" placeholder="Nomor WhatsApp">

<input type="email" id="email" placeholder="Email">

<select id="language">
  <option value="id">
    🇮🇩 Indonesia
  </option>

  <option value="en">
    🇺🇸 English
  </option>
</select>

<button
style="background:${data.color}"
onclick="${data.action}"
>
${data.button}
</button>

<textarea
id="${data.result}"
placeholder="Hasil generate akan muncul di sini..."
></textarea>

<button
class="copy-btn"
onclick="copyText('${data.result}')"
>
Copy
</button>

</div>



<style>

.tool-box{
  max-width:700px;
  margin:auto;
  padding:15px;
  font-family:Arial;
}

.tool-box input,
.tool-box textarea,
.tool-box select{
  width:100%;
  margin:8px 0;
  padding:12px;
  border-radius:10px;
  border:1px solid #ccc;
  box-sizing:border-box;
  font-size:15px;
}

.tool-box button{
  width:100%;
  padding:12px;
  border:none;
  border-radius:10px;
  color:#fff;
  font-size:15px;
  cursor:pointer;
  margin-top:8px;
}

.tool-box textarea{
  height:300px;
  resize:none;
}

.copy-btn{
  background:#111 !important;
}

</style>

`;

}





/* =========================
GLOBAL DATA
========================= */

function getGlobalData(){

return {

nama:
document.getElementById("nama").value,

url:
document.getElementById("url").value,

owner:
document.getElementById("owner").value,

alamat:
document.getElementById("alamat").value,

wa:
document.getElementById("wa").value,

email:
document.getElementById("email").value,

tanggal:
new Date().toLocaleDateString()

};

}





/* =========================
ABOUT US
========================= */

function generateAbout(){

const d = getGlobalData();

const lang =
document.getElementById("language").value;

let hasil = "";

if(lang === "id"){

hasil = `

[INDONESIA]

Nama Website:
${d.nama}

URL:
${d.url}

Owner:
${d.owner}

Tanggal:
${d.tanggal}

=== ISI ABOUT US ===

`;

}else{

hasil = `

[ENGLISH]

Website Name:
${d.nama}

Website URL:
${d.url}

Owner:
${d.owner}

Date:
${d.tanggal}

=== ABOUT US CONTENT ===

`;

}

document.getElementById("hasilAbout").value =
hasil;

}





/* =========================
CONTACT US
========================= */

function generateContact(){

const d = getGlobalData();

const lang =
document.getElementById("language").value;

let hasil = "";

if(lang === "id"){

hasil = `

[INDONESIA]

Nama:
${d.nama}

Alamat:
${d.alamat}

WhatsApp:
${d.wa}

Email:
${d.email}

=== ISI CONTACT US ===

`;

}else{

hasil = `

[ENGLISH]

Website:
${d.nama}

Address:
${d.alamat}

WhatsApp:
${d.wa}

Email:
${d.email}

=== CONTACT CONTENT ===

`;

}

document.getElementById("hasilContact").value =
hasil;

}





/* =========================
TERMS
========================= */

function generateTerms(){

const d = getGlobalData();

const lang =
document.getElementById("language").value;

let hasil = "";

if(lang === "id"){

hasil = `

[INDONESIA]

Nama:
${d.nama}

URL:
${d.url}

Tanggal:
${d.tanggal}

=== ISI TERMS & CONDITIONS ===

`;

}else{

hasil = `

[ENGLISH]

Website:
${d.nama}

URL:
${d.url}

Date:
${d.tanggal}

=== TERMS CONTENT ===

`;

}

document.getElementById("hasilTerms").value =
hasil;

}





/* =========================
PRIVACY POLICY
========================= */

function generatePP(){

const d = getGlobalData();

const lang =
document.getElementById("language").value;

let hasil = "";

if(lang === "id"){

hasil = `

[INDONESIA]

Nama:
${d.nama}

URL:
${d.url}

Email:
${d.email}

Tanggal:
${d.tanggal}

=== ISI PRIVACY POLICY ===

`;

}else{

hasil = `

[ENGLISH]

Website:
${d.nama}

URL:
${d.url}

Email:
${d.email}

Date:
${d.tanggal}

=== PRIVACY POLICY CONTENT ===

`;

}

document.getElementById("hasilPP").value =
hasil;

}





/* =========================
COPY
========================= */

function copyText(id){

const teks =
document.getElementById(id);

teks.select();

document.execCommand("copy");

alert("Berhasil di copy!");

}
