document.addEventListener("DOMContentLoaded", function () {
  const FEED = "https://safelink-aza.blogspot.com/feeds/posts/default?alt=json-in-script"; // feed blog safelink
  const HOST = "https://safelink-aza.blogspot.com/"; // base safelink
  const PARAM = "to"; // nama parameter
  const EXCEPT = ["blogger.com","facebook.com","instagram.com","google.com","twitter.com","mailto:","javascript:"];

  function u2b(s){ try{ return btoa(unescape(encodeURIComponent(s))); }catch(e){ return btoa(s); } }

  // ambil random post dari feed JSONP
  function randomFromFeed(data){
    try{
      const entries = data.feed.entry || [];
      if(!entries.length) return "";
      const pick = entries[Math.floor(Math.random()*entries.length)];
      const linkObj = pick.link.find(l=>l.rel==="alternate");
      return linkObj ? linkObj.href : "";
    }catch(e){ return ""; }
  }

  // replace semua link eksternal
  function replaceLinks(randomPost){
    document.querySelectorAll("a[href^='http']").forEach(a=>{
      const href = a.href;
      if(EXCEPT.some(ex=>href.includes(ex))) return;
      if(randomPost==="") return;
      const enc = u2b(href);
      const url = HOST + randomPost.replace(HOST,"") + "?" + PARAM + "=" + encodeURIComponent(enc);
      a.href = url;
      a.target="_blank";
      a.rel="noopener noreferrer";
    });
  }

  // JSONP fetch
  const cbName = "__asl_cb_"+Math.random().toString(36).slice(2);
  window[cbName] = function(data){ 
    replaceLinks(randomFromFeed(data)); 
    delete window[cbName];
  };
  const s = document.createElement("script");
  s.src = FEED + "&callback=" + cbName;
  document.head.appendChild(s);
});
