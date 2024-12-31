/*
* ======================================================================
* ----------------------------------------------------------------------
* zFPmenu:    zon Fixed-Position Navigation/Share Menu
* Author:    zon
* Website:    http://www.sagitasoft.com
* ----------------------------------------------------------------------
* You may use and/or modify the codes below and its associated files
* as long as you leave the author credit remain intact
* ----------------------------------------------------------------------
* ======================================================================
*/
/*
* ----------------------------------------------------------------------
* Credits:
* 1. CSS Drop-Down Menu by Live Web Institute (http://www.lwis.net)
* 2. Scrolling with jQuery by Codrops (http://tympanus.net/codrops)
* 3. addLoadEvent by Simon Willison (http://simonwillison.net/)
* 4. jQuery by jQuery Javascript Library (http://www.jquery.com)
* ----------------------------------------------------------------------
*/


/*
// user variable:
// ---------------------------------------------------------------------
var zfpm_colorTheme = 'dark';            // 'dark' or 'light'
var zfpm_customBackgroundImage = '';    // example: 'http://example.com/path/to/image.jpg'
var zfpm_customBackgroundColor = '';    // example: '#FFFFFF'
var zfpm_shareBox = 'yes';                // 'yes' or 'no'
var zfpm_shareBoxPosition = 'left';        // 'left' or 'right'
var zfpm_shareBoxCustomWidth = '';        // example: '300'
var zfpm_waitForPageLoad = 'yes';        // 'yes' or 'no'
var zfpm_ieUpgradeMessage = 'yes';        // 'yes' or 'no'
var zfpm_ieUpgradeMessageText = '';        // example: 'Please upgrade'
var zfpm_ieUpgradeMessageForIe6or7 = 6;    // 6 or 7 (number only, without quotes)
// self hosted
var zfpm_rootLocation = '';
var zfpm_jsLocation = '';
var zfpm_cssLocation = '';
var zfpm_imgLocation = '';
*/


// check container element
// ---------------------------------------------------------------------
if (document.getElementById('zfpm_div') == null) {
    var zfpm_divTag = document.createElement('div');
    zfpm_divTag.id = 'zfpm_div';
    zfpm_divTag.style.display = 'none';
    bodyElement.appendChild(zfpm_divTag);
} else {
    zfpm_divTag = document.getElementById('zfpm_div');
    zfpm_divTag.style.display = 'none';
}
if (document.getElementById('zfpm_ul') == null) {
    var zfpm_ulTag = document.createElement('ul');
    zfpm_ulTag.id = 'zfpm_ul';
    zfpm_divTag.appendChild(zfpm_ulTag);
} else {
    zfpm_ulTag = document.getElementById('zfpm_ul');
}


// get the head and body element
// ---------------------------------------------------------------------
var headElement = document.getElementsByTagName('head')[0];
var bodyElement = document.getElementsByTagName('body')[0];


// set folder location
// ---------------------------------------------------------------------
if (typeof zfpm_rootLocation != 'undefined') {
    if (zfpm_rootLocation != '') {
        var zfpm_rootFolder = zfpm_rootLocation;
        } else {
        var zfpm_rootFolder = 'http://zfpmenu.googlecode.com/svn/trunk/';
    }
    } else {
    var zfpm_rootFolder = 'http://zfpmenu.googlecode.com/svn/trunk/';
}
if (typeof zfpm_jsLocation != 'undefined') {
    if (zfpm_jsLocation != '') {
        var zfpm_jsFolder = zfpm_jsLocation;
        } else {
        var zfpm_jsFolder = zfpm_rootFolder+'js/';
    }
    } else {
    var zfpm_jsFolder = zfpm_rootFolder+'js/';
}
if (typeof zfpm_cssLocation != 'undefined') {
    if (zfpm_cssLocation != '') {
        var zfpm_cssFolder = zfpm_cssLocation;
        } else {
        var zfpm_cssFolder = zfpm_rootFolder+'css/';
    }
    } else {
    var zfpm_cssFolder = zfpm_rootFolder+'css/';
}
if (typeof zfpm_imgLocation != 'undefined') {
    if (zfpm_imgLocation != '') {
        var zfpm_imgFolder = zfpm_imgLocation;
        } else {
        var zfpm_imgFolder = zfpm_rootFolder+'img/';
    }
    } else {
    var zfpm_imgFolder = zfpm_rootFolder+'img/';
}


