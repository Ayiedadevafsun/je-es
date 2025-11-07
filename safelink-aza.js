(function(){
  // autosafelink.js - minimal JSONP random safelink + base64
  function log(){ if(window.console) console.log.apply(console, ['[autosafelink]'].concat(Array.prototype.slice.call(arguments))); }
  var cfg = window.autoSafeLink || {};
  var exList = (cfg.linkException||'').split(',').map(function(s){return s.trim();}).filter(Boolean);
  var onlyThis = (cfg.onlyThisLink||'').trim();
  var scfg = cfg.safeLinkConfig || {};
  var feed = (scfg.feed || '').replace(/\/*$/,'');
  var param = scfg.param || 'f';

  if(!feed){ log('no feed set (safeLinkConfig.feed)'); return; }

  // JSONP fetch
  function jsonp(u,cb,timeout){
    timeout = timeout||8000;
    var cname = '__asl_cb_'+Math.random().toString(36).slice(2);
    window[cname] = function(d){ clean(); cb(null,d); };
    var s = document.createElement('script');
    s.src = u + (u.indexOf('?')===-1 ? '?' : '&') + 'alt=json-in-script&callback=' + cname;
    s.onerror = function(){ clean(); cb(new Error('jsonp error')); };
    var t = setTimeout(function(){ clean(); cb(new Error('timeout')); }, timeout);
    function clean(){ try{ delete window[cname]; }catch(e){} if(s.parentNode) s.parentNode.removeChild(s); clearTimeout(t); }
    (document.head||document.documentElement).appendChild(s);
  }

  // pick random post link from feed JSONP response
  function pickRandom(feedData){
    try{
      var entries = (feedData && (feedData.feed?feedData.feed.entry:feedData.entry))||[];
      if(!entries.length) return null;
      var pick = entries[Math.floor(Math.random()*entries.length)];
      if(Array.isArray(pick.link)){
        for(var i=0;i<pick.link.length;i++){
          if(pick.link[i].rel==='alternate' && pick.link[i].href) return pick.link[i].href;
        }
      }
      if(pick.link && pick.link.href) return pick.link.href;
      if(pick.id && pick.id.$t) return pick.id.$t;
    }catch(e){}
    return null;
  }

  // unicode-safe base64
  function u2b(s){
    try { return btoa(unescape(encodeURIComponent(s))); } catch(e){ try { return btoa(s); } catch(e2){ return encodeURIComponent(s); } }
  }

  // should skip?
  function skipHref(h){
    if(!h) return true;
    var x = h.trim();
    if(x.indexOf('#')===0) return true;
    for(var i=0;i<exList.length;i++) if(x.indexOf(exList[i])!==-1) return true;
    if(onlyThis && onlyThis.length && x.indexOf(onlyThis)===-1) return true;
    return false;
  }

  // replace links: baseTarget is full post URL (e.g. https://safelink-aza.blogspot.com/post.html)
  function replaceLinks(baseTarget){
    if(!baseTarget) baseTarget = feed.replace(/\/feeds\/posts\/default$/,'/') || '';
    // ensure baseTarget ends with slash or filename
    document.querySelectorAll('a[href]').forEach(function(a){
      try{
        var raw = a.getAttribute('href');
        if(skipHref(raw)) return;
        var abs = new URL(raw, location.href).href;
        // skip if already pointing to baseTarget
        if(abs.indexOf(baseTarget) !== -1) return;
        var enc = u2b(abs);
        var sep = (baseTarget.indexOf('?')===-1)?'?':'&';
        a.href = baseTarget + sep + param + '=' + encodeURIComponent(enc);
        a.target = '_blank'; a.rel = 'noopener noreferrer';
      }catch(e){}
    });
    log('done replace');
  }

  // run: jsonp feed -> pick random -> replaceLinks
  jsonp(feed, function(err,data){
    if(err){ log('jsonp failed, trying fetch fallback',err); // try fetch
      try{
        fetch(feed + '?alt=json').then(function(r){ return r.json(); }).then(function(j){
          var l = pickRandom(j);
          replaceLinks(l);
        }).catch(function(){ replaceLinks(); });
      }catch(e){ replaceLinks(); }
      return;
    }
    var post = pickRandom(data);
    replaceLinks(post);
  });
})();