// preload images
// ---------------------------------------------------------------------
// check custom background image
if (typeof zfpm_customBackgroundImage != 'undefined') {
    if (zfpm_customBackgroundImage != '') {
        var zfpm_bgImageDark = zfpm_customBackgroundImage;
        var zfpm_bgImageLight = zfpm_customBackgroundImage;
    } else {
        var zfpm_bgImageDark = zfpm_imgFolder+'bg-dark.png';
        var zfpm_bgImageLight = zfpm_imgFolder+'bg-light.png';
    }
} else {
    var zfpm_bgImageDark = zfpm_imgFolder+'bg-dark.png';
    var zfpm_bgImageLight = zfpm_imgFolder+'bg-light.png';
}

var zfpm_Img = new Array();
function zfpm_preloadImages() {
    for (i = 0; i < zfpm_preloadImages.arguments.length; i++) {
        zfpm_Img[i] = new Image()
        zfpm_Img[i].src = zfpm_preloadImages.arguments[i]
    }
}
zfpm_preloadImages(
zfpm_imgFolder+'arrow-menu-box-dark.png',
zfpm_imgFolder+'arrow-menu-box-light.png',
zfpm_imgFolder+'arrow-menu-dir-right-dark.png',
zfpm_imgFolder+'arrow-menu-dir-right-light.png',
zfpm_imgFolder+'arrow-menu-dir-up-dark.png',
zfpm_imgFolder+'arrow-menu-dir-up-light.png',
zfpm_imgFolder+'arrow-scroll-bottom-dark.png',
zfpm_imgFolder+'arrow-scroll-bottom-light.png',
zfpm_imgFolder+'arrow-scroll-top-dark.png',
zfpm_imgFolder+'arrow-scroll-top-light.png',
zfpm_bgImageDark,
zfpm_bgImageLight,
zfpm_imgFolder+'info.png'
);


// theme selection check
// ---------------------------------------------------------------------
var zfpm_theme = '';
if (typeof zfpm_colorTheme != 'undefined') {
    if (zfpm_colorTheme == 'light') {
        var zfpm_theme = 'light';
    } else {
    var zfpm_theme = 'dark';
    }
} else {
    var zfpm_theme = 'dark';
}


// IE browser checking
// ---------------------------------------------------------------------
var IE6min = false;
var IE6plus = false;
var IE7plus = false;
var IE8plus = false;
function zfpm_getIeVer() {
    var rv = -1;
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re  = new RegExp('MSIE ([0-9]{1,}[\.0-9]{0,})');
        if (re.exec(ua) != null) {
            rv = parseFloat( RegExp.$1 );
        }
    }
    return rv;
}
var zfpm_IeVerValue = zfpm_getIeVer();
if ( zfpm_IeVerValue > -1 ) {
    if ( zfpm_IeVerValue >= 8.0 ) { IE8plus = true;
    } else if ( zfpm_IeVerValue >= 7.0 ) { IE7plus = true;
    } else if ( zfpm_IeVerValue >= 6.0 ) { IE6plus = true;
    } else { IE6min = true;
    }
}


// IE upgrade message
// ---------------------------------------------------------------------
/*
if (typeof zfpm_ieUpgradeMessageForIe6or7 == 'undefined') {
    var zfpm_ieUpgradeMessageForIe6or7 = 6;
}
*/

var zfpm_ieUpgradeMessageDiv;

if (typeof zfpm_ieUpgradeMessageForIe6or7 != 'undefined') {
    if (zfpm_ieUpgradeMessageForIe6or7 == 6) {
        var zfpm_ieUpgradeForVer = 6;
    } else if (zfpm_ieUpgradeMessageForIe6or7 == 7) {
        var zfpm_ieUpgradeForVer = 7;
    } else {
        var zfpm_ieUpgradeForVer = 6;
    }
} else {
    var zfpm_ieUpgradeForVer = 6;
}

var zfpm_ieUpgradeMessageTextDefault = ''
    +'Your are currently using OUTDATED VERSION of Internet Explorer browser!<br />'
    +'<a title="Go to the official Microsoft Internet Explorer website" target="_blank" href="http://www.microsoft.com/windows/internet-explorer/default.aspx">Please upgrade now</a> to the the latest version,<br />'
    +'or install other browsers: <a target="_blank" href="http://www.mozilla.com/en-US/?from=sfx&uid=267862&t=450">Mozilla Firefox</a>, '
    +'<a target="_blank" href="http://www.google.com/chrome/">Google Chrome</a>, '
    +'<a target="_blank" href="http://www.apple.com/safari/">Safari</a>, or '
    +'<a target="_blank" href="http://www.opera.com/browser/">Opera</a>.';
+'';

if (typeof zfpm_ieUpgradeMessageText != 'undefined') {
    if (zfpm_ieUpgradeMessageText != '') {
        var zfpm_ieUpgradeMessageHTML = zfpm_ieUpgradeMessageText;
    } else {
        var zfpm_ieUpgradeMessageHTML = zfpm_ieUpgradeMessageTextDefault;
    }
} else {
    var zfpm_ieUpgradeMessageHTML = zfpm_ieUpgradeMessageTextDefault;
}

function zfpm_writeIeUpgradeMessage() {
    zfpm_ieUpgradeMessageDiv = document.createElement('div');
    zfpm_ieUpgradeMessageDiv.style.cssText = 'text-align:center; padding:5px; border:1px solid #FFCC00; background-color:#FFEECC; font-weight:bold;';
    zfpm_ieUpgradeMessageDiv.innerHTML = zfpm_ieUpgradeMessageHTML;
}

function zfpm_showIeUpgradeMessage() {
    if (zfpm_ieUpgradeForVer == 6) {
        if ( IE6plus ) {
            zfpm_writeIeUpgradeMessage();
            bodyElement.insertBefore(zfpm_ieUpgradeMessageDiv,bodyElement.firstChild);
        }
    } else if (zfpm_ieUpgradeForVer == 7) {
        if ( IE7plus ) {
            zfpm_writeIeUpgradeMessage()
            bodyElement.insertBefore(zfpm_ieUpgradeMessageDiv,bodyElement.firstChild);
        }
    } else {
    }
}

function zfpm_confirmIeUpgradeMessage() {
    if (typeof zfpm_ieUpgradeMessage != 'undefined') {
        if (zfpm_ieUpgradeMessage == 'yes') {
            zfpm_showIeUpgradeMessage();
        }
    }
}

zfpm_confirmIeUpgradeMessage();


// css insertion
// ---------------------------------------------------------------------
var zfpm_generalCssLink = document.createElement('link');
zfpm_generalCssLink.type = 'text/css';
zfpm_generalCssLink.rel = 'stylesheet';
zfpm_generalCssLink.media = 'screen';
zfpm_generalCssLink.href = ''+zfpm_cssFolder+'zfpmenu.css';
headElement.appendChild(zfpm_generalCssLink);

function zfpm_putThemeCssLinkNode(zfpm_themeOption) {
    var zfpm_themeCssLink = document.createElement('link');
    zfpm_themeCssLink.type = 'text/css';
    zfpm_themeCssLink.rel = 'stylesheet';
    zfpm_themeCssLink.media = 'screen';
    zfpm_themeCssLink.href = ''+zfpm_cssFolder+'zfpmenu-'+zfpm_themeOption+'.css';
    headElement.appendChild(zfpm_themeCssLink);
}

function zfpm_putThemeStyleNode(zfpm_themeOption) {
    var zfpm_styleRules = ''
        +'#zfpm_div { background:url("'+zfpm_imgFolder+'bg-'+zfpm_themeOption+'.png") repeat; }'
        +'ul#zfpm_ul ul { background:url("'+zfpm_imgFolder+'bg-'+zfpm_themeOption+'.png") repeat; }'
        +'ul#zfpm_ul *.dir { background-image:url("'+zfpm_imgFolder+'arrow-menu-dir-up-'+zfpm_themeOption+'.png") !important; }'
        +'ul#zfpm_ul ul *.dir { background-image:url("'+zfpm_imgFolder+'arrow-menu-dir-right-'+zfpm_themeOption+'.png") !important; }'
        +'ul#zfpm_ul *.box { background-image:url("'+zfpm_imgFolder+'arrow-menu-box-'+zfpm_themeOption+'.png") !important; }'
        +'ul#zfpm_ul ul *.box { background-image:url("'+zfpm_imgFolder+'arrow-menu-box-'+zfpm_themeOption+'.png") !important; }'
        +'.zfpm_scrollBodyTopDiv { background-image:url("'+zfpm_imgFolder+'arrow-scroll-top-'+zfpm_themeOption+'.png") !important; }'
        +'.zfpm_scrollBodyBottomDiv { background-image:url("'+zfpm_imgFolder+'arrow-scroll-bottom-'+zfpm_themeOption+'.png") !important; }'
        +'';
    if (typeof zfpm_customBackgroundImage != 'undefined') {
        if (zfpm_customBackgroundImage != '') {
            zfpm_styleRules += '#zfpm_div, ul#zfpm_ul ul { background-image:url("'+zfpm_customBackgroundImage+'"); }';
        }
    }
    if (typeof zfpm_customBackgroundColor != 'undefined') {
        if (zfpm_customBackgroundColor != '') {
            zfpm_styleRules += '#zfpm_div, ul#zfpm_ul ul { background-color:'+zfpm_customBackgroundColor+'; }';
            zfpm_styleRules += '#zfpm_div, ul#zfpm_ul ul { background-image:none; }';
        }
    }
    var zfpm_style = document.createElement('style');
    zfpm_style.type = 'text/css';
    if (!!(window.attachEvent && !window.opera)) {
        zfpm_style.styleSheet.cssText = zfpm_styleRules;
    } else {
        var zfpm_styleText = document.createTextNode(zfpm_styleRules);
        zfpm_style.appendChild(zfpm_styleText);
    }
    headElement.appendChild(zfpm_style);
}

zfpm_putThemeCssLinkNode(zfpm_theme);
zfpm_putThemeStyleNode(zfpm_theme);


// separator
// ---------------------------------------------------------------------
var zfpm_navSpacerLi = document.createElement('li');
zfpm_navSpacerLi.id = 'zfpm_navSpacerLi';
zfpm_navSpacerLi.className = 'zfpm_trans';
zfpm_navSpacerLi.innerHTML = '&nbsp;';
zfpm_ulTag.appendChild(zfpm_navSpacerLi);


// info
// ---------------------------------------------------------------------
var zfpm_infoLi=document.createElement('li');
zfpm_infoLi.id = 'zfpm_infoLi';
zfpm_infoLi.className = 'zfpm_trans';
zfpm_infoLi.innerHTML = '<a id="zfpm_cp" class="zfpm_cp" onclick="this.blur();" href="http://caramudahdancepatmembuatsesuatu.blogspot.com/" title="Menu" target="_blank"><img alt="i" title="Menu" width="16" height="16" border="0" src="'+zfpm_imgFolder+'info.png" /></a>';
zfpm_ulTag.appendChild(zfpm_infoLi);


// share buttons
// ---------------------------------------------------------------------
var zfpm_shareLiTag;
var zfpm_shareBoxPosition;

if (typeof zfpm_shareBoxCustomWidth != 'undefined') {
    if (zfpm_shareBoxCustomWidth != '') {
        var zfpm_shareBoxWidth = zfpm_shareBoxCustomWidth;
    } else {
    var zfpm_shareBoxWidth = '270';
    }
} else {
    var zfpm_shareBoxWidth = '270';
}

var zfpm_shareLiHTML = '<ifr'+'ame id="zfpm_shareIframe" name="zfpm_shareIframe" class="zfpm_shareIframe" allowtransparency="yes" scrolling="no" src="http://www.linksalpha.com/social?link='+escape(location.href)+'" frameborder="0" height="20" width="'+zfpm_shareBoxWidth+'"></ifr'+'ame>';

function zfpm_removeShareLi() {
    if (document.getElementById('zfpm_shareLi') != null) {
        var zfpm_oldShareLiTag = document.getElementById('zfpm_shareLi');
        zfpm_ulTag.removeChild(zfpm_oldShareLiTag);
    }
}

function zfpm_newShareLi() {
    zfpm_shareLiTag = document.createElement('li');
    zfpm_shareLiTag.id = 'zfpm_shareLi';
}

function zfpm_putShareLi() {
    if (typeof zfpm_shareBoxPosition != 'undefined') {
        if (zfpm_shareBoxPosition == 'left') {
            zfpm_ulTag.insertBefore(zfpm_shareLiTag,zfpm_ulTag.firstChild);
        } else if (zfpm_shareBoxPosition == 'right') {
            zfpm_ulTag.insertBefore(zfpm_shareLiTag,document.getElementById('zfpm_infoLi'));
        } else {
            zfpm_ulTag.insertBefore(zfpm_shareLiTag,document.getElementById('zfpm_infoLi'));
        }
    } else {
        zfpm_ulTag.insertBefore(zfpm_shareLiTag,document.getElementById('zfpm_infoLi'));
    }
}

function zfpm_toggleShareBox(zfpm_shareBoxVisibility) {
    zfpm_removeShareLi();
    if (zfpm_shareBoxVisibility == 'show') {
        zfpm_newShareLi();
        zfpm_putShareLi();
        zfpm_shareLiTag.innerHTML = zfpm_shareLiHTML;
    }
}

function zfpm_confirmShareLi() {
    if (typeof zfpm_shareBox != 'undefined') {
        if (zfpm_shareBox == 'yes') {
            zfpm_toggleShareBox('show');
        }
    }
}


// scroll navigation
// ---------------------------------------------------------------------
var zfpm_scrollBodyLi = document.createElement('li');
zfpm_scrollBodyLi.id = 'zfpm_scrollBodyLi';
zfpm_scrollBodyLi.className = 'zfpm_trans';
zfpm_ulTag.appendChild(zfpm_scrollBodyLi);

var zfpm_scrollBodyBottomDiv = document.createElement('span');
zfpm_scrollBodyBottomDiv.style.display = 'none';
zfpm_scrollBodyBottomDiv.className = 'zfpm_scrollBodyBottomDiv';
zfpm_scrollBodyBottomDiv.id = 'zfpm_scrollBodyBottomDiv';
zfpm_scrollBodyBottomDiv.title = 'Go to bottom';

var zfpm_scrollBodyTopDiv = document.createElement('span');
zfpm_scrollBodyTopDiv.style.display = 'none';
zfpm_scrollBodyTopDiv.className = 'zfpm_scrollBodyTopDiv';
zfpm_scrollBodyTopDiv.id = 'zfpm_scrollBodyTopDiv';
zfpm_scrollBodyTopDiv.title = 'Go to top';

if ( IE7plus ) {
    zfpm_scrollBodyBottomDiv.style.display = 'inline';
    zfpm_scrollBodyTopDiv.style.display = 'inline';
}

var zfpm_scrollScript = document.createElement('scr'+'ipt');
zfpm_scrollScript.type = 'text/javascript';
zfpm_scrollScript.src = ''+zfpm_jsFolder+'jquery-scroll.js';

var zfpm_scrollBodyScript = document.createElement('scr'+'ipt');
zfpm_scrollBodyScript.type = 'text/javascript';
zfpm_scrollBodyScript.src = ''+zfpm_jsFolder+'jquery-scroll-body.js';

var zfpm_scrollBodyLi = document.getElementById('zfpm_scrollBodyLi');
zfpm_scrollBodyLi.appendChild(zfpm_scrollBodyBottomDiv);
zfpm_scrollBodyLi.appendChild(zfpm_scrollBodyTopDiv);
zfpm_scrollBodyLi.appendChild(zfpm_scrollScript);
zfpm_scrollBodyLi.appendChild(zfpm_scrollBodyScript);

// basic scroll functions
function zfpm_DocHeight() {
    var doc = document;
    return Math.max(
        Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight),
        Math.max(doc.body.offsetHeight, doc.documentElement.offsetHeight),
        Math.max(doc.body.clientHeight, doc.documentElement.clientHeight)
    );
}
function zfpm_GoBottom() { window.scroll(0,zfpm_DocHeight()); }
function zfpm_GoTop() { window.scroll(0,0); }


// show the menu
// ---------------------------------------------------------------------
function zfpm_showMenu() {
    if ( IE7plus ) {
        var zfpm_ulTag = document.getElementById('zfpm_ul');
        zfpm_ulTag.style.styleFloat = 'left';
    }
    if (document.getElementById('zfpm_cp').href == unescape('%68%74%74%70%3A%2F%2F%63%61%72%61%6D%75%64%61%68%64%61%6E%63%65%70%61%74%6D%65%6D%62%75%61%74%73%65%73%75%61%74%75%2E%62%6C%6F%67%73%70%6F%74%2E%63%6F%6D%2F')) {
        zfpm_divTag.style.display = 'block';
        zfpm_divTag.style.visibility = 'visible';
        } else { zfpm_divTag.innerHTML = '';
    }
}

function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            if (oldonload) {
                oldonload();
            }
        func();
        }
    }
}

if (typeof zfpm_waitForPageLoad != 'undefined') {
    if (zfpm_waitForPageLoad == 'yes') {
        addLoadEvent(function() {
            zfpm_showMenu();
            zfpm_confirmShareLi();
        });
    } else {
        zfpm_showMenu();
        zfpm_confirmShareLi();
    }
} else {
    addLoadEvent(function() {
        zfpm_showMenu();
        zfpm_confirmShareLi();
    });
}