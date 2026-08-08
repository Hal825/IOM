module.exports=[33405,(e,t,r)=>{t.exports=e.x("child_process",()=>require("child_process"))},4446,(e,t,r)=>{t.exports=e.x("net",()=>require("net"))},37702,(e,t,r)=>{t.exports=e.x("worker_threads",()=>require("worker_threads"))},27699,(e,t,r)=>{t.exports=e.x("events",()=>require("events"))},50245,(e,t,r)=>{let{EventEmitter:n}=e.r(27699);class AbortSignal{constructor(){this.eventEmitter=new n,this.onabort=null,this.aborted=!1,this.reason=void 0}toString(){return"[object AbortSignal]"}get[Symbol.toStringTag](){return"AbortSignal"}removeEventListener(e,t){this.eventEmitter.removeListener(e,t)}addEventListener(e,t){this.eventEmitter.on(e,t)}dispatchEvent(e){let t={type:e,target:this},r=`on${e}`;"function"==typeof this[r]&&this[r](t),this.eventEmitter.emit(e,t)}throwIfAborted(){if(this.aborted)throw this.reason}static abort(e){let t=new a;return t.abort(),t.signal}static timeout(e){let t=new a;return setTimeout(()=>t.abort(Error("TimeoutError")),e),t.signal}}class a{constructor(){this.signal=new AbortSignal}abort(e){this.signal.aborted||(this.signal.aborted=!0,e?this.signal.reason=e:this.signal.reason=Error("AbortError"),this.signal.dispatchEvent("abort"))}toString(){return"[object AbortController]"}get[Symbol.toStringTag](){return"AbortController"}}t.exports={AbortController:a,AbortSignal}},54799,(e,t,r)=>{t.exports=e.x("crypto",()=>require("crypto"))},22734,(e,t,r)=>{t.exports=e.x("fs",()=>require("fs"))},19248,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.defaults=void 0;let n=/^(?:0|[1-9]\d*)$/;function a(e,t){return e===t||Number.isNaN(e)&&Number.isNaN(t)}r.defaults=function(e,...t){e=Object(e);let r=Object.prototype,i=t.length,s=i>2?t[2]:void 0;s&&function(e,t,r){var i;return null!==r&&("object"==typeof r||"function"==typeof r)&&(!!("number"==typeof t&&null!=r&&"function"!=typeof r&&Number.isSafeInteger(i=r.length)&&i>=0&&function(e,t=Number.MAX_SAFE_INTEGER){switch(typeof e){case"number":return Number.isInteger(e)&&e>=0&&e<t;case"symbol":return!1;case"string":return n.test(e)}}(t))&&t<r.length||"string"==typeof t&&t in r)&&a(r[t],e)}(t[0],t[1],s)&&(i=1);for(let n=0;n<i;n++){if(null==t[n])continue;let i=t[n];for(let t in i){let n=e[t];(void 0===n||!r.hasOwnProperty.call(e,t)&&a(n,r[t]))&&(e[t]=i[t])}}return e}},78207,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.isArguments=void 0,r.isArguments=function(e){return null!==e&&"object"==typeof e&&"[object Arguments]"===(null==e?void 0===e?"[object Undefined]":"[object Null]":Object.prototype.toString.call(e))}},57517,(e,t,r)=>{"use strict";var n=e.e&&e.e.__createBinding||(Object.create?function(e,t,r,n){void 0===n&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){void 0===n&&(n=r),e[n]=t[r]}),a=e.e&&e.e.__exportStar||function(e,t){for(var r in e)"default"===r||Object.prototype.hasOwnProperty.call(t,r)||n(t,e,r)};Object.defineProperty(r,"__esModule",{value:!0}),r.noop=void 0,r.noop=function(){},a(e.r(19248),r),a(e.r(78207),r)},41528,(e,t,r)=>{function n(e,t,r,n){return Math.round(e/r)+" "+n+(t>=1.5*r?"s":"")}t.exports=function(e,t){t=t||{};var r,a,i,s,o=typeof e;if("string"===o&&e.length>0){var l=e;if(!((l=String(l)).length>100)){var d=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(l);if(d){var u=parseFloat(d[1]);switch((d[2]||"ms").toLowerCase()){case"years":case"year":case"yrs":case"yr":case"y":return 315576e5*u;case"weeks":case"week":case"w":return 6048e5*u;case"days":case"day":case"d":return 864e5*u;case"hours":case"hour":case"hrs":case"hr":case"h":return 36e5*u;case"minutes":case"minute":case"mins":case"min":case"m":return 6e4*u;case"seconds":case"second":case"secs":case"sec":case"s":return 1e3*u;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return u;default:break}}}return}if("number"===o&&isFinite(e)){return t.long?(a=Math.abs(r=e))>=864e5?n(r,a,864e5,"day"):a>=36e5?n(r,a,36e5,"hour"):a>=6e4?n(r,a,6e4,"minute"):a>=1e3?n(r,a,1e3,"second"):r+" ms":(s=Math.abs(i=e))>=864e5?Math.round(i/864e5)+"d":s>=36e5?Math.round(i/36e5)+"h":s>=6e4?Math.round(i/6e4)+"m":s>=1e3?Math.round(i/1e3)+"s":i+"ms"}throw Error("val is not a non-empty string or a valid number. val="+JSON.stringify(e))}},16525,(e,t,r)=>{t.exports=function(t){function r(e){let t,a,i,s=null;function o(...e){if(!o.enabled)return;let n=Number(new Date);o.diff=n-(t||n),o.prev=t,o.curr=n,t=n,e[0]=r.coerce(e[0]),"string"!=typeof e[0]&&e.unshift("%O");let a=0;e[0]=e[0].replace(/%([a-zA-Z%])/g,(t,n)=>{if("%%"===t)return"%";a++;let i=r.formatters[n];if("function"==typeof i){let r=e[a];t=i.call(o,r),e.splice(a,1),a--}return t}),r.formatArgs.call(o,e),(o.log||r.log).apply(o,e)}return o.namespace=e,o.useColors=r.useColors(),o.color=r.selectColor(e),o.extend=n,o.destroy=r.destroy,Object.defineProperty(o,"enabled",{enumerable:!0,configurable:!1,get:()=>null!==s?s:(a!==r.namespaces&&(a=r.namespaces,i=r.enabled(e)),i),set:e=>{s=e}}),"function"==typeof r.init&&r.init(o),o}function n(e,t){let n=r(this.namespace+(void 0===t?":":t)+e);return n.log=this.log,n}function a(e,t){let r=0,n=0,a=-1,i=0;for(;r<e.length;)if(n<t.length&&(t[n]===e[r]||"*"===t[n]))"*"===t[n]?(a=n,i=r):r++,n++;else{if(-1===a)return!1;n=a+1,r=++i}for(;n<t.length&&"*"===t[n];)n++;return n===t.length}return r.debug=r,r.default=r,r.coerce=function(e){return e instanceof Error?e.stack||e.message:e},r.disable=function(){let e=[...r.names,...r.skips.map(e=>"-"+e)].join(",");return r.enable(""),e},r.enable=function(e){for(let t of(r.save(e),r.namespaces=e,r.names=[],r.skips=[],("string"==typeof e?e:"").trim().replace(/\s+/g,",").split(",").filter(Boolean)))"-"===t[0]?r.skips.push(t.slice(1)):r.names.push(t)},r.enabled=function(e){for(let t of r.skips)if(a(e,t))return!1;for(let t of r.names)if(a(e,t))return!0;return!1},r.humanize=e.r(41528),r.destroy=function(){console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.")},Object.keys(t).forEach(e=>{r[e]=t[e]}),r.names=[],r.skips=[],r.formatters={},r.selectColor=function(e){let t=0;for(let r=0;r<e.length;r++)t=(t<<5)-t+e.charCodeAt(r)|0;return r.colors[Math.abs(t)%r.colors.length]},r.enable(r.load()),r}},70722,(e,t,r)=>{t.exports=e.x("tty",()=>require("tty"))},46786,(e,t,r)=>{t.exports=e.x("os",()=>require("os"))},55225,(e,t,r)=>{"use strict";t.exports=(e,t=process.argv)=>{let r=e.startsWith("-")?"":1===e.length?"-":"--",n=t.indexOf(r+e),a=t.indexOf("--");return -1!==n&&(-1===a||n<a)}},81042,(e,t,r)=>{"use strict";let n,a=e.r(46786),i=e.r(70722),s=e.r(55225),{env:o}=process;function l(e){return 0!==e&&{level:e,hasBasic:!0,has256:e>=2,has16m:e>=3}}function d(e,t){if(0===n)return 0;if(s("color=16m")||s("color=full")||s("color=truecolor"))return 3;if(s("color=256"))return 2;if(e&&!t&&void 0===n)return 0;let r=n||0;if("dumb"===o.TERM)return r;{let e=a.release().split(".");return Number(e[0])>=10&&Number(e[2])>=10586?Number(e[2])>=14931?3:2:1}}s("no-color")||s("no-colors")||s("color=false")||s("color=never")?n=0:(s("color")||s("colors")||s("color=true")||s("color=always"))&&(n=1),"FORCE_COLOR"in o&&(n="true"===o.FORCE_COLOR?1:"false"===o.FORCE_COLOR?0:0===o.FORCE_COLOR.length?1:Math.min(parseInt(o.FORCE_COLOR,10),3)),t.exports={supportsColor:function(e){return l(d(e,e&&e.isTTY))},stdout:l(d(!0,i.isatty(1))),stderr:l(d(!0,i.isatty(2)))}},23440,(e,t,r)=>{let n=e.r(70722),a=e.r(24361);r.init=function(e){e.inspectOpts={};let t=Object.keys(r.inspectOpts);for(let n=0;n<t.length;n++)e.inspectOpts[t[n]]=r.inspectOpts[t[n]]},r.log=function(...e){return process.stderr.write(a.formatWithOptions(r.inspectOpts,...e)+"\n")},r.formatArgs=function(e){let{namespace:n,useColors:a}=this;if(a){let r=this.color,a="\x1b[3"+(r<8?r:"8;5;"+r),i=`  ${a};1m${n} \u001B[0m`;e[0]=i+e[0].split("\n").join("\n"+i),e.push(a+"m+"+t.exports.humanize(this.diff)+"\x1b[0m")}else e[0]=(r.inspectOpts.hideDate?"":new Date().toISOString()+" ")+n+" "+e[0]},r.save=function(e){e?process.env.DEBUG=e:delete process.env.DEBUG},r.load=function(){return process.env.DEBUG},r.useColors=function(){return"colors"in r.inspectOpts?!!r.inspectOpts.colors:n.isatty(process.stderr.fd)},r.destroy=a.deprecate(()=>{},"Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."),r.colors=[6,2,3,4,5,1];try{let t=e.r(81042);t&&(t.stderr||t).level>=2&&(r.colors=[20,21,26,27,32,33,38,39,40,41,42,43,44,45,56,57,62,63,68,69,74,75,76,77,78,79,80,81,92,93,98,99,112,113,128,129,134,135,148,149,160,161,162,163,164,165,166,167,168,169,170,171,172,173,178,179,184,185,196,197,198,199,200,201,202,203,204,205,206,207,208,209,214,215,220,221])}catch(e){}r.inspectOpts=Object.keys(process.env).filter(e=>/^debug_/i.test(e)).reduce((e,t)=>{let r=t.substring(6).toLowerCase().replace(/_([a-z])/g,(e,t)=>t.toUpperCase()),n=process.env[t];return n=!!/^(yes|on|true|enabled)$/i.test(n)||!/^(no|off|false|disabled)$/i.test(n)&&("null"===n?null:Number(n)),e[r]=n,e},{}),t.exports=e.r(16525)(r);let{formatters:i}=t.exports;i.o=function(e){return this.inspectOpts.colors=this.useColors,a.inspect(e,this.inspectOpts).split("\n").map(e=>e.trim()).join(" ")},i.O=function(e){return this.inspectOpts.colors=this.useColors,a.inspect(e,this.inspectOpts)}},28452,(e,t,r)=>{let n;r.formatArgs=function(e){if(e[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+e[0]+(this.useColors?"%c ":" ")+"+"+t.exports.humanize(this.diff),!this.useColors)return;let r="color: "+this.color;e.splice(1,0,r,"color: inherit");let n=0,a=0;e[0].replace(/%[a-zA-Z%]/g,e=>{"%%"!==e&&(n++,"%c"===e&&(a=n))}),e.splice(a,0,r)},r.save=function(e){try{e?r.storage.setItem("debug",e):r.storage.removeItem("debug")}catch(e){}},r.load=function(){let e;try{e=r.storage.getItem("debug")||r.storage.getItem("DEBUG")}catch(e){}return!e&&"u">typeof process&&"env"in process&&(e=process.env.DEBUG),e},r.useColors=function(){let e;return!("u">typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))&&("u">typeof document&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||"u">typeof navigator&&navigator.userAgent&&(e=navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/))&&parseInt(e[1],10)>=31||"u">typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))},r.storage=function(){try{return localStorage}catch(e){}}(),n=!1,r.destroy=()=>{n||(n=!0,console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."))},r.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"],r.log=console.debug||console.log||(()=>{}),t.exports=e.r(16525)(r);let{formatters:a}=t.exports;a.j=function(e){try{return JSON.stringify(e)}catch(e){return"[UnexpectedJSONParseError]: "+e.message}}},17293,(e,t,r)=>{"u"<typeof process||"renderer"===process.type||process.__nwjs?t.exports=e.r(28452):t.exports=e.r(23440)},28181,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.genRedactedString=r.getStringValue=r.MAX_ARGUMENT_LENGTH=void 0;let n=e.r(17293);function a(e){if(null!==e)switch(typeof e){case"boolean":case"number":return;case"object":if(Buffer.isBuffer(e))return e.toString("hex");if(Array.isArray(e))return e.join(",");try{return JSON.stringify(e)}catch(e){return}case"string":return e}}function i(e,t){let{length:r}=e;return r<=t?e:e.slice(0,t)+' ... <REDACTED full-length="'+r+'">'}r.MAX_ARGUMENT_LENGTH=200,r.getStringValue=a,r.genRedactedString=i,r.default=function(e){let t=(0,n.default)(`ioredis:${e}`);function r(...e){if(t.enabled){for(let t=1;t<e.length;t++){let r=a(e[t]);"string"==typeof r&&r.length>200&&(e[t]=i(r,200))}return t.apply(null,e)}}return Object.defineProperties(r,{namespace:{get:()=>t.namespace},enabled:{get:()=>t.enabled},destroy:{get:()=>t.destroy},log:{get:()=>t.log,set(e){t.log=e}}}),r}},86961,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});let n=`-----BEGIN CERTIFICATE-----
MIIDTzCCAjegAwIBAgIJAKSVpiDswLcwMA0GCSqGSIb3DQEBBQUAMD4xFjAUBgNV
BAoMDUdhcmFudGlhIERhdGExJDAiBgNVBAMMG1NTTCBDZXJ0aWZpY2F0aW9uIEF1
dGhvcml0eTAeFw0xMzEwMDExMjE0NTVaFw0yMzA5MjkxMjE0NTVaMD4xFjAUBgNV
BAoMDUdhcmFudGlhIERhdGExJDAiBgNVBAMMG1NTTCBDZXJ0aWZpY2F0aW9uIEF1
dGhvcml0eTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALZqkh/DczWP
JnxnHLQ7QL0T4B4CDKWBKCcisriGbA6ZePWVNo4hfKQC6JrzfR+081NeD6VcWUiz
rmd+jtPhIY4c+WVQYm5PKaN6DT1imYdxQw7aqO5j2KUCEh/cznpLxeSHoTxlR34E
QwF28Wl3eg2vc5ct8LjU3eozWVk3gb7alx9mSA2SgmuX5lEQawl++rSjsBStemY2
BDwOpAMXIrdEyP/cVn8mkvi/BDs5M5G+09j0gfhyCzRWMQ7Hn71u1eolRxwVxgi3
TMn+/vTaFSqxKjgck6zuAYjBRPaHe7qLxHNr1So/Mc9nPy+3wHebFwbIcnUojwbp
4nctkWbjb2cCAwEAAaNQME4wHQYDVR0OBBYEFP1whtcrydmW3ZJeuSoKZIKjze3w
MB8GA1UdIwQYMBaAFP1whtcrydmW3ZJeuSoKZIKjze3wMAwGA1UdEwQFMAMBAf8w
DQYJKoZIhvcNAQEFBQADggEBAG2erXhwRAa7+ZOBs0B6X57Hwyd1R4kfmXcs0rta
lbPpvgULSiB+TCbf3EbhJnHGyvdCY1tvlffLjdA7HJ0PCOn+YYLBA0pTU/dyvrN6
Su8NuS5yubnt9mb13nDGYo1rnt0YRfxN+8DM3fXIVr038A30UlPX2Ou1ExFJT0MZ
uFKY6ZvLdI6/1cbgmguMlAhM+DhKyV6Sr5699LM3zqeI816pZmlREETYkGr91q7k
BpXJu/dtHaGxg1ZGu6w/PCsYGUcECWENYD4VQPd8N32JjOfu6vEgoEAwfPP+3oGp
Z4m3ewACcWOAenqflb+cQYC4PsF7qbXDmRaWrbKntOlZ3n0=
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
MIIGMTCCBBmgAwIBAgICEAAwDQYJKoZIhvcNAQELBQAwajELMAkGA1UEBhMCVVMx
CzAJBgNVBAgMAkNBMQswCQYDVQQHDAJDQTESMBAGA1UECgwJUmVkaXNMYWJzMS0w
KwYDVQQDDCRSZWRpc0xhYnMgUm9vdCBDZXJ0aWZpY2F0ZSBBdXRob3JpdHkwHhcN
MTgwMjI1MTUzNzM3WhcNMjgwMjIzMTUzNzM3WjBfMQswCQYDVQQGEwJVUzELMAkG
A1UECAwCQ0ExEjAQBgNVBAoMCVJlZGlzTGFiczEvMC0GA1UEAwwmUkNQIEludGVy
bWVkaWF0ZSBDZXJ0aWZpY2F0ZSBBdXRob3JpdHkwggIiMA0GCSqGSIb3DQEBAQUA
A4ICDwAwggIKAoICAQDf9dqbxc8Bq7Ctq9rWcxrGNKKHivqLAFpPq02yLPx6fsOv
Tq7GsDChAYBBc4v7Y2Ap9RD5Vs3dIhEANcnolf27QwrG9RMnnvzk8pCvp1o6zSU4
VuOE1W66/O1/7e2rVxyrnTcP7UgK43zNIXu7+tiAqWsO92uSnuMoGPGpeaUm1jym
hjWKtkAwDFSqvHY+XL5qDVBEjeUe+WHkYUg40cAXjusAqgm2hZt29c2wnVrxW25W
P0meNlzHGFdA2AC5z54iRiqj57dTfBTkHoBczQxcyw6hhzxZQ4e5I5zOKjXXEhZN
r0tA3YC14CTabKRus/JmZieyZzRgEy2oti64tmLYTqSlAD78pRL40VNoaSYetXLw
hhNsXCHgWaY6d5bLOc/aIQMAV5oLvZQKvuXAF1IDmhPA+bZbpWipp0zagf1P1H3s
UzsMdn2KM0ejzgotbtNlj5TcrVwpmvE3ktvUAuA+hi3FkVx1US+2Gsp5x4YOzJ7u
P1WPk6ShF0JgnJH2ILdj6kttTWwFzH17keSFICWDfH/+kM+k7Y1v3EXMQXE7y0T9
MjvJskz6d/nv+sQhY04xt64xFMGTnZjlJMzfQNi7zWFLTZnDD0lPowq7l3YiPoTT
t5Xky83lu0KZsZBo0WlWaDG00gLVdtRgVbcuSWxpi5BdLb1kRab66JptWjxwXQID
AQABo4HrMIHoMDoGA1UdHwQzMDEwL6AtoCuGKWh0dHBzOi8vcmwtY2Etc2VydmVy
LnJlZGlzbGFicy5jb20vdjEvY3JsMEYGCCsGAQUFBwEBBDowODA2BggrBgEFBQcw
AYYqaHR0cHM6Ly9ybC1jYS1zZXJ2ZXIucmVkaXNsYWJzLmNvbS92MS9vY3NwMB0G
A1UdDgQWBBQHar5OKvQUpP2qWt6mckzToeCOHDAfBgNVHSMEGDAWgBQi42wH6hM4
L2sujEvLM0/u8lRXTzASBgNVHRMBAf8ECDAGAQH/AgEAMA4GA1UdDwEB/wQEAwIB
hjANBgkqhkiG9w0BAQsFAAOCAgEAirEn/iTsAKyhd+pu2W3Z5NjCko4NPU0EYUbr
AP7+POK2rzjIrJO3nFYQ/LLuC7KCXG+2qwan2SAOGmqWst13Y+WHp44Kae0kaChW
vcYLXXSoGQGC8QuFSNUdaeg3RbMDYFT04dOkqufeWVccoHVxyTSg9eD8LZuHn5jw
7QDLiEECBmIJHk5Eeo2TAZrx4Yx6ufSUX5HeVjlAzqwtAqdt99uCJ/EL8bgpWbe+
XoSpvUv0SEC1I1dCAhCKAvRlIOA6VBcmzg5Am12KzkqTul12/VEFIgzqu0Zy2Jbc
AUPrYVu/+tOGXQaijy7YgwH8P8n3s7ZeUa1VABJHcxrxYduDDJBLZi+MjheUDaZ1
jQRHYevI2tlqeSBqdPKG4zBY5lS0GiAlmuze5oENt0P3XboHoZPHiqcK3VECgTVh
/BkJcuudETSJcZDmQ8YfoKfBzRQNg2sv/hwvUv73Ss51Sco8GEt2lD8uEdib1Q6z
zDT5lXJowSzOD5ZA9OGDjnSRL+2riNtKWKEqvtEG3VBJoBzu9GoxbAc7wIZLxmli
iF5a/Zf5X+UXD3s4TMmy6C4QZJpAA2egsSQCnraWO2ULhh7iXMysSkF/nzVfZn43
iqpaB8++9a37hWq14ZmOv0TJIDz//b2+KC4VFXWQ5W5QC6whsjT+OlG4p5ZYG0jo
616pxqo=
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
MIIFujCCA6KgAwIBAgIJAJ1aTT1lu2ScMA0GCSqGSIb3DQEBCwUAMGoxCzAJBgNV
BAYTAlVTMQswCQYDVQQIDAJDQTELMAkGA1UEBwwCQ0ExEjAQBgNVBAoMCVJlZGlz
TGFiczEtMCsGA1UEAwwkUmVkaXNMYWJzIFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9y
aXR5MB4XDTE4MDIyNTE1MjA0MloXDTM4MDIyMDE1MjA0MlowajELMAkGA1UEBhMC
VVMxCzAJBgNVBAgMAkNBMQswCQYDVQQHDAJDQTESMBAGA1UECgwJUmVkaXNMYWJz
MS0wKwYDVQQDDCRSZWRpc0xhYnMgUm9vdCBDZXJ0aWZpY2F0ZSBBdXRob3JpdHkw
ggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQDLEjXy7YrbN5Waau5cd6g1
G5C2tMmeTpZ0duFAPxNU4oE3RHS5gGiok346fUXuUxbZ6QkuzeN2/2Z+RmRcJhQY
Dm0ZgdG4x59An1TJfnzKKoWj8ISmoHS/TGNBdFzXV7FYNLBuqZouqePI6ReC6Qhl
pp45huV32Q3a6IDrrvx7Wo5ZczEQeFNbCeCOQYNDdTmCyEkHqc2AGo8eoIlSTutT
ULOC7R5gzJVTS0e1hesQ7jmqHjbO+VQS1NAL4/5K6cuTEqUl+XhVhPdLWBXJQ5ag
54qhX4v+ojLzeU1R/Vc6NjMvVtptWY6JihpgplprN0Yh2556ewcXMeturcKgXfGJ
xeYzsjzXerEjrVocX5V8BNrg64NlifzTMKNOOv4fVZszq1SIHR8F9ROrqiOdh8iC
JpUbLpXH9hWCSEO6VRMB2xJoKu3cgl63kF30s77x7wLFMEHiwsQRKxooE1UhgS9K
2sO4TlQ1eWUvFvHSTVDQDlGQ6zu4qjbOpb3Q8bQwoK+ai2alkXVR4Ltxe9QlgYK3
StsnPhruzZGA0wbXdpw0bnM+YdlEm5ffSTpNIfgHeaa7Dtb801FtA71ZlH7A6TaI
SIQuUST9EKmv7xrJyx0W1pGoPOLw5T029aTjnICSLdtV9bLwysrLhIYG5bnPq78B
cS+jZHFGzD7PUVGQD01nOQIDAQABo2MwYTAdBgNVHQ4EFgQUIuNsB+oTOC9rLoxL
yzNP7vJUV08wHwYDVR0jBBgwFoAUIuNsB+oTOC9rLoxLyzNP7vJUV08wDwYDVR0T
AQH/BAUwAwEB/zAOBgNVHQ8BAf8EBAMCAYYwDQYJKoZIhvcNAQELBQADggIBAHfg
z5pMNUAKdMzK1aS1EDdK9yKz4qicILz5czSLj1mC7HKDRy8cVADUxEICis++CsCu
rYOvyCVergHQLREcxPq4rc5Nq1uj6J6649NEeh4WazOOjL4ZfQ1jVznMbGy+fJm3
3Hoelv6jWRG9iqeJZja7/1s6YC6bWymI/OY1e4wUKeNHAo+Vger7MlHV+RuabaX+
hSJ8bJAM59NCM7AgMTQpJCncrcdLeceYniGy5Q/qt2b5mJkQVkIdy4TPGGB+AXDJ
D0q3I/JDRkDUFNFdeW0js7fHdsvCR7O3tJy5zIgEV/o/BCkmJVtuwPYOrw/yOlKj
TY/U7ATAx9VFF6/vYEOMYSmrZlFX+98L6nJtwDqfLB5VTltqZ4H/KBxGE3IRSt9l
FXy40U+LnXzhhW+7VBAvyYX8GEXhHkKU8Gqk1xitrqfBXY74xKgyUSTolFSfFVgj
mcM/X4K45bka+qpkj7Kfv/8D4j6aZekwhN2ly6hhC1SmQ8qjMjpG/mrWOSSHZFmf
ybu9iD2AYHeIOkshIl6xYIa++Q/00/vs46IzAbQyriOi0XxlSMMVtPx0Q3isp+ji
n8Mq9eOuxYOEQ4of8twUkUDd528iwGtEdwf0Q01UyT84S62N8AySl1ZBKXJz6W4F
UhWfa/HQYOAPDdEjNgnVwLI23b8t0TozyCWw7q8h
-----END CERTIFICATE-----

-----BEGIN CERTIFICATE-----
MIIEjzCCA3egAwIBAgIQe55B/ALCKJDZtdNT8kD6hTANBgkqhkiG9w0BAQsFADBM
MSAwHgYDVQQLExdHbG9iYWxTaWduIFJvb3QgQ0EgLSBSMzETMBEGA1UEChMKR2xv
YmFsU2lnbjETMBEGA1UEAxMKR2xvYmFsU2lnbjAeFw0yMjAxMjYxMjAwMDBaFw0y
NTAxMjYwMDAwMDBaMFgxCzAJBgNVBAYTAkJFMRkwFwYDVQQKExBHbG9iYWxTaWdu
IG52LXNhMS4wLAYDVQQDEyVHbG9iYWxTaWduIEF0bGFzIFIzIE9WIFRMUyBDQSAy
MDIyIFEyMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmGmg1LW9b7Lf
8zDD83yBDTEkt+FOxKJZqF4veWc5KZsQj9HfnUS2e5nj/E+JImlGPsQuoiosLuXD
BVBNAMcUFa11buFMGMeEMwiTmCXoXRrXQmH0qjpOfKgYc5gHG3BsRGaRrf7VR4eg
ofNMG9wUBw4/g/TT7+bQJdA4NfE7Y4d5gEryZiBGB/swaX6Jp/8MF4TgUmOWmalK
dZCKyb4sPGQFRTtElk67F7vU+wdGcrcOx1tDcIB0ncjLPMnaFicagl+daWGsKqTh
counQb6QJtYHa91KvCfKWocMxQ7OIbB5UARLPmC4CJ1/f8YFm35ebfzAeULYdGXu
jE9CLor0OwIDAQABo4IBXzCCAVswDgYDVR0PAQH/BAQDAgGGMB0GA1UdJQQWMBQG
CCsGAQUFBwMBBggrBgEFBQcDAjASBgNVHRMBAf8ECDAGAQH/AgEAMB0GA1UdDgQW
BBSH5Zq7a7B/t95GfJWkDBpA8HHqdjAfBgNVHSMEGDAWgBSP8Et/qC5FJK5NUPpj
move4t0bvDB7BggrBgEFBQcBAQRvMG0wLgYIKwYBBQUHMAGGImh0dHA6Ly9vY3Nw
Mi5nbG9iYWxzaWduLmNvbS9yb290cjMwOwYIKwYBBQUHMAKGL2h0dHA6Ly9zZWN1
cmUuZ2xvYmFsc2lnbi5jb20vY2FjZXJ0L3Jvb3QtcjMuY3J0MDYGA1UdHwQvMC0w
K6ApoCeGJWh0dHA6Ly9jcmwuZ2xvYmFsc2lnbi5jb20vcm9vdC1yMy5jcmwwIQYD
VR0gBBowGDAIBgZngQwBAgIwDAYKKwYBBAGgMgoBAjANBgkqhkiG9w0BAQsFAAOC
AQEAKRic9/f+nmhQU/wz04APZLjgG5OgsuUOyUEZjKVhNGDwxGTvKhyXGGAMW2B/
3bRi+aElpXwoxu3pL6fkElbX3B0BeS5LoDtxkyiVEBMZ8m+sXbocwlPyxrPbX6mY
0rVIvnuUeBH8X0L5IwfpNVvKnBIilTbcebfHyXkPezGwz7E1yhUULjJFm2bt0SdX
y+4X/WeiiYIv+fTVgZZgl+/2MKIsu/qdBJc3f3TvJ8nz+Eax1zgZmww+RSQWeOj3
15Iw6Z5FX+NwzY/Ab+9PosR5UosSeq+9HhtaxZttXG1nVh+avYPGYddWmiMT90J5
ZgKnO/Fx2hBgTxhOTMYaD312kg==
-----END CERTIFICATE-----

-----BEGIN CERTIFICATE-----
MIIDXzCCAkegAwIBAgILBAAAAAABIVhTCKIwDQYJKoZIhvcNAQELBQAwTDEgMB4G
A1UECxMXR2xvYmFsU2lnbiBSb290IENBIC0gUjMxEzARBgNVBAoTCkdsb2JhbFNp
Z24xEzARBgNVBAMTCkdsb2JhbFNpZ24wHhcNMDkwMzE4MTAwMDAwWhcNMjkwMzE4
MTAwMDAwWjBMMSAwHgYDVQQLExdHbG9iYWxTaWduIFJvb3QgQ0EgLSBSMzETMBEG
A1UEChMKR2xvYmFsU2lnbjETMBEGA1UEAxMKR2xvYmFsU2lnbjCCASIwDQYJKoZI
hvcNAQEBBQADggEPADCCAQoCggEBAMwldpB5BngiFvXAg7aEyiie/QV2EcWtiHL8
RgJDx7KKnQRfJMsuS+FggkbhUqsMgUdwbN1k0ev1LKMPgj0MK66X17YUhhB5uzsT
gHeMCOFJ0mpiLx9e+pZo34knlTifBtc+ycsmWQ1z3rDI6SYOgxXG71uL0gRgykmm
KPZpO/bLyCiR5Z2KYVc3rHQU3HTgOu5yLy6c+9C7v/U9AOEGM+iCK65TpjoWc4zd
QQ4gOsC0p6Hpsk+QLjJg6VfLuQSSaGjlOCZgdbKfd/+RFO+uIEn8rUAVSNECMWEZ
XriX7613t2Saer9fwRPvm2L7DWzgVGkWqQPabumDk3F2xmmFghcCAwEAAaNCMEAw
DgYDVR0PAQH/BAQDAgEGMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFI/wS3+o
LkUkrk1Q+mOai97i3Ru8MA0GCSqGSIb3DQEBCwUAA4IBAQBLQNvAUKr+yAzv95ZU
RUm7lgAJQayzE4aGKAczymvmdLm6AC2upArT9fHxD4q/c2dKg8dEe3jgr25sbwMp
jjM5RcOO5LlXbKr8EpbsU8Yt5CRsuZRj+9xTaGdWPoO4zzUhw8lo/s7awlOqzJCK
6fBdRoyV3XpYKBovHd7NADdBj+1EbddTKJd+82cEHhXXipa0095MJ6RMG3NzdvQX
mcIfeg7jLQitChws/zyrVQ4PkX4268NXSb7hLi18YIvDQVETI53O9zJrlAGomecs
Mx86OyXShkDOOyyGeMlhLxS67ttVb9+E7gUJTb0o2HLO02JQZR7rkpeDMdmztcpH
WD9f
-----END CERTIFICATE-----`;r.default={RedisCloudFixed:{ca:n},RedisCloudFlexible:{ca:n}}},26898,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.noop=r.isArguments=r.defaults=r.Debug=r.getPackageMeta=r.zipMap=r.CONNECTION_CLOSED_ERROR_MSG=r.shuffle=r.sample=r.resolveTLSProfile=r.parseURL=r.optimizeErrorStack=r.toArg=r.convertMapToArray=r.convertObjectToArray=r.timeout=r.packObject=r.isInt=r.wrapMultiResult=r.convertBufferToString=void 0;let n=e.r(22734),a=e.r(14747),i=e.r(57517);Object.defineProperty(r,"defaults",{enumerable:!0,get:function(){return i.defaults}}),Object.defineProperty(r,"isArguments",{enumerable:!0,get:function(){return i.isArguments}}),Object.defineProperty(r,"noop",{enumerable:!0,get:function(){return i.noop}}),r.Debug=e.r(28181).default;let s=e.r(86961);function o(e){let t=parseFloat(e);return!isNaN(e)&&(0|t)===t}function l(e,t){if("family"===e){let e=Number.parseInt(t,10);if(!Number.isNaN(e))return e}return t}r.convertBufferToString=function e(t,r){if(t instanceof Buffer)return t.toString(r);if(Array.isArray(t)){let n=t.length,a=Array(n);for(let i=0;i<n;++i)a[i]=t[i]instanceof Buffer&&"utf8"===r?t[i].toString():e(t[i],r);return a}return t},r.wrapMultiResult=function(e){if(!e)return null;let t=[],r=e.length;for(let n=0;n<r;++n){let r=e[n];r instanceof Error?t.push([r]):t.push([null,r])}return t},r.isInt=o,r.packObject=function(e){let t={},r=e.length;for(let n=1;n<r;n+=2)t[e[n-1]]=e[n];return t},r.timeout=function(e,t){let r=null,n=function(){r&&(clearTimeout(r),r=null,e.apply(this,arguments))};return r=setTimeout(n,t,Error("timeout")),n},r.convertObjectToArray=function(e){let t=[],r=Object.keys(e);for(let n=0,a=r.length;n<a;n++)t.push(r[n],e[r[n]]);return t},r.convertMapToArray=function(e){let t=[],r=0;return e.forEach(function(e,n){t[r]=n,t[r+1]=e,r+=2}),t},r.toArg=function(e){return null==e?"":String(e)},r.optimizeErrorStack=function(e,t,r){let n,a=t.split("\n"),i="";for(n=1;n<a.length&&-1!==a[n].indexOf(r);++n);for(let e=n;e<a.length;++e)i+="\n"+a[e];if(e.stack){let t=e.stack.indexOf("\n");e.stack=e.stack.slice(0,t)+i}return e},r.parseURL=function(e){let t;if(o(e))return{port:e};let r=/^rediss?:\/\//i.test(e),n=e.startsWith("//");if("/"===e[0]&&!n){let t=e.indexOf("?"),r={path:-1===t?e:e.slice(0,t)};if(-1!==t){let n={};new URLSearchParams(e.slice(t+1)).forEach((e,t)=>{n[t]=l(t,e)}),(0,i.defaults)(r,n)}return r}t=new URL(r?e:n?"redis:"+e:"redis://"+e);let a={};t.searchParams.forEach((e,t)=>{a[t]=l(t,e)});let s={};return(t.username||t.password)&&(s.username=decodeURIComponent(t.username),s.password=decodeURIComponent(t.password)),t.pathname&&"/"!==t.pathname&&(r||n?t.pathname.length>1&&(s.db=t.pathname.slice(1)):s.path=t.pathname),t.hostname&&(s.host=t.hostname.replace(/^\[|\]$/g,"")),t.port&&(s.port=t.port),(0,i.defaults)(s,a),s},r.resolveTLSProfile=function(e){let t=null==e?void 0:e.tls;"string"==typeof t&&(t={profile:t});let r=s.default[null==t?void 0:t.profile];return r&&(t=Object.assign({},r,t),delete t.profile,e=Object.assign({},e,{tls:t})),e},r.sample=function(e,t=0){let r=e.length;return t>=r?null:e[t+Math.floor(Math.random()*(r-t))]},r.shuffle=function(e){let t=e.length;for(;t>0;){let r=Math.floor(Math.random()*t);t--,[e[t],e[r]]=[e[r],e[t]]}return e},r.CONNECTION_CLOSED_ERROR_MSG="Connection is closed.",r.zipMap=function(e,t){let r=new Map;return e.forEach((e,n)=>{r.set(e,t[n])}),r};let d=null;r.getPackageMeta=async function(){if(d)return d;try{let e=(0,a.resolve)("/ROOT/node_modules/ioredis/built/utils","..","..","package.json"),t=await n.promises.readFile(e,"utf8");return d={version:JSON.parse(t).version}}catch(e){return d={version:"error-fetching-version"}}}},30842,(e,t,r)=>{"use strict";t.exports={MAX_LENGTH:256,MAX_SAFE_COMPONENT_LENGTH:16,MAX_SAFE_BUILD_LENGTH:250,MAX_SAFE_INTEGER:Number.MAX_SAFE_INTEGER||0x1fffffffffffff,RELEASE_TYPES:["major","premajor","minor","preminor","patch","prepatch","prerelease"],SEMVER_SPEC_VERSION:"2.0.0",FLAG_INCLUDE_PRERELEASE:1,FLAG_LOOSE:2}},63852,(e,t,r)=>{"use strict";t.exports="object"==typeof process&&process.env&&process.env.NODE_DEBUG&&/\bsemver\b/i.test(process.env.NODE_DEBUG)?(...e)=>console.error("SEMVER",...e):()=>{}},79683,(e,t,r)=>{"use strict";let{MAX_SAFE_COMPONENT_LENGTH:n,MAX_SAFE_BUILD_LENGTH:a,MAX_LENGTH:i}=e.r(30842),s=e.r(63852),o=(r=t.exports={}).re=[],l=r.safeRe=[],d=r.src=[],u=r.safeSrc=[],c=r.t={},p=0,h="[a-zA-Z0-9-]",y=[["\\s",1],["\\d",i],[h,a]],m=(e,t,r)=>{let n=(e=>{for(let[t,r]of y)e=e.split(`${t}*`).join(`${t}{0,${r}}`).split(`${t}+`).join(`${t}{1,${r}}`);return e})(t),a=p++;s(e,a,t),c[e]=a,d[a]=t,u[a]=n,o[a]=new RegExp(t,r?"g":void 0),l[a]=new RegExp(n,r?"g":void 0)};m("NUMERICIDENTIFIER","0|[1-9]\\d*"),m("NUMERICIDENTIFIERLOOSE","\\d+"),m("NONNUMERICIDENTIFIER",`\\d*[a-zA-Z-]${h}*`),m("MAINVERSION",`(${d[c.NUMERICIDENTIFIER]})\\.(${d[c.NUMERICIDENTIFIER]})\\.(${d[c.NUMERICIDENTIFIER]})`),m("MAINVERSIONLOOSE",`(${d[c.NUMERICIDENTIFIERLOOSE]})\\.(${d[c.NUMERICIDENTIFIERLOOSE]})\\.(${d[c.NUMERICIDENTIFIERLOOSE]})`),m("PRERELEASEIDENTIFIER",`(?:${d[c.NONNUMERICIDENTIFIER]}|${d[c.NUMERICIDENTIFIER]})`),m("PRERELEASEIDENTIFIERLOOSE",`(?:${d[c.NONNUMERICIDENTIFIER]}|${d[c.NUMERICIDENTIFIERLOOSE]})`),m("PRERELEASE",`(?:-(${d[c.PRERELEASEIDENTIFIER]}(?:\\.${d[c.PRERELEASEIDENTIFIER]})*))`),m("PRERELEASELOOSE",`(?:-?(${d[c.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${d[c.PRERELEASEIDENTIFIERLOOSE]})*))`),m("BUILDIDENTIFIER",`${h}+`),m("BUILD",`(?:\\+(${d[c.BUILDIDENTIFIER]}(?:\\.${d[c.BUILDIDENTIFIER]})*))`),m("FULLPLAIN",`v?${d[c.MAINVERSION]}${d[c.PRERELEASE]}?${d[c.BUILD]}?`),m("FULL",`^${d[c.FULLPLAIN]}$`),m("LOOSEPLAIN",`[v=\\s]*${d[c.MAINVERSIONLOOSE]}${d[c.PRERELEASELOOSE]}?${d[c.BUILD]}?`),m("LOOSE",`^${d[c.LOOSEPLAIN]}$`),m("GTLT","((?:<|>)?=?)"),m("XRANGEIDENTIFIERLOOSE",`${d[c.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`),m("XRANGEIDENTIFIER",`${d[c.NUMERICIDENTIFIER]}|x|X|\\*`),m("XRANGEPLAIN",`[v=\\s]*(${d[c.XRANGEIDENTIFIER]})(?:\\.(${d[c.XRANGEIDENTIFIER]})(?:\\.(${d[c.XRANGEIDENTIFIER]})(?:${d[c.PRERELEASE]})?${d[c.BUILD]}?)?)?`),m("XRANGEPLAINLOOSE",`[v=\\s]*(${d[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${d[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${d[c.XRANGEIDENTIFIERLOOSE]})(?:${d[c.PRERELEASELOOSE]})?${d[c.BUILD]}?)?)?`),m("XRANGE",`^${d[c.GTLT]}\\s*${d[c.XRANGEPLAIN]}$`),m("XRANGELOOSE",`^${d[c.GTLT]}\\s*${d[c.XRANGEPLAINLOOSE]}$`),m("COERCEPLAIN",`(^|[^\\d])(\\d{1,${n}})(?:\\.(\\d{1,${n}}))?(?:\\.(\\d{1,${n}}))?`),m("COERCE",`${d[c.COERCEPLAIN]}(?:$|[^\\d])`),m("COERCEFULL",d[c.COERCEPLAIN]+`(?:${d[c.PRERELEASE]})?`+`(?:${d[c.BUILD]})?`+"(?:$|[^\\d])"),m("COERCERTL",d[c.COERCE],!0),m("COERCERTLFULL",d[c.COERCEFULL],!0),m("LONETILDE","(?:~>?)"),m("TILDETRIM",`(\\s*)${d[c.LONETILDE]}\\s+`,!0),r.tildeTrimReplace="$1~",m("TILDE",`^${d[c.LONETILDE]}${d[c.XRANGEPLAIN]}$`),m("TILDELOOSE",`^${d[c.LONETILDE]}${d[c.XRANGEPLAINLOOSE]}$`),m("LONECARET","(?:\\^)"),m("CARETTRIM",`(\\s*)${d[c.LONECARET]}\\s+`,!0),r.caretTrimReplace="$1^",m("CARET",`^${d[c.LONECARET]}${d[c.XRANGEPLAIN]}$`),m("CARETLOOSE",`^${d[c.LONECARET]}${d[c.XRANGEPLAINLOOSE]}$`),m("COMPARATORLOOSE",`^${d[c.GTLT]}\\s*(${d[c.LOOSEPLAIN]})$|^$`),m("COMPARATOR",`^${d[c.GTLT]}\\s*(${d[c.FULLPLAIN]})$|^$`),m("COMPARATORTRIM",`(\\s*)${d[c.GTLT]}\\s*(${d[c.LOOSEPLAIN]}|${d[c.XRANGEPLAIN]})`,!0),r.comparatorTrimReplace="$1$2$3",m("HYPHENRANGE",`^\\s*(${d[c.XRANGEPLAIN]})\\s+-\\s+(${d[c.XRANGEPLAIN]})\\s*$`),m("HYPHENRANGELOOSE",`^\\s*(${d[c.XRANGEPLAINLOOSE]})\\s+-\\s+(${d[c.XRANGEPLAINLOOSE]})\\s*$`),m("STAR","(<|>)?=?\\s*\\*"),m("GTE0","^\\s*>=\\s*0\\.0\\.0\\s*$"),m("GTE0PRE","^\\s*>=\\s*0\\.0\\.0-0\\s*$")},58124,(e,t,r)=>{"use strict";let n=Object.freeze({loose:!0}),a=Object.freeze({});t.exports=e=>e?"object"!=typeof e?n:e:a},14842,(e,t,r)=>{"use strict";let n=/^[0-9]+$/,a=(e,t)=>{if("number"==typeof e&&"number"==typeof t)return e===t?0:e<t?-1:1;let r=n.test(e),a=n.test(t);return r&&a&&(e*=1,t*=1),e===t?0:r&&!a?-1:a&&!r?1:e<t?-1:1};t.exports={compareIdentifiers:a,rcompareIdentifiers:(e,t)=>a(t,e)}},3421,(e,t,r)=>{"use strict";let n=e.r(63852),{MAX_LENGTH:a,MAX_SAFE_INTEGER:i}=e.r(30842),{safeRe:s,t:o}=e.r(79683),l=e.r(58124),{compareIdentifiers:d}=e.r(14842);class u{constructor(e,t){if(t=l(t),e instanceof u)if(!!t.loose===e.loose&&!!t.includePrerelease===e.includePrerelease)return e;else e=e.version;else if("string"!=typeof e)throw TypeError(`Invalid version. Must be a string. Got type "${typeof e}".`);if(e.length>a)throw TypeError(`version is longer than ${a} characters`);n("SemVer",e,t),this.options=t,this.loose=!!t.loose,this.includePrerelease=!!t.includePrerelease;const r=e.trim().match(t.loose?s[o.LOOSE]:s[o.FULL]);if(!r)throw TypeError(`Invalid Version: ${e}`);if(this.raw=e,this.major=+r[1],this.minor=+r[2],this.patch=+r[3],this.major>i||this.major<0)throw TypeError("Invalid major version");if(this.minor>i||this.minor<0)throw TypeError("Invalid minor version");if(this.patch>i||this.patch<0)throw TypeError("Invalid patch version");r[4]?this.prerelease=r[4].split(".").map(e=>{if(/^[0-9]+$/.test(e)){let t=+e;if(t>=0&&t<i)return t}return e}):this.prerelease=[],this.build=r[5]?r[5].split("."):[],this.format()}format(){return this.version=`${this.major}.${this.minor}.${this.patch}`,this.prerelease.length&&(this.version+=`-${this.prerelease.join(".")}`),this.version}toString(){return this.version}compare(e){if(n("SemVer.compare",this.version,this.options,e),!(e instanceof u)){if("string"==typeof e&&e===this.version)return 0;e=new u(e,this.options)}return e.version===this.version?0:this.compareMain(e)||this.comparePre(e)}compareMain(e){return(e instanceof u||(e=new u(e,this.options)),this.major<e.major)?-1:this.major>e.major?1:this.minor<e.minor?-1:this.minor>e.minor?1:this.patch<e.patch?-1:+(this.patch>e.patch)}comparePre(e){if(e instanceof u||(e=new u(e,this.options)),this.prerelease.length&&!e.prerelease.length)return -1;if(!this.prerelease.length&&e.prerelease.length)return 1;if(!this.prerelease.length&&!e.prerelease.length)return 0;let t=0;do{let r=this.prerelease[t],a=e.prerelease[t];if(n("prerelease compare",t,r,a),void 0===r&&void 0===a)return 0;if(void 0===a)return 1;if(void 0===r)return -1;else if(r===a)continue;else return d(r,a)}while(++t)}compareBuild(e){e instanceof u||(e=new u(e,this.options));let t=0;do{let r=this.build[t],a=e.build[t];if(n("build compare",t,r,a),void 0===r&&void 0===a)return 0;if(void 0===a)return 1;if(void 0===r)return -1;else if(r===a)continue;else return d(r,a)}while(++t)}inc(e,t,r){if(e.startsWith("pre")){if(!t&&!1===r)throw Error("invalid increment argument: identifier is empty");if(t){let e=`-${t}`.match(this.options.loose?s[o.PRERELEASELOOSE]:s[o.PRERELEASE]);if(!e||e[1]!==t)throw Error(`invalid identifier: ${t}`)}}switch(e){case"premajor":this.prerelease.length=0,this.patch=0,this.minor=0,this.major++,this.inc("pre",t,r);break;case"preminor":this.prerelease.length=0,this.patch=0,this.minor++,this.inc("pre",t,r);break;case"prepatch":this.prerelease.length=0,this.inc("patch",t,r),this.inc("pre",t,r);break;case"prerelease":0===this.prerelease.length&&this.inc("patch",t,r),this.inc("pre",t,r);break;case"release":if(0===this.prerelease.length)throw Error(`version ${this.raw} is not a prerelease`);this.prerelease.length=0;break;case"major":(0!==this.minor||0!==this.patch||0===this.prerelease.length)&&this.major++,this.minor=0,this.patch=0,this.prerelease=[];break;case"minor":(0!==this.patch||0===this.prerelease.length)&&this.minor++,this.patch=0,this.prerelease=[];break;case"patch":0===this.prerelease.length&&this.patch++,this.prerelease=[];break;case"pre":{let e=+!!Number(r);if(0===this.prerelease.length)this.prerelease=[e];else{let n=this.prerelease.length;for(;--n>=0;)"number"==typeof this.prerelease[n]&&(this.prerelease[n]++,n=-2);if(-1===n){if(t===this.prerelease.join(".")&&!1===r)throw Error("invalid increment argument: identifier already exists");this.prerelease.push(e)}}if(t){let n=[t,e];!1===r&&(n=[t]),((e,t)=>{let r=t.split(".");if(r.length>e.length)return!1;for(let t=0;t<r.length;t++)if(0!==d(e[t],r[t]))return!1;return!0})(this.prerelease,t)?isNaN(this.prerelease[t.split(".").length])&&(this.prerelease=n):this.prerelease=n}break}default:throw Error(`invalid increment argument: ${e}`)}return this.raw=this.format(),this.build.length&&(this.raw+=`+${this.build.join(".")}`),this}}t.exports=u},70749,(e,t,r)=>{"use strict";let n=e.r(3421);t.exports=(e,t,r=!1)=>{if(e instanceof n)return e;try{return new n(e,t)}catch(e){if(!r)return null;throw e}}},87912,(e,t,r)=>{"use strict";let n=e.r(70749);t.exports=(e,t)=>{let r=n(e,t);return r?r.version:null}},26670,(e,t,r)=>{"use strict";let n=e.r(70749);t.exports=(e,t)=>{let r=n(e.trim().replace(/^[=v]+/,""),t);return r?r.version:null}},51116,(e,t,r)=>{"use strict";let n=e.r(3421);t.exports=(e,t,r,a,i)=>{"string"==typeof r&&(i=a,a=r,r=void 0);try{return new n(e instanceof n?e.version:e,r).inc(t,a,i).version}catch(e){return null}}},81286,(e,t,r)=>{"use strict";let n=e.r(70749);t.exports=(e,t)=>{let r=n(e,null,!0),a=n(t,null,!0),i=r.compare(a);if(0===i)return null;let s=i>0,o=s?r:a,l=s?a:r,d=!!o.prerelease.length;if(l.prerelease.length&&!d){if(!l.patch&&!l.minor)return"major";if(0===l.compareMain(o))return l.minor&&!l.patch?"minor":"patch"}let u=d?"pre":"";return r.major!==a.major?u+"major":r.minor!==a.minor?u+"minor":r.patch!==a.patch?u+"patch":"prerelease"}},32499,(e,t,r)=>{"use strict";let n=e.r(3421);t.exports=(e,t)=>new n(e,t).major},28465,(e,t,r)=>{"use strict";let n=e.r(3421);t.exports=(e,t)=>new n(e,t).minor},83108,(e,t,r)=>{"use strict";let n=e.r(3421);t.exports=(e,t)=>new n(e,t).patch},96875,(e,t,r)=>{"use strict";let n=e.r(70749);t.exports=(e,t)=>{let r=n(e,t);return r&&r.prerelease.length?r.prerelease:null}},71810,(e,t,r)=>{"use strict";let n=e.r(3421);t.exports=(e,t,r)=>new n(e,r).compare(new n(t,r))},37024,(e,t,r)=>{"use strict";let n=e.r(71810);t.exports=(e,t,r)=>n(t,e,r)},16254,(e,t,r)=>{"use strict";let n=e.r(71810);t.exports=(e,t)=>n(e,t,!0)},73902,(e,t,r)=>{"use strict";let n=e.r(3421);t.exports=(e,t,r)=>{let a=new n(e,r),i=new n(t,r);return a.compare(i)||a.compareBuild(i)}},65789,(e,t,r)=>{"use strict";let n=e.r(73902);t.exports=(e,t)=>e.sort((e,r)=>n(e,r,t))},57862,(e,t,r)=>{"use strict";let n=e.r(73902);t.exports=(e,t)=>e.sort((e,r)=>n(r,e,t))},30888,(e,t,r)=>{"use strict";let n=e.r(71810);t.exports=(e,t,r)=>n(e,t,r)>0},65769,(e,t,r)=>{"use strict";let n=e.r(71810);t.exports=(e,t,r)=>0>n(e,t,r)},72747,(e,t,r)=>{"use strict";let n=e.r(71810);t.exports=(e,t,r)=>0===n(e,t,r)},63330,(e,t,r)=>{"use strict";let n=e.r(71810);t.exports=(e,t,r)=>0!==n(e,t,r)},24589,(e,t,r)=>{"use strict";let n=e.r(71810);t.exports=(e,t,r)=>n(e,t,r)>=0},20017,(e,t,r)=>{"use strict";let n=e.r(71810);t.exports=(e,t,r)=>0>=n(e,t,r)},15236,(e,t,r)=>{"use strict";let n=e.r(72747),a=e.r(63330),i=e.r(30888),s=e.r(24589),o=e.r(65769),l=e.r(20017);t.exports=(e,t,r,d)=>{switch(t){case"===":return"object"==typeof e&&(e=e.version),"object"==typeof r&&(r=r.version),e===r;case"!==":return"object"==typeof e&&(e=e.version),"object"==typeof r&&(r=r.version),e!==r;case"":case"=":case"==":return n(e,r,d);case"!=":return a(e,r,d);case">":return i(e,r,d);case">=":return s(e,r,d);case"<":return o(e,r,d);case"<=":return l(e,r,d);default:throw TypeError(`Invalid operator: ${t}`)}}},30641,(e,t,r)=>{"use strict";let n=e.r(3421),a=e.r(70749),{safeRe:i,t:s}=e.r(79683);t.exports=(e,t)=>{if(e instanceof n)return e;if("number"==typeof e&&(e=String(e)),"string"!=typeof e)return null;let r=null;if((t=t||{}).rtl){let n,a=t.includePrerelease?i[s.COERCERTLFULL]:i[s.COERCERTL];for(;(n=a.exec(e))&&(!r||r.index+r[0].length!==e.length);)r&&n.index+n[0].length===r.index+r[0].length||(r=n),a.lastIndex=n.index+n[1].length+n[2].length;a.lastIndex=-1}else r=e.match(t.includePrerelease?i[s.COERCEFULL]:i[s.COERCE]);if(null===r)return null;let o=r[2],l=r[3]||"0",d=r[4]||"0",u=t.includePrerelease&&r[5]?`-${r[5]}`:"",c=t.includePrerelease&&r[6]?`+${r[6]}`:"";return a(`${o}.${l}.${d}${u}${c}`,t)}},85370,(e,t,r)=>{"use strict";let n=e.r(70749),a=e.r(30842),i=e.r(3421),s=e=>e.startsWith("pre");t.exports=(e,t,r)=>{let o,l;if(!a.RELEASE_TYPES.includes(t))return null;let d=(o=e,l=r,n(o instanceof i?o.version:o,l));return d&&((e,t)=>{if(s(t))return e.version;switch(e.prerelease=[],t){case"major":e.minor=0,e.patch=0;break;case"minor":e.patch=0}return e.format()})(d,t)}},25178,(e,t,r)=>{"use strict";t.exports=class{constructor(){this.max=1e3,this.map=new Map}get(e){let t=this.map.get(e);if(void 0!==t)return this.map.delete(e),this.map.set(e,t),t}delete(e){return this.map.delete(e)}set(e,t){if(!this.delete(e)&&void 0!==t){if(this.map.size>=this.max){let e=this.map.keys().next().value;this.delete(e)}this.map.set(e,t)}return this}}},5912,(e,t,r)=>{"use strict";let n=/\s+/g;class a{constructor(e,t){if(t=s(t),e instanceof a)if(!!t.loose===e.loose&&!!t.includePrerelease===e.includePrerelease)return e;else return new a(e.raw,t);if(e instanceof o)return this.raw=e.value,this.set=[[e]],this.formatted=void 0,this;if(this.options=t,this.loose=!!t.loose,this.includePrerelease=!!t.includePrerelease,this.raw=e.trim().replace(n," "),this.set=this.raw.split("||").map(e=>this.parseRange(e.trim())).filter(e=>e.length),!this.set.length)throw TypeError(`Invalid SemVer Range: ${this.raw}`);if(this.set.length>1){const e=this.set[0];if(this.set=this.set.filter(e=>!K(e[0])),0===this.set.length)this.set=[e];else if(this.set.length>1){for(const e of this.set)if(1===e.length&&v(e[0])){this.set=[e];break}}}this.formatted=void 0}get range(){if(void 0===this.formatted){this.formatted="";for(let e=0;e<this.set.length;e++){e>0&&(this.formatted+="||");let t=this.set[e];for(let e=0;e<t.length;e++)e>0&&(this.formatted+=" "),this.formatted+=t[e].toString().trim()}}return this.formatted}format(){return this.range}toString(){return this.range}parseRange(e){e=e.replace(g,"");let t=((this.options.includePrerelease&&f)|(this.options.loose&&b))+":"+e,r=i.get(t);if(r)return r;let n=this.options.loose,a=n?u[p.HYPHENRANGELOOSE]:u[p.HYPHENRANGE];l("hyphen replace",e=e.replace(a,O(this.options.includePrerelease))),l("comparator trim",e=e.replace(u[p.COMPARATORTRIM],h)),l("tilde trim",e=e.replace(u[p.TILDETRIM],y)),l("caret trim",e=e.replace(u[p.CARETTRIM],m));let s=e.split(" ").map(e=>E(e,this.options)).join(" ").split(/\s+/).map(e=>C(e,this.options));n&&(s=s.filter(e=>(l("loose invalid filter",e,this.options),!!e.match(u[p.COMPARATORLOOSE])))),l("range list",s);let d=new Map;for(let e of s.map(e=>new o(e,this.options))){if(K(e))return[e];d.set(e.value,e)}d.size>1&&d.has("")&&d.delete("");let c=[...d.values()];return i.set(t,c),c}intersects(e,t){if(!(e instanceof a))throw TypeError("a Range is required");return this.set.some(r=>S(r,t)&&e.set.some(e=>S(e,t)&&r.every(r=>e.every(e=>r.intersects(e,t)))))}test(e){if(!e)return!1;if("string"==typeof e)try{e=new d(e,this.options)}catch(e){return!1}for(let t=0;t<this.set.length;t++)if(R(this.set[t],e,this.options))return!0;return!1}}t.exports=a;let i=new(e.r(25178)),s=e.r(58124),o=e.r(60254),l=e.r(63852),d=e.r(3421),{safeRe:u,src:c,t:p,comparatorTrimReplace:h,tildeTrimReplace:y,caretTrimReplace:m}=e.r(79683),{FLAG_INCLUDE_PRERELEASE:f,FLAG_LOOSE:b}=e.r(30842),g=RegExp(c[p.BUILD],"g"),K=e=>"<0.0.0-0"===e.value,v=e=>""===e.value,S=(e,t)=>{let r=!0,n=e.slice(),a=n.pop();for(;r&&n.length;)r=n.every(e=>a.intersects(e,t)),a=n.pop();return r},E=(e,t)=>(l("comp",e=e.replace(u[p.BUILD],""),t),l("caret",e=j(e,t)),l("tildes",e=k(e,t)),l("xrange",e=A(e,t)),l("stars",e=D(e,t)),e),I=e=>!e||"x"===e.toLowerCase()||"*"===e,k=(e,t)=>e.trim().split(/\s+/).map(e=>w(e,t)).join(" "),w=(e,t)=>{let r=t.loose?u[p.TILDELOOSE]:u[p.TILDE],n=t.includePrerelease?"-0":"";return e.replace(r,(t,r,a,i,s)=>{let o;return l("tilde",e,t,r,a,i,s),I(r)?o="":I(a)?o=`>=${r}.0.0${n} <${+r+1}.0.0-0`:I(i)?o=`>=${r}.${a}.0${n} <${r}.${+a+1}.0-0`:s?(l("replaceTilde pr",s),o=`>=${r}.${a}.${i}-${s} <${r}.${+a+1}.0-0`):o=`>=${r}.${a}.${i} <${r}.${+a+1}.0-0`,l("tilde return",o),o})},j=(e,t)=>e.trim().split(/\s+/).map(e=>x(e,t)).join(" "),x=(e,t)=>{l("caret",e,t);let r=t.loose?u[p.CARETLOOSE]:u[p.CARET],n=t.includePrerelease?"-0":"";return e.replace(r,(t,r,a,i,s)=>{let o;return l("caret",e,t,r,a,i,s),I(r)?o="":I(a)?o=`>=${r}.0.0${n} <${+r+1}.0.0-0`:I(i)?o="0"===r?`>=${r}.${a}.0${n} <${r}.${+a+1}.0-0`:`>=${r}.${a}.0${n} <${+r+1}.0.0-0`:s?(l("replaceCaret pr",s),o="0"===r?"0"===a?`>=${r}.${a}.${i}-${s} <${r}.${a}.${+i+1}-0`:`>=${r}.${a}.${i}-${s} <${r}.${+a+1}.0-0`:`>=${r}.${a}.${i}-${s} <${+r+1}.0.0-0`):(l("no pr"),o="0"===r?"0"===a?`>=${r}.${a}.${i} <${r}.${a}.${+i+1}-0`:`>=${r}.${a}.${i} <${r}.${+a+1}.0-0`:`>=${r}.${a}.${i} <${+r+1}.0.0-0`),l("caret return",o),o})},A=(e,t)=>(l("replaceXRanges",e,t),e.split(/\s+/).map(e=>T(e,t)).join(" ")),T=(e,t)=>{e=e.trim();let r=t.loose?u[p.XRANGELOOSE]:u[p.XRANGE];return e.replace(r,(r,n,a,i,s,o)=>{let d,u,c;if(l("xRange",e,r,n,a,i,s,o),d=a,u=i,c=s,I(d)&&!I(u)||I(u)&&c&&!I(c))return e;let p=I(a),h=p||I(i),y=h||I(s);return"="===n&&y&&(n=""),o=t.includePrerelease?"-0":"",p?r=">"===n||"<"===n?"<0.0.0-0":"*":n&&y?(h&&(i=0),s=0,">"===n?(n=">=",h?(a=+a+1,i=0):i=+i+1,s=0):"<="===n&&(n="<",h?a=+a+1:i=+i+1),"<"===n&&(o="-0"),r=`${n+a}.${i}.${s}${o}`):h?r=`>=${a}.0.0${o} <${+a+1}.0.0-0`:y&&(r=`>=${a}.${i}.0${o} <${a}.${+i+1}.0-0`),l("xRange return",r),r})},D=(e,t)=>(l("replaceStars",e,t),e.trim().replace(u[p.STAR],"")),C=(e,t)=>(l("replaceGTE0",e,t),e.trim().replace(u[t.includePrerelease?p.GTE0PRE:p.GTE0],"")),O=e=>(t,r,n,a,i,s,o,l,d,u,c,p)=>(r=I(n)?"":I(a)?`>=${n}.0.0${e?"-0":""}`:I(i)?`>=${n}.${a}.0${e?"-0":""}`:s?`>=${r}`:`>=${r}${e?"-0":""}`,l=I(d)?"":I(u)?`<${+d+1}.0.0-0`:I(c)?`<${d}.${+u+1}.0-0`:p?`<=${d}.${u}.${c}-${p}`:e?`<${d}.${u}.${+c+1}-0`:`<=${l}`,`${r} ${l}`.trim()),R=(e,t,r)=>{for(let r=0;r<e.length;r++)if(!e[r].test(t))return!1;if(t.prerelease.length&&!r.includePrerelease){for(let r=0;r<e.length;r++)if(l(e[r].semver),e[r].semver!==o.ANY&&e[r].semver.prerelease.length>0){let n=e[r].semver;if(n.major===t.major&&n.minor===t.minor&&n.patch===t.patch)return!0}return!1}return!0}},60254,(e,t,r)=>{"use strict";let n=Symbol("SemVer ANY");class a{static get ANY(){return n}constructor(e,t){if(t=i(t),e instanceof a)if(!!t.loose===e.loose)return e;else e=e.value;d("comparator",e=e.trim().split(/\s+/).join(" "),t),this.options=t,this.loose=!!t.loose,this.parse(e),this.semver===n?this.value="":this.value=this.operator+this.semver.version,d("comp",this)}parse(e){let t=this.options.loose?s[o.COMPARATORLOOSE]:s[o.COMPARATOR],r=e.match(t);if(!r)throw TypeError(`Invalid comparator: ${e}`);this.operator=void 0!==r[1]?r[1]:"","="===this.operator&&(this.operator=""),r[2]?this.semver=new u(r[2],this.options.loose):this.semver=n}toString(){return this.value}test(e){if(d("Comparator.test",e,this.options.loose),this.semver===n||e===n)return!0;if("string"==typeof e)try{e=new u(e,this.options)}catch(e){return!1}return l(e,this.operator,this.semver,this.options)}intersects(e,t){if(!(e instanceof a))throw TypeError("a Comparator is required");return""===this.operator?""===this.value||new c(e.value,t).test(this.value):""===e.operator?""===e.value||new c(this.value,t).test(e.semver):!((t=i(t)).includePrerelease&&("<0.0.0-0"===this.value||"<0.0.0-0"===e.value)||!t.includePrerelease&&(this.value.startsWith("<0.0.0")||e.value.startsWith("<0.0.0")))&&!!(this.operator.startsWith(">")&&e.operator.startsWith(">")||this.operator.startsWith("<")&&e.operator.startsWith("<")||this.semver.version===e.semver.version&&this.operator.includes("=")&&e.operator.includes("=")||l(this.semver,"<",e.semver,t)&&this.operator.startsWith(">")&&e.operator.startsWith("<")||l(this.semver,">",e.semver,t)&&this.operator.startsWith("<")&&e.operator.startsWith(">"))}}t.exports=a;let i=e.r(58124),{safeRe:s,t:o}=e.r(79683),l=e.r(15236),d=e.r(63852),u=e.r(3421),c=e.r(5912)},18247,(e,t,r)=>{"use strict";let n=e.r(5912);t.exports=(e,t,r)=>{try{t=new n(t,r)}catch(e){return!1}return t.test(e)}},35935,(e,t,r)=>{"use strict";let n=e.r(5912);t.exports=(e,t)=>new n(e,t).set.map(e=>e.map(e=>e.value).join(" ").trim().split(" "))},77956,(e,t,r)=>{"use strict";let n=e.r(3421),a=e.r(5912);t.exports=(e,t,r)=>{let i=null,s=null,o=null;try{o=new a(t,r)}catch(e){return null}return e.forEach(e=>{o.test(e)&&(!i||-1===s.compare(e))&&(s=new n(i=e,r))}),i}},787,(e,t,r)=>{"use strict";let n=e.r(3421),a=e.r(5912);t.exports=(e,t,r)=>{let i=null,s=null,o=null;try{o=new a(t,r)}catch(e){return null}return e.forEach(e=>{o.test(e)&&(!i||1===s.compare(e))&&(s=new n(i=e,r))}),i}},56142,(e,t,r)=>{"use strict";let n=e.r(3421),a=e.r(5912),i=e.r(30888);t.exports=(e,t)=>{e=new a(e,t);let r=new n("0.0.0");if(e.test(r)||(r=new n("0.0.0-0"),e.test(r)))return r;r=null;for(let t=0;t<e.set.length;++t){let a=e.set[t],s=null;a.forEach(e=>{let t=new n(e.semver.version);switch(e.operator){case">":0===t.prerelease.length?t.patch++:t.prerelease.push(0),t.raw=t.format();case"":case">=":(!s||i(t,s))&&(s=t);break;case"<":case"<=":break;default:throw Error(`Unexpected operation: ${e.operator}`)}}),s&&(!r||i(r,s))&&(r=s)}return r&&e.test(r)?r:null}},35992,(e,t,r)=>{"use strict";let n=e.r(5912);t.exports=(e,t)=>{try{return new n(e,t).range||"*"}catch(e){return null}}},73301,(e,t,r)=>{"use strict";let n=e.r(3421),a=e.r(60254),{ANY:i}=a,s=e.r(5912),o=e.r(18247),l=e.r(30888),d=e.r(65769),u=e.r(20017),c=e.r(24589);t.exports=(e,t,r,p)=>{let h,y,m,f,b;switch(e=new n(e,p),t=new s(t,p),r){case">":h=l,y=u,m=d,f=">",b=">=";break;case"<":h=d,y=c,m=l,f="<",b="<=";break;default:throw TypeError('Must provide a hilo val of "<" or ">"')}if(o(e,t,p))return!1;for(let r=0;r<t.set.length;++r){let n=t.set[r],s=null,o=null;if(n.forEach(e=>{e.semver===i&&(e=new a(">=0.0.0")),s=s||e,o=o||e,h(e.semver,s.semver,p)?s=e:m(e.semver,o.semver,p)&&(o=e)}),s.operator===f||s.operator===b||(!o.operator||o.operator===f)&&y(e,o.semver)||o.operator===b&&m(e,o.semver))return!1}return!0}},51479,(e,t,r)=>{"use strict";let n=e.r(73301);t.exports=(e,t,r)=>n(e,t,">",r)},79715,(e,t,r)=>{"use strict";let n=e.r(73301);t.exports=(e,t,r)=>n(e,t,"<",r)},77283,(e,t,r)=>{"use strict";let n=e.r(5912);t.exports=(e,t,r)=>(e=new n(e,r),t=new n(t,r),e.intersects(t,r))},20848,(e,t,r)=>{"use strict";let n=e.r(18247),a=e.r(71810);t.exports=(e,t,r)=>{let i=[],s=null,o=null,l=e.sort((e,t)=>a(e,t,r));for(let e of l)n(e,t,r)?(o=e,s||(s=e)):(o&&i.push([s,o]),o=null,s=null);s&&i.push([s,null]);let d=[];for(let[e,t]of i)e===t?d.push(e):t||e!==l[0]?t?e===l[0]?d.push(`<=${t}`):d.push(`${e} - ${t}`):d.push(`>=${e}`):d.push("*");let u=d.join(" || "),c="string"==typeof t.raw?t.raw:String(t);return u.length<c.length?u:t}},5659,(e,t,r)=>{"use strict";let n=e.r(5912),a=e.r(60254),{ANY:i}=a,s=e.r(18247),o=e.r(71810),l=[new a(">=0.0.0-0")],d=[new a(">=0.0.0")],u=(e,t,r)=>{let n,a,u,h,y,m,f;if(e===t)return!0;if(1===e.length&&e[0].semver===i)if(1===t.length&&t[0].semver===i)return!0;else e=r.includePrerelease?l:d;if(1===t.length&&t[0].semver===i)if(r.includePrerelease)return!0;else t=d;let b=new Set;for(let t of e)">"===t.operator||">="===t.operator?n=c(n,t,r):"<"===t.operator||"<="===t.operator?a=p(a,t,r):b.add(t.semver);if(b.size>1)return null;if(n&&a&&((u=o(n.semver,a.semver,r))>0||0===u&&(">="!==n.operator||"<="!==a.operator)))return null;for(let e of b){if(n&&!s(e,String(n),r)||a&&!s(e,String(a),r))return null;for(let n of t)if(!s(e,String(n),r))return!1;return!0}let g=!!a&&!r.includePrerelease&&!!a.semver.prerelease.length&&a.semver,K=!!n&&!r.includePrerelease&&!!n.semver.prerelease.length&&n.semver;for(let e of(g&&1===g.prerelease.length&&"<"===a.operator&&0===g.prerelease[0]&&(g=!1),t)){if(f=f||">"===e.operator||">="===e.operator,m=m||"<"===e.operator||"<="===e.operator,n){if(K&&e.semver.prerelease&&e.semver.prerelease.length&&e.semver.major===K.major&&e.semver.minor===K.minor&&e.semver.patch===K.patch&&(K=!1),">"===e.operator||">="===e.operator){if((h=c(n,e,r))===e&&h!==n)return!1}else if(">="===n.operator&&!e.test(n.semver))return!1}if(a){if(g&&e.semver.prerelease&&e.semver.prerelease.length&&e.semver.major===g.major&&e.semver.minor===g.minor&&e.semver.patch===g.patch&&(g=!1),"<"===e.operator||"<="===e.operator){if((y=p(a,e,r))===e&&y!==a)return!1}else if("<="===a.operator&&!e.test(a.semver))return!1}if(!e.operator&&(a||n)&&0!==u)return!1}return(!n||!m||!!a||0===u)&&(!a||!f||!!n||0===u)&&!K&&!g&&!0},c=(e,t,r)=>{if(!e)return t;let n=o(e.semver,t.semver,r);return n>0?e:n<0||">"===t.operator&&">="===e.operator?t:e},p=(e,t,r)=>{if(!e)return t;let n=o(e.semver,t.semver,r);return n<0?e:n>0||"<"===t.operator&&"<="===e.operator?t:e};t.exports=(e,t,r={})=>{if(e===t)return!0;e=new n(e,r),t=new n(t,r);let a=!1;e:for(let n of e.set){for(let e of t.set){let t=u(n,e,r);if(a=a||null!==t,t)continue e}if(a)return!1}return!0}},50015,(e,t,r)=>{"use strict";let n=e.r(79683),a=e.r(30842),i=e.r(3421),s=e.r(14842),o=e.r(70749),l=e.r(87912),d=e.r(26670),u=e.r(51116),c=e.r(81286),p=e.r(32499),h=e.r(28465),y=e.r(83108),m=e.r(96875),f=e.r(71810),b=e.r(37024),g=e.r(16254),K=e.r(73902),v=e.r(65789),S=e.r(57862),E=e.r(30888),I=e.r(65769),k=e.r(72747),w=e.r(63330),j=e.r(24589),x=e.r(20017),A=e.r(15236),T=e.r(30641),D=e.r(85370),C=e.r(60254),O=e.r(5912),R=e.r(18247),M=e.r(35935),P=e.r(77956),N=e.r(787),J=e.r(56142),L=e.r(35992),_=e.r(73301),F=e.r(51479),q=e.r(79715),G=e.r(77283);t.exports={parse:o,valid:l,clean:d,inc:u,diff:c,major:p,minor:h,patch:y,prerelease:m,compare:f,rcompare:b,compareLoose:g,compareBuild:K,sort:v,rsort:S,gt:E,lt:I,eq:k,neq:w,gte:j,lte:x,cmp:A,coerce:T,truncate:D,Comparator:C,Range:O,satisfies:R,toComparators:M,maxSatisfying:P,minSatisfying:N,minVersion:J,validRange:L,outside:_,gtr:F,ltr:q,intersects:G,simplifyRange:e.r(20848),subset:e.r(5659),SemVer:i,re:n.re,src:n.src,tokens:n.t,SEMVER_SPEC_VERSION:a.SEMVER_SPEC_VERSION,RELEASE_TYPES:a.RELEASE_TYPES,compareIdentifiers:s.compareIdentifiers,rcompareIdentifiers:s.rcompareIdentifiers}},88947,(e,t,r)=>{t.exports=e.x("stream",()=>require("stream"))},62562,(e,t,r)=>{t.exports=e.x("module",()=>require("module"))},92509,(e,t,r)=>{t.exports=e.x("url",()=>require("url"))},49772,(e,t,r)=>{"use strict";let n=()=>"linux"===process.platform,a=null;t.exports={isLinux:n,getReport:()=>(!a&&(n()&&process.report||(a={})),a)}},48150,(e,t,r)=>{"use strict";let n=e.r(22734);t.exports={LDD_PATH:"/usr/bin/ldd",SELF_PATH:"/proc/self/exe",readFileSync:e=>{let t=n.openSync(e,"r"),r=Buffer.alloc(2048),a=n.readSync(t,r,0,2048,0);return n.close(t,()=>{}),r.subarray(0,a)},readFile:e=>new Promise((t,r)=>{n.open(e,"r",(e,a)=>{if(e)r(e);else{let e=Buffer.alloc(2048);n.read(a,e,0,2048,0,(r,i)=>{t(e.subarray(0,i)),n.close(a,()=>{})})}})})}},14496,(e,t,r)=>{"use strict";t.exports={interpreterPath:e=>{if(e.length<64||0x7f454c46!==e.readUInt32BE(0)||2!==e.readUInt8(4)||1!==e.readUInt8(5))return null;let t=e.readUInt32LE(32),r=e.readUInt16LE(54),n=e.readUInt16LE(56);for(let a=0;a<n;a++){let n=t+a*r;if(3===e.readUInt32LE(n)){let t=e.readUInt32LE(n+8),r=e.readUInt32LE(n+32);return e.subarray(t,t+r).toString().replace(/\0.*$/g,"")}}return null}}},55146,(e,t,r)=>{"use strict";let n,a,i,s=e.r(33405),{isLinux:o,getReport:l}=e.r(49772),{LDD_PATH:d,SELF_PATH:u,readFile:c,readFileSync:p}=e.r(48150),{interpreterPath:h}=e.r(14496),y="getconf GNU_LIBC_VERSION 2>&1 || true; ldd --version 2>&1 || true",m="",f=()=>m||new Promise(e=>{s.exec(y,(t,r)=>{e(m=t?" ":r)})}),b=()=>{if(!m)try{m=s.execSync(y,{encoding:"utf8"})}catch(e){m=" "}return m},g="glibc",K=/LIBC[a-z0-9 \-).]*?(\d+\.\d+)/i,v="musl",S=e=>e.includes("libc.musl-")||e.includes("ld-musl-"),E=()=>{let e=l();return e.header&&e.header.glibcVersionRuntime?g:Array.isArray(e.sharedObjects)&&e.sharedObjects.some(S)?v:null},I=e=>{let[t,r]=e.split(/[\r\n]+/);return t&&t.includes(g)?g:r&&r.includes(v)?v:null},k=e=>{if(e){if(e.includes("/ld-musl-"))return v;else if(e.includes("/ld-linux-"))return g}return null},w=e=>(e=e.toString()).includes("musl")?v:e.includes("GNU C Library")?g:null,j=async()=>{if(void 0!==a)return a;a=null;try{let e=await c(d);a=w(e)}catch(e){}return a},x=async()=>{if(void 0!==n)return n;n=null;try{let e=await c(u),t=h(e);n=k(t)}catch(e){}return n},A=async()=>{let e=null;return o()&&((e=await x())||((e=await j())||(e=E()),e||(e=I(await f())))),e},T=()=>{let e=null;return o()&&((e=(()=>{if(void 0!==n)return n;n=null;try{let e=p(u),t=h(e);n=k(t)}catch(e){}return n})())||((e=(()=>{if(void 0!==a)return a;a=null;try{let e=p(d);a=w(e)}catch(e){}return a})())||(e=E()),e||(e=I(b())))),e},D=async()=>o()&&await A()!==g,C=async()=>{if(void 0!==i)return i;i=null;try{let e=(await c(d)).match(K);e&&(i=e[1])}catch(e){}return i},O=()=>{let e=l();return e.header&&e.header.glibcVersionRuntime?e.header.glibcVersionRuntime:null},R=e=>e.trim().split(/\s+/)[1],M=e=>{let[t,r,n]=e.split(/[\r\n]+/);return t&&t.includes(g)?R(t):r&&n&&r.includes(v)?R(n):null};t.exports={GLIBC:g,MUSL:v,family:A,familySync:T,isNonGlibcLinux:D,isNonGlibcLinuxSync:()=>o()&&T()!==g,version:async()=>{let e=null;return o()&&((e=await C())||(e=O()),e||(e=M(await f()))),e},versionSync:()=>{let e=null;return o()&&((e=(()=>{if(void 0!==i)return i;i=null;try{let e=p(d).match(K);e&&(i=e[1])}catch(e){}return i})())||(e=O()),e||(e=M(b()))),e}}},56943,(e,t,r)=>{var n=e.r(22734),a=e.r(14747),i=e.r(92509),s=e.r(46786),o="function"==typeof __webpack_require__?__non_webpack_require__:e.t,l=process.config&&process.config.variables||{},d=!!process.env.PREBUILDS_ONLY,u=process.versions,c=u.modules;(u.deno||process.isBun)&&(c="unsupported");var p=process.versions&&process.versions.electron||process.env.ELECTRON_RUN_AS_NODE?"electron":process.versions&&process.versions.nw?"node-webkit":"node",h=process.env.npm_config_arch||s.arch(),y=process.env.npm_config_platform||s.platform(),m=process.env.LIBC||(!function(t){if("linux"!==t)return!1;let{familySync:r,MUSL:n}=e.r(55146);return r()===n}(y)?"glibc":"musl"),f=process.env.ARM_VERSION||("arm64"===h?"8":l.arm_version)||"",b=(u.uv||"").split(".")[0];function g(e){return o(g.resolve(e))}function K(e){try{return n.readdirSync(e)}catch(e){return[]}}function v(e,t){var r=K(e).filter(t);return r[0]&&a.join(e,r[0])}function S(e){return/\.node$/.test(e)}function E(e){var t=e.split("-");if(2===t.length){var r=t[0],n=t[1].split("+");if(r&&n.length&&n.every(Boolean))return{name:e,platform:r,architectures:n}}}function I(e,t){return function(r){return null!=r&&r.platform===e&&r.architectures.includes(t)}}function k(e,t){return e.architectures.length-t.architectures.length}function w(e){var t=e.split("."),r=t.pop(),n={file:e,specificity:0};if("node"===r){for(var a=0;a<t.length;a++){var i=t[a];if("node"===i||"electron"===i||"node-webkit"===i)n.runtime=i;else if("napi"===i)n.napi=!0;else if("abi"===i.slice(0,3))n.abi=i.slice(3);else if("uv"===i.slice(0,2))n.uv=i.slice(2);else if("armv"===i.slice(0,4))n.armv=i.slice(4);else{if("glibc"!==i&&"musl"!==i)continue;n.libc=i}n.specificity++}return n}}function j(e,t){return function(r){var n;return null!=r&&(r.runtime===e||!!("node"===(n=r).runtime&&n.napi))&&(r.abi===t||!!r.napi)&&(!r.uv||r.uv===b)&&(!r.armv||r.armv===f)&&(!r.libc||r.libc===m)&&!0}}function x(e){return function(t,r){return t.runtime!==r.runtime?t.runtime===e?-1:1:t.abi!==r.abi?t.abi?-1:1:t.specificity!==r.specificity?t.specificity>r.specificity?-1:1:0}}t.exports=g,g.resolve=g.path=function(t){t=a.resolve(t||".");var r,n,s="";try{var l=(s=o(a.join(t,"package.json")).name).toUpperCase().replace(/-/g,"_");process.env[l+"_PREBUILD"]&&(t=process.env[l+"_PREBUILD"])}catch(e){r=e}if(!d){var u=v(a.join(t,"build/Release"),S);if(u)return u;var g=v(a.join(t,"build/Debug"),S);if(g)return g}var A=R(t);if(A)return A;var T=R(a.dirname(process.execPath));if(T)return T;var D=("@"==s[0]?"":"@"+s+"/")+s+"-"+y+"-"+h;try{var C=a.dirname(e.r(62562).createRequire(i.pathToFileURL(a.join(t,"package.json"))).resolve(D));return M(C)}catch(e){n=e}let O="No native build was found for "+["platform="+y,"arch="+h,"runtime="+p,"abi="+c,"uv="+b,f?"armv="+f:"","libc="+m,"node="+process.versions.node,process.versions.electron?"electron="+process.versions.electron:"","function"==typeof __webpack_require__?"webpack=true":""].filter(Boolean).join(" ")+"\n    attempted loading from: "+t+" and package: "+D+"\n";throw r&&(O+="Error finding package.json: "+r.message+"\n"),n&&(O+="Error resolving package: "+n.message+"\n"),Error(O);function R(e){var t=K(a.join(e,"prebuilds")).map(E).filter(I(y,h)).sort(k)[0];if(t)return M(a.join(e,"prebuilds",t.name))}function M(e){var t=K(e).map(w).filter(j(p,c)).sort(x(p))[0];if(t)return a.join(e,t.file)}},g.parseTags=w,g.matchTags=j,g.compareTags=x,g.parseTuple=E,g.matchTuple=I,g.compareTuples=k},80583,(e,t,r)=>{let n="function"==typeof __webpack_require__?__non_webpack_require__:e.t;"function"==typeof n.addon?t.exports=n.addon.bind(n):t.exports=e.r(56943)},70156,(e,t,r)=>{t.exports=e.r(80583)("/ROOT/node_modules/msgpackr-extract")},66990,(e,t,r)=>{t.exports=JSON.parse('{"vadd":{"arity":-5,"flags":["write","denyoom","module"],"keyStart":1,"keyStop":1,"step":1},"vcard":{"arity":2,"flags":["readonly","module","fast"],"keyStart":1,"keyStop":1,"step":1},"vdim":{"arity":2,"flags":["readonly","module","fast"],"keyStart":1,"keyStop":1,"step":1},"vemb":{"arity":-3,"flags":["readonly","module","fast"],"keyStart":1,"keyStop":1,"step":1},"vgetattr":{"arity":3,"flags":["readonly","module","fast"],"keyStart":1,"keyStop":1,"step":1},"vinfo":{"arity":2,"flags":["readonly","module","fast"],"keyStart":1,"keyStop":1,"step":1},"vismember":{"arity":3,"flags":["readonly","module"],"keyStart":1,"keyStop":1,"step":1},"vlinks":{"arity":-3,"flags":["readonly","module","fast"],"keyStart":1,"keyStop":1,"step":1},"vrandmember":{"arity":-2,"flags":["readonly","module"],"keyStart":1,"keyStop":1,"step":1},"vrange":{"arity":-4,"flags":["readonly","module"],"keyStart":1,"keyStop":1,"step":1},"vrem":{"arity":3,"flags":["write","module"],"keyStart":1,"keyStop":1,"step":1},"vsetattr":{"arity":4,"flags":["write","module","fast"],"keyStart":1,"keyStop":1,"step":1},"vsim":{"arity":-4,"flags":["readonly","module"],"keyStart":1,"keyStop":1,"step":1},"acl":{"arity":-2,"flags":[],"keyStart":0,"keyStop":0,"step":0},"append":{"arity":3,"flags":["write","denyoom","fast"],"keyStart":1,"keyStop":1,"step":1},"arcount":{"arity":2,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"ardel":{"arity":-3,"flags":["write","fast"],"keyStart":1,"keyStop":1,"step":1},"ardelrange":{"arity":-4,"flags":["write"],"keyStart":1,"keyStop":1,"step":1},"arget":{"arity":3,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"argetrange":{"arity":4,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"argrep":{"arity":-6,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"arinfo":{"arity":-2,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"arinsert":{"arity":-3,"flags":["write","denyoom","fast"],"keyStart":1,"keyStop":1,"step":1},"arlastitems":{"arity":-3,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"arlen":{"arity":2,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"armget":{"arity":-3,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"armset":{"arity":-4,"flags":["write","denyoom","fast"],"keyStart":1,"keyStop":1,"step":1},"arnext":{"arity":2,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"arop":{"arity":-5,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"arring":{"arity":-4,"flags":["write","denyoom"],"keyStart":1,"keyStop":1,"step":1},"arscan":{"arity":-4,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"arseek":{"arity":3,"flags":["write","fast"],"keyStart":1,"keyStop":1,"step":1},"arset":{"arity":-4,"flags":["write","denyoom","fast"],"keyStart":1,"keyStop":1,"step":1},"asking":{"arity":1,"flags":["fast"],"keyStart":0,"keyStop":0,"step":0},"auth":{"arity":-2,"flags":["noscript","loading","stale","fast","no_auth","allow_busy"],"keyStart":0,"keyStop":0,"step":0},"bgrewriteaof":{"arity":1,"flags":["admin","noscript","no_async_loading"],"keyStart":0,"keyStop":0,"step":0},"bgsave":{"arity":-1,"flags":["admin","noscript","no_async_loading"],"keyStart":0,"keyStop":0,"step":0},"bitcount":{"arity":-2,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"bitfield":{"arity":-2,"flags":["write","denyoom"],"keyStart":1,"keyStop":1,"step":1},"bitfield_ro":{"arity":-2,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"bitop":{"arity":-4,"flags":["write","denyoom"],"keyStart":2,"keyStop":-1,"step":1},"bitpos":{"arity":-3,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"blmove":{"arity":6,"flags":["write","denyoom","noscript","blocking"],"keyStart":1,"keyStop":2,"step":1},"blmpop":{"arity":-5,"flags":["write","blocking","movablekeys"],"keyStart":0,"keyStop":0,"step":0},"blpop":{"arity":-3,"flags":["write","noscript","blocking"],"keyStart":1,"keyStop":-2,"step":1},"brpop":{"arity":-3,"flags":["write","noscript","blocking"],"keyStart":1,"keyStop":-2,"step":1},"brpoplpush":{"arity":4,"flags":["write","denyoom","noscript","blocking"],"keyStart":1,"keyStop":2,"step":1},"bzmpop":{"arity":-5,"flags":["write","blocking","movablekeys"],"keyStart":0,"keyStop":0,"step":0},"bzpopmax":{"arity":-3,"flags":["write","noscript","blocking","fast"],"keyStart":1,"keyStop":-2,"step":1},"bzpopmin":{"arity":-3,"flags":["write","noscript","blocking","fast"],"keyStart":1,"keyStop":-2,"step":1},"client":{"arity":-2,"flags":[],"keyStart":0,"keyStop":0,"step":0},"cluster":{"arity":-2,"flags":[],"keyStart":0,"keyStop":0,"step":0},"command":{"arity":-1,"flags":["loading","stale"],"keyStart":0,"keyStop":0,"step":0},"config":{"arity":-2,"flags":[],"keyStart":0,"keyStop":0,"step":0},"copy":{"arity":-3,"flags":["write","denyoom"],"keyStart":1,"keyStop":2,"step":1},"dbsize":{"arity":1,"flags":["readonly","fast"],"keyStart":0,"keyStop":0,"step":0},"debug":{"arity":-2,"flags":["admin","noscript","loading","stale"],"keyStart":0,"keyStop":0,"step":0},"decr":{"arity":2,"flags":["write","denyoom","fast"],"keyStart":1,"keyStop":1,"step":1},"decrby":{"arity":3,"flags":["write","denyoom","fast"],"keyStart":1,"keyStop":1,"step":1},"del":{"arity":-2,"flags":["write"],"keyStart":1,"keyStop":-1,"step":1},"discard":{"arity":1,"flags":["noscript","loading","stale","fast","allow_busy"],"keyStart":0,"keyStop":0,"step":0},"dump":{"arity":2,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"echo":{"arity":2,"flags":["fast"],"keyStart":0,"keyStop":0,"step":0},"eval":{"arity":-3,"flags":["noscript","stale","skip_monitor","no_mandatory_keys","movablekeys"],"keyStart":0,"keyStop":0,"step":0},"eval_ro":{"arity":-3,"flags":["readonly","noscript","stale","skip_monitor","no_mandatory_keys","movablekeys"],"keyStart":0,"keyStop":0,"step":0},"evalsha":{"arity":-3,"flags":["noscript","stale","skip_monitor","no_mandatory_keys","movablekeys"],"keyStart":0,"keyStop":0,"step":0},"evalsha_ro":{"arity":-3,"flags":["readonly","noscript","stale","skip_monitor","no_mandatory_keys","movablekeys"],"keyStart":0,"keyStop":0,"step":0},"exec":{"arity":1,"flags":["noscript","loading","stale","skip_slowlog"],"keyStart":0,"keyStop":0,"step":0},"exists":{"arity":-2,"flags":["readonly","fast"],"keyStart":1,"keyStop":-1,"step":1},"expire":{"arity":-3,"flags":["write","fast"],"keyStart":1,"keyStop":1,"step":1},"expireat":{"arity":-3,"flags":["write","fast"],"keyStart":1,"keyStop":1,"step":1},"expiretime":{"arity":2,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"failover":{"arity":-1,"flags":["admin","noscript","stale"],"keyStart":0,"keyStop":0,"step":0},"fcall":{"arity":-3,"flags":["noscript","stale","skip_monitor","no_mandatory_keys","movablekeys"],"keyStart":0,"keyStop":0,"step":0},"fcall_ro":{"arity":-3,"flags":["readonly","noscript","stale","skip_monitor","no_mandatory_keys","movablekeys"],"keyStart":0,"keyStop":0,"step":0},"flushall":{"arity":-1,"flags":["write"],"keyStart":0,"keyStop":0,"step":0},"flushdb":{"arity":-1,"flags":["write"],"keyStart":0,"keyStop":0,"step":0},"function":{"arity":-2,"flags":[],"keyStart":0,"keyStop":0,"step":0},"geoadd":{"arity":-5,"flags":["write","denyoom"],"keyStart":1,"keyStop":1,"step":1},"geodist":{"arity":-4,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"geohash":{"arity":-2,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"geopos":{"arity":-2,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"georadius":{"arity":-6,"flags":["write","denyoom","movablekeys"],"keyStart":1,"keyStop":1,"step":1},"georadius_ro":{"arity":-6,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"georadiusbymember":{"arity":-5,"flags":["write","denyoom","movablekeys"],"keyStart":1,"keyStop":1,"step":1},"georadiusbymember_ro":{"arity":-5,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"geosearch":{"arity":-7,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"geosearchstore":{"arity":-8,"flags":["write","denyoom"],"keyStart":1,"keyStop":2,"step":1},"get":{"arity":2,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"getbit":{"arity":3,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"getdel":{"arity":2,"flags":["write","fast"],"keyStart":1,"keyStop":1,"step":1},"getex":{"arity":-2,"flags":["write","fast"],"keyStart":1,"keyStop":1,"step":1},"getrange":{"arity":4,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"getset":{"arity":3,"flags":["write","denyoom","fast"],"keyStart":1,"keyStop":1,"step":1},"hdel":{"arity":-3,"flags":["write","fast"],"keyStart":1,"keyStop":1,"step":1},"hello":{"arity":-1,"flags":["noscript","loading","stale","fast","no_auth","allow_busy"],"keyStart":0,"keyStop":0,"step":0},"hexists":{"arity":3,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"hexpire":{"arity":-6,"flags":["write","fast"],"keyStart":1,"keyStop":1,"step":1},"hexpireat":{"arity":-6,"flags":["write","fast"],"keyStart":1,"keyStop":1,"step":1},"hexpiretime":{"arity":-5,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"hget":{"arity":3,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"hgetall":{"arity":2,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"hgetdel":{"arity":-5,"flags":["write","fast"],"keyStart":1,"keyStop":1,"step":1},"hgetex":{"arity":-5,"flags":["write","fast"],"keyStart":1,"keyStop":1,"step":1},"hincrby":{"arity":4,"flags":["write","denyoom","fast"],"keyStart":1,"keyStop":1,"step":1},"hincrbyfloat":{"arity":4,"flags":["write","denyoom","fast"],"keyStart":1,"keyStop":1,"step":1},"hkeys":{"arity":2,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"hlen":{"arity":2,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"hmget":{"arity":-3,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"hmset":{"arity":-4,"flags":["write","denyoom","fast"],"keyStart":1,"keyStop":1,"step":1},"hpersist":{"arity":-5,"flags":["write","fast"],"keyStart":1,"keyStop":1,"step":1},"hpexpire":{"arity":-6,"flags":["write","fast"],"keyStart":1,"keyStop":1,"step":1},"hpexpireat":{"arity":-6,"flags":["write","fast"],"keyStart":1,"keyStop":1,"step":1},"hpexpiretime":{"arity":-5,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"hpttl":{"arity":-5,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"hrandfield":{"arity":-2,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"hscan":{"arity":-3,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"hset":{"arity":-4,"flags":["write","denyoom","fast"],"keyStart":1,"keyStop":1,"step":1},"hsetex":{"arity":-6,"flags":["write","denyoom","fast"],"keyStart":1,"keyStop":1,"step":1},"hsetnx":{"arity":4,"flags":["write","denyoom","fast"],"keyStart":1,"keyStop":1,"step":1},"hstrlen":{"arity":3,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"httl":{"arity":-5,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"hvals":{"arity":2,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"incr":{"arity":2,"flags":["write","denyoom","fast"],"keyStart":1,"keyStop":1,"step":1},"incrby":{"arity":3,"flags":["write","denyoom","fast"],"keyStart":1,"keyStop":1,"step":1},"incrbyfloat":{"arity":3,"flags":["write","denyoom","fast"],"keyStart":1,"keyStop":1,"step":1},"increx":{"arity":-2,"flags":["write","denyoom","fast"],"keyStart":1,"keyStop":1,"step":1},"info":{"arity":-1,"flags":["loading","stale"],"keyStart":0,"keyStop":0,"step":0},"keys":{"arity":2,"flags":["readonly"],"keyStart":0,"keyStop":0,"step":0},"lastsave":{"arity":1,"flags":["loading","stale","fast"],"keyStart":0,"keyStop":0,"step":0},"latency":{"arity":-2,"flags":[],"keyStart":0,"keyStop":0,"step":0},"lcs":{"arity":-3,"flags":["readonly"],"keyStart":1,"keyStop":2,"step":1},"lindex":{"arity":3,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"linsert":{"arity":5,"flags":["write","denyoom"],"keyStart":1,"keyStop":1,"step":1},"llen":{"arity":2,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"lmove":{"arity":5,"flags":["write","denyoom"],"keyStart":1,"keyStop":2,"step":1},"lmpop":{"arity":-4,"flags":["write","movablekeys"],"keyStart":0,"keyStop":0,"step":0},"lolwut":{"arity":-1,"flags":["readonly","fast"],"keyStart":0,"keyStop":0,"step":0},"lpop":{"arity":-2,"flags":["write","fast"],"keyStart":1,"keyStop":1,"step":1},"lpos":{"arity":-3,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"lpush":{"arity":-3,"flags":["write","denyoom","fast"],"keyStart":1,"keyStop":1,"step":1},"lpushx":{"arity":-3,"flags":["write","denyoom","fast"],"keyStart":1,"keyStop":1,"step":1},"lrange":{"arity":4,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"lrem":{"arity":4,"flags":["write"],"keyStart":1,"keyStop":1,"step":1},"lset":{"arity":4,"flags":["write","denyoom"],"keyStart":1,"keyStop":1,"step":1},"ltrim":{"arity":4,"flags":["write"],"keyStart":1,"keyStop":1,"step":1},"memory":{"arity":-2,"flags":[],"keyStart":0,"keyStop":0,"step":0},"mget":{"arity":-2,"flags":["readonly","fast"],"keyStart":1,"keyStop":-1,"step":1},"migrate":{"arity":-6,"flags":["write","movablekeys"],"keyStart":3,"keyStop":3,"step":1},"module":{"arity":-2,"flags":[],"keyStart":0,"keyStop":0,"step":0},"monitor":{"arity":1,"flags":["admin","noscript","loading","stale"],"keyStart":0,"keyStop":0,"step":0},"move":{"arity":3,"flags":["write","fast"],"keyStart":1,"keyStop":1,"step":1},"mset":{"arity":-3,"flags":["write","denyoom"],"keyStart":1,"keyStop":-1,"step":2},"msetex":{"arity":-4,"flags":["write","denyoom","movablekeys"],"keyStart":0,"keyStop":0,"step":0},"msetnx":{"arity":-3,"flags":["write","denyoom"],"keyStart":1,"keyStop":-1,"step":2},"multi":{"arity":1,"flags":["noscript","loading","stale","fast","allow_busy"],"keyStart":0,"keyStop":0,"step":0},"object":{"arity":-2,"flags":[],"keyStart":0,"keyStop":0,"step":0},"persist":{"arity":2,"flags":["write","fast"],"keyStart":1,"keyStop":1,"step":1},"pexpire":{"arity":-3,"flags":["write","fast"],"keyStart":1,"keyStop":1,"step":1},"pexpireat":{"arity":-3,"flags":["write","fast"],"keyStart":1,"keyStop":1,"step":1},"pexpiretime":{"arity":2,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"pfadd":{"arity":-2,"flags":["write","denyoom","fast"],"keyStart":1,"keyStop":1,"step":1},"pfcount":{"arity":-2,"flags":["readonly"],"keyStart":1,"keyStop":-1,"step":1},"pfdebug":{"arity":3,"flags":["write","denyoom","admin"],"keyStart":2,"keyStop":2,"step":1},"pfmerge":{"arity":-2,"flags":["write","denyoom"],"keyStart":1,"keyStop":-1,"step":1},"pfselftest":{"arity":1,"flags":["admin"],"keyStart":0,"keyStop":0,"step":0},"ping":{"arity":-1,"flags":["fast"],"keyStart":0,"keyStop":0,"step":0},"psetex":{"arity":4,"flags":["write","denyoom"],"keyStart":1,"keyStop":1,"step":1},"psubscribe":{"arity":-2,"flags":["pubsub","noscript","loading","stale"],"keyStart":0,"keyStop":0,"step":0},"psync":{"arity":-3,"flags":["admin","noscript","no_async_loading","no_multi"],"keyStart":0,"keyStop":0,"step":0},"pttl":{"arity":2,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"publish":{"arity":3,"flags":["pubsub","loading","stale","fast"],"keyStart":0,"keyStop":0,"step":0},"pubsub":{"arity":-2,"flags":[],"keyStart":0,"keyStop":0,"step":0},"punsubscribe":{"arity":-1,"flags":["pubsub","noscript","loading","stale"],"keyStart":0,"keyStop":0,"step":0},"quit":{"arity":-1,"flags":["noscript","loading","stale","fast","no_auth","allow_busy"],"keyStart":0,"keyStop":0,"step":0},"randomkey":{"arity":1,"flags":["readonly"],"keyStart":0,"keyStop":0,"step":0},"readonly":{"arity":1,"flags":["loading","stale","fast"],"keyStart":0,"keyStop":0,"step":0},"readwrite":{"arity":1,"flags":["loading","stale","fast"],"keyStart":0,"keyStop":0,"step":0},"rename":{"arity":3,"flags":["write"],"keyStart":1,"keyStop":2,"step":1},"renamenx":{"arity":3,"flags":["write","fast"],"keyStart":1,"keyStop":2,"step":1},"replconf":{"arity":-1,"flags":["admin","noscript","loading","stale","allow_busy"],"keyStart":0,"keyStop":0,"step":0},"replicaof":{"arity":3,"flags":["admin","noscript","stale","no_async_loading"],"keyStart":0,"keyStop":0,"step":0},"reset":{"arity":1,"flags":["noscript","loading","stale","fast","no_auth","allow_busy"],"keyStart":0,"keyStop":0,"step":0},"restore":{"arity":-4,"flags":["write","denyoom"],"keyStart":1,"keyStop":1,"step":1},"restore-asking":{"arity":-4,"flags":["write","denyoom","asking"],"keyStart":1,"keyStop":1,"step":1},"role":{"arity":1,"flags":["noscript","loading","stale","fast"],"keyStart":0,"keyStop":0,"step":0},"rpop":{"arity":-2,"flags":["write","fast"],"keyStart":1,"keyStop":1,"step":1},"rpoplpush":{"arity":3,"flags":["write","denyoom"],"keyStart":1,"keyStop":2,"step":1},"rpush":{"arity":-3,"flags":["write","denyoom","fast"],"keyStart":1,"keyStop":1,"step":1},"rpushx":{"arity":-3,"flags":["write","denyoom","fast"],"keyStart":1,"keyStop":1,"step":1},"sadd":{"arity":-3,"flags":["write","denyoom","fast"],"keyStart":1,"keyStop":1,"step":1},"save":{"arity":1,"flags":["admin","noscript","no_async_loading","no_multi"],"keyStart":0,"keyStop":0,"step":0},"scan":{"arity":-2,"flags":["readonly"],"keyStart":0,"keyStop":0,"step":0},"scard":{"arity":2,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"script":{"arity":-2,"flags":[],"keyStart":0,"keyStop":0,"step":0},"sdiff":{"arity":-2,"flags":["readonly"],"keyStart":1,"keyStop":-1,"step":1},"sdiffstore":{"arity":-3,"flags":["write","denyoom"],"keyStart":1,"keyStop":-1,"step":1},"select":{"arity":2,"flags":["loading","stale","fast"],"keyStart":0,"keyStop":0,"step":0},"set":{"arity":-3,"flags":["write","denyoom"],"keyStart":1,"keyStop":1,"step":1},"setbit":{"arity":4,"flags":["write","denyoom"],"keyStart":1,"keyStop":1,"step":1},"setex":{"arity":4,"flags":["write","denyoom"],"keyStart":1,"keyStop":1,"step":1},"setnx":{"arity":3,"flags":["write","denyoom","fast"],"keyStart":1,"keyStop":1,"step":1},"setrange":{"arity":4,"flags":["write","denyoom"],"keyStart":1,"keyStop":1,"step":1},"shutdown":{"arity":-1,"flags":["admin","noscript","loading","stale","no_multi","allow_busy"],"keyStart":0,"keyStop":0,"step":0},"sinter":{"arity":-2,"flags":["readonly"],"keyStart":1,"keyStop":-1,"step":1},"sintercard":{"arity":-3,"flags":["readonly","movablekeys"],"keyStart":0,"keyStop":0,"step":0},"sinterstore":{"arity":-3,"flags":["write","denyoom"],"keyStart":1,"keyStop":-1,"step":1},"sismember":{"arity":3,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"slaveof":{"arity":3,"flags":["admin","noscript","stale","no_async_loading"],"keyStart":0,"keyStop":0,"step":0},"slowlog":{"arity":-2,"flags":[],"keyStart":0,"keyStop":0,"step":0},"smembers":{"arity":2,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"smismember":{"arity":-3,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"smove":{"arity":4,"flags":["write","fast"],"keyStart":1,"keyStop":2,"step":1},"sort":{"arity":-2,"flags":["write","denyoom","movablekeys"],"keyStart":1,"keyStop":1,"step":1},"sort_ro":{"arity":-2,"flags":["readonly","movablekeys"],"keyStart":1,"keyStop":1,"step":1},"spop":{"arity":-2,"flags":["write","fast"],"keyStart":1,"keyStop":1,"step":1},"spublish":{"arity":3,"flags":["pubsub","loading","stale","fast"],"keyStart":1,"keyStop":1,"step":1},"srandmember":{"arity":-2,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"srem":{"arity":-3,"flags":["write","fast"],"keyStart":1,"keyStop":1,"step":1},"sscan":{"arity":-3,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"ssubscribe":{"arity":-2,"flags":["pubsub","noscript","loading","stale"],"keyStart":1,"keyStop":-1,"step":1},"strlen":{"arity":2,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"subscribe":{"arity":-2,"flags":["pubsub","noscript","loading","stale"],"keyStart":0,"keyStop":0,"step":0},"substr":{"arity":4,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"sunion":{"arity":-2,"flags":["readonly"],"keyStart":1,"keyStop":-1,"step":1},"sunionstore":{"arity":-3,"flags":["write","denyoom"],"keyStart":1,"keyStop":-1,"step":1},"sunsubscribe":{"arity":-1,"flags":["pubsub","noscript","loading","stale"],"keyStart":1,"keyStop":-1,"step":1},"swapdb":{"arity":3,"flags":["write","fast"],"keyStart":0,"keyStop":0,"step":0},"sync":{"arity":1,"flags":["admin","noscript","no_async_loading","no_multi"],"keyStart":0,"keyStop":0,"step":0},"time":{"arity":1,"flags":["loading","stale","fast"],"keyStart":0,"keyStop":0,"step":0},"touch":{"arity":-2,"flags":["readonly","fast"],"keyStart":1,"keyStop":-1,"step":1},"ttl":{"arity":2,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"type":{"arity":2,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"unlink":{"arity":-2,"flags":["write","fast"],"keyStart":1,"keyStop":-1,"step":1},"unsubscribe":{"arity":-1,"flags":["pubsub","noscript","loading","stale"],"keyStart":0,"keyStop":0,"step":0},"unwatch":{"arity":1,"flags":["noscript","loading","stale","fast","allow_busy"],"keyStart":0,"keyStop":0,"step":0},"wait":{"arity":3,"flags":["noscript"],"keyStart":0,"keyStop":0,"step":0},"watch":{"arity":-2,"flags":["noscript","loading","stale","fast","allow_busy"],"keyStart":1,"keyStop":-1,"step":1},"xack":{"arity":-4,"flags":["write","fast"],"keyStart":1,"keyStop":1,"step":1},"xadd":{"arity":-5,"flags":["write","denyoom","fast"],"keyStart":1,"keyStop":1,"step":1},"xautoclaim":{"arity":-6,"flags":["write","fast"],"keyStart":1,"keyStop":1,"step":1},"xclaim":{"arity":-6,"flags":["write","fast"],"keyStart":1,"keyStop":1,"step":1},"xdel":{"arity":-3,"flags":["write","fast"],"keyStart":1,"keyStop":1,"step":1},"xdelex":{"arity":-5,"flags":["write","fast"],"keyStart":1,"keyStop":1,"step":1},"xgroup":{"arity":-2,"flags":[],"keyStart":0,"keyStop":0,"step":0},"xinfo":{"arity":-2,"flags":[],"keyStart":0,"keyStop":0,"step":0},"xlen":{"arity":2,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"xnack":{"arity":-7,"flags":["write","fast"],"keyStart":1,"keyStop":1,"step":1},"xpending":{"arity":-3,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"xrange":{"arity":-4,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"xread":{"arity":-4,"flags":["readonly","blocking","movablekeys"],"keyStart":0,"keyStop":0,"step":0},"xreadgroup":{"arity":-7,"flags":["write","blocking","movablekeys"],"keyStart":0,"keyStop":0,"step":0},"xrevrange":{"arity":-4,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"xsetid":{"arity":-3,"flags":["write","denyoom","fast"],"keyStart":1,"keyStop":1,"step":1},"xtrim":{"arity":-4,"flags":["write"],"keyStart":1,"keyStop":1,"step":1},"zadd":{"arity":-4,"flags":["write","denyoom","fast"],"keyStart":1,"keyStop":1,"step":1},"zcard":{"arity":2,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"zcount":{"arity":4,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"zdiff":{"arity":-3,"flags":["readonly","movablekeys"],"keyStart":0,"keyStop":0,"step":0},"zdiffstore":{"arity":-4,"flags":["write","denyoom","movablekeys"],"keyStart":1,"keyStop":1,"step":1},"zincrby":{"arity":4,"flags":["write","denyoom","fast"],"keyStart":1,"keyStop":1,"step":1},"zinter":{"arity":-3,"flags":["readonly","movablekeys"],"keyStart":0,"keyStop":0,"step":0},"zintercard":{"arity":-3,"flags":["readonly","movablekeys"],"keyStart":0,"keyStop":0,"step":0},"zinterstore":{"arity":-4,"flags":["write","denyoom","movablekeys"],"keyStart":1,"keyStop":1,"step":1},"zlexcount":{"arity":4,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"zmpop":{"arity":-4,"flags":["write","movablekeys"],"keyStart":0,"keyStop":0,"step":0},"zmscore":{"arity":-3,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"zpopmax":{"arity":-2,"flags":["write","fast"],"keyStart":1,"keyStop":1,"step":1},"zpopmin":{"arity":-2,"flags":["write","fast"],"keyStart":1,"keyStop":1,"step":1},"zrandmember":{"arity":-2,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"zrange":{"arity":-4,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"zrangebylex":{"arity":-4,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"zrangebyscore":{"arity":-4,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"zrangestore":{"arity":-5,"flags":["write","denyoom"],"keyStart":1,"keyStop":2,"step":1},"zrank":{"arity":3,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"zrem":{"arity":-3,"flags":["write","fast"],"keyStart":1,"keyStop":1,"step":1},"zremrangebylex":{"arity":4,"flags":["write"],"keyStart":1,"keyStop":1,"step":1},"zremrangebyrank":{"arity":4,"flags":["write"],"keyStart":1,"keyStop":1,"step":1},"zremrangebyscore":{"arity":4,"flags":["write"],"keyStart":1,"keyStop":1,"step":1},"zrevrange":{"arity":-4,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"zrevrangebylex":{"arity":-4,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"zrevrangebyscore":{"arity":-4,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"zrevrank":{"arity":3,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"zscan":{"arity":-3,"flags":["readonly"],"keyStart":1,"keyStop":1,"step":1},"zscore":{"arity":3,"flags":["readonly","fast"],"keyStart":1,"keyStop":1,"step":1},"zunion":{"arity":-3,"flags":["readonly","movablekeys"],"keyStart":0,"keyStop":0,"step":0},"zunionstore":{"arity":-4,"flags":["write","denyoom","movablekeys"],"keyStart":1,"keyStop":1,"step":1}}')},12522,(e,t,r)=>{"use strict";var n=e.e&&e.e.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(r,"__esModule",{value:!0}),r.getKeyIndexes=r.hasFlag=r.exists=r.list=void 0;let a=n(e.r(66990));r.list=Object.keys(a.default);let i={};function s(e){"string"!=typeof e&&(e=String(e));let t=e.indexOf("->");return -1===t?e.length:t}r.list.forEach(e=>{i[e]=a.default[e].flags.reduce(function(e,t){return e[t]=!0,e},{})}),r.exists=function(e,t){return e=(null==t?void 0:t.caseInsensitive)?String(e).toLowerCase():e,!!a.default[e]},r.hasFlag=function(e,t,r){if(!i[e=(null==r?void 0:r.nameCaseInsensitive)?String(e).toLowerCase():e])throw Error("Unknown command "+e);return!!i[e][t]},r.getKeyIndexes=function(e,t,r){e=(null==r?void 0:r.nameCaseInsensitive)?String(e).toLowerCase():e;let n=a.default[e];if(!n)throw Error("Unknown command "+e);if(!Array.isArray(t))throw Error("Expect args to be an array");let i=[],o=!!(r&&r.parseExternalKey),l=(e,t)=>{let r=[],n=Number(e[t]);for(let e=0;e<n;e++)r.push(e+t+1);return r},d=(e,t,r)=>{for(let n=t;n<e.length-1;n+=1)if(String(e[n]).toLowerCase()===r.toLowerCase())return n+1;return null};switch(e){case"zunionstore":case"zinterstore":case"zdiffstore":i.push(0,...l(t,1));break;case"eval":case"evalsha":case"eval_ro":case"evalsha_ro":case"fcall":case"fcall_ro":case"blmpop":case"bzmpop":i.push(...l(t,1));break;case"sintercard":case"lmpop":case"zunion":case"zinter":case"zmpop":case"zintercard":case"zdiff":i.push(...l(t,0));break;case"msetex":{let e=Number(t[0]);for(let t=0;t<e;t++)i.push(1+2*t);break}case"georadius":{i.push(0);let e=d(t,5,"STORE");e&&i.push(e);let r=d(t,5,"STOREDIST");r&&i.push(r);break}case"georadiusbymember":{i.push(0);let e=d(t,4,"STORE");e&&i.push(e);let r=d(t,4,"STOREDIST");r&&i.push(r);break}case"sort":case"sort_ro":i.push(0);for(let e=1;e<t.length-1;e++){let r=t[e];if("string"!=typeof r)continue;let n=r.toUpperCase();"GET"===n?(e+=1,"#"!==(r=t[e])&&(o?i.push([e,s(r)]):i.push(e))):"BY"===n?(e+=1,o?i.push([e,s(t[e])]):i.push(e)):"STORE"===n&&(e+=1,i.push(e))}break;case"migrate":if(""===t[2])for(let e=5;e<t.length-1;e++){let r=t[e];if("string"==typeof r&&"KEYS"===r.toUpperCase()){for(let r=e+1;r<t.length;r++)i.push(r);break}}else i.push(2);break;case"xreadgroup":case"xread":for(let r=3*("xread"!==e);r<t.length-1;r++)if("STREAMS"===String(t[r]).toUpperCase()){for(let e=r+1;e<=r+(t.length-1-r)/2;e++)i.push(e);break}break;default:if(n.step>0){let e=n.keyStart-1,r=n.keyStop>0?n.keyStop:t.length+n.keyStop+1;for(let t=e;t<r;t+=n.step)i.push(t)}}return i}},48575,(e,t,r)=>{"use strict";let n;function a(e,t){try{let e=n;return n=null,e.apply(this,arguments)}catch(e){return r.errorObj.e=e,r.errorObj}}Object.defineProperty(r,"__esModule",{value:!0}),r.tryCatch=r.errorObj=void 0,r.errorObj={e:{}},r.tryCatch=function(e){return n=e,a}},19335,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});let n=e.r(48575);function a(e){setTimeout(function(){throw e},0)}r.default=function(e,t,r){return"function"==typeof t&&e.then(e=>{let i;(i=void 0!==r&&Object(r).spread&&Array.isArray(e)?n.tryCatch(t).apply(void 0,[null].concat(e)):void 0===e?n.tryCatch(t)(null):n.tryCatch(t)(null,e))===n.errorObj&&a(i.e)},e=>{if(!e){let t=Error(e+"");Object.assign(t,{cause:e}),e=t}let r=n.tryCatch(t)(e);r===n.errorObj&&a(r.e)}),e}},49719,(e,t,r)=>{t.exports=e.x("assert",()=>require("assert"))},8339,(e,t,r)=>{"use strict";let n=e.r(49719);class a extends Error{get name(){return this.constructor.name}}class i extends a{get name(){return this.constructor.name}}t.exports={RedisError:a,ParserError:class extends a{constructor(e,t,r){n(t),n.strictEqual(typeof r,"number");const a=Error.stackTraceLimit;Error.stackTraceLimit=2,super(e),Error.stackTraceLimit=a,this.offset=r,this.buffer=t}get name(){return this.constructor.name}},ReplyError:class extends a{constructor(e){const t=Error.stackTraceLimit;Error.stackTraceLimit=2,super(e),Error.stackTraceLimit=t}get name(){return this.constructor.name}},AbortError:i,InterruptError:class extends i{get name(){return this.constructor.name}}}},47281,(e,t,r)=>{"use strict";let n=e.r(49719),a=e.r(24361);function i(e){Object.defineProperty(this,"message",{value:e||"",configurable:!0,writable:!0}),Error.captureStackTrace(this,this.constructor)}function s(e,t,r){n(t),n.strictEqual(typeof r,"number"),Object.defineProperty(this,"message",{value:e||"",configurable:!0,writable:!0});let a=Error.stackTraceLimit;Error.stackTraceLimit=2,Error.captureStackTrace(this,this.constructor),Error.stackTraceLimit=a,this.offset=r,this.buffer=t}function o(e){Object.defineProperty(this,"message",{value:e||"",configurable:!0,writable:!0});let t=Error.stackTraceLimit;Error.stackTraceLimit=2,Error.captureStackTrace(this,this.constructor),Error.stackTraceLimit=t}function l(e){Object.defineProperty(this,"message",{value:e||"",configurable:!0,writable:!0}),Error.captureStackTrace(this,this.constructor)}function d(e){Object.defineProperty(this,"message",{value:e||"",configurable:!0,writable:!0}),Error.captureStackTrace(this,this.constructor)}a.inherits(i,Error),Object.defineProperty(i.prototype,"name",{value:"RedisError",configurable:!0,writable:!0}),a.inherits(s,i),Object.defineProperty(s.prototype,"name",{value:"ParserError",configurable:!0,writable:!0}),a.inherits(o,i),Object.defineProperty(o.prototype,"name",{value:"ReplyError",configurable:!0,writable:!0}),a.inherits(l,i),Object.defineProperty(l.prototype,"name",{value:"AbortError",configurable:!0,writable:!0}),a.inherits(d,l),Object.defineProperty(d.prototype,"name",{value:"InterruptError",configurable:!0,writable:!0}),t.exports={RedisError:i,ParserError:s,ReplyError:o,AbortError:l,InterruptError:d}},63227,(e,t,r)=>{"use strict";t.exports=55>process.version.charCodeAt(1)&&46===process.version.charCodeAt(2)?e.r(47281):e.r(8339)},9068,(e,t,r)=>{var n=[0,4129,8258,12387,16516,20645,24774,28903,33032,37161,41290,45419,49548,53677,57806,61935,4657,528,12915,8786,21173,17044,29431,25302,37689,33560,45947,41818,54205,50076,62463,58334,9314,13379,1056,5121,25830,29895,17572,21637,42346,46411,34088,38153,58862,62927,50604,54669,13907,9842,5649,1584,30423,26358,22165,18100,46939,42874,38681,34616,63455,59390,55197,51132,18628,22757,26758,30887,2112,6241,10242,14371,51660,55789,59790,63919,35144,39273,43274,47403,23285,19156,31415,27286,6769,2640,14899,10770,56317,52188,64447,60318,39801,35672,47931,43802,27814,31879,19684,23749,11298,15363,3168,7233,60846,64911,52716,56781,44330,48395,36200,40265,32407,28342,24277,20212,15891,11826,7761,3696,65439,61374,57309,53244,48923,44858,40793,36728,37256,33193,45514,41451,53516,49453,61774,57711,4224,161,12482,8419,20484,16421,28742,24679,33721,37784,41979,46042,49981,54044,58239,62302,689,4752,8947,13010,16949,21012,25207,29270,46570,42443,38312,34185,62830,58703,54572,50445,13538,9411,5280,1153,29798,25671,21540,17413,42971,47098,34713,38840,59231,63358,50973,55100,9939,14066,1681,5808,26199,30326,17941,22068,55628,51565,63758,59695,39368,35305,47498,43435,22596,18533,30726,26663,6336,2273,14466,10403,52093,56156,60223,64286,35833,39896,43963,48026,19061,23124,27191,31254,2801,6864,10931,14994,64814,60687,56684,52557,48554,44427,40424,36297,31782,27655,23652,19525,15522,11395,7392,3265,61215,65342,53085,57212,44955,49082,36825,40952,28183,32310,20053,24180,11923,16050,3793,7920],a=function(e){for(var t,r=0,n=0,a=[],i=e.length;r<i;r++)(t=e.charCodeAt(r))<128?a[n++]=t:(t<2048?a[n++]=t>>6|192:((64512&t)==55296&&r+1<e.length&&(64512&e.charCodeAt(r+1))==56320?(t=65536+((1023&t)<<10)+(1023&e.charCodeAt(++r)),a[n++]=t>>18|240,a[n++]=t>>12&63|128):a[n++]=t>>12|224,a[n++]=t>>6&63|128),a[n++]=63&t|128);return a},i=t.exports=function(e){for(var t,r=0,i=-1,s=0,o=0,l="string"==typeof e?a(e):e,d=l.length;r<d;){if(t=l[r++],-1===i)123===t&&(i=r);else if(125!==t)o=n[(t^o>>8)&255]^o<<8;else if(r-1!==i)return 16383&o;s=n[(t^s>>8)&255]^s<<8}return 16383&s};t.exports.generateMulti=function(e){for(var t=1,r=e.length,n=i(e[0]);t<r;)if(i(e[t++])!==n)return -1;return n}},96686,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.parseBlockOption=r.parseSecondsArgument=void 0;let n=e=>{if("number"==typeof e)return e;if(Buffer.isBuffer(e))return n(e.toString());if("string"==typeof e){let t=Number(e);return Number.isFinite(t)?t:void 0}},a=e=>"string"==typeof e?e:Buffer.isBuffer(e)?e.toString():void 0;r.parseSecondsArgument=e=>{let t=n(e);if(void 0!==t)return t<=0?0:1e3*t},r.parseBlockOption=e=>{for(let t=0;t<e.length;t++){let r=a(e[t]);if(r&&"block"===r.toLowerCase()){let r=n(e[t+1]);if(void 0===r)return;if(r<=0)return 0;return r}}return null}},30846,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});let n=e.r(12522),a=e.r(9068),i=e.r(19335),s=e.r(26898),o=e.r(96686);class l{constructor(e,t=[],r={},n){if(this.name=e,this.inTransaction=!1,this.isTraced=!1,this.isResolved=!1,this.transformed=!1,this.replyEncoding=r.replyEncoding,this.errorStack=r.errorStack,this.args=t.flat(),this.callback=n,this.initPromise(),r.keyPrefix){const e=r.keyPrefix instanceof Buffer;let t=e?r.keyPrefix:null;this._iterateKeys(n=>n instanceof Buffer?(null===t&&(t=Buffer.from(r.keyPrefix)),Buffer.concat([t,n])):e?Buffer.concat([r.keyPrefix,Buffer.from(String(n))]):r.keyPrefix+n)}r.readOnly&&(this.isReadOnly=!0)}static checkFlag(e,t){return t=t.toLowerCase(),!!this.getFlagMap()[e][t]}static setArgumentTransformer(e,t){this._transformer.argument[e]=t}static setReplyTransformer(e,t){this._transformer.reply[e]=t}static getFlagMap(){return this.flagMap||(this.flagMap=Object.keys(l.FLAGS).reduce((e,t)=>(e[t]={},l.FLAGS[t].forEach(r=>{e[t][r]=!0}),e),{})),this.flagMap}getSlot(){if(void 0===this.slot){let e=this.getKeys()[0];this.slot=null==e?null:a(e)}return this.slot}getKeys(){return this._iterateKeys()}toWritable(e){let t,r="*"+(this.args.length+1)+"\r\n$"+Buffer.byteLength(this.name)+"\r\n"+this.name+"\r\n";if(this.bufferMode){let e=new c;e.push(r);for(let t=0;t<this.args.length;++t){let r=this.args[t];r instanceof Buffer?0===r.length?e.push("$0\r\n\r\n"):(e.push("$"+r.length+"\r\n"),e.push(r),e.push("\r\n")):e.push("$"+Buffer.byteLength(r)+"\r\n"+r+"\r\n")}t=e.toBuffer()}else{t=r;for(let e=0;e<this.args.length;++e){let r=this.args[e];t+="$"+Buffer.byteLength(r)+"\r\n"+r+"\r\n"}}return t}stringifyArguments(){for(let e=0;e<this.args.length;++e){let t=this.args[e];"string"==typeof t||(t instanceof Buffer?this.bufferMode=!0:this.args[e]=(0,s.toArg)(t))}}transformReply(e){this.replyEncoding&&(e=(0,s.convertBufferToString)(e,this.replyEncoding));let t=l._transformer.reply[this.name];return t&&(e=t(e)),e}setTimeout(e){this._commandTimeoutTimer||(this._commandTimeoutTimer=setTimeout(()=>{this.isResolved||this.reject(Error("Command timed out"))},e))}setBlockingTimeout(e){if(e<=0)return;this._blockingTimeoutTimer&&(clearTimeout(this._blockingTimeoutTimer),this._blockingTimeoutTimer=void 0);let t=Date.now();void 0===this._blockingDeadline&&(this._blockingDeadline=t+e);let r=this._blockingDeadline-t;r<=0?this.resolve(null):this._blockingTimeoutTimer=setTimeout(()=>{if(this.isResolved){this._blockingTimeoutTimer=void 0;return}this._blockingTimeoutTimer=void 0,this.resolve(null)},r)}extractBlockingTimeout(){let e=this.args;if(!e||0===e.length)return;let t=this.name.toLowerCase();return l.checkFlag("LAST_ARG_TIMEOUT_COMMANDS",t)?(0,o.parseSecondsArgument)(e[e.length-1]):l.checkFlag("FIRST_ARG_TIMEOUT_COMMANDS",t)?(0,o.parseSecondsArgument)(e[0]):l.checkFlag("BLOCK_OPTION_COMMANDS",t)?(0,o.parseBlockOption)(e):void 0}_clearTimers(){let e=this._commandTimeoutTimer;e&&(clearTimeout(e),delete this._commandTimeoutTimer);let t=this._blockingTimeoutTimer;t&&(clearTimeout(t),delete this._blockingTimeoutTimer)}initPromise(){let e=new Promise((e,t)=>{if(!this.transformed){this.transformed=!0;let e=l._transformer.argument[this.name];e&&(this.args=e(this.args)),this.stringifyArguments()}this.resolve=this._convertValue(e),this.reject=e=>{this._clearTimers(),this.errorStack?t((0,s.optimizeErrorStack)(e,this.errorStack.stack,"/ROOT/node_modules/ioredis/built")):t(e)}});this.promise=(0,i.default)(e,this.callback)}_iterateKeys(e=e=>e){if(void 0===this.keys&&(this.keys=[],(0,n.exists)(this.name,{caseInsensitive:!0})))for(let t of(0,n.getKeyIndexes)(this.name,this.args,{nameCaseInsensitive:!0}))this.args[t]=e(this.args[t]),this.keys.push(this.args[t]);return this.keys}_convertValue(e){return t=>{try{this._clearTimers(),e(this.transformReply(t)),this.isResolved=!0}catch(e){this.reject(e)}return this.promise}}}r.default=l,l.FLAGS={VALID_IN_SUBSCRIBER_MODE:["subscribe","psubscribe","unsubscribe","punsubscribe","ssubscribe","sunsubscribe","ping","quit"],VALID_IN_MONITOR_MODE:["monitor","auth"],ENTER_SUBSCRIBER_MODE:["subscribe","psubscribe","ssubscribe"],EXIT_SUBSCRIBER_MODE:["unsubscribe","punsubscribe","sunsubscribe"],WILL_DISCONNECT:["quit"],HANDSHAKE_COMMANDS:["auth","select","client","readonly","info"],IGNORE_RECONNECT_ON_ERROR:["client"],BLOCKING_COMMANDS:["blpop","brpop","brpoplpush","blmove","bzpopmin","bzpopmax","bzmpop","blmpop","xread","xreadgroup"],LAST_ARG_TIMEOUT_COMMANDS:["blpop","brpop","brpoplpush","blmove","bzpopmin","bzpopmax"],FIRST_ARG_TIMEOUT_COMMANDS:["bzmpop","blmpop"],BLOCK_OPTION_COMMANDS:["xread","xreadgroup"]},l._transformer={argument:{},reply:{}};let d=function(e){if(1===e.length){if(e[0]instanceof Map)return(0,s.convertMapToArray)(e[0]);if("object"==typeof e[0]&&null!==e[0])return(0,s.convertObjectToArray)(e[0])}return e},u=function(e){if(2===e.length){if(e[1]instanceof Map)return[e[0]].concat((0,s.convertMapToArray)(e[1]));if("object"==typeof e[1]&&null!==e[1])return[e[0]].concat((0,s.convertObjectToArray)(e[1]))}return e};l.setArgumentTransformer("mset",d),l.setArgumentTransformer("msetnx",d),l.setArgumentTransformer("hset",u),l.setArgumentTransformer("hmset",u),l.setReplyTransformer("hgetall",function(e){if(Array.isArray(e)){let t={};for(let r=0;r<e.length;r+=2){let n=e[r],a=e[r+1];n in t?Object.defineProperty(t,n,{value:a,configurable:!0,enumerable:!0,writable:!0}):t[n]=a}return t}return e});class c{constructor(){this.length=0,this.items=[]}push(e){this.length+=Buffer.byteLength(e),this.items.push(e)}toBuffer(){let e=Buffer.allocUnsafe(this.length),t=0;for(let r of this.items){let n=Buffer.byteLength(r);Buffer.isBuffer(r)?r.copy(e,t):e.write(r,t,n),t+=n}return e}}},17798,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});let n=e.r(63227);class a extends n.RedisError{constructor(e,t){super(e),this.lastNodeError=t,Error.captureStackTrace(this,this.constructor)}get name(){return this.constructor.name}}r.default=a,a.defaultMessage="Failed to refresh slots cache."},12749,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});let n=e.r(88947);class a extends n.Readable{constructor(e){super(e),this.opt=e,this._redisCursor="0",this._redisDrained=!1}_read(){if(this._redisDrained)return void this.push(null);let e=[this._redisCursor];this.opt.key&&e.unshift(this.opt.key),this.opt.match&&e.push("MATCH",this.opt.match),this.opt.type&&e.push("TYPE",this.opt.type),this.opt.count&&e.push("COUNT",String(this.opt.count)),this.opt.noValues&&e.push("NOVALUES"),this.opt.redis[this.opt.command](e,(e,t)=>{e?this.emit("error",e):(this._redisCursor=t[0]instanceof Buffer?t[0].toString():t[0],"0"===this._redisCursor&&(this._redisDrained=!0),this.push(t[1]))})}close(){this._redisDrained=!0}}r.default=a},874,(e,t,r)=>{t.exports=e.x("buffer",()=>require("buffer"))},33700,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.executeWithAutoPipelining=r.getFirstValueInFlattenedArray=r.shouldUseAutoPipelining=r.notAllowedAutoPipelineCommands=r.kCallbacks=r.kExec=void 0;let n=e.r(57517),a=e.r(9068),i=e.r(19335),s=e.r(12522);function o(e){for(let t=0;t<e.length;t++){let r=e[t];if("string"==typeof r)return r;if(Array.isArray(r)||(0,n.isArguments)(r)){if(0===r.length)continue;return r[0]}let a=[r].flat();if(a.length>0)return a[0]}}r.kExec=Symbol("exec"),r.kCallbacks=Symbol("callbacks"),r.notAllowedAutoPipelineCommands=["auth","info","script","quit","cluster","pipeline","multi","subscribe","psubscribe","unsubscribe","unpsubscribe","select","client"],r.shouldUseAutoPipelining=function(e,t,n){return t&&e.options.enableAutoPipelining&&!e.isPipeline&&!r.notAllowedAutoPipelineCommands.includes(n)&&!e.options.autoPipeliningIgnoredCommands.includes(n)},r.getFirstValueInFlattenedArray=o,r.executeWithAutoPipelining=function e(t,l,d,u,c){if(t.isCluster&&!t.slots.length)return"wait"===t.status&&t.connect().catch(n.noop),(0,i.default)(new Promise(function(r,n){t.delayUntilReady(a=>{a?n(a):e(t,l,d,u,null).then(r,n)})}),c);let p=t.options.keyPrefix||"",h=t.isCluster?t.slots[a(`${p}${function(e,t){if((0,s.exists)(e,{caseInsensitive:!0})){let r=t.flat(),n=(0,s.getKeyIndexes)(e,r,{nameCaseInsensitive:!0});if(n.length)return r[n[0]]}return o(t)}(d,u)}`)].join(","):"main";if(t.isCluster&&"master"!==t.options.scaleReads&&(h+=(0,s.exists)(d)&&(0,s.hasFlag)(d,"readonly")?":read":":write"),!t._autoPipelines.has(h)){let e=t.pipeline();e[r.kExec]=!1,e[r.kCallbacks]=[],t._autoPipelines.set(h,e)}let y=t._autoPipelines.get(h);y[r.kExec]||(y[r.kExec]=!0,setImmediate(function e(t,n){if(t._runningAutoPipelines.has(n)||!t._autoPipelines.has(n))return;t._runningAutoPipelines.add(n);let a=t._autoPipelines.get(n);t._autoPipelines.delete(n);let i=a[r.kCallbacks];a[r.kCallbacks]=null,a.exec(function(r,a){if(t._runningAutoPipelines.delete(n),r)for(let e=0;e<i.length;e++)process.nextTick(i[e],r);else for(let e=0;e<i.length;e++)process.nextTick(i[e],...a[e]);t._autoPipelines.has(n)&&e(t,n)})},t,h));let m=new Promise(function(e,t){y[r.kCallbacks].push(function(r,n){r?t(r):e(n)}),"call"===l&&u.unshift(d),y[l](...u)});return(0,i.default)(m,c)}},40162,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});let n=e.r(54799),a=e.r(30846),i=e.r(19335);r.default=class{constructor(e,t=null,r="",i=!1){this.lua=e,this.numberOfKeys=t,this.keyPrefix=r,this.readOnly=i,this.sha=(0,n.createHash)("sha1").update(e).digest("hex");const s=this.sha,o=new WeakSet;this.Command=class extends a.default{toWritable(t){let r=this.reject;return this.reject=e=>{-1!==e.message.indexOf("NOSCRIPT")&&o.delete(t),r.call(this,e)},o.has(t)?"eval"===this.name&&(this.name="evalsha",this.args[0]=s):(o.add(t),this.name="eval",this.args[0]=e),super.toWritable(t)}}}execute(e,t,r,n){"number"==typeof this.numberOfKeys&&t.unshift(this.numberOfKeys),this.keyPrefix&&(r.keyPrefix=this.keyPrefix),this.readOnly&&(r.readOnly=!0);let a=new this.Command("evalsha",[this.sha,...t],r);return a.promise=a.promise.catch(n=>{if(-1===n.message.indexOf("NOSCRIPT"))throw n;let a=new this.Command("evalsha",[this.sha,...t],r);return(e.isPipeline?e.redis:e).sendCommand(a)}),(0,i.default)(a.promise,n),e.sendCommand(a)}}},67061,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});let n=e.r(12522),a=e.r(33700),i=e.r(30846),s=e.r(40162);class o{constructor(){this.options={},this.scriptsSet={},this.addedBuiltinSet=new Set}getBuiltinCommands(){return l.slice(0)}createBuiltinCommand(e){return{string:d(null,e,"utf8"),buffer:d(null,e,null)}}addBuiltinCommand(e){this.addedBuiltinSet.add(e),this[e]=d(e,e,"utf8"),this[e+"Buffer"]=d(e+"Buffer",e,null)}defineCommand(e,t){let r=new s.default(t.lua,t.numberOfKeys,this.options.keyPrefix,t.readOnly);this.scriptsSet[e]=r,this[e]=u(e,e,r,"utf8"),this[e+"Buffer"]=u(e+"Buffer",e,r,null)}sendCommand(e,t,r){throw Error('"sendCommand" is not implemented')}}let l=n.list.filter(e=>"monitor"!==e);function d(e,t,r){return void 0===r&&(r=t,t=null),function(...n){let s=t||n.shift(),o=n[n.length-1];"function"==typeof o?n.pop():o=void 0;let l={errorStack:this.options.showFriendlyErrorStack?Error():void 0,keyPrefix:this.options.keyPrefix,replyEncoding:r};return(0,a.shouldUseAutoPipelining)(this,e,s)?(0,a.executeWithAutoPipelining)(this,e,s,n,o):this.sendCommand(new i.default(s,n,l,o))}}function u(e,t,r,n){return function(...i){let s="function"==typeof i[i.length-1]?i.pop():void 0,o={replyEncoding:n};return(this.options.showFriendlyErrorStack&&(o.errorStack=Error()),(0,a.shouldUseAutoPipelining)(this,e,t))?(0,a.executeWithAutoPipelining)(this,e,t,i,s):r.execute(this,i,o,s)}}l.push("sentinel"),l.forEach(function(e){o.prototype[e]=d(e,e,"utf8"),o.prototype[e+"Buffer"]=d(e+"Buffer",e,null)}),o.prototype.call=d("call","utf8"),o.prototype.callBuffer=d("callBuffer",null),o.prototype.send_command=o.prototype.call,r.default=o},6135,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});let n=e.r(9068),a=e.r(12522),i=e.r(19335),s=e.r(24361),o=e.r(30846),l=e.r(874),d=e.r(26898),u=e.r(67061);class c extends u.default{constructor(e){super(),this.redis=e,this.isPipeline=!0,this.replyPending=0,this._queue=[],this._result=[],this._transactions=0,this._shaToScript={},this.isCluster="Cluster"===this.redis.constructor.name||this.redis.isCluster,this.options=e.options,Object.keys(e.scriptsSet).forEach(t=>{let r=e.scriptsSet[t];this._shaToScript[r.sha]=r,this[t]=e[t],this[t+"Buffer"]=e[t+"Buffer"]}),e.addedBuiltinSet.forEach(t=>{this[t]=e[t],this[t+"Buffer"]=e[t+"Buffer"]}),this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t});const t=this;Object.defineProperty(this,"length",{get:function(){return t._queue.length}})}fillResult(e,t){if("exec"===this._queue[t].name&&Array.isArray(e[1])){let r=e[1].length;for(let n=0;n<r;n++){if(e[1][n]instanceof Error)continue;let a=this._queue[t-(r-n)];try{e[1][n]=a.transformReply(e[1][n])}catch(t){e[1][n]=t}}}if(this._result[t]=e,--this.replyPending)return;if(this.isCluster){let e,t=!0;for(let r=0;r<this._result.length;++r){let n=this._result[r][0],i=this._queue[r];if(n){if("exec"===i.name&&"EXECABORT Transaction discarded because of previous errors."===n.message)continue;if(e){if(e.name!==n.name||e.message!==n.message){t=!1;break}}else e={name:n.name,message:n.message}}else if(!i.inTransaction&&!((0,a.exists)(i.name,{caseInsensitive:!0})&&(0,a.hasFlag)(i.name,"readonly",{nameCaseInsensitive:!0}))){t=!1;break}}if(e&&t){let t=this,r=e.message.split(" "),n=this._queue,a=!1;this._queue=[];for(let e=0;e<n.length;++e){if("ASK"===r[0]&&!a&&"asking"!==n[e].name&&(!n[e-1]||"asking"!==n[e-1].name)){let e=new o.default("asking");e.ignore=!0,this.sendCommand(e)}n[e].initPromise(),this.sendCommand(n[e]),a=n[e].inTransaction}let i=!0;void 0===this.leftRedirections&&(this.leftRedirections={});let s=function(){t.exec()},l=this.redis;if(l.handleError(e,this.leftRedirections,{moved:function(e,n){t.preferKey=n,l.slots[r[1]]?l.slots[r[1]][0]!==n&&(l.slots[r[1]]=[n]):l.slots[r[1]]=[n],l._groupsBySlot[r[1]]=l._groupsIds[l.slots[r[1]].join(";")],l.refreshSlotsCache(),t.exec()},ask:function(e,r){t.preferKey=r,t.exec()},tryagain:s,clusterDown:s,connectionClosed:s,maxRedirections:()=>{i=!1},defaults:()=>{i=!1}}),i)return}}let r=0;for(let e=0;e<this._queue.length-r;++e)this._queue[e+r].ignore&&(r+=1),this._result[e]=this._result[e+r];this.resolve(this._result.slice(0,this._result.length-r))}sendCommand(e){this._transactions>0&&(e.inTransaction=!0);let t=this._queue.length;return e.pipelineIndex=t,e.promise.then(e=>{this.fillResult([null,e],t)}).catch(e=>{this.fillResult([e],t)}),this._queue.push(e),this}addBatch(e){let t,r,n;for(let a=0;a<e.length;++a)r=(t=e[a])[0],n=t.slice(1),this[r].apply(this,n);return this}}r.default=c;let p=c.prototype.multi;c.prototype.multi=function(){return this._transactions+=1,p.apply(this,arguments)};let h=c.prototype.execBuffer;c.prototype.execBuffer=(0,s.deprecate)(function(){return this._transactions>0&&(this._transactions-=1),h.apply(this,arguments)},"Pipeline#execBuffer: Use Pipeline#exec instead"),c.prototype.exec=function(e){let t;if(this.isCluster&&!this.redis.slots.length)return"wait"===this.redis.status&&this.redis.connect().catch(d.noop),e&&!this.nodeifiedPromise&&(this.nodeifiedPromise=!0,(0,i.default)(this.promise,e)),this.redis.delayUntilReady(t=>{t?this.reject(t):this.exec(e)}),this.promise;if(this._transactions>0)return this._transactions-=1,h.apply(this,arguments);if(this.nodeifiedPromise||(this.nodeifiedPromise=!0,(0,i.default)(this.promise,e)),this._queue.length||this.resolve([]),this.isCluster){let e=[];for(let t=0;t<this._queue.length;t++){let r=this._queue[t].getKeys();if(r.length&&e.push(r[0]),r.length&&0>n.generateMulti(r))return this.reject(Error("All the keys in a pipeline command should belong to the same slot")),this.promise}if(e.length){if((t=function(e,t){let r=n(t[0]),a=e._groupsBySlot[r];for(let r=1;r<t.length;r++)if(e._groupsBySlot[n(t[r])]!==a)return -1;return r}(this.redis,e))<0)return this.reject(Error("All keys in the pipeline should belong to the same slots allocation group")),this.promise}else t=16384*Math.random()|0}let r=this;return function(){let e,n,a=r.replyPending=r._queue.length;r.isCluster&&(e={slot:t,redis:r.redis.connectionPool.nodes.all[r.preferKey]});let i="",s={isPipeline:!0,destination:r.isCluster?e:{redis:r.redis},write(e){"string"!=typeof e?(n||(n=[]),i&&(n.push(Buffer.from(i,"utf8")),i=""),n.push(e)):(i.length+e.length>=l.constants.MAX_STRING_LENGTH&&(n||(n=[]),i&&(n.push(Buffer.from(i,"utf8")),i="")),i+=e),--a||(n?(i&&n.push(Buffer.from(i,"utf8")),s.destination.redis.stream.write(Buffer.concat(n))):s.destination.redis.stream.write(i),a=r._queue.length,i="",n=void 0)}};for(let t=0;t<r._queue.length;++t)r.redis.sendCommand(r._queue[t],s,e);r.promise}(),this.promise}},77652,(e,t,r)=>{t.exports=e.x("node:diagnostics_channel",()=>require("node:diagnostics_channel"))},62819,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.traceConnect=r.traceBatch=r.traceCommand=r.sanitizeArgs=void 0;let n=[{regex:/^ECHO/i,args:0},{regex:/^(LPUSH|MSET|PFA|PUBLISH|RPUSH|SADD|SET|SPUBLISH|XADD|ZADD)/i,args:1},{regex:/^(HSET|HMSET|LSET|LINSERT)/i,args:2},{regex:/^(ACL|BIT|B[LRZ]|CLIENT|CLUSTER|CONFIG|COMMAND|DECR|DEL|EVAL|EX|FUNCTION|GEO|GET|HINCR|HMGET|HSCAN|INCR|L[TRLM]|MEMORY|P[EFISTU]|RPOP|S[CDIMORSU]|XACK|X[CDGILPRT]|Z[CDILMPRS])/i,args:-1}];r.sanitizeArgs=function(e,t){let r=0;for(let t of n)if(t.regex.test(e)){r=t.args;break}if(-1===r)return t.map(e=>String(e));let a=[];for(let e=0;e<t.length;e++)e<r?a.push(String(t[e])):a.push("?");return a};let a=(()=>{try{return"getBuiltinModule"in process?process.getBuiltinModule("node:diagnostics_channel"):e.r(77652)}catch{return}})(),i=a&&"function"==typeof a.tracingChannel,s=i?a.tracingChannel("ioredis:command"):void 0,o=i?a.tracingChannel("ioredis:batch"):void 0,l=i?a.tracingChannel("ioredis:connect"):void 0;function d(e){return!!e&&!1!==e.hasSubscribers}let u=()=>{};r.traceCommand=function(e,t){if(!d(s))return e();let r=s.tracePromise(e,t());return r.catch(u),r},r.traceBatch=function(e,t){if(!d(o))return e();let r=o.tracePromise(e,t());return r.catch(u),r},r.traceConnect=function(e,t){return d(l)?l.tracePromise(e,t()):e()}},3422,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.addTransactionSupport=void 0;let n=e.r(26898),a=e.r(19335),i=e.r(6135),s=e.r(62819);r.addTransactionSupport=function(e){e.pipeline=function(e){let t=new i.default(this);return Array.isArray(e)&&t.addBatch(e),t};let{multi:t}=e;e.multi=function(e,r){if(void 0!==r||Array.isArray(e)||(r=e,e=null),r&&!1===r.pipeline)return t.call(this);let o=new i.default(this);o.multi(),Array.isArray(e)&&o.addBatch(e);let l=o.exec;o.exec=function(e){if(this.isCluster&&!this.redis.slots.length)return"wait"===this.redis.status&&this.redis.connect().catch(n.noop),(0,a.default)(new Promise((e,t)=>{this.redis.delayUntilReady(r=>{r?t(r):this.exec(o).then(e,t)})}),e);if(this._transactions>0&&l.call(o),this.nodeifiedPromise)return l.call(o);let t=Math.max(o.length-2,0),r=()=>l.call(o).then(function(e){let t=e[e.length-1];if(void 0===t)throw Error("Pipeline cannot be used to send any commands when the `exec()` has been called on it.");if(t[0]){t[0].previousErrors=[];for(let r=0;r<e.length-1;++r)e[r][0]&&t[0].previousErrors.push(e[r][0]);throw t[0]}return(0,n.wrapMultiResult)(t[1])}),i="_buildBatchContext"in this.redis?(0,s.traceBatch)(r,()=>this.redis._buildBatchContext(t)):r();return(0,a.default)(i,e)};let{execBuffer:d}=o;return o.execBuffer=function(e){return this._transactions>0&&d.call(o),o.exec(e)},o};let{exec:r}=e;e.exec=function(e){return(0,a.default)(r.call(this).then(function(e){return Array.isArray(e)&&(e=(0,n.wrapMultiResult)(e)),e}),e)}}},57674,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.default=function(e,t){Object.getOwnPropertyNames(t.prototype).forEach(r=>{Object.defineProperty(e.prototype,r,Object.getOwnPropertyDescriptor(t.prototype,r))})}},79594,(e,t,r)=>{t.exports=e.x("dns",()=>require("dns"))},23086,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.DEFAULT_CLUSTER_OPTIONS=void 0;let n=e.r(79594);r.DEFAULT_CLUSTER_OPTIONS={clusterRetryStrategy:e=>Math.min(100+2*e,2e3),clusterNodeRetryStrategy:null,enableOfflineQueue:!0,enableReadyCheck:!0,scaleReads:"master",maxRedirections:16,retryDelayOnMoved:0,retryDelayOnFailover:100,retryDelayOnClusterDown:100,retryDelayOnTryAgain:100,slotsRefreshTimeout:1e3,useSRVRecords:!1,resolveSrv:n.resolveSrv,dnsLookup:n.lookup,enableAutoPipelining:!1,autoPipeliningIgnoredCommands:[],shardedSubscribers:!1}},78695,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.getConnectionName=r.weightSrvRecords=r.groupSrvRecords=r.getUniqueHostnamesFromOptions=r.normalizeNodeOptions=r.nodeKeyToRedisOptions=r.getNodeKey=void 0;let n=e.r(26898),a=e.r(4446);r.getNodeKey=function(e){return e.port=e.port||6379,e.host=e.host||"127.0.0.1",e.host+":"+e.port},r.nodeKeyToRedisOptions=function(e){let t=e.lastIndexOf(":");if(-1===t)throw Error(`Invalid node key ${e}`);return{host:e.slice(0,t),port:Number(e.slice(t+1))}},r.normalizeNodeOptions=function(e){return e.map(e=>{let t={};if("object"==typeof e)Object.assign(t,e);else if("string"==typeof e)Object.assign(t,(0,n.parseURL)(e));else if("number"==typeof e)t.port=e;else throw Error("Invalid argument "+e);return"string"==typeof t.port&&(t.port=parseInt(t.port,10)),delete t.db,t.port||(t.port=6379),t.host||(t.host="127.0.0.1"),(0,n.resolveTLSProfile)(t)})},r.getUniqueHostnamesFromOptions=function(e){let t={};return e.forEach(e=>{t[e.host]=!0}),Object.keys(t).filter(e=>!(0,a.isIP)(e))},r.groupSrvRecords=function(e){let t={};for(let r of e)t.hasOwnProperty(r.priority)?(t[r.priority].totalWeight+=r.weight,t[r.priority].records.push(r)):t[r.priority]={totalWeight:r.weight,records:[r]};return t},r.weightSrvRecords=function(e){if(1===e.records.length)return e.totalWeight=0,e.records.shift();let t=Math.floor(Math.random()*(e.totalWeight+e.records.length)),r=0;for(let[n,a]of e.records.entries())if((r+=1+a.weight)>t)return e.totalWeight-=a.weight,e.records.splice(n,1),a},r.getConnectionName=function(e,t){let r=`ioredis-cluster(${e})`;return t?`${r}:${t}`:r}},55925,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});let n=e.r(78695),a=e.r(26898),i=e.r(66735),s=(0,a.Debug)("cluster:subscriber");r.default=class{constructor(e,t,r=!1){this.connectionPool=e,this.emitter=t,this.isSharded=r,this.started=!1,this.subscriber=null,this.slotRange=[],this.onSubscriberEnd=()=>{this.started?(s("subscriber has disconnected, selecting a new one..."),this.selectSubscriber()):s("subscriber has disconnected, but ClusterSubscriber is not started, so not reconnecting.")},this.connectionPool.on("-node",(e,t)=>{this.started&&this.subscriber&&(0,n.getNodeKey)(this.subscriber.options)===t&&(s("subscriber has left, selecting a new one..."),this.selectSubscriber())}),this.connectionPool.on("+node",()=>{this.started&&!this.subscriber&&(s("a new node is discovered and there is no subscriber, selecting a new one..."),this.selectSubscriber())})}getInstance(){return this.subscriber}associateSlotRange(e){return this.isSharded&&(this.slotRange=e),this.slotRange}start(){this.started=!0,this.selectSubscriber(),s("started")}stop(){this.started=!1,this.subscriber&&(this.subscriber.disconnect(),this.subscriber=null)}isStarted(){return this.started}selectSubscriber(){let e=this.lastActiveSubscriber;e&&(e.off("end",this.onSubscriberEnd),e.disconnect()),this.subscriber&&(this.subscriber.off("end",this.onSubscriberEnd),this.subscriber.disconnect());let t=(0,a.sample)(this.connectionPool.getNodes());if(!t){s("selecting subscriber failed since there is no node discovered in the cluster yet"),this.subscriber=null;return}let{options:r}=t;s("selected a subscriber %s:%s",r.host,r.port);let o="subscriber";this.isSharded&&(o="ssubscriber"),this.subscriber=new i.default({port:r.port,host:r.host,username:r.username,password:r.password,enableReadyCheck:!0,connectionName:(0,n.getConnectionName)(o,r.connectionName),lazyConnect:!0,tls:r.tls,retryStrategy:null}),this.subscriber.on("error",a.noop),this.subscriber.on("moved",()=>{this.emitter.emit("forceRefresh")}),this.subscriber.once("end",this.onSubscriberEnd);let l={subscribe:[],psubscribe:[],ssubscribe:[]};if(e){let t=e.condition||e.prevCondition;t&&t.subscriber&&(l.subscribe=t.subscriber.channels("subscribe"),l.psubscribe=t.subscriber.channels("psubscribe"),l.ssubscribe=t.subscriber.channels("ssubscribe"))}if(l.subscribe.length||l.psubscribe.length||l.ssubscribe.length){let e=0;for(let t of["subscribe","psubscribe","ssubscribe"]){let r=l[t];if(0!=r.length)if(s("%s %d channels",t,r.length),"ssubscribe"===t)for(let n of r)e+=1,this.subscriber[t](n).then(()=>{--e||(this.lastActiveSubscriber=this.subscriber)}).catch(()=>{s("failed to ssubscribe to channel: %s",n)});else e+=1,this.subscriber[t](r).then(()=>{--e||(this.lastActiveSubscriber=this.subscriber)}).catch(()=>{s("failed to %s %d channels",t,r.length)})}}else this.lastActiveSubscriber=this.subscriber;for(let e of["message","messageBuffer"])this.subscriber.on(e,(t,r)=>{this.emitter.emit(e,t,r)});for(let e of["pmessage","pmessageBuffer"])this.subscriber.on(e,(t,r,n)=>{this.emitter.emit(e,t,r,n)});if(!0==this.isSharded)for(let e of["smessage","smessageBuffer"])this.subscriber.on(e,(t,r)=>{this.emitter.emit(e,t,r)})}}},77825,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});let n=e.r(27699),a=e.r(26898),i=e.r(78695),s=e.r(66735),o=(0,a.Debug)("cluster:connectionPool");class l extends n.EventEmitter{constructor(e,t=null){super(),this.redisOptions=e,this.clusterNodeRetryStrategy=t,this.nodes={all:{},master:{},slave:{}},this.specifiedOptions={}}getNodes(e="all"){let t=this.nodes[e];return Object.keys(t).map(e=>t[e])}getInstanceByKey(e){return this.nodes.all[e]}getSampleInstance(e){let t=Object.keys(this.nodes[e]),r=(0,a.sample)(t);return this.nodes[e][r]}addMasterNode(e){let t=(0,i.getNodeKey)(e.options),r=this.createRedisFromOptions(e,e.options.readOnly);return!e.options.readOnly&&(this.nodes.all[t]=r,this.nodes.master[t]=r,!0)}createRedisFromOptions(e,t){return new s.default((0,a.defaults)({retryStrategy:"function"==typeof this.clusterNodeRetryStrategy?this.clusterNodeRetryStrategy:null,enableOfflineQueue:!0,readOnly:t},e,this.redisOptions,{lazyConnect:!0}))}findOrCreate(e,t=!1){let r,n=(0,i.getNodeKey)(e);return t=!!t,this.specifiedOptions[n]?Object.assign(e,this.specifiedOptions[n]):this.specifiedOptions[n]=e,this.nodes.all[n]?(r=this.nodes.all[n]).options.readOnly!==t&&(r.options.readOnly=t,o("Change role of %s to %s",n,t?"slave":"master"),r[t?"readonly":"readwrite"]().catch(a.noop),t?(delete this.nodes.master[n],this.nodes.slave[n]=r):(delete this.nodes.slave[n],this.nodes.master[n]=r)):(o("Connecting to %s as %s",n,t?"slave":"master"),r=this.createRedisFromOptions(e,t),this.nodes.all[n]=r,this.nodes[t?"slave":"master"][n]=r,r.once("end",()=>{this.removeNode(n),this.emit("-node",r,n),Object.keys(this.nodes.all).length||this.emit("drain")}),this.emit("+node",r,n),r.on("error",e=>{this.emit("nodeError",e,n)})),r}reset(e){o("Reset with %O",e);let t={};e.forEach(e=>{let r=(0,i.getNodeKey)(e);e.readOnly&&t[r]||(t[r]=e)}),Object.keys(this.nodes.all).forEach(e=>{t[e]||(o("Disconnect %s because the node does not hold any slot",e),this.nodes.all[e].disconnect(),this.removeNode(e))}),Object.keys(t).forEach(e=>{let r=t[e];this.findOrCreate(r,r.readOnly)})}removeNode(e){let{nodes:t}=this;t.all[e]&&(o("Remove %s from the pool",e),delete t.all[e]),delete t.master[e],delete t.slave[e]}}r.default=l},89977,(e,t,r)=>{"use strict";function n(e,t){var t=t||{};this._capacity=t.capacity,this._head=0,this._tail=0,Array.isArray(e)?this._fromArray(e):(this._capacityMask=3,this._list=[,,,,])}n.prototype.peekAt=function(e){var t=e;if(t===(0|t)){var r=this.size();if(!(t>=r)&&!(t<-r))return t<0&&(t+=r),t=this._head+t&this._capacityMask,this._list[t]}},n.prototype.get=function(e){return this.peekAt(e)},n.prototype.peek=function(){if(this._head!==this._tail)return this._list[this._head]},n.prototype.peekFront=function(){return this.peek()},n.prototype.peekBack=function(){return this.peekAt(-1)},Object.defineProperty(n.prototype,"length",{get:function(){return this.size()}}),n.prototype.size=function(){return this._head===this._tail?0:this._head<this._tail?this._tail-this._head:this._capacityMask+1-(this._head-this._tail)},n.prototype.unshift=function(e){if(0==arguments.length)return this.size();var t=this._list.length;return(this._head=this._head-1+t&this._capacityMask,this._list[this._head]=e,this._tail===this._head&&this._growArray(),this._capacity&&this.size()>this._capacity&&this.pop(),this._head<this._tail)?this._tail-this._head:this._capacityMask+1-(this._head-this._tail)},n.prototype.shift=function(){var e=this._head;if(e!==this._tail){var t=this._list[e];return this._list[e]=void 0,this._head=e+1&this._capacityMask,e<2&&this._tail>1e4&&this._tail<=this._list.length>>>2&&this._shrinkArray(),t}},n.prototype.push=function(e){if(0==arguments.length)return this.size();var t=this._tail;return(this._list[t]=e,this._tail=t+1&this._capacityMask,this._tail===this._head&&this._growArray(),this._capacity&&this.size()>this._capacity&&this.shift(),this._head<this._tail)?this._tail-this._head:this._capacityMask+1-(this._head-this._tail)},n.prototype.pop=function(){var e=this._tail;if(e!==this._head){var t=this._list.length;this._tail=e-1+t&this._capacityMask;var r=this._list[this._tail];return this._list[this._tail]=void 0,this._head<2&&e>1e4&&e<=t>>>2&&this._shrinkArray(),r}},n.prototype.removeOne=function(e){var t,r=e;if(r===(0|r)&&this._head!==this._tail){var n=this.size(),a=this._list.length;if(!(r>=n)&&!(r<-n)){r<0&&(r+=n),r=this._head+r&this._capacityMask;var i=this._list[r];if(e<n/2){for(t=e;t>0;t--)this._list[r]=this._list[r=r-1+a&this._capacityMask];this._list[r]=void 0,this._head=this._head+1+a&this._capacityMask}else{for(t=n-1-e;t>0;t--)this._list[r]=this._list[r=r+1+a&this._capacityMask];this._list[r]=void 0,this._tail=this._tail-1+a&this._capacityMask}return i}}},n.prototype.remove=function(e,t){var r,n,a=e,i=t;if(a===(0|a)&&this._head!==this._tail){var s=this.size(),o=this._list.length;if(!(a>=s)&&!(a<-s)&&!(t<1)){if(a<0&&(a+=s),1===t||!t)return(r=[,])[0]=this.removeOne(a),r;if(0===a&&a+t>=s)return r=this.toArray(),this.clear(),r;for(a+t>s&&(t=s-a),r=Array(t),n=0;n<t;n++)r[n]=this._list[this._head+a+n&this._capacityMask];if(a=this._head+a&this._capacityMask,e+t===s){for(this._tail=this._tail-t+o&this._capacityMask,n=t;n>0;n--)this._list[a=a+1+o&this._capacityMask]=void 0;return r}if(0===e){for(this._head=this._head+t+o&this._capacityMask,n=t-1;n>0;n--)this._list[a=a+1+o&this._capacityMask]=void 0;return r}if(a<s/2){for(this._head=this._head+e+t+o&this._capacityMask,n=e;n>0;n--)this.unshift(this._list[a=a-1+o&this._capacityMask]);for(a=this._head-1+o&this._capacityMask;i>0;)this._list[a=a-1+o&this._capacityMask]=void 0,i--;e<0&&(this._tail=a)}else{for(this._tail=a,a=a+t+o&this._capacityMask,n=s-(t+e);n>0;n--)this.push(this._list[a++]);for(a=this._tail;i>0;)this._list[a=a+1+o&this._capacityMask]=void 0,i--}return this._head<2&&this._tail>1e4&&this._tail<=o>>>2&&this._shrinkArray(),r}}},n.prototype.splice=function(e,t){var r=e;if(r===(0|r)){var n=this.size();if(r<0&&(r+=n),!(r>n))if(!(arguments.length>2))return this.remove(r,t);else{var a,i,s,o=arguments.length,l=this._list.length,d=2;if(!n||r<n/2){for(a=0,i=Array(r);a<r;a++)i[a]=this._list[this._head+a&this._capacityMask];for(0===t?(s=[],r>0&&(this._head=this._head+r+l&this._capacityMask)):(s=this.remove(r,t),this._head=this._head+r+l&this._capacityMask);o>d;)this.unshift(arguments[--o]);for(a=r;a>0;a--)this.unshift(i[a-1])}else{var u=(i=Array(n-(r+t))).length;for(a=0;a<u;a++)i[a]=this._list[this._head+r+t+a&this._capacityMask];for(0===t?(s=[],r!=n&&(this._tail=this._head+r+l&this._capacityMask)):(s=this.remove(r,t),this._tail=this._tail-u+l&this._capacityMask);d<o;)this.push(arguments[d++]);for(a=0;a<u;a++)this.push(i[a])}return s}}},n.prototype.clear=function(){this._list=Array(this._list.length),this._head=0,this._tail=0},n.prototype.isEmpty=function(){return this._head===this._tail},n.prototype.toArray=function(){return this._copyArray(!1)},n.prototype._fromArray=function(e){var t=e.length,r=this._nextPowerOf2(t);this._list=Array(r),this._capacityMask=r-1,this._tail=t;for(var n=0;n<t;n++)this._list[n]=e[n]},n.prototype._copyArray=function(e,t){var r,n=this._list,a=n.length,i=this.length;if((t|=i)==i&&this._head<this._tail)return this._list.slice(this._head,this._tail);var s=Array(t),o=0;if(e||this._head>this._tail){for(r=this._head;r<a;r++)s[o++]=n[r];for(r=0;r<this._tail;r++)s[o++]=n[r]}else for(r=this._head;r<this._tail;r++)s[o++]=n[r];return s},n.prototype._growArray=function(){if(0!=this._head){var e=this._copyArray(!0,this._list.length<<1);this._tail=this._list.length,this._head=0,this._list=e}else this._tail=this._list.length,this._list.length<<=1;this._capacityMask=this._capacityMask<<1|1},n.prototype._shrinkArray=function(){this._list.length>>>=1,this._capacityMask>>>=1},n.prototype._nextPowerOf2=function(e){return Math.max(1<<Math.log(e)/Math.log(2)+1,4)},t.exports=n},66392,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});let n=e.r(26898),a=e.r(89977),i=(0,n.Debug)("delayqueue");r.default=class{constructor(){this.queues={},this.timeouts={}}push(e,t,r){let n=r.callback||process.nextTick;this.queues[e]||(this.queues[e]=new a),this.queues[e].push(t),this.timeouts[e]||(this.timeouts[e]=setTimeout(()=>{n(()=>{this.timeouts[e]=null,this.execute(e)})},r.timeout))}execute(e){let t=this.queues[e];if(!t)return;let{length:r}=t;if(r)for(i("send %d commands in %s queue",r,e),this.queues[e]=null;t.length>0;)t.shift()()}}},93148,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});let n=e.r(78695),a=e.r(26898),i=e.r(66735),s=(0,a.Debug)("cluster:subscriberGroup:shardedSubscriber"),o="idle",l="starting",d="connected",u="stopping",c="ended",p={[o]:[l,u,c],[l]:[d,u,c],[d]:[u,c],[u]:[c],[c]:[]};r.default=class{constructor(e,t,r){var s;for(const l of(this.emitter=e,this.status=o,this.instance=null,this.connectPromise=null,this.messageListeners=new Map,this.onEnd=()=>{this.updateStatus(c),this.emitter.emit("-node",this.instance,this.nodeKey)},this.onError=e=>{this.emitter.emit("nodeError",e,this.nodeKey)},this.onMoved=()=>{this.emitter.emit("moved")},this.instance=new i.default((0,a.defaults)({enableReadyCheck:!1,enableOfflineQueue:!0,connectionName:(0,n.getConnectionName)("ssubscriber",t.connectionName),retryStrategy:null,lazyConnect:!0},t,r)),this.lazyConnect=null==(s=null==r?void 0:r.lazyConnect)||s,this.nodeKey=(0,n.getNodeKey)(t),this.instance.on("end",this.onEnd),this.instance.on("error",this.onError),this.instance.on("moved",this.onMoved),["smessage","smessageBuffer"])){const e=(...e)=>{this.emitter.emit(l,...e)};this.messageListeners.set(l,e),this.instance.on(l,e)}}async start(){if(this.connectPromise)return this.connectPromise;if(this.status!==l&&this.status!==d){if(this.status===c||!this.instance)throw Error(`Sharded subscriber ${this.nodeKey} cannot be restarted once ended.`);this.updateStatus(l),this.connectPromise=this.instance.connect();try{await this.connectPromise,this.updateStatus(d)}catch(e){throw this.updateStatus(c),e}finally{this.connectPromise=null}}}stop(){this.updateStatus(u),this.instance&&(this.instance.disconnect(),this.instance.removeAllListeners(),this.messageListeners.clear(),this.instance=null),this.updateStatus(c),s("stopped %s",this.nodeKey)}isStarted(){return[d,l].includes(this.status)}get subscriberStatus(){return this.status}isHealthy(){return(this.status===o||this.status===d||this.status===l)&&null!==this.instance}getInstance(){return this.instance}getNodeKey(){return this.nodeKey}isLazyConnect(){return this.lazyConnect}updateStatus(e){if(this.status!==e){if(!p[this.status].includes(e))return void s("Invalid status transition for %s: %s -> %s",this.nodeKey,this.status,e);this.status=e}}}},58432,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});let n=e.r(26898),a=e.r(78695),i=e.r(9068),s=e.r(93148),o=(0,n.Debug)("cluster:subscriberGroup");class l{constructor(e,t){this.subscriberGroupEmitter=e,this.options=t,this.shardedSubscribers=new Map,this.clusterSlots=[],this.subscriberToSlotsIndex=new Map,this.channels=new Map,this.failedAttemptsByNode=new Map,this.isResetting=!1,this.pendingReset=null,this.handleSubscriberConnectFailed=(e,t)=>{let r=(this.failedAttemptsByNode.get(t)||0)+1;this.failedAttemptsByNode.set(t,r);let n=Math.min(r,l.MAX_RETRY_ATTEMPTS),a=Math.min(l.BASE_BACKOFF_MS*2**n,l.MAX_BACKOFF_MS),i=Math.floor(.5*a*(Math.random()-.5)),s=Math.max(0,a+i);o("Failed to connect subscriber for %s. Refreshing slots in %dms",t,s),this.subscriberGroupEmitter.emit("subscriberConnectFailed",{delay:s,error:e})},this.handleSubscriberConnectSucceeded=e=>{this.failedAttemptsByNode.delete(e)}}getResponsibleSubscriber(e){let t=this.clusterSlots[e][0],r=this.shardedSubscribers.get(t);return r&&"idle"===r.subscriberStatus&&r.start().then(()=>{this.handleSubscriberConnectSucceeded(r.getNodeKey())}).catch(e=>{this.handleSubscriberConnectFailed(e,r.getNodeKey())}),r}addChannels(e){let t=i(e[0]);for(let r of e)if(i(r)!==t)return -1;let r=this.channels.get(t);return r?this.channels.set(t,r.concat(e)):this.channels.set(t,e),Array.from(this.channels.values()).reduce((e,t)=>e+t.length,0)}removeChannels(e){let t=i(e[0]);for(let r of e)if(i(r)!==t)return -1;let r=this.channels.get(t);if(r){let n=r.filter(t=>!e.includes(t));this.channels.set(t,n)}return Array.from(this.channels.values()).reduce((e,t)=>e+t.length,0)}stop(){for(let e of this.shardedSubscribers.values())e.stop();this.pendingReset=null,this.shardedSubscribers.clear(),this.subscriberToSlotsIndex.clear()}start(){let e=[];for(let t of this.shardedSubscribers.values())this.shouldStartSubscriber(t)&&(e.push(t.start().then(()=>{this.handleSubscriberConnectSucceeded(t.getNodeKey())}).catch(e=>{this.handleSubscriberConnectFailed(e,t.getNodeKey())})),this.subscriberGroupEmitter.emit("+subscriber"));return Promise.all(e)}async reset(e,t){if(this.isResetting){this.pendingReset={slots:e,nodes:t};return}this.isResetting=!0;try{let r=this._refreshSlots(e),n=this.hasUnhealthySubscribers();if(!r&&!n)return void o("No topology change detected or failed subscribers. Skipping reset.");for(let[e,t]of this.shardedSubscribers){if(this.subscriberToSlotsIndex.has(e)&&t.isHealthy()){o("Skipping deleting subscriber for %s",e);continue}o("Removing subscriber for %s",e),t.stop(),this.shardedSubscribers.delete(e),this.subscriberGroupEmitter.emit("-subscriber")}let i=[];for(let[e,r]of this.subscriberToSlotsIndex){let r=this.shardedSubscribers.get(e);if(r&&r.isHealthy()){o("Skipping creating new subscriber for %s",e),!r.isStarted()&&this.shouldStartSubscriber(r)&&i.push(r.start().then(()=>{this.handleSubscriberConnectSucceeded(e)}).catch(t=>{this.handleSubscriberConnectFailed(t,e)}));continue}r&&!r.isHealthy()&&(o("Replacing subscriber for %s",e),r.stop(),this.shardedSubscribers.delete(e),this.subscriberGroupEmitter.emit("-subscriber")),o("Creating new subscriber for %s",e);let n=t.find(t=>(0,a.getNodeKey)(t.options)===e);if(!n){o("Failed to find node for key %s",e);continue}let l=new s.default(this.subscriberGroupEmitter,n.options,this.options.redisOptions);this.shardedSubscribers.set(e,l),this.shouldStartSubscriber(l)&&i.push(l.start().then(()=>{this.handleSubscriberConnectSucceeded(e)}).catch(t=>{this.handleSubscriberConnectFailed(t,e)})),this.subscriberGroupEmitter.emit("+subscriber")}await Promise.all(i),this._resubscribe(),this.subscriberGroupEmitter.emit("subscribersReady")}finally{if(this.isResetting=!1,this.pendingReset){let{slots:e,nodes:t}=this.pendingReset;this.pendingReset=null,await this.reset(e,t)}}}_refreshSlots(e){if(this._slotsAreEqual(e)&&this.subscriberToSlotsIndex.size>0)return o("Nothing to refresh because the new cluster map is equal to the previous one."),!1;o("Refreshing the slots of the subscriber group."),this.subscriberToSlotsIndex=new Map;for(let t=0;t<e.length;t++){let r=e[t][0];this.subscriberToSlotsIndex.has(r)||this.subscriberToSlotsIndex.set(r,[]),this.subscriberToSlotsIndex.get(r).push(Number(t))}return this.clusterSlots=JSON.parse(JSON.stringify(e)),!0}_resubscribe(){this.shardedSubscribers&&this.shardedSubscribers.forEach((e,t)=>{let r=this.subscriberToSlotsIndex.get(t);r&&r.forEach(r=>{let n=e.getInstance(),a=this.channels.get(r);if(a&&a.length>0){if(!n||"end"===n.status)return;"ready"===n.status?n.ssubscribe(...a).catch(e=>{o("Failed to ssubscribe on node %s: %s",t,e)}):n.once("ready",()=>{n.ssubscribe(...a).catch(e=>{o("Failed to ssubscribe on node %s: %s",t,e)})})}})})}_slotsAreEqual(e){return void 0!==this.clusterSlots&&JSON.stringify(this.clusterSlots)===JSON.stringify(e)}hasUnhealthySubscribers(){let e=Array.from(this.shardedSubscribers.values()).some(e=>!e.isHealthy()),t=Array.from(this.subscriberToSlotsIndex.keys()).some(e=>!this.shardedSubscribers.has(e));return e||t}shouldStartSubscriber(e){if(e.isStarted())return!1;if(!e.isLazyConnect())return!0;let t=this.subscriberToSlotsIndex.get(e.getNodeKey());return!!t&&t.some(e=>{let t=this.channels.get(e);return!!(t&&t.length>0)})}}r.default=l,l.MAX_RETRY_ATTEMPTS=10,l.MAX_BACKOFF_MS=2e3,l.BASE_BACKOFF_MS=100},83252,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});let n=e.r(12522),a=e.r(27699),i=e.r(63227),s=e.r(19335),o=e.r(30846),l=e.r(17798),d=e.r(66735),u=e.r(12749),c=e.r(3422),p=e.r(26898),h=e.r(57674),y=e.r(67061),m=e.r(23086),f=e.r(55925),b=e.r(77825),g=e.r(66392),K=e.r(78695),v=e.r(89977),S=e.r(58432),E=(0,p.Debug)("cluster"),I=new WeakSet;class k extends y.default{constructor(e,t={}){var r;if(super(),this.slots=[],this._groupsIds={},this._groupsBySlot=Array(16384),this.isCluster=!0,this.retryAttempts=0,this.delayQueue=new g.default,this.offlineQueue=new v,this.isRefreshing=!1,this._refreshSlotsCacheCallbacks=[],this._autoPipelines=new Map,this._runningAutoPipelines=new Set,this._readyDelayedCallbacks=[],this.connectionEpoch=0,a.EventEmitter.call(this),this.startupNodes=e,this.options=(0,p.defaults)({},t,m.DEFAULT_CLUSTER_OPTIONS,this.options),this.options.shardedSubscribers&&this.createShardedSubscriberGroup(),this.options.redisOptions&&this.options.redisOptions.keyPrefix&&!this.options.keyPrefix&&(this.options.keyPrefix=this.options.redisOptions.keyPrefix),"function"!=typeof this.options.scaleReads&&-1===["all","master","slave"].indexOf(this.options.scaleReads))throw Error('Invalid option scaleReads "'+this.options.scaleReads+'". Expected "all", "master", "slave" or a custom function');this.connectionPool=new b.default(null!=(r=this.options.redisOptions)?r:{},this.options.clusterNodeRetryStrategy),this.connectionPool.on("-node",(e,t)=>{this.emit("-node",e)}),this.connectionPool.on("+node",e=>{this.emit("+node",e)}),this.connectionPool.on("drain",()=>{this.setStatus("close")}),this.connectionPool.on("nodeError",(e,t)=>{this.emit("node error",e,t)}),this.subscriber=new f.default(this.connectionPool,this),this.options.scripts&&Object.entries(this.options.scripts).forEach(([e,t])=>{this.defineCommand(e,t)}),this.options.lazyConnect?this.setStatus("wait"):this.connect().catch(e=>{E("connecting failed: %s",e)})}connect(){return new Promise((e,t)=>{if("connecting"===this.status||"connect"===this.status||"ready"===this.status)return void t(Error("Redis is already connecting/connected"));let r=++this.connectionEpoch;this.setStatus("connecting"),this.resolveStartupNodeHostnames().then(n=>{let a;if(this.connectionEpoch!==r){E("discard connecting after resolving startup nodes because epoch not match: %d != %d",r,this.connectionEpoch),t(new i.RedisError("Connection is discarded because a new connection is made"));return}if("connecting"!==this.status){E("discard connecting after resolving startup nodes because the status changed to %s",this.status),t(new i.RedisError("Connection is aborted"));return}this.connectionPool.reset(n),this.options.shardedSubscribers&&this.shardedSubscribers.reset(this.slots,this.connectionPool.getNodes("all")).catch(e=>{E("Error while starting subscribers: %s",e)});let s=()=>{this.setStatus("ready"),this.retryAttempts=0,this.executeOfflineCommands(),this.resetNodesRefreshInterval(),e()},o=()=>{this.invokeReadyDelayedCallbacks(void 0),this.removeListener("close",a),this.manuallyClosing=!1,this.setStatus("connect"),this.options.enableReadyCheck?this.readyCheck((e,t)=>{e||t?(E("Ready check failed (%s). Reconnecting...",e||t),"connect"===this.status&&this.disconnect(!0)):s()}):s()};a=()=>{let e=Error("None of startup nodes is available");this.removeListener("refresh",o),this.invokeReadyDelayedCallbacks(e),t(e)},this.once("refresh",o),this.once("close",a),this.once("close",this.handleCloseEvent.bind(this)),this.refreshSlotsCache(e=>{e&&e.message===l.default.defaultMessage&&(d.default.prototype.silentEmit.call(this,"error",e),this.connectionPool.reset([]))}),this.subscriber.start(),this.options.shardedSubscribers&&this.shardedSubscribers.start().catch(e=>{E("Error while starting subscribers: %s",e)})}).catch(e=>{this.setStatus("close"),this.handleCloseEvent(e),this.invokeReadyDelayedCallbacks(e),t(e)})})}disconnect(e=!1){let t=this.status;this.setStatus("disconnecting"),e||(this.manuallyClosing=!0),this.reconnectTimeout&&!e&&(clearTimeout(this.reconnectTimeout),this.reconnectTimeout=null,E("Canceled reconnecting attempts")),this.clearNodesRefreshInterval(),this.subscriber.stop(),this.options.shardedSubscribers&&this.shardedSubscribers.stop(),"wait"===t?(this.setStatus("close"),this.handleCloseEvent()):this.connectionPool.reset([])}quit(e){let t=this.status;if(this.setStatus("disconnecting"),this.manuallyClosing=!0,this.reconnectTimeout&&(clearTimeout(this.reconnectTimeout),this.reconnectTimeout=null),this.clearNodesRefreshInterval(),this.subscriber.stop(),this.options.shardedSubscribers&&this.shardedSubscribers.stop(),"wait"===t){let t=(0,s.default)(Promise.resolve("OK"),e);return setImmediate((function(){this.setStatus("close"),this.handleCloseEvent()}).bind(this)),t}return(0,s.default)(Promise.all(this.nodes().map(e=>e.quit().catch(e=>{if(e.message===p.CONNECTION_CLOSED_ERROR_MSG)return"OK";throw e}))).then(()=>"OK"),e)}duplicate(e=[],t={}){return new k(e.length>0?e:this.startupNodes.slice(0),Object.assign({},this.options,t))}nodes(e="all"){if("all"!==e&&"master"!==e&&"slave"!==e)throw Error('Invalid role "'+e+'". Expected "all", "master" or "slave"');return this.connectionPool.getNodes(e)}delayUntilReady(e){this._readyDelayedCallbacks.push(e)}get autoPipelineQueueSize(){let e=0;for(let t of this._autoPipelines.values())e+=t.length;return e}refreshSlotsCache(e){if(e&&this._refreshSlotsCacheCallbacks.push(e),this.isRefreshing)return;this.isRefreshing=!0;let t=this,r=e=>{for(let t of(this.isRefreshing=!1,this._refreshSlotsCacheCallbacks))t(e);this._refreshSlotsCacheCallbacks=[]},n=(0,p.shuffle)(this.connectionPool.getNodes()),a=null;!function e(i){if(i===n.length)return r(new l.default(l.default.defaultMessage,a));let s=n[i],o=`${s.options.host}:${s.options.port}`;E("getting slot cache from %s",o),t.getInfoFromNode(s,function(n){switch(t.status){case"close":case"end":return r(Error("Cluster is disconnected."));case"disconnecting":return r(Error("Cluster is disconnecting."))}n?(t.emit("node error",n,o),a=n,e(i+1)):(t.emit("refresh"),r())})}(0)}sendCommand(e,t,r){if("wait"===this.status&&this.connect().catch(p.noop),"end"===this.status)return e.reject(Error(p.CONNECTION_CLOSED_ERROR_MSG)),e.promise;let a=this.options.scaleReads;"master"!==a&&(e.isReadOnly||(0,n.exists)(e.name)&&(0,n.hasFlag)(e.name,"readonly")||(a="master"));let s=r?r.slot:e.getSlot(),l={},d=this;if(!r&&!I.has(e)){I.add(e);let t=e.reject;e.reject=function(r){let n=u.bind(null,!0);d.handleError(r,l,{moved:function(t,r){E("command %s is moved to %s",e.name,r),s=Number(t),d.slots[t]?d.slots[t][0]=r:d.slots[t]=[r],d._groupsBySlot[t]=d._groupsIds[d.slots[t].join(";")],d.connectionPool.findOrCreate(d.natMapper(r)),u(),E("refreshing slot caches... (triggered by MOVED error)"),d.refreshSlotsCache()},ask:function(t,r){E("command %s is required to ask %s:%s",e.name,r);let n=d.natMapper(r);d.connectionPool.findOrCreate(n),u(!1,`${n.host}:${n.port}`)},tryagain:n,clusterDown:n,connectionClosed:n,maxRedirections:function(r){t.call(e,r)},defaults:function(){t.call(e,r)}})}}function u(n,l){let u;if("end"===d.status)return void e.reject(new i.AbortError("Cluster is ended."));if("ready"===d.status||"cluster"===e.name){if(r&&r.redis)u=r.redis;else if(o.default.checkFlag("ENTER_SUBSCRIBER_MODE",e.name)||o.default.checkFlag("EXIT_SUBSCRIBER_MODE",e.name)){if(d.options.shardedSubscribers&&("ssubscribe"==e.name||"sunsubscribe"==e.name)){let t=d.shardedSubscribers.getResponsibleSubscriber(s);if(!t)return void e.reject(new i.AbortError(`No sharded subscriber for slot: ${s}`));let r=-1;"ssubscribe"==e.name&&(r=d.shardedSubscribers.addChannels(e.getKeys())),"sunsubscribe"==e.name&&(r=d.shardedSubscribers.removeChannels(e.getKeys())),-1!==r?u=t.getInstance():e.reject(new i.AbortError("Possible CROSSSLOT error: All channels must hash to the same slot"))}else u=d.subscriber.getInstance();if(!u)return void e.reject(new i.AbortError("No subscriber for the cluster"))}else{if(!n){if("number"==typeof s&&d.slots[s]){let t=d.slots[s];if("function"==typeof a){let r=t.map(function(e){return d.connectionPool.getInstanceByKey(e)});Array.isArray(u=a(r,e))&&(u=(0,p.sample)(u)),u||(u=r[0])}else{let e;e="all"===a?(0,p.sample)(t):"slave"===a&&t.length>1?(0,p.sample)(t,1):t[0],u=d.connectionPool.getInstanceByKey(e)}}l&&(u=d.connectionPool.getInstanceByKey(l)).asking()}if(u||(u=("function"==typeof a?null:d.connectionPool.getSampleInstance(a))||d.connectionPool.getSampleInstance("all")),u&&!d.options.enableOfflineQueue&&"ready"!==u.status&&"wait"!==u.status)return void e.reject(Error(p.CONNECTION_CLOSED_ERROR_MSG))}r&&!r.redis&&(r.redis=u)}!u&&d.options.enableOfflineQueue?d.offlineQueue.push({command:e,stream:t,node:r}):u?u.sendCommand(e,t):e.reject(Error("Cluster isn't ready and enableOfflineQueue options is false"))}return u(),e.promise}sscanStream(e,t){return this.createScanStream("sscan",{key:e,options:t})}sscanBufferStream(e,t){return this.createScanStream("sscanBuffer",{key:e,options:t})}hscanStream(e,t){return this.createScanStream("hscan",{key:e,options:t})}hscanBufferStream(e,t){return this.createScanStream("hscanBuffer",{key:e,options:t})}zscanStream(e,t){return this.createScanStream("zscan",{key:e,options:t})}zscanBufferStream(e,t){return this.createScanStream("zscanBuffer",{key:e,options:t})}handleError(e,t,r){if(void 0===t.value?t.value=this.options.maxRedirections:t.value-=1,t.value<=0)return void r.maxRedirections(Error("Too many Cluster redirections. Last error: "+e));let n=e.message.split(" ");if("MOVED"===n[0]){let e=this.options.retryDelayOnMoved;e&&"number"==typeof e?this.delayQueue.push("moved",r.moved.bind(null,n[1],n[2]),{timeout:e}):r.moved(n[1],n[2])}else"ASK"===n[0]?r.ask(n[1],n[2]):"TRYAGAIN"===n[0]?this.delayQueue.push("tryagain",r.tryagain,{timeout:this.options.retryDelayOnTryAgain}):"CLUSTERDOWN"===n[0]&&this.options.retryDelayOnClusterDown>0?this.delayQueue.push("clusterdown",r.connectionClosed,{timeout:this.options.retryDelayOnClusterDown,callback:this.refreshSlotsCache.bind(this)}):e.message===p.CONNECTION_CLOSED_ERROR_MSG&&this.options.retryDelayOnFailover>0&&"ready"===this.status?this.delayQueue.push("failover",r.connectionClosed,{timeout:this.options.retryDelayOnFailover,callback:this.refreshSlotsCache.bind(this)}):r.defaults()}resetOfflineQueue(){this.offlineQueue=new v}clearNodesRefreshInterval(){this.slotsTimer&&(clearTimeout(this.slotsTimer),this.slotsTimer=null)}resetNodesRefreshInterval(){if(this.slotsTimer||!this.options.slotsRefreshInterval)return;let e=()=>{this.slotsTimer=setTimeout(()=>{E('refreshing slot caches... (triggered by "slotsRefreshInterval" option)'),this.refreshSlotsCache(()=>{e()})},this.options.slotsRefreshInterval)};e()}setStatus(e){E("status: %s -> %s",this.status||"[empty]",e),this.status=e,process.nextTick(()=>{this.emit(e)})}handleCloseEvent(e){var t;let r;e&&E("closed because %s",e),this.manuallyClosing||"function"!=typeof this.options.clusterRetryStrategy||(r=this.options.clusterRetryStrategy.call(this,++this.retryAttempts,e)),"number"==typeof r?(this.setStatus("reconnecting"),this.reconnectTimeout=setTimeout(()=>{this.reconnectTimeout=null,E("Cluster is disconnected. Retrying after %dms",r),this.connect().catch(function(e){E("Got error %s when reconnecting. Ignoring...",e)})},r)):(this.options.shardedSubscribers&&(null==(t=this.subscriberGroupEmitter)||t.removeAllListeners()),this.setStatus("end"),this.flushQueue(Error("None of startup nodes is available")))}flushQueue(e){let t;for(;t=this.offlineQueue.shift();)t.command.reject(e)}executeOfflineCommands(){if(this.offlineQueue.length){let e;E("send %d commands in offline queue",this.offlineQueue.length);let t=this.offlineQueue;for(this.resetOfflineQueue();e=t.shift();)this.sendCommand(e.command,e.stream,e.node)}}natMapper(e){let t="string"==typeof e?e:`${e.host}:${e.port}`,r=null;return(this.options.natMap&&"function"==typeof this.options.natMap?r=this.options.natMap(t):this.options.natMap&&"object"==typeof this.options.natMap&&(r=this.options.natMap[t]),r)?(E("NAT mapping %s -> %O",t,r),Object.assign({},r)):"string"==typeof e?(0,K.nodeKeyToRedisOptions)(e):e}getInfoFromNode(e,t){if(!e)return t(Error("Node is disconnected"));let r=e.duplicate({enableOfflineQueue:!0,enableReadyCheck:!1,retryStrategy:null,connectionName:(0,K.getConnectionName)("refresher",this.options.redisOptions&&this.options.redisOptions.connectionName)});r.on("error",p.noop),r.cluster("SLOTS",(0,p.timeout)((e,n)=>{if(r.disconnect(),e)return E("error encountered running CLUSTER.SLOTS: %s",e),t(e);if("disconnecting"===this.status||"close"===this.status||"end"===this.status){E("ignore CLUSTER.SLOTS results (count: %d) since cluster status is %s",n.length,this.status),t();return}let a=[];E("cluster slots result count: %d",n.length);for(let e=0;e<n.length;++e){let t=n[e],r=t[0],i=t[1],s=[];for(let e=2;e<t.length;e++){if(!t[e][0])continue;let r=this.natMapper({host:t[e][0],port:t[e][1]});r.readOnly=2!==e,a.push(r),s.push(r.host+":"+r.port)}E("cluster slots result [%d]: slots %d~%d served by %s",e,r,i,s);for(let e=r;e<=i;e++)this.slots[e]=s}this._groupsIds=Object.create(null);let i=0;for(let e=0;e<16384;e++){let t=(this.slots[e]||[]).join(";");if(!t.length){this._groupsBySlot[e]=void 0;continue}this._groupsIds[t]||(this._groupsIds[t]=++i),this._groupsBySlot[e]=this._groupsIds[t]}this.connectionPool.reset(a),this.options.shardedSubscribers&&this.shardedSubscribers.reset(this.slots,this.connectionPool.getNodes("all")).catch(e=>{E("Error while starting subscribers: %s",e)}),t()},this.options.slotsRefreshTimeout))}invokeReadyDelayedCallbacks(e){for(let t of this._readyDelayedCallbacks)process.nextTick(t,e);this._readyDelayedCallbacks=[]}readyCheck(e){this.cluster("INFO",(t,r)=>{let n;if(t)return e(t);if("string"!=typeof r)return e();let a=r.split("\r\n");for(let e=0;e<a.length;++e){let t=a[e].split(":");if("cluster_state"===t[0]){n=t[1];break}}"fail"===n?(E("cluster state not ok (%s)",n),e(null,n)):e()})}resolveSrv(e){return new Promise((t,r)=>{this.options.resolveSrv(e,(e,n)=>{if(e)return r(e);let a=this,i=(0,K.groupSrvRecords)(n),s=Object.keys(i).sort((e,t)=>parseInt(e)-parseInt(t));!function e(n){if(!s.length)return r(n);let o=i[s[0]],l=(0,K.weightSrvRecords)(o);o.records.length||s.shift(),a.dnsLookup(l.name).then(e=>t({host:e,port:l.port}),e)}()})})}dnsLookup(e){return new Promise((t,r)=>{this.options.dnsLookup(e,(n,a)=>{n?(E("failed to resolve hostname %s to IP: %s",e,n.message),r(n)):(E("resolved hostname %s to IP %s",e,a),t(a))})})}async resolveStartupNodeHostnames(){if(!Array.isArray(this.startupNodes)||0===this.startupNodes.length)throw Error("`startupNodes` should contain at least one node.");let e=(0,K.normalizeNodeOptions)(this.startupNodes),t=(0,K.getUniqueHostnamesFromOptions)(e);if(0===t.length)return e;let r=await Promise.all(t.map((this.options.useSRVRecords?this.resolveSrv:this.dnsLookup).bind(this))),n=(0,p.zipMap)(t,r);return e.map(e=>{let t=n.get(e.host);return t?this.options.useSRVRecords?Object.assign({},e,t):Object.assign({},e,{host:t}):e})}createScanStream(e,{key:t,options:r={}}){return new u.default({objectMode:!0,key:t,redis:this,command:e,...r})}createShardedSubscriberGroup(){this.subscriberGroupEmitter=new a.EventEmitter,this.shardedSubscribers=new S.default(this.subscriberGroupEmitter,this.options);let e=e=>{e instanceof l.default&&this.disconnect(!0)};for(let t of(this.subscriberGroupEmitter.on("-node",(t,r)=>{this.emit("-node",t,r),this.refreshSlotsCache(e)}),this.subscriberGroupEmitter.on("subscriberConnectFailed",({delay:t,error:r})=>{this.emit("error",r),setTimeout(()=>{this.refreshSlotsCache(e)},t)}),this.subscriberGroupEmitter.on("moved",()=>{this.refreshSlotsCache(e)}),this.subscriberGroupEmitter.on("-subscriber",()=>{this.emit("-subscriber")}),this.subscriberGroupEmitter.on("+subscriber",()=>{this.emit("+subscriber")}),this.subscriberGroupEmitter.on("nodeError",(e,t)=>{this.emit("nodeError",e,t)}),this.subscriberGroupEmitter.on("subscribersReady",()=>{this.emit("subscribersReady")}),["smessage","smessageBuffer"]))this.subscriberGroupEmitter.on(t,(e,r,n)=>{this.emit(t,e,r,n)})}}(0,h.default)(k,a.EventEmitter),(0,c.addTransactionSupport)(k.prototype),r.default=k},55004,(e,t,r)=>{t.exports=e.x("tls",()=>require("tls"))},58451,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});let n=(0,e.r(26898).Debug)("AbstractConnector");r.default=class{constructor(e){this.connecting=!1,this.disconnectTimeout=e}check(e){return!0}disconnect(){if(this.connecting=!1,this.stream){let e=this.stream,t=setTimeout(()=>{n("stream %s:%s still open, destroying it",e.remoteAddress,e.remotePort),e.destroy()},this.disconnectTimeout);e.on("close",()=>clearTimeout(t)),e.end()}}}},90851,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});let n=e.r(4446),a=e.r(55004),i=e.r(26898),s=e.r(58451);class o extends s.default{constructor(e){super(e.disconnectTimeout),this.options=e}connect(e){let t,{options:r}=this;return this.connecting=!0,"path"in r&&r.path?t={path:r.path}:(t={},"port"in r&&null!=r.port&&(t.port=r.port),"host"in r&&null!=r.host&&(t.host=r.host),"family"in r&&null!=r.family&&(t.family=r.family)),r.tls&&Object.assign(t,r.tls),new Promise((e,s)=>{process.nextTick(()=>{if(!this.connecting)return void s(Error(i.CONNECTION_CLOSED_ERROR_MSG));try{r.tls?this.stream=(0,a.connect)(t):this.stream=(0,n.createConnection)(t)}catch(e){s(e);return}this.stream.once("error",e=>{this.firstError=e}),e(this.stream)})})}}r.default=o},85649,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.default=class{constructor(e){this.cursor=0,this.sentinels=e.slice(0)}next(){let e=this.cursor>=this.sentinels.length;return{done:e,value:e?void 0:this.sentinels[this.cursor++]}}reset(e){e&&this.sentinels.length>1&&1!==this.cursor&&this.sentinels.unshift(...this.sentinels.splice(this.cursor-1)),this.cursor=0}add(e){for(let r=0;r<this.sentinels.length;r++){var t;if(t=this.sentinels[r],(e.host||"127.0.0.1")===(t.host||"127.0.0.1")&&(e.port||26379)===(t.port||26379))return!1}return this.sentinels.push(e),!0}toString(){return`${JSON.stringify(this.sentinels)} @${this.cursor}`}}},87575,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.FailoverDetector=void 0;let n=(0,e.r(26898).Debug)("FailoverDetector"),a="+switch-master";r.FailoverDetector=class{constructor(e,t){this.isDisconnected=!1,this.connector=e,this.sentinels=t}cleanup(){for(let e of(this.isDisconnected=!0,this.sentinels))e.client.disconnect()}async subscribe(){n("Starting FailoverDetector");let e=[];for(let t of this.sentinels){let r=t.client.subscribe(a).catch(e=>{n("Failed to subscribe to failover messages on sentinel %s:%s (%s)",t.address.host||"127.0.0.1",t.address.port||26739,e.message)});e.push(r),t.client.on("message",e=>{this.isDisconnected||e!==a||this.disconnect()})}await Promise.all(e)}disconnect(){this.isDisconnected=!0,n("Failover detected, disconnecting"),this.connector.disconnect()}}},77420,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.SentinelIterator=void 0;let n=e.r(4446),a=e.r(26898),i=e.r(55004),s=e.r(85649);r.SentinelIterator=s.default;let o=e.r(58451),l=e.r(66735),d=e.r(87575),u=(0,a.Debug)("SentinelConnector");class c extends o.default{constructor(e){if(super(e.disconnectTimeout),this.options=e,this.emitter=null,this.failoverDetector=null,!this.options.sentinels.length)throw Error("Requires at least one sentinel to connect to.");if(!this.options.name)throw Error("Requires the name of master.");this.sentinelIterator=new s.default(this.options.sentinels)}check(e){let t=!e.role||this.options.role===e.role;return t||(u("role invalid, expected %s, but got %s",this.options.role,e.role),this.sentinelIterator.next(),this.sentinelIterator.next(),this.sentinelIterator.reset(!0)),t}disconnect(){super.disconnect(),this.failoverDetector&&this.failoverDetector.cleanup()}connect(e){let t;this.connecting=!0,this.retryAttempts=0;let r=async()=>{let s=this.sentinelIterator.next();if(s.done){this.sentinelIterator.reset(!1);let n="function"==typeof this.options.sentinelRetryStrategy?this.options.sentinelRetryStrategy(++this.retryAttempts):null,a="number"!=typeof n?"All sentinels are unreachable and retry is disabled.":`All sentinels are unreachable. Retrying from scratch after ${n}ms.`;t&&(a+=` Last error: ${t.message}`),u(a);let i=Error(a);if("number"==typeof n)return e("error",i),await new Promise(e=>setTimeout(e,n)),r();throw i}let o=null,l=null;try{o=await this.resolve(s.value)}catch(e){l=e}if(!this.connecting)throw Error(a.CONNECTION_CLOSED_ERROR_MSG);let d=s.value.host+":"+s.value.port;if(o)return u("resolved: %s:%s from sentinel %s",o.host,o.port,d),this.options.enableTLSForSentinelMode&&this.options.tls?(Object.assign(o,this.options.tls),this.stream=(0,i.connect)(o),this.stream.once("secureConnect",this.initFailoverDetector.bind(this))):(this.stream=(0,n.createConnection)(o),this.stream.once("connect",this.initFailoverDetector.bind(this))),this.stream.once("error",e=>{this.firstError=e}),this.stream;{let n=l?"failed to connect to sentinel "+d+" because "+l.message:"connected to sentinel "+d+" successfully, but got an invalid reply: "+o;return u(n),e("sentinelError",Error(n)),l&&(t=l),r()}};return r()}async updateSentinels(e){if(!this.options.updateSentinels)return;let t=await e.sentinel("sentinels",this.options.name);Array.isArray(t)&&(t.map(a.packObject).forEach(e=>{if(-1===(e.flags?e.flags.split(","):[]).indexOf("disconnected")&&e.ip&&e.port){let t=this.sentinelNatResolve(p(e));this.sentinelIterator.add(t)&&u("adding sentinel %s:%s",t.host,t.port)}}),u("Updated internal sentinels: %s",this.sentinelIterator))}async resolveMaster(e){let t=await e.sentinel("get-master-addr-by-name",this.options.name);return await this.updateSentinels(e),this.sentinelNatResolve(Array.isArray(t)?{host:t[0],port:Number(t[1])}:null)}async resolveSlave(e){let t=await e.sentinel("slaves",this.options.name);if(!Array.isArray(t))return null;let r=t.map(a.packObject).filter(e=>e.flags&&!e.flags.match(/(disconnected|s_down|o_down)/));return this.sentinelNatResolve(function(e,t){let r;if(0===e.length)return null;if("function"==typeof t)r=t(e);else if(null!==t&&"object"==typeof t){let n=Array.isArray(t)?t:[t];n.sort((e,t)=>(e.prio||(e.prio=1),t.prio||(t.prio=1),e.prio<t.prio)?-1:+(e.prio>t.prio));for(let t=0;t<n.length;t++){for(let a=0;a<e.length;a++){let i=e[a];if(i.ip===n[t].ip&&i.port===n[t].port){r=i;break}}if(r)break}}return r||(r=(0,a.sample)(e)),p(r)}(r,this.options.preferredSlaves))}sentinelNatResolve(e){if(!e||!this.options.natMap)return e;let t=`${e.host}:${e.port}`,r=e;return"function"==typeof this.options.natMap?r=this.options.natMap(t)||e:"object"==typeof this.options.natMap&&(r=this.options.natMap[t]||e),r}connectToSentinel(e,t){return new l.default({port:e.port||26379,host:e.host,username:this.options.sentinelUsername||null,password:this.options.sentinelPassword||null,family:e.family||("path"in this.options&&this.options.path?void 0:this.options.family),tls:this.options.sentinelTLS,retryStrategy:null,enableReadyCheck:!1,connectTimeout:this.options.connectTimeout,commandTimeout:this.options.sentinelCommandTimeout,...t})}async resolve(e){let t=this.connectToSentinel(e);t.on("error",h);try{if("slave"===this.options.role)return await this.resolveSlave(t);return await this.resolveMaster(t)}finally{t.disconnect()}}async initFailoverDetector(){var e;if(!this.options.failoverDetector)return;this.sentinelIterator.reset(!0);let t=[];for(;t.length<this.options.sentinelMaxConnections;){let{done:e,value:r}=this.sentinelIterator.next();if(e)break;let n=this.connectToSentinel(r,{lazyConnect:!0,retryStrategy:this.options.sentinelReconnectStrategy});n.on("reconnecting",()=>{var e;null==(e=this.emitter)||e.emit("sentinelReconnecting")}),t.push({address:r,client:n})}this.sentinelIterator.reset(!1),this.failoverDetector&&this.failoverDetector.cleanup(),this.failoverDetector=new d.FailoverDetector(this,t),await this.failoverDetector.subscribe(),null==(e=this.emitter)||e.emit("failoverSubscribed")}}function p(e){return{host:e.ip,port:Number(e.port)}}function h(){}r.default=c},18652,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.SentinelConnector=r.StandaloneConnector=void 0,r.StandaloneConnector=e.r(90851).default,r.SentinelConnector=e.r(77420).default},53757,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});let n=e.r(63227);class a extends n.AbortError{constructor(e){super(`Reached the max retries per request limit (which is ${e}). Refer to "maxRetriesPerRequest" option for details.`),Error.captureStackTrace(this,this.constructor)}get name(){return this.constructor.name}}r.default=a},88060,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.MaxRetriesPerRequestError=void 0,r.MaxRetriesPerRequestError=e.r(53757).default},99348,(e,t,r)=>{t.exports=e.x("string_decoder",()=>require("string_decoder"))},29082,(e,t,r)=>{"use strict";let n=e.r(874).Buffer,a=new(e.r(99348)).StringDecoder,i=e.r(63227),s=i.ReplyError,o=i.ParserError;var l=n.allocUnsafe(32768),d=0,u=null,c=0,p=0;function h(e){let t=e.offset,r=e.buffer,n=r.length-1;for(var a=t;a<n;)if(13===r[a++]){if(e.offset=a+1,!0===e.optionReturnBuffers)return e.buffer.slice(t,a-1);return e.buffer.toString("utf8",t,a-1)}}function y(e){let t=e.buffer.length-1;for(var r=e.offset,n=0;r<t;){let t=e.buffer[r++];if(13===t)return e.offset=r+1,n;n=10*n+(t-48)}}function m(e,t,r){e.arrayCache.push(t),e.arrayPos.push(r)}function f(e){let t=e.arrayCache.pop();var r=e.arrayPos.pop();if(e.arrayCache.length){let n=f(e);if(void 0===n)return void m(e,t,r);t[r++]=n}return b(e,t,r)}function b(e,t,r){let n=e.buffer.length;for(;r<t.length;){let a=e.offset;if(e.offset>=n)return void m(e,t,r);let i=g(e,e.buffer[e.offset++]);if(void 0===i){e.arrayCache.length||e.bufferCache.length||(e.offset=a),m(e,t,r);return}t[r]=i,r++}return t}function g(e,t){switch(t){case 36:let r=y(e);if(void 0===r)return;if(r<0)return null;let n=e.offset+r;if(n+2>e.buffer.length){e.bigStrSize=n+2,e.totalChunkSize=e.buffer.length,e.bufferCache.push(e.buffer);return}let a=e.offset;return(e.offset=n+2,!0===e.optionReturnBuffers)?e.buffer.slice(a,n):e.buffer.toString("utf8",a,n);case 43:return h(e);case 42:let i;return void 0===(i=y(e))?void 0:i<0?null:b(e,Array(i),0);case 58:return!0===e.optionStringNumbers?function(e){let t=e.buffer.length-1;var r=e.offset,n=0,a="";for(45===e.buffer[r]&&(a+="-",r++);r<t;){var i=e.buffer[r++];if(13===i)return e.offset=r+1,0!==n&&(a+=n),a;n>0x19999998?(a+=10*n+(i-48),n=0):48===i&&0===n?a+=0:n=10*n+(i-48)}}(e):function(e){let t=e.buffer.length-1;var r=e.offset,n=0,a=1;for(45===e.buffer[r]&&(a=-1,r++);r<t;){let t=e.buffer[r++];if(13===t)return e.offset=r+1,a*n;n=10*n+(t-48)}}(e);case 45:var l=h(e);if(void 0!==l)return!0===e.optionReturnBuffers&&(l=l.toString()),new s(l);return;default:let d;return d=new o("Protocol error, got "+JSON.stringify(String.fromCharCode(t))+" as reply type byte",JSON.stringify(e.buffer),e.offset),void(e.buffer=null,e.returnFatalError(d))}}function K(){if(l.length>51200)if(1===c||p>2*c){let e=Math.floor(l.length/10),t=e<d?d:e;d=0,l=l.slice(t,l.length)}else p++,c--;else clearInterval(u),c=0,p=0,u=null}t.exports=class{constructor(e){if(!e)throw TypeError("Options are mandatory.");if("function"!=typeof e.returnError||"function"!=typeof e.returnReply)throw TypeError("The returnReply and returnError options have to be functions.");this.setReturnBuffers(!!e.returnBuffers),this.setStringNumbers(!!e.stringNumbers),this.returnError=e.returnError,this.returnFatalError=e.returnFatalError||e.returnError,this.returnReply=e.returnReply,this.reset()}reset(){this.offset=0,this.buffer=null,this.bigStrSize=0,this.totalChunkSize=0,this.bufferCache=[],this.arrayCache=[],this.arrayPos=[]}setReturnBuffers(e){if("boolean"!=typeof e)throw TypeError("The returnBuffers argument has to be a boolean");this.optionReturnBuffers=e}setStringNumbers(e){if("boolean"!=typeof e)throw TypeError("The stringNumbers argument has to be a boolean");this.optionStringNumbers=e}execute(e){if(null===this.buffer)this.buffer=e,this.offset=0;else if(0===this.bigStrSize){let t=this.buffer.length,r=t-this.offset,a=n.allocUnsafe(r+e.length);if(this.buffer.copy(a,0,this.offset,t),e.copy(a,r,0,e.length),this.buffer=a,this.offset=0,this.arrayCache.length){let e=f(this);if(void 0===e)return;this.returnReply(e)}}else if(this.totalChunkSize+e.length>=this.bigStrSize){this.bufferCache.push(e);var t=this.optionReturnBuffers?function(e){let t=e.bufferCache,r=e.offset,a=e.bigStrSize-r-2;var i=t.length,s=e.bigStrSize-e.totalChunkSize;if(e.offset=s,s<=2){if(2===i)return t[0].slice(r,t[0].length+s-2);i--,s=t[t.length-2].length+s}l.length<a+d&&(d>0x6f00000&&(d=0x3200000),l=n.allocUnsafe(a*(a>0x4b00000?2:3)+d),d=0,c++,null===u&&(u=setInterval(K,50)));let o=d;t[0].copy(l,o,r,t[0].length),d+=t[0].length-r;for(var p=1;p<i-1;p++)t[p].copy(l,d),d+=t[p].length;return t[p].copy(l,d,0,s-2),d+=s-2,l.slice(o,d)}(this):function(e){let t=e.bufferCache,r=e.offset;var n=t.length,i=e.bigStrSize-e.totalChunkSize;if(e.offset=i,i<=2){if(2===n)return t[0].toString("utf8",r,t[0].length+i-2);n--,i=t[t.length-2].length+i}for(var s=a.write(t[0].slice(r)),o=1;o<n-1;o++)s+=a.write(t[o]);return s+a.end(t[o].slice(0,i-2))}(this);if(this.bigStrSize=0,this.bufferCache=[],this.buffer=e,this.arrayCache.length&&(this.arrayCache[0][this.arrayPos[0]++]=t,void 0===(t=f(this))))return;this.returnReply(t)}else{this.bufferCache.push(e),this.totalChunkSize+=e.length;return}for(;this.offset<this.buffer.length;){let e=this.offset,t=this.buffer[this.offset++],r=g(this,t);if(void 0===r){this.arrayCache.length||this.bufferCache.length||(this.offset=e);return}45===t?this.returnError(r):this.returnReply(r)}this.buffer=null}}},43906,(e,t,r)=>{"use strict";t.exports=e.r(29082)},89611,(e,t,r)=>{"use strict";function n(e){return"unsubscribe"===e?"subscribe":"punsubscribe"===e?"psubscribe":"sunsubscribe"===e?"ssubscribe":e}Object.defineProperty(r,"__esModule",{value:!0}),r.default=class{constructor(){this.set={subscribe:{},psubscribe:{},ssubscribe:{}}}add(e,t){this.set[n(e)][t]=!0}del(e,t){delete this.set[n(e)][t]}channels(e){return Object.keys(this.set[n(e)])}isEmpty(){return 0===this.channels("subscribe").length&&0===this.channels("psubscribe").length&&0===this.channels("ssubscribe").length}}},73052,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});let n=e.r(30846),a=e.r(26898),i=e.r(43906),s=e.r(89611),o=(0,a.Debug)("dataHandler");r.default=class{constructor(e,t){this.redis=e;const r=new i({stringNumbers:t.stringNumbers,returnBuffers:!0,returnError:e=>{this.returnError(e)},returnFatalError:e=>{this.returnFatalError(e)},returnReply:e=>{this.returnReply(e)}});e.stream.prependListener("data",e=>{r.execute(e)}),e.stream.resume()}returnFatalError(e){e.message+=". Please report this.",this.redis.recoverFromFatalError(e,e,{offlineQueue:!1})}returnError(e){let t=this.shiftCommand(e);if(t){if(e.command={name:t.command.name,args:t.command.args},"ssubscribe"==t.command.name&&e.message.includes("MOVED"))return void this.redis.emit("moved");this.redis.handleReconnection(e,t)}}returnReply(e){if(this.handleMonitorReply(e)||this.handleSubscriberReply(e))return;let t=this.shiftCommand(e);t&&(n.default.checkFlag("ENTER_SUBSCRIBER_MODE",t.command.name)?(this.redis.condition.subscriber=new s.default,this.redis.condition.subscriber.add(t.command.name,e[1].toString()),d(t.command,e[2])||this.redis.commandQueue.unshift(t)):n.default.checkFlag("EXIT_SUBSCRIBER_MODE",t.command.name)?u(t.command,e[2])||this.redis.commandQueue.unshift(t):t.command.resolve(e))}handleSubscriberReply(e){if(!this.redis.condition.subscriber)return!1;let t=Array.isArray(e)?e[0].toString():null;switch(o('receive reply "%s" in subscriber mode',t),t){case"message":this.redis.listeners("message").length>0&&this.redis.emit("message",e[1].toString(),e[2]?e[2].toString():""),this.redis.emit("messageBuffer",e[1],e[2]);break;case"pmessage":{let t=e[1].toString();this.redis.listeners("pmessage").length>0&&this.redis.emit("pmessage",t,e[2].toString(),e[3].toString()),this.redis.emit("pmessageBuffer",t,e[2],e[3]);break}case"smessage":this.redis.listeners("smessage").length>0&&this.redis.emit("smessage",e[1].toString(),e[2]?e[2].toString():""),this.redis.emit("smessageBuffer",e[1],e[2]);break;case"ssubscribe":case"subscribe":case"psubscribe":{let r=e[1].toString();this.redis.condition.subscriber.add(t,r);let n=this.shiftCommand(e);if(!n)return;d(n.command,e[2])||this.redis.commandQueue.unshift(n);break}case"sunsubscribe":case"unsubscribe":case"punsubscribe":{let r=e[1]?e[1].toString():null;r&&this.redis.condition.subscriber.del(t,r);let n=e[2];0===Number(n)&&(this.redis.condition.subscriber=!1);let a=this.shiftCommand(e);if(!a)return;u(a.command,n)||this.redis.commandQueue.unshift(a);break}default:{let t=this.shiftCommand(e);if(!t)return;t.command.resolve(e)}}return!0}handleMonitorReply(e){if("monitoring"!==this.redis.status)return!1;let t=e.toString();if("OK"===t)return!1;let r=t.indexOf(" "),n=t.slice(0,r),a=t.indexOf('"'),i=t.slice(a+1,-1).split('" "').map(e=>e.replace(/\\"/g,'"')),s=t.slice(r+2,a-2).split(" ");return this.redis.emit("monitor",n,i,s[1],s[0]),!0}shiftCommand(e){let t=this.redis.commandQueue.shift();if(!t){let t=Error("Command queue state error. If you can reproduce this, please report it."+(e instanceof Error?` Last error: ${e.message}`:` Last reply: ${e.toString()}`));return this.redis.emit("error",t),null}return t}};let l=new WeakMap;function d(e,t){let r=l.has(e)?l.get(e):e.args.length;return(r-=1)<=0?(e.resolve(t),l.delete(e),!0):(l.set(e,r),!1)}function u(e,t){let r=l.has(e)?l.get(e):e.args.length;return 0===r?0===Number(t)&&(l.delete(e),e.resolve(t),!0):(r-=1)<=0?(e.resolve(t),!0):(l.set(e,r),!1)}},45247,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.readyHandler=r.errorHandler=r.closeHandler=r.connectHandler=void 0;let n=e.r(63227),a=e.r(30846),i=e.r(88060),s=e.r(26898),o=e.r(73052),l=(0,s.Debug)("connection");function d(e){let t=new n.AbortError("Command aborted due to connection close");return t.command={name:e.name,args:e.args},t}r.connectHandler=function(e){return function(){var t;e.setStatus("connect"),e.resetCommandQueue();let n=!1,{connectionEpoch:a}=e;e.condition.auth&&e.auth(e.condition.auth,function(t){a===e.connectionEpoch&&t&&(-1!==t.message.indexOf("no password is set")?console.warn("[WARN] Redis server does not require a password, but a password was supplied."):-1!==t.message.indexOf("without any password configured for the default user")?console.warn("[WARN] This Redis server's `default` user does not require a password, but a password was supplied"):-1!==t.message.indexOf("wrong number of arguments for 'auth' command")?console.warn("[ERROR] The server returned \"wrong number of arguments for 'auth' command\". You are probably passing both username and password to Redis version 5 or below. You should only pass the 'password' option for Redis version 5 and under."):(n=!0,e.recoverFromFatalError(t,t)))}),e.condition.select&&e.select(e.condition.select).catch(t=>{e.silentEmit("error",t)}),new o.default(e,{stringNumbers:e.options.stringNumbers});let i=[];e.options.connectionName&&(l("set the connection name [%s]",e.options.connectionName),i.push(e.client("setname",e.options.connectionName).catch(s.noop))),e.options.disableClientInfo||(l("set the client info"),i.push((0,s.getPackageMeta)().then(t=>e.client("SETINFO","LIB-VER",t.version).catch(s.noop)).catch(s.noop)),i.push(e.client("SETINFO","LIB-NAME",(null==(t=e.options)?void 0:t.clientInfoTag)?`ioredis(${e.options.clientInfoTag})`:"ioredis").catch(s.noop))),Promise.all(i).catch(s.noop).finally(()=>{e.options.enableReadyCheck||r.readyHandler(e)(),e.options.enableReadyCheck&&e._readyCheck(function(t,i){a===e.connectionEpoch&&(t?n||e.recoverFromFatalError(Error("Ready check failed: "+t.message),t):e.connector.check(i)?r.readyHandler(e)():e.disconnect(!0))})})}},r.closeHandler=function(e){return function(){let r=e.status;if(e.setStatus("close"),e.commandQueue.length&&function(e){var t;let r=0;for(let n=0;n<e.length;){let a=null==(t=e.peekAt(n))?void 0:t.command,i=a.pipelineIndex;if((void 0===i||0===i)&&(r=0),void 0!==i&&i!==r++){e.remove(n,1),a.reject(d(a));continue}n++}}(e.commandQueue),e.offlineQueue.length&&function(e){var t;for(let r=0;r<e.length;){let n=null==(t=e.peekAt(r))?void 0:t.command;if("multi"===n.name)break;if("exec"===n.name){e.remove(r,1),n.reject(d(n));break}n.inTransaction?(e.remove(r,1),n.reject(d(n))):r++}}(e.offlineQueue),"ready"===r&&(e.prevCondition||(e.prevCondition=e.condition),e.commandQueue.length&&(e.prevCommandQueue=e.commandQueue)),e.manuallyClosing)return e.manuallyClosing=!1,l("skip reconnecting since the connection is manually closed."),t();if("function"!=typeof e.options.retryStrategy)return l("skip reconnecting because `retryStrategy` is not a function"),t();let n=e.options.retryStrategy(++e.retryAttempts);if("number"!=typeof n)return l("skip reconnecting because `retryStrategy` doesn't return a number"),t();l("reconnect in %sms",n),e.setStatus("reconnecting",n),e.reconnectTimeout=setTimeout(function(){e.reconnectTimeout=null,e.connect().catch(s.noop)},n);let{maxRetriesPerRequest:a}=e.options;"number"==typeof a&&(a<0?l("maxRetriesPerRequest is negative, ignoring..."):0==e.retryAttempts%(a+1)&&(l("reach maxRetriesPerRequest limitation, flushing command queue..."),e.flushQueue(new i.MaxRetriesPerRequestError(a))))};function t(){e.setStatus("end"),e.flushQueue(Error(s.CONNECTION_CLOSED_ERROR_MSG))}},r.errorHandler=function(e){return function(t){l("error: %s",t),e.silentEmit("error",t)}},r.readyHandler=function(e){return function(){if(e.setStatus("ready"),e.retryAttempts=0,e.options.monitor){e.call("monitor").then(()=>e.setStatus("monitoring"),t=>e.emit("error",t));let{sendCommand:t}=e;e.sendCommand=function(r){return a.default.checkFlag("VALID_IN_MONITOR_MODE",r.name)?t.call(e,r):(r.reject(Error("Connection is in monitoring mode, can't process commands.")),r.promise)},e.once("close",function(){delete e.sendCommand});return}let t=e.prevCondition?e.prevCondition.select:e.condition.select;if(e.options.readOnly&&(l("set the connection to readonly mode"),e.readonly().catch(s.noop)),e.prevCondition){let r=e.prevCondition;if(e.prevCondition=null,r.subscriber&&e.options.autoResubscribe){e.condition.select!==t&&(l("connect to db [%d]",t),e.select(t));let n=r.subscriber.channels("subscribe");n.length&&(l("subscribe %d channels",n.length),e.subscribe(n));let a=r.subscriber.channels("psubscribe");a.length&&(l("psubscribe %d channels",a.length),e.psubscribe(a));let i=r.subscriber.channels("ssubscribe");if(i.length)for(let t of(l("ssubscribe %s",i.length),i))e.ssubscribe(t)}}if(e.prevCommandQueue)if(e.options.autoResendUnfulfilledCommands)for(l("resend %d unfulfilled commands",e.prevCommandQueue.length);e.prevCommandQueue.length>0;){let t=e.prevCommandQueue.shift();t.select!==e.condition.select&&"select"!==t.command.name&&e.select(t.select),e.sendCommand(t.command,t.stream)}else e.prevCommandQueue=null;if(e.offlineQueue.length){l("send %d commands in offline queue",e.offlineQueue.length);let t=e.offlineQueue;for(e.resetOfflineQueue();t.length>0;){let r=t.shift();r.select!==e.condition.select&&"select"!==r.command.name&&e.select(r.select),e.sendCommand(r.command,r.stream)}}e.condition.select!==t&&(l("connect to db [%d]",t),e.select(t))}}},77143,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.DEFAULT_REDIS_OPTIONS=void 0,r.DEFAULT_REDIS_OPTIONS={port:6379,host:"localhost",family:0,connectTimeout:1e4,disconnectTimeout:2e3,retryStrategy:function(e){return Math.min(50*e,2e3)},keepAlive:0,noDelay:!0,connectionName:null,disableClientInfo:!1,clientInfoTag:void 0,sentinels:null,name:null,role:"master",sentinelRetryStrategy:function(e){return Math.min(10*e,1e3)},sentinelReconnectStrategy:function(){return 6e4},natMap:null,enableTLSForSentinelMode:!1,updateSentinels:!0,failoverDetector:!1,username:null,password:null,db:0,enableOfflineQueue:!0,enableReadyCheck:!0,autoResubscribe:!0,autoResendUnfulfilledCommands:!0,lazyConnect:!1,keyPrefix:"",reconnectOnError:null,readOnly:!1,stringNumbers:!1,maxRetriesPerRequest:20,maxLoadingRetryTime:1e4,enableAutoPipelining:!1,autoPipeliningIgnoredCommands:[],sentinelMaxConnections:10,blockingTimeoutGrace:100}},66735,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});let n=e.r(12522),a=e.r(27699),i=e.r(19335),s=e.r(83252),o=e.r(30846),l=e.r(18652),d=e.r(77420),u=e.r(45247),c=e.r(77143),p=e.r(12749),h=e.r(3422),y=e.r(26898),m=e.r(62819),f=e.r(57674),b=e.r(67061),g=e.r(57517),K=e.r(89977),v=(0,y.Debug)("redis");class S extends b.default{constructor(e,t,r){if(super(),this.status="wait",this.isCluster=!1,this.reconnectTimeout=null,this.connectionEpoch=0,this.retryAttempts=0,this.manuallyClosing=!1,this._autoPipelines=new Map,this._runningAutoPipelines=new Set,this.parseOptions(e,t,r),a.EventEmitter.call(this),this.resetCommandQueue(),this.resetOfflineQueue(),this.options.Connector)this.connector=new this.options.Connector(this.options);else if(this.options.sentinels){const e=new d.default(this.options);e.emitter=this,this.connector=e}else this.connector=new l.StandaloneConnector(this.options);this.options.scripts&&Object.entries(this.options.scripts).forEach(([e,t])=>{this.defineCommand(e,t)}),this.options.lazyConnect?this.setStatus("wait"):this.connect().catch(g.noop)}static createClient(...e){return new S(...e)}get autoPipelineQueueSize(){let e=0;for(let t of this._autoPipelines.values())e+=t.length;return e}connect(e){let t=(0,m.traceConnect)(()=>this._connect(),()=>{let{address:e,port:t}=this._getServerAddress();return{serverAddress:e,serverPort:t,connectionEpoch:this.connectionEpoch}});return(0,i.default)(t,e)}_connect(){return new Promise((e,t)=>{if("connecting"===this.status||"connect"===this.status||"ready"===this.status)return void t(Error("Redis is already connecting/connected"));this.connectionEpoch+=1,this.setStatus("connecting");let{options:r}=this;this.condition={select:r.db,auth:r.username?[r.username,r.password]:r.password,subscriber:!1};let n=this;(0,i.default)(this.connector.connect(function(e,t){n.silentEmit(e,t)}),function(a,i){if(a){n.flushQueue(a),n.silentEmit("error",a),t(a),n.setStatus("end");return}let s=r.tls?"secureConnect":"connect";if("sentinels"in r&&r.sentinels&&!r.enableTLSForSentinelMode&&(s="connect"),n.stream=i,r.noDelay&&i.setNoDelay(!0),"number"==typeof r.keepAlive&&(i.connecting?i.once(s,()=>{i.setKeepAlive(!0,r.keepAlive)}):i.setKeepAlive(!0,r.keepAlive)),i.connecting){if(i.once(s,u.connectHandler(n)),r.connectTimeout){let e=!1;i.setTimeout(r.connectTimeout,function(){if(e)return;i.setTimeout(0),i.destroy();let t=Error("connect ETIMEDOUT");t.errorno="ETIMEDOUT",t.code="ETIMEDOUT",t.syscall="connect",u.errorHandler(n)(t)}),i.once(s,function(){e=!0,i.setTimeout(0)})}}else if(i.destroyed){let e=n.connector.firstError;e&&process.nextTick(()=>{u.errorHandler(n)(e)}),process.nextTick(u.closeHandler(n))}else process.nextTick(u.connectHandler(n));i.destroyed||(i.once("error",u.errorHandler(n)),i.once("close",u.closeHandler(n)));let o=function(){n.removeListener("close",l),e()};var l=function(){n.removeListener("ready",o),t(Error(y.CONNECTION_CLOSED_ERROR_MSG))};n.once("ready",o),n.once("close",l)})})}disconnect(e=!1){e||(this.manuallyClosing=!0),this.reconnectTimeout&&!e&&(clearTimeout(this.reconnectTimeout),this.reconnectTimeout=null),"wait"===this.status?u.closeHandler(this)():this.connector.disconnect()}end(){this.disconnect()}duplicate(e){return new S({...this.options,...e})}get mode(){var e;return this.options.monitor?"monitor":(null==(e=this.condition)?void 0:e.subscriber)?"subscriber":"normal"}monitor(e){let t=this.duplicate({monitor:!0,lazyConnect:!1});return(0,i.default)(new Promise(function(e,r){t.once("error",r),t.once("monitoring",function(){e(t)})}),e)}sendCommand(e,t){var r,a;if("wait"===this.status&&this.connect().catch(g.noop),"end"===this.status)return e.reject(Error(y.CONNECTION_CLOSED_ERROR_MSG)),e.promise;if((null==(r=this.condition)?void 0:r.subscriber)&&!o.default.checkFlag("VALID_IN_SUBSCRIBER_MODE",e.name))return e.reject(Error("Connection in subscriber mode, only subscriber commands may be used")),e.promise;"number"==typeof this.options.commandTimeout&&e.setTimeout(this.options.commandTimeout);let i=this.getBlockingTimeoutInMs(e),s="ready"===this.status||!t&&"connect"===this.status&&(0,n.exists)(e.name,{caseInsensitive:!0})&&((0,n.hasFlag)(e.name,"loading",{nameCaseInsensitive:!0})||o.default.checkFlag("HANDSHAKE_COMMANDS",e.name));if(this.stream&&this.stream.writable?this.stream._writableState&&this.stream._writableState.ended&&(s=!1):s=!1,s)v.enabled&&v("write command[%s]: %d -> %s(%o)",this._getDescription(),null==(a=this.condition)?void 0:a.select,e.name,e.args),t?"isPipeline"in t&&t.isPipeline?t.write(e.toWritable(t.destination.redis.stream)):t.write(e.toWritable(t)):this.stream.write(e.toWritable(this.stream)),this.commandQueue.push({command:e,stream:t,select:this.condition.select}),void 0!==i&&e.setBlockingTimeout(i),o.default.checkFlag("WILL_DISCONNECT",e.name)&&(this.manuallyClosing=!0),void 0!==this.options.socketTimeout&&void 0===this.socketTimeoutTimer&&this.setSocketTimeout();else{if(!this.options.enableOfflineQueue)return e.reject(Error("Stream isn't writeable and enableOfflineQueue options is false")),e.promise;if("quit"===e.name&&0===this.offlineQueue.length)return this.disconnect(),e.resolve(Buffer.from("OK")),e.promise;if(v.enabled&&v("queue command[%s]: %d -> %s(%o)",this._getDescription(),this.condition.select,e.name,e.args),this.offlineQueue.push({command:e,stream:t,select:this.condition.select}),o.default.checkFlag("BLOCKING_COMMANDS",e.name)){let t=this.getConfiguredBlockingTimeout();void 0!==t&&e.setBlockingTimeout(t)}}if("select"===e.name&&(0,y.isInt)(e.args[0])){let t=parseInt(e.args[0],10);this.condition.select!==t&&(this.condition.select=t,this.emit("select",t),v("switch to db [%d]",this.condition.select))}return!s||e.isTraced?e.promise:(e.isTraced=!0,(0,m.traceCommand)(()=>e.promise,()=>this._buildCommandContext(e)))}getBlockingTimeoutInMs(e){var t;if(!o.default.checkFlag("BLOCKING_COMMANDS",e.name))return;let r=this.getConfiguredBlockingTimeout();if(void 0===r)return;let n=e.extractBlockingTimeout();return"number"==typeof n?n>0?n+(null!=(t=this.options.blockingTimeoutGrace)?t:c.DEFAULT_REDIS_OPTIONS.blockingTimeoutGrace):r:null===n?r:void 0}getConfiguredBlockingTimeout(){if("number"==typeof this.options.blockingTimeout&&this.options.blockingTimeout>0)return this.options.blockingTimeout}setSocketTimeout(){this.socketTimeoutTimer=setTimeout(()=>{this.stream.destroy(Error(`Socket timeout. Expecting data, but didn't receive any in ${this.options.socketTimeout}ms.`)),this.socketTimeoutTimer=void 0},this.options.socketTimeout),this.stream.once("data",()=>{clearTimeout(this.socketTimeoutTimer),this.socketTimeoutTimer=void 0,0!==this.commandQueue.length&&this.setSocketTimeout()})}scanStream(e){return this.createScanStream("scan",{options:e})}scanBufferStream(e){return this.createScanStream("scanBuffer",{options:e})}sscanStream(e,t){return this.createScanStream("sscan",{key:e,options:t})}sscanBufferStream(e,t){return this.createScanStream("sscanBuffer",{key:e,options:t})}hscanStream(e,t){return this.createScanStream("hscan",{key:e,options:t})}hscanBufferStream(e,t){return this.createScanStream("hscanBuffer",{key:e,options:t})}zscanStream(e,t){return this.createScanStream("zscan",{key:e,options:t})}zscanBufferStream(e,t){return this.createScanStream("zscanBuffer",{key:e,options:t})}silentEmit(e,t){let r;if("error"!==e||(r=t,"end"!==this.status&&(!this.manuallyClosing||!(r instanceof Error)||r.message!==y.CONNECTION_CLOSED_ERROR_MSG&&"connect"!==r.syscall&&"read"!==r.syscall)))return this.listeners(e).length>0?this.emit.apply(this,arguments):(r&&r instanceof Error&&console.error("[ioredis] Unhandled error event:",r.stack),!1)}recoverFromFatalError(e,t,r){this.flushQueue(t,r),this.silentEmit("error",t),this.disconnect(!0)}handleReconnection(e,t){var r;let n=!1;switch(this.options.reconnectOnError&&!o.default.checkFlag("IGNORE_RECONNECT_ON_ERROR",t.command.name)&&(n=this.options.reconnectOnError(e)),n){case 1:case!0:"reconnecting"!==this.status&&this.disconnect(!0),t.command.reject(e);break;case 2:"reconnecting"!==this.status&&this.disconnect(!0),(null==(r=this.condition)?void 0:r.select)!==t.select&&"select"!==t.command.name&&this.select(t.select),this.sendCommand(t.command);break;default:t.command.reject(e)}}_getServerAddress(){return"path"in this.options&&this.options.path?{address:this.options.path,port:void 0}:{address:"host"in this.options&&this.options.host||"localhost",port:"port"in this.options&&this.options.port||6379}}_buildCommandContext(e){var t,r,n;let{address:a,port:i}=this._getServerAddress();return{command:e.name,args:(0,m.sanitizeArgs)(e.name,e.args),database:null!=(n=null!=(r=null==(t=this.condition)?void 0:t.select)?r:this.options.db)?n:0,serverAddress:a,serverPort:i}}_buildBatchContext(e){var t,r,n;let{address:a,port:i}=this._getServerAddress();return{batchMode:"MULTI",batchSize:e,database:null!=(n=null!=(r=null==(t=this.condition)?void 0:t.select)?r:this.options.db)?n:0,serverAddress:a,serverPort:i}}_getDescription(){let e;return e="path"in this.options&&this.options.path?this.options.path:this.stream&&this.stream.remoteAddress&&this.stream.remotePort?this.stream.remoteAddress+":"+this.stream.remotePort:"host"in this.options&&this.options.host?this.options.host+":"+this.options.port:"",this.options.connectionName&&(e+=` (${this.options.connectionName})`),e}resetCommandQueue(){this.commandQueue=new K}resetOfflineQueue(){this.offlineQueue=new K}parseOptions(...e){let t={},r=!1;for(let n=0;n<e.length;++n){let a=e[n];if(null!=a)if("object"==typeof a)(0,g.defaults)(t,a);else if("string"==typeof a)(0,g.defaults)(t,(0,y.parseURL)(a)),a.startsWith("rediss://")&&(r=!0);else if("number"==typeof a)t.port=a;else throw Error("Invalid argument "+a)}r&&(0,g.defaults)(t,{tls:!0}),(0,g.defaults)(t,S.defaultOptions),"string"==typeof t.port&&(t.port=parseInt(t.port,10)),"string"==typeof t.db&&(t.db=parseInt(t.db,10)),this.options=(0,y.resolveTLSProfile)(t)}setStatus(e,t){v.enabled&&v("status[%s]: %s -> %s",this._getDescription(),this.status||"[empty]",e),this.status=e,process.nextTick(this.emit.bind(this,e,t))}createScanStream(e,{key:t,options:r={}}){return new p.default({objectMode:!0,key:t,redis:this,command:e,...r})}flushQueue(e,t){let r;if((t=(0,g.defaults)({},t,{offlineQueue:!0,commandQueue:!0})).offlineQueue)for(;r=this.offlineQueue.shift();)r.command.reject(e);if(t.commandQueue&&this.commandQueue.length>0)for(this.stream&&this.stream.removeAllListeners("data");r=this.commandQueue.shift();)r.command.reject(e)}_readyCheck(e){let t=this;this.info(function(r,n){if(r)return r.message&&r.message.includes("NOPERM")?(console.warn(`Skipping the ready check because INFO command fails: "${r.message}". You can disable ready check with "enableReadyCheck". More: https://github.com/luin/ioredis/wiki/Disable-ready-check.`),e(null,{})):e(r);if("string"!=typeof n)return e(null,n);let a={},i=n.split("\r\n");for(let e=0;e<i.length;++e){let[t,...r]=i[e].split(":"),n=r.join(":");n&&(a[t]=n)}if(a.loading&&"0"!==a.loading){let r=1e3*(a.loading_eta_seconds||1),n=t.options.maxLoadingRetryTime&&t.options.maxLoadingRetryTime<r?t.options.maxLoadingRetryTime:r;v("Redis server still loading, trying again in "+n+"ms"),setTimeout(function(){t._readyCheck(e)},n)}else e(null,a)}).catch(g.noop)}}S.Cluster=s.default,S.Command=o.default,S.defaultOptions=c.DEFAULT_REDIS_OPTIONS,(0,f.default)(S,a.EventEmitter),(0,h.addTransactionSupport)(S.prototype),r.default=S},42512,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.print=r.ReplyError=r.SentinelIterator=r.SentinelConnector=r.AbstractConnector=r.Pipeline=r.ScanStream=r.Command=r.Cluster=r.Redis=r.default=void 0,r=t.exports=e.r(66735).default;var n=e.r(66735);Object.defineProperty(r,"default",{enumerable:!0,get:function(){return n.default}});var a=e.r(66735);Object.defineProperty(r,"Redis",{enumerable:!0,get:function(){return a.default}});var i=e.r(83252);Object.defineProperty(r,"Cluster",{enumerable:!0,get:function(){return i.default}});var s=e.r(30846);Object.defineProperty(r,"Command",{enumerable:!0,get:function(){return s.default}});var o=e.r(12749);Object.defineProperty(r,"ScanStream",{enumerable:!0,get:function(){return o.default}});var l=e.r(6135);Object.defineProperty(r,"Pipeline",{enumerable:!0,get:function(){return l.default}});var d=e.r(58451);Object.defineProperty(r,"AbstractConnector",{enumerable:!0,get:function(){return d.default}});var u=e.r(77420);Object.defineProperty(r,"SentinelConnector",{enumerable:!0,get:function(){return u.default}}),Object.defineProperty(r,"SentinelIterator",{enumerable:!0,get:function(){return u.SentinelIterator}}),r.ReplyError=e.r(63227).ReplyError,Object.defineProperty(r,"Promise",{get:()=>(console.warn("ioredis v5 does not support plugging third-party Promise library anymore. Native Promise will be used."),Promise),set(e){console.warn("ioredis v5 does not support plugging third-party Promise library anymore. Native Promise will be used.")}}),r.print=function(e,t){e?console.log("Error: "+e):console.log("Reply: "+t)}},95057,(e,t,r)=>{"use strict";let n;Object.defineProperty(r,"__esModule",{value:!0});class a extends Error{}class i extends a{constructor(e){super(`Invalid DateTime: ${e.toMessage()}`)}}class s extends a{constructor(e){super(`Invalid Interval: ${e.toMessage()}`)}}class o extends a{constructor(e){super(`Invalid Duration: ${e.toMessage()}`)}}class l extends a{}class d extends a{constructor(e){super(`Invalid unit ${e}`)}}class u extends a{}class c extends a{constructor(){super("Zone is an abstract class")}}let p="numeric",h="short",y="long",m={year:p,month:p,day:p},f={year:p,month:h,day:p},b={year:p,month:h,day:p,weekday:h},g={year:p,month:y,day:p},K={year:p,month:y,day:p,weekday:y},v={hour:p,minute:p},S={hour:p,minute:p,second:p},E={hour:p,minute:p,second:p,timeZoneName:h},I={hour:p,minute:p,second:p,timeZoneName:y},k={hour:p,minute:p,hourCycle:"h23"},w={hour:p,minute:p,second:p,hourCycle:"h23"},j={hour:p,minute:p,second:p,hourCycle:"h23",timeZoneName:h},x={hour:p,minute:p,second:p,hourCycle:"h23",timeZoneName:y},A={year:p,month:p,day:p,hour:p,minute:p},T={year:p,month:p,day:p,hour:p,minute:p,second:p},D={year:p,month:h,day:p,hour:p,minute:p},C={year:p,month:h,day:p,hour:p,minute:p,second:p},O={year:p,month:h,day:p,weekday:h,hour:p,minute:p},R={year:p,month:y,day:p,hour:p,minute:p,timeZoneName:h},M={year:p,month:y,day:p,hour:p,minute:p,second:p,timeZoneName:h},P={year:p,month:y,day:p,weekday:y,hour:p,minute:p,timeZoneName:y},N={year:p,month:y,day:p,weekday:y,hour:p,minute:p,second:p,timeZoneName:y};class J{get type(){throw new c}get name(){throw new c}get ianaName(){return this.name}get isUniversal(){throw new c}offsetName(e,t){throw new c}formatOffset(e,t){throw new c}offset(e){throw new c}equals(e){throw new c}get isValid(){throw new c}}let L=null;class _ extends J{static get instance(){return null===L&&(L=new _),L}get type(){return"system"}get name(){return new Intl.DateTimeFormat().resolvedOptions().timeZone}get isUniversal(){return!1}offsetName(e,{format:t,locale:r}){return e4(e,t,r)}formatOffset(e,t){return e9(this.offset(e),t)}offset(e){return-new Date(e).getTimezoneOffset()}equals(e){return"system"===e.type}get isValid(){return!0}}let F=new Map,q={year:0,month:1,day:2,era:3,hour:4,minute:5,second:6},G=new Map;class V extends J{static create(e){let t=G.get(e);return void 0===t&&G.set(e,t=new V(e)),t}static resetCache(){G.clear(),F.clear()}static isValidSpecifier(e){return this.isValidZone(e)}static isValidZone(e){if(!e)return!1;try{return new Intl.DateTimeFormat("en-US",{timeZone:e}).format(),!0}catch(e){return!1}}constructor(e){super(),this.zoneName=e,this.valid=V.isValidZone(e)}get type(){return"iana"}get name(){return this.zoneName}get isUniversal(){return!1}offsetName(e,{format:t,locale:r}){return e4(e,t,r,this.name)}formatOffset(e,t){return e9(this.offset(e),t)}offset(e){var t;let r;if(!this.valid)return NaN;let n=new Date(e);if(isNaN(n))return NaN;let a=(t=this.name,void 0===(r=F.get(t))&&(r=new Intl.DateTimeFormat("en-US",{hour12:!1,timeZone:t,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",era:"short"}),F.set(t,r)),r),[i,s,o,l,d,u,c]=a.formatToParts?function(e,t){let r=e.formatToParts(t),n=[];for(let e=0;e<r.length;e++){let{type:t,value:a}=r[e],i=q[t];"era"===t?n[i]=a:eJ(i)||(n[i]=parseInt(a,10))}return n}(a,n):function(e,t){let r=e.format(t).replace(/\u200E/g,""),[,n,a,i,s,o,l,d]=/(\d+)\/(\d+)\/(\d+) (AD|BC),? (\d+):(\d+):(\d+)/.exec(r);return[i,n,a,s,o,l,d]}(a,n);"BC"===l&&(i=-Math.abs(i)+1);let p=e0({year:i,month:s,day:o,hour:24===d?0:d,minute:u,second:c,millisecond:0}),h=+n,y=h%1e3;return(p-(h-=y>=0?y:1e3+y))/6e4}equals(e){return"iana"===e.type&&e.name===this.name}get isValid(){return this.valid}}let Y={},B=new Map;function z(e,t={}){let r=JSON.stringify([e,t]),n=B.get(r);return void 0===n&&(n=new Intl.DateTimeFormat(e,t),B.set(r,n)),n}let U=new Map,W=new Map,H=null,$=new Map;function Q(e){let t=$.get(e);return void 0===t&&(t=new Intl.DateTimeFormat(e).resolvedOptions(),$.set(e,t)),t}let Z=new Map;function X(e,t,r,n){let a=e.listingMode();return"error"===a?null:"en"===a?r(t):n(t)}class ee{constructor(e,t,r){this.padTo=r.padTo||0,this.floor=r.floor||!1;const{padTo:n,floor:a,...i}=r;if(!t||Object.keys(i).length>0){const t={useGrouping:!1,...r};r.padTo>0&&(t.minimumIntegerDigits=r.padTo),this.inf=function(e,t={}){let r=JSON.stringify([e,t]),n=U.get(r);return void 0===n&&(n=new Intl.NumberFormat(e,t),U.set(r,n)),n}(e,t)}}format(e){if(!this.inf)return ez(this.floor?Math.floor(e):e$(e,3),this.padTo);{let t=this.floor?Math.floor(e):e;return this.inf.format(t)}}}class et{constructor(e,t,r){let n;if(this.opts=r,this.originalZone=void 0,this.opts.timeZone)this.dt=e;else if("fixed"===e.zone.type){const t=-1*(e.offset/60),r=t>=0?`Etc/GMT+${t}`:`Etc/GMT${t}`;0!==e.offset&&V.create(r).valid?(n=r,this.dt=e):(n="UTC",this.dt=0===e.offset?e:e.setZone("UTC").plus({minutes:e.offset}),this.originalZone=e.zone)}else"system"===e.zone.type?this.dt=e:"iana"===e.zone.type?(this.dt=e,n=e.zone.name):(n="UTC",this.dt=e.setZone("UTC").plus({minutes:e.offset}),this.originalZone=e.zone);const a={...this.opts};a.timeZone=a.timeZone||n,this.dtf=z(t,a)}format(){return this.originalZone?this.formatToParts().map(({value:e})=>e).join(""):this.dtf.format(this.dt.toJSDate())}formatToParts(){let e=this.dtf.formatToParts(this.dt.toJSDate());return this.originalZone?e.map(e=>{if("timeZoneName"!==e.type)return e;{let t=this.originalZone.offsetName(this.dt.ts,{locale:this.dt.locale,format:this.opts.timeZoneName});return{...e,value:t}}}):e}resolvedOptions(){return this.dtf.resolvedOptions()}}class er{constructor(e,t,r){this.opts={style:"long",...r},!t&&eF()&&(this.rtf=function(e,t={}){let{base:r,...n}=t,a=JSON.stringify([e,n]),i=W.get(a);return void 0===i&&(i=new Intl.RelativeTimeFormat(e,t),W.set(a,i)),i}(e,r))}format(e,t){return this.rtf?this.rtf.format(e,t):function(e,t,r="always",n=!1){let a={years:["year","yr."],quarters:["quarter","qtr."],months:["month","mo."],weeks:["week","wk."],days:["day","day","days"],hours:["hour","hr."],minutes:["minute","min."],seconds:["second","sec."]},i=-1===["hours","minutes","seconds"].indexOf(e);if("auto"===r&&i){let r="days"===e;switch(t){case 1:return r?"tomorrow":`next ${a[e][0]}`;case -1:return r?"yesterday":`last ${a[e][0]}`;case 0:return r?"today":`this ${a[e][0]}`}}let s=Object.is(t,-0)||t<0,o=Math.abs(t),l=1===o,d=a[e],u=n?l?d[1]:d[2]||d[1]:l?a[e][0]:e;return s?`${o} ${u} ago`:`in ${o} ${u}`}(t,e,this.opts.numeric,"long"!==this.opts.style)}formatToParts(e,t){return this.rtf?this.rtf.formatToParts(e,t):[]}}let en={firstDay:1,minimalDays:4,weekend:[6,7]};class ea{static fromOpts(e){return ea.create(e.locale,e.numberingSystem,e.outputCalendar,e.weekSettings,e.defaultToEN)}static create(e,t,r,n,a=!1){let i=e||eE.defaultLocale;return new ea(i||(a?"en-US":H||(H=new Intl.DateTimeFormat().resolvedOptions().locale)),t||eE.defaultNumberingSystem,r||eE.defaultOutputCalendar,eY(n)||eE.defaultWeekSettings,i)}static resetCache(){H=null,B.clear(),U.clear(),W.clear(),$.clear(),Z.clear()}static fromObject({locale:e,numberingSystem:t,outputCalendar:r,weekSettings:n}={}){return ea.create(e,t,r,n)}constructor(e,t,r,n,a){const[i,s,o]=function(e){let t=e.indexOf("-x-");-1!==t&&(e=e.substring(0,t));let r=e.indexOf("-u-");if(-1===r)return[e];{let t,n;try{t=z(e).resolvedOptions(),n=e}catch(i){let a=e.substring(0,r);t=z(a).resolvedOptions(),n=a}let{numberingSystem:a,calendar:i}=t;return[n,a,i]}}(e);this.locale=i,this.numberingSystem=t||s||null,this.outputCalendar=r||o||null,this.weekSettings=n,this.intl=function(e,t,r){return(r||t)&&(e.includes("-u-")||(e+="-u"),r&&(e+=`-ca-${r}`),t&&(e+=`-nu-${t}`)),e}(this.locale,this.numberingSystem,this.outputCalendar),this.weekdaysCache={format:{},standalone:{}},this.monthsCache={format:{},standalone:{}},this.meridiemCache=null,this.eraCache={},this.specifiedLocale=a,this.fastNumbersCached=null}get fastNumbers(){return null==this.fastNumbersCached&&(this.fastNumbersCached=(!this.numberingSystem||"latn"===this.numberingSystem)&&("latn"===this.numberingSystem||!this.locale||this.locale.startsWith("en")||"latn"===Q(this.locale).numberingSystem)),this.fastNumbersCached}listingMode(){let e=this.isEnglish(),t=(null===this.numberingSystem||"latn"===this.numberingSystem)&&(null===this.outputCalendar||"gregory"===this.outputCalendar);return e&&t?"en":"intl"}clone(e){return e&&0!==Object.getOwnPropertyNames(e).length?ea.create(e.locale||this.specifiedLocale,e.numberingSystem||this.numberingSystem,e.outputCalendar||this.outputCalendar,eY(e.weekSettings)||this.weekSettings,e.defaultToEN||!1):this}redefaultToEN(e={}){return this.clone({...e,defaultToEN:!0})}redefaultToSystem(e={}){return this.clone({...e,defaultToEN:!1})}months(e,t=!1){return X(this,e,tn,()=>{let r="ja"===this.intl||this.intl.startsWith("ja-"),n=(t&=!r)?{month:e,day:"numeric"}:{month:e},a=t?"format":"standalone";if(!this.monthsCache[a][e]){let t=r?e=>this.dtFormatter(e,n).format():e=>this.extract(e,n,"month");this.monthsCache[a][e]=function(e){let t=[];for(let r=1;r<=12;r++){let n=rW.utc(2009,r,1);t.push(e(n))}return t}(t)}return this.monthsCache[a][e]})}weekdays(e,t=!1){return X(this,e,to,()=>{let r=t?{weekday:e,year:"numeric",month:"long",day:"numeric"}:{weekday:e},n=t?"format":"standalone";return this.weekdaysCache[n][e]||(this.weekdaysCache[n][e]=function(e){let t=[];for(let r=1;r<=7;r++){let n=rW.utc(2016,11,13+r);t.push(e(n))}return t}(e=>this.extract(e,r,"weekday"))),this.weekdaysCache[n][e]})}meridiems(){return X(this,void 0,()=>tl,()=>{if(!this.meridiemCache){let e={hour:"numeric",hourCycle:"h12"};this.meridiemCache=[rW.utc(2016,11,13,9),rW.utc(2016,11,13,19)].map(t=>this.extract(t,e,"dayperiod"))}return this.meridiemCache})}eras(e){return X(this,e,tp,()=>{let t={era:e};return this.eraCache[e]||(this.eraCache[e]=[rW.utc(-40,1,1),rW.utc(2017,1,1)].map(e=>this.extract(e,t,"era"))),this.eraCache[e]})}extract(e,t,r){let n=this.dtFormatter(e,t).formatToParts().find(e=>e.type.toLowerCase()===r);return n?n.value:null}numberFormatter(e={}){return new ee(this.intl,e.forceSimple||this.fastNumbers,e)}dtFormatter(e,t={}){return new et(e,this.intl,t)}relFormatter(e={}){return new er(this.intl,this.isEnglish(),e)}listFormatter(e={}){return function(e,t={}){let r=JSON.stringify([e,t]),n=Y[r];return n||(n=new Intl.ListFormat(e,t),Y[r]=n),n}(this.intl,e)}isEnglish(){return"en"===this.locale||"en-us"===this.locale.toLowerCase()||Q(this.intl).locale.startsWith("en-us")}getWeekSettings(){if(this.weekSettings)return this.weekSettings;if(!eq())return en;var e=this.locale;let t=Z.get(e);if(!t){let r=new Intl.Locale(e);"minimalDays"in(t="getWeekInfo"in r?r.getWeekInfo():r.weekInfo)||(t={...en,...t}),Z.set(e,t)}return t}getStartOfWeek(){return this.getWeekSettings().firstDay}getMinDaysInFirstWeek(){return this.getWeekSettings().minimalDays}getWeekendDays(){return this.getWeekSettings().weekend}equals(e){return this.locale===e.locale&&this.numberingSystem===e.numberingSystem&&this.outputCalendar===e.outputCalendar}toString(){return`Locale(${this.locale}, ${this.numberingSystem}, ${this.outputCalendar})`}}let ei=null;class es extends J{static get utcInstance(){return null===ei&&(ei=new es(0)),ei}static instance(e){return 0===e?es.utcInstance:new es(e)}static parseSpecifier(e){if(e){let t=e.match(/^utc(?:([+-]\d{1,2})(?::(\d{2}))?)?$/i);if(t)return new es(e6(t[1],t[2]))}return null}constructor(e){super(),this.fixed=e}get type(){return"fixed"}get name(){return 0===this.fixed?"UTC":`UTC${e9(this.fixed,"narrow")}`}get ianaName(){return 0===this.fixed?"Etc/UTC":`Etc/GMT${e9(-this.fixed,"narrow")}`}offsetName(){return this.name}formatOffset(e,t){return e9(this.fixed,t)}get isUniversal(){return!0}offset(){return this.fixed}equals(e){return"fixed"===e.type&&e.fixed===this.fixed}get isValid(){return!0}}class eo extends J{constructor(e){super(),this.zoneName=e}get type(){return"invalid"}get name(){return this.zoneName}get isUniversal(){return!1}offsetName(){return null}formatOffset(){return""}offset(){return NaN}equals(){return!1}get isValid(){return!1}}function el(e,t){if(eJ(e)||null===e)return t;if(e instanceof J)return e;if("string"==typeof e){let r=e.toLowerCase();return"default"===r?t:"local"===r||"system"===r?_.instance:"utc"===r||"gmt"===r?es.utcInstance:es.parseSpecifier(r)||V.create(e)}if(eL(e))return es.instance(e);if("object"==typeof e&&"offset"in e&&"function"==typeof e.offset)return e;else return new eo(e)}let ed={arab:"[٠-٩]",arabext:"[۰-۹]",bali:"[᭐-᭙]",beng:"[০-৯]",deva:"[०-९]",fullwide:"[０-９]",gujr:"[૦-૯]",hanidec:"[〇|一|二|三|四|五|六|七|八|九]",khmr:"[០-៩]",knda:"[೦-೯]",laoo:"[໐-໙]",limb:"[᥆-᥏]",mlym:"[൦-൯]",mong:"[᠐-᠙]",mymr:"[၀-၉]",orya:"[୦-୯]",tamldec:"[௦-௯]",telu:"[౦-౯]",thai:"[๐-๙]",tibt:"[༠-༩]",latn:"\\d"},eu={arab:[1632,1641],arabext:[1776,1785],bali:[6992,7001],beng:[2534,2543],deva:[2406,2415],fullwide:[65296,65303],gujr:[2790,2799],khmr:[6112,6121],knda:[3302,3311],laoo:[3792,3801],limb:[6470,6479],mlym:[3430,3439],mong:[6160,6169],mymr:[4160,4169],orya:[2918,2927],tamldec:[3046,3055],telu:[3174,3183],thai:[3664,3673],tibt:[3872,3881]},ec=ed.hanidec.replace(/[\[|\]]/g,"").split(""),ep=new Map;function eh({numberingSystem:e},t=""){let r=e||"latn",n=ep.get(r);void 0===n&&(n=new Map,ep.set(r,n));let a=n.get(t);return void 0===a&&(a=RegExp(`${ed[r]}${t}`),n.set(t,a)),a}let ey=()=>Date.now(),em="system",ef=null,eb=null,eg=null,eK=60,ev,eS=null;class eE{static get now(){return ey}static set now(e){ey=e}static set defaultZone(e){em=e}static get defaultZone(){return el(em,_.instance)}static get defaultLocale(){return ef}static set defaultLocale(e){ef=e}static get defaultNumberingSystem(){return eb}static set defaultNumberingSystem(e){eb=e}static get defaultOutputCalendar(){return eg}static set defaultOutputCalendar(e){eg=e}static get defaultWeekSettings(){return eS}static set defaultWeekSettings(e){eS=eY(e)}static get twoDigitCutoffYear(){return eK}static set twoDigitCutoffYear(e){eK=e%100}static get throwOnInvalid(){return ev}static set throwOnInvalid(e){ev=e}static resetCaches(){ea.resetCache(),V.resetCache(),rW.resetCache(),ep.clear()}}class eI{constructor(e,t){this.reason=e,this.explanation=t}toMessage(){return this.explanation?`${this.reason}: ${this.explanation}`:this.reason}}let ek=[0,31,59,90,120,151,181,212,243,273,304,334],ew=[0,31,60,91,121,152,182,213,244,274,305,335];function ej(e,t){return new eI("unit out of range",`you specified ${t} (of type ${typeof t}) as a ${e}, which is invalid`)}function ex(e,t,r){let n=new Date(Date.UTC(e,t-1,r));e<100&&e>=0&&n.setUTCFullYear(n.getUTCFullYear()-1900);let a=n.getUTCDay();return 0===a?7:a}function eA(e,t){let r=eQ(e)?ew:ek,n=r.findIndex(e=>e<t),a=t-r[n];return{month:n+1,day:a}}function eT(e,t){return(e-t+7)%7+1}function eD(e,t=4,r=1){let{year:n,month:a,day:i}=e,s=i+(eQ(n)?ew:ek)[a-1],o=eT(ex(n,a,i),r),l=Math.floor((s-o+14-t)/7),d;return l<1?l=e2(d=n-1,t,r):l>e2(n,t,r)?(d=n+1,l=1):d=n,{weekYear:d,weekNumber:l,weekday:o,...e7(e)}}function eC(e,t=4,r=1){let{weekYear:n,weekNumber:a,weekday:i}=e,s=eT(ex(n,1,t),r),o=eZ(n),l=7*a+i-s-7+t,d;l<1?l+=eZ(d=n-1):l>o?(d=n+1,l-=eZ(n)):d=n;let{month:u,day:c}=eA(d,l);return{year:d,month:u,day:c,...e7(e)}}function eO(e){let{year:t,month:r,day:n}=e,a=n+(eQ(t)?ew:ek)[r-1];return{year:t,ordinal:a,...e7(e)}}function eR(e){let{year:t,ordinal:r}=e,{month:n,day:a}=eA(t,r);return{year:t,month:n,day:a,...e7(e)}}function eM(e,t){if(!(!eJ(e.localWeekday)||!eJ(e.localWeekNumber)||!eJ(e.localWeekYear)))return{minDaysInFirstWeek:4,startOfWeek:1};if(!eJ(e.weekday)||!eJ(e.weekNumber)||!eJ(e.weekYear))throw new l("Cannot mix locale-based week fields with ISO-based week fields");return eJ(e.localWeekday)||(e.weekday=e.localWeekday),eJ(e.localWeekNumber)||(e.weekNumber=e.localWeekNumber),eJ(e.localWeekYear)||(e.weekYear=e.localWeekYear),delete e.localWeekday,delete e.localWeekNumber,delete e.localWeekYear,{minDaysInFirstWeek:t.getMinDaysInFirstWeek(),startOfWeek:t.getStartOfWeek()}}function eP(e){let t=e_(e.year),r=eB(e.month,1,12),n=eB(e.day,1,eX(e.year,e.month));return t?r?!n&&ej("day",e.day):ej("month",e.month):ej("year",e.year)}function eN(e){let{hour:t,minute:r,second:n,millisecond:a}=e,i=eB(t,0,23)||24===t&&0===r&&0===n&&0===a,s=eB(r,0,59),o=eB(n,0,59),l=eB(a,0,999);return i?s?o?!l&&ej("millisecond",a):ej("second",n):ej("minute",r):ej("hour",t)}function eJ(e){return void 0===e}function eL(e){return"number"==typeof e}function e_(e){return"number"==typeof e&&e%1==0}function eF(){try{return"u">typeof Intl&&!!Intl.RelativeTimeFormat}catch(e){return!1}}function eq(){try{return"u">typeof Intl&&!!Intl.Locale&&("weekInfo"in Intl.Locale.prototype||"getWeekInfo"in Intl.Locale.prototype)}catch(e){return!1}}function eG(e,t,r){if(0!==e.length)return e.reduce((e,n)=>{let a=[t(n),n];return e&&r(e[0],a[0])===e[0]?e:a},null)[1]}function eV(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function eY(e){if(null==e)return null;if("object"!=typeof e)throw new u("Week settings must be an object");if(!eB(e.firstDay,1,7)||!eB(e.minimalDays,1,7)||!Array.isArray(e.weekend)||e.weekend.some(e=>!eB(e,1,7)))throw new u("Invalid week settings");return{firstDay:e.firstDay,minimalDays:e.minimalDays,weekend:Array.from(e.weekend)}}function eB(e,t,r){return e_(e)&&e>=t&&e<=r}function ez(e,t=2){return e<0?"-"+(""+-e).padStart(t,"0"):(""+e).padStart(t,"0")}function eU(e){if(!eJ(e)&&null!==e&&""!==e)return parseInt(e,10)}function eW(e){if(!eJ(e)&&null!==e&&""!==e)return parseFloat(e)}function eH(e){if(!eJ(e)&&null!==e&&""!==e)return Math.floor(1e3*parseFloat("0."+e))}function e$(e,t,r="round"){let n=10**t;switch(r){case"expand":return e>0?Math.ceil(e*n)/n:Math.floor(e*n)/n;case"trunc":return Math.trunc(e*n)/n;case"round":return Math.round(e*n)/n;case"floor":return Math.floor(e*n)/n;case"ceil":return Math.ceil(e*n)/n;default:throw RangeError(`Value rounding ${r} is out of range`)}}function eQ(e){return e%4==0&&(e%100!=0||e%400==0)}function eZ(e){return eQ(e)?366:365}function eX(e,t){var r;let n=(r=t-1)-12*Math.floor(r/12)+1;return 2===n?eQ(e+(t-n)/12)?29:28:[31,null,31,30,31,30,31,31,30,31,30,31][n-1]}function e0(e){let t=Date.UTC(e.year,e.month-1,e.day,e.hour,e.minute,e.second,e.millisecond);return e.year<100&&e.year>=0&&(t=new Date(t)).setUTCFullYear(e.year,e.month-1,e.day),+t}function e1(e,t,r){return-eT(ex(e,1,t),r)+t-1}function e2(e,t=4,r=1){let n=e1(e,t,r),a=e1(e+1,t,r);return(eZ(e)-n+a)/7}function e3(e){return e>99?e:e>eE.twoDigitCutoffYear?1900+e:2e3+e}function e4(e,t,r,n=null){let a=new Date(e),i={hourCycle:"h23",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"};n&&(i.timeZone=n);let s={timeZoneName:t,...i},o=new Intl.DateTimeFormat(r,s).formatToParts(a).find(e=>"timezonename"===e.type.toLowerCase());return o?o.value:null}function e6(e,t){let r=parseInt(e,10);Number.isNaN(r)&&(r=0);let n=parseInt(t,10)||0,a=r<0||Object.is(r,-0)?-n:n;return 60*r+a}function e5(e){let t=Number(e);if("boolean"==typeof e||""===e||!Number.isFinite(t))throw new u(`Invalid unit value ${e}`);return t}function e8(e,t){let r={};for(let n in e)if(eV(e,n)){let a=e[n];if(null==a)continue;r[t(n)]=e5(a)}return r}function e9(e,t){let r=Math.trunc(Math.abs(e/60)),n=Math.trunc(Math.abs(e%60)),a=e>=0?"+":"-";switch(t){case"short":return`${a}${ez(r,2)}:${ez(n,2)}`;case"narrow":return`${a}${r}${n>0?`:${n}`:""}`;case"techie":return`${a}${ez(r,2)}${ez(n,2)}`;default:throw RangeError(`Value format ${t} is out of range for property format`)}}function e7(e){return["hour","minute","second","millisecond"].reduce((t,r)=>(t[r]=e[r],t),{})}let te=["January","February","March","April","May","June","July","August","September","October","November","December"],tt=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],tr=["J","F","M","A","M","J","J","A","S","O","N","D"];function tn(e){switch(e){case"narrow":return[...tr];case"short":return[...tt];case"long":return[...te];case"numeric":return["1","2","3","4","5","6","7","8","9","10","11","12"];case"2-digit":return["01","02","03","04","05","06","07","08","09","10","11","12"];default:return null}}let ta=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],ti=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],ts=["M","T","W","T","F","S","S"];function to(e){switch(e){case"narrow":return[...ts];case"short":return[...ti];case"long":return[...ta];case"numeric":return["1","2","3","4","5","6","7"];default:return null}}let tl=["AM","PM"],td=["Before Christ","Anno Domini"],tu=["BC","AD"],tc=["B","A"];function tp(e){switch(e){case"narrow":return[...tc];case"short":return[...tu];case"long":return[...td];default:return null}}function th(e,t){let r="";for(let n of e)n.literal?r+=n.val:r+=t(n.val);return r}let ty={D:m,DD:f,DDD:g,DDDD:K,t:v,tt:S,ttt:E,tttt:I,T:k,TT:w,TTT:j,TTTT:x,f:A,ff:D,fff:R,ffff:P,F:T,FF:C,FFF:M,FFFF:N};class tm{static create(e,t={}){return new tm(e,t)}static parseFormat(e){let t=null,r="",n=!1,a=[];for(let i=0;i<e.length;i++){let s=e.charAt(i);"'"===s?((r.length>0||n)&&a.push({literal:n||/^\s+$/.test(r),val:""===r?"'":r}),t=null,r="",n=!n):n||s===t?r+=s:(r.length>0&&a.push({literal:/^\s+$/.test(r),val:r}),r=s,t=s)}return r.length>0&&a.push({literal:n||/^\s+$/.test(r),val:r}),a}static macroTokenToFormatOpts(e){return ty[e]}constructor(e,t){this.opts=t,this.loc=e,this.systemLoc=null}formatWithSystemDefault(e,t){return null===this.systemLoc&&(this.systemLoc=this.loc.redefaultToSystem()),this.systemLoc.dtFormatter(e,{...this.opts,...t}).format()}dtFormatter(e,t={}){return this.loc.dtFormatter(e,{...this.opts,...t})}formatDateTime(e,t){return this.dtFormatter(e,t).format()}formatDateTimeParts(e,t){return this.dtFormatter(e,t).formatToParts()}formatInterval(e,t){return this.dtFormatter(e.start,t).dtf.formatRange(e.start.toJSDate(),e.end.toJSDate())}resolvedOptions(e,t){return this.dtFormatter(e,t).resolvedOptions()}num(e,t=0,r){if(this.opts.forceSimple)return ez(e,t);let n={...this.opts};return t>0&&(n.padTo=t),r&&(n.signDisplay=r),this.loc.numberFormatter(n).format(e)}formatDateTimeFromString(e,t){let r="en"===this.loc.listingMode(),n=this.loc.outputCalendar&&"gregory"!==this.loc.outputCalendar,a=(t,r)=>this.loc.extract(e,t,r),i=t=>e.isOffsetFixed&&0===e.offset&&t.allowZ?"Z":e.isValid?e.zone.formatOffset(e.ts,t.format):"",s=(t,n)=>r?tn(t)[e.month-1]:a(n?{month:t}:{month:t,day:"numeric"},"month"),o=(t,n)=>r?to(t)[e.weekday-1]:a(n?{weekday:t}:{weekday:t,month:"long",day:"numeric"},"weekday"),l=t=>{let r=tm.macroTokenToFormatOpts(t);return r?this.formatWithSystemDefault(e,r):t},d=t=>r?tp(t)[e.year<0?0:1]:a({era:t},"era"),u=t=>{switch(t){case"S":return this.num(e.millisecond);case"u":case"SSS":return this.num(e.millisecond,3);case"s":return this.num(e.second);case"ss":return this.num(e.second,2);case"uu":return this.num(Math.floor(e.millisecond/10),2);case"uuu":return this.num(Math.floor(e.millisecond/100));case"m":return this.num(e.minute);case"mm":return this.num(e.minute,2);case"h":return this.num(e.hour%12==0?12:e.hour%12);case"hh":return this.num(e.hour%12==0?12:e.hour%12,2);case"H":return this.num(e.hour);case"HH":return this.num(e.hour,2);case"Z":return i({format:"narrow",allowZ:this.opts.allowZ});case"ZZ":return i({format:"short",allowZ:this.opts.allowZ});case"ZZZ":return i({format:"techie",allowZ:this.opts.allowZ});case"ZZZZ":return e.zone.offsetName(e.ts,{format:"short",locale:this.loc.locale});case"ZZZZZ":return e.zone.offsetName(e.ts,{format:"long",locale:this.loc.locale});case"z":return e.zoneName;case"a":return r?tl[e.hour<12?0:1]:a({hour:"numeric",hourCycle:"h12"},"dayperiod");case"d":return n?a({day:"numeric"},"day"):this.num(e.day);case"dd":return n?a({day:"2-digit"},"day"):this.num(e.day,2);case"c":case"E":return this.num(e.weekday);case"ccc":return o("short",!0);case"cccc":return o("long",!0);case"ccccc":return o("narrow",!0);case"EEE":return o("short",!1);case"EEEE":return o("long",!1);case"EEEEE":return o("narrow",!1);case"L":return n?a({month:"numeric",day:"numeric"},"month"):this.num(e.month);case"LL":return n?a({month:"2-digit",day:"numeric"},"month"):this.num(e.month,2);case"LLL":return s("short",!0);case"LLLL":return s("long",!0);case"LLLLL":return s("narrow",!0);case"M":return n?a({month:"numeric"},"month"):this.num(e.month);case"MM":return n?a({month:"2-digit"},"month"):this.num(e.month,2);case"MMM":return s("short",!1);case"MMMM":return s("long",!1);case"MMMMM":return s("narrow",!1);case"y":return n?a({year:"numeric"},"year"):this.num(e.year);case"yy":return n?a({year:"2-digit"},"year"):this.num(e.year.toString().slice(-2),2);case"yyyy":return n?a({year:"numeric"},"year"):this.num(e.year,4);case"yyyyyy":return n?a({year:"numeric"},"year"):this.num(e.year,6);case"G":return d("short");case"GG":return d("long");case"GGGGG":return d("narrow");case"kk":return this.num(e.weekYear.toString().slice(-2),2);case"kkkk":return this.num(e.weekYear,4);case"W":return this.num(e.weekNumber);case"WW":return this.num(e.weekNumber,2);case"n":return this.num(e.localWeekNumber);case"nn":return this.num(e.localWeekNumber,2);case"ii":return this.num(e.localWeekYear.toString().slice(-2),2);case"iiii":return this.num(e.localWeekYear,4);case"o":return this.num(e.ordinal);case"ooo":return this.num(e.ordinal,3);case"q":return this.num(e.quarter);case"qq":return this.num(e.quarter,2);case"X":return this.num(Math.floor(e.ts/1e3));case"x":return this.num(e.ts);default:return l(t)}};return th(tm.parseFormat(t),u)}formatDurationFromString(e,t){let r="negativeLargestOnly"===this.opts.signMode?-1:1,n=e=>{switch(e[0]){case"S":return"milliseconds";case"s":return"seconds";case"m":return"minutes";case"h":return"hours";case"d":return"days";case"w":return"weeks";case"M":return"months";case"y":return"years";default:return null}},a=(e,t)=>a=>{let i=n(a);if(!i)return a;{let n,s=t.isNegativeDuration&&i!==t.largestUnit?r:1;return n="negativeLargestOnly"===this.opts.signMode&&i!==t.largestUnit?"never":"all"===this.opts.signMode?"always":"auto",this.num(e.get(i)*s,a.length,n)}},i=tm.parseFormat(t),s=i.reduce((e,{literal:t,val:r})=>t?e:e.concat(r),[]),o=e.shiftTo(...s.map(n).filter(e=>e)),l={isNegativeDuration:o<0,largestUnit:Object.keys(o.values)[0]};return th(i,a(o,l))}}let tf=/[A-Za-z_+-]{1,256}(?::?\/[A-Za-z0-9_+-]{1,256}(?:\/[A-Za-z0-9_+-]{1,256})?)?/;function tb(...e){let t=e.reduce((e,t)=>e+t.source,"");return RegExp(`^${t}$`)}function tg(...e){return t=>e.reduce(([e,r,n],a)=>{let[i,s,o]=a(t,n);return[{...e,...i},s||r,o]},[{},null,1]).slice(0,2)}function tK(e,...t){if(null==e)return[null,null];for(let[r,n]of t){let t=r.exec(e);if(t)return n(t)}return[null,null]}function tv(...e){return(t,r)=>{let n,a={};for(n=0;n<e.length;n++)a[e[n]]=eU(t[r+n]);return[a,null,r+n]}}let tS=/(?:([Zz])|([+-]\d\d)(?::?(\d\d))?)/,tE=`(?:${tS.source}?(?:\\[(${tf.source})\\])?)?`,tI=/(\d\d)(?::?(\d\d)(?::?(\d\d)(?:[.,](\d{1,30}))?)?)?/,tk=RegExp(`${tI.source}${tE}`),tw=RegExp(`(?:[Tt]${tk.source})?`),tj=tv("weekYear","weekNumber","weekDay"),tx=tv("year","ordinal"),tA=RegExp(`${tI.source} ?(?:${tS.source}|(${tf.source}))?`),tT=RegExp(`(?: ${tA.source})?`);function tD(e,t,r){let n=e[t];return eJ(n)?r:eU(n)}function tC(e,t){return[{hours:tD(e,t,0),minutes:tD(e,t+1,0),seconds:tD(e,t+2,0),milliseconds:eH(e[t+3])},null,t+4]}function tO(e,t){let r=!e[t]&&!e[t+1],n=e6(e[t+1],e[t+2]);return[{},r?null:es.instance(n),t+3]}function tR(e,t){return[{},e[t]?V.create(e[t]):null,t+1]}let tM=RegExp(`^T?${tI.source}$`),tP=/^-?P(?:(?:(-?\d{1,20}(?:\.\d{1,20})?)Y)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20}(?:\.\d{1,20})?)W)?(?:(-?\d{1,20}(?:\.\d{1,20})?)D)?(?:T(?:(-?\d{1,20}(?:\.\d{1,20})?)H)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20})(?:[.,](-?\d{1,20}))?S)?)?)$/;function tN(e){let[t,r,n,a,i,s,o,l,d]=e,u="-"===t[0],c=l&&"-"===l[0],p=(e,t=!1)=>void 0!==e&&(t||e&&u)?-e:e;return[{years:p(eW(r)),months:p(eW(n)),weeks:p(eW(a)),days:p(eW(i)),hours:p(eW(s)),minutes:p(eW(o)),seconds:p(eW(l),"-0"===l),milliseconds:p(eH(d),c)}]}let tJ={GMT:0,EDT:-240,EST:-300,CDT:-300,CST:-360,MDT:-360,MST:-420,PDT:-420,PST:-480};function tL(e,t,r,n,a,i,s){let o={year:2===t.length?e3(eU(t)):eU(t),month:tt.indexOf(r)+1,day:eU(n),hour:eU(a),minute:eU(i)};return s&&(o.second=eU(s)),e&&(o.weekday=e.length>3?ta.indexOf(e)+1:ti.indexOf(e)+1),o}let t_=/^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|(?:([+-]\d\d)(\d\d)))$/;function tF(e){let[,t,r,n,a,i,s,o,l,d,u,c]=e;return[tL(t,a,n,r,i,s,o),new es(l?tJ[l]:d?0:e6(u,c))]}let tq=/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d\d) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d\d):(\d\d):(\d\d) GMT$/,tG=/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d\d)-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d\d) (\d\d):(\d\d):(\d\d) GMT$/,tV=/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( \d|\d\d) (\d\d):(\d\d):(\d\d) (\d{4})$/;function tY(e){let[,t,r,n,a,i,s,o]=e;return[tL(t,a,n,r,i,s,o),es.utcInstance]}function tB(e){let[,t,r,n,a,i,s,o]=e;return[tL(t,o,r,n,a,i,s),es.utcInstance]}let tz=tb(/([+-]\d{6}|\d{4})(?:-?(\d\d)(?:-?(\d\d))?)?/,tw),tU=tb(/(\d{4})-?W(\d\d)(?:-?(\d))?/,tw),tW=tb(/(\d{4})-?(\d{3})/,tw),tH=tb(tk),t$=tg(function(e,t){return[{year:tD(e,t),month:tD(e,t+1,1),day:tD(e,t+2,1)},null,t+3]},tC,tO,tR),tQ=tg(tj,tC,tO,tR),tZ=tg(tx,tC,tO,tR),tX=tg(tC,tO,tR),t0=tg(tC),t1=tb(/(\d{4})-(\d\d)-(\d\d)/,tT),t2=tb(tA),t3=tg(tC,tO,tR),t4="Invalid Duration",t6={weeks:{days:7,hours:168,minutes:10080,seconds:604800,milliseconds:6048e5},days:{hours:24,minutes:1440,seconds:86400,milliseconds:864e5},hours:{minutes:60,seconds:3600,milliseconds:36e5},minutes:{seconds:60,milliseconds:6e4},seconds:{milliseconds:1e3}},t5={years:{quarters:4,months:12,weeks:52,days:365,hours:8760,minutes:525600,seconds:31536e3,milliseconds:31536e6},quarters:{months:3,weeks:13,days:91,hours:2184,minutes:131040,seconds:7862400,milliseconds:78624e5},months:{weeks:4,days:30,hours:720,minutes:43200,seconds:2592e3,milliseconds:2592e6},...t6},t8={years:{quarters:4,months:12,weeks:52.1775,days:365.2425,hours:8765.82,minutes:525949.2,seconds:0x1e18558,milliseconds:31556952e3},quarters:{months:3,weeks:13.044375,days:91.310625,hours:2191.455,minutes:131487.3,seconds:7889238,milliseconds:7889238e3},months:{weeks:30.436875/7,days:30.436875,hours:730.485,minutes:43829.1,seconds:2629746,milliseconds:2629746e3},...t6},t9=["years","quarters","months","weeks","days","hours","minutes","seconds","milliseconds"],t7=t9.slice(0).reverse();function re(e,t,r=!1){return new ra({values:r?t.values:{...e.values,...t.values||{}},loc:e.loc.clone(t.loc),conversionAccuracy:t.conversionAccuracy||e.conversionAccuracy,matrix:t.matrix||e.matrix})}function rt(e,t){var r;let n=null!=(r=t.milliseconds)?r:0;for(let r of t7.slice(1))t[r]&&(n+=t[r]*e[r].milliseconds);return n}function rr(e,t){let r=0>rt(e,t)?-1:1;t9.reduceRight((n,a)=>{if(eJ(t[a]))return n;if(n){let i=t[n]*r,s=e[a][n],o=Math.floor(i/s);t[a]+=o*r,t[n]-=o*s*r}return a},null),t9.reduce((r,n)=>{if(eJ(t[n]))return r;if(r){let a=t[r]%1;t[r]-=a,t[n]+=a*e[r][n]}return n},null)}function rn(e){let t={};for(let[r,n]of Object.entries(e))0!==n&&(t[r]=n);return t}class ra{constructor(e){const t="longterm"===e.conversionAccuracy;let r=t?t8:t5;e.matrix&&(r=e.matrix),this.values=e.values,this.loc=e.loc||ea.create(),this.conversionAccuracy=t?"longterm":"casual",this.invalid=e.invalid||null,this.matrix=r,this.isLuxonDuration=!0}static fromMillis(e,t){return ra.fromObject({milliseconds:e},t)}static fromObject(e,t={}){if(null==e||"object"!=typeof e)throw new u(`Duration.fromObject: argument expected to be an object, got ${null===e?"null":typeof e}`);return new ra({values:e8(e,ra.normalizeUnit),loc:ea.fromObject(t),conversionAccuracy:t.conversionAccuracy,matrix:t.matrix})}static fromDurationLike(e){if(eL(e))return ra.fromMillis(e);if(ra.isDuration(e))return e;if("object"==typeof e)return ra.fromObject(e);throw new u(`Unknown duration argument ${e} of type ${typeof e}`)}static fromISO(e,t){let[r]=tK(e,[tP,tN]);return r?ra.fromObject(r,t):ra.invalid("unparsable",`the input "${e}" can't be parsed as ISO 8601`)}static fromISOTime(e,t){let[r]=tK(e,[tM,t0]);return r?ra.fromObject(r,t):ra.invalid("unparsable",`the input "${e}" can't be parsed as ISO 8601`)}static invalid(e,t=null){if(!e)throw new u("need to specify a reason the Duration is invalid");let r=e instanceof eI?e:new eI(e,t);if(!eE.throwOnInvalid)return new ra({invalid:r});throw new o(r)}static normalizeUnit(e){let t={year:"years",years:"years",quarter:"quarters",quarters:"quarters",month:"months",months:"months",week:"weeks",weeks:"weeks",day:"days",days:"days",hour:"hours",hours:"hours",minute:"minutes",minutes:"minutes",second:"seconds",seconds:"seconds",millisecond:"milliseconds",milliseconds:"milliseconds"}[e?e.toLowerCase():e];if(!t)throw new d(e);return t}static isDuration(e){return e&&e.isLuxonDuration||!1}get locale(){return this.isValid?this.loc.locale:null}get numberingSystem(){return this.isValid?this.loc.numberingSystem:null}toFormat(e,t={}){let r={...t,floor:!1!==t.round&&!1!==t.floor};return this.isValid?tm.create(this.loc,r).formatDurationFromString(this,e):t4}toHuman(e={}){if(!this.isValid)return t4;let t=!1!==e.showZeros,r=t9.map(r=>{let n=this.values[r];return eJ(n)||0===n&&!t?null:this.loc.numberFormatter({style:"unit",unitDisplay:"long",...e,unit:r.slice(0,-1)}).format(n)}).filter(e=>e);return this.loc.listFormatter({type:"conjunction",style:e.listStyle||"narrow",...e}).format(r)}toObject(){return this.isValid?{...this.values}:{}}toISO(){if(!this.isValid)return null;let e="P";return 0!==this.years&&(e+=this.years+"Y"),(0!==this.months||0!==this.quarters)&&(e+=this.months+3*this.quarters+"M"),0!==this.weeks&&(e+=this.weeks+"W"),0!==this.days&&(e+=this.days+"D"),(0!==this.hours||0!==this.minutes||0!==this.seconds||0!==this.milliseconds)&&(e+="T"),0!==this.hours&&(e+=this.hours+"H"),0!==this.minutes&&(e+=this.minutes+"M"),(0!==this.seconds||0!==this.milliseconds)&&(e+=e$(this.seconds+this.milliseconds/1e3,3)+"S"),"P"===e&&(e+="T0S"),e}toISOTime(e={}){if(!this.isValid)return null;let t=this.toMillis();return t<0||t>=864e5?null:(e={suppressMilliseconds:!1,suppressSeconds:!1,includePrefix:!1,format:"extended",...e,includeOffset:!1},rW.fromMillis(t,{zone:"UTC"}).toISOTime(e))}toJSON(){return this.toISO()}toString(){return this.toISO()}[Symbol.for("nodejs.util.inspect.custom")](){return this.isValid?`Duration { values: ${JSON.stringify(this.values)} }`:`Duration { Invalid, reason: ${this.invalidReason} }`}toMillis(){return this.isValid?rt(this.matrix,this.values):NaN}valueOf(){return this.toMillis()}plus(e){if(!this.isValid)return this;let t=ra.fromDurationLike(e),r={};for(let e of t9)(eV(t.values,e)||eV(this.values,e))&&(r[e]=t.get(e)+this.get(e));return re(this,{values:r},!0)}minus(e){if(!this.isValid)return this;let t=ra.fromDurationLike(e);return this.plus(t.negate())}mapUnits(e){if(!this.isValid)return this;let t={};for(let r of Object.keys(this.values))t[r]=e5(e(this.values[r],r));return re(this,{values:t},!0)}get(e){return this[ra.normalizeUnit(e)]}set(e){return this.isValid?re(this,{values:{...this.values,...e8(e,ra.normalizeUnit)}}):this}reconfigure({locale:e,numberingSystem:t,conversionAccuracy:r,matrix:n}={}){return re(this,{loc:this.loc.clone({locale:e,numberingSystem:t}),matrix:n,conversionAccuracy:r})}as(e){return this.isValid?this.shiftTo(e).get(e):NaN}normalize(){if(!this.isValid)return this;let e=this.toObject();return rr(this.matrix,e),re(this,{values:e},!0)}rescale(){return this.isValid?re(this,{values:rn(this.normalize().shiftToAll().toObject())},!0):this}shiftTo(...e){let t;if(!this.isValid||0===e.length)return this;e=e.map(e=>ra.normalizeUnit(e));let r={},n={},a=this.toObject();for(let i of t9)if(e.indexOf(i)>=0){t=i;let e=0;for(let t in n)e+=this.matrix[t][i]*n[t],n[t]=0;eL(a[i])&&(e+=a[i]);let s=Math.trunc(e);r[i]=s,n[i]=(1e3*e-1e3*s)/1e3}else eL(a[i])&&(n[i]=a[i]);for(let e in n)0!==n[e]&&(r[t]+=e===t?n[e]:n[e]/this.matrix[t][e]);return rr(this.matrix,r),re(this,{values:r},!0)}shiftToAll(){return this.isValid?this.shiftTo("years","months","weeks","days","hours","minutes","seconds","milliseconds"):this}negate(){if(!this.isValid)return this;let e={};for(let t of Object.keys(this.values))e[t]=0===this.values[t]?0:-this.values[t];return re(this,{values:e},!0)}removeZeros(){return this.isValid?re(this,{values:rn(this.values)},!0):this}get years(){return this.isValid?this.values.years||0:NaN}get quarters(){return this.isValid?this.values.quarters||0:NaN}get months(){return this.isValid?this.values.months||0:NaN}get weeks(){return this.isValid?this.values.weeks||0:NaN}get days(){return this.isValid?this.values.days||0:NaN}get hours(){return this.isValid?this.values.hours||0:NaN}get minutes(){return this.isValid?this.values.minutes||0:NaN}get seconds(){return this.isValid?this.values.seconds||0:NaN}get milliseconds(){return this.isValid?this.values.milliseconds||0:NaN}get isValid(){return null===this.invalid}get invalidReason(){return this.invalid?this.invalid.reason:null}get invalidExplanation(){return this.invalid?this.invalid.explanation:null}equals(e){if(!this.isValid||!e.isValid||!this.loc.equals(e.loc))return!1;for(let n of t9){var t,r;if(t=this.values[n],r=e.values[n],void 0===t||0===t?void 0!==r&&0!==r:t!==r)return!1}return!0}}let ri="Invalid Interval";class rs{constructor(e){this.s=e.start,this.e=e.end,this.invalid=e.invalid||null,this.isLuxonInterval=!0}static invalid(e,t=null){if(!e)throw new u("need to specify a reason the Interval is invalid");let r=e instanceof eI?e:new eI(e,t);if(!eE.throwOnInvalid)return new rs({invalid:r});throw new s(r)}static fromDateTimes(e,t){var r,n;let a=rH(e),i=rH(t),s=(r=a,n=i,r&&r.isValid?n&&n.isValid?n<r?rs.invalid("end before start",`The end of an interval must be after its start, but you had start=${r.toISO()} and end=${n.toISO()}`):null:rs.invalid("missing or invalid end"):rs.invalid("missing or invalid start"));return null==s?new rs({start:a,end:i}):s}static after(e,t){let r=ra.fromDurationLike(t),n=rH(e);return rs.fromDateTimes(n,n.plus(r))}static before(e,t){let r=ra.fromDurationLike(t),n=rH(e);return rs.fromDateTimes(n.minus(r),n)}static fromISO(e,t){let[r,n]=(e||"").split("/",2);if(r&&n){let e,a,i,s;try{a=(e=rW.fromISO(r,t)).isValid}catch(e){a=!1}try{s=(i=rW.fromISO(n,t)).isValid}catch(e){s=!1}if(a&&s)return rs.fromDateTimes(e,i);if(a){let r=ra.fromISO(n,t);if(r.isValid)return rs.after(e,r)}else if(s){let e=ra.fromISO(r,t);if(e.isValid)return rs.before(i,e)}}return rs.invalid("unparsable",`the input "${e}" can't be parsed as ISO 8601`)}static isInterval(e){return e&&e.isLuxonInterval||!1}get start(){return this.isValid?this.s:null}get end(){return this.isValid?this.e:null}get lastDateTime(){return this.isValid&&this.e?this.e.minus(1):null}get isValid(){return null===this.invalidReason}get invalidReason(){return this.invalid?this.invalid.reason:null}get invalidExplanation(){return this.invalid?this.invalid.explanation:null}length(e="milliseconds"){return this.isValid?this.toDuration(e).get(e):NaN}count(e="milliseconds",t){let r;if(!this.isValid)return NaN;let n=this.start.startOf(e,t);return Math.floor((r=(r=null!=t&&t.useLocaleWeeks?this.end.reconfigure({locale:n.locale}):this.end).startOf(e,t)).diff(n,e).get(e))+(r.valueOf()!==this.end.valueOf())}hasSame(e){return!!this.isValid&&(this.isEmpty()||this.e.minus(1).hasSame(this.s,e))}isEmpty(){return this.s.valueOf()===this.e.valueOf()}isAfter(e){return!!this.isValid&&this.s>e}isBefore(e){return!!this.isValid&&this.e<=e}contains(e){return!!this.isValid&&this.s<=e&&this.e>e}set({start:e,end:t}={}){return this.isValid?rs.fromDateTimes(e||this.s,t||this.e):this}splitAt(...e){if(!this.isValid)return[];let t=e.map(rH).filter(e=>this.contains(e)).sort((e,t)=>e.toMillis()-t.toMillis()),r=[],{s:n}=this,a=0;for(;n<this.e;){let e=t[a]||this.e,i=+e>+this.e?this.e:e;r.push(rs.fromDateTimes(n,i)),n=i,a+=1}return r}splitBy(e){let t=ra.fromDurationLike(e);if(!this.isValid||!t.isValid||0===t.as("milliseconds"))return[];let{s:r}=this,n=1,a,i=[];for(;r<this.e;){let e=this.start.plus(t.mapUnits(e=>e*n));a=+e>+this.e?this.e:e,i.push(rs.fromDateTimes(r,a)),r=a,n+=1}return i}divideEqually(e){return this.isValid?this.splitBy(this.length()/e).slice(0,e):[]}overlaps(e){return this.e>e.s&&this.s<e.e}abutsStart(e){return!!this.isValid&&+this.e==+e.s}abutsEnd(e){return!!this.isValid&&+e.e==+this.s}engulfs(e){return!!this.isValid&&this.s<=e.s&&this.e>=e.e}equals(e){return!!this.isValid&&!!e.isValid&&this.s.equals(e.s)&&this.e.equals(e.e)}intersection(e){if(!this.isValid)return this;let t=this.s>e.s?this.s:e.s,r=this.e<e.e?this.e:e.e;return t>=r?null:rs.fromDateTimes(t,r)}union(e){if(!this.isValid)return this;let t=this.s<e.s?this.s:e.s,r=this.e>e.e?this.e:e.e;return rs.fromDateTimes(t,r)}static merge(e){let[t,r]=e.sort((e,t)=>e.s-t.s).reduce(([e,t],r)=>t?t.overlaps(r)||t.abutsStart(r)?[e,t.union(r)]:[e.concat([t]),r]:[e,r],[[],null]);return r&&t.push(r),t}static xor(e){let t=null,r=0,n=[],a=e.map(e=>[{time:e.s,type:"s"},{time:e.e,type:"e"}]);for(let e of Array.prototype.concat(...a).sort((e,t)=>e.time-t.time))1===(r+="s"===e.type?1:-1)?t=e.time:(t&&+t!=+e.time&&n.push(rs.fromDateTimes(t,e.time)),t=null);return rs.merge(n)}difference(...e){return rs.xor([this].concat(e)).map(e=>this.intersection(e)).filter(e=>e&&!e.isEmpty())}toString(){return this.isValid?`[${this.s.toISO()} – ${this.e.toISO()})`:ri}[Symbol.for("nodejs.util.inspect.custom")](){return this.isValid?`Interval { start: ${this.s.toISO()}, end: ${this.e.toISO()} }`:`Interval { Invalid, reason: ${this.invalidReason} }`}toLocaleString(e=m,t={}){return this.isValid?tm.create(this.s.loc.clone(t),e).formatInterval(this):ri}toISO(e){return this.isValid?`${this.s.toISO(e)}/${this.e.toISO(e)}`:ri}toISODate(){return this.isValid?`${this.s.toISODate()}/${this.e.toISODate()}`:ri}toISOTime(e){return this.isValid?`${this.s.toISOTime(e)}/${this.e.toISOTime(e)}`:ri}toFormat(e,{separator:t=" – "}={}){return this.isValid?`${this.s.toFormat(e)}${t}${this.e.toFormat(e)}`:ri}toDuration(e,t){return this.isValid?this.e.diff(this.s,e,t):ra.invalid(this.invalidReason)}mapEndpoints(e){return rs.fromDateTimes(e(this.s),e(this.e))}}class ro{static hasDST(e=eE.defaultZone){let t=rW.now().setZone(e).set({month:12});return!e.isUniversal&&t.offset!==t.set({month:6}).offset}static isValidIANAZone(e){return V.isValidZone(e)}static normalizeZone(e){return el(e,eE.defaultZone)}static getStartOfWeek({locale:e=null,locObj:t=null}={}){return(t||ea.create(e)).getStartOfWeek()}static getMinimumDaysInFirstWeek({locale:e=null,locObj:t=null}={}){return(t||ea.create(e)).getMinDaysInFirstWeek()}static getWeekendWeekdays({locale:e=null,locObj:t=null}={}){return(t||ea.create(e)).getWeekendDays().slice()}static months(e="long",{locale:t=null,numberingSystem:r=null,locObj:n=null,outputCalendar:a="gregory"}={}){return(n||ea.create(t,r,a)).months(e)}static monthsFormat(e="long",{locale:t=null,numberingSystem:r=null,locObj:n=null,outputCalendar:a="gregory"}={}){return(n||ea.create(t,r,a)).months(e,!0)}static weekdays(e="long",{locale:t=null,numberingSystem:r=null,locObj:n=null}={}){return(n||ea.create(t,r,null)).weekdays(e)}static weekdaysFormat(e="long",{locale:t=null,numberingSystem:r=null,locObj:n=null}={}){return(n||ea.create(t,r,null)).weekdays(e,!0)}static meridiems({locale:e=null}={}){return ea.create(e).meridiems()}static eras(e="short",{locale:t=null}={}){return ea.create(t,null,"gregory").eras(e)}static features(){return{relative:eF(),localeWeek:eq()}}}function rl(e,t){let r=e=>e.toUTC(0,{keepLocalTime:!0}).startOf("day").valueOf(),n=r(t)-r(e);return Math.floor(ra.fromMillis(n).as("days"))}function rd(e,t=e=>e){return{regex:e,deser:([e])=>t(function(e){let t=parseInt(e,10);if(!isNaN(t))return t;t="";for(let r=0;r<e.length;r++){let n=e.charCodeAt(r);if(-1!==e[r].search(ed.hanidec))t+=ec.indexOf(e[r]);else for(let e in eu){let[r,a]=eu[e];n>=r&&n<=a&&(t+=n-r)}}return parseInt(t,10)}(e))}}let ru=String.fromCharCode(160),rc=`[ ${ru}]`,rp=RegExp(rc,"g");function rh(e){return e.replace(/\./g,"\\.?").replace(rp,rc)}function ry(e){return e.replace(/\./g,"").replace(rp," ").toLowerCase()}function rm(e,t){return null===e?null:{regex:RegExp(e.map(rh).join("|")),deser:([r])=>e.findIndex(e=>ry(r)===ry(e))+t}}function rf(e,t){return{regex:e,deser:([,e,t])=>e6(e,t),groups:t}}function rb(e){return{regex:e,deser:([e])=>e}}let rg={year:{"2-digit":"yy",numeric:"yyyyy"},month:{numeric:"M","2-digit":"MM",short:"MMM",long:"MMMM"},day:{numeric:"d","2-digit":"dd"},weekday:{short:"EEE",long:"EEEE"},dayperiod:"a",dayPeriod:"a",hour12:{numeric:"h","2-digit":"hh"},hour24:{numeric:"H","2-digit":"HH"},minute:{numeric:"m","2-digit":"mm"},second:{numeric:"s","2-digit":"ss"},timeZoneName:{long:"ZZZZZ",short:"ZZZ"}},rK=null;function rv(e,t){return Array.prototype.concat(...e.map(e=>(function(e,t){if(e.literal)return e;let r=rI(tm.macroTokenToFormatOpts(e.val),t);return null==r||r.includes(void 0)?e:r})(e,t)))}class rS{constructor(e,t){if(this.locale=e,this.format=t,this.tokens=rv(tm.parseFormat(t),e),this.units=this.tokens.map(t=>{let r,n,a,i,s,o,l,d,u,c,p,h,y;return r=eh(e),n=eh(e,"{2}"),a=eh(e,"{3}"),i=eh(e,"{4}"),s=eh(e,"{6}"),o=eh(e,"{1,2}"),l=eh(e,"{1,3}"),d=eh(e,"{1,6}"),u=eh(e,"{1,9}"),c=eh(e,"{2,4}"),p=eh(e,"{4,6}"),h=e=>({regex:RegExp(e.val.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")),deser:([e])=>e,literal:!0}),(y=(y=>{if(t.literal)return h(y);switch(y.val){case"G":return rm(e.eras("short"),0);case"GG":return rm(e.eras("long"),0);case"y":return rd(d);case"yy":case"kk":return rd(c,e3);case"yyyy":case"kkkk":return rd(i);case"yyyyy":return rd(p);case"yyyyyy":return rd(s);case"M":case"L":case"d":case"H":case"h":case"m":case"q":case"s":case"W":return rd(o);case"MM":case"LL":case"dd":case"HH":case"hh":case"mm":case"qq":case"ss":case"WW":return rd(n);case"MMM":return rm(e.months("short",!0),1);case"MMMM":return rm(e.months("long",!0),1);case"LLL":return rm(e.months("short",!1),1);case"LLLL":return rm(e.months("long",!1),1);case"o":case"S":return rd(l);case"ooo":case"SSS":return rd(a);case"u":return rb(u);case"uu":return rb(o);case"uuu":case"E":case"c":return rd(r);case"a":return rm(e.meridiems(),0);case"EEE":return rm(e.weekdays("short",!1),1);case"EEEE":return rm(e.weekdays("long",!1),1);case"ccc":return rm(e.weekdays("short",!0),1);case"cccc":return rm(e.weekdays("long",!0),1);case"Z":case"ZZ":return rf(RegExp(`([+-]${o.source})(?::(${n.source}))?`),2);case"ZZZ":return rf(RegExp(`([+-]${o.source})(${n.source})?`),2);case"z":return rb(/[a-z_+-/]{1,256}?/i);case" ":return rb(/[^\S\n\r]/);default:return h(y)}})(t)||{invalidReason:"missing Intl.DateTimeFormat.formatToParts support"}).token=t,y}),this.disqualifyingUnit=this.units.find(e=>e.invalidReason),!this.disqualifyingUnit){const[e,t]=function(e){let t=e.map(e=>e.regex).reduce((e,t)=>`${e}(${t.source})`,"");return[`^${t}$`,e]}(this.units);this.regex=RegExp(e,"i"),this.handlers=t}}explainFromTokens(e){if(!this.isValid)return{input:e,tokens:this.tokens,invalidReason:this.invalidReason};{let t,r,[n,a]=function(e,t,r){let n=e.match(t);if(!n)return[n,{}];{let e={},t=1;for(let a in r)if(eV(r,a)){let i=r[a],s=i.groups?i.groups+1:1;!i.literal&&i.token&&(e[i.token.val[0]]=i.deser(n.slice(t,t+s))),t+=s}return[n,e]}}(e,this.regex,this.handlers),[i,s,o]=a?(r=null,eJ(a.z)||(r=V.create(a.z)),eJ(a.Z)||(r||(r=new es(a.Z)),t=a.Z),eJ(a.q)||(a.M=(a.q-1)*3+1),eJ(a.h)||(a.h<12&&1===a.a?a.h+=12:12===a.h&&0===a.a&&(a.h=0)),0===a.G&&a.y&&(a.y=-a.y),eJ(a.u)||(a.S=eH(a.u)),[Object.keys(a).reduce((e,t)=>{let r=(e=>{switch(e){case"S":return"millisecond";case"s":return"second";case"m":return"minute";case"h":case"H":return"hour";case"d":return"day";case"o":return"ordinal";case"L":case"M":return"month";case"y":return"year";case"E":case"c":return"weekday";case"W":return"weekNumber";case"k":return"weekYear";case"q":return"quarter";default:return null}})(t);return r&&(e[r]=a[t]),e},{}),r,t]):[null,null,void 0];if(eV(a,"a")&&eV(a,"H"))throw new l("Can't include meridiem when specifying 24-hour format");return{input:e,tokens:this.tokens,regex:this.regex,rawMatches:n,matches:a,result:i,zone:s,specificOffset:o}}}get isValid(){return!this.disqualifyingUnit}get invalidReason(){return this.disqualifyingUnit?this.disqualifyingUnit.invalidReason:null}}function rE(e,t,r){return new rS(e,r).explainFromTokens(t)}function rI(e,t){if(!e)return null;let r=tm.create(t,e).dtFormatter((rK||(rK=rW.fromMillis(0x16a2e5618e3)),rK)),n=r.formatToParts(),a=r.resolvedOptions();return n.map(t=>(function(e,t,r){let{type:n,value:a}=e;if("literal"===n){let e=/^\s+$/.test(a);return{literal:!e,val:e?" ":a}}let i=t[n],s=n;"hour"===n&&(s=null!=t.hour12?t.hour12?"hour12":"hour24":null!=t.hourCycle?"h11"===t.hourCycle||"h12"===t.hourCycle?"hour12":"hour24":r.hour12?"hour12":"hour24");let o=rg[s];if("object"==typeof o&&(o=o[i]),o)return{literal:!1,val:o}})(t,e,a))}let rk="Invalid DateTime";function rw(e){return new eI("unsupported zone",`the zone "${e.name}" is not supported`)}function rj(e){return null===e.weekData&&(e.weekData=eD(e.c)),e.weekData}function rx(e){return null===e.localWeekData&&(e.localWeekData=eD(e.c,e.loc.getMinDaysInFirstWeek(),e.loc.getStartOfWeek())),e.localWeekData}function rA(e,t){let r={ts:e.ts,zone:e.zone,c:e.c,o:e.o,loc:e.loc,invalid:e.invalid};return new rW({...r,...t,old:r})}function rT(e,t,r){let n=e-60*t*1e3,a=r.offset(n);if(t===a)return[n,t];n-=(a-t)*6e4;let i=r.offset(n);return a===i?[n,a]:[e-60*Math.min(a,i)*1e3,Math.max(a,i)]}function rD(e,t){let r=new Date(e+=60*t*1e3);return{year:r.getUTCFullYear(),month:r.getUTCMonth()+1,day:r.getUTCDate(),hour:r.getUTCHours(),minute:r.getUTCMinutes(),second:r.getUTCSeconds(),millisecond:r.getUTCMilliseconds()}}function rC(e,t){let r=e.o,n=e.c.year+Math.trunc(t.years),a=e.c.month+Math.trunc(t.months)+3*Math.trunc(t.quarters),i={...e.c,year:n,month:a,day:Math.min(e.c.day,eX(n,a))+Math.trunc(t.days)+7*Math.trunc(t.weeks)},s=ra.fromObject({years:t.years-Math.trunc(t.years),quarters:t.quarters-Math.trunc(t.quarters),months:t.months-Math.trunc(t.months),weeks:t.weeks-Math.trunc(t.weeks),days:t.days-Math.trunc(t.days),hours:t.hours,minutes:t.minutes,seconds:t.seconds,milliseconds:t.milliseconds}).as("milliseconds"),[o,l]=rT(e0(i),r,e.zone);return 0!==s&&(o+=s,l=e.zone.offset(o)),{ts:o,o:l}}function rO(e,t,r,n,a,i){let{setZone:s,zone:o}=r;if((!e||0===Object.keys(e).length)&&!t)return rW.invalid(new eI("unparsable",`the input "${a}" can't be parsed as ${n}`));{let n=rW.fromObject(e,{...r,zone:t||o,specificOffset:i});return s?n:n.setZone(o)}}function rR(e,t,r=!0){return e.isValid?tm.create(ea.create("en-US"),{allowZ:r,forceSimple:!0}).formatDateTimeFromString(e,t):null}function rM(e,t,r){let n=e.c.year>9999||e.c.year<0,a="";if(n&&e.c.year>=0&&(a+="+"),a+=ez(e.c.year,n?6:4),"year"===r)return a;if(t){if(a+="-",a+=ez(e.c.month),"month"===r)return a;a+="-"}else if(a+=ez(e.c.month),"month"===r)return a;return a+ez(e.c.day)}function rP(e,t,r,n,a,i,s){let o=!r||0!==e.c.millisecond||0!==e.c.second,l="";switch(s){case"day":case"month":case"year":break;default:if(l+=ez(e.c.hour),"hour"===s)break;if(t){if(l+=":",l+=ez(e.c.minute),"minute"===s)break;o&&(l+=":",l+=ez(e.c.second))}else{if(l+=ez(e.c.minute),"minute"===s)break;o&&(l+=ez(e.c.second))}if("second"===s)break;o&&(!n||0!==e.c.millisecond)&&(l+=".",l+=ez(e.c.millisecond,3))}return a&&(e.isOffsetFixed&&0===e.offset&&!i?l+="Z":e.o<0?(l+="-",l+=ez(Math.trunc(-e.o/60)),l+=":",l+=ez(Math.trunc(-e.o%60))):(l+="+",l+=ez(Math.trunc(e.o/60)),l+=":",l+=ez(Math.trunc(e.o%60)))),i&&(l+="["+e.zone.ianaName+"]"),l}let rN={month:1,day:1,hour:0,minute:0,second:0,millisecond:0},rJ={weekNumber:1,weekday:1,hour:0,minute:0,second:0,millisecond:0},rL={ordinal:1,hour:0,minute:0,second:0,millisecond:0},r_=["year","month","day","hour","minute","second","millisecond"],rF=["weekYear","weekNumber","weekday","hour","minute","second","millisecond"],rq=["year","ordinal","hour","minute","second","millisecond"];function rG(e){let t={year:"year",years:"year",month:"month",months:"month",day:"day",days:"day",hour:"hour",hours:"hour",minute:"minute",minutes:"minute",quarter:"quarter",quarters:"quarter",second:"second",seconds:"second",millisecond:"millisecond",milliseconds:"millisecond",weekday:"weekday",weekdays:"weekday",weeknumber:"weekNumber",weeksnumber:"weekNumber",weeknumbers:"weekNumber",weekyear:"weekYear",weekyears:"weekYear",ordinal:"ordinal"}[e.toLowerCase()];if(!t)throw new d(e);return t}function rV(e){switch(e.toLowerCase()){case"localweekday":case"localweekdays":return"localWeekday";case"localweeknumber":case"localweeknumbers":return"localWeekNumber";case"localweekyear":case"localweekyears":return"localWeekYear";default:return rG(e)}}function rY(e,t){let r,a,i=el(t.zone,eE.defaultZone);if(!i.isValid)return rW.invalid(rw(i));let s=ea.fromObject(t);if(eJ(e.year))r=eE.now();else{for(let t of r_)eJ(e[t])&&(e[t]=rN[t]);let t=eP(e)||eN(e);if(t)return rW.invalid(t);let s=function(e){if(void 0===n&&(n=eE.now()),"iana"!==e.type)return e.offset(n);let t=e.name,r=rU.get(t);return void 0===r&&(r=e.offset(n),rU.set(t,r)),r}(i);[r,a]=rT(e0(e),s,i)}return new rW({ts:r,zone:i,loc:s,o:a})}function rB(e,t,r){let n=!!eJ(r.round)||r.round,a=eJ(r.rounding)?"trunc":r.rounding,i=(e,i)=>(e=e$(e,n||r.calendary?0:2,r.calendary?"round":a),t.loc.clone(r).relFormatter(r).format(e,i)),s=n=>r.calendary?t.hasSame(e,n)?0:t.startOf(n).diff(e.startOf(n),n).get(n):t.diff(e,n).get(n);if(r.unit)return i(s(r.unit),r.unit);for(let e of r.units){let t=s(e);if(Math.abs(t)>=1)return i(t,e)}return i(e>t?-0:0,r.units[r.units.length-1])}function rz(e){let t={},r;return e.length>0&&"object"==typeof e[e.length-1]?(t=e[e.length-1],r=Array.from(e).slice(0,e.length-1)):r=Array.from(e),[t,r]}let rU=new Map;class rW{constructor(e){const t=e.zone||eE.defaultZone;let r=e.invalid||(Number.isNaN(e.ts)?new eI("invalid input"):null)||(t.isValid?null:rw(t));this.ts=eJ(e.ts)?eE.now():e.ts;let n=null,a=null;if(!r)if(e.old&&e.old.ts===this.ts&&e.old.zone.equals(t))[n,a]=[e.old.c,e.old.o];else{const i=eL(e.o)&&!e.old?e.o:t.offset(this.ts);n=(r=Number.isNaN((n=rD(this.ts,i)).year)?new eI("invalid input"):null)?null:n,a=r?null:i}this._zone=t,this.loc=e.loc||ea.create(),this.invalid=r,this.weekData=null,this.localWeekData=null,this.c=n,this.o=a,this.isLuxonDateTime=!0}static now(){return new rW({})}static local(){let[e,t]=rz(arguments),[r,n,a,i,s,o,l]=t;return rY({year:r,month:n,day:a,hour:i,minute:s,second:o,millisecond:l},e)}static utc(){let[e,t]=rz(arguments),[r,n,a,i,s,o,l]=t;return e.zone=es.utcInstance,rY({year:r,month:n,day:a,hour:i,minute:s,second:o,millisecond:l},e)}static fromJSDate(e,t={}){let r="[object Date]"===Object.prototype.toString.call(e)?e.valueOf():NaN;if(Number.isNaN(r))return rW.invalid("invalid input");let n=el(t.zone,eE.defaultZone);return n.isValid?new rW({ts:r,zone:n,loc:ea.fromObject(t)}):rW.invalid(rw(n))}static fromMillis(e,t={}){if(eL(e))if(e<-864e13||e>864e13)return rW.invalid("Timestamp out of range");else return new rW({ts:e,zone:el(t.zone,eE.defaultZone),loc:ea.fromObject(t)});throw new u(`fromMillis requires a numerical input, but received a ${typeof e} with value ${e}`)}static fromSeconds(e,t={}){if(eL(e))return new rW({ts:1e3*e,zone:el(t.zone,eE.defaultZone),loc:ea.fromObject(t)});throw new u("fromSeconds requires a numerical input")}static fromObject(e,t={}){var r;let n,a;e=e||{};let i=el(t.zone,eE.defaultZone);if(!i.isValid)return rW.invalid(rw(i));let s=ea.fromObject(t),o=e8(e,rV),{minDaysInFirstWeek:d,startOfWeek:u}=eM(o,s),c=eE.now(),p=eJ(t.specificOffset)?i.offset(c):t.specificOffset,h=!eJ(o.ordinal),y=!eJ(o.year),m=!eJ(o.month)||!eJ(o.day),f=y||m,b=o.weekYear||o.weekNumber;if((f||h)&&b)throw new l("Can't mix weekYear/weekNumber units with year/month/day or ordinals");if(m&&h)throw new l("Can't mix ordinal dates with month/day");let g=b||o.weekday&&!f,K,v,S=rD(c,p);g?(K=rF,v=rJ,S=eD(S,d,u)):h?(K=rq,v=rL,S=eO(S)):(K=r_,v=rN);let E=!1;for(let e of K)eJ(o[e])?E?o[e]=v[e]:o[e]=S[e]:E=!0;let I=(g?function(e,t=4,r=1){let n=e_(e.weekYear),a=eB(e.weekNumber,1,e2(e.weekYear,t,r)),i=eB(e.weekday,1,7);return n?a?!i&&ej("weekday",e.weekday):ej("week",e.weekNumber):ej("weekYear",e.weekYear)}(o,d,u):h?(n=e_(o.year),a=eB(o.ordinal,1,eZ(o.year)),n?!a&&ej("ordinal",o.ordinal):ej("year",o.year)):eP(o))||eN(o);if(I)return rW.invalid(I);let[k,w]=(r=g?eC(o,d,u):h?eR(o):o,rT(e0(r),p,i)),j=new rW({ts:k,zone:i,o:w,loc:s});return o.weekday&&f&&e.weekday!==j.weekday?rW.invalid("mismatched weekday",`you can't specify both a weekday of ${o.weekday} and a date of ${j.toISO()}`):j.isValid?j:rW.invalid(j.invalid)}static fromISO(e,t={}){let[r,n]=tK(e,[tz,t$],[tU,tQ],[tW,tZ],[tH,tX]);return rO(r,n,t,"ISO 8601",e)}static fromRFC2822(e,t={}){let[r,n]=tK(e.replace(/\([^()]*\)|[\n\t]/g," ").replace(/(\s\s+)/g," ").trim(),[t_,tF]);return rO(r,n,t,"RFC 2822",e)}static fromHTTP(e,t={}){let[r,n]=tK(e,[tq,tY],[tG,tY],[tV,tB]);return rO(r,n,t,"HTTP",t)}static fromFormat(e,t,r={}){if(eJ(e)||eJ(t))throw new u("fromFormat requires an input string and a format");let{locale:n=null,numberingSystem:a=null}=r,[i,s,o,l]=function(e,t,r){let{result:n,zone:a,specificOffset:i,invalidReason:s}=rE(e,t,r);return[n,a,i,s]}(ea.fromOpts({locale:n,numberingSystem:a,defaultToEN:!0}),e,t);return l?rW.invalid(l):rO(i,s,r,`format ${t}`,e,o)}static fromString(e,t,r={}){return rW.fromFormat(e,t,r)}static fromSQL(e,t={}){let[r,n]=tK(e,[t1,t$],[t2,t3]);return rO(r,n,t,"SQL",e)}static invalid(e,t=null){if(!e)throw new u("need to specify a reason the DateTime is invalid");let r=e instanceof eI?e:new eI(e,t);if(!eE.throwOnInvalid)return new rW({invalid:r});throw new i(r)}static isDateTime(e){return e&&e.isLuxonDateTime||!1}static parseFormatForOpts(e,t={}){let r=rI(e,ea.fromObject(t));return r?r.map(e=>e?e.val:null).join(""):null}static expandFormat(e,t={}){return rv(tm.parseFormat(e),ea.fromObject(t)).map(e=>e.val).join("")}static resetCache(){n=void 0,rU.clear()}get(e){return this[e]}get isValid(){return null===this.invalid}get invalidReason(){return this.invalid?this.invalid.reason:null}get invalidExplanation(){return this.invalid?this.invalid.explanation:null}get locale(){return this.isValid?this.loc.locale:null}get numberingSystem(){return this.isValid?this.loc.numberingSystem:null}get outputCalendar(){return this.isValid?this.loc.outputCalendar:null}get zone(){return this._zone}get zoneName(){return this.isValid?this.zone.name:null}get year(){return this.isValid?this.c.year:NaN}get quarter(){return this.isValid?Math.ceil(this.c.month/3):NaN}get month(){return this.isValid?this.c.month:NaN}get day(){return this.isValid?this.c.day:NaN}get hour(){return this.isValid?this.c.hour:NaN}get minute(){return this.isValid?this.c.minute:NaN}get second(){return this.isValid?this.c.second:NaN}get millisecond(){return this.isValid?this.c.millisecond:NaN}get weekYear(){return this.isValid?rj(this).weekYear:NaN}get weekNumber(){return this.isValid?rj(this).weekNumber:NaN}get weekday(){return this.isValid?rj(this).weekday:NaN}get isWeekend(){return this.isValid&&this.loc.getWeekendDays().includes(this.weekday)}get localWeekday(){return this.isValid?rx(this).weekday:NaN}get localWeekNumber(){return this.isValid?rx(this).weekNumber:NaN}get localWeekYear(){return this.isValid?rx(this).weekYear:NaN}get ordinal(){return this.isValid?eO(this.c).ordinal:NaN}get monthShort(){return this.isValid?ro.months("short",{locObj:this.loc})[this.month-1]:null}get monthLong(){return this.isValid?ro.months("long",{locObj:this.loc})[this.month-1]:null}get weekdayShort(){return this.isValid?ro.weekdays("short",{locObj:this.loc})[this.weekday-1]:null}get weekdayLong(){return this.isValid?ro.weekdays("long",{locObj:this.loc})[this.weekday-1]:null}get offset(){return this.isValid?+this.o:NaN}get offsetNameShort(){return this.isValid?this.zone.offsetName(this.ts,{format:"short",locale:this.locale}):null}get offsetNameLong(){return this.isValid?this.zone.offsetName(this.ts,{format:"long",locale:this.locale}):null}get isOffsetFixed(){return this.isValid?this.zone.isUniversal:null}get isInDST(){return!this.isOffsetFixed&&(this.offset>this.set({month:1,day:1}).offset||this.offset>this.set({month:5}).offset)}getPossibleOffsets(){if(!this.isValid||this.isOffsetFixed)return[this];let e=e0(this.c),t=this.zone.offset(e-864e5),r=this.zone.offset(e+864e5),n=this.zone.offset(e-6e4*t),a=this.zone.offset(e-6e4*r);if(n===a)return[this];let i=e-6e4*n,s=e-6e4*a,o=rD(i,n),l=rD(s,a);return o.hour===l.hour&&o.minute===l.minute&&o.second===l.second&&o.millisecond===l.millisecond?[rA(this,{ts:i}),rA(this,{ts:s})]:[this]}get isInLeapYear(){return eQ(this.year)}get daysInMonth(){return eX(this.year,this.month)}get daysInYear(){return this.isValid?eZ(this.year):NaN}get weeksInWeekYear(){return this.isValid?e2(this.weekYear):NaN}get weeksInLocalWeekYear(){return this.isValid?e2(this.localWeekYear,this.loc.getMinDaysInFirstWeek(),this.loc.getStartOfWeek()):NaN}resolvedLocaleOptions(e={}){let{locale:t,numberingSystem:r,calendar:n}=tm.create(this.loc.clone(e),e).resolvedOptions(this);return{locale:t,numberingSystem:r,outputCalendar:n}}toUTC(e=0,t={}){return this.setZone(es.instance(e),t)}toLocal(){return this.setZone(eE.defaultZone)}setZone(e,{keepLocalTime:t=!1,keepCalendarTime:r=!1}={}){if((e=el(e,eE.defaultZone)).equals(this.zone))return this;{if(!e.isValid)return rW.invalid(rw(e));let a=this.ts;if(t||r){var n;let t=e.offset(this.ts),r=this.toObject();[a]=(n=e,rT(e0(r),t,n))}return rA(this,{ts:a,zone:e})}}reconfigure({locale:e,numberingSystem:t,outputCalendar:r}={}){return rA(this,{loc:this.loc.clone({locale:e,numberingSystem:t,outputCalendar:r})})}setLocale(e){return this.reconfigure({locale:e})}set(e){var t,r,n;let a;if(!this.isValid)return this;let i=e8(e,rV),{minDaysInFirstWeek:s,startOfWeek:o}=eM(i,this.loc),d=!eJ(i.weekYear)||!eJ(i.weekNumber)||!eJ(i.weekday),u=!eJ(i.ordinal),c=!eJ(i.year),p=!eJ(i.month)||!eJ(i.day),h=i.weekYear||i.weekNumber;if((c||p||u)&&h)throw new l("Can't mix weekYear/weekNumber units with year/month/day or ordinals");if(p&&u)throw new l("Can't mix ordinal dates with month/day");d?a=eC({...eD(this.c,s,o),...i},s,o):eJ(i.ordinal)?(a={...this.toObject(),...i},eJ(i.day)&&(a.day=Math.min(eX(a.year,a.month),a.day))):a=eR({...eO(this.c),...i});let[y,m]=(t=a,r=this.o,n=this.zone,rT(e0(t),r,n));return rA(this,{ts:y,o:m})}plus(e){return this.isValid?rA(this,rC(this,ra.fromDurationLike(e))):this}minus(e){return this.isValid?rA(this,rC(this,ra.fromDurationLike(e).negate())):this}startOf(e,{useLocaleWeeks:t=!1}={}){if(!this.isValid)return this;let r={},n=ra.normalizeUnit(e);switch(n){case"years":r.month=1;case"quarters":case"months":r.day=1;case"weeks":case"days":r.hour=0;case"hours":r.minute=0;case"minutes":r.second=0;case"seconds":r.millisecond=0}if("weeks"===n)if(t){let e=this.loc.getStartOfWeek(),{weekday:t}=this;t<e&&(r.weekNumber=this.weekNumber-1),r.weekday=e}else r.weekday=1;return"quarters"===n&&(r.month=(Math.ceil(this.month/3)-1)*3+1),this.set(r)}endOf(e,t){return this.isValid?this.plus({[e]:1}).startOf(e,t).minus(1):this}toFormat(e,t={}){return this.isValid?tm.create(this.loc.redefaultToEN(t)).formatDateTimeFromString(this,e):rk}toLocaleString(e=m,t={}){return this.isValid?tm.create(this.loc.clone(t),e).formatDateTime(this):rk}toLocaleParts(e={}){return this.isValid?tm.create(this.loc.clone(e),e).formatDateTimeParts(this):[]}toISO({format:e="extended",suppressSeconds:t=!1,suppressMilliseconds:r=!1,includeOffset:n=!0,extendedZone:a=!1,precision:i="milliseconds"}={}){if(!this.isValid)return null;i=rG(i);let s="extended"===e,o=rM(this,s,i);return r_.indexOf(i)>=3&&(o+="T"),o+=rP(this,s,t,r,n,a,i)}toISODate({format:e="extended",precision:t="day"}={}){return this.isValid?rM(this,"extended"===e,rG(t)):null}toISOWeekDate(){return rR(this,"kkkk-'W'WW-c")}toISOTime({suppressMilliseconds:e=!1,suppressSeconds:t=!1,includeOffset:r=!0,includePrefix:n=!1,extendedZone:a=!1,format:i="extended",precision:s="milliseconds"}={}){return this.isValid?(s=rG(s),(n&&r_.indexOf(s)>=3?"T":"")+rP(this,"extended"===i,t,e,r,a,s)):null}toRFC2822(){return rR(this,"EEE, dd LLL yyyy HH:mm:ss ZZZ",!1)}toHTTP(){return rR(this.toUTC(),"EEE, dd LLL yyyy HH:mm:ss 'GMT'")}toSQLDate(){return this.isValid?rM(this,!0):null}toSQLTime({includeOffset:e=!0,includeZone:t=!1,includeOffsetSpace:r=!0}={}){let n="HH:mm:ss.SSS";return(t||e)&&(r&&(n+=" "),t?n+="z":e&&(n+="ZZ")),rR(this,n,!0)}toSQL(e={}){return this.isValid?`${this.toSQLDate()} ${this.toSQLTime(e)}`:null}toString(){return this.isValid?this.toISO():rk}[Symbol.for("nodejs.util.inspect.custom")](){return this.isValid?`DateTime { ts: ${this.toISO()}, zone: ${this.zone.name}, locale: ${this.locale} }`:`DateTime { Invalid, reason: ${this.invalidReason} }`}valueOf(){return this.toMillis()}toMillis(){return this.isValid?this.ts:NaN}toSeconds(){return this.isValid?this.ts/1e3:NaN}toUnixInteger(){return this.isValid?Math.floor(this.ts/1e3):NaN}toJSON(){return this.toISO()}toBSON(){return this.toJSDate()}toObject(e={}){if(!this.isValid)return{};let t={...this.c};return e.includeConfig&&(t.outputCalendar=this.outputCalendar,t.numberingSystem=this.loc.numberingSystem,t.locale=this.loc.locale),t}toJSDate(){return new Date(this.isValid?this.ts:NaN)}diff(e,t="milliseconds",r={}){if(!this.isValid||!e.isValid)return ra.invalid("created by diffing an invalid DateTime");let n={locale:this.locale,numberingSystem:this.numberingSystem,...r},a=(Array.isArray(t)?t:[t]).map(ra.normalizeUnit),i=e.valueOf()>this.valueOf(),s=function(e,t,r,n){let[a,i,s,o]=function(e,t,r){let n,a,i={},s=e;for(let[o,l]of[["years",(e,t)=>t.year-e.year],["quarters",(e,t)=>t.quarter-e.quarter+(t.year-e.year)*4],["months",(e,t)=>t.month-e.month+(t.year-e.year)*12],["weeks",(e,t)=>{let r=rl(e,t);return(r-r%7)/7}],["days",rl]])r.indexOf(o)>=0&&(n=o,i[o]=l(e,t),(a=s.plus(i))>t?(i[o]--,(e=s.plus(i))>t&&(a=e,i[o]--,e=s.plus(i))):e=a);return[e,i,a,n]}(e,t,r),l=t-a,d=r.filter(e=>["hours","minutes","seconds","milliseconds"].indexOf(e)>=0);0===d.length&&(s<t&&(s=a.plus({[o]:1})),s!==a&&(i[o]=(i[o]||0)+l/(s-a)));let u=ra.fromObject(i,n);return d.length>0?ra.fromMillis(l,n).shiftTo(...d).plus(u):u}(i?this:e,i?e:this,a,n);return i?s.negate():s}diffNow(e="milliseconds",t={}){return this.diff(rW.now(),e,t)}until(e){return this.isValid?rs.fromDateTimes(this,e):this}hasSame(e,t,r){if(!this.isValid)return!1;let n=e.valueOf(),a=this.setZone(e.zone,{keepLocalTime:!0});return a.startOf(t,r)<=n&&n<=a.endOf(t,r)}equals(e){return this.isValid&&e.isValid&&this.valueOf()===e.valueOf()&&this.zone.equals(e.zone)&&this.loc.equals(e.loc)}toRelative(e={}){if(!this.isValid)return null;let t=e.base||rW.fromObject({},{zone:this.zone}),r=e.padding?this<t?-e.padding:e.padding:0,n=["years","months","days","hours","minutes","seconds"],a=e.unit;return Array.isArray(e.unit)&&(n=e.unit,a=void 0),rB(t,this.plus(r),{...e,numeric:"always",units:n,unit:a})}toRelativeCalendar(e={}){return this.isValid?rB(e.base||rW.fromObject({},{zone:this.zone}),this,{...e,numeric:"auto",units:["years","months","days"],calendary:!0}):null}static min(...e){if(!e.every(rW.isDateTime))throw new u("min requires all arguments be DateTimes");return eG(e,e=>e.valueOf(),Math.min)}static max(...e){if(!e.every(rW.isDateTime))throw new u("max requires all arguments be DateTimes");return eG(e,e=>e.valueOf(),Math.max)}static fromFormatExplain(e,t,r={}){let{locale:n=null,numberingSystem:a=null}=r;return rE(ea.fromOpts({locale:n,numberingSystem:a,defaultToEN:!0}),e,t)}static fromStringExplain(e,t,r={}){return rW.fromFormatExplain(e,t,r)}static buildFormatParser(e,t={}){let{locale:r=null,numberingSystem:n=null}=t;return new rS(ea.fromOpts({locale:r,numberingSystem:n,defaultToEN:!0}),e)}static fromFormatParser(e,t,r={}){if(eJ(e)||eJ(t))throw new u("fromFormatParser requires an input string and a format parser");let{locale:n=null,numberingSystem:a=null}=r,i=ea.fromOpts({locale:n,numberingSystem:a,defaultToEN:!0});if(!i.equals(t.locale))throw new u(`fromFormatParser called with a locale of ${i}, but the format parser was created for ${t.locale}`);let{result:s,zone:o,specificOffset:l,invalidReason:d}=t.explainFromTokens(e);return d?rW.invalid(d):rO(s,o,r,`format ${t.format}`,e,l)}static get DATE_SHORT(){return m}static get DATE_MED(){return f}static get DATE_MED_WITH_WEEKDAY(){return b}static get DATE_FULL(){return g}static get DATE_HUGE(){return K}static get TIME_SIMPLE(){return v}static get TIME_WITH_SECONDS(){return S}static get TIME_WITH_SHORT_OFFSET(){return E}static get TIME_WITH_LONG_OFFSET(){return I}static get TIME_24_SIMPLE(){return k}static get TIME_24_WITH_SECONDS(){return w}static get TIME_24_WITH_SHORT_OFFSET(){return j}static get TIME_24_WITH_LONG_OFFSET(){return x}static get DATETIME_SHORT(){return A}static get DATETIME_SHORT_WITH_SECONDS(){return T}static get DATETIME_MED(){return D}static get DATETIME_MED_WITH_SECONDS(){return C}static get DATETIME_MED_WITH_WEEKDAY(){return O}static get DATETIME_FULL(){return R}static get DATETIME_FULL_WITH_SECONDS(){return M}static get DATETIME_HUGE(){return P}static get DATETIME_HUGE_WITH_SECONDS(){return N}}function rH(e){if(rW.isDateTime(e))return e;if(e&&e.valueOf&&eL(e.valueOf()))return rW.fromJSDate(e);if(e&&"object"==typeof e)return rW.fromObject(e);throw new u(`Unknown datetime argument: ${e}, of type ${typeof e}`)}r.DateTime=rW,r.Duration=ra,r.FixedOffsetZone=es,r.IANAZone=V,r.Info=ro,r.Interval=rs,r.InvalidZone=eo,r.Settings=eE,r.SystemZone=_,r.VERSION="3.7.2",r.Zone=J},54418,(e,t,r)=>{"use strict";var n=e.r(95057);function a(e,t){var r={zone:t};if(e?e instanceof a?this._date=e._date:e instanceof Date?this._date=n.DateTime.fromJSDate(e,r):"number"==typeof e?this._date=n.DateTime.fromMillis(e,r):"string"==typeof e&&(this._date=n.DateTime.fromISO(e,r),this._date.isValid||(this._date=n.DateTime.fromRFC2822(e,r)),this._date.isValid||(this._date=n.DateTime.fromSQL(e,r)),this._date.isValid||(this._date=n.DateTime.fromFormat(e,"EEE, d MMM yyyy HH:mm:ss",r))):this._date=n.DateTime.local(),!this._date||!this._date.isValid)throw Error("CronDate: unhandled timestamp: "+JSON.stringify(e));t&&t!==this._date.zoneName&&(this._date=this._date.setZone(t))}a.prototype.addYear=function(){this._date=this._date.plus({years:1})},a.prototype.addMonth=function(){this._date=this._date.plus({months:1}).startOf("month")},a.prototype.addDay=function(){this._date=this._date.plus({days:1}).startOf("day")},a.prototype.addHour=function(){var e=this._date;this._date=this._date.plus({hours:1}).startOf("hour"),this._date<=e&&(this._date=this._date.plus({hours:1}))},a.prototype.addMinute=function(){var e=this._date;this._date=this._date.plus({minutes:1}).startOf("minute"),this._date<e&&(this._date=this._date.plus({hours:1}))},a.prototype.addSecond=function(){var e=this._date;this._date=this._date.plus({seconds:1}).startOf("second"),this._date<e&&(this._date=this._date.plus({hours:1}))},a.prototype.subtractYear=function(){this._date=this._date.minus({years:1})},a.prototype.subtractMonth=function(){this._date=this._date.minus({months:1}).endOf("month").startOf("second")},a.prototype.subtractDay=function(){this._date=this._date.minus({days:1}).endOf("day").startOf("second")},a.prototype.subtractHour=function(){var e=this._date;this._date=this._date.minus({hours:1}).endOf("hour").startOf("second"),this._date>=e&&(this._date=this._date.minus({hours:1}))},a.prototype.subtractMinute=function(){var e=this._date;this._date=this._date.minus({minutes:1}).endOf("minute").startOf("second"),this._date>e&&(this._date=this._date.minus({hours:1}))},a.prototype.subtractSecond=function(){var e=this._date;this._date=this._date.minus({seconds:1}).startOf("second"),this._date>e&&(this._date=this._date.minus({hours:1}))},a.prototype.getDate=function(){return this._date.day},a.prototype.getFullYear=function(){return this._date.year},a.prototype.getDay=function(){var e=this._date.weekday;return 7==e?0:e},a.prototype.getMonth=function(){return this._date.month-1},a.prototype.getHours=function(){return this._date.hour},a.prototype.getMinutes=function(){return this._date.minute},a.prototype.getSeconds=function(){return this._date.second},a.prototype.getMilliseconds=function(){return this._date.millisecond},a.prototype.getTime=function(){return this._date.valueOf()},a.prototype.getUTCDate=function(){return this._getUTC().day},a.prototype.getUTCFullYear=function(){return this._getUTC().year},a.prototype.getUTCDay=function(){var e=this._getUTC().weekday;return 7==e?0:e},a.prototype.getUTCMonth=function(){return this._getUTC().month-1},a.prototype.getUTCHours=function(){return this._getUTC().hour},a.prototype.getUTCMinutes=function(){return this._getUTC().minute},a.prototype.getUTCSeconds=function(){return this._getUTC().second},a.prototype.toISOString=function(){return this._date.toUTC().toISO()},a.prototype.toJSON=function(){return this._date.toJSON()},a.prototype.setDate=function(e){this._date=this._date.set({day:e})},a.prototype.setFullYear=function(e){this._date=this._date.set({year:e})},a.prototype.setDay=function(e){this._date=this._date.set({weekday:e})},a.prototype.setMonth=function(e){this._date=this._date.set({month:e+1})},a.prototype.setHours=function(e){this._date=this._date.set({hour:e})},a.prototype.setMinutes=function(e){this._date=this._date.set({minute:e})},a.prototype.setSeconds=function(e){this._date=this._date.set({second:e})},a.prototype.setMilliseconds=function(e){this._date=this._date.set({millisecond:e})},a.prototype._getUTC=function(){return this._date.toUTC()},a.prototype.toString=function(){return this.toDate().toString()},a.prototype.toDate=function(){return this._date.toJSDate()},a.prototype.isLastDayOfMonth=function(){var e=this._date.plus({days:1}).startOf("day");return this._date.month!==e.month},a.prototype.isLastWeekdayOfMonth=function(){var e=this._date.plus({days:7}).startOf("day");return this._date.month!==e.month},t.exports=a},10764,(e,t,r)=>{"use strict";function n(e){return{start:e,count:1}}function a(e,t){e.end=t,e.step=t-e.start,e.count=2}function i(e,t,r){t&&(2===t.count?(e.push(n(t.start)),e.push(n(t.end))):e.push(t)),r&&e.push(r)}t.exports=function(e){for(var t=[],r=void 0,s=0;s<e.length;s++){var o=e[s];"number"!=typeof o?(i(t,r,n(o)),r=void 0):r?1===r.count?a(r,o):r.step===o-r.end?(r.count++,r.end=o):2===r.count?(t.push(n(r.start)),a(r=n(r.end),o)):(i(t,r),r=n(o)):r=n(o)}return i(t,r),t}},23925,(e,t,r)=>{"use strict";var n=e.r(10764);t.exports=function(e,t,r){var a=n(e);if(1===a.length){var i=a[0],s=i.step;if(1===s&&i.start===t&&i.end===r)return"*";if(1!==s&&i.start===t&&i.end===r-s+1)return"*/"+s}for(var o=[],l=0,d=a.length;l<d;++l){var u=a[l];if(1===u.count){o.push(u.start);continue}var s=u.step;if(1===u.step){o.push(u.start+"-"+u.end);continue}var c=0==u.start?u.count-1:u.count;u.step*c>u.end?o=o.concat(Array.from({length:u.end-u.start+1}).map(function(e,t){var r=u.start+t;return(r-u.start)%u.step==0?r:null}).filter(function(e){return null!=e})):u.end===r-u.step+1?o.push(u.start+"/"+u.step):o.push(u.start+"-"+u.end+"/"+u.step)}return o.join(",")}},80435,(e,t,r)=>{"use strict";var n=e.r(54418),a=e.r(23925);function i(e,t){this._options=t,this._utc=t.utc||!1,this._tz=this._utc?"UTC":t.tz,this._currentDate=new n(t.currentDate,this._tz),this._startDate=t.startDate?new n(t.startDate,this._tz):null,this._endDate=t.endDate?new n(t.endDate,this._tz):null,this._isIterator=t.iterator||!1,this._hasIterated=!1,this._nthDayOfWeek=t.nthDayOfWeek||0,this.fields=i._freezeFields(e)}i.map=["second","minute","hour","dayOfMonth","month","dayOfWeek"],i.predefined={"@yearly":"0 0 1 1 *","@monthly":"0 0 1 * *","@weekly":"0 0 * * 0","@daily":"0 0 * * *","@hourly":"0 * * * *"},i.constraints=[{min:0,max:59,chars:[]},{min:0,max:59,chars:[]},{min:0,max:23,chars:[]},{min:1,max:31,chars:["L"]},{min:1,max:12,chars:[]},{min:0,max:7,chars:["L"]}],i.daysInMonth=[31,29,31,30,31,30,31,31,30,31,30,31],i.aliases={month:{jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12},dayOfWeek:{sun:0,mon:1,tue:2,wed:3,thu:4,fri:5,sat:6}},i.parseDefaults=["0","*","*","*","*","*"],i.standardValidCharacters=/^[,*\d/-]+$/,i.dayOfWeekValidCharacters=/^[?,*\dL#/-]+$/,i.dayOfMonthValidCharacters=/^[?,*\dL/-]+$/,i.validCharacters={second:i.standardValidCharacters,minute:i.standardValidCharacters,hour:i.standardValidCharacters,dayOfMonth:i.dayOfMonthValidCharacters,month:i.standardValidCharacters,dayOfWeek:i.dayOfWeekValidCharacters},i._isValidConstraintChar=function(e,t){return"string"==typeof t&&e.chars.some(function(e){return t.indexOf(e)>-1})},i._parseField=function(e,t,r){switch(e){case"month":case"dayOfWeek":var n=i.aliases[e];t=t.replace(/[a-z]{3}/gi,function(e){if(void 0!==n[e=e.toLowerCase()])return n[e];throw Error('Validation error, cannot resolve alias "'+e+'"')})}if(!i.validCharacters[e].test(t))throw Error("Invalid characters, got value: "+t);function a(e){var t=e.split("/");if(t.length>2)throw Error("Invalid repeat: "+e);return t.length>1?(t[0]==+t[0]&&(t=[t[0]+"-"+r.max,t[1]]),s(t[0],t[t.length-1])):s(e,1)}function s(t,n){var a=[],i=t.split("-");if(i.length>1){if(i.length<2)return+t;if(!i[0].length){if(!i[1].length)throw Error("Invalid range: "+t);return+t}var s=+i[0],o=+i[1];if(Number.isNaN(s)||Number.isNaN(o)||s<r.min||o>r.max)throw Error("Constraint error, got range "+s+"-"+o+" expected range "+r.min+"-"+r.max);if(s>o)throw Error("Invalid range: "+t);var l=+n;if(Number.isNaN(l)||l<=0)throw Error("Constraint error, cannot repeat at every "+l+" time.");"dayOfWeek"===e&&o%7==0&&a.push(0);for(var d=s;d<=o;d++)-1===a.indexOf(d)&&l>0&&l%n==0?(l=1,a.push(d)):l++;return a}return Number.isNaN(+t)?t:+t}return -1!==t.indexOf("*")?t=t.replace(/\*/g,r.min+"-"+r.max):-1!==t.indexOf("?")&&(t=t.replace(/\?/g,r.min+"-"+r.max)),function(t){var n=[];function s(t){if(t instanceof Array)for(var a=0,s=t.length;a<s;a++){var o=t[a];if(i._isValidConstraintChar(r,o)){n.push(o);continue}if("number"!=typeof o||Number.isNaN(o)||o<r.min||o>r.max)throw Error("Constraint error, got value "+o+" expected range "+r.min+"-"+r.max);n.push(o)}else{if(i._isValidConstraintChar(r,t))return void n.push(t);var l=+t;if(Number.isNaN(l)||l<r.min||l>r.max)throw Error("Constraint error, got value "+t+" expected range "+r.min+"-"+r.max);"dayOfWeek"===e&&(l%=7),n.push(l)}}var o=t.split(",");if(!o.every(function(e){return e.length>0}))throw Error("Invalid list value format");if(o.length>1)for(var l=0,d=o.length;l<d;l++)s(a(o[l]));else s(a(t));return n.sort(i._sortCompareFn),n}(t)},i._sortCompareFn=function(e,t){var r="number"==typeof e,n="number"==typeof t;return r&&n?e-t:!r&&n?1:r&&!n?-1:e.localeCompare(t)},i._handleMaxDaysInMonth=function(e){if(1===e.month.length){var t=i.daysInMonth[e.month[0]-1];if(e.dayOfMonth[0]>t)throw Error("Invalid explicit day of month definition");return e.dayOfMonth.filter(function(e){return"L"===e||e<=t}).sort(i._sortCompareFn)}},i._freezeFields=function(e){for(var t=0,r=i.map.length;t<r;++t){var n=i.map[t],a=e[n];e[n]=Object.freeze(a)}return Object.freeze(e)},i.prototype._applyTimezoneShift=function(e,t,r){if("Month"===r||"Day"===r){var n=e.getTime();e[t+r](),n===e.getTime()&&(0===e.getMinutes()&&0===e.getSeconds()?e.addHour():59===e.getMinutes()&&59===e.getSeconds()&&e.subtractHour())}else{var a=e.getHours();e[t+r]();var i=e.getHours(),s=i-a;2===s?24!==this.fields.hour.length&&(this._dstStart=i):0===s&&0===e.getMinutes()&&0===e.getSeconds()&&24!==this.fields.hour.length&&(this._dstEnd=i)}},i.prototype._findSchedule=function(e){function t(e,t){for(var r=0,n=t.length;r<n;r++)if(t[r]>=e)return t[r]===e;return t[0]===e}function r(e){return e.length>0&&e.some(function(e){return"string"==typeof e&&e.indexOf("L")>=0})}for(var a=(e=e||!1)?"subtract":"add",s=new n(this._currentDate,this._tz),o=this._startDate,l=this._endDate,d=s.getTime(),u=0;u<1e4;){if(u++,e){if(o&&s.getTime()-o.getTime()<0)throw Error("Out of the timespan range")}else if(l&&l.getTime()-s.getTime()<0)throw Error("Out of the timespan range");var c=t(s.getDate(),this.fields.dayOfMonth);r(this.fields.dayOfMonth)&&(c=c||s.isLastDayOfMonth());var p=t(s.getDay(),this.fields.dayOfWeek);r(this.fields.dayOfWeek)&&(p=p||this.fields.dayOfWeek.some(function(e){if(!r([e]))return!1;var t=Number.parseInt(e[0])%7;if(Number.isNaN(t))throw Error("Invalid last weekday of the month expression: "+e);return s.getDay()===t&&s.isLastWeekdayOfMonth()}));var h=this.fields.dayOfMonth.length>=i.daysInMonth[s.getMonth()],y=this.fields.dayOfWeek.length===i.constraints[5].max-i.constraints[5].min+1,m=s.getHours();if(!c&&(!p||y)||!h&&y&&!c||h&&!y&&!p||this._nthDayOfWeek>0&&!function(e,t){if(t<6){if(8>e.getDate()&&1===t)return!0;var r=e.getDate()%7?1:0;return Math.floor((e.getDate()-e.getDate()%7)/7)+r===t}return!1}(s,this._nthDayOfWeek)){this._applyTimezoneShift(s,a,"Day");continue}if(!t(s.getMonth()+1,this.fields.month)){this._applyTimezoneShift(s,a,"Month");continue}if(t(m,this.fields.hour)){if(this._dstEnd===m&&!e){this._dstEnd=null,this._applyTimezoneShift(s,"add","Hour");continue}}else if(this._dstStart!==m){this._dstStart=null,this._applyTimezoneShift(s,a,"Hour");continue}else if(!t(m-1,this.fields.hour)){s[a+"Hour"]();continue}if(!t(s.getMinutes(),this.fields.minute)){this._applyTimezoneShift(s,a,"Minute");continue}if(!t(s.getSeconds(),this.fields.second)){this._applyTimezoneShift(s,a,"Second");continue}if(d===s.getTime()){"add"===a||0===s.getMilliseconds()?this._applyTimezoneShift(s,a,"Second"):s.setMilliseconds(0);continue}break}if(u>=1e4)throw Error("Invalid expression, loop limit exceeded");return this._currentDate=new n(s,this._tz),this._hasIterated=!0,s},i.prototype.next=function(){var e=this._findSchedule();return this._isIterator?{value:e,done:!this.hasNext()}:e},i.prototype.prev=function(){var e=this._findSchedule(!0);return this._isIterator?{value:e,done:!this.hasPrev()}:e},i.prototype.hasNext=function(){var e=this._currentDate,t=this._hasIterated;try{return this._findSchedule(),!0}catch(e){return!1}finally{this._currentDate=e,this._hasIterated=t}},i.prototype.hasPrev=function(){var e=this._currentDate,t=this._hasIterated;try{return this._findSchedule(!0),!0}catch(e){return!1}finally{this._currentDate=e,this._hasIterated=t}},i.prototype.iterate=function(e,t){var r=[];if(e>=0)for(var n=0,a=e;n<a;n++)try{var i=this.next();r.push(i),t&&t(i,n)}catch(e){break}else for(var n=0,a=e;n>a;n--)try{var i=this.prev();r.push(i),t&&t(i,n)}catch(e){break}return r},i.prototype.reset=function(e){this._currentDate=new n(e||this._options.currentDate)},i.prototype.stringify=function(e){for(var t=[],r=+!e,n=i.map.length;r<n;++r){var s=i.map[r],o=this.fields[s],l=i.constraints[r];"dayOfMonth"===s&&1===this.fields.month.length?l={min:1,max:i.daysInMonth[this.fields.month[0]-1]}:"dayOfWeek"===s&&(l={min:0,max:6},o=7===o[o.length-1]?o.slice(0,-1):o),t.push(a(o,l.min,l.max))}return t.join(" ")},i.parse=function(e,t){var r=this;return"function"==typeof t&&(t={}),function(e,t){t||(t={}),void 0===t.currentDate&&(t.currentDate=new n(void 0,r._tz)),i.predefined[e]&&(e=i.predefined[e]);var a=[],s=(e+"").trim().split(/\s+/);if(s.length>6)throw Error("Invalid cron expression");for(var o=i.map.length-s.length,l=0,d=i.map.length;l<d;++l){var u=i.map[l],c=s[s.length>d?l:l-o];if(l<o||!c)a.push(i._parseField(u,i.parseDefaults[l],i.constraints[l]));else{var p="dayOfWeek"===u?function(e){var r=e.split("#");if(r.length>1){var n=+r[r.length-1];if(/,/.test(e))throw Error("Constraint error, invalid dayOfWeek `#` and `,` special characters are incompatible");if(/\//.test(e))throw Error("Constraint error, invalid dayOfWeek `#` and `/` special characters are incompatible");if(/-/.test(e))throw Error("Constraint error, invalid dayOfWeek `#` and `-` special characters are incompatible");if(r.length>2||Number.isNaN(n)||n<1||n>5)throw Error("Constraint error, invalid dayOfWeek occurrence number (#)");return t.nthDayOfWeek=n,r[0]}return e}(c):c;a.push(i._parseField(u,p,i.constraints[l]))}}for(var h={},l=0,d=i.map.length;l<d;l++)h[i.map[l]]=a[l];var y=i._handleMaxDaysInMonth(h);return h.dayOfMonth=y||h.dayOfMonth,new i(h,t)}(e,t)},i.fieldsToExpression=function(e,t){for(var r={},n=0,a=i.map.length;n<a;++n){var s=i.map[n],o=e[s];!function(e,t,r){if(!t)throw Error("Validation error, Field "+e+" is missing");if(0===t.length)throw Error("Validation error, Field "+e+" contains no values");for(var n=0,a=t.length;n<a;n++){var s=t[n];if(!i._isValidConstraintChar(r,s)&&("number"!=typeof s||Number.isNaN(s)||s<r.min||s>r.max))throw Error("Constraint error, got value "+s+" expected range "+r.min+"-"+r.max)}}(s,o,i.constraints[n]);for(var l=[],d=-1;++d<o.length;)l[d]=o[d];if((o=l.sort(i._sortCompareFn).filter(function(e,t,r){return!t||e!==r[t-1]})).length!==l.length)throw Error("Validation error, Field "+s+" contains duplicate values");r[s]=o}var u=i._handleMaxDaysInMonth(r);return r.dayOfMonth=u||r.dayOfMonth,new i(r,t||{})},t.exports=i},26938,(e,t,r)=>{"use strict";var n=e.r(80435);function a(){}a._parseEntry=function(e){var t=e.split(" ");if(6===t.length)return{interval:n.parse(e)};if(t.length>6)return{interval:n.parse(t.slice(0,6).join(" ")),command:t.slice(6,t.length)};throw Error("Invalid entry: "+e)},a.parseExpression=function(e,t){return n.parse(e,t)},a.fieldsToExpression=function(e,t){return n.fieldsToExpression(e,t)},a.parseString=function(e){for(var t=e.split("\n"),r={variables:{},expressions:[],errors:{}},n=0,i=t.length;n<i;n++){var s=t[n],o=null,l=s.trim();if(l.length>0)if(l.match(/^#/))continue;else if(o=l.match(/^(.*)=(.*)$/))r.variables[o[1]]=o[2];else{var d=null;try{d=a._parseEntry("0 "+l),r.expressions.push(d.interval)}catch(e){r.errors[l]=e}}}return r},a.parseFile=function(t,r){e.r(22734).readFile(t,function(e,t){return e?void r(e):r(null,a.parseString(t.toString()))})},t.exports=a},22660,68486,99663,70322,e=>{"use strict";let t,r,n,a,i,s,o;class l{static normalize(e){return Number.isFinite(e)?{type:"fixed",delay:e}:e||void 0}static calculate(e,t,r,n,a){if(e)return(function(e,t){if(e.type in l.builtinStrategies)return l.builtinStrategies[e.type](e.delay,e.jitter);if(t)return t;throw Error(`Unknown backoff strategy ${e.type}.
      If a custom backoff strategy is used, specify it when the queue is created.`)})(e,a)(t,e.type,r,n)}}l.builtinStrategies={fixed:function(e,t=0){return function(){return t>0?Math.floor(Math.random()*e*t+e*(1-t)):e}},exponential:function(e,t=0){return function(r){if(!(t>0))return Math.round(Math.pow(2,r-1)*e);{let n=Math.round(Math.pow(2,r-1)*e);return Math.floor(Math.random()*n*t+n*(1-t))}}}},e.i(33405);var d,u,c,p,h,y,m,f,b,g,K,v,S,E,I,k,w,j,x,A,T,D,C,O,R,M,P=e.i(4446);e.i(37702),(d=g||(g={}))[d.Init=0]="Init",d[d.Start=1]="Start",d[d.Stop=2]="Stop",d[d.GetChildrenValuesResponse=3]="GetChildrenValuesResponse",d[d.GetIgnoredChildrenFailuresResponse=4]="GetIgnoredChildrenFailuresResponse",d[d.GetDependenciesCountResponse=5]="GetDependenciesCountResponse",d[d.MoveToWaitingChildrenResponse=6]="MoveToWaitingChildrenResponse",d[d.Cancel=7]="Cancel",d[d.GetDependenciesResponse=8]="GetDependenciesResponse",(u=K||(K={}))[u.JobNotExist=-1]="JobNotExist",u[u.JobLockNotExist=-2]="JobLockNotExist",u[u.JobNotInState=-3]="JobNotInState",u[u.JobPendingChildren=-4]="JobPendingChildren",u[u.ParentJobNotExist=-5]="ParentJobNotExist",u[u.JobLockMismatch=-6]="JobLockMismatch",u[u.ParentJobCannotBeReplaced=-7]="ParentJobCannotBeReplaced",u[u.JobBelongsToJobScheduler=-8]="JobBelongsToJobScheduler",u[u.JobHasFailedChildren=-9]="JobHasFailedChildren",u[u.SchedulerJobIdCollision=-10]="SchedulerJobIdCollision",u[u.SchedulerJobSlotsBusy=-11]="SchedulerJobSlotsBusy",(c=v||(v={}))[c.Completed=0]="Completed",c[c.Error=1]="Error",c[c.Failed=2]="Failed",c[c.InitFailed=3]="InitFailed",c[c.InitCompleted=4]="InitCompleted",c[c.Log=5]="Log",c[c.MoveToDelayed=6]="MoveToDelayed",c[c.MoveToWait=7]="MoveToWait",c[c.Progress=8]="Progress",c[c.Update=9]="Update",c[c.GetChildrenValues=10]="GetChildrenValues",c[c.GetIgnoredChildrenFailures=11]="GetIgnoredChildrenFailures",c[c.GetDependenciesCount=12]="GetDependenciesCount",c[c.MoveToWaitingChildren=13]="MoveToWaitingChildren",c[c.GetDependencies=14]="GetDependencies",(p=S||(S={}))[p.ONE_MINUTE=1]="ONE_MINUTE",p[p.FIVE_MINUTES=5]="FIVE_MINUTES",p[p.FIFTEEN_MINUTES=15]="FIFTEEN_MINUTES",p[p.THIRTY_MINUTES=30]="THIRTY_MINUTES",p[p.ONE_HOUR=60]="ONE_HOUR",p[p.ONE_WEEK=10080]="ONE_WEEK",p[p.TWO_WEEKS=20160]="TWO_WEEKS",p[p.ONE_MONTH=80640]="ONE_MONTH",(h=E||(E={})).QueueName="bullmq.queue.name",h.QueueOperation="bullmq.queue.operation",h.BulkCount="bullmq.job.bulk.count",h.BulkNames="bullmq.job.bulk.names",h.JobName="bullmq.job.name",h.JobId="bullmq.job.id",h.JobKey="bullmq.job.key",h.JobIds="bullmq.job.ids",h.JobAttemptsMade="bullmq.job.attempts.made",h.DeduplicationKey="bullmq.job.deduplication.key",h.JobOptions="bullmq.job.options",h.JobProgress="bullmq.job.progress",h.QueueDrainDelay="bullmq.queue.drain.delay",h.QueueGrace="bullmq.queue.grace",h.QueueCleanLimit="bullmq.queue.clean.limit",h.QueueRateLimit="bullmq.queue.rate.limit",h.JobType="bullmq.job.type",h.QueueOptions="bullmq.queue.options",h.QueueEventMaxLength="bullmq.queue.event.max.length",h.QueueJobsState="bullmq.queue.jobs.state",h.WorkerOptions="bullmq.worker.options",h.WorkerName="bullmq.worker.name",h.WorkerId="bullmq.worker.id",h.WorkerRateLimit="bullmq.worker.rate.limit",h.WorkerDoNotWaitActive="bullmq.worker.do.not.wait.active",h.WorkerForceClose="bullmq.worker.force.close",h.WorkerStalledJobs="bullmq.worker.stalled.jobs",h.WorkerFailedJobs="bullmq.worker.failed.jobs",h.WorkerJobsToExtendLocks="bullmq.worker.jobs.to.extend.locks",h.JobFinishedTimestamp="bullmq.job.finished.timestamp",h.JobAttemptFinishedTimestamp="bullmq.job.attempt_finished_timestamp",h.JobProcessedTimestamp="bullmq.job.processed.timestamp",h.JobResult="bullmq.job.result",h.JobFailedReason="bullmq.job.failed.reason",h.FlowName="bullmq.flow.name",h.JobSchedulerId="bullmq.job.scheduler.id",h.JobStatus="bullmq.job.status",(y=I||(I={})).QueueJobsCount="bullmq.queue.jobs",y.JobsCompleted="bullmq.jobs.completed",y.JobsFailed="bullmq.jobs.failed",y.JobsDelayed="bullmq.jobs.delayed",y.JobsRetried="bullmq.jobs.retried",y.JobsWaiting="bullmq.jobs.waiting",y.JobsWaitingChildren="bullmq.jobs.waiting_children",y.JobDuration="bullmq.job.duration",(m=k||(k={}))[m.INTERNAL=0]="INTERNAL",m[m.SERVER=1]="SERVER",m[m.CLIENT=2]="CLIENT",m[m.PRODUCER=3]="PRODUCER",m[m.CONSUMER=4]="CONSUMER";var N=e.i(27699);N.EventEmitter;e.i(14747);var J=e.i(50245);globalThis.AbortController||J.AbortController;var L=e.i(54799),_=e.i(26898);class F extends Error{constructor(e,t){super(null!=e?e:"Connection is closed"),this.cause=t,this.name="ConnectionClosedError",Object.setPrototypeOf(this,new.target.prototype)}}var q=e.i(50015);let G={value:null};function V(e,t,r){try{return e.apply(t,r)}catch(e){return G.value=e,G}}function Y(e){let t={};for(let r=0;r<e.length;r+=2)t[e[r]]=e[r+1];return t}function B(e){let t=[];for(let r in e)Object.prototype.hasOwnProperty.call(e,r)&&void 0!==e[r]&&(t[t.length]=r,t[t.length]=e[r]);return t}function z(e,t){let r=e.getMaxListeners();e.setMaxListeners(r+t)}let U={de:"deduplication",fpof:"failParentOnFailure",cpof:"continueParentOnFailure",idof:"ignoreDependencyOnFailure",kl:"keepLogs",rdof:"removeDependencyOnFailure"},W=Object.assign(Object.assign({},Object.entries(U).reduce((e,[t,r])=>(e[r]=t,e),{})),{debounce:"de"});function H(e){return!!e&&["connect","disconnect","duplicate"].every(t=>"function"==typeof e[t])}function $(e){return H(e)&&!!e.isCluster}function Q(e){if(e)return`${e.queue}:${e.id}`}let Z=/ERR unknown command ['`]\s*client\s*['`]/;function X(e){if(e instanceof F)return!1;let{code:t,message:r}=e;return r!==_.CONNECTION_CLOSED_ERROR_MSG&&!r.includes("ECONNREFUSED")&&"ECONNREFUSED"!==t}let ee=(e,t,r,n="redis")=>{if(r===n){let r=q.valid(q.coerce(e));return q.lt(r,t)}return!1},et=e=>{let t={};for(let r of Object.entries(e))t[r[0]]=JSON.parse(r[1]);return t};async function er(e,t,r,n,a,i,s){if(!e)return i();{let o,{tracer:l,contextManager:d}=e,u=d.active();s&&(o=d.fromMetadata(u,s));let c=a?`${n} ${a}`:n,p=l.startSpan(c,{kind:t},o);try{let e,a;return p.setAttributes({[E.QueueName]:r,[E.QueueOperation]:n}),e=t===k.CONSUMER&&o?p.setSpanOnContext(o):p.setSpanOnContext(u),2==i.length&&(a=d.getMetadata(e)),await d.with(e,()=>i(p,a))}catch(e){throw p.recordException(e),e}finally{p.end()}}}(f=w||(w={}))[f.Idle=0]="Idle",f[f.Started=1]="Started",f[f.Terminating=2]="Terminating",f[f.Errored=3]="Errored";function en(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&0>t.indexOf(n)&&(r[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var a=0,n=Object.getOwnPropertySymbols(e);a<n.length;a++)0>t.indexOf(n[a])&&Object.prototype.propertyIsEnumerable.call(e,n[a])&&(r[n[a]]=e[n[a]]);return r}var ea=("function"==typeof SuppressedError&&SuppressedError,e.i(24361));try{j=new TextDecoder}catch(e){}var ei=0;let es=[];var eo=es,el=0,ed={},eu=0,ec=0,ep=[],eh={useRecords:!1,mapsAsObjects:!0};class ey{}let em=new ey;em.name="MessagePack 0xC1";var ef=!1,eb=2;class eg{constructor(e){e&&(!1===e.useRecords&&void 0===e.mapsAsObjects&&(e.mapsAsObjects=!0),e.sequential&&!1!==e.trusted&&(e.trusted=!0,!e.structures&&!1!=e.useRecords&&(e.structures=[],e.maxSharedStructures||(e.maxSharedStructures=0))),e.structures?e.structures.sharedLength=e.structures.length:e.getStructures&&((e.structures=[]).uninitialized=!0,e.structures.sharedLength=0),e.int64AsNumber&&(e.int64AsType="number")),Object.assign(this,e)}unpack(e,t){if(x)return eU(()=>(eW(),this?this.unpack(e,t):eg.prototype.unpack.call(eh,e,t)));e.buffer||e.constructor!==ArrayBuffer||(e="u">typeof Buffer?Buffer.from(e):new Uint8Array(e)),"object"==typeof t?(A=t.end||e.length,ei=t.start||0):(ei=0,A=t>-1?t:e.length),el=0,ec=0,D=null,eo=es,C=null,x=e;try{R=e.dataView||(e.dataView=new DataView(e.buffer,e.byteOffset,e.byteLength))}catch(t){if(x=null,e instanceof Uint8Array)throw t;throw Error("Source must be a Uint8Array or Buffer but was a "+(e&&"object"==typeof e?e.constructor.name:typeof e))}return this instanceof eg?(ed=this,this.structures?T=this.structures:(!T||T.length>0)&&(T=[])):(ed=eh,(!T||T.length>0)&&(T=[])),eK(t)}unpackMultiple(e,t){let r,n=0;try{ef=!0;let a=e.length,i=this?this.unpack(e,a):e$.unpack(e,a);if(t){if(!1===t(i,n,ei))return;for(;ei<a;)if(n=ei,!1===t(eK(),n,ei))return}else{for(r=[i];ei<a;)n=ei,r.push(eK());return r}}catch(e){throw e.lastPosition=n,e.values=r,e}finally{ef=!1,eW()}}_mergeStructures(e,t){this._onLoadedStructures&&(e=this._onLoadedStructures(e)),Object.isFrozen(e=e||[])&&(e=e.map(e=>e.slice(0)));for(let t=0,r=e.length;t<r;t++){let r=e[t];r&&(r.isShared=!0,t>=32&&(r.highByte=t-32>>5))}for(let r in e.sharedLength=e.length,t||[])if(r>=0){let n=e[r],a=t[r];a&&(n&&((e.restoreStructures||(e.restoreStructures=[]))[r]=n),e[r]=a)}return this.structures=e}decode(e,t){return this.unpack(e,t)}}function eK(e){try{let t;if(!ed.trusted&&!ef){let e=T.sharedLength||0;e<T.length&&(T.length=e)}if(ed._readStruct&&x[ei]<64&&x[ei]>=32?(t=ed._readStruct(x,ei,A),x=null,!(e&&e.lazy)&&t&&(t=t.toJSON()),ei=A):t=eS(),C&&(ei=C.postBundlePosition,C=null),ef&&(T.restoreStructures=null),ei==A)T&&T.restoreStructures&&ev(),T=null,x=null,O&&(O=null);else if(ei>A)throw Error("Unexpected end of MessagePack data");else if(!ef){let e;try{e=JSON.stringify(t,(e,t)=>"bigint"==typeof t?`${t}n`:t).slice(0,100)}catch(t){e="(JSON view not available "+t+")"}throw Error("Data read, but end of buffer not reached "+e)}return t}catch(e){throw T&&T.restoreStructures&&ev(),eW(),(e instanceof RangeError||e.message.startsWith("Unexpected end of buffer")||ei>A)&&(e.incomplete=!0),e}}function ev(){for(let e in T.restoreStructures)T[e]=T.restoreStructures[e];T.restoreStructures=null}function eS(){let e=x[ei++];if(e<160)if(e<128)if(e<64)return e;else{let t=T[63&e]||ed.getStructures&&ew()[63&e];return t?(t.read||(t.read=eI(t,63&e)),t.read()):e}else if(e<144){if(e-=128,ed.mapsAsObjects){let t={};for(let r=0;r<e;r++){let e=eF();"__proto__"===e&&(e="__proto_"),t[e]=eS()}return t}{let t=new Map;for(let r=0;r<e;r++)t.set(eS(),eS());return t}}else{let t=Array(e-=144);for(let r=0;r<e;r++)t[r]=eS();return ed.freezeData?Object.freeze(t):t}if(e<192){let t=e-160;if(ec>=ei)return D.slice(ei-eu,(ei+=t)-eu);if(0==ec&&A<140){let e=t<16?eP(t):eM(t);if(null!=e)return e}return ej(t)}{let t;switch(e){case 192:return null;case 193:if(C){if((t=eS())>0)return C[1].slice(C.position1,C.position1+=t);return C[0].slice(C.position0,C.position0-=t)}return em;case 194:return!1;case 195:return!0;case 196:if(void 0===(t=x[ei++]))throw Error("Unexpected end of buffer");return eJ(t);case 197:return t=R.getUint16(ei),ei+=2,eJ(t);case 198:return t=R.getUint32(ei),ei+=4,eJ(t);case 199:return eL(x[ei++]);case 200:return t=R.getUint16(ei),ei+=2,eL(t);case 201:return t=R.getUint32(ei),ei+=4,eL(t);case 202:if(t=R.getFloat32(ei),ed.useFloat32>2){let e=eH[(127&x[ei])<<1|x[ei+1]>>7];return ei+=4,(e*t+(t>0?.5:-.5)|0)/e}return ei+=4,t;case 203:return t=R.getFloat64(ei),ei+=8,t;case 204:return x[ei++];case 205:return t=R.getUint16(ei),ei+=2,t;case 206:return t=R.getUint32(ei),ei+=4,t;case 207:return"number"===ed.int64AsType?t=0x100000000*R.getUint32(ei)+R.getUint32(ei+4):"string"===ed.int64AsType?t=R.getBigUint64(ei).toString():"auto"===ed.int64AsType?(t=R.getBigUint64(ei))<=BigInt(2)<<BigInt(52)&&(t=Number(t)):t=R.getBigUint64(ei),ei+=8,t;case 208:return R.getInt8(ei++);case 209:return t=R.getInt16(ei),ei+=2,t;case 210:return t=R.getInt32(ei),ei+=4,t;case 211:return"number"===ed.int64AsType?t=0x100000000*R.getInt32(ei)+R.getUint32(ei+4):"string"===ed.int64AsType?t=R.getBigInt64(ei).toString():"auto"===ed.int64AsType?(t=R.getBigInt64(ei))>=BigInt(-2)<<BigInt(52)&&t<=BigInt(2)<<BigInt(52)&&(t=Number(t)):t=R.getBigInt64(ei),ei+=8,t;case 212:if(114==(t=x[ei++]))return eG(63&x[ei++]);{let e=ep[t];if(e)if(e.read)return ei++,e.read(eS());else if(e.noBuffer)return ei++,e();else return e(x.subarray(ei,++ei));throw Error("Unknown extension "+t)}case 213:if(114==(t=x[ei]))return ei++,eG(63&x[ei++],x[ei++]);return eL(2);case 214:return eL(4);case 215:return eL(8);case 216:return eL(16);case 217:if(t=x[ei++],ec>=ei)return D.slice(ei-eu,(ei+=t)-eu);return ex(t);case 218:if(t=R.getUint16(ei),ei+=2,ec>=ei)return D.slice(ei-eu,(ei+=t)-eu);return eA(t);case 219:if(t=R.getUint32(ei),ei+=4,ec>=ei)return D.slice(ei-eu,(ei+=t)-eu);return eT(t);case 220:return t=R.getUint16(ei),ei+=2,eC(t);case 221:return t=R.getUint32(ei),ei+=4,eC(t);case 222:return t=R.getUint16(ei),ei+=2,eO(t);case 223:return t=R.getUint32(ei),ei+=4,eO(t);default:if(e>=224)return e-256;if(void 0===e){let e=Error("Unexpected end of MessagePack data");throw e.incomplete=!0,e}throw Error("Unknown MessagePack token "+e)}}}let eE=/^[a-zA-Z_$][a-zA-Z\d_$]*$/;function eI(e,t){function r(){if(r.count++>eb){let n;try{n=e.read=Function("r","return function(){return "+(ed.freezeData?"Object.freeze":"")+"({"+e.map(e=>"__proto__"===e?"__proto_:r()":eE.test(e)?e+":r()":"["+JSON.stringify(e)+"]:r()").join(",")+"})}")(eS)}catch(e){return eb=1/0,r()}return e.read0=n,0===e.highByte&&(e.read=ek(t,e.read)),n()}let n={};for(let t=0,r=e.length;t<r;t++){let r=e[t];"__proto__"===r&&(r="__proto_"),n[r]=eS()}return ed.freezeData?Object.freeze(n):n}return(r.count=0,e.read0=r,0===e.highByte)?ek(t,r):r}let ek=(e,t)=>function(){let r=x[ei++];if(0===r)return t();let n=e<32?-(e+(r<<5)):e+(r<<5),a=T[n]||ew()[n];if(!a)throw Error("Record id is not defined for "+n);return a.read||(a.read=eI(a,e)),a.read()};function ew(){let e=eU(()=>(x=null,ed.getStructures()));return T=ed._mergeStructures(e,T)}var ej=eD,ex=eD,eA=eD,eT=eD;function eD(e){let t;if(e<16&&(t=eP(e)))return t;if(e>64&&j)return j.decode(x.subarray(ei,ei+=e));let r=ei+e,n=[];for(t="";ei<r;){let e=x[ei++];if((128&e)==0)n.push(e);else if((224&e)==192){let t=(31&e)<<6|63&x[ei++];t<128?n.push(65533):n.push(t)}else if((240&e)==224){let t=(31&e)<<12|(63&x[ei++])<<6|63&x[ei++];t<2048||t>=55296&&t<=57343?n.push(65533):n.push(t)}else if((248&e)==240){let t=(7&e)<<18|(63&x[ei++])<<12|(63&x[ei++])<<6|63&x[ei++];t<65536||t>1114111?n.push(65533):(t>65535&&(t-=65536,n.push(t>>>10&1023|55296),t=56320|1023&t),n.push(t))}else n.push(65533);n.length>=4096&&(t+=eR.apply(String,n),n.length=0)}return n.length>0&&(t+=eR.apply(String,n)),t}function eC(e){let t=Array(e);for(let r=0;r<e;r++)t[r]=eS();return ed.freezeData?Object.freeze(t):t}function eO(e){if(ed.mapsAsObjects){let t={};for(let r=0;r<e;r++){let e=eF();"__proto__"===e&&(e="__proto_"),t[e]=eS()}return t}{let t=new Map;for(let r=0;r<e;r++)t.set(eS(),eS());return t}}var eR=String.fromCharCode;function eM(e){let t=ei,r=Array(e);for(let n=0;n<e;n++){let e=x[ei++];if((128&e)>0){ei=t;return}r[n]=e}return eR.apply(String,r)}function eP(e){if(e<4)if(e<2)if(0===e)return"";else{let e=x[ei++];if((128&e)>1){ei-=1;return}return eR(e)}else{let t=x[ei++],r=x[ei++];if((128&t)>0||(128&r)>0){ei-=2;return}if(e<3)return eR(t,r);let n=x[ei++];if((128&n)>0){ei-=3;return}return eR(t,r,n)}{let t=x[ei++],r=x[ei++],n=x[ei++],a=x[ei++];if((128&t)>0||(128&r)>0||(128&n)>0||(128&a)>0){ei-=4;return}if(e<6)if(4===e)return eR(t,r,n,a);else{let e=x[ei++];if((128&e)>0){ei-=5;return}return eR(t,r,n,a,e)}if(e<8){let i=x[ei++],s=x[ei++];if((128&i)>0||(128&s)>0){ei-=6;return}if(e<7)return eR(t,r,n,a,i,s);let o=x[ei++];if((128&o)>0){ei-=7;return}return eR(t,r,n,a,i,s,o)}{let i=x[ei++],s=x[ei++],o=x[ei++],l=x[ei++];if((128&i)>0||(128&s)>0||(128&o)>0||(128&l)>0){ei-=8;return}if(e<10)if(8===e)return eR(t,r,n,a,i,s,o,l);else{let e=x[ei++];if((128&e)>0){ei-=9;return}return eR(t,r,n,a,i,s,o,l,e)}if(e<12){let d=x[ei++],u=x[ei++];if((128&d)>0||(128&u)>0){ei-=10;return}if(e<11)return eR(t,r,n,a,i,s,o,l,d,u);let c=x[ei++];if((128&c)>0){ei-=11;return}return eR(t,r,n,a,i,s,o,l,d,u,c)}{let d=x[ei++],u=x[ei++],c=x[ei++],p=x[ei++];if((128&d)>0||(128&u)>0||(128&c)>0||(128&p)>0){ei-=12;return}if(e<14)if(12===e)return eR(t,r,n,a,i,s,o,l,d,u,c,p);else{let e=x[ei++];if((128&e)>0){ei-=13;return}return eR(t,r,n,a,i,s,o,l,d,u,c,p,e)}{let h=x[ei++],y=x[ei++];if((128&h)>0||(128&y)>0){ei-=14;return}if(e<15)return eR(t,r,n,a,i,s,o,l,d,u,c,p,h,y);let m=x[ei++];if((128&m)>0){ei-=15;return}return eR(t,r,n,a,i,s,o,l,d,u,c,p,h,y,m)}}}}}function eN(){let e,t=x[ei++];if(t<192)e=t-160;else switch(t){case 217:e=x[ei++];break;case 218:e=R.getUint16(ei),ei+=2;break;case 219:e=R.getUint32(ei),ei+=4;break;default:throw Error("Expected string")}return eD(e)}function eJ(e){return ed.copyBuffers?Uint8Array.prototype.slice.call(x,ei,ei+=e):x.subarray(ei,ei+=e)}function eL(e){let t=x[ei++];if(ep[t]){let r;return ep[t](x.subarray(ei,r=ei+=e),e=>{ei=e;try{return eS()}finally{ei=r}})}throw Error("Unknown extension type "+t)}var e_=Array(4096);function eF(){let e,t=x[ei++];if(!(t>=160)||!(t<192))return ei--,eq(eS());if(t-=160,ec>=ei)return D.slice(ei-eu,(ei+=t)-eu);if(!(0==ec&&A<180))return ej(t);let r=(t<<5^(t>1?R.getUint16(ei):t>0?x[ei]:0))&4095,n=e_[r],a=ei,i=ei+t-3,s=0;if(n&&n.bytes==t){for(;a<i;){if((e=R.getUint32(a))!=n[s++]){a=0x70000000;break}a+=4}for(i+=3;a<i;)if((e=x[a++])!=n[s++]){a=0x70000000;break}if(a===i)return ei=a,n.string;i-=3,a=ei}for(n=[],e_[r]=n,n.bytes=t;a<i;)e=R.getUint32(a),n.push(e),a+=4;for(i+=3;a<i;)e=x[a++],n.push(e);let o=t<16?eP(t):eM(t);return null!=o?n.string=o:n.string=ej(t)}function eq(e){if("string"==typeof e)return e;if("number"==typeof e||"boolean"==typeof e||"bigint"==typeof e)return e.toString();if(null==e)return e+"";if(ed.allowArraysInMapKeys&&Array.isArray(e)&&e.flat().every(e=>["string","number","boolean","bigint"].includes(typeof e)))return e.flat().toString();throw Error(`Invalid property type for record: ${typeof e}`)}let eG=(e,t)=>{let r=eS().map(eq),n=e;void 0!==t&&(e=e<32?-((t<<5)+e):(t<<5)+e,r.highByte=t);let a=T[e];return a&&(a.isShared||ef)&&((T.restoreStructures||(T.restoreStructures=[]))[e]=a),T[e]=r,r.read=eI(r,n),(r.read0||r.read)()};ep[0]=()=>{},ep[0].noBuffer=!0,ep[66]=e=>{let t=e.byteLength%8||8,r=BigInt(128&e[0]?e[0]-256:e[0]);for(let n=1;n<t;n++)r<<=BigInt(8),r+=BigInt(e[n]);if(e.byteLength!==t){let n=new DataView(e.buffer,e.byteOffset,e.byteLength),a=(e,t)=>{let r=t-e;if(r<=40){let r=n.getBigUint64(e);for(let a=e+8;a<t;a+=8)r<<=BigInt(64),r|=n.getBigUint64(a);return r}let i=e+(r>>4<<3),s=a(e,i),o=a(i,t);return s<<BigInt((t-i)*8)|o};r=r<<BigInt((n.byteLength-t)*8)|a(t,n.byteLength)}return r};let eV={Error,EvalError,RangeError,ReferenceError,SyntaxError,TypeError,URIError,AggregateError:"function"==typeof AggregateError?AggregateError:null};ep[101]=()=>{let e=eS();if(!eV[e[0]]){let t=Error(e[1],{cause:e[2]});return t.name=e[0],t}return eV[e[0]](e[1],{cause:e[2]})},ep[105]=e=>{let t;if(!1===ed.structuredClone)throw Error("Structured clone extension is disabled");let r=R.getUint32(ei-4);O||(O=new Map);let n=x[ei],a={target:t=n>=144&&n<160||220==n||221==n?[]:n>=128&&n<144||222==n||223==n?new Map:(n>=199&&n<=201||n>=212&&n<=216)&&115===x[ei+1]?new Set:{}};O.set(r,a);let i=eS();if(!a.used)return a.target=i;if(Object.assign(t,i),t instanceof Map)for(let[e,r]of i.entries())t.set(e,r);if(t instanceof Set)for(let e of Array.from(i))t.add(e);return t},ep[112]=e=>{if(!1===ed.structuredClone)throw Error("Structured clone extension is disabled");let t=R.getUint32(ei-4),r=O.get(t);return r.used=!0,r.target},ep[115]=()=>new Set(eS());let eY=["Int8","Uint8","Uint8Clamped","Int16","Uint16","Int32","Uint32","Float32","Float64","BigInt64","BigUint64"].map(e=>e+"Array"),eB="object"==typeof globalThis?globalThis:window;ep[116]=e=>{let t=e[0],r=Uint8Array.prototype.slice.call(e,1).buffer,n=eY[t];if(!n){if(16===t)return r;if(17===t)return new DataView(r);throw Error("Could not find typed array for code "+t)}return new eB[n](r)},ep[120]=()=>{let e=eS();return new RegExp(e[0],e[1])};let ez=[];function eU(e){ed&&ed._onSaveState&&ed._onSaveState();let t=A,r=ei,n=el,a=eu,i=ec,s=D,o=eo,l=O,d=C,u=new Uint8Array(x.slice(0,A)),c=T,p=T.slice(0,T.length),h=ed,y=ef,m=e();return A=t,ei=r,el=n,eu=a,ec=i,D=s,eo=o,O=l,C=d,x=u,ef=y,(T=c).splice(0,T.length,...p),ed=h,R=new DataView(x.buffer,x.byteOffset,x.byteLength),m}function eW(){x=null,O=null,T=null}ep[98]=e=>{let t=(e[0]<<24)+(e[1]<<16)+(e[2]<<8)+e[3],r=ei;return ei+=t-e.length,C=ez,(C=[eN(),eN()]).position0=0,C.position1=0,C.postBundlePosition=ei,ei=r,eS()},ep[255]=e=>4==e.length?new Date((0x1000000*e[0]+(e[1]<<16)+(e[2]<<8)+e[3])*1e3):8==e.length?new Date(((e[0]<<22)+(e[1]<<14)+(e[2]<<6)+(e[3]>>2))/1e6+((3&e[3])*0x100000000+0x1000000*e[4]+(e[5]<<16)+(e[6]<<8)+e[7])*1e3):12==e.length?new Date(((e[0]<<24)+(e[1]<<16)+(e[2]<<8)+e[3])/1e6+((128&e[4]?-0x1000000000000:0)+0x10000000000*e[6]+0x100000000*e[7]+0x1000000*e[8]+(e[9]<<16)+(e[10]<<8)+e[11])*1e3):new Date("invalid");let eH=Array(147);for(let e=0;e<256;e++)eH[e]=+("1e"+Math.floor(45.15-.30103*e));var e$=new eg({useRecords:!1});e$.unpack,e$.unpackMultiple,e$.unpack,new Uint8Array(new Float32Array(1).buffer,0,4),eg.SUPPORTS_STRUCT_HOOKS=!0;try{t=new TextEncoder}catch(e){}let eQ="u">typeof Buffer,eZ=eQ?function(e){return Buffer.allocUnsafeSlow(e)}:Uint8Array,eX=eQ?Buffer:Uint8Array,e0=eQ?0x100000000:0x7fd00000,e1=0,e2=null,e3=/[\u0080-\uFFFF]/,e4=Symbol("record-id");class e6 extends eg{constructor(e){let l,d,u,c;super(e),this.offset=0;let p=eX.prototype.utf8Write?function(e,t){return a.utf8Write(e,t,a.byteLength-t)}:!!t&&!!t.encodeInto&&function(e,r){return t.encodeInto(e,a.subarray(r)).written},h=this;e||(e={});let y=e&&e.sequential,m=e.structures||e.saveStructures,f=e.maxSharedStructures;if(null==f&&(f=32*!!m),f>8160)throw Error("Maximum maxSharedStructure is 8160");e.structuredClone&&void 0==e.moreTypes&&(this.moreTypes=!0);let b=e.maxOwnStructures;null==b&&(b=m?32:64),this.structures||!1==e.useRecords||(this.structures=[]);let g=f>32||b+f>64,K=f+64,v=f+b+64;if(v>8256)throw Error("Maximum maxSharedStructure + maxOwnStructure is 8192");let S=[],E=0,I=0;this.pack=this.encode=function(e,t){let r;if(a||(s=(a=new eZ(8192)).dataView||(a.dataView=new DataView(a.buffer,0,8192)),e1=0),(o=a.length-10)-e1<2048?(s=(a=new eZ(a.length)).dataView||(a.dataView=new DataView(a.buffer,0,a.length)),o=a.length-10,e1=0):e1=e1+7&0x7ffffff8,l=e1,t&to&&(e1+=255&t),c=h.structuredClone?new Map:null,h.bundleStrings&&"string"!=typeof e?(e2=[]).size=1/0:e2=null,u=h.structures){u.uninitialized&&(u=h._mergeStructures(h.getStructures()));let e=u.sharedLength||0;if(e>f)throw Error("Shared structures is larger than maximum shared structures, try increasing maxSharedStructures to "+u.sharedLength);if(!u.transitions){u.transitions=Object.create(null);for(let t=0;t<e;t++){let e=u[t];if(!e)continue;let r,n=u.transitions;for(let t=0,a=e.length;t<a;t++){let a=e[t];(r=n[a])||(r=n[a]=Object.create(null)),n=r}n[e4]=t+64}this.lastNamedStructuresLength=e}y||(u.nextId=e+64)}d&&(d=!1);try{h._writeStruct&&e&&"object"==typeof e?e.constructor===Object?C(e):e.constructor===Map||Array.isArray(e)||n.some(t=>e instanceof t)?j(e):C(e.toJSON?e.toJSON():e):j(e);let r=e2;if(e2&&e7(l,j,0),c&&c.idsToInsert){let e=c.idsToInsert.sort((e,t)=>e.offset>t.offset?1:-1),t=e.length,n=-1;for(;r&&t>0;){let a=e[--t].offset+l;a<r.stringsPosition+l&&-1===n&&(n=0),a>r.position+l?n>=0&&(n+=6):(n>=0&&(s.setUint32(r.position+l,s.getUint32(r.position+l)+n),n=-1),r=r.previous,t++)}n>=0&&r&&s.setUint32(r.position+l,s.getUint32(r.position+l)+n),(e1+=6*e.length)>o&&O(e1),h.offset=e1;let i=function(e,t){let r,n=6*t.length,a=e.length-n;for(;r=t.pop();){let t=r.offset,i=r.id;e.copyWithin(t+n,t,a);let s=t+(n-=6);e[s++]=214,e[s++]=105,e[s++]=i>>24,e[s++]=i>>16&255,e[s++]=i>>8&255,e[s++]=255&i,a=t}return e}(a.subarray(l,e1),e);return c=null,i}if(h.offset=e1,t&ti)return a.start=l,a.end=e1,a;return a.subarray(l,e1)}catch(e){throw r=e,e}finally{if(u&&(k(),d&&h.saveStructures)){let n=u.sharedLength||0,i=a.subarray(l,e1),s=(h._prepareStructures||function(e,t){return e.isCompatible=e=>{let r=!e||(t.lastNamedStructuresLength||0)===e.length;return r||t._mergeStructures(e),r},e})(u,h);if(!r){if(!1===h.saveStructures(s,s.isCompatible))return u.uninitialized=!0,h.pack(e,t);return h.lastNamedStructuresLength=n,a.length>0x40000000&&(a=null),i}}a.length>0x40000000&&(a=null),t&ts&&(e1=l)}};const k=()=>{I<10&&I++;let e=u.sharedLength||0;if(u.length>e&&!y&&(u.length=e),E>1e4)u.transitions=null,I=0,E=0,S.length>0&&(S=[]);else if(S.length>0&&!y){for(let e=0,t=S.length;e<t;e++)S[e][e4]=0;S=[]}},w=e=>{var t=e.length;t<16?a[e1++]=144|t:t<65536?(a[e1++]=220,a[e1++]=t>>8,a[e1++]=255&t):(a[e1++]=221,s.setUint32(e1,t),e1+=4);for(let r=0;r<t;r++)j(e[r])},j=e=>{e1>o&&(a=O(e1));var t,i=typeof e;if("string"===i){let r,n=e.length;if(e2&&n>=4&&n<4096){if((e2.size+=n)>21760){let e,t,r=(e2[0]?3*e2[0].length+e2[1].length:0)+10;e1+r>o&&(a=O(e1+r)),e2.position?(t=e2,a[e1]=200,e1+=3,a[e1++]=98,e=e1-l,e1+=4,e7(l,j,0),s.setUint16(e+l-3,e1-l-e)):(a[e1++]=214,a[e1++]=98,e=e1-l,e1+=4),(e2=["",""]).previous=t,e2.size=0,e2.position=e}let t=e3.test(e);e2[+!t]+=e,a[e1++]=193,j(t?-n:n);return}r=n<32?1:n<256?2:n<65536?3:5;let i=3*n;if(e1+i>o&&(a=O(e1+i)),n<64||!p){let i,s,o,l=e1+r;for(i=0;i<n;i++)(s=e.charCodeAt(i))<128?a[l++]=s:(s<2048?a[l++]=s>>6|192:((64512&s)==55296&&(64512&(o=e.charCodeAt(i+1)))==56320?(s=65536+((1023&s)<<10)+(1023&o),i++,a[l++]=s>>18|240,a[l++]=s>>12&63|128):a[l++]=s>>12|224,a[l++]=s>>6&63|128),a[l++]=63&s|128);t=l-e1-r}else t=p(e,e1+r);t<32?a[e1++]=160|t:t<256?(r<2&&a.copyWithin(e1+2,e1+1,e1+1+t),a[e1++]=217,a[e1++]=t):t<65536?(r<3&&a.copyWithin(e1+3,e1+2,e1+2+t),a[e1++]=218,a[e1++]=t>>8,a[e1++]=255&t):(r<5&&a.copyWithin(e1+5,e1+3,e1+3+t),a[e1++]=219,s.setUint32(e1,t),e1+=4),e1+=t}else if("number"===i)if(e>>>0===e)e<32||e<128&&!1===this.useRecords||e<64&&!this._writeStruct?a[e1++]=e:e<256?(a[e1++]=204,a[e1++]=e):e<65536?(a[e1++]=205,a[e1++]=e>>8,a[e1++]=255&e):(a[e1++]=206,s.setUint32(e1,e),e1+=4);else if((0|e)===e)e>=-32?a[e1++]=256+e:e>=-128?(a[e1++]=208,a[e1++]=e+256):e>=-32768?(a[e1++]=209,s.setInt16(e1,e),e1+=2):(a[e1++]=210,s.setInt32(e1,e),e1+=4);else{let t;if((t=this.useFloat32)>0&&e<0x100000000&&e>=-0x80000000){let r;if(a[e1++]=202,s.setFloat32(e1,e),t<4||(0|(r=e*eH[(127&a[e1])<<1|a[e1+1]>>7]))===r){e1+=4;return}e1--}a[e1++]=203,s.setFloat64(e1,e),e1+=8}else if("object"===i||"function"===i)if(e){if(c){let t=c.get(e);if(t){t.id||(t.id=(c.idsToInsert||(c.idsToInsert=[])).push(t)),a[e1++]=214,a[e1++]=112,s.setUint32(e1,t.id),e1+=4;return}c.set(e,{offset:e1-l})}let d=e.constructor;if(d===Object)D(e);else if(d===Array)w(e);else if(d===Map)if(this.mapAsEmptyObject)a[e1++]=128;else for(let[r,n]of((t=e.size)<16?a[e1++]=128|t:t<65536?(a[e1++]=222,a[e1++]=t>>8,a[e1++]=255&t):(a[e1++]=223,s.setUint32(e1,t),e1+=4),e))j(r),j(n);else{for(let t=0,i=r.length;t<i;t++)if(e instanceof n[t]){let n,i=r[t];if(i.write){i.type&&(a[e1++]=212,a[e1++]=i.type,a[e1++]=0);let t=i.write.call(this,e);t===e?Array.isArray(e)?w(e):D(e):j(t);return}let l=a,d=s,u=e1;a=null;try{n=i.pack.call(this,e,e=>(a=l,l=null,(e1+=e)>o&&O(e1),{target:a,targetView:s,position:e1-e}),j)}finally{l&&(a=l,s=d,e1=u,o=a.length-10)}n&&(n.length+e1>o&&O(n.length+e1),e1=e9(n,a,e1,i.type));return}if(Array.isArray(e))w(e);else{if(e.toJSON){let t=e.toJSON();if(t!==e)return j(t)}if("function"===i)return j(this.writeFunction&&this.writeFunction(e));D(e)}}}else a[e1++]=192;else if("boolean"===i)a[e1++]=e?195:194;else if("bigint"===i){if(e<0x8000000000000000&&e>=-0x8000000000000000)a[e1++]=211,s.setBigInt64(e1,e);else if(e<0xffffffffffffffff&&e>0)a[e1++]=207,s.setBigUint64(e1,e);else if(this.largeBigIntToFloat)a[e1++]=203,s.setFloat64(e1,Number(e));else if(this.largeBigIntToString)return j(e.toString());else if(this.useBigIntExtension||this.moreTypes){let t,r=e<0?BigInt(-1):BigInt(0);if(e>>BigInt(65536)===r){let n=BigInt(0xffffffffffffffff)-BigInt(1),a=[];for(;a.push(e&n),e>>BigInt(63)!==r;)e>>=BigInt(64);(t=new Uint8Array(new BigUint64Array(a).buffer)).reverse()}else{let r=e<0,n=(r?~e:e).toString(16);if(n.length%2?n="0"+n:parseInt(n.charAt(0),16)>=8&&(n="00"+n),eQ)t=Buffer.from(n,"hex");else{t=new Uint8Array(n.length/2);for(let e=0;e<t.length;e++)t[e]=parseInt(n.slice(2*e,2*e+2),16)}if(r)for(let e=0;e<t.length;e++)t[e]=~t[e]}t.length+e1>o&&O(t.length+e1),e1=e9(t,a,e1,66);return}else throw RangeError(e+" was too large to fit in MessagePack 64-bit integer format, use useBigIntExtension, or set largeBigIntToFloat to convert to float-64, or set largeBigIntToString to convert to string");e1+=8}else if("undefined"===i)this.encodeUndefinedAsNil?a[e1++]=192:(a[e1++]=212,a[e1++]=0,a[e1++]=0);else throw Error("Unknown type: "+i)},x=this.variableMapSize||this.coercibleKeyAsNumber||this.skipValues?e=>{let t,r;if(this.skipValues)for(let r in t=[],e)("function"!=typeof e.hasOwnProperty||e.hasOwnProperty(r))&&!this.skipValues.includes(e[r])&&t.push(r);else t=Object.keys(e);let n=t.length;if(n<16?a[e1++]=128|n:n<65536?(a[e1++]=222,a[e1++]=n>>8,a[e1++]=255&n):(a[e1++]=223,s.setUint32(e1,n),e1+=4),this.coercibleKeyAsNumber)for(let a=0;a<n;a++){let n=Number(r=t[a]);j(isNaN(n)?r:n),j(e[r])}else for(let a=0;a<n;a++)j(r=t[a]),j(e[r])}:e=>{a[e1++]=222;let t=e1-l;e1+=2;let r=0;for(let t in e)("function"!=typeof e.hasOwnProperty||e.hasOwnProperty(t))&&(j(t),j(e[t]),r++);if(r>65535)throw Error('Object is too large to serialize with fast 16-bit map size, use the "variableMapSize" option to serialize this object');a[t+++l]=r>>8,a[t+l]=255&r},A=!1===this.useRecords?x:e.progressiveRecords&&!g?e=>{let t,r,n=u.transitions||(u.transitions=Object.create(null)),i=e1++-l;for(let a in e)if("function"!=typeof e.hasOwnProperty||e.hasOwnProperty(a)){if(r=n[a])n=r;else{let s=Object.keys(e),o=n;n=u.transitions;let d=0;for(let e=0,t=s.length;e<t;e++){let t=s[e];!(r=n[t])&&(r=n[t]=Object.create(null),d++),n=r}i+l+1==e1?(e1--,R(n,s,d)):M(n,s,i,d),t=!0,n=o[a]}j(e[a])}if(!t){let t=n[e4];t?a[i+l]=t:M(n,Object.keys(e),i,0)}}:e=>{let t,r=u.transitions||(u.transitions=Object.create(null)),n=0;for(let a in e)("function"!=typeof e.hasOwnProperty||e.hasOwnProperty(a))&&(!(t=r[a])&&(t=r[a]=Object.create(null),n++),r=t);let i=r[e4];for(let t in i?i>=96&&g?(a[e1++]=(31&(i-=96))+96,a[e1++]=i>>5):a[e1++]=i:R(r,r.__keys__||Object.keys(e),n),e)("function"!=typeof e.hasOwnProperty||e.hasOwnProperty(t))&&j(e[t])},T="function"==typeof this.useRecords&&this.useRecords,D=T?e=>{T(e)?A(e):x(e)}:A,C=e=>{let t=h._writeStruct(e,a,l,e1,u,O,(e,t,r)=>{if(r)return d=!0;e1=t;let n=a;return(j(e),k(),n!==a)?{position:e1,targetView:s,target:a}:e1});if(0===t)return D(e);e1=t},O=e=>{let t;if(e>0x1000000){if(e-l>e0)throw Error("Packed buffer would be larger than maximum buffer size");t=Math.min(e0,4096*Math.round(Math.max((e-l)*(e>0x4000000?1.25:2),4194304)/4096))}else t=(Math.max(e-l<<2,a.length-1)>>12)+1<<12;let r=new eZ(t);return s=r.dataView||(r.dataView=new DataView(r.buffer,0,t)),e=Math.min(e,a.length),a.copy?a.copy(r,0,l,e):r.set(a.slice(l,e)),e1-=l,l=0,o=r.length-10,a=r},R=(e,t,r)=>{let n=u.nextId;n||(n=64),n<K&&this.shouldShareStructure&&!this.shouldShareStructure(t)?((n=u.nextOwnId)<v||(n=K),u.nextOwnId=n+1):(n>=v&&(n=K),u.nextId=n+1);let i=t.highByte=n>=96&&g?n-96>>5:-1;e[e4]=n,e.__keys__=t,u[n-64]=t,n<K?(t.isShared=!0,u.sharedLength=n-63,d=!0,i>=0?(a[e1++]=(31&n)+96,a[e1++]=i):a[e1++]=n):(i>=0?(a[e1++]=213,a[e1++]=114,a[e1++]=(31&n)+96,a[e1++]=i):(a[e1++]=212,a[e1++]=114,a[e1++]=n),r&&(E+=I*r),S.length>=b&&(S.shift()[e4]=0),S.push(e),j(t))},M=(e,t,r,n)=>{let s=a,d=e1,u=o,c=l;e1=0,l=0,(a=i)||(i=a=new eZ(8192)),o=a.length-10,R(e,t,n),i=a;let p=e1;if(a=s,e1=d,o=u,l=c,p>1){let e=e1+p-1;e>o&&O(e);let t=r+l;a.copyWithin(t+p,t+1,e1),a.set(i.slice(0,p),t),e1=e}else a[r+l]=i[0]}}useBuffer(e){(a=e).dataView||(a.dataView=new DataView(a.buffer,a.byteOffset,a.byteLength)),s=a.dataView,e1=0}set position(e){e1=e}get position(){return e1}clearSharedData(){this.structures&&(this.structures=[]),this.typedStructs&&(this.typedStructs=[])}}function e5(e,t,r,n){let a=e.byteLength;if(a+1<256){var{target:i,position:s}=r(4+a);i[s++]=199,i[s++]=a+1}else if(a+1<65536){var{target:i,position:s}=r(5+a);i[s++]=200,i[s++]=a+1>>8,i[s++]=a+1&255}else{var{target:i,position:s,targetView:o}=r(7+a);i[s++]=201,o.setUint32(s,a+1),s+=4}i[s++]=116,i[s++]=t,e.buffer||(e=new Uint8Array(e)),i.set(new Uint8Array(e.buffer,e.byteOffset,e.byteLength),s)}function e8(e,t){let r=e.byteLength;if(r<256){var n,a,{target:n,position:a}=t(r+2);n[a++]=196,n[a++]=r}else if(r<65536){var{target:n,position:a}=t(r+3);n[a++]=197,n[a++]=r>>8,n[a++]=255&r}else{var{target:n,position:a,targetView:i}=t(r+5);n[a++]=198,i.setUint32(a,r),a+=4}n.set(e,a)}function e9(e,t,r,n){let a=e.length;switch(a){case 1:t[r++]=212;break;case 2:t[r++]=213;break;case 4:t[r++]=214;break;case 8:t[r++]=215;break;case 16:t[r++]=216;break;default:a<256?(t[r++]=199,t[r++]=a):(a<65536?(t[r++]=200,t[r++]=a>>8):(t[r++]=201,t[r++]=a>>24,t[r++]=a>>16&255,t[r++]=a>>8&255),t[r++]=255&a)}return t[r++]=n,t.set(e,r),r+=a}function e7(e,t,r){if(e2.length>0){s.setUint32(e2.position+e,e1+r-e2.position-e),e2.stringsPosition=e1-e;let n=e2;e2=null,t(n[0]),t(n[1])}}n=[Date,Set,Error,RegExp,ArrayBuffer,Object.getPrototypeOf(Uint8Array.prototype).constructor,DataView,ey],r=[{pack(e,t,r){let n=e.getTime()/1e3;if((this.useTimestamp32||0===e.getMilliseconds())&&n>=0&&n<0x100000000){let{target:e,targetView:r,position:a}=t(6);e[a++]=214,e[a++]=255,r.setUint32(a,n)}else if(n>0&&n<0x100000000){let{target:r,targetView:a,position:i}=t(10);r[i++]=215,r[i++]=255,a.setUint32(i,4e6*e.getMilliseconds()+(n/1e3/0x100000000|0)),a.setUint32(i+4,n)}else if(isNaN(n)){if(this.onInvalidDate)return t(0),r(this.onInvalidDate());let{target:e,targetView:n,position:a}=t(3);e[a++]=212,e[a++]=255,e[a++]=255}else{let{target:r,targetView:a,position:i}=t(15);r[i++]=199,r[i++]=12,r[i++]=255,a.setUint32(i,1e6*e.getMilliseconds()),a.setBigInt64(i+4,BigInt(Math.floor(n)))}}},{pack(e,t,r){if(this.setAsEmptyObject)return t(0),r({});let n=Array.from(e),{target:a,position:i}=t(3*!!this.moreTypes);this.moreTypes&&(a[i++]=212,a[i++]=115,a[i++]=0),r(n)}},{pack(e,t,r){let{target:n,position:a}=t(3*!!this.moreTypes);this.moreTypes&&(n[a++]=212,n[a++]=101,n[a++]=0),r([e.name,e.message,e.cause])}},{pack(e,t,r){let{target:n,position:a}=t(3*!!this.moreTypes);this.moreTypes&&(n[a++]=212,n[a++]=120,n[a++]=0),r([e.source,e.flags])}},{pack(e,t){this.moreTypes?e5(e,16,t):e8(eQ?Buffer.from(e):new Uint8Array(e),t)}},{pack(e,t){let r=e.constructor;r!==eX&&this.moreTypes?e5(e,eY.indexOf(r.name),t):e8(e,t)}},{pack(e,t){this.moreTypes?e5(e,17,t):e8(eQ?Buffer.from(e):new Uint8Array(e),t)}},{pack(e,t){let{target:r,position:n}=t(1);r[n]=193}}],e6.SUPPORTS_STRUCT_HOOKS=!0;let te=new e6({useRecords:!1});te.pack,te.pack;let{NEVER:tt,ALWAYS:tr,DECIMAL_ROUND:tn,DECIMAL_FIT:ta}={NEVER:0,ALWAYS:1,DECIMAL_ROUND:3,DECIMAL_FIT:4},ti=512,ts=1024,to=2048;var tl=e.i(88947);if(tl.Transform,tl.Transform,e.i(62562),void 0===process.env.MSGPACKR_NATIVE_ACCELERATION_DISABLED||"true"!==process.env.MSGPACKR_NATIVE_ACCELERATION_DISABLED.toLowerCase()){let t;try{(t=e.r(70156))&&function(e){function t(t){return function(r){let n=eo[el++];if(null==n){if(C)return eD(r);let a=x.byteOffset,i=e(ei-t+a,A+a,x.buffer);if("string"==typeof i)n=i,eo=es;else if(el=1,ec=1,void 0===(n=(eo=i)[0]))throw Error("Unexpected end of buffer")}let a=n.length;return a<=r?(ei+=r,n):(D=n,eu=ei,ec=ei+a,ei+=r,n.slice(0,r))}}ej=t(1),ex=t(2),eA=t(3),eT=t(5)}(t.extractStrings)}catch(e){}}let td="5.80.8";class tu extends Error{constructor(e="bullmq:unrecoverable"){super(e),this.name=this.constructor.name,Object.setPrototypeOf(this,new.target.prototype)}}let tc=new e6({useRecords:!1,encodeUndefinedAsNil:!0}).pack;class tp{constructor(e){this.queue=e,this.version=td;const t=this.queue.keys;this.moveToFinishedKeys=[t.wait,t.active,t.prioritized,t.events,t.stalled,t.limiter,t.delayed,t.paused,t.meta,t.pc,void 0,void 0,void 0,void 0]}execCommand(e,t,r){let n=`${t}:${this.version}`;return e.runCommand(n,r)}async isJobInList(e,t){let r=await this.queue.client;return Number.isInteger(ee(this.queue.redisVersion,"6.0.6",this.queue.databaseType)?await this.execCommand(r,"isJobInList",[e,t]):await r.lpos(e,t))}addDelayedJobArgs(e,t,r){let n=this.queue.keys,a=[n.marker,n.meta,n.id,n.delayed,n.completed,n.events];return a.push(tc(r),e.data,t),a}addDelayedJob(e,t,r,n){let a=this.addDelayedJobArgs(t,r,n);return this.execCommand(e,"addDelayedJob",a)}addPrioritizedJobArgs(e,t,r){let n=this.queue.keys,a=[n.marker,n.meta,n.id,n.prioritized,n.delayed,n.completed,n.active,n.events,n.pc];return a.push(tc(r),e.data,t),a}addPrioritizedJob(e,t,r,n){let a=this.addPrioritizedJobArgs(t,r,n);return this.execCommand(e,"addPrioritizedJob",a)}addParentJobArgs(e,t,r){let n=this.queue.keys,a=[n.meta,n.id,n.delayed,n["waiting-children"],n.completed,n.events];return a.push(tc(r),e.data,t),a}addParentJob(e,t,r,n){let a=this.addParentJobArgs(t,r,n);return this.execCommand(e,"addParentJob",a)}addStandardJobArgs(e,t,r){let n=this.queue.keys,a=[n.wait,n.paused,n.meta,n.id,n.completed,n.delayed,n.active,n.events,n.marker];return a.push(tc(r),e.data,t),a}addStandardJob(e,t,r,n){let a=this.addStandardJobArgs(t,r,n);return this.execCommand(e,"addStandardJob",a)}async addJob(e,t,r,n,a={}){let i,s,o=this.queue.keys,l=t.parent,d=[o[""],void 0!==n?n:"",t.name,t.timestamp,t.parentKey||null,a.parentDependenciesKey||null,l,t.repeatJobKey,t.deduplicationId?`${o.de}:${t.deduplicationId}`:null];if(r.repeat){let e=Object.assign({},r.repeat);e.startDate&&(e.startDate=+new Date(e.startDate)),e.endDate&&(e.endDate=+new Date(e.endDate)),i=tc(Object.assign(Object.assign({},r),{repeat:e}))}else i=tc(r);if((s=a.addToWaitingChildren?await this.addParentJob(e,t,i,d):"number"==typeof r.delay&&r.delay>0?await this.addDelayedJob(e,t,i,d):r.priority?await this.addPrioritizedJob(e,t,i,d):await this.addStandardJob(e,t,i,d))<0)throw this.finishedErrors({code:s,parentKey:a.parentKey,command:"addJob"});return s}pauseArgs(e){let t="wait",r="paused";e||(t="paused",r="wait");let n=[t,r,"meta","prioritized"].map(e=>this.queue.toKey(e));return n.push(this.queue.keys.events,this.queue.keys.delayed,this.queue.keys.marker),n.concat([e?"paused":"resumed"])}async pause(e){let t=await this.queue.client,r=this.pauseArgs(e);return this.execCommand(t,"pause",r)}addRepeatableJobArgs(e,t,r,n){let a=this.queue.keys;return[a.repeat,a.delayed].concat([t,tc(r),n,e,a[""]])}async addRepeatableJob(e,t,r,n){let a=await this.queue.client,i=this.addRepeatableJobArgs(e,t,r,n);return this.execCommand(a,"addRepeatableJob",i)}async removeDeduplicationKey(e,t){let r=await this.queue.client,n=this.queue.keys,a=[`${n.de}:${e}`];return this.execCommand(r,"removeDeduplicationKey",a.concat([t]))}async addJobScheduler(e,t,r,n,a,i,s){let o=await this.queue.client,l=this.queue.keys,d=[l.repeat,l.delayed,l.wait,l.paused,l.meta,l.prioritized,l.marker,l.id,l.events,l.pc,l.active],u=[t,tc(a),e,r,tc(n),tc(i),Date.now(),l[""],s?this.queue.toKey(s):""],c=await this.execCommand(o,"addJobScheduler",d.concat(u));if("number"==typeof c&&c<0)throw this.finishedErrors({code:c,command:"addJobScheduler"});return c}async updateRepeatableJobMillis(e,t,r,n){let a=[this.queue.keys.repeat,r,t,n];return this.execCommand(e,"updateRepeatableJobMillis",a)}async updateJobSchedulerNextMillis(e,t,r,n,a){let i=await this.queue.client,s=this.queue.keys,o=[s.repeat,s.delayed,s.wait,s.paused,s.meta,s.prioritized,s.marker,s.id,s.events,s.pc,a?this.queue.toKey(a):"",s.active],l=[t,e,r,tc(n),Date.now(),s[""],a];return this.execCommand(i,"updateJobScheduler",o.concat(l))}removeRepeatableArgs(e,t,r){let n=this.queue.keys;return[n.repeat,n.delayed,n.events].concat([e,this.getRepeatConcatOptions(t,r),r,n[""]])}getRepeatConcatOptions(e,t){return t&&t.split(":").length>2?t:e}async removeRepeatable(e,t,r){let n=await this.queue.client,a=this.removeRepeatableArgs(e,t,r);return this.execCommand(n,"removeRepeatable",a)}async removeJobScheduler(e){let t=await this.queue.client,r=this.queue.keys,n=[r.repeat,r.delayed,r.events],a=[e,r[""]];return this.execCommand(t,"removeJobScheduler",n.concat(a))}removeArgs(e,t){let r=[e,"repeat"].map(e=>this.queue.toKey(e)),n=[e,+!!t,this.queue.toKey("")];return r.concat(n)}async remove(e,t){let r=await this.queue.client,n=this.removeArgs(e,t),a=await this.execCommand(r,"removeJob",n);if(a<0)throw this.finishedErrors({code:a,jobId:e,command:"removeJob"});return a}async removeUnprocessedChildren(e){let t=await this.queue.client,r=[this.queue.toKey(e),this.queue.keys.meta,this.queue.toKey(""),e];await this.execCommand(t,"removeUnprocessedChildren",r)}async extendLock(e,t,r,n){n=n||await this.queue.client;let a=[this.queue.toKey(e)+":lock",this.queue.keys.stalled,t,r,e];return this.execCommand(n,"extendLock",a)}async extendLocks(e,t,r){let n=await this.queue.client,a=[this.queue.keys.stalled,this.queue.toKey(""),tc(t),tc(e),r];return this.execCommand(n,"extendLocks",a)}async updateData(e,t){let r=await this.queue.client,n=[this.queue.toKey(e.id)],a=JSON.stringify(t),i=await this.execCommand(r,"updateData",n.concat([a]));if(i<0)throw this.finishedErrors({code:i,jobId:e.id,command:"updateData"})}async updateProgress(e,t){let r=await this.queue.client,n=[this.queue.toKey(e),this.queue.keys.events,this.queue.keys.meta],a=JSON.stringify(t),i=await this.execCommand(r,"updateProgress",n.concat([e,a]));if(i<0)throw this.finishedErrors({code:i,jobId:e,command:"updateProgress"})}async addLog(e,t,r){let n=await this.queue.client,a=[this.queue.toKey(e),this.queue.toKey(e)+":logs"],i=await this.execCommand(n,"addLog",a.concat([e,t,r||""]));if(i<0)throw this.finishedErrors({code:i,jobId:e,command:"addLog"});return i}moveToFinishedArgs(e,t,r,n,a,i,s,o=!0,l){var d,u,c,p,h,y,m;let f=this.queue.keys,b=this.queue.opts,g="completed"===a?b.removeOnComplete:b.removeOnFail,K=this.queue.toKey(`metrics:${a}`),v=this.moveToFinishedKeys;v[10]=f[a],v[11]=this.queue.toKey(null!=(d=e.id)?d:""),v[12]=K,v[13]=this.queue.keys.marker;let S=this.getKeepJobs(n,g),E=[e.id,s,r,void 0===t?"null":t,a,!o||this.queue.closing?0:1,f[""],tc({token:i,name:b.name,keepJobs:S,limiter:b.limiter,lockDuration:b.lockDuration,attempts:e.opts.attempts,maxMetricsSize:(null==(u=b.metrics)?void 0:u.maxDataPoints)?null==(c=b.metrics)?void 0:c.maxDataPoints:"",fpof:!!(null==(p=e.opts)?void 0:p.failParentOnFailure),cpof:!!(null==(h=e.opts)?void 0:h.continueParentOnFailure),idof:!!(null==(y=e.opts)?void 0:y.ignoreDependencyOnFailure),rdof:!!(null==(m=e.opts)?void 0:m.removeDependencyOnFailure)}),l?tc(B(l)):void 0];return v.concat(E)}getKeepJobs(e,t){return void 0===e?t||{count:e?0:-1}:"object"==typeof e?e:"number"==typeof e?{count:e}:{count:e?0:-1}}async moveToFinished(e,t){let r=await this.queue.client,n=await this.execCommand(r,"moveToFinished",t);if(n<0)throw this.finishedErrors({code:n,jobId:e,command:"moveToFinished",state:"active"});if(void 0!==n)return th(n)}drainArgs(e){let t=this.queue.keys;return[t.wait,t.paused,t.delayed,t.prioritized,t.repeat].concat([t[""],e?"1":"0"])}async drain(e){let t=await this.queue.client,r=this.drainArgs(e);return this.execCommand(t,"drain",r)}removeChildDependencyArgs(e,t){return[this.queue.keys[""]].concat([this.queue.toKey(e),t])}async removeChildDependency(e,t){let r=await this.queue.client,n=this.removeChildDependencyArgs(e,t),a=await this.execCommand(r,"removeChildDependency",n);switch(a){case 0:return!0;case 1:return!1;default:throw this.finishedErrors({code:a,jobId:e,parentKey:t,command:"removeChildDependency"})}}getRangesArgs(e,t,r,n){let a=this.queue.keys,i=e.map(e=>"waiting"===e?"wait":e);return[a[""]].concat([t,r,n?"1":"0",...i])}async getRanges(e,t=0,r=1,n=!1){let a=await this.queue.client,i=this.getRangesArgs(e,t,r,n);return await this.execCommand(a,"getRanges",i)}getCountsArgs(e){let t=this.queue.keys,r=e.map(e=>"waiting"===e?"wait":e);return[t[""]].concat([...r])}async getCounts(e){let t=await this.queue.client,r=this.getCountsArgs(e);return await this.execCommand(t,"getCounts",r)}getCountsPerPriorityArgs(e){return[this.queue.keys.wait,this.queue.keys.paused,this.queue.keys.meta,this.queue.keys.prioritized].concat(e)}async getCountsPerPriority(e){let t=await this.queue.client,r=this.getCountsPerPriorityArgs(e);return await this.execCommand(t,"getCountsPerPriority",r)}getDependencyCountsArgs(e,t){return[`${e}:processed`,`${e}:dependencies`,`${e}:failed`,`${e}:unsuccessful`].map(e=>this.queue.toKey(e)).concat(t)}async getDependencyCounts(e,t){let r=await this.queue.client,n=this.getDependencyCountsArgs(e,t);return await this.execCommand(r,"getDependencyCounts",n)}moveToCompletedArgs(e,t,r,n,a=!1){let i=Date.now();return this.moveToFinishedArgs(e,t,"returnvalue",r,"completed",n,i,a)}moveToFailedArgs(e,t,r,n,a=!1,i){let s=Date.now();return this.moveToFinishedArgs(e,t,"failedReason",r,"failed",n,s,a,i)}async isFinished(e,t=!1){let r=await this.queue.client,n=["completed","failed",e].map(e=>this.queue.toKey(e));return this.execCommand(r,"isFinished",n.concat([e,t?"1":""]))}async getState(e){let t=await this.queue.client,r=["completed","failed","delayed","active","wait","paused","waiting-children","prioritized"].map(e=>this.queue.toKey(e));return ee(this.queue.redisVersion,"6.0.6",this.queue.databaseType)?this.execCommand(t,"getState",r.concat([e])):this.execCommand(t,"getStateV2",r.concat([e]))}async changeDelay(e,t){let r=await this.queue.client,n=this.changeDelayArgs(e,t),a=await this.execCommand(r,"changeDelay",n);if(a<0)throw this.finishedErrors({code:a,jobId:e,command:"changeDelay",state:"delayed"})}changeDelayArgs(e,t){let r=Date.now();return[this.queue.keys.delayed,this.queue.keys.meta,this.queue.keys.marker,this.queue.keys.events].concat([t,JSON.stringify(r),e,this.queue.toKey(e)])}async changePriority(e,t=0,r=!1){let n=await this.queue.client,a=this.changePriorityArgs(e,t,r),i=await this.execCommand(n,"changePriority",a);if(i<0)throw this.finishedErrors({code:i,jobId:e,command:"changePriority"})}changePriorityArgs(e,t=0,r=!1){return[this.queue.keys.wait,this.queue.keys.paused,this.queue.keys.meta,this.queue.keys.prioritized,this.queue.keys.active,this.queue.keys.pc,this.queue.keys.marker].concat([t,this.queue.toKey(""),e,+!!r])}moveToDelayedArgs(e,t,r,n,a={}){let i=this.queue.keys,s=this.queue.opts,o=[i.marker,i.active,i.prioritized,i.delayed,this.queue.toKey(e),i.events,i.meta,i.stalled,i.wait,i.limiter,i.paused,i.pc],l=a.fetchNext&&!this.queue.closing?1:0;return o.concat([this.queue.keys[""],t,e,r,n,a.skipAttempt?"1":"0",a.fieldsToUpdate?tc(B(a.fieldsToUpdate)):void 0,l,l?tc({token:r,lockDuration:s.lockDuration,limiter:s.limiter,name:s.name}):void 0])}moveToWaitingChildrenArgs(e,t,r){let n=Date.now(),a=Q(r.child);return["active","waiting-children",e,`${e}:dependencies`,`${e}:unsuccessful`,"stalled","events"].map(e=>this.queue.toKey(e)).concat([t,null!=a?a:"",JSON.stringify(n),e,this.queue.toKey("")])}isMaxedArgs(){let e=this.queue.keys;return[e.meta,e.active]}async isMaxed(){let e=await this.queue.client,t=this.isMaxedArgs();return!!await this.execCommand(e,"isMaxed",t)}async moveToDelayed(e,t,r,n="0",a={}){let i=await this.queue.client,s=this.moveToDelayedArgs(e,t,n,r,a),o=await this.execCommand(i,"moveToDelayed",s);if(o<0)throw this.finishedErrors({code:o,jobId:e,command:"moveToDelayed",state:"active"});if(void 0!==o)return th(o)}async moveToWaitingChildren(e,t,r={}){let n=await this.queue.client,a=this.moveToWaitingChildrenArgs(e,t,r),i=await this.execCommand(n,"moveToWaitingChildren",a);switch(i){case 0:return!0;case 1:return!1;default:throw this.finishedErrors({code:i,jobId:e,command:"moveToWaitingChildren",state:"active"})}}getRateLimitTtlArgs(e){return[this.queue.keys.limiter,this.queue.keys.meta].concat([null!=e?e:"0"])}async getRateLimitTtl(e){let t=await this.queue.client,r=this.getRateLimitTtlArgs(e);return this.execCommand(t,"getRateLimitTtl",r)}async cleanJobsInSet(e,t,r=0){let n=await this.queue.client;return this.execCommand(n,"cleanJobsInSet",[this.queue.toKey(e),this.queue.toKey("events"),this.queue.toKey("repeat"),this.queue.toKey(""),t,r,e])}getJobSchedulerArgs(e){return[this.queue.keys.repeat].concat([e])}async getJobScheduler(e){let t=await this.queue.client,r=this.getJobSchedulerArgs(e);return this.execCommand(t,"getJobScheduler",r)}retryJobArgs(e,t,r,n={}){return[this.queue.keys.active,this.queue.keys.wait,this.queue.keys.paused,this.queue.toKey(e),this.queue.keys.meta,this.queue.keys.events,this.queue.keys.delayed,this.queue.keys.prioritized,this.queue.keys.pc,this.queue.keys.marker,this.queue.keys.stalled].concat([this.queue.toKey(""),Date.now(),(t?"R":"L")+"PUSH",e,r,n.fieldsToUpdate?tc(B(n.fieldsToUpdate)):void 0])}async retryJob(e,t,r="0",n={}){let a=await this.queue.client,i=this.retryJobArgs(e,t,r,n),s=await this.execCommand(a,"retryJob",i);if(s<0)throw this.finishedErrors({code:s,jobId:e,command:"retryJob",state:"active"})}moveJobsToWaitArgs(e,t,r){return[this.queue.toKey(""),this.queue.keys.events,this.queue.toKey(e),this.queue.toKey("wait"),this.queue.toKey("paused"),this.queue.keys.meta,this.queue.keys.active,this.queue.keys.marker].concat([t,r,e])}async retryJobs(e="failed",t=1e3,r=new Date().getTime()){let n=await this.queue.client,a=this.moveJobsToWaitArgs(e,t,r);return this.execCommand(n,"moveJobsToWait",a)}async promoteJobs(e=1e3){let t=await this.queue.client,r=this.moveJobsToWaitArgs("delayed",e,Number.MAX_VALUE);return this.execCommand(t,"moveJobsToWait",r)}async reprocessJob(e,t,r={}){let n=await this.queue.client,a=[this.queue.toKey(e.id),this.queue.keys.events,this.queue.toKey(t),this.queue.keys.wait,this.queue.keys.meta,this.queue.keys.paused,this.queue.keys.active,this.queue.keys.marker],i=[e.id,(e.opts.lifo?"R":"L")+"PUSH","failed"===t?"failedReason":"returnvalue",t,r.resetAttemptsMade?"1":"0",r.resetAttemptsStarted?"1":"0"],s=await this.execCommand(n,"reprocessJob",a.concat(i));if(1!==s)throw this.finishedErrors({code:s,jobId:e.id,command:"reprocessJob",state:t})}async getMetrics(e,t=0,r=-1){let n=await this.queue.client,a=[this.queue.toKey(`metrics:${e}`),this.queue.toKey(`metrics:${e}:data`)];return await this.execCommand(n,"getMetrics",a.concat([t,r]))}async moveToActive(e,t,r){let n=this.queue.opts,a=this.queue.keys,i=[a.wait,a.active,a.prioritized,a.events,a.stalled,a.limiter,a.delayed,a.paused,a.meta,a.pc,a.marker],s=[a[""],Date.now(),tc({token:t,lockDuration:n.lockDuration,limiter:n.limiter,name:r})];return th(await this.execCommand(e,"moveToActive",i.concat(s)))}async promote(e){let t=await this.queue.client,r=[this.queue.keys.delayed,this.queue.keys.wait,this.queue.keys.paused,this.queue.keys.meta,this.queue.keys.prioritized,this.queue.keys.active,this.queue.keys.pc,this.queue.keys.events,this.queue.keys.marker],n=[this.queue.toKey(""),e],a=await this.execCommand(t,"promote",r.concat(n));if(a<0)throw this.finishedErrors({code:a,jobId:e,command:"promote",state:"delayed"})}moveStalledJobsToWaitArgs(){let e=this.queue.opts;return[this.queue.keys.stalled,this.queue.keys.wait,this.queue.keys.active,this.queue.keys["stalled-check"],this.queue.keys.meta,this.queue.keys.paused,this.queue.keys.marker,this.queue.keys.events,this.queue.keys.repeat].concat([e.maxStalledCount,this.queue.toKey(""),Date.now(),e.stalledInterval])}async moveStalledJobsToWait(){let e=await this.queue.client,t=this.moveStalledJobsToWaitArgs();return this.execCommand(e,"moveStalledJobsToWait",t)}async moveJobFromActiveToWait(e,t="0"){let r=await this.queue.client,n=[this.queue.keys.active,this.queue.keys.wait,this.queue.keys.stalled,this.queue.keys.paused,this.queue.keys.meta,this.queue.keys.limiter,this.queue.keys.prioritized,this.queue.keys.marker,this.queue.keys.events],a=[e,t,this.queue.toKey(e)],i=await this.execCommand(r,"moveJobFromActiveToWait",n.concat(a));if(i<0)throw this.finishedErrors({code:i,jobId:e,command:"moveJobFromActiveToWait",state:"active"});return i}async obliterate(e){let t=await this.queue.client,r=[this.queue.keys.meta,this.queue.toKey("")],n=[e.count,e.force?"force":null],a=await this.execCommand(t,"obliterate",r.concat(n));if(a<0)switch(a){case -1:throw Error("Cannot obliterate non-paused queue");case -2:throw Error("Cannot obliterate queue with active jobs")}return a}async paginate(e,t){let r=await this.queue.client,n=[e],a=t.end>=0?t.end-t.start+1:1/0,i="0",s=0,o,l,d,u=[],c=[];do{let e=[t.start+u.length,t.end,i,s,5];t.fetchJobs&&e.push(1),[i,s,o,l,d]=await this.execCommand(r,"paginate",n.concat(e)),u=u.concat(o),d&&d.length&&(c=c.concat(d.map(Y)))}while("0"!=i&&u.length<a)if(!(u.length&&Array.isArray(u[0])))return{cursor:i,items:u.map(e=>({id:e})),total:l,jobs:c};{let e=[];for(let t=0;t<u.length;t++){let[r,n]=u[t];try{e.push({id:r,v:JSON.parse(n)})}catch(t){e.push({id:r,err:t.message})}}return{cursor:i,items:e,total:l,jobs:c}}}finishedErrors({code:e,jobId:t,parentKey:r,command:n,state:a}){let i;switch(e){case K.JobNotExist:i=Error(`Missing key for job ${t}. ${n}`);break;case K.JobLockNotExist:i=Error(`Missing lock for job ${t}. ${n}`);break;case K.JobNotInState:i=Error(`Job ${t} is not in the ${a} state. ${n}`);break;case K.JobPendingChildren:i=Error(`Job ${t} has pending dependencies. ${n}`);break;case K.ParentJobNotExist:i=Error(`Missing key for parent job ${r}. ${n}`);break;case K.JobLockMismatch:i=Error(`Lock mismatch for job ${t}. Cmd ${n} from ${a}`);break;case K.ParentJobCannotBeReplaced:i=Error(`The parent job ${r} cannot be replaced. ${n}`);break;case K.JobBelongsToJobScheduler:i=Error(`Job ${t} belongs to a job scheduler and cannot be removed directly. ${n}`);break;case K.JobHasFailedChildren:i=new tu(`Cannot complete job ${t} because it has at least one failed child. ${n}`);break;case K.SchedulerJobIdCollision:i=Error(`Cannot create job scheduler iteration - job ID already exists. ${n}`);break;case K.SchedulerJobSlotsBusy:i=Error(`Cannot create job scheduler iteration - current and next time slots already have jobs. ${n}`);break;default:i=Error(`Unknown code ${e} error for ${t}. ${n}`)}return i.code=e,i}async removeOrphanedJobs(e,t,r){let n=await this.queue.client,a=[this.queue.toKey(""),t.length,...t,r.length,...r,...e];return this.execCommand(n,"removeOrphanedJobs",a)}}function th(e){if(e){let t=[null,e[1],e[2],e[3]];return e[0]&&(t[0]=Y(e[0])),t}return[]}let ty=e=>new tp({keys:e.keys,client:e.client,get redisVersion(){return e.redisVersion},toKey:e.toKey,opts:e.opts,closing:e.closing,databaseType:e.databaseType}),tm=(0,ea.debuglog)("bull");class tf{constructor(e,t,r,n={},a){this.queue=e,this.name=t,this.data=r,this.opts=n,this.id=a,this.progress=0,this.returnvalue=null,this.stacktrace=null,this.delay=0,this.priority=0,this.attemptsStarted=0,this.attemptsMade=0,this.stalledCounter=0;const i=this.opts,{repeatJobKey:s}=i,o=en(i,["repeatJobKey"]);this.opts=Object.assign({attempts:0},o),this.delay=this.opts.delay,this.priority=this.opts.priority||0,this.repeatJobKey=s,this.timestamp=n.timestamp?n.timestamp:Date.now(),this.opts.backoff=l.normalize(n.backoff),this.parentKey=Q(n.parent),n.parent&&(this.parent={id:n.parent.id,queueKey:n.parent.queue},n.failParentOnFailure&&(this.parent.fpof=!0),n.removeDependencyOnFailure&&(this.parent.rdof=!0),n.ignoreDependencyOnFailure&&(this.parent.idof=!0),n.continueParentOnFailure&&(this.parent.cpof=!0)),this.debounceId=n.debounce?n.debounce.id:void 0,this.deduplicationId=n.deduplication?n.deduplication.id:this.debounceId,this.toKey=e.toKey.bind(e),this.createScripts(),this.queueQualifiedName=e.qualifiedName}static async create(e,t,r,n){let a=await e.client,i=new this(e,t,r,n,n&&n.jobId);return i.id=await i.addJob(a,{parentKey:i.parentKey,parentDependenciesKey:i.parentKey?`${i.parentKey}:dependencies`:""}),i}static async createBulk(e,t){let r=await e.client,n=t.map(t=>{var r;return new this(e,t.name,t.data,t.opts,null==(r=t.opts)?void 0:r.jobId)}),a=r.pipeline();for(let e of n)e.addJob(a,{parentKey:e.parentKey,parentDependenciesKey:e.parentKey?`${e.parentKey}:dependencies`:""});let i=await a.exec();for(let e=0;e<i.length;++e){let[t,r]=i[e];if(t)throw t;n[e].id=r}return n}static fromJSON(e,t,r){let n=JSON.parse(t.data||"{}"),a=tf.optsFromJSON(t.opts),i=new this(e,t.name,n,a,t.id||r);return i.progress=JSON.parse(t.progress||"0"),i.delay=parseInt(t.delay),i.priority=parseInt(t.priority),i.timestamp=parseInt(t.timestamp),t.finishedOn&&(i.finishedOn=parseInt(t.finishedOn)),t.processedOn&&(i.processedOn=parseInt(t.processedOn)),t.rjk&&(i.repeatJobKey=t.rjk),t.deid&&(i.debounceId=t.deid,i.deduplicationId=t.deid),t.failedReason&&(i.failedReason=t.failedReason),i.attemptsStarted=parseInt(t.ats||"0"),i.attemptsMade=parseInt(t.attemptsMade||t.atm||"0"),i.stalledCounter=parseInt(t.stc||"0"),t.defa&&(i.deferredFailure=t.defa),i.stacktrace=function(e){if(!e)return[];let t=V(JSON.parse,JSON,[e]);return t!==G&&t instanceof Array?t:[]}(t.stacktrace),"string"==typeof t.returnvalue&&(i.returnvalue=tb(t.returnvalue)),t.parentKey?i.parentKey=t.parentKey:i.parentKey=void 0,t.parent?i.parent=JSON.parse(t.parent):i.parent=void 0,t.pb&&(i.processedBy=t.pb),t.nrjid&&(i.nextRepeatableJobId=t.nrjid),i}createScripts(){this.scripts=ty(this.queue)}static optsFromJSON(e,t=U){let r=Object.entries(JSON.parse(e||"{}")),n={};for(let e of r){let[r,a]=e;t[r]?n[t[r]]=a:"tm"===r?n.telemetry=Object.assign(Object.assign({},n.telemetry),{metadata:a}):"omc"===r?n.telemetry=Object.assign(Object.assign({},n.telemetry),{omitContext:a}):n[r]=a}return n}static async fromId(e,t){if(t){let r=await e.client,n=await r.hgetall(e.toKey(t));return!function(e){for(let t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}(n)?this.fromJSON(e,n,t):void 0}}static addJobLog(e,t,r,n){return e.scripts.addLog(t,r,n)}toJSON(){let{queue:e,scripts:t}=this;return en(this,["queue","scripts"])}asJSON(){var e={id:this.id,name:this.name,data:JSON.stringify(void 0===this.data?{}:this.data),opts:tf.optsAsJSON(this.opts),parent:this.parent?Object.assign({},this.parent):void 0,parentKey:this.parentKey,progress:this.progress,attemptsMade:this.attemptsMade,attemptsStarted:this.attemptsStarted,stalledCounter:this.stalledCounter,finishedOn:this.finishedOn,processedOn:this.processedOn,timestamp:this.timestamp,failedReason:JSON.stringify(this.failedReason),stacktrace:JSON.stringify(this.stacktrace),debounceId:this.debounceId,deduplicationId:this.deduplicationId,repeatJobKey:this.repeatJobKey,returnvalue:JSON.stringify(this.returnvalue),nrjid:this.nextRepeatableJobId};let t={};for(let r in e)void 0!==e[r]&&(t[r]=e[r]);return t}static optsAsJSON(e={},t=W){let r=Object.entries(e),n={};for(let[e,a]of r)void 0!==a&&(e in t?n[t[e]]=a:"telemetry"===e?(void 0!==a.metadata&&(n.tm=a.metadata),void 0!==a.omitContext&&(n.omc=a.omitContext)):n[e]=a);return n}asJSONSandbox(){return Object.assign(Object.assign({},this.asJSON()),{queueName:this.queueName,queueQualifiedName:this.queueQualifiedName,prefix:this.prefix})}updateData(e){return this.data=e,this.scripts.updateData(this,e)}async updateProgress(e){this.progress=e,await this.scripts.updateProgress(this.id,e),this.queue.emit("progress",this,e)}async log(e){return tf.addJobLog(this.queue,this.id,e,this.opts.keepLogs)}async removeChildDependency(){return!!await this.scripts.removeChildDependency(this.id,this.parentKey)&&(this.parent=void 0,this.parentKey=void 0,!0)}async clearLogs(e){let t=await this.queue.client,r=this.toKey(this.id)+":logs";e?await t.ltrim(r,-e,-1):await t.del(r)}async remove({removeChildren:e=!0}={}){await this.queue.waitUntilReady();let t=this.queue;if(await this.scripts.remove(this.id,e))t.emit("removed",this);else throw Error(`Job ${this.id} could not be removed because it is locked by another worker`)}async removeUnprocessedChildren(){let e=this.id;await this.scripts.removeUnprocessedChildren(e)}extendLock(e,t){return this.scripts.extendLock(this.id,e,t)}async moveToCompleted(e,t,r=!0){return this.queue.trace(k.INTERNAL,"complete",this.queue.name,async n=>{this.setSpanJobAttributes(n),await this.queue.waitUntilReady(),this.returnvalue=e||void 0;let a=V(JSON.stringify,JSON,[e]);if(a===G)throw G.value;let i=this.scripts.moveToCompletedArgs(this,a,this.opts.removeOnComplete,t,r),s=await this.scripts.moveToFinished(this.id,i);return this.finishedOn=i[this.scripts.moveToFinishedKeys.length+1],this.attemptsMade+=1,this.recordJobMetrics("completed"),s})}async moveToWait(e){let t=await this.scripts.moveJobFromActiveToWait(this.id,e);return this.recordJobMetrics("waiting"),t}async shouldRetryJob(e){if(!(this.attemptsMade+1<this.opts.attempts)||this.discarded||e instanceof tu||"UnrecoverableError"==e.name)return[!1,0];{let t=this.queue.opts,r=await l.calculate(this.opts.backoff,this.attemptsMade+1,e,this,t.settings&&t.settings.backoffStrategy);return[-1!=r,-1==r?0:r]}}async moveToFailed(e,t,r=!1){this.failedReason=null==e?void 0:e.message;let[n,a]=await this.shouldRetryJob(e);return this.queue.trace(k.INTERNAL,this.getSpanOperation(n,a),this.queue.name,async(i,s)=>{var o,l;let d,u,c;this.setSpanJobAttributes(i),(null==(l=null==(o=this.opts)?void 0:o.telemetry)?void 0:l.omitContext)||!s||(d=s),this.updateStacktrace(e);let p={failedReason:this.failedReason,stacktrace:JSON.stringify(this.stacktrace),tm:d};if(n)a?(u=await this.scripts.moveToDelayed(this.id,Date.now(),a,t,{fieldsToUpdate:p,fetchNext:r}),this.recordJobMetrics("delayed")):(u=await this.scripts.retryJob(this.id,this.opts.lifo,t,{fieldsToUpdate:p}),this.recordJobMetrics("retried"));else{let e=this.scripts.moveToFailedArgs(this,this.failedReason,this.opts.removeOnFail,t,r,p);u=await this.scripts.moveToFinished(this.id,e),c=e[this.scripts.moveToFinishedKeys.length+1],this.recordJobMetrics("failed")}return c&&"number"==typeof c&&(this.finishedOn=c),a&&"number"==typeof a&&(this.delay=a),this.attemptsMade+=1,u})}getSpanOperation(e,t){return e?t?"delay":"retry":"fail"}recordJobMetrics(e){var t,r;let n=null==(r=null==(t=this.queue.opts)?void 0:t.telemetry)?void 0:r.meter;if(!n)return;let a={[E.QueueName]:this.queue.name,[E.JobName]:this.name,[E.JobStatus]:e},i={completed:I.JobsCompleted,failed:I.JobsFailed,delayed:I.JobsDelayed,retried:I.JobsRetried,waiting:I.JobsWaiting,"waiting-children":I.JobsWaitingChildren}[e];if(n.createCounter(i,{description:`Number of jobs ${e}`,unit:"1"}).add(1,a),this.processedOn){let e=Date.now()-this.processedOn;n.createHistogram(I.JobDuration,{description:"Job processing duration",unit:"ms"}).record(e,a)}}isCompleted(){return this.isInZSet("completed")}isFailed(){return this.isInZSet("failed")}isDelayed(){return this.isInZSet("delayed")}isWaitingChildren(){return this.isInZSet("waiting-children")}isActive(){return this.isInList("active")}async isWaiting(){return await this.isInList("wait")||await this.isInList("paused")}get queueName(){return this.queue.name}get prefix(){return this.queue.opts.prefix}getState(){return this.scripts.getState(this.id)}async changeDelay(e){await this.scripts.changeDelay(this.id,e),this.delay=e}async changePriority(e){await this.scripts.changePriority(this.id,e.priority,e.lifo),this.priority=e.priority||0}async getChildrenValues(){let e=await this.queue.client,t=await e.hgetall(this.toKey(`${this.id}:processed`));if(t)return et(t)}async getIgnoredChildrenFailures(){return(await this.queue.client).hgetall(this.toKey(`${this.id}:failed`))}async getFailedChildrenValues(){return(await this.queue.client).hgetall(this.toKey(`${this.id}:failed`))}async getDependencies(e={}){let t=(await this.queue.client).pipeline();if(e.processed||e.unprocessed||e.ignored||e.failed){let r,n,a,i,s,o,l,d,u={cursor:0,count:20},c=[];if(e.processed){c.push("processed");let r=Object.assign(Object.assign({},u),e.processed);t.hscan(this.toKey(`${this.id}:processed`),r.cursor,{COUNT:r.count})}if(e.unprocessed){c.push("unprocessed");let r=Object.assign(Object.assign({},u),e.unprocessed);t.sscan(this.toKey(`${this.id}:dependencies`),r.cursor,{COUNT:r.count})}if(e.ignored){c.push("ignored");let r=Object.assign(Object.assign({},u),e.ignored);t.hscan(this.toKey(`${this.id}:failed`),r.cursor,{COUNT:r.count})}if(e.failed){c.push("failed");let n=Object.assign(Object.assign({},u),e.failed);r=n.cursor+n.count,t.zrange(this.toKey(`${this.id}:unsuccessful`),n.cursor,n.count-1)}let p=await t.exec();return c.forEach((e,t)=>{switch(e){case"processed":{n=p[t][1][0];let e=p[t][1][1],r={};for(let t=0;t<e.length;++t)t%2&&(r[e[t-1]]=JSON.parse(e[t]));a=r;break}case"failed":o=p[t][1];break;case"ignored":{l=p[t][1][0];let e=p[t][1][1],r={};for(let t=0;t<e.length;++t)t%2&&(r[e[t-1]]=e[t]);d=r;break}case"unprocessed":i=p[t][1][0],s=p[t][1][1]}}),Object.assign(Object.assign(Object.assign(Object.assign({},n?{processed:a,nextProcessedCursor:Number(n)}:{}),l?{ignored:d,nextIgnoredCursor:Number(l)}:{}),r?{failed:o,nextFailedCursor:r}:{}),i?{unprocessed:s,nextUnprocessedCursor:Number(i)}:{})}{t.hgetall(this.toKey(`${this.id}:processed`)),t.smembers(this.toKey(`${this.id}:dependencies`)),t.hgetall(this.toKey(`${this.id}:failed`)),t.zrange(this.toKey(`${this.id}:unsuccessful`),0,-1);let[[e,r],[n,a],[i,s],[o,l]]=await t.exec();return{processed:et(r),unprocessed:a,failed:l,ignored:s}}}async getDependenciesCount(e={}){let t=[];Object.entries(e).forEach(([e,r])=>{r&&t.push(e)});let r=t.length?t:["processed","unprocessed","ignored","failed"],n=await this.scripts.getDependencyCounts(this.id,r),a={};return n.forEach((e,t)=>{a[`${r[t]}`]=e||0}),a}async waitUntilFinished(e,t){await this.queue.waitUntilReady();let r=this.id;return new Promise(async(n,a)=>{let i;function s(e){u(),n(e.returnvalue)}function o(e){u(),a(Error(e.failedReason||e))}t&&(i=setTimeout(()=>o(`Job wait ${this.name} timed out before finishing, no finish notification arrived after ${t}ms (id=${r})`),t));let l=`completed:${r}`,d=`failed:${r}`;e.on(l,s),e.on(d,o),this.queue.on("closing",o);let u=()=>{clearInterval(i),e.removeListener(l,s),e.removeListener(d,o),this.queue.removeListener("closing",o)};await e.waitUntilReady();let[c,p]=await this.scripts.isFinished(r,!0);0!=c&&(-1==c||2==c?o({failedReason:p}):s({returnvalue:tb(p)}))})}async moveToDelayed(e,t){let r=Date.now(),n=e-r,a=n>0?n:0;await this.scripts.moveToDelayed(this.id,r,a,t,{skipAttempt:!0}),this.delay=a,this.recordJobMetrics("delayed")}async moveToWaitingChildren(e,t={}){let r=await this.scripts.moveToWaitingChildren(this.id,e,t);return r&&this.recordJobMetrics("waiting-children"),r}async promote(){let e=this.id;await this.scripts.promote(e),this.delay=0}async retry(e="failed",t={}){await this.scripts.reprocessJob(this,e,t),this.failedReason=null,this.finishedOn=null,this.processedOn=null,this.returnvalue=null,t.resetAttemptsMade&&(this.attemptsMade=0),t.resetAttemptsStarted&&(this.attemptsStarted=0)}discard(){this.discarded=!0}async isInZSet(e){let t=await this.queue.client;return null!==await t.zscore(this.queue.toKey(e),this.id)}async isInList(e){return this.scripts.isJobInList(this.queue.toKey(e),this.id)}addJob(e,t){let r=this.asJSON();return this.validateOptions(r),this.scripts.addJob(e,r,r.opts,this.id,t)}async removeDeduplicationKey(){return!!this.deduplicationId&&await this.scripts.removeDeduplicationKey(this.deduplicationId,this.id)>0}validateOptions(e){var t,r,n,a,i,s,o,l,d;if(this.opts.sizeLimit&&(d=e.data,Buffer.byteLength(d,"utf8")>this.opts.sizeLimit))throw Error(`The size of job ${this.name} exceeds the limit ${this.opts.sizeLimit} bytes`);if(this.opts.delay&&this.opts.repeat&&!(null==(t=this.opts.repeat)?void 0:t.count))throw Error("Delay and repeat options cannot be used together");let u=["removeDependencyOnFailure","failParentOnFailure","continueParentOnFailure","ignoreDependencyOnFailure"].filter(e=>this.opts[e]);if(u.length>1){let e=u.join(", ");throw Error(`The following options cannot be used together: ${e}`)}if(null==(r=this.opts)?void 0:r.jobId){if(`${parseInt(this.opts.jobId,10)}`===(null==(n=this.opts)?void 0:n.jobId))throw Error("Custom Id cannot be integers");if((null==(a=this.opts)?void 0:a.jobId.includes(":"))&&(null==(s=null==(i=this.opts)?void 0:i.jobId)?void 0:s.split(":").length)!==3)throw Error("Custom Id cannot contain :")}if(this.opts.priority){if(Math.trunc(this.opts.priority)!==this.opts.priority)throw Error("Priority should not be float");if(this.opts.priority>2097151)throw Error("Priority should be between 0 and 2097151")}if(this.opts.deduplication){if(!(null==(o=this.opts.deduplication)?void 0:o.id))throw Error("Deduplication id must be provided");if(this.parentKey)throw Error("Deduplication and parent options cannot be used together")}if(this.opts.debounce){if(!(null==(l=this.opts.debounce)?void 0:l.id))throw Error("Debounce id must be provided");if(this.parentKey)throw Error("Debounce and parent options cannot be used together")}if("object"==typeof this.opts.backoff&&"number"==typeof this.opts.backoff.jitter&&(this.opts.backoff.jitter<0||this.opts.backoff.jitter>1))throw Error("Jitter should be between 0 and 1")}updateStacktrace(e){this.stacktrace=this.stacktrace||[],(null==e?void 0:e.stack)&&(this.stacktrace.push(e.stack),0===this.opts.stackTraceLimit?this.stacktrace=[]:this.opts.stackTraceLimit&&(this.stacktrace=this.stacktrace.slice(-this.opts.stackTraceLimit)))}setSpanJobAttributes(e){null==e||e.setAttributes({[E.JobName]:this.name,[E.JobId]:this.id})}}function tb(e){let t=V(JSON.parse,JSON,[e]);if(t!==G)return t;tm("corrupted returnvalue: "+e,t)}class tg{constructor(e="bull"){this.prefix=e}getKeys(e){let t={};return["","active","wait","waiting-children","paused","id","delayed","prioritized","stalled-check","completed","failed","stalled","repeat","limiter","meta","events","pc","marker","de"].forEach(r=>{t[r]=this.toKey(e,r)}),t}toKey(e,t){return`${this.getQueueQualifiedName(e)}:${t}`}getQueueQualifiedName(e){return`${this.prefix}:${e}`}}var tK=N,tv=e.i(42512);e.s([],61408),e.i(61408);let tS={name:"addDelayedJob",content:`--[[
  Adds a delayed job to the queue by doing the following:
    - Increases the job counter if needed.
    - Creates a new job key with the job data.
    - computes timestamp.
    - adds to delayed zset.
    - Emits a global event 'delayed' if the job is delayed.
    Input:
      KEYS[1] 'marker',
      KEYS[2] 'meta'
      KEYS[3] 'id'
      KEYS[4] 'delayed'
      KEYS[5] 'completed'
      KEYS[6] events stream key
      ARGV[1] msgpacked arguments array
            [1]  key prefix,
            [2]  custom id (use custom instead of one generated automatically)
            [3]  name
            [4]  timestamp
            [5]  parentKey?
            [6]  parent dependencies key.
            [7]  parent? {id, queueKey}
            [8]  repeat job key
            [9] deduplication key
      ARGV[2] Json stringified job data
      ARGV[3] msgpacked options
      Output:
        jobId  - OK
        -5     - Missing parent key
]]
local metaKey = KEYS[2]
local idKey = KEYS[3]
local delayedKey = KEYS[4]
local completedKey = KEYS[5]
local eventsKey = KEYS[6]
local jobId
local jobIdKey
local rcall = redis.call
local args = cmsgpack.unpack(ARGV[1])
local data = ARGV[2]
local parentKey = args[5]
local parent = args[7]
local repeatJobKey = args[8]
local deduplicationKey = args[9]
local parentData
-- Includes
--[[
  Adds a delayed job to the queue by doing the following:
    - Creates a new job key with the job data.
    - adds to delayed zset.
    - Emits a global event 'delayed' if the job is delayed.
]]
-- Includes
--[[
  Add delay marker if needed.
]]
-- Includes
--[[
  Function to return the next delayed job timestamp.
]]
local function getNextDelayedTimestamp(delayedKey)
  local result = rcall("ZRANGE", delayedKey, 0, 0, "WITHSCORES")
  if #result then
    local nextTimestamp = tonumber(result[2])
    if nextTimestamp ~= nil then
      return nextTimestamp / 0x1000
    end
  end
end
local function addDelayMarkerIfNeeded(markerKey, delayedKey)
  local nextTimestamp = getNextDelayedTimestamp(delayedKey)
  if nextTimestamp ~= nil then
    -- Replace the score of the marker with the newest known
    -- next timestamp.
    rcall("ZADD", markerKey, nextTimestamp, "1")
  end
end
--[[
  Bake in the job id first 12 bits into the timestamp
  to guarantee correct execution order of delayed jobs
  (up to 4096 jobs per given timestamp or 4096 jobs apart per timestamp)
  WARNING: Jobs that are so far apart that they wrap around will cause FIFO to fail
]]
local function getDelayedScore(delayedKey, timestamp, delay)
  local delayedTimestamp = (delay > 0 and (tonumber(timestamp) + delay)) or tonumber(timestamp)
  local minScore = delayedTimestamp * 0x1000
  local maxScore = (delayedTimestamp + 1 ) * 0x1000 - 1
  local result = rcall("ZREVRANGEBYSCORE", delayedKey, maxScore,
    minScore, "WITHSCORES","LIMIT", 0, 1)
  if #result then
    local currentMaxScore = tonumber(result[2])
    if currentMaxScore ~= nil then
      if currentMaxScore >= maxScore then
        return maxScore, delayedTimestamp
      else
        return currentMaxScore + 1, delayedTimestamp
      end
    end
  end
  return minScore, delayedTimestamp
end
local function addDelayedJob(jobId, delayedKey, eventsKey, timestamp,
  maxEvents, markerKey, delay)
  local score, delayedTimestamp = getDelayedScore(delayedKey, timestamp, tonumber(delay))
  rcall("ZADD", delayedKey, score, jobId)
  rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "delayed",
    "jobId", jobId, "delay", delayedTimestamp)
  -- mark that a delayed job is available
  addDelayMarkerIfNeeded(markerKey, delayedKey)
end
--[[
  Function to debounce a job.
]]
-- Includes
--[[
  Function to deduplicate a job.
]]
--[[
  Function to set the deduplication key for a job.
  Uses TTL from deduplication opts if provided.
]]
local function setDeduplicationKey(deduplicationKey, jobId, deduplicationOpts)
    local ttl = deduplicationOpts and deduplicationOpts['ttl']
    if ttl and ttl > 0 then
        rcall('SET', deduplicationKey, jobId, 'PX', ttl)
    else
        rcall('SET', deduplicationKey, jobId)
    end
end
--[[
  Function to store a deduplicated next job if the existing job is active
  and keepLastIfActive is set. When the active job finishes, the stored
  proto-job is used to create a real job in the queue.
  Returns true if the proto-job was stored, false otherwise.
]]
--[[
  Function to check if an item belongs to a list.
]]
local function checkItemInList(list, item)
  for _, v in pairs(list) do
    if v == item then
      return 1
    end
  end
  return nil
end
local function storeDeduplicatedNextJob(deduplicationOpts, currentDebounceJobId, prefix,
    deduplicationId, jobName, jobData, fullOpts, eventsKey, maxEvents, jobId,
    parentKey, parentData, parentDependenciesKey, repeatJobKey)
    if deduplicationOpts['keepLastIfActive'] and currentDebounceJobId then
        local activeKey = prefix .. "active"
        local activeItems = rcall('LRANGE', activeKey, 0, -1)
        if checkItemInList(activeItems, currentDebounceJobId) then
            local deduplicationNextKey = prefix .. "dn:" .. deduplicationId
            local fields = {'name', jobName, 'data', jobData, 'opts', cjson.encode(fullOpts),
                'jid', jobId}
            if parentKey then
                fields[#fields+1] = 'pk'
                fields[#fields+1] = parentKey
            end
            if parentData then
                fields[#fields+1] = 'pd'
                fields[#fields+1] = parentData
            end
            if parentDependenciesKey then
                fields[#fields+1] = 'pdk'
                fields[#fields+1] = parentDependenciesKey
            end
            if repeatJobKey then
                fields[#fields+1] = 'rjk'
                fields[#fields+1] = repeatJobKey
            end
            rcall('DEL', deduplicationNextKey)
            rcall('HSET', deduplicationNextKey, unpack(fields))
            -- Ensure the dedup key does not expire while the job is active,
            -- so subsequent adds always hit the dedup path and never bypass
            -- the active-check because of a TTL expiry.
            local deduplicationKey = prefix .. "de:" .. deduplicationId
            rcall('PERSIST', deduplicationKey)
            -- TODO remove debounced event in next breaking change
            rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "debounced", "jobId",
                currentDebounceJobId, "debounceId", deduplicationId)
            rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "deduplicated", "jobId",
                currentDebounceJobId, "deduplicationId", deduplicationId, "deduplicatedJobId", jobId)
            return true
        end
    end
    return false
end
local function deduplicateJobWithoutReplace(deduplicationId, deduplicationOpts, jobId, deduplicationKey,
    eventsKey, maxEvents, prefix, jobName, jobData, fullOpts,
    parentKey, parentData, parentDependenciesKey, repeatJobKey)
    local ttl = deduplicationOpts['ttl']
    local deduplicationKeyExists
    if ttl and ttl > 0 then
        if deduplicationOpts['extend'] then
            local currentDebounceJobId = rcall('GET', deduplicationKey)
            if currentDebounceJobId then
                if storeDeduplicatedNextJob(deduplicationOpts, currentDebounceJobId, prefix,
                    deduplicationId, jobName, jobData, fullOpts, eventsKey, maxEvents, jobId,
                    parentKey, parentData, parentDependenciesKey, repeatJobKey) then
                    return currentDebounceJobId
                end
                if deduplicationOpts['keepLastIfActive'] then
                    rcall('SET', deduplicationKey, currentDebounceJobId)
                else
                    setDeduplicationKey(deduplicationKey, currentDebounceJobId, deduplicationOpts)
                end
                rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "debounced",
                    "jobId", currentDebounceJobId, "debounceId", deduplicationId)
                rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "deduplicated", "jobId",
                    currentDebounceJobId, "deduplicationId", deduplicationId, "deduplicatedJobId", jobId)
                return currentDebounceJobId
            else
                if deduplicationOpts['keepLastIfActive'] then
                    rcall('SET', deduplicationKey, jobId)
                else
                    setDeduplicationKey(deduplicationKey, jobId, deduplicationOpts)
                end
                return
            end
        else
            if deduplicationOpts['keepLastIfActive'] then
                deduplicationKeyExists = not rcall('SET', deduplicationKey, jobId, 'NX')
            else
                deduplicationKeyExists = not rcall('SET', deduplicationKey, jobId, 'PX', ttl, 'NX')
            end
        end
    else
        deduplicationKeyExists = not rcall('SET', deduplicationKey, jobId, 'NX')
    end
    if deduplicationKeyExists then
        local currentDebounceJobId = rcall('GET', deduplicationKey)
        if storeDeduplicatedNextJob(deduplicationOpts, currentDebounceJobId, prefix,
            deduplicationId, jobName, jobData, fullOpts, eventsKey, maxEvents, jobId,
            parentKey, parentData, parentDependenciesKey, repeatJobKey) then
            return currentDebounceJobId
        end
        -- TODO remove debounced event in next breaking change
        rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "debounced", "jobId",
            currentDebounceJobId, "debounceId", deduplicationId)
        rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "deduplicated", "jobId",
            currentDebounceJobId, "deduplicationId", deduplicationId, "deduplicatedJobId", jobId)
        return currentDebounceJobId
    end
end
--[[
  Function to remove job keys.
]]
local function removeJobKeys(jobKey)
  return rcall("DEL", jobKey, jobKey .. ':logs', jobKey .. ':dependencies',
    jobKey .. ':processed', jobKey .. ':failed', jobKey .. ':unsuccessful')
end
local function removeDelayedJob(delayedKey, deduplicationKey, eventsKey, maxEvents, currentDeduplicatedJobId,
    jobId, deduplicationId, prefix)
    if rcall("ZREM", delayedKey, currentDeduplicatedJobId) > 0 then
        removeJobKeys(prefix .. currentDeduplicatedJobId)
        rcall("XADD", eventsKey, "*", "event", "removed", "jobId", currentDeduplicatedJobId,
            "prev", "delayed")
        -- TODO remove debounced event in next breaking change
        rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "debounced", "jobId",
            jobId, "debounceId", deduplicationId)
        rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "deduplicated", "jobId",
            jobId, "deduplicationId", deduplicationId, "deduplicatedJobId", currentDeduplicatedJobId)
        return true
    end
    return false
end
local function deduplicateJob(deduplicationOpts, jobId, delayedKey, deduplicationKey, eventsKey, maxEvents,
    prefix, jobName, jobData, fullOpts, parentKey, parentData, parentDependenciesKey, repeatJobKey)
    local deduplicationId = deduplicationOpts and deduplicationOpts['id']
    if deduplicationId then
        if deduplicationOpts['replace'] then
            local currentDebounceJobId = rcall('GET', deduplicationKey)
            if currentDebounceJobId then
                local isRemoved = removeDelayedJob(delayedKey, deduplicationKey, eventsKey, maxEvents,
                    currentDebounceJobId, jobId, deduplicationId, prefix)
                if isRemoved then
                    if deduplicationOpts['keepLastIfActive'] then
                        rcall('SET', deduplicationKey, jobId)
                    else
                        local ttl = deduplicationOpts['ttl']
                        if not deduplicationOpts['extend'] and ttl and ttl > 0 then
                            rcall('SET', deduplicationKey, jobId, 'KEEPTTL')
                        else
                            setDeduplicationKey(deduplicationKey, jobId, deduplicationOpts)
                        end
                    end
                    return
                else
                    storeDeduplicatedNextJob(deduplicationOpts, currentDebounceJobId, prefix,
                        deduplicationId, jobName, jobData, fullOpts, eventsKey, maxEvents, jobId,
                        parentKey, parentData, parentDependenciesKey, repeatJobKey)
                    return currentDebounceJobId
                end
            else
                if deduplicationOpts['keepLastIfActive'] then
                    rcall('SET', deduplicationKey, jobId)
                else
                    setDeduplicationKey(deduplicationKey, jobId, deduplicationOpts)
                end
                return
            end
        else
            return deduplicateJobWithoutReplace(deduplicationId, deduplicationOpts,
                jobId, deduplicationKey, eventsKey, maxEvents, prefix, jobName, jobData, fullOpts,
                parentKey, parentData, parentDependenciesKey, repeatJobKey)
        end
    end
end
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
--[[
  Function to handle the case when job is duplicated.
]]
-- Includes
--[[
    This function is used to update the parent's dependencies if the job
    is already completed and about to be ignored. The parent must get its
    dependencies updated to avoid the parent job being stuck forever in 
    the waiting-children state.
]]
-- Includes
--[[
  Validate and move or add dependencies to parent.
]]
-- Includes
--[[
  Validate and move parent to a wait status (waiting, delayed or prioritized)
  if no pending dependencies.
]]
-- Includes
--[[
  Validate and move parent to a wait status (waiting, delayed or prioritized) if needed.
]]
-- Includes
--[[
  Move parent to a wait status (wait, prioritized or delayed)
]]
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to add job considering priority.
]]
-- Includes
--[[
  Function to get priority score.
]]
local function getPriorityScore(priority, priorityCounterKey)
  local prioCounter = rcall("INCR", priorityCounterKey)
  return priority * 0x100000000 + prioCounter % 0x100000000
end
local function addJobWithPriority(markerKey, prioritizedKey, priority, jobId, priorityCounterKey,
  isPausedOrMaxed)
  local score = getPriorityScore(priority, priorityCounterKey)
  rcall("ZADD", prioritizedKey, score, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to check if queue is paused or maxed
  (since an empty list and !EXISTS are not really the same).
]]
local function isQueuePausedOrMaxed(queueMetaKey, activeKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency")
  if queueAttributes[1] then
    return true
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      return activeCount >= tonumber(queueAttributes[2])
    end
  end
  return false
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
local function moveParentToWait(parentQueueKey, parentKey, parentId, timestamp)
    local parentWaitKey = parentQueueKey .. ":wait"
    local parentPausedKey = parentQueueKey .. ":paused"
    local parentActiveKey = parentQueueKey .. ":active"
    local parentMetaKey = parentQueueKey .. ":meta"
    local parentMarkerKey = parentQueueKey .. ":marker"
    local jobAttributes = rcall("HMGET", parentKey, "priority", "delay")
    local priority = tonumber(jobAttributes[1]) or 0
    local delay = tonumber(jobAttributes[2]) or 0
    if delay > 0 then
        local delayedTimestamp = tonumber(timestamp) + delay
        local score = delayedTimestamp * 0x1000
        local parentDelayedKey = parentQueueKey .. ":delayed"
        rcall("ZADD", parentDelayedKey, score, parentId)
        rcall("XADD", parentQueueKey .. ":events", "*", "event", "delayed", "jobId", parentId, "delay",
            delayedTimestamp)
        addDelayMarkerIfNeeded(parentMarkerKey, parentDelayedKey)
    else
        if priority == 0 then
            local parentTarget, isParentPausedOrMaxed = getTargetQueueList(parentMetaKey, parentActiveKey,
                parentWaitKey, parentPausedKey)
            addJobInTargetList(parentTarget, parentMarkerKey, "RPUSH", isParentPausedOrMaxed, parentId)
        else
            local isPausedOrMaxed = isQueuePausedOrMaxed(parentMetaKey, parentActiveKey)
            addJobWithPriority(parentMarkerKey, parentQueueKey .. ":prioritized", priority, parentId,
                parentQueueKey .. ":pc", isPausedOrMaxed)
        end
        rcall("XADD", parentQueueKey .. ":events", "*", "event", "waiting", "jobId", parentId, "prev",
            "waiting-children")
    end
end
local function moveParentToWaitIfNeeded(parentQueueKey, parentKey, parentId, timestamp)
  if rcall("EXISTS", parentKey) == 1 then
    local parentWaitingChildrenKey = parentQueueKey .. ":waiting-children"
    if rcall("ZSCORE", parentWaitingChildrenKey, parentId) then    
      rcall("ZREM", parentWaitingChildrenKey, parentId)
      moveParentToWait(parentQueueKey, parentKey, parentId, timestamp)
    end
  end
end
local function moveParentToWaitIfNoPendingDependencies(parentQueueKey, parentDependenciesKey, parentKey,
  parentId, timestamp)
  local doNotHavePendingDependencies = rcall("SCARD", parentDependenciesKey) == 0
  if doNotHavePendingDependencies then
    moveParentToWaitIfNeeded(parentQueueKey, parentKey, parentId, timestamp)
  end
end
local function updateParentDepsIfNeeded(parentKey, parentQueueKey, parentDependenciesKey,
  parentId, jobIdKey, returnvalue, timestamp )
  local processedSet = parentKey .. ":processed"
  rcall("HSET", processedSet, jobIdKey, returnvalue)
  moveParentToWaitIfNoPendingDependencies(parentQueueKey, parentDependenciesKey, parentKey, parentId, timestamp)
end
local function updateExistingJobsParent(parentKey, parent, parentData,
                                        parentDependenciesKey, completedKey,
                                        jobIdKey, jobId, timestamp)
    if parentKey ~= nil then
        if rcall("ZSCORE", completedKey, jobId) then
            local returnvalue = rcall("HGET", jobIdKey, "returnvalue")
            updateParentDepsIfNeeded(parentKey, parent['queueKey'],
                                     parentDependenciesKey, parent['id'],
                                     jobIdKey, returnvalue, timestamp)
        else
            if parentDependenciesKey ~= nil then
                rcall("SADD", parentDependenciesKey, jobIdKey)
            end
        end
        rcall("HMSET", jobIdKey, "parentKey", parentKey, "parent", parentData)
    end
end
local function handleDuplicatedJob(jobKey, jobId, currentParentKey, currentParent,
  parentData, parentDependenciesKey, completedKey, eventsKey, maxEvents, timestamp)
  local existedParentKey = rcall("HGET", jobKey, "parentKey")
  if not existedParentKey or existedParentKey == currentParentKey then
    updateExistingJobsParent(currentParentKey, currentParent, parentData,
      parentDependenciesKey, completedKey, jobKey,
      jobId, timestamp)
  else
    if currentParentKey ~= nil and currentParentKey ~= existedParentKey
      and (rcall("EXISTS", existedParentKey) == 1) then
      return -7
    end
  end
  rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event",
    "duplicated", "jobId", jobId)
  return jobId .. "" -- convert to string
end
--[[
  Function to store a job
]]
local function storeJob(eventsKey, jobIdKey, jobId, name, data, opts, timestamp,
                        parentKey, parentData, repeatJobKey)
    local jsonOpts = cjson.encode(opts)
    local delay = opts['delay'] or 0
    local priority = opts['priority'] or 0
    local debounceId = opts['de'] and opts['de']['id']
    local optionalValues = {}
    if parentKey ~= nil then
        table.insert(optionalValues, "parentKey")
        table.insert(optionalValues, parentKey)
        table.insert(optionalValues, "parent")
        table.insert(optionalValues, parentData)
    end
    if repeatJobKey then
        table.insert(optionalValues, "rjk")
        table.insert(optionalValues, repeatJobKey)
    end
    if debounceId then
        table.insert(optionalValues, "deid")
        table.insert(optionalValues, debounceId)
    end
    rcall("HMSET", jobIdKey, "name", name, "data", data, "opts", jsonOpts,
          "timestamp", timestamp, "delay", delay, "priority", priority,
          unpack(optionalValues))
    rcall("XADD", eventsKey, "*", "event", "added", "jobId", jobId, "name", name)
    return delay, priority
end
if parentKey ~= nil then
    if rcall("EXISTS", parentKey) ~= 1 then return -5 end
    parentData = cjson.encode(parent)
end
local jobCounter = rcall("INCR", idKey)
local maxEvents = getOrSetMaxEvents(metaKey)
local opts = cmsgpack.unpack(ARGV[3])
local parentDependenciesKey = args[6]
local timestamp = args[4]
if args[2] == "" then
    jobId = jobCounter .. "" -- convert to string
    jobIdKey = args[1] .. jobId
else
    jobId = args[2]
    jobIdKey = args[1] .. jobId
    if rcall("EXISTS", jobIdKey) == 1 then
        return handleDuplicatedJob(jobIdKey, jobId, parentKey, parent,
            parentData, parentDependenciesKey, completedKey, eventsKey,
            maxEvents, timestamp)
    end
end
local deduplicationJobId = deduplicateJob(opts['de'], jobId, delayedKey, deduplicationKey,
  eventsKey, maxEvents, args[1], args[3], ARGV[2], opts,
  parentKey, parentData, parentDependenciesKey, repeatJobKey)
if deduplicationJobId then
  return deduplicationJobId
end
local delay, priority = storeJob(eventsKey, jobIdKey, jobId, args[3], ARGV[2],
    opts, timestamp, parentKey, parentData, repeatJobKey)
addDelayedJob(jobId, delayedKey, eventsKey, timestamp, maxEvents, KEYS[1], delay)
-- Check if this job is a child of another job, if so add it to the parents dependencies
if parentDependenciesKey ~= nil then
    rcall("SADD", parentDependenciesKey, jobIdKey)
end
return jobId
`,keys:6};e.s(["addDelayedJob",0,tS],93852),e.i(93852);let tE={name:"addJobScheduler",content:`--[[
  Adds a job scheduler, i.e. a job factory that creates jobs based on a given schedule (repeat options).
    Input:
      KEYS[1]  'repeat' key
      KEYS[2]  'delayed' key
      KEYS[3]  'wait' key
      KEYS[4]  'paused' key
      KEYS[5]  'meta' key
      KEYS[6]  'prioritized' key
      KEYS[7]  'marker' key
      KEYS[8]  'id' key
      KEYS[9]  'events' key
      KEYS[10] 'pc' priority counter
      KEYS[11] 'active' key
      ARGV[1] next milliseconds
      ARGV[2] msgpacked options
            [1]  name
            [2]  tz?
            [3]  pattern?
            [4]  endDate?
            [5]  every?
      ARGV[3] jobs scheduler id
      ARGV[4] Json stringified template data
      ARGV[5] mspacked template opts
      ARGV[6] msgpacked delayed opts
      ARGV[7] timestamp
      ARGV[8] prefix key
      ARGV[9] producer key
      Output:
        repeatableKey  - OK
]] local rcall = redis.call
local repeatKey = KEYS[1]
local delayedKey = KEYS[2]
local waitKey = KEYS[3]
local pausedKey = KEYS[4]
local metaKey = KEYS[5]
local prioritizedKey = KEYS[6]
local eventsKey = KEYS[9]
local nextMillis = ARGV[1]
local jobSchedulerId = ARGV[3]
local templateOpts = cmsgpack.unpack(ARGV[5])
local now = tonumber(ARGV[7])
local prefixKey = ARGV[8]
local jobOpts = cmsgpack.unpack(ARGV[6])
-- Includes
--[[
  Add delay marker if needed.
]]
-- Includes
--[[
  Shared helper to store a job and enqueue it into the appropriate list/set.
  Handles delayed, prioritized, and standard (LIFO/FIFO) jobs.
  Emits the appropriate event after enqueuing ("delayed" or "waiting").
  Returns delay, priority from storeJob.
]]
-- Includes
--[[
  Adds a delayed job to the queue by doing the following:
    - Creates a new job key with the job data.
    - adds to delayed zset.
    - Emits a global event 'delayed' if the job is delayed.
]]
-- Includes
--[[
  Add delay marker if needed.
]]
-- Includes
--[[
  Function to return the next delayed job timestamp.
]]
local function getNextDelayedTimestamp(delayedKey)
  local result = rcall("ZRANGE", delayedKey, 0, 0, "WITHSCORES")
  if #result then
    local nextTimestamp = tonumber(result[2])
    if nextTimestamp ~= nil then
      return nextTimestamp / 0x1000
    end
  end
end
local function addDelayMarkerIfNeeded(markerKey, delayedKey)
  local nextTimestamp = getNextDelayedTimestamp(delayedKey)
  if nextTimestamp ~= nil then
    -- Replace the score of the marker with the newest known
    -- next timestamp.
    rcall("ZADD", markerKey, nextTimestamp, "1")
  end
end
--[[
  Bake in the job id first 12 bits into the timestamp
  to guarantee correct execution order of delayed jobs
  (up to 4096 jobs per given timestamp or 4096 jobs apart per timestamp)
  WARNING: Jobs that are so far apart that they wrap around will cause FIFO to fail
]]
local function getDelayedScore(delayedKey, timestamp, delay)
  local delayedTimestamp = (delay > 0 and (tonumber(timestamp) + delay)) or tonumber(timestamp)
  local minScore = delayedTimestamp * 0x1000
  local maxScore = (delayedTimestamp + 1 ) * 0x1000 - 1
  local result = rcall("ZREVRANGEBYSCORE", delayedKey, maxScore,
    minScore, "WITHSCORES","LIMIT", 0, 1)
  if #result then
    local currentMaxScore = tonumber(result[2])
    if currentMaxScore ~= nil then
      if currentMaxScore >= maxScore then
        return maxScore, delayedTimestamp
      else
        return currentMaxScore + 1, delayedTimestamp
      end
    end
  end
  return minScore, delayedTimestamp
end
local function addDelayedJob(jobId, delayedKey, eventsKey, timestamp,
  maxEvents, markerKey, delay)
  local score, delayedTimestamp = getDelayedScore(delayedKey, timestamp, tonumber(delay))
  rcall("ZADD", delayedKey, score, jobId)
  rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "delayed",
    "jobId", jobId, "delay", delayedTimestamp)
  -- mark that a delayed job is available
  addDelayMarkerIfNeeded(markerKey, delayedKey)
end
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to add job considering priority.
]]
-- Includes
--[[
  Function to get priority score.
]]
local function getPriorityScore(priority, priorityCounterKey)
  local prioCounter = rcall("INCR", priorityCounterKey)
  return priority * 0x100000000 + prioCounter % 0x100000000
end
local function addJobWithPriority(markerKey, prioritizedKey, priority, jobId, priorityCounterKey,
  isPausedOrMaxed)
  local score = getPriorityScore(priority, priorityCounterKey)
  rcall("ZADD", prioritizedKey, score, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
--[[
  Function to store a job
]]
local function storeJob(eventsKey, jobIdKey, jobId, name, data, opts, timestamp,
                        parentKey, parentData, repeatJobKey)
    local jsonOpts = cjson.encode(opts)
    local delay = opts['delay'] or 0
    local priority = opts['priority'] or 0
    local debounceId = opts['de'] and opts['de']['id']
    local optionalValues = {}
    if parentKey ~= nil then
        table.insert(optionalValues, "parentKey")
        table.insert(optionalValues, parentKey)
        table.insert(optionalValues, "parent")
        table.insert(optionalValues, parentData)
    end
    if repeatJobKey then
        table.insert(optionalValues, "rjk")
        table.insert(optionalValues, repeatJobKey)
    end
    if debounceId then
        table.insert(optionalValues, "deid")
        table.insert(optionalValues, debounceId)
    end
    rcall("HMSET", jobIdKey, "name", name, "data", data, "opts", jsonOpts,
          "timestamp", timestamp, "delay", delay, "priority", priority,
          unpack(optionalValues))
    rcall("XADD", eventsKey, "*", "event", "added", "jobId", jobId, "name", name)
    return delay, priority
end
local function storeAndEnqueueJob(eventsKey, jobIdKey, jobId, name, data, opts,
    timestamp, parentKey, parentData, repeatJobKey, maxEvents,
    waitKey, pausedKey, activeKey, metaKey, prioritizedKey,
    priorityCounterKey, delayedKey, markerKey)
  local delay, priority = storeJob(eventsKey, jobIdKey, jobId, name, data,
      opts, timestamp, parentKey, parentData, repeatJobKey)
  if delay ~= 0 and delayedKey then
    addDelayedJob(jobId, delayedKey, eventsKey, timestamp, maxEvents, markerKey, delay)
  else
    local target, isPausedOrMaxed = getTargetQueueList(metaKey, activeKey, waitKey, pausedKey)
    if priority > 0 then
      addJobWithPriority(markerKey, prioritizedKey, priority, jobId,
          priorityCounterKey, isPausedOrMaxed)
    else
      local pushCmd = opts['lifo'] and 'RPUSH' or 'LPUSH'
      addJobInTargetList(target, markerKey, pushCmd, isPausedOrMaxed, jobId)
    end
    rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "waiting",
        "jobId", jobId)
  end
  return delay, priority
end
local function addJobFromScheduler(jobKey, jobId, opts, waitKey, pausedKey, activeKey, metaKey, 
  prioritizedKey, priorityCounter, delayedKey, markerKey, eventsKey, name, maxEvents, timestamp,
  data, jobSchedulerId, repeatDelay)
  opts['delay'] = repeatDelay
  opts['jobId'] = jobId
  storeAndEnqueueJob(eventsKey, jobKey, jobId, name, data, opts,
      timestamp, nil, nil, jobSchedulerId, maxEvents,
      waitKey, pausedKey, activeKey, metaKey, prioritizedKey,
      priorityCounter, delayedKey, markerKey)
end
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function isQueuePaused(queueMetaKey)
  return rcall("HEXISTS", queueMetaKey, "paused") == 1
end
--[[
  Function to remove job.
]]
-- Includes
--[[
  Function to remove deduplication key if needed
  when a job is being removed.
]]
local function removeDeduplicationKeyIfNeededOnRemoval(prefixKey,
  jobId, deduplicationId)
  if deduplicationId then
    local deduplicationKey = prefixKey .. "de:" .. deduplicationId
    local currentJobId = rcall('GET', deduplicationKey)
    if currentJobId and currentJobId == jobId then
      rcall("DEL", deduplicationKey)
      -- Also clean up any pending dedup-next data for this dedup ID
      rcall("DEL", prefixKey .. "dn:" .. deduplicationId)
      return 1
    end
  end
end
--[[
  Function to remove job keys.
]]
local function removeJobKeys(jobKey)
  return rcall("DEL", jobKey, jobKey .. ':logs', jobKey .. ':dependencies',
    jobKey .. ':processed', jobKey .. ':failed', jobKey .. ':unsuccessful')
end
--[[
  Check if this job has a parent. If so we will just remove it from
  the parent child list, but if it is the last child we should move the parent to "wait/paused"
  which requires code from "moveToFinished"
]]
-- Includes
--[[
  Functions to destructure job key.
  Just a bit of warning, these functions may be a bit slow and affect performance significantly.
]]
local getJobIdFromKey = function (jobKey)
  return string.match(jobKey, ".*:(.*)")
end
local getJobKeyPrefix = function (jobKey, jobId)
  return string.sub(jobKey, 0, #jobKey - #jobId)
end
local function _moveParentToWait(parentPrefix, parentId, emitEvent)
  local parentTarget, isPausedOrMaxed = getTargetQueueList(parentPrefix .. "meta", parentPrefix .. "active",
    parentPrefix .. "wait", parentPrefix .. "paused")
  addJobInTargetList(parentTarget, parentPrefix .. "marker", "RPUSH", isPausedOrMaxed, parentId)
  if emitEvent then
    local parentEventStream = parentPrefix .. "events"
    rcall("XADD", parentEventStream, "*", "event", "waiting", "jobId", parentId, "prev", "waiting-children")
  end
end
local function removeParentDependencyKey(jobKey, hard, parentKey, baseKey, debounceId)
  if parentKey then
    local parentDependenciesKey = parentKey .. ":dependencies"
    local result = rcall("SREM", parentDependenciesKey, jobKey)
    if result > 0 then
      local pendingDependencies = rcall("SCARD", parentDependenciesKey)
      if pendingDependencies == 0 then
        local parentId = getJobIdFromKey(parentKey)
        local parentPrefix = getJobKeyPrefix(parentKey, parentId)
        local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
        if numRemovedElements == 1 then
          if hard then -- remove parent in same queue
            if parentPrefix == baseKey then
              removeParentDependencyKey(parentKey, hard, nil, baseKey, nil)
              removeJobKeys(parentKey)
              if debounceId then
                rcall("DEL", parentPrefix .. "de:" .. debounceId)
              end
            else
              _moveParentToWait(parentPrefix, parentId)
            end
          else
            _moveParentToWait(parentPrefix, parentId, true)
          end
        end
      end
      return true
    end
  else
    local parentAttributes = rcall("HMGET", jobKey, "parentKey", "deid")
    local missedParentKey = parentAttributes[1]
    if( (type(missedParentKey) == "string") and missedParentKey ~= ""
      and (rcall("EXISTS", missedParentKey) == 1)) then
      local parentDependenciesKey = missedParentKey .. ":dependencies"
      local result = rcall("SREM", parentDependenciesKey, jobKey)
      if result > 0 then
        local pendingDependencies = rcall("SCARD", parentDependenciesKey)
        if pendingDependencies == 0 then
          local parentId = getJobIdFromKey(missedParentKey)
          local parentPrefix = getJobKeyPrefix(missedParentKey, parentId)
          local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
          if numRemovedElements == 1 then
            if hard then
              if parentPrefix == baseKey then
                removeParentDependencyKey(missedParentKey, hard, nil, baseKey, nil)
                removeJobKeys(missedParentKey)
                if parentAttributes[2] then
                  rcall("DEL", parentPrefix .. "de:" .. parentAttributes[2])
                end
              else
                _moveParentToWait(parentPrefix, parentId)
              end
            else
              _moveParentToWait(parentPrefix, parentId, true)
            end
          end
        end
        return true
      end
    end
  end
  return false
end
local function removeJob(jobId, hard, baseKey, shouldRemoveDeduplicationKey)
  local jobKey = baseKey .. jobId
  removeParentDependencyKey(jobKey, hard, nil, baseKey)
  if shouldRemoveDeduplicationKey then
    local deduplicationId = rcall("HGET", jobKey, "deid")
    removeDeduplicationKeyIfNeededOnRemoval(baseKey, jobId, deduplicationId)
  end
  removeJobKeys(jobKey)
end
--[[
  Function to store a job scheduler
]]
local function storeJobScheduler(schedulerId, schedulerKey, repeatKey, nextMillis, opts,
  templateData, templateOpts)
  rcall("ZADD", repeatKey, nextMillis, schedulerId)
  local optionalValues = {}
  if opts['tz'] then
    table.insert(optionalValues, "tz")
    table.insert(optionalValues, opts['tz'])
  end
  if opts['limit'] then
    table.insert(optionalValues, "limit")
    table.insert(optionalValues, opts['limit'])
  end
  if opts['pattern'] then
    table.insert(optionalValues, "pattern")
    table.insert(optionalValues, opts['pattern'])
  end
  if opts['startDate'] then
    table.insert(optionalValues, "startDate")
    table.insert(optionalValues, opts['startDate'])
  end
  if opts['endDate'] then
    table.insert(optionalValues, "endDate")
    table.insert(optionalValues, opts['endDate'])
  end
  if opts['every'] then
    table.insert(optionalValues, "every")
    table.insert(optionalValues, opts['every'])
  end
  if opts['offset'] then
    table.insert(optionalValues, "offset")
    table.insert(optionalValues, opts['offset'])
  else
    local offset = rcall("HGET", schedulerKey, "offset")
    if offset then
      table.insert(optionalValues, "offset")
      table.insert(optionalValues, tonumber(offset))
    end
  end
  local jsonTemplateOpts = cjson.encode(templateOpts)
  if jsonTemplateOpts and jsonTemplateOpts ~= '{}' then
    table.insert(optionalValues, "opts")
    table.insert(optionalValues, jsonTemplateOpts)
  end
  if templateData and templateData ~= '{}' then
    table.insert(optionalValues, "data")
    table.insert(optionalValues, templateData)
  end
  table.insert(optionalValues, "ic")
  table.insert(optionalValues, rcall("HGET", schedulerKey, "ic") or 1)
  rcall("DEL", schedulerKey) -- remove all attributes and then re-insert new ones
  rcall("HMSET", schedulerKey, "name", opts['name'], unpack(optionalValues))
end
local function getJobSchedulerEveryNextMillis(prevMillis, every, now, offset, startDate)
    offset = tonumber(offset)
    local nextMillis
    if not prevMillis then
        if startDate then
            -- Assuming startDate is passed as milliseconds from JavaScript
            nextMillis = tonumber(startDate)
            nextMillis = nextMillis > now and nextMillis or now
        else
            if offset and offset > 0 then
                -- Align to the next slot that respects the offset
                nextMillis = math.floor(now / every) * every + offset
                if nextMillis <= now then
                    nextMillis = nextMillis + every
                end
            else
                nextMillis = now
            end
        end
    else
        nextMillis = prevMillis + every
        -- check if we may have missed some iterations
        if nextMillis < now then
            -- Use the same offset-aware alignment as the initial branch
            -- above so a non-zero offset is preserved across catch-ups
            -- instead of being flattened to (slot + every). When the
            -- aligned slot is itself still in the past, advance by one
            -- full interval; otherwise the aligned slot is the next
            -- iteration.
            local aligned = math.floor(now / every) * every + (offset or 0)
            if aligned <= now then
                nextMillis = aligned + every
            else
                nextMillis = aligned
            end
        end
    end
    if not offset or offset == 0 then
        local timeSlot = math.floor(nextMillis / every) * every;
        offset = nextMillis - timeSlot;
    end
    -- Return a tuple nextMillis, offset
    return math.floor(nextMillis), math.floor(offset)
end
-- If we are overriding a repeatable job we must delete the delayed job for
-- the next iteration.
local schedulerKey = repeatKey .. ":" .. jobSchedulerId
local maxEvents = getOrSetMaxEvents(metaKey)
local templateData = ARGV[4]
local prevMillis = rcall("ZSCORE", repeatKey, jobSchedulerId)
if prevMillis then
    prevMillis = tonumber(prevMillis)
end
local schedulerOpts = cmsgpack.unpack(ARGV[2])
local every = schedulerOpts['every']
-- For backwards compatibility we also check the offset from the job itself.
-- could be removed in future major versions.
local jobOffset = jobOpts['repeat'] and jobOpts['repeat']['offset'] or 0
local offset = schedulerOpts['offset'] or jobOffset or 0
local newOffset = offset
local updatedEvery = false
if every then
    -- if we changed the 'every' value we need to reset millis to nil
    local millis = prevMillis
    if prevMillis then
        local prevEvery = tonumber(rcall("HGET", schedulerKey, "every"))
        if prevEvery ~= every then
            millis = nil
            updatedEvery = true
        end
    end
    local startDate = schedulerOpts['startDate']
    nextMillis, newOffset = getJobSchedulerEveryNextMillis(millis, every, now, offset, startDate)
end
local function removeJobFromScheduler(prefixKey, delayedKey, prioritizedKey, waitKey, pausedKey, jobId, metaKey,
    eventsKey)
    if rcall("ZSCORE", delayedKey, jobId) then
        removeJob(jobId, true, prefixKey, true --[[remove debounce key]] )
        rcall("ZREM", delayedKey, jobId)
        return true
    elseif rcall("ZSCORE", prioritizedKey, jobId) then
        removeJob(jobId, true, prefixKey, true --[[remove debounce key]] )
        rcall("ZREM", prioritizedKey, jobId)
        return true
    else
        local pausedOrWaitKey = waitKey
        if isQueuePaused(metaKey) then
            pausedOrWaitKey = pausedKey
        end
        if rcall("LREM", pausedOrWaitKey, 1, jobId) > 0 then
            removeJob(jobId, true, prefixKey, true --[[remove debounce key]] )
            return true
        end
    end
    return false
end
local removedPrevJob = false
if prevMillis then
    local currentJobId = "repeat:" .. jobSchedulerId .. ":" .. prevMillis
    local currentJobKey = schedulerKey .. ":" .. prevMillis
    -- In theory it should always exist the currentJobKey if there is a prevMillis unless something has
    -- gone really wrong.
    if rcall("EXISTS", currentJobKey) == 1 then
        removedPrevJob = removeJobFromScheduler(prefixKey, delayedKey, prioritizedKey, waitKey, pausedKey, currentJobId,
            metaKey, eventsKey)
    end
end
if removedPrevJob then
    -- The jobs has been removed and we want to replace it, so lets use the same millis.
    if every and not updatedEvery then
        nextMillis = prevMillis
    end
else
    -- Special case where no job was removed, and we need to add the next iteration.
    schedulerOpts['offset'] = newOffset
end
-- Check for job ID collision with existing jobs (in any state)
local jobId = "repeat:" .. jobSchedulerId .. ":" .. nextMillis
local jobKey = prefixKey .. jobId
-- If there's already a job with this ID, in a state
-- that is not updatable (active, completed, failed) we must
-- handle the collision
local hasCollision = false
if rcall("EXISTS", jobKey) == 1 then
    if every then
        -- For 'every' case: walk forward through subsequent slots
        -- until we find a free one. Stale completed/failed jobs from
        -- a previous scheduler under the same id can occupy several
        -- consecutive slots (issue #3063), so a single retry is not
        -- enough. The scan is bounded so we don't spin if the
        -- scheduler is genuinely contested.
        local maxSlotScans = 32
        local slotsScanned = 0
        local jobExists
        repeat
            nextMillis = nextMillis + every
            jobId = "repeat:" .. jobSchedulerId .. ":" .. nextMillis
            jobKey = prefixKey .. jobId
            slotsScanned = slotsScanned + 1
            jobExists = rcall("EXISTS", jobKey)
        until jobExists == 0 or slotsScanned >= maxSlotScans
        if jobExists == 1 then
            -- Every scanned slot still has a job, return error code
            return -11 -- SchedulerJobSlotsBusy
        end
    else
        hasCollision = true
    end
end
local delay = nextMillis - now
-- Fast Clamp delay to minimum of 0
if delay < 0 then
    delay = 0
end
local nextJobKey = schedulerKey .. ":" .. nextMillis
if not hasCollision or removedPrevJob then
    -- jobId already calculated above during collision check
    storeJobScheduler(jobSchedulerId, schedulerKey, repeatKey, nextMillis, schedulerOpts, templateData, templateOpts)
    rcall("INCR", KEYS[8])
    addJobFromScheduler(nextJobKey, jobId, jobOpts, waitKey, pausedKey, KEYS[11], metaKey, prioritizedKey, KEYS[10],
        delayedKey, KEYS[7], eventsKey, schedulerOpts['name'], maxEvents, now, templateData, jobSchedulerId, delay)
elseif hasCollision then
    -- For 'pattern' case: return error code
    return -10 -- SchedulerJobIdCollision
end
if ARGV[9] ~= "" then
    rcall("HSET", ARGV[9], "nrjid", jobId)
end
return {jobId .. "", delay}
`,keys:11};e.s(["addJobScheduler",0,tE],27599),e.i(27599);let tI={name:"addLog",content:`--[[
  Add job log
  Input:
    KEYS[1] job id key
    KEYS[2] job logs key
    ARGV[1] id
    ARGV[2] log
    ARGV[3] keepLogs
  Output:
    -1 - Missing job.
]]
local rcall = redis.call
if rcall("EXISTS", KEYS[1]) == 1 then -- // Make sure job exists
  local logCount = rcall("RPUSH", KEYS[2], ARGV[2])
  if ARGV[3] ~= '' then
    local keepLogs = tonumber(ARGV[3])
    rcall("LTRIM", KEYS[2], -keepLogs, -1)
    return math.min(keepLogs, logCount)
  end
  return logCount
else
  return -1
end
`,keys:2};e.s(["addLog",0,tI],92879),e.i(92879);let tk={name:"addParentJob",content:`--[[
  Adds a parent job to the queue by doing the following:
    - Increases the job counter if needed.
    - Creates a new job key with the job data.
    - adds the job to the waiting-children zset
    Input:
      KEYS[1] 'meta'
      KEYS[2] 'id'
      KEYS[3] 'delayed'
      KEYS[4] 'waiting-children'
      KEYS[5] 'completed'
      KEYS[6] events stream key
      ARGV[1] msgpacked arguments array
            [1]  key prefix,
            [2]  custom id (will not generate one automatically)
            [3]  name
            [4]  timestamp
            [5]  parentKey?
            [6]  parent dependencies key.
            [7]  parent? {id, queueKey}
            [8]  repeat job key
            [9] deduplication key
      ARGV[2] Json stringified job data
      ARGV[3] msgpacked options
      Output:
        jobId  - OK
        -5     - Missing parent key
]]
local metaKey = KEYS[1]
local idKey = KEYS[2]
local delayedKey = KEYS[3]
local completedKey = KEYS[5]
local eventsKey = KEYS[6]
local jobId
local jobIdKey
local rcall = redis.call
local args = cmsgpack.unpack(ARGV[1])
local data = ARGV[2]
local opts = cmsgpack.unpack(ARGV[3])
local parentKey = args[5]
local parent = args[7]
local repeatJobKey = args[8]
local deduplicationKey = args[9]
local parentData
-- Includes
--[[
  Function to deduplicate a job.
]]
--[[
  Function to set the deduplication key for a job.
  Uses TTL from deduplication opts if provided.
]]
local function setDeduplicationKey(deduplicationKey, jobId, deduplicationOpts)
    local ttl = deduplicationOpts and deduplicationOpts['ttl']
    if ttl and ttl > 0 then
        rcall('SET', deduplicationKey, jobId, 'PX', ttl)
    else
        rcall('SET', deduplicationKey, jobId)
    end
end
--[[
  Function to store a deduplicated next job if the existing job is active
  and keepLastIfActive is set. When the active job finishes, the stored
  proto-job is used to create a real job in the queue.
  Returns true if the proto-job was stored, false otherwise.
]]
--[[
  Function to check if an item belongs to a list.
]]
local function checkItemInList(list, item)
  for _, v in pairs(list) do
    if v == item then
      return 1
    end
  end
  return nil
end
local function storeDeduplicatedNextJob(deduplicationOpts, currentDebounceJobId, prefix,
    deduplicationId, jobName, jobData, fullOpts, eventsKey, maxEvents, jobId,
    parentKey, parentData, parentDependenciesKey, repeatJobKey)
    if deduplicationOpts['keepLastIfActive'] and currentDebounceJobId then
        local activeKey = prefix .. "active"
        local activeItems = rcall('LRANGE', activeKey, 0, -1)
        if checkItemInList(activeItems, currentDebounceJobId) then
            local deduplicationNextKey = prefix .. "dn:" .. deduplicationId
            local fields = {'name', jobName, 'data', jobData, 'opts', cjson.encode(fullOpts),
                'jid', jobId}
            if parentKey then
                fields[#fields+1] = 'pk'
                fields[#fields+1] = parentKey
            end
            if parentData then
                fields[#fields+1] = 'pd'
                fields[#fields+1] = parentData
            end
            if parentDependenciesKey then
                fields[#fields+1] = 'pdk'
                fields[#fields+1] = parentDependenciesKey
            end
            if repeatJobKey then
                fields[#fields+1] = 'rjk'
                fields[#fields+1] = repeatJobKey
            end
            rcall('DEL', deduplicationNextKey)
            rcall('HSET', deduplicationNextKey, unpack(fields))
            -- Ensure the dedup key does not expire while the job is active,
            -- so subsequent adds always hit the dedup path and never bypass
            -- the active-check because of a TTL expiry.
            local deduplicationKey = prefix .. "de:" .. deduplicationId
            rcall('PERSIST', deduplicationKey)
            -- TODO remove debounced event in next breaking change
            rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "debounced", "jobId",
                currentDebounceJobId, "debounceId", deduplicationId)
            rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "deduplicated", "jobId",
                currentDebounceJobId, "deduplicationId", deduplicationId, "deduplicatedJobId", jobId)
            return true
        end
    end
    return false
end
local function deduplicateJobWithoutReplace(deduplicationId, deduplicationOpts, jobId, deduplicationKey,
    eventsKey, maxEvents, prefix, jobName, jobData, fullOpts,
    parentKey, parentData, parentDependenciesKey, repeatJobKey)
    local ttl = deduplicationOpts['ttl']
    local deduplicationKeyExists
    if ttl and ttl > 0 then
        if deduplicationOpts['extend'] then
            local currentDebounceJobId = rcall('GET', deduplicationKey)
            if currentDebounceJobId then
                if storeDeduplicatedNextJob(deduplicationOpts, currentDebounceJobId, prefix,
                    deduplicationId, jobName, jobData, fullOpts, eventsKey, maxEvents, jobId,
                    parentKey, parentData, parentDependenciesKey, repeatJobKey) then
                    return currentDebounceJobId
                end
                if deduplicationOpts['keepLastIfActive'] then
                    rcall('SET', deduplicationKey, currentDebounceJobId)
                else
                    setDeduplicationKey(deduplicationKey, currentDebounceJobId, deduplicationOpts)
                end
                rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "debounced",
                    "jobId", currentDebounceJobId, "debounceId", deduplicationId)
                rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "deduplicated", "jobId",
                    currentDebounceJobId, "deduplicationId", deduplicationId, "deduplicatedJobId", jobId)
                return currentDebounceJobId
            else
                if deduplicationOpts['keepLastIfActive'] then
                    rcall('SET', deduplicationKey, jobId)
                else
                    setDeduplicationKey(deduplicationKey, jobId, deduplicationOpts)
                end
                return
            end
        else
            if deduplicationOpts['keepLastIfActive'] then
                deduplicationKeyExists = not rcall('SET', deduplicationKey, jobId, 'NX')
            else
                deduplicationKeyExists = not rcall('SET', deduplicationKey, jobId, 'PX', ttl, 'NX')
            end
        end
    else
        deduplicationKeyExists = not rcall('SET', deduplicationKey, jobId, 'NX')
    end
    if deduplicationKeyExists then
        local currentDebounceJobId = rcall('GET', deduplicationKey)
        if storeDeduplicatedNextJob(deduplicationOpts, currentDebounceJobId, prefix,
            deduplicationId, jobName, jobData, fullOpts, eventsKey, maxEvents, jobId,
            parentKey, parentData, parentDependenciesKey, repeatJobKey) then
            return currentDebounceJobId
        end
        -- TODO remove debounced event in next breaking change
        rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "debounced", "jobId",
            currentDebounceJobId, "debounceId", deduplicationId)
        rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "deduplicated", "jobId",
            currentDebounceJobId, "deduplicationId", deduplicationId, "deduplicatedJobId", jobId)
        return currentDebounceJobId
    end
end
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
--[[
  Function to handle the case when job is duplicated.
]]
-- Includes
--[[
    This function is used to update the parent's dependencies if the job
    is already completed and about to be ignored. The parent must get its
    dependencies updated to avoid the parent job being stuck forever in 
    the waiting-children state.
]]
-- Includes
--[[
  Validate and move or add dependencies to parent.
]]
-- Includes
--[[
  Validate and move parent to a wait status (waiting, delayed or prioritized)
  if no pending dependencies.
]]
-- Includes
--[[
  Validate and move parent to a wait status (waiting, delayed or prioritized) if needed.
]]
-- Includes
--[[
  Move parent to a wait status (wait, prioritized or delayed)
]]
-- Includes
--[[
  Add delay marker if needed.
]]
-- Includes
--[[
  Function to return the next delayed job timestamp.
]]
local function getNextDelayedTimestamp(delayedKey)
  local result = rcall("ZRANGE", delayedKey, 0, 0, "WITHSCORES")
  if #result then
    local nextTimestamp = tonumber(result[2])
    if nextTimestamp ~= nil then
      return nextTimestamp / 0x1000
    end
  end
end
local function addDelayMarkerIfNeeded(markerKey, delayedKey)
  local nextTimestamp = getNextDelayedTimestamp(delayedKey)
  if nextTimestamp ~= nil then
    -- Replace the score of the marker with the newest known
    -- next timestamp.
    rcall("ZADD", markerKey, nextTimestamp, "1")
  end
end
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to add job considering priority.
]]
-- Includes
--[[
  Function to get priority score.
]]
local function getPriorityScore(priority, priorityCounterKey)
  local prioCounter = rcall("INCR", priorityCounterKey)
  return priority * 0x100000000 + prioCounter % 0x100000000
end
local function addJobWithPriority(markerKey, prioritizedKey, priority, jobId, priorityCounterKey,
  isPausedOrMaxed)
  local score = getPriorityScore(priority, priorityCounterKey)
  rcall("ZADD", prioritizedKey, score, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to check if queue is paused or maxed
  (since an empty list and !EXISTS are not really the same).
]]
local function isQueuePausedOrMaxed(queueMetaKey, activeKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency")
  if queueAttributes[1] then
    return true
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      return activeCount >= tonumber(queueAttributes[2])
    end
  end
  return false
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
local function moveParentToWait(parentQueueKey, parentKey, parentId, timestamp)
    local parentWaitKey = parentQueueKey .. ":wait"
    local parentPausedKey = parentQueueKey .. ":paused"
    local parentActiveKey = parentQueueKey .. ":active"
    local parentMetaKey = parentQueueKey .. ":meta"
    local parentMarkerKey = parentQueueKey .. ":marker"
    local jobAttributes = rcall("HMGET", parentKey, "priority", "delay")
    local priority = tonumber(jobAttributes[1]) or 0
    local delay = tonumber(jobAttributes[2]) or 0
    if delay > 0 then
        local delayedTimestamp = tonumber(timestamp) + delay
        local score = delayedTimestamp * 0x1000
        local parentDelayedKey = parentQueueKey .. ":delayed"
        rcall("ZADD", parentDelayedKey, score, parentId)
        rcall("XADD", parentQueueKey .. ":events", "*", "event", "delayed", "jobId", parentId, "delay",
            delayedTimestamp)
        addDelayMarkerIfNeeded(parentMarkerKey, parentDelayedKey)
    else
        if priority == 0 then
            local parentTarget, isParentPausedOrMaxed = getTargetQueueList(parentMetaKey, parentActiveKey,
                parentWaitKey, parentPausedKey)
            addJobInTargetList(parentTarget, parentMarkerKey, "RPUSH", isParentPausedOrMaxed, parentId)
        else
            local isPausedOrMaxed = isQueuePausedOrMaxed(parentMetaKey, parentActiveKey)
            addJobWithPriority(parentMarkerKey, parentQueueKey .. ":prioritized", priority, parentId,
                parentQueueKey .. ":pc", isPausedOrMaxed)
        end
        rcall("XADD", parentQueueKey .. ":events", "*", "event", "waiting", "jobId", parentId, "prev",
            "waiting-children")
    end
end
local function moveParentToWaitIfNeeded(parentQueueKey, parentKey, parentId, timestamp)
  if rcall("EXISTS", parentKey) == 1 then
    local parentWaitingChildrenKey = parentQueueKey .. ":waiting-children"
    if rcall("ZSCORE", parentWaitingChildrenKey, parentId) then    
      rcall("ZREM", parentWaitingChildrenKey, parentId)
      moveParentToWait(parentQueueKey, parentKey, parentId, timestamp)
    end
  end
end
local function moveParentToWaitIfNoPendingDependencies(parentQueueKey, parentDependenciesKey, parentKey,
  parentId, timestamp)
  local doNotHavePendingDependencies = rcall("SCARD", parentDependenciesKey) == 0
  if doNotHavePendingDependencies then
    moveParentToWaitIfNeeded(parentQueueKey, parentKey, parentId, timestamp)
  end
end
local function updateParentDepsIfNeeded(parentKey, parentQueueKey, parentDependenciesKey,
  parentId, jobIdKey, returnvalue, timestamp )
  local processedSet = parentKey .. ":processed"
  rcall("HSET", processedSet, jobIdKey, returnvalue)
  moveParentToWaitIfNoPendingDependencies(parentQueueKey, parentDependenciesKey, parentKey, parentId, timestamp)
end
local function updateExistingJobsParent(parentKey, parent, parentData,
                                        parentDependenciesKey, completedKey,
                                        jobIdKey, jobId, timestamp)
    if parentKey ~= nil then
        if rcall("ZSCORE", completedKey, jobId) then
            local returnvalue = rcall("HGET", jobIdKey, "returnvalue")
            updateParentDepsIfNeeded(parentKey, parent['queueKey'],
                                     parentDependenciesKey, parent['id'],
                                     jobIdKey, returnvalue, timestamp)
        else
            if parentDependenciesKey ~= nil then
                rcall("SADD", parentDependenciesKey, jobIdKey)
            end
        end
        rcall("HMSET", jobIdKey, "parentKey", parentKey, "parent", parentData)
    end
end
local function handleDuplicatedJob(jobKey, jobId, currentParentKey, currentParent,
  parentData, parentDependenciesKey, completedKey, eventsKey, maxEvents, timestamp)
  local existedParentKey = rcall("HGET", jobKey, "parentKey")
  if not existedParentKey or existedParentKey == currentParentKey then
    updateExistingJobsParent(currentParentKey, currentParent, parentData,
      parentDependenciesKey, completedKey, jobKey,
      jobId, timestamp)
  else
    if currentParentKey ~= nil and currentParentKey ~= existedParentKey
      and (rcall("EXISTS", existedParentKey) == 1) then
      return -7
    end
  end
  rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event",
    "duplicated", "jobId", jobId)
  return jobId .. "" -- convert to string
end
--[[
  Function to store a job
]]
local function storeJob(eventsKey, jobIdKey, jobId, name, data, opts, timestamp,
                        parentKey, parentData, repeatJobKey)
    local jsonOpts = cjson.encode(opts)
    local delay = opts['delay'] or 0
    local priority = opts['priority'] or 0
    local debounceId = opts['de'] and opts['de']['id']
    local optionalValues = {}
    if parentKey ~= nil then
        table.insert(optionalValues, "parentKey")
        table.insert(optionalValues, parentKey)
        table.insert(optionalValues, "parent")
        table.insert(optionalValues, parentData)
    end
    if repeatJobKey then
        table.insert(optionalValues, "rjk")
        table.insert(optionalValues, repeatJobKey)
    end
    if debounceId then
        table.insert(optionalValues, "deid")
        table.insert(optionalValues, debounceId)
    end
    rcall("HMSET", jobIdKey, "name", name, "data", data, "opts", jsonOpts,
          "timestamp", timestamp, "delay", delay, "priority", priority,
          unpack(optionalValues))
    rcall("XADD", eventsKey, "*", "event", "added", "jobId", jobId, "name", name)
    return delay, priority
end
if parentKey ~= nil then
    if rcall("EXISTS", parentKey) ~= 1 then return -5 end
    parentData = cjson.encode(parent)
end
local jobCounter = rcall("INCR", idKey)
local maxEvents = getOrSetMaxEvents(metaKey)
local parentDependenciesKey = args[6]
local timestamp = args[4]
if args[2] == "" then
    jobId = jobCounter .. "" -- convert to string
    jobIdKey = args[1] .. jobId
else
    jobId = args[2]
    jobIdKey = args[1] .. jobId
    if rcall("EXISTS", jobIdKey) == 1 then
        return handleDuplicatedJob(jobIdKey, jobId, parentKey, parent,
            parentData, parentDependenciesKey, completedKey, eventsKey,
            maxEvents, timestamp)
    end
end
local deduplicationId = opts['de'] and opts['de']['id']
if deduplicationId then
    local deduplicationJobId = deduplicateJobWithoutReplace(deduplicationId, opts['de'],
        jobId, deduplicationKey, eventsKey, maxEvents, args[1], args[3], ARGV[2], opts,
        parentKey, parentData, parentDependenciesKey, repeatJobKey)
    if deduplicationJobId then
        return deduplicationJobId
    end
end
-- Store the job.
storeJob(eventsKey, jobIdKey, jobId, args[3], ARGV[2], opts, timestamp,
         parentKey, parentData, repeatJobKey)
local waitChildrenKey = KEYS[4]
rcall("ZADD", waitChildrenKey, timestamp, jobId)
rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event",
      "waiting-children", "jobId", jobId)
-- Check if this job is a child of another job, if so add it to the parents dependencies
if parentDependenciesKey ~= nil then
    rcall("SADD", parentDependenciesKey, jobIdKey)
end
return jobId
`,keys:6};e.s(["addParentJob",0,tk],19348),e.i(19348);let tw={name:"addPrioritizedJob",content:`--[[
  Adds a prioritized job to the queue by doing the following:
    - Increases the job counter if needed.
    - Creates a new job key with the job data.
    - Adds the job to the "added" list so that workers gets notified.
    Input:
      KEYS[1] 'marker',
      KEYS[2] 'meta'
      KEYS[3] 'id'
      KEYS[4] 'prioritized'
      KEYS[5] 'delayed'
      KEYS[6] 'completed'
      KEYS[7] 'active'
      KEYS[8] events stream key
      KEYS[9] 'pc' priority counter
      ARGV[1] msgpacked arguments array
            [1]  key prefix,
            [2]  custom id (will not generate one automatically)
            [3]  name
            [4]  timestamp
            [5]  parentKey?
            [6]  parent dependencies key.
            [7]  parent? {id, queueKey}
            [8]  repeat job key
            [9] deduplication key
      ARGV[2] Json stringified job data
      ARGV[3] msgpacked options
      Output:
        jobId  - OK
        -5     - Missing parent key
]] 
local metaKey = KEYS[2]
local idKey = KEYS[3]
local priorityKey = KEYS[4]
local completedKey = KEYS[6]
local activeKey = KEYS[7]
local eventsKey = KEYS[8]
local priorityCounterKey = KEYS[9]
local jobId
local jobIdKey
local rcall = redis.call
local args = cmsgpack.unpack(ARGV[1])
local data = ARGV[2]
local opts = cmsgpack.unpack(ARGV[3])
local parentKey = args[5]
local parent = args[7]
local repeatJobKey = args[8]
local deduplicationKey = args[9]
local parentData
-- Includes
--[[
  Function to add job considering priority.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
--[[
  Function to get priority score.
]]
local function getPriorityScore(priority, priorityCounterKey)
  local prioCounter = rcall("INCR", priorityCounterKey)
  return priority * 0x100000000 + prioCounter % 0x100000000
end
local function addJobWithPriority(markerKey, prioritizedKey, priority, jobId, priorityCounterKey,
  isPausedOrMaxed)
  local score = getPriorityScore(priority, priorityCounterKey)
  rcall("ZADD", prioritizedKey, score, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to debounce a job.
]]
-- Includes
--[[
  Function to deduplicate a job.
]]
--[[
  Function to set the deduplication key for a job.
  Uses TTL from deduplication opts if provided.
]]
local function setDeduplicationKey(deduplicationKey, jobId, deduplicationOpts)
    local ttl = deduplicationOpts and deduplicationOpts['ttl']
    if ttl and ttl > 0 then
        rcall('SET', deduplicationKey, jobId, 'PX', ttl)
    else
        rcall('SET', deduplicationKey, jobId)
    end
end
--[[
  Function to store a deduplicated next job if the existing job is active
  and keepLastIfActive is set. When the active job finishes, the stored
  proto-job is used to create a real job in the queue.
  Returns true if the proto-job was stored, false otherwise.
]]
--[[
  Function to check if an item belongs to a list.
]]
local function checkItemInList(list, item)
  for _, v in pairs(list) do
    if v == item then
      return 1
    end
  end
  return nil
end
local function storeDeduplicatedNextJob(deduplicationOpts, currentDebounceJobId, prefix,
    deduplicationId, jobName, jobData, fullOpts, eventsKey, maxEvents, jobId,
    parentKey, parentData, parentDependenciesKey, repeatJobKey)
    if deduplicationOpts['keepLastIfActive'] and currentDebounceJobId then
        local activeKey = prefix .. "active"
        local activeItems = rcall('LRANGE', activeKey, 0, -1)
        if checkItemInList(activeItems, currentDebounceJobId) then
            local deduplicationNextKey = prefix .. "dn:" .. deduplicationId
            local fields = {'name', jobName, 'data', jobData, 'opts', cjson.encode(fullOpts),
                'jid', jobId}
            if parentKey then
                fields[#fields+1] = 'pk'
                fields[#fields+1] = parentKey
            end
            if parentData then
                fields[#fields+1] = 'pd'
                fields[#fields+1] = parentData
            end
            if parentDependenciesKey then
                fields[#fields+1] = 'pdk'
                fields[#fields+1] = parentDependenciesKey
            end
            if repeatJobKey then
                fields[#fields+1] = 'rjk'
                fields[#fields+1] = repeatJobKey
            end
            rcall('DEL', deduplicationNextKey)
            rcall('HSET', deduplicationNextKey, unpack(fields))
            -- Ensure the dedup key does not expire while the job is active,
            -- so subsequent adds always hit the dedup path and never bypass
            -- the active-check because of a TTL expiry.
            local deduplicationKey = prefix .. "de:" .. deduplicationId
            rcall('PERSIST', deduplicationKey)
            -- TODO remove debounced event in next breaking change
            rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "debounced", "jobId",
                currentDebounceJobId, "debounceId", deduplicationId)
            rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "deduplicated", "jobId",
                currentDebounceJobId, "deduplicationId", deduplicationId, "deduplicatedJobId", jobId)
            return true
        end
    end
    return false
end
local function deduplicateJobWithoutReplace(deduplicationId, deduplicationOpts, jobId, deduplicationKey,
    eventsKey, maxEvents, prefix, jobName, jobData, fullOpts,
    parentKey, parentData, parentDependenciesKey, repeatJobKey)
    local ttl = deduplicationOpts['ttl']
    local deduplicationKeyExists
    if ttl and ttl > 0 then
        if deduplicationOpts['extend'] then
            local currentDebounceJobId = rcall('GET', deduplicationKey)
            if currentDebounceJobId then
                if storeDeduplicatedNextJob(deduplicationOpts, currentDebounceJobId, prefix,
                    deduplicationId, jobName, jobData, fullOpts, eventsKey, maxEvents, jobId,
                    parentKey, parentData, parentDependenciesKey, repeatJobKey) then
                    return currentDebounceJobId
                end
                if deduplicationOpts['keepLastIfActive'] then
                    rcall('SET', deduplicationKey, currentDebounceJobId)
                else
                    setDeduplicationKey(deduplicationKey, currentDebounceJobId, deduplicationOpts)
                end
                rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "debounced",
                    "jobId", currentDebounceJobId, "debounceId", deduplicationId)
                rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "deduplicated", "jobId",
                    currentDebounceJobId, "deduplicationId", deduplicationId, "deduplicatedJobId", jobId)
                return currentDebounceJobId
            else
                if deduplicationOpts['keepLastIfActive'] then
                    rcall('SET', deduplicationKey, jobId)
                else
                    setDeduplicationKey(deduplicationKey, jobId, deduplicationOpts)
                end
                return
            end
        else
            if deduplicationOpts['keepLastIfActive'] then
                deduplicationKeyExists = not rcall('SET', deduplicationKey, jobId, 'NX')
            else
                deduplicationKeyExists = not rcall('SET', deduplicationKey, jobId, 'PX', ttl, 'NX')
            end
        end
    else
        deduplicationKeyExists = not rcall('SET', deduplicationKey, jobId, 'NX')
    end
    if deduplicationKeyExists then
        local currentDebounceJobId = rcall('GET', deduplicationKey)
        if storeDeduplicatedNextJob(deduplicationOpts, currentDebounceJobId, prefix,
            deduplicationId, jobName, jobData, fullOpts, eventsKey, maxEvents, jobId,
            parentKey, parentData, parentDependenciesKey, repeatJobKey) then
            return currentDebounceJobId
        end
        -- TODO remove debounced event in next breaking change
        rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "debounced", "jobId",
            currentDebounceJobId, "debounceId", deduplicationId)
        rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "deduplicated", "jobId",
            currentDebounceJobId, "deduplicationId", deduplicationId, "deduplicatedJobId", jobId)
        return currentDebounceJobId
    end
end
--[[
  Function to remove job keys.
]]
local function removeJobKeys(jobKey)
  return rcall("DEL", jobKey, jobKey .. ':logs', jobKey .. ':dependencies',
    jobKey .. ':processed', jobKey .. ':failed', jobKey .. ':unsuccessful')
end
local function removeDelayedJob(delayedKey, deduplicationKey, eventsKey, maxEvents, currentDeduplicatedJobId,
    jobId, deduplicationId, prefix)
    if rcall("ZREM", delayedKey, currentDeduplicatedJobId) > 0 then
        removeJobKeys(prefix .. currentDeduplicatedJobId)
        rcall("XADD", eventsKey, "*", "event", "removed", "jobId", currentDeduplicatedJobId,
            "prev", "delayed")
        -- TODO remove debounced event in next breaking change
        rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "debounced", "jobId",
            jobId, "debounceId", deduplicationId)
        rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "deduplicated", "jobId",
            jobId, "deduplicationId", deduplicationId, "deduplicatedJobId", currentDeduplicatedJobId)
        return true
    end
    return false
end
local function deduplicateJob(deduplicationOpts, jobId, delayedKey, deduplicationKey, eventsKey, maxEvents,
    prefix, jobName, jobData, fullOpts, parentKey, parentData, parentDependenciesKey, repeatJobKey)
    local deduplicationId = deduplicationOpts and deduplicationOpts['id']
    if deduplicationId then
        if deduplicationOpts['replace'] then
            local currentDebounceJobId = rcall('GET', deduplicationKey)
            if currentDebounceJobId then
                local isRemoved = removeDelayedJob(delayedKey, deduplicationKey, eventsKey, maxEvents,
                    currentDebounceJobId, jobId, deduplicationId, prefix)
                if isRemoved then
                    if deduplicationOpts['keepLastIfActive'] then
                        rcall('SET', deduplicationKey, jobId)
                    else
                        local ttl = deduplicationOpts['ttl']
                        if not deduplicationOpts['extend'] and ttl and ttl > 0 then
                            rcall('SET', deduplicationKey, jobId, 'KEEPTTL')
                        else
                            setDeduplicationKey(deduplicationKey, jobId, deduplicationOpts)
                        end
                    end
                    return
                else
                    storeDeduplicatedNextJob(deduplicationOpts, currentDebounceJobId, prefix,
                        deduplicationId, jobName, jobData, fullOpts, eventsKey, maxEvents, jobId,
                        parentKey, parentData, parentDependenciesKey, repeatJobKey)
                    return currentDebounceJobId
                end
            else
                if deduplicationOpts['keepLastIfActive'] then
                    rcall('SET', deduplicationKey, jobId)
                else
                    setDeduplicationKey(deduplicationKey, jobId, deduplicationOpts)
                end
                return
            end
        else
            return deduplicateJobWithoutReplace(deduplicationId, deduplicationOpts,
                jobId, deduplicationKey, eventsKey, maxEvents, prefix, jobName, jobData, fullOpts,
                parentKey, parentData, parentDependenciesKey, repeatJobKey)
        end
    end
end
--[[
  Function to store a job
]]
local function storeJob(eventsKey, jobIdKey, jobId, name, data, opts, timestamp,
                        parentKey, parentData, repeatJobKey)
    local jsonOpts = cjson.encode(opts)
    local delay = opts['delay'] or 0
    local priority = opts['priority'] or 0
    local debounceId = opts['de'] and opts['de']['id']
    local optionalValues = {}
    if parentKey ~= nil then
        table.insert(optionalValues, "parentKey")
        table.insert(optionalValues, parentKey)
        table.insert(optionalValues, "parent")
        table.insert(optionalValues, parentData)
    end
    if repeatJobKey then
        table.insert(optionalValues, "rjk")
        table.insert(optionalValues, repeatJobKey)
    end
    if debounceId then
        table.insert(optionalValues, "deid")
        table.insert(optionalValues, debounceId)
    end
    rcall("HMSET", jobIdKey, "name", name, "data", data, "opts", jsonOpts,
          "timestamp", timestamp, "delay", delay, "priority", priority,
          unpack(optionalValues))
    rcall("XADD", eventsKey, "*", "event", "added", "jobId", jobId, "name", name)
    return delay, priority
end
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
--[[
  Function to handle the case when job is duplicated.
]]
-- Includes
--[[
    This function is used to update the parent's dependencies if the job
    is already completed and about to be ignored. The parent must get its
    dependencies updated to avoid the parent job being stuck forever in 
    the waiting-children state.
]]
-- Includes
--[[
  Validate and move or add dependencies to parent.
]]
-- Includes
--[[
  Validate and move parent to a wait status (waiting, delayed or prioritized)
  if no pending dependencies.
]]
-- Includes
--[[
  Validate and move parent to a wait status (waiting, delayed or prioritized) if needed.
]]
-- Includes
--[[
  Move parent to a wait status (wait, prioritized or delayed)
]]
-- Includes
--[[
  Add delay marker if needed.
]]
-- Includes
--[[
  Function to return the next delayed job timestamp.
]]
local function getNextDelayedTimestamp(delayedKey)
  local result = rcall("ZRANGE", delayedKey, 0, 0, "WITHSCORES")
  if #result then
    local nextTimestamp = tonumber(result[2])
    if nextTimestamp ~= nil then
      return nextTimestamp / 0x1000
    end
  end
end
local function addDelayMarkerIfNeeded(markerKey, delayedKey)
  local nextTimestamp = getNextDelayedTimestamp(delayedKey)
  if nextTimestamp ~= nil then
    -- Replace the score of the marker with the newest known
    -- next timestamp.
    rcall("ZADD", markerKey, nextTimestamp, "1")
  end
end
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to check if queue is paused or maxed
  (since an empty list and !EXISTS are not really the same).
]]
local function isQueuePausedOrMaxed(queueMetaKey, activeKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency")
  if queueAttributes[1] then
    return true
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      return activeCount >= tonumber(queueAttributes[2])
    end
  end
  return false
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
local function moveParentToWait(parentQueueKey, parentKey, parentId, timestamp)
    local parentWaitKey = parentQueueKey .. ":wait"
    local parentPausedKey = parentQueueKey .. ":paused"
    local parentActiveKey = parentQueueKey .. ":active"
    local parentMetaKey = parentQueueKey .. ":meta"
    local parentMarkerKey = parentQueueKey .. ":marker"
    local jobAttributes = rcall("HMGET", parentKey, "priority", "delay")
    local priority = tonumber(jobAttributes[1]) or 0
    local delay = tonumber(jobAttributes[2]) or 0
    if delay > 0 then
        local delayedTimestamp = tonumber(timestamp) + delay
        local score = delayedTimestamp * 0x1000
        local parentDelayedKey = parentQueueKey .. ":delayed"
        rcall("ZADD", parentDelayedKey, score, parentId)
        rcall("XADD", parentQueueKey .. ":events", "*", "event", "delayed", "jobId", parentId, "delay",
            delayedTimestamp)
        addDelayMarkerIfNeeded(parentMarkerKey, parentDelayedKey)
    else
        if priority == 0 then
            local parentTarget, isParentPausedOrMaxed = getTargetQueueList(parentMetaKey, parentActiveKey,
                parentWaitKey, parentPausedKey)
            addJobInTargetList(parentTarget, parentMarkerKey, "RPUSH", isParentPausedOrMaxed, parentId)
        else
            local isPausedOrMaxed = isQueuePausedOrMaxed(parentMetaKey, parentActiveKey)
            addJobWithPriority(parentMarkerKey, parentQueueKey .. ":prioritized", priority, parentId,
                parentQueueKey .. ":pc", isPausedOrMaxed)
        end
        rcall("XADD", parentQueueKey .. ":events", "*", "event", "waiting", "jobId", parentId, "prev",
            "waiting-children")
    end
end
local function moveParentToWaitIfNeeded(parentQueueKey, parentKey, parentId, timestamp)
  if rcall("EXISTS", parentKey) == 1 then
    local parentWaitingChildrenKey = parentQueueKey .. ":waiting-children"
    if rcall("ZSCORE", parentWaitingChildrenKey, parentId) then    
      rcall("ZREM", parentWaitingChildrenKey, parentId)
      moveParentToWait(parentQueueKey, parentKey, parentId, timestamp)
    end
  end
end
local function moveParentToWaitIfNoPendingDependencies(parentQueueKey, parentDependenciesKey, parentKey,
  parentId, timestamp)
  local doNotHavePendingDependencies = rcall("SCARD", parentDependenciesKey) == 0
  if doNotHavePendingDependencies then
    moveParentToWaitIfNeeded(parentQueueKey, parentKey, parentId, timestamp)
  end
end
local function updateParentDepsIfNeeded(parentKey, parentQueueKey, parentDependenciesKey,
  parentId, jobIdKey, returnvalue, timestamp )
  local processedSet = parentKey .. ":processed"
  rcall("HSET", processedSet, jobIdKey, returnvalue)
  moveParentToWaitIfNoPendingDependencies(parentQueueKey, parentDependenciesKey, parentKey, parentId, timestamp)
end
local function updateExistingJobsParent(parentKey, parent, parentData,
                                        parentDependenciesKey, completedKey,
                                        jobIdKey, jobId, timestamp)
    if parentKey ~= nil then
        if rcall("ZSCORE", completedKey, jobId) then
            local returnvalue = rcall("HGET", jobIdKey, "returnvalue")
            updateParentDepsIfNeeded(parentKey, parent['queueKey'],
                                     parentDependenciesKey, parent['id'],
                                     jobIdKey, returnvalue, timestamp)
        else
            if parentDependenciesKey ~= nil then
                rcall("SADD", parentDependenciesKey, jobIdKey)
            end
        end
        rcall("HMSET", jobIdKey, "parentKey", parentKey, "parent", parentData)
    end
end
local function handleDuplicatedJob(jobKey, jobId, currentParentKey, currentParent,
  parentData, parentDependenciesKey, completedKey, eventsKey, maxEvents, timestamp)
  local existedParentKey = rcall("HGET", jobKey, "parentKey")
  if not existedParentKey or existedParentKey == currentParentKey then
    updateExistingJobsParent(currentParentKey, currentParent, parentData,
      parentDependenciesKey, completedKey, jobKey,
      jobId, timestamp)
  else
    if currentParentKey ~= nil and currentParentKey ~= existedParentKey
      and (rcall("EXISTS", existedParentKey) == 1) then
      return -7
    end
  end
  rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event",
    "duplicated", "jobId", jobId)
  return jobId .. "" -- convert to string
end
if parentKey ~= nil then
    if rcall("EXISTS", parentKey) ~= 1 then return -5 end
    parentData = cjson.encode(parent)
end
local jobCounter = rcall("INCR", idKey)
local maxEvents = getOrSetMaxEvents(metaKey)
local parentDependenciesKey = args[6]
local timestamp = args[4]
if args[2] == "" then
    jobId = jobCounter .. "" -- convert to string
    jobIdKey = args[1] .. jobId
else
    jobId = args[2]
    jobIdKey = args[1] .. jobId
    if rcall("EXISTS", jobIdKey) == 1 then
        return handleDuplicatedJob(jobIdKey, jobId, parentKey, parent,
            parentData, parentDependenciesKey, completedKey, eventsKey,
            maxEvents, timestamp)
    end
end
local deduplicationJobId = deduplicateJob(opts['de'], jobId, KEYS[5],
  deduplicationKey, eventsKey, maxEvents, args[1], args[3], ARGV[2], opts,
  parentKey, parentData, parentDependenciesKey, repeatJobKey)
if deduplicationJobId then
  return deduplicationJobId
end
-- Store the job.
local delay, priority = storeJob(eventsKey, jobIdKey, jobId, args[3], ARGV[2],
                                 opts, timestamp, parentKey, parentData,
                                 repeatJobKey)
-- Add the job to the prioritized set
local isPausedOrMaxed = isQueuePausedOrMaxed(metaKey, activeKey)
addJobWithPriority( KEYS[1], priorityKey, priority, jobId, priorityCounterKey, isPausedOrMaxed)
-- Emit waiting event
rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "waiting",
      "jobId", jobId)
-- Check if this job is a child of another job, if so add it to the parents dependencies
if parentDependenciesKey ~= nil then
    rcall("SADD", parentDependenciesKey, jobIdKey)
end
return jobId
`,keys:9};e.s(["addPrioritizedJob",0,tw],55494),e.i(55494);let tj={name:"addRepeatableJob",content:`--[[
  Adds a repeatable job
    Input:
      KEYS[1] 'repeat' key
      KEYS[2] 'delayed' key
      ARGV[1] next milliseconds
      ARGV[2] msgpacked options
            [1]  name
            [2]  tz?
            [3]  pattern?
            [4]  endDate?
            [5]  every?
      ARGV[3] legacy custom key TODO: remove this logic in next breaking change
      ARGV[4] custom key
      ARGV[5] prefix key
      Output:
        repeatableKey  - OK
]]
local rcall = redis.call
local repeatKey = KEYS[1]
local delayedKey = KEYS[2]
local nextMillis = ARGV[1]
local legacyCustomKey = ARGV[3]
local customKey = ARGV[4]
local prefixKey = ARGV[5]
-- Includes
--[[
  Function to remove job.
]]
-- Includes
--[[
  Function to remove deduplication key if needed
  when a job is being removed.
]]
local function removeDeduplicationKeyIfNeededOnRemoval(prefixKey,
  jobId, deduplicationId)
  if deduplicationId then
    local deduplicationKey = prefixKey .. "de:" .. deduplicationId
    local currentJobId = rcall('GET', deduplicationKey)
    if currentJobId and currentJobId == jobId then
      rcall("DEL", deduplicationKey)
      -- Also clean up any pending dedup-next data for this dedup ID
      rcall("DEL", prefixKey .. "dn:" .. deduplicationId)
      return 1
    end
  end
end
--[[
  Function to remove job keys.
]]
local function removeJobKeys(jobKey)
  return rcall("DEL", jobKey, jobKey .. ':logs', jobKey .. ':dependencies',
    jobKey .. ':processed', jobKey .. ':failed', jobKey .. ':unsuccessful')
end
--[[
  Check if this job has a parent. If so we will just remove it from
  the parent child list, but if it is the last child we should move the parent to "wait/paused"
  which requires code from "moveToFinished"
]]
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Functions to destructure job key.
  Just a bit of warning, these functions may be a bit slow and affect performance significantly.
]]
local getJobIdFromKey = function (jobKey)
  return string.match(jobKey, ".*:(.*)")
end
local getJobKeyPrefix = function (jobKey, jobId)
  return string.sub(jobKey, 0, #jobKey - #jobId)
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
local function _moveParentToWait(parentPrefix, parentId, emitEvent)
  local parentTarget, isPausedOrMaxed = getTargetQueueList(parentPrefix .. "meta", parentPrefix .. "active",
    parentPrefix .. "wait", parentPrefix .. "paused")
  addJobInTargetList(parentTarget, parentPrefix .. "marker", "RPUSH", isPausedOrMaxed, parentId)
  if emitEvent then
    local parentEventStream = parentPrefix .. "events"
    rcall("XADD", parentEventStream, "*", "event", "waiting", "jobId", parentId, "prev", "waiting-children")
  end
end
local function removeParentDependencyKey(jobKey, hard, parentKey, baseKey, debounceId)
  if parentKey then
    local parentDependenciesKey = parentKey .. ":dependencies"
    local result = rcall("SREM", parentDependenciesKey, jobKey)
    if result > 0 then
      local pendingDependencies = rcall("SCARD", parentDependenciesKey)
      if pendingDependencies == 0 then
        local parentId = getJobIdFromKey(parentKey)
        local parentPrefix = getJobKeyPrefix(parentKey, parentId)
        local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
        if numRemovedElements == 1 then
          if hard then -- remove parent in same queue
            if parentPrefix == baseKey then
              removeParentDependencyKey(parentKey, hard, nil, baseKey, nil)
              removeJobKeys(parentKey)
              if debounceId then
                rcall("DEL", parentPrefix .. "de:" .. debounceId)
              end
            else
              _moveParentToWait(parentPrefix, parentId)
            end
          else
            _moveParentToWait(parentPrefix, parentId, true)
          end
        end
      end
      return true
    end
  else
    local parentAttributes = rcall("HMGET", jobKey, "parentKey", "deid")
    local missedParentKey = parentAttributes[1]
    if( (type(missedParentKey) == "string") and missedParentKey ~= ""
      and (rcall("EXISTS", missedParentKey) == 1)) then
      local parentDependenciesKey = missedParentKey .. ":dependencies"
      local result = rcall("SREM", parentDependenciesKey, jobKey)
      if result > 0 then
        local pendingDependencies = rcall("SCARD", parentDependenciesKey)
        if pendingDependencies == 0 then
          local parentId = getJobIdFromKey(missedParentKey)
          local parentPrefix = getJobKeyPrefix(missedParentKey, parentId)
          local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
          if numRemovedElements == 1 then
            if hard then
              if parentPrefix == baseKey then
                removeParentDependencyKey(missedParentKey, hard, nil, baseKey, nil)
                removeJobKeys(missedParentKey)
                if parentAttributes[2] then
                  rcall("DEL", parentPrefix .. "de:" .. parentAttributes[2])
                end
              else
                _moveParentToWait(parentPrefix, parentId)
              end
            else
              _moveParentToWait(parentPrefix, parentId, true)
            end
          end
        end
        return true
      end
    end
  end
  return false
end
local function removeJob(jobId, hard, baseKey, shouldRemoveDeduplicationKey)
  local jobKey = baseKey .. jobId
  removeParentDependencyKey(jobKey, hard, nil, baseKey)
  if shouldRemoveDeduplicationKey then
    local deduplicationId = rcall("HGET", jobKey, "deid")
    removeDeduplicationKeyIfNeededOnRemoval(baseKey, jobId, deduplicationId)
  end
  removeJobKeys(jobKey)
end
local function storeRepeatableJob(repeatKey, customKey, nextMillis, rawOpts)
  rcall("ZADD", repeatKey, nextMillis, customKey)
  local opts = cmsgpack.unpack(rawOpts)
  local optionalValues = {}
  if opts['tz'] then
    table.insert(optionalValues, "tz")
    table.insert(optionalValues, opts['tz'])
  end
  if opts['pattern'] then
    table.insert(optionalValues, "pattern")
    table.insert(optionalValues, opts['pattern'])
  end
  if opts['endDate'] then
    table.insert(optionalValues, "endDate")
    table.insert(optionalValues, opts['endDate'])
  end
  if opts['every'] then
    table.insert(optionalValues, "every")
    table.insert(optionalValues, opts['every'])
  end
  rcall("HMSET", repeatKey .. ":" .. customKey, "name", opts['name'],
    unpack(optionalValues))
  return customKey
end
-- If we are overriding a repeatable job we must delete the delayed job for
-- the next iteration.
local prevMillis = rcall("ZSCORE", repeatKey, customKey)
if prevMillis then
  local delayedJobId =  "repeat:" .. customKey .. ":" .. prevMillis
  local nextDelayedJobId =  repeatKey .. ":" .. customKey .. ":" .. nextMillis
  if rcall("ZSCORE", delayedKey, delayedJobId)
   and rcall("EXISTS", nextDelayedJobId) ~= 1 then
    removeJob(delayedJobId, true, prefixKey, true --[[remove debounce key]])
    rcall("ZREM", delayedKey, delayedJobId)
  end
end
-- Keep backwards compatibility with old repeatable jobs (<= 3.0.0)
if rcall("ZSCORE", repeatKey, legacyCustomKey) ~= false then
  return storeRepeatableJob(repeatKey, legacyCustomKey, nextMillis, ARGV[2])
end
return storeRepeatableJob(repeatKey, customKey, nextMillis, ARGV[2])
`,keys:2};e.s(["addRepeatableJob",0,tj],30960),e.i(30960);let tx={name:"addStandardJob",content:`--[[
  Adds a job to the queue by doing the following:
    - Increases the job counter if needed.
    - Creates a new job key with the job data.
    - if delayed:
      - computes timestamp.
      - adds to delayed zset.
      - Emits a global event 'delayed' if the job is delayed.
    - if not delayed
      - Adds the jobId to the wait/paused list in one of three ways:
         - LIFO
         - FIFO
         - prioritized.
      - Adds the job to the "added" list so that workers gets notified.
    Input:
      KEYS[1] 'wait',
      KEYS[2] 'paused'
      KEYS[3] 'meta'
      KEYS[4] 'id'
      KEYS[5] 'completed'
      KEYS[6] 'delayed'
      KEYS[7] 'active'
      KEYS[8] events stream key
      KEYS[9] marker key
      ARGV[1] msgpacked arguments array
            [1]  key prefix,
            [2]  custom id (will not generate one automatically)
            [3]  name
            [4]  timestamp
            [5]  parentKey?
            [6]  parent dependencies key.
            [7]  parent? {id, queueKey}
            [8]  repeat job key
            [9] deduplication key
      ARGV[2] Json stringified job data
      ARGV[3] msgpacked options
      Output:
        jobId  - OK
        -5     - Missing parent key
]]
local eventsKey = KEYS[8]
local jobId
local jobIdKey
local rcall = redis.call
local args = cmsgpack.unpack(ARGV[1])
local data = ARGV[2]
local opts = cmsgpack.unpack(ARGV[3])
local parentKey = args[5]
local parent = args[7]
local repeatJobKey = args[8]
local deduplicationKey = args[9]
local parentData
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to debounce a job.
]]
-- Includes
--[[
  Function to deduplicate a job.
]]
--[[
  Function to set the deduplication key for a job.
  Uses TTL from deduplication opts if provided.
]]
local function setDeduplicationKey(deduplicationKey, jobId, deduplicationOpts)
    local ttl = deduplicationOpts and deduplicationOpts['ttl']
    if ttl and ttl > 0 then
        rcall('SET', deduplicationKey, jobId, 'PX', ttl)
    else
        rcall('SET', deduplicationKey, jobId)
    end
end
--[[
  Function to store a deduplicated next job if the existing job is active
  and keepLastIfActive is set. When the active job finishes, the stored
  proto-job is used to create a real job in the queue.
  Returns true if the proto-job was stored, false otherwise.
]]
--[[
  Function to check if an item belongs to a list.
]]
local function checkItemInList(list, item)
  for _, v in pairs(list) do
    if v == item then
      return 1
    end
  end
  return nil
end
local function storeDeduplicatedNextJob(deduplicationOpts, currentDebounceJobId, prefix,
    deduplicationId, jobName, jobData, fullOpts, eventsKey, maxEvents, jobId,
    parentKey, parentData, parentDependenciesKey, repeatJobKey)
    if deduplicationOpts['keepLastIfActive'] and currentDebounceJobId then
        local activeKey = prefix .. "active"
        local activeItems = rcall('LRANGE', activeKey, 0, -1)
        if checkItemInList(activeItems, currentDebounceJobId) then
            local deduplicationNextKey = prefix .. "dn:" .. deduplicationId
            local fields = {'name', jobName, 'data', jobData, 'opts', cjson.encode(fullOpts),
                'jid', jobId}
            if parentKey then
                fields[#fields+1] = 'pk'
                fields[#fields+1] = parentKey
            end
            if parentData then
                fields[#fields+1] = 'pd'
                fields[#fields+1] = parentData
            end
            if parentDependenciesKey then
                fields[#fields+1] = 'pdk'
                fields[#fields+1] = parentDependenciesKey
            end
            if repeatJobKey then
                fields[#fields+1] = 'rjk'
                fields[#fields+1] = repeatJobKey
            end
            rcall('DEL', deduplicationNextKey)
            rcall('HSET', deduplicationNextKey, unpack(fields))
            -- Ensure the dedup key does not expire while the job is active,
            -- so subsequent adds always hit the dedup path and never bypass
            -- the active-check because of a TTL expiry.
            local deduplicationKey = prefix .. "de:" .. deduplicationId
            rcall('PERSIST', deduplicationKey)
            -- TODO remove debounced event in next breaking change
            rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "debounced", "jobId",
                currentDebounceJobId, "debounceId", deduplicationId)
            rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "deduplicated", "jobId",
                currentDebounceJobId, "deduplicationId", deduplicationId, "deduplicatedJobId", jobId)
            return true
        end
    end
    return false
end
local function deduplicateJobWithoutReplace(deduplicationId, deduplicationOpts, jobId, deduplicationKey,
    eventsKey, maxEvents, prefix, jobName, jobData, fullOpts,
    parentKey, parentData, parentDependenciesKey, repeatJobKey)
    local ttl = deduplicationOpts['ttl']
    local deduplicationKeyExists
    if ttl and ttl > 0 then
        if deduplicationOpts['extend'] then
            local currentDebounceJobId = rcall('GET', deduplicationKey)
            if currentDebounceJobId then
                if storeDeduplicatedNextJob(deduplicationOpts, currentDebounceJobId, prefix,
                    deduplicationId, jobName, jobData, fullOpts, eventsKey, maxEvents, jobId,
                    parentKey, parentData, parentDependenciesKey, repeatJobKey) then
                    return currentDebounceJobId
                end
                if deduplicationOpts['keepLastIfActive'] then
                    rcall('SET', deduplicationKey, currentDebounceJobId)
                else
                    setDeduplicationKey(deduplicationKey, currentDebounceJobId, deduplicationOpts)
                end
                rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "debounced",
                    "jobId", currentDebounceJobId, "debounceId", deduplicationId)
                rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "deduplicated", "jobId",
                    currentDebounceJobId, "deduplicationId", deduplicationId, "deduplicatedJobId", jobId)
                return currentDebounceJobId
            else
                if deduplicationOpts['keepLastIfActive'] then
                    rcall('SET', deduplicationKey, jobId)
                else
                    setDeduplicationKey(deduplicationKey, jobId, deduplicationOpts)
                end
                return
            end
        else
            if deduplicationOpts['keepLastIfActive'] then
                deduplicationKeyExists = not rcall('SET', deduplicationKey, jobId, 'NX')
            else
                deduplicationKeyExists = not rcall('SET', deduplicationKey, jobId, 'PX', ttl, 'NX')
            end
        end
    else
        deduplicationKeyExists = not rcall('SET', deduplicationKey, jobId, 'NX')
    end
    if deduplicationKeyExists then
        local currentDebounceJobId = rcall('GET', deduplicationKey)
        if storeDeduplicatedNextJob(deduplicationOpts, currentDebounceJobId, prefix,
            deduplicationId, jobName, jobData, fullOpts, eventsKey, maxEvents, jobId,
            parentKey, parentData, parentDependenciesKey, repeatJobKey) then
            return currentDebounceJobId
        end
        -- TODO remove debounced event in next breaking change
        rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "debounced", "jobId",
            currentDebounceJobId, "debounceId", deduplicationId)
        rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "deduplicated", "jobId",
            currentDebounceJobId, "deduplicationId", deduplicationId, "deduplicatedJobId", jobId)
        return currentDebounceJobId
    end
end
--[[
  Function to remove job keys.
]]
local function removeJobKeys(jobKey)
  return rcall("DEL", jobKey, jobKey .. ':logs', jobKey .. ':dependencies',
    jobKey .. ':processed', jobKey .. ':failed', jobKey .. ':unsuccessful')
end
local function removeDelayedJob(delayedKey, deduplicationKey, eventsKey, maxEvents, currentDeduplicatedJobId,
    jobId, deduplicationId, prefix)
    if rcall("ZREM", delayedKey, currentDeduplicatedJobId) > 0 then
        removeJobKeys(prefix .. currentDeduplicatedJobId)
        rcall("XADD", eventsKey, "*", "event", "removed", "jobId", currentDeduplicatedJobId,
            "prev", "delayed")
        -- TODO remove debounced event in next breaking change
        rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "debounced", "jobId",
            jobId, "debounceId", deduplicationId)
        rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "deduplicated", "jobId",
            jobId, "deduplicationId", deduplicationId, "deduplicatedJobId", currentDeduplicatedJobId)
        return true
    end
    return false
end
local function deduplicateJob(deduplicationOpts, jobId, delayedKey, deduplicationKey, eventsKey, maxEvents,
    prefix, jobName, jobData, fullOpts, parentKey, parentData, parentDependenciesKey, repeatJobKey)
    local deduplicationId = deduplicationOpts and deduplicationOpts['id']
    if deduplicationId then
        if deduplicationOpts['replace'] then
            local currentDebounceJobId = rcall('GET', deduplicationKey)
            if currentDebounceJobId then
                local isRemoved = removeDelayedJob(delayedKey, deduplicationKey, eventsKey, maxEvents,
                    currentDebounceJobId, jobId, deduplicationId, prefix)
                if isRemoved then
                    if deduplicationOpts['keepLastIfActive'] then
                        rcall('SET', deduplicationKey, jobId)
                    else
                        local ttl = deduplicationOpts['ttl']
                        if not deduplicationOpts['extend'] and ttl and ttl > 0 then
                            rcall('SET', deduplicationKey, jobId, 'KEEPTTL')
                        else
                            setDeduplicationKey(deduplicationKey, jobId, deduplicationOpts)
                        end
                    end
                    return
                else
                    storeDeduplicatedNextJob(deduplicationOpts, currentDebounceJobId, prefix,
                        deduplicationId, jobName, jobData, fullOpts, eventsKey, maxEvents, jobId,
                        parentKey, parentData, parentDependenciesKey, repeatJobKey)
                    return currentDebounceJobId
                end
            else
                if deduplicationOpts['keepLastIfActive'] then
                    rcall('SET', deduplicationKey, jobId)
                else
                    setDeduplicationKey(deduplicationKey, jobId, deduplicationOpts)
                end
                return
            end
        else
            return deduplicateJobWithoutReplace(deduplicationId, deduplicationOpts,
                jobId, deduplicationKey, eventsKey, maxEvents, prefix, jobName, jobData, fullOpts,
                parentKey, parentData, parentDependenciesKey, repeatJobKey)
        end
    end
end
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
--[[
  Function to handle the case when job is duplicated.
]]
-- Includes
--[[
    This function is used to update the parent's dependencies if the job
    is already completed and about to be ignored. The parent must get its
    dependencies updated to avoid the parent job being stuck forever in 
    the waiting-children state.
]]
-- Includes
--[[
  Validate and move or add dependencies to parent.
]]
-- Includes
--[[
  Validate and move parent to a wait status (waiting, delayed or prioritized)
  if no pending dependencies.
]]
-- Includes
--[[
  Validate and move parent to a wait status (waiting, delayed or prioritized) if needed.
]]
-- Includes
--[[
  Move parent to a wait status (wait, prioritized or delayed)
]]
-- Includes
--[[
  Add delay marker if needed.
]]
-- Includes
--[[
  Function to return the next delayed job timestamp.
]]
local function getNextDelayedTimestamp(delayedKey)
  local result = rcall("ZRANGE", delayedKey, 0, 0, "WITHSCORES")
  if #result then
    local nextTimestamp = tonumber(result[2])
    if nextTimestamp ~= nil then
      return nextTimestamp / 0x1000
    end
  end
end
local function addDelayMarkerIfNeeded(markerKey, delayedKey)
  local nextTimestamp = getNextDelayedTimestamp(delayedKey)
  if nextTimestamp ~= nil then
    -- Replace the score of the marker with the newest known
    -- next timestamp.
    rcall("ZADD", markerKey, nextTimestamp, "1")
  end
end
--[[
  Function to add job considering priority.
]]
-- Includes
--[[
  Function to get priority score.
]]
local function getPriorityScore(priority, priorityCounterKey)
  local prioCounter = rcall("INCR", priorityCounterKey)
  return priority * 0x100000000 + prioCounter % 0x100000000
end
local function addJobWithPriority(markerKey, prioritizedKey, priority, jobId, priorityCounterKey,
  isPausedOrMaxed)
  local score = getPriorityScore(priority, priorityCounterKey)
  rcall("ZADD", prioritizedKey, score, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to check if queue is paused or maxed
  (since an empty list and !EXISTS are not really the same).
]]
local function isQueuePausedOrMaxed(queueMetaKey, activeKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency")
  if queueAttributes[1] then
    return true
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      return activeCount >= tonumber(queueAttributes[2])
    end
  end
  return false
end
local function moveParentToWait(parentQueueKey, parentKey, parentId, timestamp)
    local parentWaitKey = parentQueueKey .. ":wait"
    local parentPausedKey = parentQueueKey .. ":paused"
    local parentActiveKey = parentQueueKey .. ":active"
    local parentMetaKey = parentQueueKey .. ":meta"
    local parentMarkerKey = parentQueueKey .. ":marker"
    local jobAttributes = rcall("HMGET", parentKey, "priority", "delay")
    local priority = tonumber(jobAttributes[1]) or 0
    local delay = tonumber(jobAttributes[2]) or 0
    if delay > 0 then
        local delayedTimestamp = tonumber(timestamp) + delay
        local score = delayedTimestamp * 0x1000
        local parentDelayedKey = parentQueueKey .. ":delayed"
        rcall("ZADD", parentDelayedKey, score, parentId)
        rcall("XADD", parentQueueKey .. ":events", "*", "event", "delayed", "jobId", parentId, "delay",
            delayedTimestamp)
        addDelayMarkerIfNeeded(parentMarkerKey, parentDelayedKey)
    else
        if priority == 0 then
            local parentTarget, isParentPausedOrMaxed = getTargetQueueList(parentMetaKey, parentActiveKey,
                parentWaitKey, parentPausedKey)
            addJobInTargetList(parentTarget, parentMarkerKey, "RPUSH", isParentPausedOrMaxed, parentId)
        else
            local isPausedOrMaxed = isQueuePausedOrMaxed(parentMetaKey, parentActiveKey)
            addJobWithPriority(parentMarkerKey, parentQueueKey .. ":prioritized", priority, parentId,
                parentQueueKey .. ":pc", isPausedOrMaxed)
        end
        rcall("XADD", parentQueueKey .. ":events", "*", "event", "waiting", "jobId", parentId, "prev",
            "waiting-children")
    end
end
local function moveParentToWaitIfNeeded(parentQueueKey, parentKey, parentId, timestamp)
  if rcall("EXISTS", parentKey) == 1 then
    local parentWaitingChildrenKey = parentQueueKey .. ":waiting-children"
    if rcall("ZSCORE", parentWaitingChildrenKey, parentId) then    
      rcall("ZREM", parentWaitingChildrenKey, parentId)
      moveParentToWait(parentQueueKey, parentKey, parentId, timestamp)
    end
  end
end
local function moveParentToWaitIfNoPendingDependencies(parentQueueKey, parentDependenciesKey, parentKey,
  parentId, timestamp)
  local doNotHavePendingDependencies = rcall("SCARD", parentDependenciesKey) == 0
  if doNotHavePendingDependencies then
    moveParentToWaitIfNeeded(parentQueueKey, parentKey, parentId, timestamp)
  end
end
local function updateParentDepsIfNeeded(parentKey, parentQueueKey, parentDependenciesKey,
  parentId, jobIdKey, returnvalue, timestamp )
  local processedSet = parentKey .. ":processed"
  rcall("HSET", processedSet, jobIdKey, returnvalue)
  moveParentToWaitIfNoPendingDependencies(parentQueueKey, parentDependenciesKey, parentKey, parentId, timestamp)
end
local function updateExistingJobsParent(parentKey, parent, parentData,
                                        parentDependenciesKey, completedKey,
                                        jobIdKey, jobId, timestamp)
    if parentKey ~= nil then
        if rcall("ZSCORE", completedKey, jobId) then
            local returnvalue = rcall("HGET", jobIdKey, "returnvalue")
            updateParentDepsIfNeeded(parentKey, parent['queueKey'],
                                     parentDependenciesKey, parent['id'],
                                     jobIdKey, returnvalue, timestamp)
        else
            if parentDependenciesKey ~= nil then
                rcall("SADD", parentDependenciesKey, jobIdKey)
            end
        end
        rcall("HMSET", jobIdKey, "parentKey", parentKey, "parent", parentData)
    end
end
local function handleDuplicatedJob(jobKey, jobId, currentParentKey, currentParent,
  parentData, parentDependenciesKey, completedKey, eventsKey, maxEvents, timestamp)
  local existedParentKey = rcall("HGET", jobKey, "parentKey")
  if not existedParentKey or existedParentKey == currentParentKey then
    updateExistingJobsParent(currentParentKey, currentParent, parentData,
      parentDependenciesKey, completedKey, jobKey,
      jobId, timestamp)
  else
    if currentParentKey ~= nil and currentParentKey ~= existedParentKey
      and (rcall("EXISTS", existedParentKey) == 1) then
      return -7
    end
  end
  rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event",
    "duplicated", "jobId", jobId)
  return jobId .. "" -- convert to string
end
--[[
  Function to store a job
]]
local function storeJob(eventsKey, jobIdKey, jobId, name, data, opts, timestamp,
                        parentKey, parentData, repeatJobKey)
    local jsonOpts = cjson.encode(opts)
    local delay = opts['delay'] or 0
    local priority = opts['priority'] or 0
    local debounceId = opts['de'] and opts['de']['id']
    local optionalValues = {}
    if parentKey ~= nil then
        table.insert(optionalValues, "parentKey")
        table.insert(optionalValues, parentKey)
        table.insert(optionalValues, "parent")
        table.insert(optionalValues, parentData)
    end
    if repeatJobKey then
        table.insert(optionalValues, "rjk")
        table.insert(optionalValues, repeatJobKey)
    end
    if debounceId then
        table.insert(optionalValues, "deid")
        table.insert(optionalValues, debounceId)
    end
    rcall("HMSET", jobIdKey, "name", name, "data", data, "opts", jsonOpts,
          "timestamp", timestamp, "delay", delay, "priority", priority,
          unpack(optionalValues))
    rcall("XADD", eventsKey, "*", "event", "added", "jobId", jobId, "name", name)
    return delay, priority
end
if parentKey ~= nil then
    if rcall("EXISTS", parentKey) ~= 1 then return -5 end
    parentData = cjson.encode(parent)
end
local jobCounter = rcall("INCR", KEYS[4])
local metaKey = KEYS[3]
local maxEvents = getOrSetMaxEvents(metaKey)
local parentDependenciesKey = args[6]
local timestamp = args[4]
if args[2] == "" then
    jobId = jobCounter .. "" -- convert to string
    jobIdKey = args[1] .. jobId
else
    jobId = args[2]
    jobIdKey = args[1] .. jobId
    if rcall("EXISTS", jobIdKey) == 1 then
        return handleDuplicatedJob(jobIdKey, jobId, parentKey, parent,
            parentData, parentDependenciesKey, KEYS[5], eventsKey,
            maxEvents, timestamp)
    end
end
local deduplicationJobId = deduplicateJob(opts['de'], jobId, KEYS[6],
  deduplicationKey, eventsKey, maxEvents, args[1], args[3], ARGV[2], opts,
  parentKey, parentData, parentDependenciesKey, repeatJobKey)
if deduplicationJobId then
  return deduplicationJobId
end
-- Store the job.
storeJob(eventsKey, jobIdKey, jobId, args[3], ARGV[2], opts, timestamp,
         parentKey, parentData, repeatJobKey)
local target, isPausedOrMaxed = getTargetQueueList(metaKey, KEYS[7], KEYS[1], KEYS[2])
-- LIFO or FIFO
local pushCmd = opts['lifo'] and 'RPUSH' or 'LPUSH'
addJobInTargetList(target, KEYS[9], pushCmd, isPausedOrMaxed, jobId)
-- Emit waiting event
rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "waiting",
      "jobId", jobId)
-- Check if this job is a child of another job, if so add it to the parents dependencies
if parentDependenciesKey ~= nil then
    rcall("SADD", parentDependenciesKey, jobIdKey)
end
return jobId
`,keys:9};e.s(["addStandardJob",0,tx],1939),e.i(1939);let tA={name:"changeDelay",content:`--[[
  Change job delay when it is in delayed set.
  Input:
    KEYS[1] delayed key
    KEYS[2] meta key
    KEYS[3] marker key
    KEYS[4] events stream
    ARGV[1] delay
    ARGV[2] timestamp
    ARGV[3] the id of the job
    ARGV[4] job key
  Output:
    0 - OK
   -1 - Missing job.
   -3 - Job not in delayed set.
  Events:
    - delayed key.
]]
local rcall = redis.call
-- Includes
--[[
  Add delay marker if needed.
]]
-- Includes
--[[
  Function to return the next delayed job timestamp.
]]
local function getNextDelayedTimestamp(delayedKey)
  local result = rcall("ZRANGE", delayedKey, 0, 0, "WITHSCORES")
  if #result then
    local nextTimestamp = tonumber(result[2])
    if nextTimestamp ~= nil then
      return nextTimestamp / 0x1000
    end
  end
end
local function addDelayMarkerIfNeeded(markerKey, delayedKey)
  local nextTimestamp = getNextDelayedTimestamp(delayedKey)
  if nextTimestamp ~= nil then
    -- Replace the score of the marker with the newest known
    -- next timestamp.
    rcall("ZADD", markerKey, nextTimestamp, "1")
  end
end
--[[
  Bake in the job id first 12 bits into the timestamp
  to guarantee correct execution order of delayed jobs
  (up to 4096 jobs per given timestamp or 4096 jobs apart per timestamp)
  WARNING: Jobs that are so far apart that they wrap around will cause FIFO to fail
]]
local function getDelayedScore(delayedKey, timestamp, delay)
  local delayedTimestamp = (delay > 0 and (tonumber(timestamp) + delay)) or tonumber(timestamp)
  local minScore = delayedTimestamp * 0x1000
  local maxScore = (delayedTimestamp + 1 ) * 0x1000 - 1
  local result = rcall("ZREVRANGEBYSCORE", delayedKey, maxScore,
    minScore, "WITHSCORES","LIMIT", 0, 1)
  if #result then
    local currentMaxScore = tonumber(result[2])
    if currentMaxScore ~= nil then
      if currentMaxScore >= maxScore then
        return maxScore, delayedTimestamp
      else
        return currentMaxScore + 1, delayedTimestamp
      end
    end
  end
  return minScore, delayedTimestamp
end
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
if rcall("EXISTS", ARGV[4]) == 1 then
  local jobId = ARGV[3]
  local delay = tonumber(ARGV[1])
  local score, delayedTimestamp = getDelayedScore(KEYS[1], ARGV[2], delay)
  local numRemovedElements = rcall("ZREM", KEYS[1], jobId)
  if numRemovedElements < 1 then
    return -3
  end
  rcall("HSET", ARGV[4], "delay", delay)
  rcall("ZADD", KEYS[1], score, jobId)
  local maxEvents = getOrSetMaxEvents(KEYS[2])
  rcall("XADD", KEYS[4], "MAXLEN", "~", maxEvents, "*", "event", "delayed",
    "jobId", jobId, "delay", delayedTimestamp)
  -- mark that a delayed job is available
  addDelayMarkerIfNeeded(KEYS[3], KEYS[1])
  return 0
else
  return -1
end`,keys:4};e.s(["changeDelay",0,tA],24195),e.i(24195);let tT={name:"changePriority",content:`--[[
  Change job priority
  Input:
    KEYS[1] 'wait',
    KEYS[2] 'paused'
    KEYS[3] 'meta'
    KEYS[4] 'prioritized'
    KEYS[5] 'active'
    KEYS[6] 'pc' priority counter
    KEYS[7] 'marker'
    ARGV[1] priority value
    ARGV[2] prefix key
    ARGV[3] job id
    ARGV[4] lifo
    Output:
       0  - OK
      -1  - Missing job
]]
local jobId = ARGV[3]
local jobKey = ARGV[2] .. jobId
local priority = tonumber(ARGV[1])
local rcall = redis.call
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to add job considering priority.
]]
-- Includes
--[[
  Function to get priority score.
]]
local function getPriorityScore(priority, priorityCounterKey)
  local prioCounter = rcall("INCR", priorityCounterKey)
  return priority * 0x100000000 + prioCounter % 0x100000000
end
local function addJobWithPriority(markerKey, prioritizedKey, priority, jobId, priorityCounterKey,
  isPausedOrMaxed)
  local score = getPriorityScore(priority, priorityCounterKey)
  rcall("ZADD", prioritizedKey, score, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
--[[
  Function to push back job considering priority in front of same prioritized jobs.
]]
local function pushBackJobWithPriority(prioritizedKey, priority, jobId)
  -- in order to put it at front of same prioritized jobs
  -- we consider prioritized counter as 0
  local score = priority * 0x100000000
  rcall("ZADD", prioritizedKey, score, jobId)
end
local function reAddJobWithNewPriority( prioritizedKey, markerKey, targetKey,
    priorityCounter, lifo, priority, jobId, isPausedOrMaxed)
    if priority == 0 then
        local pushCmd = lifo and 'RPUSH' or 'LPUSH'
        addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
    else
        if lifo then
            pushBackJobWithPriority(prioritizedKey, priority, jobId)
        else
            addJobWithPriority(markerKey, prioritizedKey, priority, jobId,
                priorityCounter, isPausedOrMaxed)
        end
    end
end
if rcall("EXISTS", jobKey) == 1 then
    local metaKey = KEYS[3]
    local target, isPausedOrMaxed = getTargetQueueList(metaKey, KEYS[5], KEYS[1], KEYS[2])
    local prioritizedKey = KEYS[4]
    local priorityCounterKey = KEYS[6]
    local markerKey = KEYS[7]
    -- Re-add with the new priority
    if rcall("ZREM", prioritizedKey, jobId) > 0 then
        reAddJobWithNewPriority( prioritizedKey, markerKey, target,
            priorityCounterKey, ARGV[4] == '1', priority, jobId, isPausedOrMaxed)
    elseif rcall("LREM", target, -1, jobId) > 0 then
        reAddJobWithNewPriority( prioritizedKey, markerKey, target,
            priorityCounterKey, ARGV[4] == '1', priority, jobId, isPausedOrMaxed)
    end
    rcall("HSET", jobKey, "priority", priority)
    return 0
else
    return -1
end
`,keys:7};e.s(["changePriority",0,tT],21057),e.i(21057);let tD={name:"cleanJobsInSet",content:`--[[
  Remove jobs from the specific set.
  Input:
    KEYS[1]  set key,
    KEYS[2]  events stream key
    KEYS[3]  repeat key
    ARGV[1]  jobKey prefix
    ARGV[2]  timestamp
    ARGV[3]  limit the number of jobs to be removed. 0 is unlimited
    ARGV[4]  set name, can be any of 'wait', 'active', 'paused', 'delayed', 'completed', or 'failed'
]]
local rcall = redis.call
local repeatKey = KEYS[3]
local rangeStart = 0
local rangeEnd = -1
local limit = tonumber(ARGV[3])
-- If we're only deleting _n_ items, avoid retrieving all items
-- for faster performance
--
-- Start from the tail of the list, since that's where oldest elements
-- are generally added for FIFO lists
if limit > 0 then
  rangeStart = -1 - limit + 1
  rangeEnd = -1
end
-- Includes
--[[
  Function to clean job list.
  Returns jobIds and deleted count number.
]]
-- Includes
--[[
  Function to get the latest saved timestamp.
]]
local function getTimestamp(jobKey, attributes)
  if #attributes == 1 then
    return rcall("HGET", jobKey, attributes[1])
  end
  local jobTs
  for _, ts in ipairs(rcall("HMGET", jobKey, unpack(attributes))) do
    if (ts) then
      jobTs = ts
      break
    end
  end
  return jobTs
end
--[[
  Function to check if the job belongs to a job scheduler and
  current delayed job matches with jobId
]]
local function isJobSchedulerJob(jobId, jobKey, jobSchedulersKey)
  local repeatJobKey = rcall("HGET", jobKey, "rjk")
  if repeatJobKey  then
    local prevMillis = rcall("ZSCORE", jobSchedulersKey, repeatJobKey)
    if prevMillis then
      local currentDelayedJobId = "repeat:" .. repeatJobKey .. ":" .. prevMillis
      return jobId == currentDelayedJobId
    end
  end
  return false
end
--[[
  Function to remove job.
]]
-- Includes
--[[
  Function to remove deduplication key if needed
  when a job is being removed.
]]
local function removeDeduplicationKeyIfNeededOnRemoval(prefixKey,
  jobId, deduplicationId)
  if deduplicationId then
    local deduplicationKey = prefixKey .. "de:" .. deduplicationId
    local currentJobId = rcall('GET', deduplicationKey)
    if currentJobId and currentJobId == jobId then
      rcall("DEL", deduplicationKey)
      -- Also clean up any pending dedup-next data for this dedup ID
      rcall("DEL", prefixKey .. "dn:" .. deduplicationId)
      return 1
    end
  end
end
--[[
  Function to remove job keys.
]]
local function removeJobKeys(jobKey)
  return rcall("DEL", jobKey, jobKey .. ':logs', jobKey .. ':dependencies',
    jobKey .. ':processed', jobKey .. ':failed', jobKey .. ':unsuccessful')
end
--[[
  Check if this job has a parent. If so we will just remove it from
  the parent child list, but if it is the last child we should move the parent to "wait/paused"
  which requires code from "moveToFinished"
]]
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Functions to destructure job key.
  Just a bit of warning, these functions may be a bit slow and affect performance significantly.
]]
local getJobIdFromKey = function (jobKey)
  return string.match(jobKey, ".*:(.*)")
end
local getJobKeyPrefix = function (jobKey, jobId)
  return string.sub(jobKey, 0, #jobKey - #jobId)
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
local function _moveParentToWait(parentPrefix, parentId, emitEvent)
  local parentTarget, isPausedOrMaxed = getTargetQueueList(parentPrefix .. "meta", parentPrefix .. "active",
    parentPrefix .. "wait", parentPrefix .. "paused")
  addJobInTargetList(parentTarget, parentPrefix .. "marker", "RPUSH", isPausedOrMaxed, parentId)
  if emitEvent then
    local parentEventStream = parentPrefix .. "events"
    rcall("XADD", parentEventStream, "*", "event", "waiting", "jobId", parentId, "prev", "waiting-children")
  end
end
local function removeParentDependencyKey(jobKey, hard, parentKey, baseKey, debounceId)
  if parentKey then
    local parentDependenciesKey = parentKey .. ":dependencies"
    local result = rcall("SREM", parentDependenciesKey, jobKey)
    if result > 0 then
      local pendingDependencies = rcall("SCARD", parentDependenciesKey)
      if pendingDependencies == 0 then
        local parentId = getJobIdFromKey(parentKey)
        local parentPrefix = getJobKeyPrefix(parentKey, parentId)
        local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
        if numRemovedElements == 1 then
          if hard then -- remove parent in same queue
            if parentPrefix == baseKey then
              removeParentDependencyKey(parentKey, hard, nil, baseKey, nil)
              removeJobKeys(parentKey)
              if debounceId then
                rcall("DEL", parentPrefix .. "de:" .. debounceId)
              end
            else
              _moveParentToWait(parentPrefix, parentId)
            end
          else
            _moveParentToWait(parentPrefix, parentId, true)
          end
        end
      end
      return true
    end
  else
    local parentAttributes = rcall("HMGET", jobKey, "parentKey", "deid")
    local missedParentKey = parentAttributes[1]
    if( (type(missedParentKey) == "string") and missedParentKey ~= ""
      and (rcall("EXISTS", missedParentKey) == 1)) then
      local parentDependenciesKey = missedParentKey .. ":dependencies"
      local result = rcall("SREM", parentDependenciesKey, jobKey)
      if result > 0 then
        local pendingDependencies = rcall("SCARD", parentDependenciesKey)
        if pendingDependencies == 0 then
          local parentId = getJobIdFromKey(missedParentKey)
          local parentPrefix = getJobKeyPrefix(missedParentKey, parentId)
          local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
          if numRemovedElements == 1 then
            if hard then
              if parentPrefix == baseKey then
                removeParentDependencyKey(missedParentKey, hard, nil, baseKey, nil)
                removeJobKeys(missedParentKey)
                if parentAttributes[2] then
                  rcall("DEL", parentPrefix .. "de:" .. parentAttributes[2])
                end
              else
                _moveParentToWait(parentPrefix, parentId)
              end
            else
              _moveParentToWait(parentPrefix, parentId, true)
            end
          end
        end
        return true
      end
    end
  end
  return false
end
local function removeJob(jobId, hard, baseKey, shouldRemoveDeduplicationKey)
  local jobKey = baseKey .. jobId
  removeParentDependencyKey(jobKey, hard, nil, baseKey)
  if shouldRemoveDeduplicationKey then
    local deduplicationId = rcall("HGET", jobKey, "deid")
    removeDeduplicationKeyIfNeededOnRemoval(baseKey, jobId, deduplicationId)
  end
  removeJobKeys(jobKey)
end
local function cleanList(listKey, jobKeyPrefix, rangeStart, rangeEnd,
  timestamp, isWaiting, jobSchedulersKey)
  local jobs = rcall("LRANGE", listKey, rangeStart, rangeEnd)
  local deleted = {}
  local deletedCount = 0
  local jobTS
  local deletionMarker = ''
  local jobIdsLen = #jobs
  for i, job in ipairs(jobs) do
    if limit > 0 and deletedCount >= limit then
      break
    end
    local jobKey = jobKeyPrefix .. job
    if (isWaiting or rcall("EXISTS", jobKey .. ":lock") == 0) and
      not isJobSchedulerJob(job, jobKey, jobSchedulersKey) then
      -- Find the right timestamp of the job to compare to maxTimestamp:
      -- * finishedOn says when the job was completed, but it isn't set unless the job has actually completed
      -- * processedOn represents when the job was last attempted, but it doesn't get populated until
      --   the job is first tried
      -- * timestamp is the original job submission time
      -- Fetch all three of these (in that order) and use the first one that is set so that we'll leave jobs
      -- that have been active within the grace period:
      jobTS = getTimestamp(jobKey, {"finishedOn", "processedOn", "timestamp"})
      if (not jobTS or jobTS <= timestamp) then
        -- replace the entry with a deletion marker; the actual deletion will
        -- occur at the end of the script
        rcall("LSET", listKey, rangeEnd - jobIdsLen + i, deletionMarker)
        removeJob(job, true, jobKeyPrefix, true --[[remove debounce key]])
        deletedCount = deletedCount + 1
        table.insert(deleted, job)
      end
    end
  end
  rcall("LREM", listKey, 0, deletionMarker)
  return {deleted, deletedCount}
end
--[[
  Function to clean job set.
  Returns jobIds and deleted count number.
]] 
-- Includes
--[[
  Function to loop in batches.
  Just a bit of warning, some commands as ZREM
  could receive a maximum of 7000 parameters per call.
]]
local function batches(n, batchSize)
  local i = 0
  return function()
    local from = i * batchSize + 1
    i = i + 1
    if (from <= n) then
      local to = math.min(from + batchSize - 1, n)
      return from, to
    end
  end
end
--[[
  We use ZRANGEBYSCORE to make the case where we're deleting a limited number
  of items in a sorted set only run a single iteration. If we simply used
  ZRANGE, we may take a long time traversing through jobs that are within the
  grace period.
]]
local function getJobsInZset(zsetKey, rangeEnd, limit)
  if limit > 0 then
    return rcall("ZRANGEBYSCORE", zsetKey, 0, rangeEnd, "LIMIT", 0, limit)
  else
    return rcall("ZRANGEBYSCORE", zsetKey, 0, rangeEnd)
  end
end
local function cleanSet(
    setKey,
    jobKeyPrefix,
    rangeEnd,
    timestamp,
    limit,
    attributes,
    isFinished,
    jobSchedulersKey)
    local jobs = getJobsInZset(setKey, rangeEnd, limit)
    local deleted = {}
    local deletedCount = 0
    local jobTS
    for i, job in ipairs(jobs) do
        if limit > 0 and deletedCount >= limit then
            break
        end
        local jobKey = jobKeyPrefix .. job
        -- Extract a Job Scheduler Id from jobId ("repeat:job-scheduler-id:millis") 
        -- and check if it is in the scheduled jobs
        if not (jobSchedulersKey and isJobSchedulerJob(job, jobKey, jobSchedulersKey)) then
            if isFinished then
                removeJob(job, true, jobKeyPrefix, true --[[remove debounce key]] )
                deletedCount = deletedCount + 1
                table.insert(deleted, job)
            else
                -- * finishedOn says when the job was completed, but it isn't set unless the job has actually completed
                jobTS = getTimestamp(jobKey, attributes)
                if (not jobTS or jobTS <= timestamp) then
                    removeJob(job, true, jobKeyPrefix, true --[[remove debounce key]] )
                    deletedCount = deletedCount + 1
                    table.insert(deleted, job)
                end
            end
        end
    end
    if (#deleted > 0) then
        for from, to in batches(#deleted, 7000) do
            rcall("ZREM", setKey, unpack(deleted, from, to))
        end
    end
    return {deleted, deletedCount}
end
local result
if ARGV[4] == "active" then
  result = cleanList(KEYS[1], ARGV[1], rangeStart, rangeEnd, ARGV[2], false --[[ hasFinished ]],
                      repeatKey)
elseif ARGV[4] == "delayed" then
  rangeEnd = "+inf"
  result = cleanSet(KEYS[1], ARGV[1], rangeEnd, ARGV[2], limit,
                    {"processedOn", "timestamp"}, false  --[[ hasFinished ]], repeatKey)
elseif ARGV[4] == "prioritized" then
  rangeEnd = "+inf"
  result = cleanSet(KEYS[1], ARGV[1], rangeEnd, ARGV[2], limit,
                    {"timestamp"}, false  --[[ hasFinished ]], repeatKey)
elseif ARGV[4] == "wait" or ARGV[4] == "paused" then
  result = cleanList(KEYS[1], ARGV[1], rangeStart, rangeEnd, ARGV[2], true --[[ hasFinished ]],
                      repeatKey)
else
  rangeEnd = ARGV[2]
  -- No need to pass repeat key as in that moment job won't be related to a job scheduler
  result = cleanSet(KEYS[1], ARGV[1], rangeEnd, ARGV[2], limit,
                    {"finishedOn"}, true  --[[ hasFinished ]])
end
rcall("XADD", KEYS[2], "*", "event", "cleaned", "count", result[2])
return result[1]
`,keys:3};e.s(["cleanJobsInSet",0,tD],41381),e.i(41381);let tC={name:"drain",content:`--[[
  Drains the queue, removes all jobs that are waiting
  or delayed, but not active, completed or failed
  Input:
    KEYS[1] 'wait',
    KEYS[2] 'paused'
    KEYS[3] 'delayed'
    KEYS[4] 'prioritized'
    KEYS[5] 'jobschedulers' (repeat)
    ARGV[1]  queue key prefix
    ARGV[2]  should clean delayed jobs
]]
local rcall = redis.call
local queueBaseKey = ARGV[1]
--[[
  Functions to remove jobs.
]]
-- Includes
--[[
  Function to filter out jobs to ignore from a table.
]]
local function filterOutJobsToIgnore(jobs, jobsToIgnore)
  local filteredJobs = {}
  for i = 1, #jobs do
    if not jobsToIgnore[jobs[i]] then
      table.insert(filteredJobs, jobs[i])
    end
  end
  return filteredJobs
end
--[[
  Functions to remove jobs.
]]
-- Includes
--[[
  Function to remove job.
]]
-- Includes
--[[
  Function to remove deduplication key if needed
  when a job is being removed.
]]
local function removeDeduplicationKeyIfNeededOnRemoval(prefixKey,
  jobId, deduplicationId)
  if deduplicationId then
    local deduplicationKey = prefixKey .. "de:" .. deduplicationId
    local currentJobId = rcall('GET', deduplicationKey)
    if currentJobId and currentJobId == jobId then
      rcall("DEL", deduplicationKey)
      -- Also clean up any pending dedup-next data for this dedup ID
      rcall("DEL", prefixKey .. "dn:" .. deduplicationId)
      return 1
    end
  end
end
--[[
  Function to remove job keys.
]]
local function removeJobKeys(jobKey)
  return rcall("DEL", jobKey, jobKey .. ':logs', jobKey .. ':dependencies',
    jobKey .. ':processed', jobKey .. ':failed', jobKey .. ':unsuccessful')
end
--[[
  Check if this job has a parent. If so we will just remove it from
  the parent child list, but if it is the last child we should move the parent to "wait/paused"
  which requires code from "moveToFinished"
]]
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Functions to destructure job key.
  Just a bit of warning, these functions may be a bit slow and affect performance significantly.
]]
local getJobIdFromKey = function (jobKey)
  return string.match(jobKey, ".*:(.*)")
end
local getJobKeyPrefix = function (jobKey, jobId)
  return string.sub(jobKey, 0, #jobKey - #jobId)
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
local function _moveParentToWait(parentPrefix, parentId, emitEvent)
  local parentTarget, isPausedOrMaxed = getTargetQueueList(parentPrefix .. "meta", parentPrefix .. "active",
    parentPrefix .. "wait", parentPrefix .. "paused")
  addJobInTargetList(parentTarget, parentPrefix .. "marker", "RPUSH", isPausedOrMaxed, parentId)
  if emitEvent then
    local parentEventStream = parentPrefix .. "events"
    rcall("XADD", parentEventStream, "*", "event", "waiting", "jobId", parentId, "prev", "waiting-children")
  end
end
local function removeParentDependencyKey(jobKey, hard, parentKey, baseKey, debounceId)
  if parentKey then
    local parentDependenciesKey = parentKey .. ":dependencies"
    local result = rcall("SREM", parentDependenciesKey, jobKey)
    if result > 0 then
      local pendingDependencies = rcall("SCARD", parentDependenciesKey)
      if pendingDependencies == 0 then
        local parentId = getJobIdFromKey(parentKey)
        local parentPrefix = getJobKeyPrefix(parentKey, parentId)
        local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
        if numRemovedElements == 1 then
          if hard then -- remove parent in same queue
            if parentPrefix == baseKey then
              removeParentDependencyKey(parentKey, hard, nil, baseKey, nil)
              removeJobKeys(parentKey)
              if debounceId then
                rcall("DEL", parentPrefix .. "de:" .. debounceId)
              end
            else
              _moveParentToWait(parentPrefix, parentId)
            end
          else
            _moveParentToWait(parentPrefix, parentId, true)
          end
        end
      end
      return true
    end
  else
    local parentAttributes = rcall("HMGET", jobKey, "parentKey", "deid")
    local missedParentKey = parentAttributes[1]
    if( (type(missedParentKey) == "string") and missedParentKey ~= ""
      and (rcall("EXISTS", missedParentKey) == 1)) then
      local parentDependenciesKey = missedParentKey .. ":dependencies"
      local result = rcall("SREM", parentDependenciesKey, jobKey)
      if result > 0 then
        local pendingDependencies = rcall("SCARD", parentDependenciesKey)
        if pendingDependencies == 0 then
          local parentId = getJobIdFromKey(missedParentKey)
          local parentPrefix = getJobKeyPrefix(missedParentKey, parentId)
          local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
          if numRemovedElements == 1 then
            if hard then
              if parentPrefix == baseKey then
                removeParentDependencyKey(missedParentKey, hard, nil, baseKey, nil)
                removeJobKeys(missedParentKey)
                if parentAttributes[2] then
                  rcall("DEL", parentPrefix .. "de:" .. parentAttributes[2])
                end
              else
                _moveParentToWait(parentPrefix, parentId)
              end
            else
              _moveParentToWait(parentPrefix, parentId, true)
            end
          end
        end
        return true
      end
    end
  end
  return false
end
local function removeJob(jobId, hard, baseKey, shouldRemoveDeduplicationKey)
  local jobKey = baseKey .. jobId
  removeParentDependencyKey(jobKey, hard, nil, baseKey)
  if shouldRemoveDeduplicationKey then
    local deduplicationId = rcall("HGET", jobKey, "deid")
    removeDeduplicationKeyIfNeededOnRemoval(baseKey, jobId, deduplicationId)
  end
  removeJobKeys(jobKey)
end
local function removeJobs(keys, hard, baseKey, max)
  for i, key in ipairs(keys) do
    removeJob(key, hard, baseKey, true --[[remove debounce key]])
  end
  return max - #keys
end
local function getListItems(keyName, max)
  return rcall('LRANGE', keyName, 0, max - 1)
end
local function removeListJobs(keyName, hard, baseKey, max, jobsToIgnore)
  local jobs = getListItems(keyName, max)
  if jobsToIgnore then
    jobs = filterOutJobsToIgnore(jobs, jobsToIgnore)
  end
  local count = removeJobs(jobs, hard, baseKey, max)
  rcall("LTRIM", keyName, #jobs, -1)
  return count
end
-- Includes
--[[
  Function to loop in batches.
  Just a bit of warning, some commands as ZREM
  could receive a maximum of 7000 parameters per call.
]]
local function batches(n, batchSize)
  local i = 0
  return function()
    local from = i * batchSize + 1
    i = i + 1
    if (from <= n) then
      local to = math.min(from + batchSize - 1, n)
      return from, to
    end
  end
end
--[[
  Function to get ZSet items.
]]
local function getZSetItems(keyName, max)
  return rcall('ZRANGE', keyName, 0, max - 1)
end
local function removeZSetJobs(keyName, hard, baseKey, max, jobsToIgnore)
  local jobs = getZSetItems(keyName, max)
  if jobsToIgnore then
    jobs = filterOutJobsToIgnore(jobs, jobsToIgnore)
  end
  local count = removeJobs(jobs, hard, baseKey, max)
  if(#jobs > 0) then
    for from, to in batches(#jobs, 7000) do
      rcall("ZREM", keyName, unpack(jobs, from, to))
    end
  end
  return count
end
-- We must not remove delayed jobs if they are associated to a job scheduler.
local scheduledJobs = {}
local jobSchedulers = rcall("ZRANGE", KEYS[5], 0, -1, "WITHSCORES")
-- For every job scheduler, get the current delayed job id.
for i = 1, #jobSchedulers, 2 do
    local jobSchedulerId = jobSchedulers[i]
    local jobSchedulerMillis = jobSchedulers[i + 1]
    local delayedJobId = "repeat:" .. jobSchedulerId .. ":" .. jobSchedulerMillis
    scheduledJobs[delayedJobId] = true
end
removeListJobs(KEYS[1], true, queueBaseKey, 0, scheduledJobs) -- wait
removeListJobs(KEYS[2], true, queueBaseKey, 0, scheduledJobs) -- paused
if ARGV[2] == "1" then
  removeZSetJobs(KEYS[3], true, queueBaseKey, 0, scheduledJobs) -- delayed
end
removeZSetJobs(KEYS[4], true, queueBaseKey, 0, scheduledJobs) -- prioritized
`,keys:5};e.s(["drain",0,tC],46888),e.i(46888);let tO={name:"extendLock",content:`--[[
  Extend lock and removes the job from the stalled set.
  Input:
    KEYS[1] 'lock',
    KEYS[2] 'stalled'
    ARGV[1]  token
    ARGV[2]  lock duration in milliseconds
    ARGV[3]  jobid
  Output:
    "1" if lock extended successfully.
]]
local rcall = redis.call
if rcall("GET", KEYS[1]) == ARGV[1] then
  --   if rcall("SET", KEYS[1], ARGV[1], "PX", ARGV[2], "XX") then
  if rcall("SET", KEYS[1], ARGV[1], "PX", ARGV[2]) then
    rcall("SREM", KEYS[2], ARGV[3])
    return 1
  end
end
return 0
`,keys:2};e.s(["extendLock",0,tO],56111),e.i(56111);let tR={name:"extendLocks",content:`--[[
  Extend locks for multiple jobs and remove them from the stalled set if successful.
  Return the list of job IDs for which the operation failed.
  KEYS[1] = stalled key
  ARGV[1] = baseKey
  ARGV[2] = tokens
  ARGV[3] = jobIds
  ARGV[4] = lockDuration (ms)
  Output:
    An array of failed job IDs. If empty, all succeeded.
]]
local rcall = redis.call
local stalledKey = KEYS[1]
local baseKey = ARGV[1]
local tokens = cmsgpack.unpack(ARGV[2])
local jobIds = cmsgpack.unpack(ARGV[3])
local lockDuration = ARGV[4]
local jobCount = #jobIds
local failedJobs = {}
for i = 1, jobCount, 1 do
    local lockKey = baseKey .. jobIds[i] .. ':lock'
    local jobId = jobIds[i]
    local token = tokens[i]
    local currentToken = rcall("GET", lockKey)
    if currentToken then
        if currentToken == token then
            local setResult = rcall("SET", lockKey, token, "PX", lockDuration)
            if setResult then
                rcall("SREM", stalledKey, jobId)
            else
                table.insert(failedJobs, jobId)
            end
        else
            table.insert(failedJobs, jobId)
        end
    else
        table.insert(failedJobs, jobId)
    end
end
return failedJobs
`,keys:1};e.s(["extendLocks",0,tR],46003),e.i(46003);let tM={name:"getCounts",content:`--[[
  Get counts per provided states
    Input:
      KEYS[1]    'prefix'
      ARGV[1...] types
]]
local rcall = redis.call;
local prefix = KEYS[1]
local results = {}
for i = 1, #ARGV do
  local stateKey = prefix .. ARGV[i]
  if ARGV[i] == "wait" or ARGV[i] == "paused" then
    -- Markers in waitlist DEPRECATED in v5: Remove in v6.
    local marker = rcall("LINDEX", stateKey, -1)
    if marker and string.sub(marker, 1, 2) == "0:" then
      local count = rcall("LLEN", stateKey)
      if count > 1 then
        rcall("RPOP", stateKey)
        results[#results+1] = count-1
      else
        results[#results+1] = 0
      end
    else
      results[#results+1] = rcall("LLEN", stateKey)
    end
  elseif ARGV[i] == "active" then
    results[#results+1] = rcall("LLEN", stateKey)
  else
    results[#results+1] = rcall("ZCARD", stateKey)
  end
end
return results
`,keys:1};e.s(["getCounts",0,tM],19884),e.i(19884);let tP={name:"getCountsPerPriority",content:`--[[
  Get counts per provided states
    Input:
      KEYS[1] wait key
      KEYS[2] paused key
      KEYS[3] meta key
      KEYS[4] prioritized key
      ARGV[1...] priorities
]]
local rcall = redis.call
local results = {}
local waitKey = KEYS[1]
local pausedKey = KEYS[2]
local prioritizedKey = KEYS[4]
-- Includes
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function isQueuePaused(queueMetaKey)
  return rcall("HEXISTS", queueMetaKey, "paused") == 1
end
for i = 1, #ARGV do
  local priority = tonumber(ARGV[i])
  if priority == 0 then
    if isQueuePaused(KEYS[3]) then
      results[#results+1] = rcall("LLEN", pausedKey)
    else
      results[#results+1] = rcall("LLEN", waitKey)
    end
  else
    results[#results+1] = rcall("ZCOUNT", prioritizedKey,
      priority * 0x100000000, (priority + 1)  * 0x100000000 - 1)
  end
end
return results
`,keys:4};e.s(["getCountsPerPriority",0,tP],65535),e.i(65535);let tN={name:"getDependencyCounts",content:`--[[
  Get counts per child states
    Input:
      KEYS[1]    processed key
      KEYS[2]    unprocessed key
      KEYS[3]    ignored key
      KEYS[4]    failed key
      ARGV[1...] types
]]
local rcall = redis.call;
local processedKey = KEYS[1]
local unprocessedKey = KEYS[2]
local ignoredKey = KEYS[3]
local failedKey = KEYS[4]
local results = {}
for i = 1, #ARGV do
  if ARGV[i] == "processed" then
    results[#results+1] = rcall("HLEN", processedKey)
  elseif ARGV[i] == "unprocessed" then
    results[#results+1] = rcall("SCARD", unprocessedKey)
  elseif ARGV[i] == "ignored" then
    results[#results+1] = rcall("HLEN", ignoredKey)
  else
    results[#results+1] = rcall("ZCARD", failedKey)
  end
end
return results
`,keys:4};e.s(["getDependencyCounts",0,tN],64623),e.i(64623);let tJ={name:"getJobScheduler",content:`--[[
  Get job scheduler record.
  Input:
    KEYS[1] 'repeat' key
    ARGV[1] id
]]
local rcall = redis.call
local jobSchedulerKey = KEYS[1] .. ":" .. ARGV[1]
local score = rcall("ZSCORE", KEYS[1], ARGV[1])
if score then
  return {rcall("HGETALL", jobSchedulerKey), score} -- get job data
end
return {nil, nil}
`,keys:1};e.s(["getJobScheduler",0,tJ],33429),e.i(33429);let tL={name:"getMetrics",content:`--[[
  Get metrics
  Input:
    KEYS[1] 'metrics' key
    KEYS[2] 'metrics data' key
    ARGV[1] start index
    ARGV[2] end index
]]
local rcall = redis.call;
local metricsKey = KEYS[1]
local dataKey = KEYS[2]
local metrics = rcall("HMGET", metricsKey, "count", "prevTS", "prevCount")
local data = rcall("LRANGE", dataKey, tonumber(ARGV[1]), tonumber(ARGV[2]))
local numPoints = rcall("LLEN", dataKey)
return {metrics, data, numPoints}
`,keys:2};e.s(["getMetrics",0,tL],36069),e.i(36069);let t_={name:"getRanges",content:`--[[
  Get job ids per provided states
    Input:
      KEYS[1]    'prefix'
      ARGV[1]    start
      ARGV[2]    end
      ARGV[3]    asc
      ARGV[4...] types
]]
local rcall = redis.call
local prefix = KEYS[1]
local rangeStart = tonumber(ARGV[1])
local rangeEnd = tonumber(ARGV[2])
local asc = ARGV[3]
local results = {}
local function getRangeInList(listKey, asc, rangeStart, rangeEnd, results)
  if asc == "1" then
    local modifiedRangeStart
    local modifiedRangeEnd
    if rangeStart == -1 then
      modifiedRangeStart = 0
    else
      modifiedRangeStart = -(rangeStart + 1)
    end
    if rangeEnd == -1 then
      modifiedRangeEnd = 0
    else
      modifiedRangeEnd = -(rangeEnd + 1)
    end
    results[#results+1] = rcall("LRANGE", listKey,
      modifiedRangeEnd,
      modifiedRangeStart)
  else
    results[#results+1] = rcall("LRANGE", listKey, rangeStart, rangeEnd)
  end
end
for i = 4, #ARGV do
  local stateKey = prefix .. ARGV[i]
  if ARGV[i] == "wait" or ARGV[i] == "paused" then
    -- Markers in waitlist DEPRECATED in v5: Remove in v6.
    local marker = rcall("LINDEX", stateKey, -1)
    if marker and string.sub(marker, 1, 2) == "0:" then
      local count = rcall("LLEN", stateKey)
      if count > 1 then
        rcall("RPOP", stateKey)
        getRangeInList(stateKey, asc, rangeStart, rangeEnd, results)
      else
        results[#results+1] = {}
      end
    else
      getRangeInList(stateKey, asc, rangeStart, rangeEnd, results)
    end
  elseif ARGV[i] == "active" then
    getRangeInList(stateKey, asc, rangeStart, rangeEnd, results)
  else
    if asc == "1" then
      results[#results+1] = rcall("ZRANGE", stateKey, rangeStart, rangeEnd)
    else
      results[#results+1] = rcall("ZREVRANGE", stateKey, rangeStart, rangeEnd)
    end
  end
end
return results
`,keys:1};e.s(["getRanges",0,t_],40615),e.i(40615);let tF={name:"getRateLimitTtl",content:`--[[
  Get rate limit ttl
    Input:
      KEYS[1] 'limiter'
      KEYS[2] 'meta'
      ARGV[1] maxJobs
]]
local rcall = redis.call
-- Includes
--[[
  Function to get current rate limit ttl.
]]
local function getRateLimitTTL(maxJobs, rateLimiterKey)
  if maxJobs and maxJobs <= tonumber(rcall("GET", rateLimiterKey) or 0) then
    local pttl = rcall("PTTL", rateLimiterKey)
    if pttl == 0 then
      rcall("DEL", rateLimiterKey)
    end
    if pttl > 0 then
      return pttl
    end
  end
  return 0
end
local rateLimiterKey = KEYS[1]
if ARGV[1] ~= "0" then
  return getRateLimitTTL(tonumber(ARGV[1]), rateLimiterKey)
else
  local rateLimitMax = rcall("HGET", KEYS[2], "max")
  if rateLimitMax then
    return getRateLimitTTL(tonumber(rateLimitMax), rateLimiterKey)
  end
  return rcall("PTTL", rateLimiterKey)
end
`,keys:2};e.s(["getRateLimitTtl",0,tF],95884),e.i(95884);let tq={name:"getState",content:`--[[
  Get a job state
  Input: 
    KEYS[1] 'completed' key,
    KEYS[2] 'failed' key
    KEYS[3] 'delayed' key
    KEYS[4] 'active' key
    KEYS[5] 'wait' key
    KEYS[6] 'paused' key
    KEYS[7] 'waiting-children' key
    KEYS[8] 'prioritized' key
    ARGV[1] job id
  Output:
    'completed'
    'failed'
    'delayed'
    'active'
    'prioritized'
    'waiting'
    'waiting-children'
    'unknown'
]]
local rcall = redis.call
if rcall("ZSCORE", KEYS[1], ARGV[1]) then
  return "completed"
end
if rcall("ZSCORE", KEYS[2], ARGV[1]) then
  return "failed"
end
if rcall("ZSCORE", KEYS[3], ARGV[1]) then
  return "delayed"
end
if rcall("ZSCORE", KEYS[8], ARGV[1]) then
  return "prioritized"
end
-- Includes
--[[
  Function to check if an item belongs to a list.
]]
local function checkItemInList(list, item)
  for _, v in pairs(list) do
    if v == item then
      return 1
    end
  end
  return nil
end
local active_items = rcall("LRANGE", KEYS[4] , 0, -1)
if checkItemInList(active_items, ARGV[1]) ~= nil then
  return "active"
end
local wait_items = rcall("LRANGE", KEYS[5] , 0, -1)
if checkItemInList(wait_items, ARGV[1]) ~= nil then
  return "waiting"
end
local paused_items = rcall("LRANGE", KEYS[6] , 0, -1)
if checkItemInList(paused_items, ARGV[1]) ~= nil then
  return "waiting"
end
if rcall("ZSCORE", KEYS[7], ARGV[1]) then
  return "waiting-children"
end
return "unknown"
`,keys:8};e.s(["getState",0,tq],61570),e.i(61570);let tG={name:"getStateV2",content:`--[[
  Get a job state
  Input: 
    KEYS[1] 'completed' key,
    KEYS[2] 'failed' key
    KEYS[3] 'delayed' key
    KEYS[4] 'active' key
    KEYS[5] 'wait' key
    KEYS[6] 'paused' key
    KEYS[7] 'waiting-children' key
    KEYS[8] 'prioritized' key
    ARGV[1] job id
  Output:
    'completed'
    'failed'
    'delayed'
    'active'
    'waiting'
    'waiting-children'
    'unknown'
]]
local rcall = redis.call
if rcall("ZSCORE", KEYS[1], ARGV[1]) then
  return "completed"
end
if rcall("ZSCORE", KEYS[2], ARGV[1]) then
  return "failed"
end
if rcall("ZSCORE", KEYS[3], ARGV[1]) then
  return "delayed"
end
if rcall("ZSCORE", KEYS[8], ARGV[1]) then
  return "prioritized"
end
if rcall("LPOS", KEYS[4] , ARGV[1]) then
  return "active"
end
if rcall("LPOS", KEYS[5] , ARGV[1]) then
  return "waiting"
end
if rcall("LPOS", KEYS[6] , ARGV[1]) then
  return "waiting"
end
if rcall("ZSCORE", KEYS[7] , ARGV[1]) then
  return "waiting-children"
end
return "unknown"
`,keys:8};e.s(["getStateV2",0,tG],6789),e.i(6789);let tV={name:"isFinished",content:`--[[
  Checks if a job is finished (.i.e. is in the completed or failed set)
  Input: 
    KEYS[1] completed key
    KEYS[2] failed key
    KEYS[3] job key
    ARGV[1] job id
    ARGV[2] return value?
  Output:
    0 - Not finished.
    1 - Completed.
    2 - Failed.
   -1 - Missing job. 
]]
local rcall = redis.call
if rcall("EXISTS", KEYS[3]) ~= 1 then
  if ARGV[2] == "1" then
    return {-1,"Missing key for job " .. KEYS[3] .. ". isFinished"}
  end  
  return -1
end
if rcall("ZSCORE", KEYS[1], ARGV[1]) then
  if ARGV[2] == "1" then
    local returnValue = rcall("HGET", KEYS[3], "returnvalue")
    return {1,returnValue}
  end
  return 1
end
if rcall("ZSCORE", KEYS[2], ARGV[1]) then
  if ARGV[2] == "1" then
    local failedReason = rcall("HGET", KEYS[3], "failedReason")
    return {2,failedReason}
  end
  return 2
end
if ARGV[2] == "1" then
  return {0}
end
return 0
`,keys:3};e.s(["isFinished",0,tV],71707),e.i(71707);let tY={name:"isJobInList",content:`--[[
  Checks if job is in a given list.
  Input:
    KEYS[1]
    ARGV[1]
  Output:
    1 if element found in the list.
]]
-- Includes
--[[
  Function to check if an item belongs to a list.
]]
local function checkItemInList(list, item)
  for _, v in pairs(list) do
    if v == item then
      return 1
    end
  end
  return nil
end
local items = redis.call("LRANGE", KEYS[1] , 0, -1)
return checkItemInList(items, ARGV[1])
`,keys:1};e.s(["isJobInList",0,tY],68134),e.i(68134);let tB={name:"isMaxed",content:`--[[
  Checks if queue is maxed.
  Input:
    KEYS[1] meta key
    KEYS[2] active key
  Output:
    1 if element found in the list.
]]
local rcall = redis.call
-- Includes
--[[
  Function to check if queue is maxed or not.
]]
local function isQueueMaxed(queueMetaKey, activeKey)
  local maxConcurrency = rcall("HGET", queueMetaKey, "concurrency")
  if maxConcurrency then
    local activeCount = rcall("LLEN", activeKey)
    if activeCount >= tonumber(maxConcurrency) then
      return true
    end
  end
  return false
end
return isQueueMaxed(KEYS[1], KEYS[2])
`,keys:2};e.s(["isMaxed",0,tB],79499),e.i(79499);let tz={name:"moveJobFromActiveToWait",content:`--[[
  Function to move job from active state to wait.
  Input:
    KEYS[1]  active key
    KEYS[2]  wait key
    KEYS[3]  stalled key
    KEYS[4]  paused key
    KEYS[5]  meta key
    KEYS[6]  limiter key
    KEYS[7]  prioritized key
    KEYS[8]  marker key
    KEYS[9]  event key
    ARGV[1] job id
    ARGV[2] lock token
    ARGV[3] job id key
]]
local rcall = redis.call
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to push back job considering priority in front of same prioritized jobs.
]]
local function pushBackJobWithPriority(prioritizedKey, priority, jobId)
  -- in order to put it at front of same prioritized jobs
  -- we consider prioritized counter as 0
  local score = priority * 0x100000000
  rcall("ZADD", prioritizedKey, score, jobId)
end
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
local function removeLock(jobKey, stalledKey, token, jobId)
  if token ~= "0" then
    local lockKey = jobKey .. ':lock'
    local lockToken = rcall("GET", lockKey)
    if lockToken == token then
      rcall("DEL", lockKey)
      rcall("SREM", stalledKey, jobId)
    else
      if lockToken then
        -- Lock exists but token does not match
        return -6
      else
        -- Lock is missing completely
        return -2
      end
    end
  end
  return 0
end
local jobId = ARGV[1]
local token = ARGV[2]
local jobKey = ARGV[3]
if rcall("EXISTS", jobKey) == 0 then
  return -1
end
local errorCode = removeLock(jobKey, KEYS[3], token, jobId)
if errorCode < 0 then
  return errorCode
end
local metaKey = KEYS[5]
local removed = rcall("LREM", KEYS[1], 1, jobId)
if removed > 0 then
  local target, isPausedOrMaxed = getTargetQueueList(metaKey, KEYS[1], KEYS[2], KEYS[4])
  local priority = tonumber(rcall("HGET", ARGV[3], "priority")) or 0
  if priority > 0 then
    pushBackJobWithPriority(KEYS[7], priority, jobId)
  else
    addJobInTargetList(target, KEYS[8], "RPUSH", isPausedOrMaxed, jobId)
  end
  local maxEvents = getOrSetMaxEvents(metaKey)
  -- Emit waiting event
  rcall("XADD", KEYS[9], "MAXLEN", "~", maxEvents, "*", "event", "waiting",
    "jobId", jobId, "prev", "active")
end
local pttl = rcall("PTTL", KEYS[6])
if pttl > 0 then
  return pttl
else
  return 0
end
`,keys:9};e.s(["moveJobFromActiveToWait",0,tz],91017),e.i(91017);let tU={name:"moveJobsToWait",content:`--[[
  Move completed, failed or delayed jobs to wait.
  Note: Does not support jobs with priorities.
  Input:
    KEYS[1] base key
    KEYS[2] events stream
    KEYS[3] state key (failed, completed, delayed)
    KEYS[4] 'wait'
    KEYS[5] 'paused'
    KEYS[6] 'meta'
    KEYS[7] 'active'
    KEYS[8] 'marker'
    ARGV[1] count
    ARGV[2] timestamp
    ARGV[3] prev state
  Output:
    1  means the operation is not completed
    0  means the operation is completed
]]
local maxCount = tonumber(ARGV[1])
local timestamp = tonumber(ARGV[2])
local rcall = redis.call;
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
--[[
  Function to loop in batches.
  Just a bit of warning, some commands as ZREM
  could receive a maximum of 7000 parameters per call.
]]
local function batches(n, batchSize)
  local i = 0
  return function()
    local from = i * batchSize + 1
    i = i + 1
    if (from <= n) then
      local to = math.min(from + batchSize - 1, n)
      return from, to
    end
  end
end
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
local metaKey = KEYS[6]
local target, isPausedOrMaxed = getTargetQueueList(metaKey, KEYS[7], KEYS[4], KEYS[5])
local jobs = rcall('ZRANGEBYSCORE', KEYS[3], 0, timestamp, 'LIMIT', 0, maxCount)
if (#jobs > 0) then
    if ARGV[3] == "failed" then
        for i, key in ipairs(jobs) do
            local jobKey = KEYS[1] .. key
            rcall("HDEL", jobKey, "finishedOn", "processedOn", "failedReason")
        end
    elseif ARGV[3] == "completed" then
        for i, key in ipairs(jobs) do
            local jobKey = KEYS[1] .. key
            rcall("HDEL", jobKey, "finishedOn", "processedOn", "returnvalue")
        end
    end
    local maxEvents = getOrSetMaxEvents(metaKey)
    for i, key in ipairs(jobs) do
        -- Emit waiting event
        rcall("XADD", KEYS[2], "MAXLEN", "~", maxEvents, "*", "event",
              "waiting", "jobId", key, "prev", ARGV[3]);
    end
    for from, to in batches(#jobs, 7000) do
        rcall("ZREM", KEYS[3], unpack(jobs, from, to))
        rcall("LPUSH", target, unpack(jobs, from, to))
    end
    addBaseMarkerIfNeeded(KEYS[8], isPausedOrMaxed)
end
maxCount = maxCount - #jobs
if (maxCount <= 0) then return 1 end
return 0
`,keys:8};e.s(["moveJobsToWait",0,tU],73652),e.i(73652);let tW={name:"moveStalledJobsToWait",content:`--[[
  Move stalled jobs to wait.
    Input:
      KEYS[1] 'stalled' (SET)
      KEYS[2] 'wait',   (LIST)
      KEYS[3] 'active', (LIST)
      KEYS[4] 'stalled-check', (KEY)
      KEYS[5] 'meta', (KEY)
      KEYS[6] 'paused', (LIST)
      KEYS[7] 'marker'
      KEYS[8] 'event stream' (STREAM)
      KEYS[9] 'repeat' key
      ARGV[1]  Max stalled job count
      ARGV[2]  queue.toKey('')
      ARGV[3]  timestamp
      ARGV[4]  max check time
    Events:
      'stalled' with stalled job id.
]]
local rcall = redis.call
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to loop in batches.
  Just a bit of warning, some commands as ZREM
  could receive a maximum of 7000 parameters per call.
]]
local function batches(n, batchSize)
  local i = 0
  return function()
    local from = i * batchSize + 1
    i = i + 1
    if (from <= n) then
      local to = math.min(from + batchSize - 1, n)
      return from, to
    end
  end
end
--[[
  Function to move job to wait to be picked up by a waiting worker.
]]
-- Includes
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
local function moveJobToWait(metaKey, activeKey, waitKey, pausedKey, markerKey, eventStreamKey,
  jobId, pushCmd)
  local target, isPausedOrMaxed = getTargetQueueList(metaKey, activeKey, waitKey, pausedKey)
  addJobInTargetList(target, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall("XADD", eventStreamKey, "*", "event", "waiting", "jobId", jobId, 'prev', 'active')
end
--[[
  Function to trim events, default 10000.
]]
-- Includes
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
local function trimEvents(metaKey, eventStreamKey)
  local maxEvents = getOrSetMaxEvents(metaKey)
  if maxEvents then
    rcall("XTRIM", eventStreamKey, "MAXLEN", "~", maxEvents)
  else
    rcall("XTRIM", eventStreamKey, "MAXLEN", "~", 10000)
  end
end
local stalledKey = KEYS[1]
local waitKey = KEYS[2]
local activeKey = KEYS[3]
local stalledCheckKey = KEYS[4]
local metaKey = KEYS[5]
local pausedKey = KEYS[6]
local markerKey = KEYS[7]
local eventStreamKey = KEYS[8]
local repeatKey = KEYS[9]
local maxStalledJobCount = tonumber(ARGV[1])
local queueKeyPrefix = ARGV[2]
local timestamp = ARGV[3]
local maxCheckTime = ARGV[4]
if rcall("EXISTS", stalledCheckKey) == 1 then
    return {}
end
rcall("SET", stalledCheckKey, timestamp, "PX", maxCheckTime)
-- Trim events before emitting them to avoid trimming events emitted in this script
trimEvents(metaKey, eventStreamKey)
-- Move all stalled jobs to wait
local stalling = rcall('SMEMBERS', stalledKey)
local stalled = {}
if (#stalling > 0) then
    rcall('DEL', stalledKey)
    -- Remove from active list
    for i, jobId in ipairs(stalling) do
        -- Markers in waitlist DEPRECATED in v5: Remove in v6.
        if string.sub(jobId, 1, 2) == "0:" then
            -- If the jobId is a delay marker ID we just remove it.
            rcall("LREM", activeKey, 1, jobId)
        else
            local jobKey = queueKeyPrefix .. jobId
            -- Check that the lock is also missing, then we can handle this job as really stalled.
            if (rcall("EXISTS", jobKey .. ":lock") == 0) then
                --  Remove from the active queue.
                local removed = rcall("LREM", activeKey, 1, jobId)
                if (removed > 0) then
                    -- If this job has been stalled too many times, such as if it crashes the worker, then fail it.
                    local stalledCount = rcall("HINCRBY", jobKey, "stc", 1)
                    -- Check if this is a repeatable job by looking at job options
                    local jobSchedulerId = rcall("HGET", jobKey, "rjk")
                    local isRepeatableJob = false
                    if jobSchedulerId then
                        local schedulerKey = repeatKey .. ":" .. jobSchedulerId
                        if rcall("EXISTS", schedulerKey) == 1 then
                            isRepeatableJob = true
                        else
                            -- TODO: remove this check in v6, as it is only needed for legacy repeatable jobs
                            -- that stored the scheduler id in the job key but did not create the scheduler hash key
                            local prevMillis = rcall("ZSCORE", repeatKey, jobSchedulerId)
                            if prevMillis then
                                isRepeatableJob = true
                            end
                        end
                    end
                    -- Only fail job if it exceeds stall limit AND is not a repeatable job
                    if stalledCount > maxStalledJobCount and not isRepeatableJob then
                        local failedReason = "job stalled more than allowable limit"
                        rcall("HSET", jobKey, "defa", failedReason)
                    end
                    moveJobToWait(metaKey, activeKey, waitKey, pausedKey, markerKey, eventStreamKey, jobId,
                        "RPUSH")
                    -- Emit the stalled event
                    rcall("XADD", eventStreamKey, "*", "event", "stalled", "jobId", jobId)
                    table.insert(stalled, jobId)
                end
            end
        end
    end
end
-- Mark potentially stalled jobs
local active = rcall('LRANGE', activeKey, 0, -1)
if (#active > 0) then
    for from, to in batches(#active, 7000) do
        rcall('SADD', stalledKey, unpack(active, from, to))
    end
end
return stalled
`,keys:9};e.s(["moveStalledJobsToWait",0,tW],43687),e.i(43687);let tH={name:"moveToActive",content:`--[[
  Move next job to be processed to active, lock it and fetch its data. The job
  may be delayed, in that case we need to move it to the delayed set instead.
  This operation guarantees that the worker owns the job during the lock
  expiration time. The worker is responsible of keeping the lock fresh
  so that no other worker picks this job again.
  Input:
    KEYS[1] wait key
    KEYS[2] active key
    KEYS[3] prioritized key
    KEYS[4] stream events key
    KEYS[5] stalled key
    -- Rate limiting
    KEYS[6] rate limiter key
    KEYS[7] delayed key
    -- Delayed jobs
    KEYS[8] paused key
    KEYS[9] meta key
    KEYS[10] pc priority counter
    -- Marker
    KEYS[11] marker key
    -- Arguments
    ARGV[1] key prefix
    ARGV[2] timestamp
    ARGV[3] opts
    opts - token - lock token
    opts - lockDuration
    opts - limiter
    opts - name - worker name
]]
local rcall = redis.call
local waitKey = KEYS[1]
local activeKey = KEYS[2]
local eventStreamKey = KEYS[4]
local rateLimiterKey = KEYS[6]
local delayedKey = KEYS[7]
local opts = cmsgpack.unpack(ARGV[3])
-- Includes
--[[
  Function to return the next delayed job timestamp.
]]
local function getNextDelayedTimestamp(delayedKey)
  local result = rcall("ZRANGE", delayedKey, 0, 0, "WITHSCORES")
  if #result then
    local nextTimestamp = tonumber(result[2])
    if nextTimestamp ~= nil then
      return nextTimestamp / 0x1000
    end
  end
end
--[[
  Function to get current rate limit ttl.
]]
local function getRateLimitTTL(maxJobs, rateLimiterKey)
  if maxJobs and maxJobs <= tonumber(rcall("GET", rateLimiterKey) or 0) then
    local pttl = rcall("PTTL", rateLimiterKey)
    if pttl == 0 then
      rcall("DEL", rateLimiterKey)
    end
    if pttl > 0 then
      return pttl
    end
  end
  return 0
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
--[[
  Function to move job from prioritized state to active.
]]
local function moveJobFromPrioritizedToActive(priorityKey, activeKey, priorityCounterKey)
  local prioritizedJob = rcall("ZPOPMIN", priorityKey)
  if #prioritizedJob > 0 then
    rcall("LPUSH", activeKey, prioritizedJob[1])
    return prioritizedJob[1]
  else
    rcall("DEL", priorityCounterKey)
  end
end
--[[
  Function to move job from wait state to active.
  Input:
    opts - token - lock token
    opts - lockDuration
    opts - limiter
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function prepareJobForProcessing(keyPrefix, rateLimiterKey, eventStreamKey,
    jobId, processedOn, maxJobs, limiterDuration, markerKey, opts)
  local jobKey = keyPrefix .. jobId
  -- Check if we need to perform rate limiting.
  if maxJobs then
    local jobCounter = tonumber(rcall("INCR", rateLimiterKey))
    if jobCounter == 1 then
      local integerDuration = math.floor(math.abs(limiterDuration))
      rcall("PEXPIRE", rateLimiterKey, integerDuration)
    end
  end
  -- get a lock
  if opts['token'] ~= "0" then
    local lockKey = jobKey .. ':lock'
    rcall("SET", lockKey, opts['token'], "PX", opts['lockDuration'])
  end
  local optionalValues = {}
  if opts['name'] then
    -- Set "processedBy" field to the worker name
    table.insert(optionalValues, "pb")
    table.insert(optionalValues, opts['name'])
  end
  rcall("XADD", eventStreamKey, "*", "event", "active", "jobId", jobId, "prev", "waiting")
  rcall("HMSET", jobKey, "processedOn", processedOn, unpack(optionalValues))
  rcall("HINCRBY", jobKey, "ats", 1)
  addBaseMarkerIfNeeded(markerKey, false)
  -- rate limit delay must be 0 in this case to prevent adding more delay
  -- when job that is moved to active needs to be processed
  return {rcall("HGETALL", jobKey), jobId, 0, 0} -- get job data
end
--[[
  Updates the delay set, by moving delayed jobs that should
  be processed now to "wait".
     Events:
      'waiting'
]]
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to add job considering priority.
]]
-- Includes
--[[
  Function to get priority score.
]]
local function getPriorityScore(priority, priorityCounterKey)
  local prioCounter = rcall("INCR", priorityCounterKey)
  return priority * 0x100000000 + prioCounter % 0x100000000
end
local function addJobWithPriority(markerKey, prioritizedKey, priority, jobId, priorityCounterKey,
  isPausedOrMaxed)
  local score = getPriorityScore(priority, priorityCounterKey)
  rcall("ZADD", prioritizedKey, score, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
-- Try to get as much as 1000 jobs at once
local function promoteDelayedJobs(delayedKey, markerKey, targetKey, prioritizedKey,
                                  eventStreamKey, prefix, timestamp, priorityCounterKey, isPaused)
    local jobs = rcall("ZRANGEBYSCORE", delayedKey, 0, (timestamp + 1) * 0x1000 - 1, "LIMIT", 0, 1000)
    if (#jobs > 0) then
        rcall("ZREM", delayedKey, unpack(jobs))
        for _, jobId in ipairs(jobs) do
            local jobKey = prefix .. jobId
            local priority =
                tonumber(rcall("HGET", jobKey, "priority")) or 0
            if priority == 0 then
                -- LIFO or FIFO
                rcall("LPUSH", targetKey, jobId)
            else
                local score = getPriorityScore(priority, priorityCounterKey)
                rcall("ZADD", prioritizedKey, score, jobId)
            end
            -- Emit waiting event
            rcall("XADD", eventStreamKey, "*", "event", "waiting", "jobId",
                  jobId, "prev", "delayed")
            rcall("HSET", jobKey, "delay", 0)
        end
        addBaseMarkerIfNeeded(markerKey, isPaused)
    end
end
local target, isPausedOrMaxed, rateLimitMax, rateLimitDuration = getTargetQueueList(KEYS[9],
    activeKey, waitKey, KEYS[8])
-- Check if there are delayed jobs that we can move to wait.
local markerKey = KEYS[11]
promoteDelayedJobs(delayedKey, markerKey, target, KEYS[3], eventStreamKey, ARGV[1],
                   ARGV[2], KEYS[10], isPausedOrMaxed)
local maxJobs = tonumber(rateLimitMax or (opts['limiter'] and opts['limiter']['max']))
local expireTime = getRateLimitTTL(maxJobs, rateLimiterKey)
-- Check if we are rate limited first.
if expireTime > 0 then return {0, 0, expireTime, 0} end
-- paused or maxed queue
if isPausedOrMaxed then return {0, 0, 0, 0} end
local limiterDuration = (opts['limiter'] and opts['limiter']['duration']) or rateLimitDuration
-- no job ID, try non-blocking move from wait to active
local jobId = rcall("RPOPLPUSH", waitKey, activeKey)
-- Markers in waitlist DEPRECATED in v5: Will be completely removed in v6.
if jobId and string.sub(jobId, 1, 2) == "0:" then
    rcall("LREM", activeKey, 1, jobId)
    jobId = rcall("RPOPLPUSH", waitKey, activeKey)
end
if jobId then
    return prepareJobForProcessing(ARGV[1], rateLimiterKey, eventStreamKey, jobId, ARGV[2],
                                   maxJobs, limiterDuration, markerKey, opts)
else
    jobId = moveJobFromPrioritizedToActive(KEYS[3], activeKey, KEYS[10])
    if jobId then
        return prepareJobForProcessing(ARGV[1], rateLimiterKey, eventStreamKey, jobId, ARGV[2],
                                       maxJobs, limiterDuration, markerKey, opts)
    end
end
-- Return the timestamp for the next delayed job if any.
local nextTimestamp = getNextDelayedTimestamp(delayedKey)
if nextTimestamp ~= nil then return {0, 0, 0, nextTimestamp} end
return {0, 0, 0, 0}
`,keys:11};e.s(["moveToActive",0,tH],10393),e.i(10393);let t$={name:"moveToDelayed",content:`--[[
  Moves job from active to delayed set.
  Input:
    KEYS[1] marker key
    KEYS[2] active key
    KEYS[3] prioritized key
    KEYS[4] delayed key
    KEYS[5] job key
    KEYS[6] events stream
    KEYS[7] meta key
    KEYS[8] stalled key
    KEYS[9] wait key
    KEYS[10] rate limiter key
    KEYS[11] paused key
    KEYS[12] pc priority counter
    ARGV[1] key prefix
    ARGV[2] timestamp
    ARGV[3] the id of the job
    ARGV[4] queue token
    ARGV[5] delay value
    ARGV[6] skip attempt
    ARGV[7] optional job fields to update
    ARGV[8] fetch next?
    ARGV[9] opts
  Output:
    0 - OK
   -1 - Missing job.
   -3 - Job not in active set.
  Events:
    - delayed key.
]]
local rcall = redis.call
-- Includes
--[[
  Add delay marker if needed.
]]
-- Includes
--[[
  Function to return the next delayed job timestamp.
]]
local function getNextDelayedTimestamp(delayedKey)
  local result = rcall("ZRANGE", delayedKey, 0, 0, "WITHSCORES")
  if #result then
    local nextTimestamp = tonumber(result[2])
    if nextTimestamp ~= nil then
      return nextTimestamp / 0x1000
    end
  end
end
local function addDelayMarkerIfNeeded(markerKey, delayedKey)
  local nextTimestamp = getNextDelayedTimestamp(delayedKey)
  if nextTimestamp ~= nil then
    -- Replace the score of the marker with the newest known
    -- next timestamp.
    rcall("ZADD", markerKey, nextTimestamp, "1")
  end
end
--[[
  Function to fetch the next job to process.
  Tries to get the next job to avoid an extra roundtrip if the queue is
  not closing and not rate limited.
  Input:
    waitKey - wait list key
    activeKey - active list key
    prioritizedKey - prioritized sorted set key
    eventStreamKey - event stream key
    rateLimiterKey - rate limiter key
    delayedKey - delayed sorted set key
    pausedKey - paused list key
    metaKey - meta hash key
    pcKey - priority counter key
    markerKey - marker key
    prefix - keys prefix
    timestamp - current timestamp
    opts - options table:
      token (required) - lock token used when locking jobs
      lockDuration (required) - lock duration for acquired jobs
      limiter (optional) - rate limiter options table (e.g. { max = number })
]]
-- Includes
--[[
  Function to get current rate limit ttl.
]]
local function getRateLimitTTL(maxJobs, rateLimiterKey)
  if maxJobs and maxJobs <= tonumber(rcall("GET", rateLimiterKey) or 0) then
    local pttl = rcall("PTTL", rateLimiterKey)
    if pttl == 0 then
      rcall("DEL", rateLimiterKey)
    end
    if pttl > 0 then
      return pttl
    end
  end
  return 0
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
--[[
  Function to move job from prioritized state to active.
]]
local function moveJobFromPrioritizedToActive(priorityKey, activeKey, priorityCounterKey)
  local prioritizedJob = rcall("ZPOPMIN", priorityKey)
  if #prioritizedJob > 0 then
    rcall("LPUSH", activeKey, prioritizedJob[1])
    return prioritizedJob[1]
  else
    rcall("DEL", priorityCounterKey)
  end
end
--[[
  Function to move job from wait state to active.
  Input:
    opts - token - lock token
    opts - lockDuration
    opts - limiter
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function prepareJobForProcessing(keyPrefix, rateLimiterKey, eventStreamKey,
    jobId, processedOn, maxJobs, limiterDuration, markerKey, opts)
  local jobKey = keyPrefix .. jobId
  -- Check if we need to perform rate limiting.
  if maxJobs then
    local jobCounter = tonumber(rcall("INCR", rateLimiterKey))
    if jobCounter == 1 then
      local integerDuration = math.floor(math.abs(limiterDuration))
      rcall("PEXPIRE", rateLimiterKey, integerDuration)
    end
  end
  -- get a lock
  if opts['token'] ~= "0" then
    local lockKey = jobKey .. ':lock'
    rcall("SET", lockKey, opts['token'], "PX", opts['lockDuration'])
  end
  local optionalValues = {}
  if opts['name'] then
    -- Set "processedBy" field to the worker name
    table.insert(optionalValues, "pb")
    table.insert(optionalValues, opts['name'])
  end
  rcall("XADD", eventStreamKey, "*", "event", "active", "jobId", jobId, "prev", "waiting")
  rcall("HMSET", jobKey, "processedOn", processedOn, unpack(optionalValues))
  rcall("HINCRBY", jobKey, "ats", 1)
  addBaseMarkerIfNeeded(markerKey, false)
  -- rate limit delay must be 0 in this case to prevent adding more delay
  -- when job that is moved to active needs to be processed
  return {rcall("HGETALL", jobKey), jobId, 0, 0} -- get job data
end
--[[
  Updates the delay set, by moving delayed jobs that should
  be processed now to "wait".
     Events:
      'waiting'
]]
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to add job considering priority.
]]
-- Includes
--[[
  Function to get priority score.
]]
local function getPriorityScore(priority, priorityCounterKey)
  local prioCounter = rcall("INCR", priorityCounterKey)
  return priority * 0x100000000 + prioCounter % 0x100000000
end
local function addJobWithPriority(markerKey, prioritizedKey, priority, jobId, priorityCounterKey,
  isPausedOrMaxed)
  local score = getPriorityScore(priority, priorityCounterKey)
  rcall("ZADD", prioritizedKey, score, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
-- Try to get as much as 1000 jobs at once
local function promoteDelayedJobs(delayedKey, markerKey, targetKey, prioritizedKey,
                                  eventStreamKey, prefix, timestamp, priorityCounterKey, isPaused)
    local jobs = rcall("ZRANGEBYSCORE", delayedKey, 0, (timestamp + 1) * 0x1000 - 1, "LIMIT", 0, 1000)
    if (#jobs > 0) then
        rcall("ZREM", delayedKey, unpack(jobs))
        for _, jobId in ipairs(jobs) do
            local jobKey = prefix .. jobId
            local priority =
                tonumber(rcall("HGET", jobKey, "priority")) or 0
            if priority == 0 then
                -- LIFO or FIFO
                rcall("LPUSH", targetKey, jobId)
            else
                local score = getPriorityScore(priority, priorityCounterKey)
                rcall("ZADD", prioritizedKey, score, jobId)
            end
            -- Emit waiting event
            rcall("XADD", eventStreamKey, "*", "event", "waiting", "jobId",
                  jobId, "prev", "delayed")
            rcall("HSET", jobKey, "delay", 0)
        end
        addBaseMarkerIfNeeded(markerKey, isPaused)
    end
end
local function fetchNextJob(waitKey, activeKey, prioritizedKey, eventStreamKey,
    rateLimiterKey, delayedKey, pausedKey, metaKey, pcKey, markerKey, prefix,
    timestamp, opts)
    local target, isPausedOrMaxed, rateLimitMax, rateLimitDuration =
        getTargetQueueList(metaKey, activeKey, waitKey, pausedKey)
    -- Check if there are delayed jobs that can be promoted
    promoteDelayedJobs(delayedKey, markerKey, target, prioritizedKey,
        eventStreamKey, prefix, timestamp, pcKey, isPausedOrMaxed)
    local maxJobs = tonumber(rateLimitMax or (opts['limiter'] and opts['limiter']['max']))
    -- Check if we are rate limited first.
    local expireTime = getRateLimitTTL(maxJobs, rateLimiterKey)
    if expireTime > 0 then
        return {0, 0, expireTime, 0}
    end
    -- paused or maxed queue
    if isPausedOrMaxed then
        return {0, 0, 0, 0}
    end
    local limiterDuration = (opts['limiter'] and opts['limiter']['duration']) or rateLimitDuration
    local jobId = rcall("RPOPLPUSH", waitKey, activeKey)
    if jobId then
        -- Markers in waitlist DEPRECATED in v5: Remove in v6.
        if string.sub(jobId, 1, 2) == "0:" then
            rcall("LREM", activeKey, 1, jobId)
            -- If jobId is special ID 0:delay (delay greater than 0), then there is no job to process
            -- but if ID is 0:0, then there is at least 1 prioritized job to process
            if jobId == "0:0" then
                jobId = moveJobFromPrioritizedToActive(prioritizedKey, activeKey, pcKey)
                return prepareJobForProcessing(prefix, rateLimiterKey,
                    eventStreamKey, jobId, timestamp, maxJobs,
                    limiterDuration, markerKey, opts)
            end
        else
            return prepareJobForProcessing(prefix, rateLimiterKey,
                eventStreamKey, jobId, timestamp, maxJobs,
                limiterDuration, markerKey, opts)
        end
    else
        jobId = moveJobFromPrioritizedToActive(prioritizedKey, activeKey, pcKey)
        if jobId then
            return prepareJobForProcessing(prefix, rateLimiterKey,
                eventStreamKey, jobId, timestamp, maxJobs,
                limiterDuration, markerKey, opts)
        end
    end
    -- Return the timestamp for the next delayed job if any.
    local nextTimestamp = getNextDelayedTimestamp(delayedKey)
    if nextTimestamp ~= nil then
        -- The result is guaranteed to be positive, since the
        -- ZRANGEBYSCORE command would have return a job otherwise.
        return {0, 0, 0, nextTimestamp}
    end
end
--[[
  Bake in the job id first 12 bits into the timestamp
  to guarantee correct execution order of delayed jobs
  (up to 4096 jobs per given timestamp or 4096 jobs apart per timestamp)
  WARNING: Jobs that are so far apart that they wrap around will cause FIFO to fail
]]
local function getDelayedScore(delayedKey, timestamp, delay)
  local delayedTimestamp = (delay > 0 and (tonumber(timestamp) + delay)) or tonumber(timestamp)
  local minScore = delayedTimestamp * 0x1000
  local maxScore = (delayedTimestamp + 1 ) * 0x1000 - 1
  local result = rcall("ZREVRANGEBYSCORE", delayedKey, maxScore,
    minScore, "WITHSCORES","LIMIT", 0, 1)
  if #result then
    local currentMaxScore = tonumber(result[2])
    if currentMaxScore ~= nil then
      if currentMaxScore >= maxScore then
        return maxScore, delayedTimestamp
      else
        return currentMaxScore + 1, delayedTimestamp
      end
    end
  end
  return minScore, delayedTimestamp
end
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
local function removeLock(jobKey, stalledKey, token, jobId)
  if token ~= "0" then
    local lockKey = jobKey .. ':lock'
    local lockToken = rcall("GET", lockKey)
    if lockToken == token then
      rcall("DEL", lockKey)
      rcall("SREM", stalledKey, jobId)
    else
      if lockToken then
        -- Lock exists but token does not match
        return -6
      else
        -- Lock is missing completely
        return -2
      end
    end
  end
  return 0
end
--[[
  Function to update a bunch of fields in a job.
]]
local function updateJobFields(jobKey, msgpackedFields)
  if msgpackedFields and #msgpackedFields > 0 then
    local fieldsToUpdate = cmsgpack.unpack(msgpackedFields)
    if fieldsToUpdate then
      rcall("HMSET", jobKey, unpack(fieldsToUpdate))
    end
  end
end
local jobKey = KEYS[5]
local markerKey = KEYS[1]
local metaKey = KEYS[7]
local token = ARGV[4] 
if rcall("EXISTS", jobKey) == 1 then
    local errorCode = removeLock(jobKey, KEYS[8], token, ARGV[3])
    if errorCode < 0 then
        return errorCode
    end
    updateJobFields(jobKey, ARGV[7])
    local delayedKey = KEYS[4]
    local jobId = ARGV[3]
    local delay = tonumber(ARGV[5])
    local numRemovedElements = rcall("LREM", KEYS[2], -1, jobId)
    if numRemovedElements < 1 then return -3 end
    local score, delayedTimestamp = getDelayedScore(delayedKey, ARGV[2], delay)
    if ARGV[6] == "0" then
        rcall("HINCRBY", jobKey, "atm", 1)
    end
    rcall("HSET", jobKey, "delay", ARGV[5])
    local maxEvents = getOrSetMaxEvents(metaKey)
    rcall("ZADD", delayedKey, score, jobId)
    rcall("XADD", KEYS[6], "MAXLEN", "~", maxEvents, "*", "event", "delayed",
          "jobId", jobId, "delay", delayedTimestamp)
    -- Try to get next job to avoid an extra roundtrip if the queue is not closing,
    -- and not rate limited.
    if (ARGV[8] == "1") then
        local opts = cmsgpack.unpack(ARGV[9])
        local result = fetchNextJob(KEYS[9], KEYS[2], KEYS[3], KEYS[6],
            KEYS[10], KEYS[4], KEYS[11], metaKey, KEYS[12], markerKey,
            ARGV[1], ARGV[2], opts)
        if result and type(result[1]) == "table" then
            return result
        end
    end
    -- Check if we need to push a marker job to wake up sleeping workers.
    addDelayMarkerIfNeeded(markerKey, delayedKey)
    return 0
else
    return -1
end
`,keys:12};e.s(["moveToDelayed",0,t$],78399),e.i(78399);let tQ={name:"moveToFinished",content:`--[[
  Move job from active to a finished status (completed or failed)
  A job can only be moved to completed if it was active.
  The job must be locked before it can be moved to a finished status,
  and the lock must be released in this script.
    Input:
      KEYS[1] wait key
      KEYS[2] active key
      KEYS[3] prioritized key
      KEYS[4] event stream key
      KEYS[5] stalled key
      -- Rate limiting
      KEYS[6] rate limiter key
      KEYS[7] delayed key
      KEYS[8] paused key
      KEYS[9] meta key
      KEYS[10] pc priority counter
      KEYS[11] completed/failed key
      KEYS[12] jobId key
      KEYS[13] metrics key
      KEYS[14] marker key
      ARGV[1]  jobId
      ARGV[2]  timestamp
      ARGV[3]  msg property returnvalue / failedReason
      ARGV[4]  return value / failed reason
      ARGV[5]  target (completed/failed)
      ARGV[6]  fetch next?
      ARGV[7]  keys prefix
      ARGV[8]  opts
      ARGV[9]  job fields to update
      opts - token - lock token
      opts - keepJobs
      opts - lockDuration - lock duration in milliseconds
      opts - attempts max attempts
      opts - maxMetricsSize
      opts - fpof - fail parent on fail
      opts - cpof - continue parent on fail
      opts - idof - ignore dependency on fail
      opts - rdof - remove dependency on fail
      opts - name - worker name
    Output:
      0 OK
      -1 Missing key.
      -2 Missing lock.
      -3 Job not in active set
      -4 Job has pending children
      -6 Lock is not owned by this client
      -9 Job has failed children
    Events:
      'completed/failed'
]]
local rcall = redis.call
--- Includes
--[[
  Functions to collect metrics based on a current and previous count of jobs.
  Granularity is fixed at 1 minute.
]]
--[[
  Function to loop in batches.
  Just a bit of warning, some commands as ZREM
  could receive a maximum of 7000 parameters per call.
]]
local function batches(n, batchSize)
  local i = 0
  return function()
    local from = i * batchSize + 1
    i = i + 1
    if (from <= n) then
      local to = math.min(from + batchSize - 1, n)
      return from, to
    end
  end
end
local function collectMetrics(metaKey, dataPointsList, maxDataPoints,
                                 timestamp)
    -- Increment current count
    local count = rcall("HINCRBY", metaKey, "count", 1) - 1
    -- Compute how many data points we need to add to the list, N.
    local prevTS = rcall("HGET", metaKey, "prevTS")
    if not prevTS then
        -- If prevTS is nil, set it to the current timestamp
        rcall("HSET", metaKey, "prevTS", timestamp, "prevCount", 0)
        return
    end
    local N = math.min(math.floor(timestamp / 60000) - math.floor(prevTS / 60000), tonumber(maxDataPoints))
    if N > 0 then
        local delta = count - rcall("HGET", metaKey, "prevCount")
        -- If N > 1, add N-1 zeros to the list
        if N > 1 then
            local points = {}
            points[1] = delta
            for i = 2, N do
                points[i] = 0
            end
            for from, to in batches(#points, 7000) do
                rcall("LPUSH", dataPointsList, unpack(points, from, to))
            end
        else
            -- LPUSH delta to the list
            rcall("LPUSH", dataPointsList, delta)
        end
        -- LTRIM to keep list to its max size
        rcall("LTRIM", dataPointsList, 0, maxDataPoints - 1)
        -- update prev count with current count
        rcall("HSET", metaKey, "prevCount", count, "prevTS", timestamp)
    end
end
--[[
  Function to fetch the next job to process.
  Tries to get the next job to avoid an extra roundtrip if the queue is
  not closing and not rate limited.
  Input:
    waitKey - wait list key
    activeKey - active list key
    prioritizedKey - prioritized sorted set key
    eventStreamKey - event stream key
    rateLimiterKey - rate limiter key
    delayedKey - delayed sorted set key
    pausedKey - paused list key
    metaKey - meta hash key
    pcKey - priority counter key
    markerKey - marker key
    prefix - keys prefix
    timestamp - current timestamp
    opts - options table:
      token (required) - lock token used when locking jobs
      lockDuration (required) - lock duration for acquired jobs
      limiter (optional) - rate limiter options table (e.g. { max = number })
]]
-- Includes
--[[
  Function to return the next delayed job timestamp.
]]
local function getNextDelayedTimestamp(delayedKey)
  local result = rcall("ZRANGE", delayedKey, 0, 0, "WITHSCORES")
  if #result then
    local nextTimestamp = tonumber(result[2])
    if nextTimestamp ~= nil then
      return nextTimestamp / 0x1000
    end
  end
end
--[[
  Function to get current rate limit ttl.
]]
local function getRateLimitTTL(maxJobs, rateLimiterKey)
  if maxJobs and maxJobs <= tonumber(rcall("GET", rateLimiterKey) or 0) then
    local pttl = rcall("PTTL", rateLimiterKey)
    if pttl == 0 then
      rcall("DEL", rateLimiterKey)
    end
    if pttl > 0 then
      return pttl
    end
  end
  return 0
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
--[[
  Function to move job from prioritized state to active.
]]
local function moveJobFromPrioritizedToActive(priorityKey, activeKey, priorityCounterKey)
  local prioritizedJob = rcall("ZPOPMIN", priorityKey)
  if #prioritizedJob > 0 then
    rcall("LPUSH", activeKey, prioritizedJob[1])
    return prioritizedJob[1]
  else
    rcall("DEL", priorityCounterKey)
  end
end
--[[
  Function to move job from wait state to active.
  Input:
    opts - token - lock token
    opts - lockDuration
    opts - limiter
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function prepareJobForProcessing(keyPrefix, rateLimiterKey, eventStreamKey,
    jobId, processedOn, maxJobs, limiterDuration, markerKey, opts)
  local jobKey = keyPrefix .. jobId
  -- Check if we need to perform rate limiting.
  if maxJobs then
    local jobCounter = tonumber(rcall("INCR", rateLimiterKey))
    if jobCounter == 1 then
      local integerDuration = math.floor(math.abs(limiterDuration))
      rcall("PEXPIRE", rateLimiterKey, integerDuration)
    end
  end
  -- get a lock
  if opts['token'] ~= "0" then
    local lockKey = jobKey .. ':lock'
    rcall("SET", lockKey, opts['token'], "PX", opts['lockDuration'])
  end
  local optionalValues = {}
  if opts['name'] then
    -- Set "processedBy" field to the worker name
    table.insert(optionalValues, "pb")
    table.insert(optionalValues, opts['name'])
  end
  rcall("XADD", eventStreamKey, "*", "event", "active", "jobId", jobId, "prev", "waiting")
  rcall("HMSET", jobKey, "processedOn", processedOn, unpack(optionalValues))
  rcall("HINCRBY", jobKey, "ats", 1)
  addBaseMarkerIfNeeded(markerKey, false)
  -- rate limit delay must be 0 in this case to prevent adding more delay
  -- when job that is moved to active needs to be processed
  return {rcall("HGETALL", jobKey), jobId, 0, 0} -- get job data
end
--[[
  Updates the delay set, by moving delayed jobs that should
  be processed now to "wait".
     Events:
      'waiting'
]]
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to add job considering priority.
]]
-- Includes
--[[
  Function to get priority score.
]]
local function getPriorityScore(priority, priorityCounterKey)
  local prioCounter = rcall("INCR", priorityCounterKey)
  return priority * 0x100000000 + prioCounter % 0x100000000
end
local function addJobWithPriority(markerKey, prioritizedKey, priority, jobId, priorityCounterKey,
  isPausedOrMaxed)
  local score = getPriorityScore(priority, priorityCounterKey)
  rcall("ZADD", prioritizedKey, score, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
-- Try to get as much as 1000 jobs at once
local function promoteDelayedJobs(delayedKey, markerKey, targetKey, prioritizedKey,
                                  eventStreamKey, prefix, timestamp, priorityCounterKey, isPaused)
    local jobs = rcall("ZRANGEBYSCORE", delayedKey, 0, (timestamp + 1) * 0x1000 - 1, "LIMIT", 0, 1000)
    if (#jobs > 0) then
        rcall("ZREM", delayedKey, unpack(jobs))
        for _, jobId in ipairs(jobs) do
            local jobKey = prefix .. jobId
            local priority =
                tonumber(rcall("HGET", jobKey, "priority")) or 0
            if priority == 0 then
                -- LIFO or FIFO
                rcall("LPUSH", targetKey, jobId)
            else
                local score = getPriorityScore(priority, priorityCounterKey)
                rcall("ZADD", prioritizedKey, score, jobId)
            end
            -- Emit waiting event
            rcall("XADD", eventStreamKey, "*", "event", "waiting", "jobId",
                  jobId, "prev", "delayed")
            rcall("HSET", jobKey, "delay", 0)
        end
        addBaseMarkerIfNeeded(markerKey, isPaused)
    end
end
local function fetchNextJob(waitKey, activeKey, prioritizedKey, eventStreamKey,
    rateLimiterKey, delayedKey, pausedKey, metaKey, pcKey, markerKey, prefix,
    timestamp, opts)
    local target, isPausedOrMaxed, rateLimitMax, rateLimitDuration =
        getTargetQueueList(metaKey, activeKey, waitKey, pausedKey)
    -- Check if there are delayed jobs that can be promoted
    promoteDelayedJobs(delayedKey, markerKey, target, prioritizedKey,
        eventStreamKey, prefix, timestamp, pcKey, isPausedOrMaxed)
    local maxJobs = tonumber(rateLimitMax or (opts['limiter'] and opts['limiter']['max']))
    -- Check if we are rate limited first.
    local expireTime = getRateLimitTTL(maxJobs, rateLimiterKey)
    if expireTime > 0 then
        return {0, 0, expireTime, 0}
    end
    -- paused or maxed queue
    if isPausedOrMaxed then
        return {0, 0, 0, 0}
    end
    local limiterDuration = (opts['limiter'] and opts['limiter']['duration']) or rateLimitDuration
    local jobId = rcall("RPOPLPUSH", waitKey, activeKey)
    if jobId then
        -- Markers in waitlist DEPRECATED in v5: Remove in v6.
        if string.sub(jobId, 1, 2) == "0:" then
            rcall("LREM", activeKey, 1, jobId)
            -- If jobId is special ID 0:delay (delay greater than 0), then there is no job to process
            -- but if ID is 0:0, then there is at least 1 prioritized job to process
            if jobId == "0:0" then
                jobId = moveJobFromPrioritizedToActive(prioritizedKey, activeKey, pcKey)
                return prepareJobForProcessing(prefix, rateLimiterKey,
                    eventStreamKey, jobId, timestamp, maxJobs,
                    limiterDuration, markerKey, opts)
            end
        else
            return prepareJobForProcessing(prefix, rateLimiterKey,
                eventStreamKey, jobId, timestamp, maxJobs,
                limiterDuration, markerKey, opts)
        end
    else
        jobId = moveJobFromPrioritizedToActive(prioritizedKey, activeKey, pcKey)
        if jobId then
            return prepareJobForProcessing(prefix, rateLimiterKey,
                eventStreamKey, jobId, timestamp, maxJobs,
                limiterDuration, markerKey, opts)
        end
    end
    -- Return the timestamp for the next delayed job if any.
    local nextTimestamp = getNextDelayedTimestamp(delayedKey)
    if nextTimestamp ~= nil then
        -- The result is guaranteed to be positive, since the
        -- ZRANGEBYSCORE command would have return a job otherwise.
        return {0, 0, 0, nextTimestamp}
    end
end
--[[
  Function to recursively move from waitingChildren to failed.
]]
-- Includes
--[[
  Validate and move parent to a wait status (waiting, delayed or prioritized)
  if no pending dependencies.
]]
-- Includes
--[[
  Validate and move parent to a wait status (waiting, delayed or prioritized) if needed.
]]
-- Includes
--[[
  Move parent to a wait status (wait, prioritized or delayed)
]]
-- Includes
--[[
  Add delay marker if needed.
]]
-- Includes
local function addDelayMarkerIfNeeded(markerKey, delayedKey)
  local nextTimestamp = getNextDelayedTimestamp(delayedKey)
  if nextTimestamp ~= nil then
    -- Replace the score of the marker with the newest known
    -- next timestamp.
    rcall("ZADD", markerKey, nextTimestamp, "1")
  end
end
--[[
  Function to check if queue is paused or maxed
  (since an empty list and !EXISTS are not really the same).
]]
local function isQueuePausedOrMaxed(queueMetaKey, activeKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency")
  if queueAttributes[1] then
    return true
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      return activeCount >= tonumber(queueAttributes[2])
    end
  end
  return false
end
local function moveParentToWait(parentQueueKey, parentKey, parentId, timestamp)
    local parentWaitKey = parentQueueKey .. ":wait"
    local parentPausedKey = parentQueueKey .. ":paused"
    local parentActiveKey = parentQueueKey .. ":active"
    local parentMetaKey = parentQueueKey .. ":meta"
    local parentMarkerKey = parentQueueKey .. ":marker"
    local jobAttributes = rcall("HMGET", parentKey, "priority", "delay")
    local priority = tonumber(jobAttributes[1]) or 0
    local delay = tonumber(jobAttributes[2]) or 0
    if delay > 0 then
        local delayedTimestamp = tonumber(timestamp) + delay
        local score = delayedTimestamp * 0x1000
        local parentDelayedKey = parentQueueKey .. ":delayed"
        rcall("ZADD", parentDelayedKey, score, parentId)
        rcall("XADD", parentQueueKey .. ":events", "*", "event", "delayed", "jobId", parentId, "delay",
            delayedTimestamp)
        addDelayMarkerIfNeeded(parentMarkerKey, parentDelayedKey)
    else
        if priority == 0 then
            local parentTarget, isParentPausedOrMaxed = getTargetQueueList(parentMetaKey, parentActiveKey,
                parentWaitKey, parentPausedKey)
            addJobInTargetList(parentTarget, parentMarkerKey, "RPUSH", isParentPausedOrMaxed, parentId)
        else
            local isPausedOrMaxed = isQueuePausedOrMaxed(parentMetaKey, parentActiveKey)
            addJobWithPriority(parentMarkerKey, parentQueueKey .. ":prioritized", priority, parentId,
                parentQueueKey .. ":pc", isPausedOrMaxed)
        end
        rcall("XADD", parentQueueKey .. ":events", "*", "event", "waiting", "jobId", parentId, "prev",
            "waiting-children")
    end
end
local function moveParentToWaitIfNeeded(parentQueueKey, parentKey, parentId, timestamp)
  if rcall("EXISTS", parentKey) == 1 then
    local parentWaitingChildrenKey = parentQueueKey .. ":waiting-children"
    if rcall("ZSCORE", parentWaitingChildrenKey, parentId) then    
      rcall("ZREM", parentWaitingChildrenKey, parentId)
      moveParentToWait(parentQueueKey, parentKey, parentId, timestamp)
    end
  end
end
local function moveParentToWaitIfNoPendingDependencies(parentQueueKey, parentDependenciesKey, parentKey,
  parentId, timestamp)
  local doNotHavePendingDependencies = rcall("SCARD", parentDependenciesKey) == 0
  if doNotHavePendingDependencies then
    moveParentToWaitIfNeeded(parentQueueKey, parentKey, parentId, timestamp)
  end
end
local handleChildFailureAndMoveParentToWait = function (parentQueueKey, parentKey, parentId, jobIdKey, timestamp)
  if rcall("EXISTS", parentKey) == 1 then
    local parentWaitingChildrenKey = parentQueueKey .. ":waiting-children"
    local parentDelayedKey = parentQueueKey .. ":delayed"
    local parentWaitingChildrenOrDelayedKey
    if rcall("ZSCORE", parentWaitingChildrenKey, parentId) then
      parentWaitingChildrenOrDelayedKey = parentWaitingChildrenKey
    elseif rcall("ZSCORE", parentDelayedKey, parentId) then
      parentWaitingChildrenOrDelayedKey = parentDelayedKey
      rcall("HSET", parentKey, "delay", 0)
    end
    if parentWaitingChildrenOrDelayedKey then
      rcall("ZREM", parentWaitingChildrenOrDelayedKey, parentId)
      local deferredFailure = "child " .. jobIdKey .. " failed"
      rcall("HSET", parentKey, "defa", deferredFailure)
      moveParentToWait(parentQueueKey, parentKey, parentId, timestamp)
    else
      if not rcall("ZSCORE", parentQueueKey .. ":failed", parentId) then
        local deferredFailure = "child " .. jobIdKey .. " failed"
        rcall("HSET", parentKey, "defa", deferredFailure)
      end
    end
  end
end
local moveChildFromDependenciesIfNeeded = function (rawParentData, childKey, failedReason, timestamp)
  if rawParentData then
    local parentData = cjson.decode(rawParentData)
    local parentKey = parentData['queueKey'] .. ':' .. parentData['id']
    local parentDependenciesChildrenKey = parentKey .. ":dependencies"
    if parentData['fpof'] then
      if rcall("SREM", parentDependenciesChildrenKey, childKey) == 1 then
        local parentUnsuccessfulChildrenKey = parentKey .. ":unsuccessful"
        rcall("ZADD", parentUnsuccessfulChildrenKey, timestamp, childKey)
        handleChildFailureAndMoveParentToWait(
          parentData['queueKey'],
          parentKey,
          parentData['id'],
          childKey,
          timestamp
        )
      end
    elseif parentData['cpof'] then
      if rcall("SREM", parentDependenciesChildrenKey, childKey) == 1 then
        local parentFailedChildrenKey = parentKey .. ":failed"
        rcall("HSET", parentFailedChildrenKey, childKey, failedReason)
        moveParentToWaitIfNeeded(parentData['queueKey'], parentKey, parentData['id'], timestamp)
      end
    elseif parentData['idof'] or parentData['rdof'] then
      if rcall("SREM", parentDependenciesChildrenKey, childKey) == 1 then
        moveParentToWaitIfNoPendingDependencies(parentData['queueKey'], parentDependenciesChildrenKey,
          parentKey, parentData['id'], timestamp)
        if parentData['idof'] then
          local parentFailedChildrenKey = parentKey .. ":failed"
          rcall("HSET", parentFailedChildrenKey, childKey, failedReason)
        end
      end
    end
  end
end
--[[
  Function to remove deduplication key if needed
  when a job is moved to completed or failed states.
]]
local function removeDeduplicationKeyIfNeededOnFinalization(prefixKey,
  deduplicationId, jobId)
  if deduplicationId then
    local deduplicationKey = prefixKey .. "de:" .. deduplicationId
    local pttl = rcall("PTTL", deduplicationKey)
    if pttl == 0 then
      return rcall("DEL", deduplicationKey)
    end
    if pttl == -1 then
      local currentJobId = rcall('GET', deduplicationKey)
      if currentJobId and currentJobId == jobId then
        return rcall("DEL", deduplicationKey)
      end
    end
  end
end
--[[
  Function to remove job keys.
]]
local function removeJobKeys(jobKey)
  return rcall("DEL", jobKey, jobKey .. ':logs', jobKey .. ':dependencies',
    jobKey .. ':processed', jobKey .. ':failed', jobKey .. ':unsuccessful')
end
--[[
  Functions to remove jobs by max age.
]]
-- Includes
--[[
  Function to remove job.
]]
-- Includes
--[[
  Function to remove deduplication key if needed
  when a job is being removed.
]]
local function removeDeduplicationKeyIfNeededOnRemoval(prefixKey,
  jobId, deduplicationId)
  if deduplicationId then
    local deduplicationKey = prefixKey .. "de:" .. deduplicationId
    local currentJobId = rcall('GET', deduplicationKey)
    if currentJobId and currentJobId == jobId then
      rcall("DEL", deduplicationKey)
      -- Also clean up any pending dedup-next data for this dedup ID
      rcall("DEL", prefixKey .. "dn:" .. deduplicationId)
      return 1
    end
  end
end
--[[
  Check if this job has a parent. If so we will just remove it from
  the parent child list, but if it is the last child we should move the parent to "wait/paused"
  which requires code from "moveToFinished"
]]
-- Includes
--[[
  Functions to destructure job key.
  Just a bit of warning, these functions may be a bit slow and affect performance significantly.
]]
local getJobIdFromKey = function (jobKey)
  return string.match(jobKey, ".*:(.*)")
end
local getJobKeyPrefix = function (jobKey, jobId)
  return string.sub(jobKey, 0, #jobKey - #jobId)
end
local function _moveParentToWait(parentPrefix, parentId, emitEvent)
  local parentTarget, isPausedOrMaxed = getTargetQueueList(parentPrefix .. "meta", parentPrefix .. "active",
    parentPrefix .. "wait", parentPrefix .. "paused")
  addJobInTargetList(parentTarget, parentPrefix .. "marker", "RPUSH", isPausedOrMaxed, parentId)
  if emitEvent then
    local parentEventStream = parentPrefix .. "events"
    rcall("XADD", parentEventStream, "*", "event", "waiting", "jobId", parentId, "prev", "waiting-children")
  end
end
local function removeParentDependencyKey(jobKey, hard, parentKey, baseKey, debounceId)
  if parentKey then
    local parentDependenciesKey = parentKey .. ":dependencies"
    local result = rcall("SREM", parentDependenciesKey, jobKey)
    if result > 0 then
      local pendingDependencies = rcall("SCARD", parentDependenciesKey)
      if pendingDependencies == 0 then
        local parentId = getJobIdFromKey(parentKey)
        local parentPrefix = getJobKeyPrefix(parentKey, parentId)
        local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
        if numRemovedElements == 1 then
          if hard then -- remove parent in same queue
            if parentPrefix == baseKey then
              removeParentDependencyKey(parentKey, hard, nil, baseKey, nil)
              removeJobKeys(parentKey)
              if debounceId then
                rcall("DEL", parentPrefix .. "de:" .. debounceId)
              end
            else
              _moveParentToWait(parentPrefix, parentId)
            end
          else
            _moveParentToWait(parentPrefix, parentId, true)
          end
        end
      end
      return true
    end
  else
    local parentAttributes = rcall("HMGET", jobKey, "parentKey", "deid")
    local missedParentKey = parentAttributes[1]
    if( (type(missedParentKey) == "string") and missedParentKey ~= ""
      and (rcall("EXISTS", missedParentKey) == 1)) then
      local parentDependenciesKey = missedParentKey .. ":dependencies"
      local result = rcall("SREM", parentDependenciesKey, jobKey)
      if result > 0 then
        local pendingDependencies = rcall("SCARD", parentDependenciesKey)
        if pendingDependencies == 0 then
          local parentId = getJobIdFromKey(missedParentKey)
          local parentPrefix = getJobKeyPrefix(missedParentKey, parentId)
          local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
          if numRemovedElements == 1 then
            if hard then
              if parentPrefix == baseKey then
                removeParentDependencyKey(missedParentKey, hard, nil, baseKey, nil)
                removeJobKeys(missedParentKey)
                if parentAttributes[2] then
                  rcall("DEL", parentPrefix .. "de:" .. parentAttributes[2])
                end
              else
                _moveParentToWait(parentPrefix, parentId)
              end
            else
              _moveParentToWait(parentPrefix, parentId, true)
            end
          end
        end
        return true
      end
    end
  end
  return false
end
local function removeJob(jobId, hard, baseKey, shouldRemoveDeduplicationKey)
  local jobKey = baseKey .. jobId
  removeParentDependencyKey(jobKey, hard, nil, baseKey)
  if shouldRemoveDeduplicationKey then
    local deduplicationId = rcall("HGET", jobKey, "deid")
    removeDeduplicationKeyIfNeededOnRemoval(baseKey, jobId, deduplicationId)
  end
  removeJobKeys(jobKey)
end
local function removeJobsByMaxAge(timestamp, maxAge, targetSet, prefix, maxLimit)
  local start = timestamp - maxAge * 1000
  local jobIds = rcall("ZREVRANGEBYSCORE", targetSet, start, "-inf", "LIMIT", 0, maxLimit)
  for i, jobId in ipairs(jobIds) do
    removeJob(jobId, false, prefix, false --[[remove debounce key]])
  end
  if #jobIds > 0 then
    if #jobIds < maxLimit then
      rcall("ZREMRANGEBYSCORE", targetSet, "-inf", start)
    else
      for from, to in batches(#jobIds, 7000) do
        rcall("ZREM", targetSet, unpack(jobIds, from, to))
      end
    end
  end
end
--[[
  Functions to remove jobs by max count.
]]
-- Includes
local function removeJobsByMaxCount(maxCount, targetSet, prefix)
  local start = maxCount
  local jobIds = rcall("ZREVRANGE", targetSet, start, -1)
  for i, jobId in ipairs(jobIds) do
    removeJob(jobId, false, prefix, false --[[remove debounce key]])
  end
  rcall("ZREMRANGEBYRANK", targetSet, 0, -(maxCount + 1))
end
local function removeLock(jobKey, stalledKey, token, jobId)
  if token ~= "0" then
    local lockKey = jobKey .. ':lock'
    local lockToken = rcall("GET", lockKey)
    if lockToken == token then
      rcall("DEL", lockKey)
      rcall("SREM", stalledKey, jobId)
    else
      if lockToken then
        -- Lock exists but token does not match
        return -6
      else
        -- Lock is missing completely
        return -2
      end
    end
  end
  return 0
end
--[[
  Function to create a new job from stored dedup-next data
  when a deduplicated job with keepLastIfActive finishes.
  At most one next job is created per deduplication ID.
  Multiple triggers while active overwrite the dedup-next data,
  so only the latest data is used.
]]
-- Includes
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
--[[
  Function to set the deduplication key for a job.
  Uses TTL from deduplication opts if provided.
]]
local function setDeduplicationKey(deduplicationKey, jobId, deduplicationOpts)
    local ttl = deduplicationOpts and deduplicationOpts['ttl']
    if ttl and ttl > 0 then
        rcall('SET', deduplicationKey, jobId, 'PX', ttl)
    else
        rcall('SET', deduplicationKey, jobId)
    end
end
--[[
  Shared helper to store a job and enqueue it into the appropriate list/set.
  Handles delayed, prioritized, and standard (LIFO/FIFO) jobs.
  Emits the appropriate event after enqueuing ("delayed" or "waiting").
  Returns delay, priority from storeJob.
]]
-- Includes
--[[
  Adds a delayed job to the queue by doing the following:
    - Creates a new job key with the job data.
    - adds to delayed zset.
    - Emits a global event 'delayed' if the job is delayed.
]]
-- Includes
--[[
  Bake in the job id first 12 bits into the timestamp
  to guarantee correct execution order of delayed jobs
  (up to 4096 jobs per given timestamp or 4096 jobs apart per timestamp)
  WARNING: Jobs that are so far apart that they wrap around will cause FIFO to fail
]]
local function getDelayedScore(delayedKey, timestamp, delay)
  local delayedTimestamp = (delay > 0 and (tonumber(timestamp) + delay)) or tonumber(timestamp)
  local minScore = delayedTimestamp * 0x1000
  local maxScore = (delayedTimestamp + 1 ) * 0x1000 - 1
  local result = rcall("ZREVRANGEBYSCORE", delayedKey, maxScore,
    minScore, "WITHSCORES","LIMIT", 0, 1)
  if #result then
    local currentMaxScore = tonumber(result[2])
    if currentMaxScore ~= nil then
      if currentMaxScore >= maxScore then
        return maxScore, delayedTimestamp
      else
        return currentMaxScore + 1, delayedTimestamp
      end
    end
  end
  return minScore, delayedTimestamp
end
local function addDelayedJob(jobId, delayedKey, eventsKey, timestamp,
  maxEvents, markerKey, delay)
  local score, delayedTimestamp = getDelayedScore(delayedKey, timestamp, tonumber(delay))
  rcall("ZADD", delayedKey, score, jobId)
  rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "delayed",
    "jobId", jobId, "delay", delayedTimestamp)
  -- mark that a delayed job is available
  addDelayMarkerIfNeeded(markerKey, delayedKey)
end
--[[
  Function to store a job
]]
local function storeJob(eventsKey, jobIdKey, jobId, name, data, opts, timestamp,
                        parentKey, parentData, repeatJobKey)
    local jsonOpts = cjson.encode(opts)
    local delay = opts['delay'] or 0
    local priority = opts['priority'] or 0
    local debounceId = opts['de'] and opts['de']['id']
    local optionalValues = {}
    if parentKey ~= nil then
        table.insert(optionalValues, "parentKey")
        table.insert(optionalValues, parentKey)
        table.insert(optionalValues, "parent")
        table.insert(optionalValues, parentData)
    end
    if repeatJobKey then
        table.insert(optionalValues, "rjk")
        table.insert(optionalValues, repeatJobKey)
    end
    if debounceId then
        table.insert(optionalValues, "deid")
        table.insert(optionalValues, debounceId)
    end
    rcall("HMSET", jobIdKey, "name", name, "data", data, "opts", jsonOpts,
          "timestamp", timestamp, "delay", delay, "priority", priority,
          unpack(optionalValues))
    rcall("XADD", eventsKey, "*", "event", "added", "jobId", jobId, "name", name)
    return delay, priority
end
local function storeAndEnqueueJob(eventsKey, jobIdKey, jobId, name, data, opts,
    timestamp, parentKey, parentData, repeatJobKey, maxEvents,
    waitKey, pausedKey, activeKey, metaKey, prioritizedKey,
    priorityCounterKey, delayedKey, markerKey)
  local delay, priority = storeJob(eventsKey, jobIdKey, jobId, name, data,
      opts, timestamp, parentKey, parentData, repeatJobKey)
  if delay ~= 0 and delayedKey then
    addDelayedJob(jobId, delayedKey, eventsKey, timestamp, maxEvents, markerKey, delay)
  else
    local target, isPausedOrMaxed = getTargetQueueList(metaKey, activeKey, waitKey, pausedKey)
    if priority > 0 then
      addJobWithPriority(markerKey, prioritizedKey, priority, jobId,
          priorityCounterKey, isPausedOrMaxed)
    else
      local pushCmd = opts['lifo'] and 'RPUSH' or 'LPUSH'
      addJobInTargetList(target, markerKey, pushCmd, isPausedOrMaxed, jobId)
    end
    rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "waiting",
        "jobId", jobId)
  end
  return delay, priority
end
local function requeueDeduplicatedJob(prefix, deduplicationId, eventStreamKey,
    metaKey, activeKey, waitKey, pausedKey, markerKey, prioritizedKey,
    priorityCounterKey, delayedKey, timestamp)
  local deduplicationNextKey = prefix .. "dn:" .. deduplicationId
  if rcall("EXISTS", deduplicationNextKey) == 1 then
    local nextData = rcall("HMGET", deduplicationNextKey,
        "name", "data", "opts", "pk", "pd", "pdk", "rjk", "jid")
    -- Always increment the counter to keep it monotonic
    local nextId = rcall("INCR", prefix .. "id") .. ""
    local storedJobId = nextData[8] -- index 8 = "jid" (8th field in the HMGET call above)
    local newJobId
    if storedJobId then
      newJobId = storedJobId
    else
      newJobId = nextId
    end
    local newJobIdKey = prefix .. newJobId
    local newOpts = cjson.decode(nextData[3])
    local deduplicationKey = prefix .. "de:" .. deduplicationId
    local parentKey = nextData[4] or nil
    local parentData = nextData[5] or nil
    local parentDependenciesKey = nextData[6] or nil
    local repeatJobKey = nextData[7] or nil
    -- Set dedup key for the new job (without TTL when keepLastIfActive,
    -- so the key outlives the job's active duration)
    local deOpts = newOpts['de']
    if deOpts and deOpts['keepLastIfActive'] then
      rcall('SET', deduplicationKey, newJobId)
    else
      setDeduplicationKey(deduplicationKey, newJobId, deOpts)
    end
    -- Store and enqueue using the shared helper (handles priority/lifo/delayed)
    local maxEvents = getOrSetMaxEvents(metaKey)
    storeAndEnqueueJob(eventStreamKey, newJobIdKey, newJobId, nextData[1], nextData[2],
        newOpts, timestamp, parentKey, parentData, repeatJobKey, maxEvents,
        waitKey, pausedKey, activeKey, metaKey, prioritizedKey,
        priorityCounterKey, delayedKey, markerKey)
    -- Register as child dependency if the job has a parent
    if parentDependenciesKey then
      rcall("SADD", parentDependenciesKey, newJobIdKey)
    end
    -- Only delete the dedup-next hash after the job is fully created,
    -- so that if any step above errors, the data is not permanently lost.
    rcall("DEL", deduplicationNextKey)
  end
end
--[[
  Function to trim events, default 10000.
]]
-- Includes
local function trimEvents(metaKey, eventStreamKey)
  local maxEvents = getOrSetMaxEvents(metaKey)
  if maxEvents then
    rcall("XTRIM", eventStreamKey, "MAXLEN", "~", maxEvents)
  else
    rcall("XTRIM", eventStreamKey, "MAXLEN", "~", 10000)
  end
end
--[[
  Validate and move or add dependencies to parent.
]]
-- Includes
local function updateParentDepsIfNeeded(parentKey, parentQueueKey, parentDependenciesKey,
  parentId, jobIdKey, returnvalue, timestamp )
  local processedSet = parentKey .. ":processed"
  rcall("HSET", processedSet, jobIdKey, returnvalue)
  moveParentToWaitIfNoPendingDependencies(parentQueueKey, parentDependenciesKey, parentKey, parentId, timestamp)
end
--[[
  Function to update a bunch of fields in a job.
]]
local function updateJobFields(jobKey, msgpackedFields)
  if msgpackedFields and #msgpackedFields > 0 then
    local fieldsToUpdate = cmsgpack.unpack(msgpackedFields)
    if fieldsToUpdate then
      rcall("HMSET", jobKey, unpack(fieldsToUpdate))
    end
  end
end
local jobIdKey = KEYS[12]
if rcall("EXISTS", jobIdKey) == 1 then -- Make sure job exists
    -- Make sure it does not have pending dependencies
    -- It must happen before removing lock
    if ARGV[5] == "completed" then
        if rcall("SCARD", jobIdKey .. ":dependencies") ~= 0 then
            return -4
        end
        if rcall("ZCARD", jobIdKey .. ":unsuccessful") ~= 0 then
            return -9
        end
    end
    local opts = cmsgpack.unpack(ARGV[8])
    local token = opts['token']
    local errorCode = removeLock(jobIdKey, KEYS[5], token, ARGV[1])
    if errorCode < 0 then
        return errorCode
    end
    updateJobFields(jobIdKey, ARGV[9]);
    local attempts = opts['attempts']
    local maxMetricsSize = opts['maxMetricsSize']
    local maxCount = opts['keepJobs']['count']
    local maxAge = opts['keepJobs']['age']
    local maxLimit = opts['keepJobs']['limit'] or 1000
    local jobAttributes = rcall("HMGET", jobIdKey, "parentKey", "parent", "deid")
    local parentKey = jobAttributes[1] or ""
    local parentId = ""
    local parentQueueKey = ""
    if jobAttributes[2] then -- TODO: need to revisit this logic if it's still needed
        local jsonDecodedParent = cjson.decode(jobAttributes[2])
        parentId = jsonDecodedParent['id']
        parentQueueKey = jsonDecodedParent['queueKey']
    end
    local jobId = ARGV[1]
    local timestamp = ARGV[2]
    -- Remove from active list (if not active we shall return error)
    local numRemovedElements = rcall("LREM", KEYS[2], -1, jobId)
    if (numRemovedElements < 1) then
        return -3
    end
    local eventStreamKey = KEYS[4]
    local metaKey = KEYS[9]
    -- Trim events before emitting them to avoid trimming events emitted in this script
    trimEvents(metaKey, eventStreamKey)
    local prefix = ARGV[7]
    removeDeduplicationKeyIfNeededOnFinalization(prefix, jobAttributes[3], jobId)
    -- Check if there is requeue data for this dedup ID (keepLastIfActive mode)
    if jobAttributes[3] then
      requeueDeduplicatedJob(prefix, jobAttributes[3], eventStreamKey,
          metaKey, KEYS[2], KEYS[1], KEYS[8], KEYS[14], KEYS[3], KEYS[10],
          KEYS[7], timestamp)
    end
    -- If job has a parent we need to
    -- 1) remove this job id from parents dependencies
    -- 2) move the job Id to parent "processed" set
    -- 3) push the results into parent "results" list
    -- 4) if parent's dependencies is empty, then move parent to "wait/paused". Note it may be a different queue!.
    if parentId == "" and parentKey ~= "" then
        parentId = getJobIdFromKey(parentKey)
        parentQueueKey = getJobKeyPrefix(parentKey, ":" .. parentId)
    end
    if parentId ~= "" then
        if ARGV[5] == "completed" then
            local dependenciesSet = parentKey .. ":dependencies"
            if rcall("SREM", dependenciesSet, jobIdKey) == 1 then
                updateParentDepsIfNeeded(parentKey, parentQueueKey, dependenciesSet, parentId, jobIdKey, ARGV[4],
                    timestamp)
            end
        else
            moveChildFromDependenciesIfNeeded(jobAttributes[2], jobIdKey, ARGV[4], timestamp)
        end
    end
    local attemptsMade = rcall("HINCRBY", jobIdKey, "atm", 1)
    -- Remove job?
    if maxCount ~= 0 then
        local targetSet = KEYS[11]
        -- Add to complete/failed set
        rcall("ZADD", targetSet, timestamp, jobId)
        rcall("HSET", jobIdKey, ARGV[3], ARGV[4], "finishedOn", timestamp)
        -- "returnvalue" / "failedReason" and "finishedOn"
        if ARGV[5] == "failed" then
            rcall("HDEL", jobIdKey, "defa")
        end
        -- Remove old jobs?
        if maxAge ~= nil then
            removeJobsByMaxAge(timestamp, maxAge, targetSet, prefix, maxLimit)
        end
        if maxCount ~= nil and maxCount > 0 then
            removeJobsByMaxCount(maxCount, targetSet, prefix)
        end
    else
        removeJobKeys(jobIdKey)
        if parentKey ~= "" then
            -- TODO: when a child is removed when finished, result or failure in parent
            -- must not be deleted, those value references should be deleted when the parent
            -- is deleted
            removeParentDependencyKey(jobIdKey, false, parentKey, jobAttributes[3])
        end
    end
    rcall("XADD", eventStreamKey, "*", "event", ARGV[5], "jobId", jobId, ARGV[3], ARGV[4], "prev", "active")
    if ARGV[5] == "failed" then
        if tonumber(attemptsMade) >= tonumber(attempts) then
            rcall("XADD", eventStreamKey, "*", "event", "retries-exhausted", "jobId", jobId, "attemptsMade",
                attemptsMade)
        end
    end
    -- Collect metrics
    if maxMetricsSize ~= "" then
        collectMetrics(KEYS[13], KEYS[13] .. ':data', maxMetricsSize, timestamp)
    end
    -- Try to get next job to avoid an extra roundtrip if the queue is not closing,
    -- and not rate limited.
    if (ARGV[6] == "1") then
        local result = fetchNextJob(KEYS[1], KEYS[2], KEYS[3], eventStreamKey,
            KEYS[6], KEYS[7], KEYS[8], metaKey, KEYS[10], KEYS[14], prefix,
            timestamp, opts)
        if result then
            return result
        end
    end
    local waitLen = rcall("LLEN", KEYS[1])
    if waitLen == 0 then
        local activeLen = rcall("LLEN", KEYS[2])
        if activeLen == 0 then
            local prioritizedLen = rcall("ZCARD", KEYS[3])
            if prioritizedLen == 0 then
                rcall("XADD", eventStreamKey, "*", "event", "drained")
            end
        end
    end
    return 0
else
    return -1
end
`,keys:14};e.s(["moveToFinished",0,tQ],28646),e.i(28646);let tZ={name:"moveToWaitingChildren",content:`--[[
  Moves job from active to waiting children set.
  Input:
    KEYS[1] active key
    KEYS[2] wait-children key
    KEYS[3] job key
    KEYS[4] job dependencies key
    KEYS[5] job unsuccessful key
    KEYS[6] stalled key
    KEYS[7] events key
    ARGV[1] token
    ARGV[2] child key
    ARGV[3] timestamp
    ARGV[4] jobId
    ARGV[5] prefix
  Output:
    0 - OK
    1 - There are not pending dependencies.
   -1 - Missing job.
   -2 - Missing lock
   -3 - Job not in active set
   -9 - Job has failed children
]]
local rcall = redis.call
local activeKey = KEYS[1]
local waitingChildrenKey = KEYS[2]
local jobKey = KEYS[3]
local jobDependenciesKey = KEYS[4]
local jobUnsuccessfulKey = KEYS[5]
local stalledKey = KEYS[6]
local eventStreamKey = KEYS[7]
local token = ARGV[1]
local timestamp = ARGV[3]
local jobId = ARGV[4]
--- Includes
local function removeLock(jobKey, stalledKey, token, jobId)
  if token ~= "0" then
    local lockKey = jobKey .. ':lock'
    local lockToken = rcall("GET", lockKey)
    if lockToken == token then
      rcall("DEL", lockKey)
      rcall("SREM", stalledKey, jobId)
    else
      if lockToken then
        -- Lock exists but token does not match
        return -6
      else
        -- Lock is missing completely
        return -2
      end
    end
  end
  return 0
end
local function removeJobFromActive(activeKey, stalledKey, jobKey, jobId,
    token)
  local errorCode = removeLock(jobKey, stalledKey, token, jobId)
  if errorCode < 0 then
    return errorCode
  end
  local numRemovedElements = rcall("LREM", activeKey, -1, jobId)
  if numRemovedElements < 1 then
    return -3
  end
  return 0
end
local function moveToWaitingChildren(activeKey, waitingChildrenKey, stalledKey, eventStreamKey,
    jobKey, jobId, timestamp, token)
  local errorCode = removeJobFromActive(activeKey, stalledKey, jobKey, jobId, token)
  if errorCode < 0 then
    return errorCode
  end
  local score = tonumber(timestamp)
  rcall("ZADD", waitingChildrenKey, score, jobId)
  rcall("XADD", eventStreamKey, "*", "event", "waiting-children", "jobId", jobId, 'prev', 'active')
  return 0
end
if rcall("EXISTS", jobKey) == 1 then
  if rcall("ZCARD", jobUnsuccessfulKey) ~= 0 then
    return -9
  else
    if ARGV[2] ~= "" then
      if rcall("SISMEMBER", jobDependenciesKey, ARGV[2]) ~= 0 then
        return moveToWaitingChildren(activeKey, waitingChildrenKey, stalledKey, eventStreamKey,
          jobKey, jobId, timestamp, token)
      end
      return 1
    else
      if rcall("SCARD", jobDependenciesKey) ~= 0 then 
        return moveToWaitingChildren(activeKey, waitingChildrenKey, stalledKey, eventStreamKey,
          jobKey, jobId, timestamp, token)
      end
      return 1
    end    
  end
end
return -1
`,keys:7};e.s(["moveToWaitingChildren",0,tZ],82792),e.i(82792);let tX={name:"obliterate",content:`--[[
  Completely obliterates a queue and all of its contents
  This command completely destroys a queue including all of its jobs, current or past 
  leaving no trace of its existence. Since this script needs to iterate to find all the job
  keys, consider that this call may be slow for very large queues.
  The queue needs to be "paused" or it will return an error
  If the queue has currently active jobs then the script by default will return error,
  however this behaviour can be overridden using the 'force' option.
  Input:
    KEYS[1] meta
    KEYS[2] base
    ARGV[1] count
    ARGV[2] force
]]
local maxCount = tonumber(ARGV[1])
local baseKey = KEYS[2]
local rcall = redis.call
-- Includes
--[[
  Functions to remove jobs.
]]
-- Includes
--[[
  Function to remove job.
]]
-- Includes
--[[
  Function to remove deduplication key if needed
  when a job is being removed.
]]
local function removeDeduplicationKeyIfNeededOnRemoval(prefixKey,
  jobId, deduplicationId)
  if deduplicationId then
    local deduplicationKey = prefixKey .. "de:" .. deduplicationId
    local currentJobId = rcall('GET', deduplicationKey)
    if currentJobId and currentJobId == jobId then
      rcall("DEL", deduplicationKey)
      -- Also clean up any pending dedup-next data for this dedup ID
      rcall("DEL", prefixKey .. "dn:" .. deduplicationId)
      return 1
    end
  end
end
--[[
  Function to remove job keys.
]]
local function removeJobKeys(jobKey)
  return rcall("DEL", jobKey, jobKey .. ':logs', jobKey .. ':dependencies',
    jobKey .. ':processed', jobKey .. ':failed', jobKey .. ':unsuccessful')
end
--[[
  Check if this job has a parent. If so we will just remove it from
  the parent child list, but if it is the last child we should move the parent to "wait/paused"
  which requires code from "moveToFinished"
]]
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Functions to destructure job key.
  Just a bit of warning, these functions may be a bit slow and affect performance significantly.
]]
local getJobIdFromKey = function (jobKey)
  return string.match(jobKey, ".*:(.*)")
end
local getJobKeyPrefix = function (jobKey, jobId)
  return string.sub(jobKey, 0, #jobKey - #jobId)
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
local function _moveParentToWait(parentPrefix, parentId, emitEvent)
  local parentTarget, isPausedOrMaxed = getTargetQueueList(parentPrefix .. "meta", parentPrefix .. "active",
    parentPrefix .. "wait", parentPrefix .. "paused")
  addJobInTargetList(parentTarget, parentPrefix .. "marker", "RPUSH", isPausedOrMaxed, parentId)
  if emitEvent then
    local parentEventStream = parentPrefix .. "events"
    rcall("XADD", parentEventStream, "*", "event", "waiting", "jobId", parentId, "prev", "waiting-children")
  end
end
local function removeParentDependencyKey(jobKey, hard, parentKey, baseKey, debounceId)
  if parentKey then
    local parentDependenciesKey = parentKey .. ":dependencies"
    local result = rcall("SREM", parentDependenciesKey, jobKey)
    if result > 0 then
      local pendingDependencies = rcall("SCARD", parentDependenciesKey)
      if pendingDependencies == 0 then
        local parentId = getJobIdFromKey(parentKey)
        local parentPrefix = getJobKeyPrefix(parentKey, parentId)
        local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
        if numRemovedElements == 1 then
          if hard then -- remove parent in same queue
            if parentPrefix == baseKey then
              removeParentDependencyKey(parentKey, hard, nil, baseKey, nil)
              removeJobKeys(parentKey)
              if debounceId then
                rcall("DEL", parentPrefix .. "de:" .. debounceId)
              end
            else
              _moveParentToWait(parentPrefix, parentId)
            end
          else
            _moveParentToWait(parentPrefix, parentId, true)
          end
        end
      end
      return true
    end
  else
    local parentAttributes = rcall("HMGET", jobKey, "parentKey", "deid")
    local missedParentKey = parentAttributes[1]
    if( (type(missedParentKey) == "string") and missedParentKey ~= ""
      and (rcall("EXISTS", missedParentKey) == 1)) then
      local parentDependenciesKey = missedParentKey .. ":dependencies"
      local result = rcall("SREM", parentDependenciesKey, jobKey)
      if result > 0 then
        local pendingDependencies = rcall("SCARD", parentDependenciesKey)
        if pendingDependencies == 0 then
          local parentId = getJobIdFromKey(missedParentKey)
          local parentPrefix = getJobKeyPrefix(missedParentKey, parentId)
          local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
          if numRemovedElements == 1 then
            if hard then
              if parentPrefix == baseKey then
                removeParentDependencyKey(missedParentKey, hard, nil, baseKey, nil)
                removeJobKeys(missedParentKey)
                if parentAttributes[2] then
                  rcall("DEL", parentPrefix .. "de:" .. parentAttributes[2])
                end
              else
                _moveParentToWait(parentPrefix, parentId)
              end
            else
              _moveParentToWait(parentPrefix, parentId, true)
            end
          end
        end
        return true
      end
    end
  end
  return false
end
local function removeJob(jobId, hard, baseKey, shouldRemoveDeduplicationKey)
  local jobKey = baseKey .. jobId
  removeParentDependencyKey(jobKey, hard, nil, baseKey)
  if shouldRemoveDeduplicationKey then
    local deduplicationId = rcall("HGET", jobKey, "deid")
    removeDeduplicationKeyIfNeededOnRemoval(baseKey, jobId, deduplicationId)
  end
  removeJobKeys(jobKey)
end
local function removeJobs(keys, hard, baseKey, max)
  for i, key in ipairs(keys) do
    removeJob(key, hard, baseKey, true --[[remove debounce key]])
  end
  return max - #keys
end
--[[
  Functions to remove jobs.
]]
-- Includes
--[[
  Function to filter out jobs to ignore from a table.
]]
local function filterOutJobsToIgnore(jobs, jobsToIgnore)
  local filteredJobs = {}
  for i = 1, #jobs do
    if not jobsToIgnore[jobs[i]] then
      table.insert(filteredJobs, jobs[i])
    end
  end
  return filteredJobs
end
local function getListItems(keyName, max)
  return rcall('LRANGE', keyName, 0, max - 1)
end
local function removeListJobs(keyName, hard, baseKey, max, jobsToIgnore)
  local jobs = getListItems(keyName, max)
  if jobsToIgnore then
    jobs = filterOutJobsToIgnore(jobs, jobsToIgnore)
  end
  local count = removeJobs(jobs, hard, baseKey, max)
  rcall("LTRIM", keyName, #jobs, -1)
  return count
end
-- Includes
--[[
  Function to loop in batches.
  Just a bit of warning, some commands as ZREM
  could receive a maximum of 7000 parameters per call.
]]
local function batches(n, batchSize)
  local i = 0
  return function()
    local from = i * batchSize + 1
    i = i + 1
    if (from <= n) then
      local to = math.min(from + batchSize - 1, n)
      return from, to
    end
  end
end
--[[
  Function to get ZSet items.
]]
local function getZSetItems(keyName, max)
  return rcall('ZRANGE', keyName, 0, max - 1)
end
local function removeZSetJobs(keyName, hard, baseKey, max, jobsToIgnore)
  local jobs = getZSetItems(keyName, max)
  if jobsToIgnore then
    jobs = filterOutJobsToIgnore(jobs, jobsToIgnore)
  end
  local count = removeJobs(jobs, hard, baseKey, max)
  if(#jobs > 0) then
    for from, to in batches(#jobs, 7000) do
      rcall("ZREM", keyName, unpack(jobs, from, to))
    end
  end
  return count
end
local function removeLockKeys(keys)
  for i, key in ipairs(keys) do
    rcall("DEL", baseKey .. key .. ':lock')
  end
end
-- 1) Check if paused, if not return with error.
if rcall("HEXISTS", KEYS[1], "paused") ~= 1 then
  return -1 -- Error, NotPaused
end
-- 2) Check if there are active jobs, if there are and not "force" return error.
local activeKey = baseKey .. 'active'
local activeJobs = getListItems(activeKey, maxCount)
if (#activeJobs > 0) then
  if(ARGV[2] == "") then 
    return -2 -- Error, ExistActiveJobs
  end
end
removeLockKeys(activeJobs)
maxCount = removeJobs(activeJobs, true, baseKey, maxCount)
rcall("LTRIM", activeKey, #activeJobs, -1)
if(maxCount <= 0) then
  return 1
end
local delayedKey = baseKey .. 'delayed'
maxCount = removeZSetJobs(delayedKey, true, baseKey, maxCount)
if(maxCount <= 0) then
  return 1
end
local repeatKey = baseKey .. 'repeat'
local repeatJobsIds = getZSetItems(repeatKey, maxCount)
for i, key in ipairs(repeatJobsIds) do
  local jobKey = repeatKey .. ":" .. key
  rcall("DEL", jobKey)
end
if(#repeatJobsIds > 0) then
  for from, to in batches(#repeatJobsIds, 7000) do
    rcall("ZREM", repeatKey, unpack(repeatJobsIds, from, to))
  end
end
maxCount = maxCount - #repeatJobsIds
if(maxCount <= 0) then
  return 1
end
local completedKey = baseKey .. 'completed'
maxCount = removeZSetJobs(completedKey, true, baseKey, maxCount)
if(maxCount <= 0) then
  return 1
end
local pausedKey = baseKey .. 'paused'
maxCount = removeListJobs(pausedKey, true, baseKey, maxCount)
if(maxCount <= 0) then
  return 1
end
local prioritizedKey = baseKey .. 'prioritized'
maxCount = removeZSetJobs(prioritizedKey, true, baseKey, maxCount)
if(maxCount <= 0) then
  return 1
end
local failedKey = baseKey .. 'failed'
maxCount = removeZSetJobs(failedKey, true, baseKey, maxCount)
if(maxCount <= 0) then
  return 1
end
if(maxCount > 0) then
  rcall("DEL",
    baseKey .. 'events',
    baseKey .. 'delay',
    baseKey .. 'stalled-check',
    baseKey .. 'stalled',
    baseKey .. 'id',
    baseKey .. 'pc',
    baseKey .. 'marker',
    baseKey .. 'meta',
    baseKey .. 'metrics:completed',
    baseKey .. 'metrics:completed:data',
    baseKey .. 'metrics:failed',
    baseKey .. 'metrics:failed:data')
  return 0
else
  return 1
end
`,keys:2};e.s(["obliterate",0,tX],35933),e.i(35933);let t0={name:"paginate",content:`--[[
    Paginate a set or hash
    Input:
      KEYS[1] key pointing to the set or hash to be paginated.
      ARGV[1]  page start offset
      ARGV[2]  page end offset (-1 for all the elements)
      ARGV[3]  cursor
      ARGV[4]  offset
      ARGV[5]  max iterations
      ARGV[6]  fetch jobs?
    Output:
      [cursor, offset, items, numItems]
]]
local rcall = redis.call
-- Includes
--[[
  Function to achieve pagination for a set or hash.
  This function simulates pagination in the most efficient way possible
  for a set using sscan or hscan.
  The main limitation is that sets are not order preserving, so the
  pagination is not stable. This means that if the set is modified
  between pages, the same element may appear in different pages.
]] -- Maximum number of elements to be returned by sscan per iteration.
local maxCount = 100
-- Finds the cursor, and returns the first elements available for the requested page.
local function findPage(key, command, pageStart, pageSize, cursor, offset,
                        maxIterations, fetchJobs)
    local items = {}
    local jobs = {}
    local iterations = 0
    repeat
        -- Iterate over the set using sscan/hscan.
        local result = rcall(command, key, cursor, "COUNT", maxCount)
        cursor = result[1]
        local members = result[2]
        local step = 1
        if command == "HSCAN" then
            step = 2
        end
        if #members == 0 then
            -- If the result is empty, we can return the result.
            return cursor, offset, items, jobs
        end
        local chunkStart = offset
        local chunkEnd = offset + #members / step
        local pageEnd = pageStart + pageSize
        if chunkEnd < pageStart then
            -- If the chunk is before the page, we can skip it.
            offset = chunkEnd
        elseif chunkStart > pageEnd then
            -- If the chunk is after the page, we can return the result.
            return cursor, offset, items, jobs
        else
            -- If the chunk is overlapping the page, we need to add the elements to the result.
            for i = 1, #members, step do
                if offset >= pageEnd then
                    return cursor, offset, items, jobs
                end
                if offset >= pageStart then
                    local index = #items + 1
                    if fetchJobs ~= nil then
                        jobs[#jobs+1] = rcall("HGETALL", members[i])
                    end
                    if step == 2 then
                        items[index] = {members[i], members[i + 1]}
                    else
                        items[index] = members[i]
                    end
                end
                offset = offset + 1
            end
        end
        iterations = iterations + 1
    until cursor == "0" or iterations >= maxIterations
    return cursor, offset, items, jobs
end
local key = KEYS[1]
local scanCommand = "SSCAN"
local countCommand = "SCARD"
local type = rcall("TYPE", key)["ok"]
if type == "none" then
    return {0, 0, {}, 0}
elseif type == "hash" then
    scanCommand = "HSCAN"
    countCommand = "HLEN"
elseif type ~= "set" then
    return
        redis.error_reply("Pagination is only supported for sets and hashes.")
end
local numItems = rcall(countCommand, key)
local startOffset = tonumber(ARGV[1])
local endOffset = tonumber(ARGV[2])
if endOffset == -1 then 
  endOffset = numItems
end
local pageSize = (endOffset - startOffset) + 1
local cursor, offset, items, jobs = findPage(key, scanCommand, startOffset,
                                       pageSize, ARGV[3], tonumber(ARGV[4]),
                                       tonumber(ARGV[5]), ARGV[6])
return {cursor, offset, items, numItems, jobs}
`,keys:1};e.s(["paginate",0,t0],50518),e.i(50518);let t1={name:"pause",content:`--[[
  Pauses or resumes a queue globally.
  Input:
    KEYS[1] 'wait' or 'paused'
    KEYS[2] 'paused' or 'wait'
    KEYS[3] 'meta'
    KEYS[4] 'prioritized'
    KEYS[5] events stream key
    KEYS[6] 'delayed'
    KEYS[7] 'marker'
    ARGV[1] 'paused' or 'resumed'
  Event:
    publish paused or resumed event.
]]
local rcall = redis.call
-- Includes
--[[
  Add delay marker if needed.
]]
-- Includes
--[[
  Function to return the next delayed job timestamp.
]]
local function getNextDelayedTimestamp(delayedKey)
  local result = rcall("ZRANGE", delayedKey, 0, 0, "WITHSCORES")
  if #result then
    local nextTimestamp = tonumber(result[2])
    if nextTimestamp ~= nil then
      return nextTimestamp / 0x1000
    end
  end
end
local function addDelayMarkerIfNeeded(markerKey, delayedKey)
  local nextTimestamp = getNextDelayedTimestamp(delayedKey)
  if nextTimestamp ~= nil then
    -- Replace the score of the marker with the newest known
    -- next timestamp.
    rcall("ZADD", markerKey, nextTimestamp, "1")
  end
end
local markerKey = KEYS[7]
local hasJobs = rcall("EXISTS", KEYS[1]) == 1
--TODO: check this logic to be reused when changing a delay
if hasJobs then rcall("RENAME", KEYS[1], KEYS[2]) end
if ARGV[1] == "paused" then
    rcall("HSET", KEYS[3], "paused", 1)
    rcall("DEL", markerKey)
else
    rcall("HDEL", KEYS[3], "paused")
    if hasJobs or rcall("ZCARD", KEYS[4]) > 0 then
        -- Add marker if there are waiting or priority jobs
        rcall("ZADD", markerKey, 0, "0")
    else
        addDelayMarkerIfNeeded(markerKey, KEYS[6])
    end
end
rcall("XADD", KEYS[5], "*", "event", ARGV[1]);
`,keys:7};e.s(["pause",0,t1],77380),e.i(77380);let t2={name:"promote",content:`--[[
  Promotes a job that is currently "delayed" to the "waiting" state
    Input:
      KEYS[1] 'delayed'
      KEYS[2] 'wait'
      KEYS[3] 'paused'
      KEYS[4] 'meta'
      KEYS[5] 'prioritized'
      KEYS[6] 'active'
      KEYS[7] 'pc' priority counter
      KEYS[8] 'event stream'
      KEYS[9] 'marker'
      ARGV[1]  queue.toKey('')
      ARGV[2]  jobId
    Output:
       0 - OK
      -3 - Job not in delayed zset.
    Events:
      'waiting'
]]
local rcall = redis.call
local jobId = ARGV[2]
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to add job considering priority.
]]
-- Includes
--[[
  Function to get priority score.
]]
local function getPriorityScore(priority, priorityCounterKey)
  local prioCounter = rcall("INCR", priorityCounterKey)
  return priority * 0x100000000 + prioCounter % 0x100000000
end
local function addJobWithPriority(markerKey, prioritizedKey, priority, jobId, priorityCounterKey,
  isPausedOrMaxed)
  local score = getPriorityScore(priority, priorityCounterKey)
  rcall("ZADD", prioritizedKey, score, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
if rcall("ZREM", KEYS[1], jobId) == 1 then
    local jobKey = ARGV[1] .. jobId
    local priority = tonumber(rcall("HGET", jobKey, "priority")) or 0
    local metaKey = KEYS[4]
    local markerKey = KEYS[9]
    -- Remove delayed "marker" from the wait list if there is any.
    -- Since we are adding a job we do not need the marker anymore.
    -- Markers in waitlist DEPRECATED in v5: Remove in v6.
    local target, isPausedOrMaxed = getTargetQueueList(metaKey, KEYS[6], KEYS[2], KEYS[3])
    local marker = rcall("LINDEX", target, 0)
    if marker and string.sub(marker, 1, 2) == "0:" then rcall("LPOP", target) end
    if priority == 0 then
        -- LIFO or FIFO
        addJobInTargetList(target, markerKey, "LPUSH", isPausedOrMaxed, jobId)
    else
        addJobWithPriority(markerKey, KEYS[5], priority, jobId, KEYS[7], isPausedOrMaxed)
    end
    rcall("XADD", KEYS[8], "*", "event", "waiting", "jobId", jobId, "prev",
          "delayed");
    rcall("HSET", jobKey, "delay", 0)
    return 0
else
    return -3
end
`,keys:9};e.s(["promote",0,t2],30498),e.i(30498);let t3={name:"releaseLock",content:`--[[
  Release lock
    Input:
      KEYS[1] 'lock',
      ARGV[1]  token
      ARGV[2]  lock duration in milliseconds
    Output:
      "OK" if lock extended successfully.
]]
local rcall = redis.call
if rcall("GET", KEYS[1]) == ARGV[1] then
  return rcall("DEL", KEYS[1])
else
  return 0
end
`,keys:1};e.s(["releaseLock",0,t3],47776),e.i(47776);let t4={name:"removeChildDependency",content:`--[[
  Break parent-child dependency by removing
  child reference from parent
  Input:
    KEYS[1] 'key' prefix,
    ARGV[1] job key
    ARGV[2] parent key
    Output:
       0  - OK
       1  - There is not relationship.
      -1  - Missing job key
      -5  - Missing parent key
]]
local rcall = redis.call
local jobKey = ARGV[1]
local parentKey = ARGV[2]
-- Includes
--[[
  Check if this job has a parent. If so we will just remove it from
  the parent child list, but if it is the last child we should move the parent to "wait/paused"
  which requires code from "moveToFinished"
]]
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Functions to destructure job key.
  Just a bit of warning, these functions may be a bit slow and affect performance significantly.
]]
local getJobIdFromKey = function (jobKey)
  return string.match(jobKey, ".*:(.*)")
end
local getJobKeyPrefix = function (jobKey, jobId)
  return string.sub(jobKey, 0, #jobKey - #jobId)
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
--[[
  Function to remove job keys.
]]
local function removeJobKeys(jobKey)
  return rcall("DEL", jobKey, jobKey .. ':logs', jobKey .. ':dependencies',
    jobKey .. ':processed', jobKey .. ':failed', jobKey .. ':unsuccessful')
end
local function _moveParentToWait(parentPrefix, parentId, emitEvent)
  local parentTarget, isPausedOrMaxed = getTargetQueueList(parentPrefix .. "meta", parentPrefix .. "active",
    parentPrefix .. "wait", parentPrefix .. "paused")
  addJobInTargetList(parentTarget, parentPrefix .. "marker", "RPUSH", isPausedOrMaxed, parentId)
  if emitEvent then
    local parentEventStream = parentPrefix .. "events"
    rcall("XADD", parentEventStream, "*", "event", "waiting", "jobId", parentId, "prev", "waiting-children")
  end
end
local function removeParentDependencyKey(jobKey, hard, parentKey, baseKey, debounceId)
  if parentKey then
    local parentDependenciesKey = parentKey .. ":dependencies"
    local result = rcall("SREM", parentDependenciesKey, jobKey)
    if result > 0 then
      local pendingDependencies = rcall("SCARD", parentDependenciesKey)
      if pendingDependencies == 0 then
        local parentId = getJobIdFromKey(parentKey)
        local parentPrefix = getJobKeyPrefix(parentKey, parentId)
        local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
        if numRemovedElements == 1 then
          if hard then -- remove parent in same queue
            if parentPrefix == baseKey then
              removeParentDependencyKey(parentKey, hard, nil, baseKey, nil)
              removeJobKeys(parentKey)
              if debounceId then
                rcall("DEL", parentPrefix .. "de:" .. debounceId)
              end
            else
              _moveParentToWait(parentPrefix, parentId)
            end
          else
            _moveParentToWait(parentPrefix, parentId, true)
          end
        end
      end
      return true
    end
  else
    local parentAttributes = rcall("HMGET", jobKey, "parentKey", "deid")
    local missedParentKey = parentAttributes[1]
    if( (type(missedParentKey) == "string") and missedParentKey ~= ""
      and (rcall("EXISTS", missedParentKey) == 1)) then
      local parentDependenciesKey = missedParentKey .. ":dependencies"
      local result = rcall("SREM", parentDependenciesKey, jobKey)
      if result > 0 then
        local pendingDependencies = rcall("SCARD", parentDependenciesKey)
        if pendingDependencies == 0 then
          local parentId = getJobIdFromKey(missedParentKey)
          local parentPrefix = getJobKeyPrefix(missedParentKey, parentId)
          local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
          if numRemovedElements == 1 then
            if hard then
              if parentPrefix == baseKey then
                removeParentDependencyKey(missedParentKey, hard, nil, baseKey, nil)
                removeJobKeys(missedParentKey)
                if parentAttributes[2] then
                  rcall("DEL", parentPrefix .. "de:" .. parentAttributes[2])
                end
              else
                _moveParentToWait(parentPrefix, parentId)
              end
            else
              _moveParentToWait(parentPrefix, parentId, true)
            end
          end
        end
        return true
      end
    end
  end
  return false
end
if rcall("EXISTS", jobKey) ~= 1 then return -1 end
if rcall("EXISTS", parentKey) ~= 1 then return -5 end
if removeParentDependencyKey(jobKey, false, parentKey, KEYS[1], nil) then
  rcall("HDEL", jobKey, "parentKey", "parent")
  return 0
else
  return 1
end`,keys:1};e.s(["removeChildDependency",0,t4],90342),e.i(90342);let t6={name:"removeDeduplicationKey",content:`--[[
  Remove deduplication key if it matches the job id.
  Input:
    KEYS[1] deduplication key
    ARGV[1] job id
  Output:
    0 - false
    1 - true
]]
local rcall = redis.call
local deduplicationKey = KEYS[1]
local jobId = ARGV[1]
local currentJobId = rcall('GET', deduplicationKey)
if currentJobId and currentJobId == jobId then
  return rcall("DEL", deduplicationKey)
end
return 0
`,keys:1};e.s(["removeDeduplicationKey",0,t6],91933),e.i(91933);let t5={name:"removeJob",content:`--[[
    Remove a job from all the statuses it may be in as well as all its data.
    In order to be able to remove a job, it cannot be active.
    Input:
      KEYS[1] jobKey
      KEYS[2] repeat key
      ARGV[1] jobId
      ARGV[2] remove children
      ARGV[3] queue prefix
    Events:
      'removed'
]]
local rcall = redis.call
-- Includes
--[[
  Function to check if the job belongs to a job scheduler and
  current delayed job matches with jobId
]]
local function isJobSchedulerJob(jobId, jobKey, jobSchedulersKey)
  local repeatJobKey = rcall("HGET", jobKey, "rjk")
  if repeatJobKey  then
    local prevMillis = rcall("ZSCORE", jobSchedulersKey, repeatJobKey)
    if prevMillis then
      local currentDelayedJobId = "repeat:" .. repeatJobKey .. ":" .. prevMillis
      return jobId == currentDelayedJobId
    end
  end
  return false
end
--[[
  Function to recursively check if there are no locks
  on the jobs to be removed.
  returns:
    boolean
]]
--[[
  Functions to destructure job key.
  Just a bit of warning, these functions may be a bit slow and affect performance significantly.
]]
local getJobIdFromKey = function (jobKey)
  return string.match(jobKey, ".*:(.*)")
end
local getJobKeyPrefix = function (jobKey, jobId)
  return string.sub(jobKey, 0, #jobKey - #jobId)
end
local function isLocked( prefix, jobId, removeChildren)
  local jobKey = prefix .. jobId;
  -- Check if this job is locked
  local lockKey = jobKey .. ':lock'
  local lock = rcall("GET", lockKey)
  if not lock then
    if removeChildren == "1" then
      local dependencies = rcall("SMEMBERS", jobKey .. ":dependencies")
      if (#dependencies > 0) then
        for i, childJobKey in ipairs(dependencies) do
          -- We need to get the jobId for this job.
          local childJobId = getJobIdFromKey(childJobKey)
          local childJobPrefix = getJobKeyPrefix(childJobKey, childJobId)
          local result = isLocked( childJobPrefix, childJobId, removeChildren )
          if result then
            return true
          end
        end
      end
    end
    return false
  end
  return true
end
--[[
    Remove a job from all the statuses it may be in as well as all its data,
    including its children. Active children can be ignored.
    Events:
      'removed'
]]
local rcall = redis.call
-- Includes
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
--[[
  Function to remove deduplication key if needed
  when a job is being removed.
]]
local function removeDeduplicationKeyIfNeededOnRemoval(prefixKey,
  jobId, deduplicationId)
  if deduplicationId then
    local deduplicationKey = prefixKey .. "de:" .. deduplicationId
    local currentJobId = rcall('GET', deduplicationKey)
    if currentJobId and currentJobId == jobId then
      rcall("DEL", deduplicationKey)
      -- Also clean up any pending dedup-next data for this dedup ID
      rcall("DEL", prefixKey .. "dn:" .. deduplicationId)
      return 1
    end
  end
end
--[[
  Function to remove from any state.
  returns:
    prev state
]]
local function removeJobFromAnyState( prefix, jobId)
  -- We start with the ZSCORE checks, since they have O(1) complexity
  if rcall("ZSCORE", prefix .. "completed", jobId) then
    rcall("ZREM", prefix .. "completed", jobId)
    return "completed"
  elseif rcall("ZSCORE", prefix .. "waiting-children", jobId) then
    rcall("ZREM", prefix .. "waiting-children", jobId)
    return "waiting-children"
  elseif rcall("ZSCORE", prefix .. "delayed", jobId) then
    rcall("ZREM", prefix .. "delayed", jobId)
    return "delayed"
  elseif rcall("ZSCORE", prefix .. "failed", jobId) then
    rcall("ZREM", prefix .. "failed", jobId)
    return "failed"
  elseif rcall("ZSCORE", prefix .. "prioritized", jobId) then
    rcall("ZREM", prefix .. "prioritized", jobId)
    return "prioritized"
  -- We remove only 1 element from the list, since we assume they are not added multiple times
  elseif rcall("LREM", prefix .. "wait", 1, jobId) == 1 then
    return "wait"
  elseif rcall("LREM", prefix .. "paused", 1, jobId) == 1 then
    return "paused"
  elseif rcall("LREM", prefix .. "active", 1, jobId) == 1 then
    return "active"
  end
  return "unknown"
end
--[[
  Function to remove job keys.
]]
local function removeJobKeys(jobKey)
  return rcall("DEL", jobKey, jobKey .. ':logs', jobKey .. ':dependencies',
    jobKey .. ':processed', jobKey .. ':failed', jobKey .. ':unsuccessful')
end
--[[
  Check if this job has a parent. If so we will just remove it from
  the parent child list, but if it is the last child we should move the parent to "wait/paused"
  which requires code from "moveToFinished"
]]
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
local function _moveParentToWait(parentPrefix, parentId, emitEvent)
  local parentTarget, isPausedOrMaxed = getTargetQueueList(parentPrefix .. "meta", parentPrefix .. "active",
    parentPrefix .. "wait", parentPrefix .. "paused")
  addJobInTargetList(parentTarget, parentPrefix .. "marker", "RPUSH", isPausedOrMaxed, parentId)
  if emitEvent then
    local parentEventStream = parentPrefix .. "events"
    rcall("XADD", parentEventStream, "*", "event", "waiting", "jobId", parentId, "prev", "waiting-children")
  end
end
local function removeParentDependencyKey(jobKey, hard, parentKey, baseKey, debounceId)
  if parentKey then
    local parentDependenciesKey = parentKey .. ":dependencies"
    local result = rcall("SREM", parentDependenciesKey, jobKey)
    if result > 0 then
      local pendingDependencies = rcall("SCARD", parentDependenciesKey)
      if pendingDependencies == 0 then
        local parentId = getJobIdFromKey(parentKey)
        local parentPrefix = getJobKeyPrefix(parentKey, parentId)
        local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
        if numRemovedElements == 1 then
          if hard then -- remove parent in same queue
            if parentPrefix == baseKey then
              removeParentDependencyKey(parentKey, hard, nil, baseKey, nil)
              removeJobKeys(parentKey)
              if debounceId then
                rcall("DEL", parentPrefix .. "de:" .. debounceId)
              end
            else
              _moveParentToWait(parentPrefix, parentId)
            end
          else
            _moveParentToWait(parentPrefix, parentId, true)
          end
        end
      end
      return true
    end
  else
    local parentAttributes = rcall("HMGET", jobKey, "parentKey", "deid")
    local missedParentKey = parentAttributes[1]
    if( (type(missedParentKey) == "string") and missedParentKey ~= ""
      and (rcall("EXISTS", missedParentKey) == 1)) then
      local parentDependenciesKey = missedParentKey .. ":dependencies"
      local result = rcall("SREM", parentDependenciesKey, jobKey)
      if result > 0 then
        local pendingDependencies = rcall("SCARD", parentDependenciesKey)
        if pendingDependencies == 0 then
          local parentId = getJobIdFromKey(missedParentKey)
          local parentPrefix = getJobKeyPrefix(missedParentKey, parentId)
          local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
          if numRemovedElements == 1 then
            if hard then
              if parentPrefix == baseKey then
                removeParentDependencyKey(missedParentKey, hard, nil, baseKey, nil)
                removeJobKeys(missedParentKey)
                if parentAttributes[2] then
                  rcall("DEL", parentPrefix .. "de:" .. parentAttributes[2])
                end
              else
                _moveParentToWait(parentPrefix, parentId)
              end
            else
              _moveParentToWait(parentPrefix, parentId, true)
            end
          end
        end
        return true
      end
    end
  end
  return false
end
local removeJobChildren
local removeJobWithChildren
removeJobChildren = function(prefix, jobKey, options)
    -- Check if this job has children
    -- If so, we are going to try to remove the children recursively in a depth-first way
    -- because if some job is locked, we must exit with an error.
    if not options.ignoreProcessed then
        local processed = rcall("HGETALL", jobKey .. ":processed")
        if #processed > 0 then
            for i = 1, #processed, 2 do
                local childJobId = getJobIdFromKey(processed[i])
                local childJobPrefix = getJobKeyPrefix(processed[i], childJobId)
                removeJobWithChildren(childJobPrefix, childJobId, jobKey, options)
            end
        end
        local failed = rcall("HGETALL", jobKey .. ":failed")
        if #failed > 0 then
            for i = 1, #failed, 2 do
                local childJobId = getJobIdFromKey(failed[i])
                local childJobPrefix = getJobKeyPrefix(failed[i], childJobId)
                removeJobWithChildren(childJobPrefix, childJobId, jobKey, options)
            end
        end
        local unsuccessful = rcall("ZRANGE", jobKey .. ":unsuccessful", 0, -1)
        if #unsuccessful > 0 then
            for i = 1, #unsuccessful, 1 do
                local childJobId = getJobIdFromKey(unsuccessful[i])
                local childJobPrefix = getJobKeyPrefix(unsuccessful[i], childJobId)
                removeJobWithChildren(childJobPrefix, childJobId, jobKey, options)
            end
        end
    end
    local dependencies = rcall("SMEMBERS", jobKey .. ":dependencies")
    if #dependencies > 0 then
        for i, childJobKey in ipairs(dependencies) do
            local childJobId = getJobIdFromKey(childJobKey)
            local childJobPrefix = getJobKeyPrefix(childJobKey, childJobId)
            removeJobWithChildren(childJobPrefix, childJobId, jobKey, options)
        end
    end
end
removeJobWithChildren = function(prefix, jobId, parentKey, options)
    local jobKey = prefix .. jobId
    if options.ignoreLocked then
        if isLocked(prefix, jobId) then
            return
        end
    end
    -- Check if job is in the failed zset
    local failedSet = prefix .. "failed"
    if not (options.ignoreProcessed and rcall("ZSCORE", failedSet, jobId)) then
        removeParentDependencyKey(jobKey, false, parentKey, nil)
        if options.removeChildren then
            removeJobChildren(prefix, jobKey, options)
        end
        local prev = removeJobFromAnyState(prefix, jobId)
        local deduplicationId = rcall("HGET", jobKey, "deid")
        removeDeduplicationKeyIfNeededOnRemoval(prefix, jobId, deduplicationId)
        if removeJobKeys(jobKey) > 0 then
            local metaKey = prefix .. "meta"
            local maxEvents = getOrSetMaxEvents(metaKey)
            rcall("XADD", prefix .. "events", "MAXLEN", "~", maxEvents, "*", "event", "removed",
                "jobId", jobId, "prev", prev)
        end
    end
end
local jobId = ARGV[1]
local shouldRemoveChildren = ARGV[2]
local prefix = ARGV[3]
local jobKey = KEYS[1]
local repeatKey = KEYS[2]
if isJobSchedulerJob(jobId, jobKey, repeatKey) then
    return -8
end
if not isLocked(prefix, jobId, shouldRemoveChildren) then
    local options = {
        removeChildren = shouldRemoveChildren == "1",
        ignoreProcessed = false,
        ignoreLocked = false
    }
    removeJobWithChildren(prefix, jobId, nil, options)
    return 1
end
return 0
`,keys:2};e.s(["removeJob",0,t5],25665),e.i(25665);let t8={name:"removeJobScheduler",content:`--[[
  Removes a job scheduler and its next scheduled job.
  Input:
    KEYS[1] job schedulers key
    KEYS[2] delayed jobs key
    KEYS[3] events key
    ARGV[1] job scheduler id
    ARGV[2] prefix key
  Output:
    0 - OK
    1 - Missing repeat job
  Events:
    'removed'
]]
local rcall = redis.call
-- Includes
--[[
  Function to remove job keys.
]]
local function removeJobKeys(jobKey)
  return rcall("DEL", jobKey, jobKey .. ':logs', jobKey .. ':dependencies',
    jobKey .. ':processed', jobKey .. ':failed', jobKey .. ':unsuccessful')
end
local jobSchedulerId = ARGV[1]
local prefix = ARGV[2]
local millis = rcall("ZSCORE", KEYS[1], jobSchedulerId)
if millis then
  -- Delete next programmed job.
  local delayedJobId = "repeat:" .. jobSchedulerId .. ":" .. millis
  if(rcall("ZREM", KEYS[2], delayedJobId) == 1) then
    removeJobKeys(prefix .. delayedJobId)
    rcall("XADD", KEYS[3], "*", "event", "removed", "jobId", delayedJobId, "prev", "delayed")
  end
end
if(rcall("ZREM", KEYS[1], jobSchedulerId) == 1) then
  rcall("DEL", KEYS[1] .. ":" .. jobSchedulerId)
  return 0
end
return 1
`,keys:3};e.s(["removeJobScheduler",0,t8],73024),e.i(73024);let t9={name:"removeOrphanedJobs",content:`--[[
  Removes orphaned job keys that exist in Redis but are not referenced
  in any queue state set. Checks each candidate atomically.
  Input:
    KEYS[1]  base prefix key including trailing colon (e.g. bull:queueName:)
    ARGV[1]  number of state key suffixes
    ARGV[2 .. 1+N]  state key suffixes (e.g. active, wait, completed, ...)
    ARGV[2+N]  number of job sub-key suffixes
    ARGV[3+N .. 2+N+M]  job sub-key suffixes (e.g. logs, dependencies, ...)
    ARGV[3+N+M .. end]  candidate job IDs to check
  Output:
    number of removed jobs
]]
local rcall = redis.call
local basePrefix = KEYS[1]
-- Parse state key suffixes and cache their full key names + types.
local stateKeyCount = tonumber(ARGV[1])
local stateKeys = {}
local stateKeyTypes = {}
for i = 1, stateKeyCount do
  local fullKey = basePrefix .. ARGV[1 + i]
  stateKeys[i] = fullKey
  stateKeyTypes[i] = rcall('TYPE', fullKey)['ok']
end
-- Parse job sub-key suffixes.
local subKeyCountIdx = 2 + stateKeyCount
local subKeyCount = tonumber(ARGV[subKeyCountIdx])
local subKeySuffixes = {}
for i = 1, subKeyCount do
  subKeySuffixes[i] = ARGV[subKeyCountIdx + i]
end
-- Process candidate job IDs.
local candidateStart = subKeyCountIdx + subKeyCount + 1
local removedCount = 0
for c = candidateStart, #ARGV do
  local jobId = ARGV[c]
  local found = false
  for i = 1, stateKeyCount do
    local kt = stateKeyTypes[i]
    if kt == 'list' then
      if rcall('LPOS', stateKeys[i], jobId) then
        found = true
        break
      end
    elseif kt == 'zset' then
      if rcall('ZSCORE', stateKeys[i], jobId) then
        found = true
        break
      end
    elseif kt == 'set' then
      if rcall('SISMEMBER', stateKeys[i], jobId) == 1 then
        found = true
        break
      end
    end
  end
  if not found then
    local jobKey = basePrefix .. jobId
    local keysToDelete = { jobKey }
    for _, suffix in ipairs(subKeySuffixes) do
      keysToDelete[#keysToDelete + 1] = jobKey .. ':' .. suffix
    end
    rcall('DEL', unpack(keysToDelete))
    removedCount = removedCount + 1
  end
end
return removedCount
`,keys:1};e.s(["removeOrphanedJobs",0,t9],33962),e.i(33962);let t7={name:"removeRepeatable",content:`--[[
  Removes a repeatable job
  Input:
    KEYS[1] repeat jobs key
    KEYS[2] delayed jobs key
    KEYS[3] events key
    ARGV[1] old repeat job id
    ARGV[2] options concat
    ARGV[3] repeat job key
    ARGV[4] prefix key
  Output:
    0 - OK
    1 - Missing repeat job
  Events:
    'removed'
]]
local rcall = redis.call
local millis = rcall("ZSCORE", KEYS[1], ARGV[2])
-- Includes
--[[
  Function to remove job keys.
]]
local function removeJobKeys(jobKey)
  return rcall("DEL", jobKey, jobKey .. ':logs', jobKey .. ':dependencies',
    jobKey .. ':processed', jobKey .. ':failed', jobKey .. ':unsuccessful')
end
-- legacy removal TODO: remove in next breaking change
if millis then
  -- Delete next programmed job.
  local repeatJobId = ARGV[1] .. millis
  if(rcall("ZREM", KEYS[2], repeatJobId) == 1) then
    removeJobKeys(ARGV[4] .. repeatJobId)
    rcall("XADD", KEYS[3], "*", "event", "removed", "jobId", repeatJobId, "prev", "delayed");
  end
end
if(rcall("ZREM", KEYS[1], ARGV[2]) == 1) then
  return 0
end
-- new removal
millis = rcall("ZSCORE", KEYS[1], ARGV[3])
if millis then
  -- Delete next programmed job.
  local repeatJobId = "repeat:" .. ARGV[3] .. ":" .. millis
  if(rcall("ZREM", KEYS[2], repeatJobId) == 1) then
    removeJobKeys(ARGV[4] .. repeatJobId)
    rcall("XADD", KEYS[3], "*", "event", "removed", "jobId", repeatJobId, "prev", "delayed")
  end
end
if(rcall("ZREM", KEYS[1], ARGV[3]) == 1) then
  rcall("DEL", KEYS[1] .. ":" .. ARGV[3])
  return 0
end
return 1
`,keys:3};e.s(["removeRepeatable",0,t7],66357),e.i(66357);let re={name:"removeUnprocessedChildren",content:`--[[
    Remove a job from all the statuses it may be in as well as all its data.
    In order to be able to remove a job, it cannot be active.
    Input:
      KEYS[1] jobKey
      KEYS[2] meta key
      ARGV[1] prefix
      ARGV[2] jobId
    Events:
      'removed' for every children removed
]]
-- Includes
--[[
    Remove a job from all the statuses it may be in as well as all its data,
    including its children. Active children can be ignored.
    Events:
      'removed'
]]
local rcall = redis.call
-- Includes
--[[
  Functions to destructure job key.
  Just a bit of warning, these functions may be a bit slow and affect performance significantly.
]]
local getJobIdFromKey = function (jobKey)
  return string.match(jobKey, ".*:(.*)")
end
local getJobKeyPrefix = function (jobKey, jobId)
  return string.sub(jobKey, 0, #jobKey - #jobId)
end
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
--[[
  Function to check if the job belongs to a job scheduler and
  current delayed job matches with jobId
]]
local function isJobSchedulerJob(jobId, jobKey, jobSchedulersKey)
  local repeatJobKey = rcall("HGET", jobKey, "rjk")
  if repeatJobKey  then
    local prevMillis = rcall("ZSCORE", jobSchedulersKey, repeatJobKey)
    if prevMillis then
      local currentDelayedJobId = "repeat:" .. repeatJobKey .. ":" .. prevMillis
      return jobId == currentDelayedJobId
    end
  end
  return false
end
--[[
  Function to remove deduplication key if needed
  when a job is being removed.
]]
local function removeDeduplicationKeyIfNeededOnRemoval(prefixKey,
  jobId, deduplicationId)
  if deduplicationId then
    local deduplicationKey = prefixKey .. "de:" .. deduplicationId
    local currentJobId = rcall('GET', deduplicationKey)
    if currentJobId and currentJobId == jobId then
      rcall("DEL", deduplicationKey)
      -- Also clean up any pending dedup-next data for this dedup ID
      rcall("DEL", prefixKey .. "dn:" .. deduplicationId)
      return 1
    end
  end
end
--[[
  Function to remove from any state.
  returns:
    prev state
]]
local function removeJobFromAnyState( prefix, jobId)
  -- We start with the ZSCORE checks, since they have O(1) complexity
  if rcall("ZSCORE", prefix .. "completed", jobId) then
    rcall("ZREM", prefix .. "completed", jobId)
    return "completed"
  elseif rcall("ZSCORE", prefix .. "waiting-children", jobId) then
    rcall("ZREM", prefix .. "waiting-children", jobId)
    return "waiting-children"
  elseif rcall("ZSCORE", prefix .. "delayed", jobId) then
    rcall("ZREM", prefix .. "delayed", jobId)
    return "delayed"
  elseif rcall("ZSCORE", prefix .. "failed", jobId) then
    rcall("ZREM", prefix .. "failed", jobId)
    return "failed"
  elseif rcall("ZSCORE", prefix .. "prioritized", jobId) then
    rcall("ZREM", prefix .. "prioritized", jobId)
    return "prioritized"
  -- We remove only 1 element from the list, since we assume they are not added multiple times
  elseif rcall("LREM", prefix .. "wait", 1, jobId) == 1 then
    return "wait"
  elseif rcall("LREM", prefix .. "paused", 1, jobId) == 1 then
    return "paused"
  elseif rcall("LREM", prefix .. "active", 1, jobId) == 1 then
    return "active"
  end
  return "unknown"
end
--[[
  Function to remove job keys.
]]
local function removeJobKeys(jobKey)
  return rcall("DEL", jobKey, jobKey .. ':logs', jobKey .. ':dependencies',
    jobKey .. ':processed', jobKey .. ':failed', jobKey .. ':unsuccessful')
end
--[[
  Check if this job has a parent. If so we will just remove it from
  the parent child list, but if it is the last child we should move the parent to "wait/paused"
  which requires code from "moveToFinished"
]]
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
local function _moveParentToWait(parentPrefix, parentId, emitEvent)
  local parentTarget, isPausedOrMaxed = getTargetQueueList(parentPrefix .. "meta", parentPrefix .. "active",
    parentPrefix .. "wait", parentPrefix .. "paused")
  addJobInTargetList(parentTarget, parentPrefix .. "marker", "RPUSH", isPausedOrMaxed, parentId)
  if emitEvent then
    local parentEventStream = parentPrefix .. "events"
    rcall("XADD", parentEventStream, "*", "event", "waiting", "jobId", parentId, "prev", "waiting-children")
  end
end
local function removeParentDependencyKey(jobKey, hard, parentKey, baseKey, debounceId)
  if parentKey then
    local parentDependenciesKey = parentKey .. ":dependencies"
    local result = rcall("SREM", parentDependenciesKey, jobKey)
    if result > 0 then
      local pendingDependencies = rcall("SCARD", parentDependenciesKey)
      if pendingDependencies == 0 then
        local parentId = getJobIdFromKey(parentKey)
        local parentPrefix = getJobKeyPrefix(parentKey, parentId)
        local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
        if numRemovedElements == 1 then
          if hard then -- remove parent in same queue
            if parentPrefix == baseKey then
              removeParentDependencyKey(parentKey, hard, nil, baseKey, nil)
              removeJobKeys(parentKey)
              if debounceId then
                rcall("DEL", parentPrefix .. "de:" .. debounceId)
              end
            else
              _moveParentToWait(parentPrefix, parentId)
            end
          else
            _moveParentToWait(parentPrefix, parentId, true)
          end
        end
      end
      return true
    end
  else
    local parentAttributes = rcall("HMGET", jobKey, "parentKey", "deid")
    local missedParentKey = parentAttributes[1]
    if( (type(missedParentKey) == "string") and missedParentKey ~= ""
      and (rcall("EXISTS", missedParentKey) == 1)) then
      local parentDependenciesKey = missedParentKey .. ":dependencies"
      local result = rcall("SREM", parentDependenciesKey, jobKey)
      if result > 0 then
        local pendingDependencies = rcall("SCARD", parentDependenciesKey)
        if pendingDependencies == 0 then
          local parentId = getJobIdFromKey(missedParentKey)
          local parentPrefix = getJobKeyPrefix(missedParentKey, parentId)
          local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
          if numRemovedElements == 1 then
            if hard then
              if parentPrefix == baseKey then
                removeParentDependencyKey(missedParentKey, hard, nil, baseKey, nil)
                removeJobKeys(missedParentKey)
                if parentAttributes[2] then
                  rcall("DEL", parentPrefix .. "de:" .. parentAttributes[2])
                end
              else
                _moveParentToWait(parentPrefix, parentId)
              end
            else
              _moveParentToWait(parentPrefix, parentId, true)
            end
          end
        end
        return true
      end
    end
  end
  return false
end
--[[
  Function to recursively check if there are no locks
  on the jobs to be removed.
  returns:
    boolean
]]
local function isLocked( prefix, jobId, removeChildren)
  local jobKey = prefix .. jobId;
  -- Check if this job is locked
  local lockKey = jobKey .. ':lock'
  local lock = rcall("GET", lockKey)
  if not lock then
    if removeChildren == "1" then
      local dependencies = rcall("SMEMBERS", jobKey .. ":dependencies")
      if (#dependencies > 0) then
        for i, childJobKey in ipairs(dependencies) do
          -- We need to get the jobId for this job.
          local childJobId = getJobIdFromKey(childJobKey)
          local childJobPrefix = getJobKeyPrefix(childJobKey, childJobId)
          local result = isLocked( childJobPrefix, childJobId, removeChildren )
          if result then
            return true
          end
        end
      end
    end
    return false
  end
  return true
end
local removeJobChildren
local removeJobWithChildren
removeJobChildren = function(prefix, jobKey, options)
    -- Check if this job has children
    -- If so, we are going to try to remove the children recursively in a depth-first way
    -- because if some job is locked, we must exit with an error.
    if not options.ignoreProcessed then
        local processed = rcall("HGETALL", jobKey .. ":processed")
        if #processed > 0 then
            for i = 1, #processed, 2 do
                local childJobId = getJobIdFromKey(processed[i])
                local childJobPrefix = getJobKeyPrefix(processed[i], childJobId)
                removeJobWithChildren(childJobPrefix, childJobId, jobKey, options)
            end
        end
        local failed = rcall("HGETALL", jobKey .. ":failed")
        if #failed > 0 then
            for i = 1, #failed, 2 do
                local childJobId = getJobIdFromKey(failed[i])
                local childJobPrefix = getJobKeyPrefix(failed[i], childJobId)
                removeJobWithChildren(childJobPrefix, childJobId, jobKey, options)
            end
        end
        local unsuccessful = rcall("ZRANGE", jobKey .. ":unsuccessful", 0, -1)
        if #unsuccessful > 0 then
            for i = 1, #unsuccessful, 1 do
                local childJobId = getJobIdFromKey(unsuccessful[i])
                local childJobPrefix = getJobKeyPrefix(unsuccessful[i], childJobId)
                removeJobWithChildren(childJobPrefix, childJobId, jobKey, options)
            end
        end
    end
    local dependencies = rcall("SMEMBERS", jobKey .. ":dependencies")
    if #dependencies > 0 then
        for i, childJobKey in ipairs(dependencies) do
            local childJobId = getJobIdFromKey(childJobKey)
            local childJobPrefix = getJobKeyPrefix(childJobKey, childJobId)
            removeJobWithChildren(childJobPrefix, childJobId, jobKey, options)
        end
    end
end
removeJobWithChildren = function(prefix, jobId, parentKey, options)
    local jobKey = prefix .. jobId
    if options.ignoreLocked then
        if isLocked(prefix, jobId) then
            return
        end
    end
    -- Check if job is in the failed zset
    local failedSet = prefix .. "failed"
    if not (options.ignoreProcessed and rcall("ZSCORE", failedSet, jobId)) then
        removeParentDependencyKey(jobKey, false, parentKey, nil)
        if options.removeChildren then
            removeJobChildren(prefix, jobKey, options)
        end
        local prev = removeJobFromAnyState(prefix, jobId)
        local deduplicationId = rcall("HGET", jobKey, "deid")
        removeDeduplicationKeyIfNeededOnRemoval(prefix, jobId, deduplicationId)
        if removeJobKeys(jobKey) > 0 then
            local metaKey = prefix .. "meta"
            local maxEvents = getOrSetMaxEvents(metaKey)
            rcall("XADD", prefix .. "events", "MAXLEN", "~", maxEvents, "*", "event", "removed",
                "jobId", jobId, "prev", prev)
        end
    end
end
local prefix = ARGV[1]
local jobId = ARGV[2]
local jobKey = KEYS[1]
local metaKey = KEYS[2]
local options = {
  removeChildren = "1",
  ignoreProcessed = true,
  ignoreLocked = true
}
removeJobChildren(prefix, jobKey, options) 
`,keys:2};e.s(["removeUnprocessedChildren",0,re],72997),e.i(72997);let rt={name:"reprocessJob",content:`--[[
  Attempts to reprocess a job
  Input:
    KEYS[1] job key
    KEYS[2] events stream
    KEYS[3] job state
    KEYS[4] wait key
    KEYS[5] meta
    KEYS[6] paused key
    KEYS[7] active key
    KEYS[8] marker key
    ARGV[1] job.id
    ARGV[2] (job.opts.lifo ? 'R' : 'L') + 'PUSH'
    ARGV[3] propVal - failedReason/returnvalue
    ARGV[4] prev state - failed/completed
    ARGV[5] reset attemptsMade - "1" or "0"
    ARGV[6] reset attemptsStarted - "1" or "0"
  Output:
     1 means the operation was a success
    -1 means the job does not exist
    -3 means the job was not found in the expected set.
]]
local rcall = redis.call;
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
local jobKey = KEYS[1]
if rcall("EXISTS", jobKey) == 1 then
  local jobId = ARGV[1]
  if (rcall("ZREM", KEYS[3], jobId) == 1) then
    local attributesToRemove = {}
    if ARGV[5] == "1" then
      table.insert(attributesToRemove, "atm")
    end
    if ARGV[6] == "1" then
      table.insert(attributesToRemove, "ats")
    end
    rcall("HDEL", jobKey, "finishedOn", "processedOn", ARGV[3], unpack(attributesToRemove))
    local target, isPausedOrMaxed = getTargetQueueList(KEYS[5], KEYS[7], KEYS[4], KEYS[6])
    addJobInTargetList(target, KEYS[8], ARGV[2], isPausedOrMaxed, jobId)
    local parentKey = rcall("HGET", jobKey, "parentKey")
    if parentKey and rcall("EXISTS", parentKey) == 1 then
      if ARGV[4] == "failed" then
        if rcall("ZREM", parentKey .. ":unsuccessful", jobKey) == 1 or
          rcall("HDEL", parentKey .. ":failed", jobKey) == 1 then
          rcall("SADD", parentKey .. ":dependencies", jobKey)
        end
      else
        if rcall("HDEL", parentKey .. ":processed", jobKey) == 1 then
          rcall("SADD", parentKey .. ":dependencies", jobKey)
        end
      end
    end
    local maxEvents = getOrSetMaxEvents(KEYS[5])
    -- Emit waiting event
    rcall("XADD", KEYS[2], "MAXLEN", "~", maxEvents, "*", "event", "waiting",
      "jobId", jobId, "prev", ARGV[4]);
    return 1
  else
    return -3
  end
else
  return -1
end
`,keys:8};e.s(["reprocessJob",0,rt],87721),e.i(87721);let rr={name:"retryJob",content:`--[[
  Retries a failed job by moving it back to the wait queue.
    Input:
      KEYS[1]  'active',
      KEYS[2]  'wait'
      KEYS[3]  'paused'
      KEYS[4]  job key
      KEYS[5]  'meta'
      KEYS[6]  events stream
      KEYS[7]  delayed key
      KEYS[8]  prioritized key
      KEYS[9]  'pc' priority counter
      KEYS[10] 'marker'
      KEYS[11] 'stalled'
      ARGV[1]  key prefix
      ARGV[2]  timestamp
      ARGV[3]  pushCmd
      ARGV[4]  jobId
      ARGV[5]  token
      ARGV[6]  optional job fields to update
    Events:
      'waiting'
    Output:
     0  - OK
     -1 - Missing key
     -2 - Missing lock
     -3 - Job not in active set
]]
local rcall = redis.call
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to add job considering priority.
]]
-- Includes
--[[
  Function to get priority score.
]]
local function getPriorityScore(priority, priorityCounterKey)
  local prioCounter = rcall("INCR", priorityCounterKey)
  return priority * 0x100000000 + prioCounter % 0x100000000
end
local function addJobWithPriority(markerKey, prioritizedKey, priority, jobId, priorityCounterKey,
  isPausedOrMaxed)
  local score = getPriorityScore(priority, priorityCounterKey)
  rcall("ZADD", prioritizedKey, score, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
--[[
  Function to check if queue is paused or maxed
  (since an empty list and !EXISTS are not really the same).
]]
local function isQueuePausedOrMaxed(queueMetaKey, activeKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency")
  if queueAttributes[1] then
    return true
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      return activeCount >= tonumber(queueAttributes[2])
    end
  end
  return false
end
--[[
  Updates the delay set, by moving delayed jobs that should
  be processed now to "wait".
     Events:
      'waiting'
]]
-- Includes
-- Try to get as much as 1000 jobs at once
local function promoteDelayedJobs(delayedKey, markerKey, targetKey, prioritizedKey,
                                  eventStreamKey, prefix, timestamp, priorityCounterKey, isPaused)
    local jobs = rcall("ZRANGEBYSCORE", delayedKey, 0, (timestamp + 1) * 0x1000 - 1, "LIMIT", 0, 1000)
    if (#jobs > 0) then
        rcall("ZREM", delayedKey, unpack(jobs))
        for _, jobId in ipairs(jobs) do
            local jobKey = prefix .. jobId
            local priority =
                tonumber(rcall("HGET", jobKey, "priority")) or 0
            if priority == 0 then
                -- LIFO or FIFO
                rcall("LPUSH", targetKey, jobId)
            else
                local score = getPriorityScore(priority, priorityCounterKey)
                rcall("ZADD", prioritizedKey, score, jobId)
            end
            -- Emit waiting event
            rcall("XADD", eventStreamKey, "*", "event", "waiting", "jobId",
                  jobId, "prev", "delayed")
            rcall("HSET", jobKey, "delay", 0)
        end
        addBaseMarkerIfNeeded(markerKey, isPaused)
    end
end
local function removeLock(jobKey, stalledKey, token, jobId)
  if token ~= "0" then
    local lockKey = jobKey .. ':lock'
    local lockToken = rcall("GET", lockKey)
    if lockToken == token then
      rcall("DEL", lockKey)
      rcall("SREM", stalledKey, jobId)
    else
      if lockToken then
        -- Lock exists but token does not match
        return -6
      else
        -- Lock is missing completely
        return -2
      end
    end
  end
  return 0
end
--[[
  Function to update a bunch of fields in a job.
]]
local function updateJobFields(jobKey, msgpackedFields)
  if msgpackedFields and #msgpackedFields > 0 then
    local fieldsToUpdate = cmsgpack.unpack(msgpackedFields)
    if fieldsToUpdate then
      rcall("HMSET", jobKey, unpack(fieldsToUpdate))
    end
  end
end
local target, isPausedOrMaxed = getTargetQueueList(KEYS[5], KEYS[1], KEYS[2], KEYS[3])
local markerKey = KEYS[10]
-- Check if there are delayed jobs that we can move to wait.
-- test example: when there are delayed jobs between retries
promoteDelayedJobs(KEYS[7], markerKey, target, KEYS[8], KEYS[6], ARGV[1], ARGV[2], KEYS[9], isPausedOrMaxed)
local jobKey = KEYS[4]
if rcall("EXISTS", jobKey) == 1 then
  local errorCode = removeLock(jobKey, KEYS[11], ARGV[5], ARGV[4]) 
  if errorCode < 0 then
    return errorCode
  end
  updateJobFields(jobKey, ARGV[6])
  local numRemovedElements = rcall("LREM", KEYS[1], -1, ARGV[4])
  if (numRemovedElements < 1) then return -3 end
  local priority = tonumber(rcall("HGET", jobKey, "priority")) or 0
  --need to re-evaluate after removing job from active
  isPausedOrMaxed = isQueuePausedOrMaxed(KEYS[5], KEYS[1])
  -- Standard or priority add
  if priority == 0 then
    addJobInTargetList(target, markerKey, ARGV[3], isPausedOrMaxed, ARGV[4])
  else
    addJobWithPriority(markerKey, KEYS[8], priority, ARGV[4], KEYS[9], isPausedOrMaxed)
  end
  rcall("HINCRBY", jobKey, "atm", 1)
  local maxEvents = getOrSetMaxEvents(KEYS[5])
  -- Emit waiting event
  rcall("XADD", KEYS[6], "MAXLEN", "~", maxEvents, "*", "event", "waiting",
    "jobId", ARGV[4], "prev", "active")
  return 0
else
  return -1
end
`,keys:11};e.s(["retryJob",0,rr],32559),e.i(32559);let rn={name:"saveStacktrace",content:`--[[
  Save stacktrace and failedReason.
  Input:
    KEYS[1] job key
    ARGV[1]  stacktrace
    ARGV[2]  failedReason
  Output:
     0 - OK
    -1 - Missing key
]]
local rcall = redis.call
if rcall("EXISTS", KEYS[1]) == 1 then
  rcall("HMSET", KEYS[1], "stacktrace", ARGV[1], "failedReason", ARGV[2])
  return 0
else
  return -1
end
`,keys:1};e.s(["saveStacktrace",0,rn],20332),e.i(20332);let ra={name:"updateData",content:`--[[
  Update job data
  Input:
    KEYS[1] Job id key
    ARGV[1] data
  Output:
    0 - OK
   -1 - Missing job.
]]
local rcall = redis.call
if rcall("EXISTS",KEYS[1]) == 1 then -- // Make sure job exists
  rcall("HSET", KEYS[1], "data", ARGV[1])
  return 0
else
  return -1
end
`,keys:1};e.s(["updateData",0,ra],47479),e.i(47479);let ri={name:"updateJobScheduler",content:`--[[
  Updates a job scheduler and adds next delayed job
  Input:
    KEYS[1]  'repeat' key
    KEYS[2]  'delayed'
    KEYS[3]  'wait' key
    KEYS[4]  'paused' key
    KEYS[5]  'meta'
    KEYS[6]  'prioritized' key
    KEYS[7]  'marker',
    KEYS[8]  'id'
    KEYS[9]  events stream key
    KEYS[10] 'pc' priority counter
    KEYS[11] producer key
    KEYS[12] 'active' key
    ARGV[1] next milliseconds
    ARGV[2] jobs scheduler id
    ARGV[3] Json stringified delayed data
    ARGV[4] msgpacked delayed opts
    ARGV[5] timestamp
    ARGV[6] prefix key
    ARGV[7] producer id
    Output:
      next delayed job id  - OK
]] local rcall = redis.call
local repeatKey = KEYS[1]
local delayedKey = KEYS[2]
local waitKey = KEYS[3]
local pausedKey = KEYS[4]
local metaKey = KEYS[5]
local prioritizedKey = KEYS[6]
local nextMillis = tonumber(ARGV[1])
local jobSchedulerId = ARGV[2]
local timestamp = tonumber(ARGV[5])
local prefixKey = ARGV[6]
local producerId = ARGV[7]
local jobOpts = cmsgpack.unpack(ARGV[4])
-- Includes
--[[
  Add delay marker if needed.
]]
-- Includes
--[[
  Shared helper to store a job and enqueue it into the appropriate list/set.
  Handles delayed, prioritized, and standard (LIFO/FIFO) jobs.
  Emits the appropriate event after enqueuing ("delayed" or "waiting").
  Returns delay, priority from storeJob.
]]
-- Includes
--[[
  Adds a delayed job to the queue by doing the following:
    - Creates a new job key with the job data.
    - adds to delayed zset.
    - Emits a global event 'delayed' if the job is delayed.
]]
-- Includes
--[[
  Add delay marker if needed.
]]
-- Includes
--[[
  Function to return the next delayed job timestamp.
]]
local function getNextDelayedTimestamp(delayedKey)
  local result = rcall("ZRANGE", delayedKey, 0, 0, "WITHSCORES")
  if #result then
    local nextTimestamp = tonumber(result[2])
    if nextTimestamp ~= nil then
      return nextTimestamp / 0x1000
    end
  end
end
local function addDelayMarkerIfNeeded(markerKey, delayedKey)
  local nextTimestamp = getNextDelayedTimestamp(delayedKey)
  if nextTimestamp ~= nil then
    -- Replace the score of the marker with the newest known
    -- next timestamp.
    rcall("ZADD", markerKey, nextTimestamp, "1")
  end
end
--[[
  Bake in the job id first 12 bits into the timestamp
  to guarantee correct execution order of delayed jobs
  (up to 4096 jobs per given timestamp or 4096 jobs apart per timestamp)
  WARNING: Jobs that are so far apart that they wrap around will cause FIFO to fail
]]
local function getDelayedScore(delayedKey, timestamp, delay)
  local delayedTimestamp = (delay > 0 and (tonumber(timestamp) + delay)) or tonumber(timestamp)
  local minScore = delayedTimestamp * 0x1000
  local maxScore = (delayedTimestamp + 1 ) * 0x1000 - 1
  local result = rcall("ZREVRANGEBYSCORE", delayedKey, maxScore,
    minScore, "WITHSCORES","LIMIT", 0, 1)
  if #result then
    local currentMaxScore = tonumber(result[2])
    if currentMaxScore ~= nil then
      if currentMaxScore >= maxScore then
        return maxScore, delayedTimestamp
      else
        return currentMaxScore + 1, delayedTimestamp
      end
    end
  end
  return minScore, delayedTimestamp
end
local function addDelayedJob(jobId, delayedKey, eventsKey, timestamp,
  maxEvents, markerKey, delay)
  local score, delayedTimestamp = getDelayedScore(delayedKey, timestamp, tonumber(delay))
  rcall("ZADD", delayedKey, score, jobId)
  rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "delayed",
    "jobId", jobId, "delay", delayedTimestamp)
  -- mark that a delayed job is available
  addDelayMarkerIfNeeded(markerKey, delayedKey)
end
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to add job considering priority.
]]
-- Includes
--[[
  Function to get priority score.
]]
local function getPriorityScore(priority, priorityCounterKey)
  local prioCounter = rcall("INCR", priorityCounterKey)
  return priority * 0x100000000 + prioCounter % 0x100000000
end
local function addJobWithPriority(markerKey, prioritizedKey, priority, jobId, priorityCounterKey,
  isPausedOrMaxed)
  local score = getPriorityScore(priority, priorityCounterKey)
  rcall("ZADD", prioritizedKey, score, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
--[[
  Function to store a job
]]
local function storeJob(eventsKey, jobIdKey, jobId, name, data, opts, timestamp,
                        parentKey, parentData, repeatJobKey)
    local jsonOpts = cjson.encode(opts)
    local delay = opts['delay'] or 0
    local priority = opts['priority'] or 0
    local debounceId = opts['de'] and opts['de']['id']
    local optionalValues = {}
    if parentKey ~= nil then
        table.insert(optionalValues, "parentKey")
        table.insert(optionalValues, parentKey)
        table.insert(optionalValues, "parent")
        table.insert(optionalValues, parentData)
    end
    if repeatJobKey then
        table.insert(optionalValues, "rjk")
        table.insert(optionalValues, repeatJobKey)
    end
    if debounceId then
        table.insert(optionalValues, "deid")
        table.insert(optionalValues, debounceId)
    end
    rcall("HMSET", jobIdKey, "name", name, "data", data, "opts", jsonOpts,
          "timestamp", timestamp, "delay", delay, "priority", priority,
          unpack(optionalValues))
    rcall("XADD", eventsKey, "*", "event", "added", "jobId", jobId, "name", name)
    return delay, priority
end
local function storeAndEnqueueJob(eventsKey, jobIdKey, jobId, name, data, opts,
    timestamp, parentKey, parentData, repeatJobKey, maxEvents,
    waitKey, pausedKey, activeKey, metaKey, prioritizedKey,
    priorityCounterKey, delayedKey, markerKey)
  local delay, priority = storeJob(eventsKey, jobIdKey, jobId, name, data,
      opts, timestamp, parentKey, parentData, repeatJobKey)
  if delay ~= 0 and delayedKey then
    addDelayedJob(jobId, delayedKey, eventsKey, timestamp, maxEvents, markerKey, delay)
  else
    local target, isPausedOrMaxed = getTargetQueueList(metaKey, activeKey, waitKey, pausedKey)
    if priority > 0 then
      addJobWithPriority(markerKey, prioritizedKey, priority, jobId,
          priorityCounterKey, isPausedOrMaxed)
    else
      local pushCmd = opts['lifo'] and 'RPUSH' or 'LPUSH'
      addJobInTargetList(target, markerKey, pushCmd, isPausedOrMaxed, jobId)
    end
    rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "waiting",
        "jobId", jobId)
  end
  return delay, priority
end
local function addJobFromScheduler(jobKey, jobId, opts, waitKey, pausedKey, activeKey, metaKey, 
  prioritizedKey, priorityCounter, delayedKey, markerKey, eventsKey, name, maxEvents, timestamp,
  data, jobSchedulerId, repeatDelay)
  opts['delay'] = repeatDelay
  opts['jobId'] = jobId
  storeAndEnqueueJob(eventsKey, jobKey, jobId, name, data, opts,
      timestamp, nil, nil, jobSchedulerId, maxEvents,
      waitKey, pausedKey, activeKey, metaKey, prioritizedKey,
      priorityCounter, delayedKey, markerKey)
end
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
local function getJobSchedulerEveryNextMillis(prevMillis, every, now, offset, startDate)
    offset = tonumber(offset)
    local nextMillis
    if not prevMillis then
        if startDate then
            -- Assuming startDate is passed as milliseconds from JavaScript
            nextMillis = tonumber(startDate)
            nextMillis = nextMillis > now and nextMillis or now
        else
            if offset and offset > 0 then
                -- Align to the next slot that respects the offset
                nextMillis = math.floor(now / every) * every + offset
                if nextMillis <= now then
                    nextMillis = nextMillis + every
                end
            else
                nextMillis = now
            end
        end
    else
        nextMillis = prevMillis + every
        -- check if we may have missed some iterations
        if nextMillis < now then
            -- Use the same offset-aware alignment as the initial branch
            -- above so a non-zero offset is preserved across catch-ups
            -- instead of being flattened to (slot + every). When the
            -- aligned slot is itself still in the past, advance by one
            -- full interval; otherwise the aligned slot is the next
            -- iteration.
            local aligned = math.floor(now / every) * every + (offset or 0)
            if aligned <= now then
                nextMillis = aligned + every
            else
                nextMillis = aligned
            end
        end
    end
    if not offset or offset == 0 then
        local timeSlot = math.floor(nextMillis / every) * every;
        offset = nextMillis - timeSlot;
    end
    -- Return a tuple nextMillis, offset
    return math.floor(nextMillis), math.floor(offset)
end
local prevMillis = rcall("ZSCORE", repeatKey, jobSchedulerId)
-- Validate that scheduler exists.
-- If it does not exist we should not iterate anymore.
if prevMillis then
    prevMillis = tonumber(prevMillis)
    local schedulerKey = repeatKey .. ":" .. jobSchedulerId
    local schedulerAttributes = rcall("HMGET", schedulerKey, "name", "data", "every", "startDate", "offset")
    local every = tonumber(schedulerAttributes[3])
    local now = tonumber(timestamp)
    -- If every is not found in scheduler attributes, try to get it from job options
    if not every and jobOpts['repeat'] and jobOpts['repeat']['every'] then
        every = tonumber(jobOpts['repeat']['every'])
    end
    if every then
        local startDate = schedulerAttributes[4]
        local jobOptsOffset = jobOpts['repeat'] and jobOpts['repeat']['offset'] or 0
        local offset = schedulerAttributes[5] or jobOptsOffset or 0
        local newOffset
        nextMillis, newOffset = getJobSchedulerEveryNextMillis(prevMillis, every, now, offset, startDate)
        if not offset then
            rcall("HSET", schedulerKey, "offset", newOffset)
            jobOpts['repeat']['offset'] = newOffset
        end
    end
    local nextDelayedJobId = "repeat:" .. jobSchedulerId .. ":" .. nextMillis
    local nextDelayedJobKey = schedulerKey .. ":" .. nextMillis
    local currentDelayedJobId = "repeat:" .. jobSchedulerId .. ":" .. prevMillis
    if producerId == currentDelayedJobId then
        local eventsKey = KEYS[9]
        local maxEvents = getOrSetMaxEvents(metaKey)
        if rcall("EXISTS", nextDelayedJobKey) ~= 1 then
            rcall("ZADD", repeatKey, nextMillis, jobSchedulerId)
            rcall("HINCRBY", schedulerKey, "ic", 1)
            rcall("INCR", KEYS[8])
            -- TODO: remove this workaround in next breaking change,
            -- all job-schedulers must save job data
            local templateData = schedulerAttributes[2] or ARGV[3]
            if templateData and templateData ~= '{}' then
                rcall("HSET", schedulerKey, "data", templateData)
            end
            local delay = nextMillis - now
            -- Fast Clamp delay to minimum of 0
            if delay < 0 then
                delay = 0
            end
            jobOpts["delay"] = delay
            addJobFromScheduler(nextDelayedJobKey, nextDelayedJobId, jobOpts, waitKey, pausedKey, KEYS[12], metaKey,
                prioritizedKey, KEYS[10], delayedKey, KEYS[7], eventsKey, schedulerAttributes[1], maxEvents, ARGV[5],
                templateData or '{}', jobSchedulerId, delay)
            -- TODO: remove this workaround in next breaking change
            if KEYS[11] ~= "" then
                rcall("HSET", KEYS[11], "nrjid", nextDelayedJobId)
            end
            return nextDelayedJobId .. "" -- convert to string
        else
            rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "duplicated", "jobId", nextDelayedJobId)
        end
    end
end
`,keys:12};e.s(["updateJobScheduler",0,ri],74677),e.i(74677);let rs={name:"updateProgress",content:`--[[
  Update job progress
  Input:
    KEYS[1] Job id key
    KEYS[2] event stream key
    KEYS[3] meta key
    ARGV[1] id
    ARGV[2] progress
  Output:
     0 - OK
    -1 - Missing job.
  Event:
    progress(jobId, progress)
]]
local rcall = redis.call
-- Includes
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
if rcall("EXISTS", KEYS[1]) == 1 then -- // Make sure job exists
    local maxEvents = getOrSetMaxEvents(KEYS[3])
    rcall("HSET", KEYS[1], "progress", ARGV[2])
    rcall("XADD", KEYS[2], "MAXLEN", "~", maxEvents, "*", "event", "progress",
          "jobId", ARGV[1], "data", ARGV[2]);
    return 0
else
    return -1
end
`,keys:3};e.s(["updateProgress",0,rs],70855),e.i(70855);let ro={name:"updateRepeatableJobMillis",content:`--[[
  Adds a repeatable job
    Input:
      KEYS[1] 'repeat' key
      ARGV[1] next milliseconds
      ARGV[2] custom key
      ARGV[3] legacy custom key TODO: remove this logic in next breaking change
      Output:
        repeatableKey  - OK
]]
local rcall = redis.call
local repeatKey = KEYS[1]
local nextMillis = ARGV[1]
local customKey = ARGV[2]
local legacyCustomKey = ARGV[3]
if rcall("ZSCORE", repeatKey, customKey) then
    rcall("ZADD", repeatKey, nextMillis, customKey)
    return customKey
elseif rcall("ZSCORE", repeatKey, legacyCustomKey) ~= false then
    rcall("ZADD", repeatKey, nextMillis, legacyCustomKey)
    return legacyCustomKey
end
return ''
`,keys:1};e.s(["updateRepeatableJobMillis",0,ro],48349),e.i(48349),e.s(["addDelayedJob",0,tS,"addJobScheduler",0,tE,"addLog",0,tI,"addParentJob",0,tk,"addPrioritizedJob",0,tw,"addRepeatableJob",0,tj,"addStandardJob",0,tx,"changeDelay",0,tA,"changePriority",0,tT,"cleanJobsInSet",0,tD,"drain",0,tC,"extendLock",0,tO,"extendLocks",0,tR,"getCounts",0,tM,"getCountsPerPriority",0,tP,"getDependencyCounts",0,tN,"getJobScheduler",0,tJ,"getMetrics",0,tL,"getRanges",0,t_,"getRateLimitTtl",0,tF,"getState",0,tq,"getStateV2",0,tG,"isFinished",0,tV,"isJobInList",0,tY,"isMaxed",0,tB,"moveJobFromActiveToWait",0,tz,"moveJobsToWait",0,tU,"moveStalledJobsToWait",0,tW,"moveToActive",0,tH,"moveToDelayed",0,t$,"moveToFinished",0,tQ,"moveToWaitingChildren",0,tZ,"obliterate",0,tX,"paginate",0,t0,"pause",0,t1,"promote",0,t2,"releaseLock",0,t3,"removeChildDependency",0,t4,"removeDeduplicationKey",0,t6,"removeJob",0,t5,"removeJobScheduler",0,t8,"removeOrphanedJobs",0,t9,"removeRepeatable",0,t7,"removeUnprocessedChildren",0,re,"reprocessJob",0,rt,"retryJob",0,rr,"saveStacktrace",0,rn,"updateData",0,ra,"updateJobScheduler",0,ri,"updateProgress",0,rs,"updateRepeatableJobMillis",0,ro],28729);var rl=e.i(28729);let rd=new WeakMap;function ru(e){if(!0===e.__bullmq_iredis)return e;let t=rd.get(e);if(t)return t;let r=!0===e.isCluster,n=new Map,a=Object.create(null);a.__bullmq_iredis=!0,a.isCluster=r,a.runCommand=(t,r)=>e[t](r),a.pipeline=(...t)=>rc(e.pipeline(...t)),a.multi=(...t)=>rc(e.multi(...t)),"function"==typeof e.duplicate&&(a.duplicate=t=>{var n;if(r){let r=(null==(n=e.options)?void 0:n.redisOptions)||{},a=t?Object.assign(Object.assign({},r),t):r;return ru(e.duplicate(void 0,{redisOptions:a}))}return ru(e.duplicate(t))}),a.hset=(t,r,...n)=>{if("string"==typeof r)return e.hset(t,r,...n);let a=[t];for(let[e,t]of Object.entries(r))a.push(e,t);return e.hset(...a)},a.set=(t,r,n,...a)=>{if("string"==typeof n||null==n)return e.set(t,r,...null!=n?[n,...a]:[]);let i=[t,r];return null!=n.PX?i.push("PX",n.PX):null!=n.EX&&i.push("EX",n.EX),e.set(...i)},a.zrange=(t,r,n,a,...i)=>"string"==typeof a?e.zrange(t,r,n,a,...i):(null==a?void 0:a.WITHSCORES)?e.zrange(t,r,n,"WITHSCORES"):e.zrange(t,r,n),a.zrevrange=(t,r,n,a,...i)=>"string"==typeof a?e.zrevrange(t,r,n,a,...i):(null==a?void 0:a.WITHSCORES)?e.zrevrange(t,r,n,"WITHSCORES"):e.zrevrange(t,r,n),a.xadd=(t,r,n,...a)=>{if("string"==typeof n)return e.xadd(t,r,n,...a);let i=a[0],s=[t];for(let[e,t]of((null==i?void 0:i.MAXLEN)!=null&&(s.push("MAXLEN"),!1!==i.approximate&&s.push("~"),s.push(i.MAXLEN)),s.push(r),Object.entries(n)))s.push(e,t);return e.xadd(...s)},a.xread=(t,...r)=>{if("string"==typeof t)return e.xread(t,...r);let n=r[0],a=[];for(let e of((null==n?void 0:n.BLOCK)!=null&&a.push("BLOCK",n.BLOCK),(null==n?void 0:n.COUNT)!=null&&a.push("COUNT",n.COUNT),a.push("STREAMS"),t))a.push(e.key);for(let e of t)a.push(e.id);return e.xread(...a)},a.xtrim=(t,r,n,...a)=>{if("string"==typeof n||0===a.length)return e.xtrim(t,r,n,...a);let i=a[0],s=[t,r];return(null==i?void 0:i.approximate)!==!1&&s.push("~"),s.push(n),e.xtrim(...s)},a.clientSetName=t=>e.client("SETNAME",t),a.clientList=()=>e.client("LIST"),a.scan=(t,...r)=>{if(0===r.length||"string"==typeof r[0]||"function"==typeof r[0])return e.scan(t,...r);let n=r[0],a=[t];return(null==n?void 0:n.MATCH)!=null&&a.push("MATCH",n.MATCH),(null==n?void 0:n.COUNT)!=null&&a.push("COUNT",n.COUNT),e.scan(...a)};let i=new Proxy(e,{get(e,t){if(t in a)return a[t];let r=Reflect.get(e,t,e);if("function"!=typeof r)return r;if(Object.prototype.hasOwnProperty.call(e,t))return r.bind(e);let i=n.get(t);if(void 0!==i)return i;let s=r.bind(e);return n.set(t,s),s},set:(e,t,r)=>t in a?(a[t]=r,!0):(n.delete(t),Reflect.set(e,t,r)),deleteProperty:(e,t)=>!(t in a)&&(n.delete(t),Reflect.deleteProperty(e,t)),has:(e,t)=>t in a||Reflect.has(e,t)});return rd.set(e,i),i}function rc(e){e.runCommand=function(t,r){return e[t](r),e};let t=e.hset.bind(e);e.hset=function(r,n){let a=[r];for(let[e,t]of Object.entries(n))a.push(e,t);return t(...a),e};let r=e.hscan.bind(e);e.hscan=function(t,n,a){return(null==a?void 0:a.COUNT)!=null?r(t,n,"COUNT",a.COUNT):r(t,n),e};let n=e.sscan.bind(e);return e.sscan=function(t,r,a){return(null==a?void 0:a.COUNT)!=null?n(t,r,"COUNT",a.COUNT):n(t,r),e},e}let rp=Symbol("bullmqClusterReconnectPromise"),rh=Symbol("bullmqClusterPatchedForBlocking"),ry=Symbol("bullmqClusterOriginalBzpopmin"),rm=Symbol("bullmqClusterWrappedBzpopmin"),rf=Symbol("bullmqClusterPatchRefCount"),rb=Symbol("bullmqClusterClosingRefCount");class rg extends tK.EventEmitter{constructor(e,t){if(super(),this.extraOptions=t,this.capabilities={canDoubleTimeout:!1,canBlockFor1Ms:!0},this.status="initializing",this.dbType="redis",this.packageVersion=td,this.disabledBlockingClusterReconnect=!1,this.extraOptions=Object.assign({shared:!1,blocking:!0,skipVersionCheck:!1,skipWaitingForReady:!1,clusterReconnectTimeoutMs:3e4},t),H(e)){if(this._client=!function(e){return!!e&&"object"==typeof e&&(!0===e.__bullmq_iredis||"function"==typeof e.runCommand&&"function"==typeof e.defineCommand&&"function"==typeof e.pipeline&&"function"==typeof e.multi&&"function"==typeof e.duplicate&&"function"==typeof e.scanStream&&"function"==typeof e.connect&&"function"==typeof e.disconnect&&"function"==typeof e.on&&"string"==typeof e.status&&"boolean"==typeof e.isCluster)}(e)?ru(e):e,this._client.options.keyPrefix)throw Error("BullMQ: ioredis does not support ioredis prefixes, use the prefix option instead.");this._client.isCluster?this.opts=this._client.options.redisOptions:this.opts=this._client.options,this.checkBlockingOptions("BullMQ: Your redis options maxRetriesPerRequest must be null.",this.opts,!0)}else this.checkBlockingOptions("BullMQ: WARNING! Your redis options maxRetriesPerRequest must be null and will be overridden by BullMQ.",e),this.opts=Object.assign({port:6379,host:"127.0.0.1",retryStrategy:function(e){return Math.max(Math.min(Math.exp(e),2e4),1e3)}},e),this.extraOptions.blocking&&(this.opts.maxRetriesPerRequest=null);this.skipVersionCheck=(null==t?void 0:t.skipVersionCheck)||!!(this.opts&&this.opts.skipVersionCheck),this.handleClientError=e=>{this.emit("error",e)},this.handleClientClose=()=>{this.emit("close")},this.handleClientReady=()=>{this.emit("ready")},this.initializing=this.init(),this.initializing.catch(e=>this.emit("error",e))}checkBlockingOptions(e,t,r=!1){if(this.extraOptions.blocking&&t&&t.maxRetriesPerRequest)if(r)throw Error(e);else console.error(e)}static async waitUntilReady(e){let t,r,n;if("ready"!==e.status&&!("connect"===e.status&&$(e))){if("wait"===e.status)return e.connect();if("end"===e.status)throw new F(_.CONNECTION_CLOSED_ERROR_MSG);try{await new Promise((a,i)=>{let s;n=e=>{s=e},t=()=>{a()},r=()=>{"end"!==e.status?i(s||new F(_.CONNECTION_CLOSED_ERROR_MSG)):s?i(s):a()},z(e,3),e.once("ready",t),e.on("end",r),e.once("error",n)})}finally{e.removeListener("end",r),e.removeListener("error",n),e.removeListener("ready",t),z(e,-3)}}}get client(){return this.initializing}loadCommands(e,t){let r=t||rl;for(let t in r){let n=`${r[t].name}:${e}`;this._client[n]||this._client.defineCommand(n,{numberOfKeys:r[t].keys,lua:r[t].content})}}async init(){if(!this._client)if(rg.clientFactory)this._client=rg.clientFactory(this.opts);else{let e=this.opts,{url:t}=e,r=en(e,["url"]),n=t?new tv.default(t,r):new tv.default(r);this._client=ru(n)}if(z(this._client,3),this._client.on("error",this.handleClientError),this._client.on("close",this.handleClientClose),this._client.on("ready",this.handleClientReady),this.patchBlockingClusterClient(),this.extraOptions.skipWaitingForReady||await rg.waitUntilReady(this._client),this.loadCommands(this.packageVersion),"end"!==this._client.status){let e=await this.getRedisVersionAndType();if(this.version=e.version,this.dbType=e.databaseType,!0!==this.skipVersionCheck&&!this.closing){if(ee(this.version,rg.minimumVersion,this.dbType))throw Error(`Redis version needs to be greater or equal than ${rg.minimumVersion} Current: ${this.version}`);ee(this.version,rg.recommendedMinimumVersion,this.dbType)&&console.warn(`It is highly recommended to use a minimum Redis version of ${rg.recommendedMinimumVersion}
             Current: ${this.version}`)}this.capabilities={canDoubleTimeout:!ee(this.version,"6.0.0",this.dbType),canBlockFor1Ms:!ee(this.version,"7.0.8",this.dbType)},this.status="ready"}return this._client}patchBlockingClusterClient(){var e;let t=this._client;if(!this.extraOptions.blocking||!$(t)||"function"!=typeof t.bzpopmin)return;let r=null!=(e=this.extraOptions.clusterReconnectTimeoutMs)?e:3e4;if(t[rf]=(t[rf]||0)+1,this.patchedBlockingClusterClient=t,t[rh])return;let n=t.bzpopmin,a=async(...e)=>{await rg.reconnectClusterIfNeeded(t,r);try{return await n.apply(t,e)}catch(e){if(rg.shouldReconnectClusterAfterError(t,e))try{await rg.reconnectCluster(t,r)}catch(e){}throw e}};t[ry]=n,t[rm]=a,t[rh]=!0,t.bzpopmin=a}disableBlockingClusterReconnect(){let e=this.patchedBlockingClusterClient;e&&!this.disabledBlockingClusterReconnect&&(e[rb]=(e[rb]||0)+1,this.disabledBlockingClusterReconnect=!0)}releaseBlockingClusterClientPatch(){let e=this.patchedBlockingClusterClient;if(!e)return;if(this.disabledBlockingClusterReconnect){let t=(e[rb]||1)-1;t>0?e[rb]=t:delete e[rb],this.disabledBlockingClusterReconnect=!1}let t=(e[rf]||1)-1;if(t>0){e[rf]=t,this.patchedBlockingClusterClient=void 0;return}e[ry]&&e.bzpopmin===e[rm]&&(e.bzpopmin=e[ry]),delete e[rf],delete e[rb],delete e[ry],delete e[rm],delete e[rh],this.patchedBlockingClusterClient=void 0}static isClusterWithEmptyNodes(e){return"function"==typeof e.nodes&&0===e.nodes().length}static isReconnectingDisabled(e){let t=e[rf]||0,r=e[rb]||0;return 0===t||r>=t||"end"===e.status||"closing"===e.status}static async reconnectClusterIfNeeded(e,t){!rg.isReconnectingDisabled(e)&&rg.isClusterWithEmptyNodes(e)&&await rg.reconnectCluster(e,t)}static shouldReconnectClusterAfterError(e,t){var r,n;if(rg.isReconnectingDisabled(e))return!1;let a=[t.message,null==(r=t.cause)?void 0:r.message,null==(n=t.lastNodeError)?void 0:n.message].join(" ");return rg.isClusterWithEmptyNodes(e)||/Command timed out|Failed to refresh slots cache/i.test(a)}static async reconnectCluster(e,t){rg.isReconnectingDisabled(e)||(e[rp]||(e[rp]=rg.connectClusterWithTimeout(e,t).finally(()=>{e[rp]=null})),await e[rp])}static async connectClusterWithTimeout(e,t){let r;e.disconnect(!1);try{await Promise.race([e.connect(),new Promise((e,n)=>{var a;null==(a=(r=setTimeout(()=>{n(new F(`BullMQ: cluster reconnect timed out after ${t}ms`))},t)).unref)||a.call(r)})])}finally{r&&clearTimeout(r)}}async disconnect(e=!0){let t=await this.client;if("end"!==t.status){let r,n;if(!e)return t.disconnect();let a=new Promise((e,a)=>{z(t,2),t.once("end",e),t.once("error",a),r=e,n=a});t.disconnect();try{await a}finally{z(t,-2),t.removeListener("end",r),t.removeListener("error",n)}}}async reconnect(){return(await this.client).connect()}async close(e=!1){var t;if(!this.closing){let r=this.status;this.status="closing",this.closing=!0,this.disableBlockingClusterReconnect();try{"ready"===r&&await this.initializing,this.extraOptions.shared||("initializing"==r||e?(this._client.disconnect(),null==(t=this.initializing)||t.catch(()=>{})):await this._client.quit(),this._client.status="end")}catch(e){if(X(e))throw e}finally{this.releaseBlockingClusterClientPatch(),this._client.off("error",this.handleClientError),this._client.off("close",this.handleClientClose),this._client.off("ready",this.handleClientReady),z(this._client,-3),this.removeAllListeners(),this.status="closed"}}}async getRedisVersionAndType(){let e;if(this.skipVersionCheck)return{version:rg.minimumVersion,databaseType:"redis"};let t=await this._client.info(),r="redis_version:",n="maxmemory_policy:",a=t.split(/\r?\n/),i="redis";for(let t=0;t<a.length;t++){let s=a[t];if(s.includes("dragonfly_version:")||s.includes("server:Dragonfly")?(i="dragonfly",0===s.indexOf("dragonfly_version:")&&(e=s.substr(18))):s.includes("valkey_version:")||s.includes("server:Valkey")?(i="valkey",0===s.indexOf("valkey_version:")&&(e=s.substr(15))):0===s.indexOf(r)&&(e=s.substr(r.length),"redis"===i&&(i="redis")),0===s.indexOf(n)){let e=s.substr(n.length);"noeviction"!==e&&console.warn(`IMPORTANT! Eviction policy is ${e}. It should be "noeviction"`)}}if(!e){for(let t of a)if(t.includes("version:")){let r=t.split(":");if(r.length>=2){e=r[1];break}}}return{version:e||rg.minimumVersion,databaseType:i}}get redisVersion(){return this.version}get databaseType(){return this.dbType}}rg.minimumVersion="5.0.0",rg.recommendedMinimumVersion="6.2.0",N.EventEmitter;var rK=N;function rv(e){return 1===e.length&&Array.isArray(e[0])?e[0]:e}function rS(e){return(null==e?void 0:e.message)==="Disconnects client"||(null==e?void 0:e.message)==="The client is closed"||(null==e?void 0:e.message)==="Connection is closed."}class rE extends rK.EventEmitter{get status(){return this.statusOverride?this.statusOverride:this.raw.isReady?"ready":this.raw.isOpen?"connect":this.hasConnected?"end":"wait"}set status(e){if("end"===e&&(this.destroying=!0,this.raw.isOpen))try{this.raw.quit().catch(()=>{})}catch(e){}this.statusOverride=e}get options(){var e;return null!=(e=this.raw.options)?e:{}}set options(e){}constructor(e){super(),this.raw=e,this.scripts=new Map,this.hasConnected=!1,this.destroying=!1,this.isCluster=!1,e.on("ready",()=>{this.hasConnected=!0,this.connectionName?this.raw.clientSetName(this.connectionName).then(()=>this.emit("ready"),()=>this.emit("ready")):this.emit("ready")}),e.on("error",e=>{this.destroying&&rS(e)||this.emit("error",e)}),e.on("end",()=>this.emit("close")),e.on("reconnecting",()=>this.emit("reconnecting")),e.isOpen||(this.connectPromise=e.connect().then(()=>{this.connectPromise=void 0},e=>{this.connectPromise=void 0}))}async connect(){return this.connectPromise?this.connectPromise:this.raw.isOpen?void(!this.raw.isReady&&await new Promise((e,t)=>{let r=()=>{i(),e()},n=e=>{i(),t(e)},a=()=>{i(),t(Error("Connection ended before ready event"))},i=()=>{this.off("ready",r),this.off("error",n),this.off("end",a)};this.once("ready",r),this.once("error",n),this.once("end",a)})):(this.connectPromise=this.raw.connect().then(()=>{this.connectPromise=void 0},e=>{throw this.connectPromise=void 0,e}),this.connectPromise)}disconnect(e=!1){this.destroying=!0,e||(this.statusOverride="end");try{this.raw.isOpen&&this.raw.destroy()}catch(e){}this.emit("close"),e?(this.statusOverride=void 0,this.emit("reconnecting"),this.connect().catch(e=>{rS(e)||this.emit("error",e)}).finally(()=>{this.destroying=!1})):this.emit("end")}async quit(){if(this.destroying||"end"===this.statusOverride)return setImmediate(()=>{this.emit("end"),this.emit("close")}),"OK";this.destroying=!0;try{if(this.raw.isOpen)try{await this.raw.quit()}catch(e){}}catch(e){}return this.statusOverride="end",setImmediate(()=>{this.emit("end"),this.emit("close")}),"OK"}duplicate(...e){let t=new rE(this.raw.duplicate());for(let[e,r]of this.scripts)t.scripts.set(e,r),t[e]=(...r)=>t.runCommand(e,r);let r=e[0];return r&&"object"==typeof r&&r.connectionName&&(t.connectionName=r.connectionName),t}defineCommand(e,t){let r=(0,L.createHash)("sha1").update(t.lua).digest("hex");this.scripts.set(e,{sha:r,lua:t.lua,numberOfKeys:t.numberOfKeys}),this[e]=(...t)=>this.runCommand(e,t),this.raw.scriptLoad(t.lua).catch(()=>{})}async runCommand(e,t){var r,n;let a=this.scripts.get(e);if(!a)throw Error(`BullMQ: unknown command "${e}"`);let i=rv(t),{sha:s,lua:o,numberOfKeys:l}=a,d=i.slice(0,l).map(String),u=i.slice(l).map(e=>Buffer.isBuffer(e)?e:null==e?"":String(e));try{return await this.raw.evalSha(s,{keys:d,arguments:u})}catch(e){if(this.destroying&&rS(e))return null;if(rS(e))throw new F(e.message,e);if(null==(n=null==(r=null==e?void 0:e.message)?void 0:r.includes)?void 0:n.call(r,"NOSCRIPT"))try{return await this.raw.eval(o,{keys:d,arguments:u})}catch(e){if(this.destroying&&rS(e))return null;if(rS(e))throw new F(e.message,e);throw e}throw e}}multi(){return new rI(this.raw.multi(),this.scripts)}pipeline(){return this.multi()}async hgetall(e){let t=await this.raw.hGetAll(e);return null!=t?t:{}}async hget(e,t){var r;return null!=(r=await this.raw.hGet(e,t))?r:null}async hmget(e,...t){return(await this.raw.hmGet(e,t)).map(e=>null!=e?e:null)}async hset(e,t,...r){if("object"==typeof t)return await this.raw.hSet(e,t);let n={};n[t]=String(r[0]);for(let e=1;e<r.length;e+=2)n[String(r[e])]=String(r[e+1]);return await this.raw.hSet(e,n)}async hdel(e,...t){return await this.raw.hDel(e,t)}async hexists(e,t){return+!!await this.raw.hExists(e,t)}async get(e){var t;return null!=(t=await this.raw.get(e))?t:null}async set(e,t,r){let n={};return(null==r?void 0:r.PX)!=null?n.PX=r.PX:(null==r?void 0:r.EX)!=null&&(n.EX=r.EX),await this.raw.set(e,String(t),n)}async del(...e){return 0===e.length?0:await this.raw.del(e)}async zrange(e,t,r,n){if(null==n?void 0:n.WITHSCORES){let n=await this.raw.zRangeWithScores(e,t,r),a=[];for(let e of n)a.push(e.value,String(e.score));return a}return await this.raw.zRange(e,t,r)}async zrevrange(e,t,r,n){if(null==n?void 0:n.WITHSCORES){let n=await this.raw.zRangeWithScores(e,t,r,{REV:!0}),a=[];for(let e of n)a.push(e.value,String(e.score));return a}return await this.raw.zRange(e,t,r,{REV:!0})}async zcard(e){return await this.raw.zCard(e)}async zscore(e,t){let r=await this.raw.zScore(e,t);return null!=r?String(r):null}async lrange(e,t,r){return await this.raw.lRange(e,t,r)}async llen(e){return await this.raw.lLen(e)}async ltrim(e,t,r){return await this.raw.lTrim(e,t,r),"OK"}async lpos(e,t){var r;return null!=(r=await this.raw.lPos(e,t))?r:null}async smembers(e){return await this.raw.sMembers(e)}async xadd(e,t,r,n){let a={};(null==n?void 0:n.MAXLEN)!=null&&(a.TRIM={strategy:"MAXLEN",threshold:n.MAXLEN,strategyModifier:!1===n.approximate?void 0:"~"});let i={};for(let[e,t]of Object.entries(r))i[e]=String(t);return await this.raw.xAdd(e,t,i,a)}async xread(e,t){let r,n={};(null==t?void 0:t.BLOCK)!=null&&(n.BLOCK=t.BLOCK),(null==t?void 0:t.COUNT)!=null&&(n.COUNT=t.COUNT);let a=e.map(e=>({key:e.key,id:e.id}));try{r=await this.raw.xRead(a,n)}catch(e){if(this.destroying&&rS(e))return null;if(rS(e))throw new F(e.message,e);throw e}return r?r.map(e=>[e.name,e.messages.map(e=>[e.id,Object.entries(e.message).flat()])]):null}async xtrim(e,t,r,n){let a=(null==n?void 0:n.approximate)===!1?void 0:"~";return await this.raw.xTrim(e,t,r,{strategyModifier:a})}async bzpopmin(e,t){let r;try{r=await this.raw.bzPopMin(e,t)}catch(e){if(this.destroying&&rS(e))return null;if(rS(e))throw new F(e.message,e);throw e}return r?[r.key,r.value,String(r.score)]:null}async info(){return await this.raw.info()}async clientSetName(e){return await this.raw.clientSetName(e)}async clientList(){return await this.raw.sendCommand(["CLIENT","LIST"])}async scan(e,t){let r={};(null==t?void 0:t.MATCH)&&(r.MATCH=t.MATCH),(null==t?void 0:t.COUNT)&&(r.COUNT=t.COUNT);let n=await this.raw.scan(String(e),r);return[String(n.cursor),n.keys]}scanStream(e){let t=this.raw,r=this.connectPromise,n={};e.match&&(n.MATCH=e.match),e.count&&(n.COUNT=e.count);let a=new tl.Readable({objectMode:!0,async read(){var e,i,s,o;try{r&&await r;try{for(var l,d=!0,u=function(e){if(!Symbol.asyncIterator)throw TypeError("Symbol.asyncIterator is not defined.");var t,r=e[Symbol.asyncIterator];return r?r.call(e):(e=function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")}(e),t={},n("next"),n("throw"),n("return"),t[Symbol.asyncIterator]=function(){return this},t);function n(r){t[r]=e[r]&&function(t){return new Promise(function(n,a){var i,s,o,l;i=n,s=a,o=(t=e[r](t)).done,l=t.value,Promise.resolve(l).then(function(e){i({value:e,done:o})},s)})}}}(t.scanIterator(n));!(e=(l=await u.next()).done);d=!0)if(o=l.value,d=!1,!a.push(Array.isArray(o)?o:[o]))return}catch(e){i={error:e}}finally{try{!d&&!e&&(s=u.return)&&await s.call(u)}finally{if(i)throw i.error}}a.push(null)}catch(e){a.destroy(e)}}});return a}async keys(e){return await this.raw.keys(e)}async exists(...e){return 0===e.length?0:await this.raw.exists(e)}async zadd(e,...t){let r=[];for(let e=0;e<t.length;e+=2)r.push({score:Number(t[e]),value:String(t[e+1])});return await this.raw.zAdd(e,r)}async zrem(e,...t){return await this.raw.zRem(e,t)}async xlen(e){return await this.raw.xLen(e)}async xrevrange(e,t,r,...n){let a={};return"COUNT"===n[0]&&(a.COUNT=Number(n[1])),(await this.raw.xRevRange(e,t,r,a)).map(e=>[e.id,Object.entries(e.message).flat()])}async sadd(e,...t){return await this.raw.sAdd(e,t.map(String))}async scard(e){return await this.raw.sCard(e)}async lpush(e,...t){return await this.raw.lPush(e,t)}async rpop(e){return await this.raw.rPop(e)}async incr(e){return await this.raw.incr(e)}async incrby(e,t){return await this.raw.incrBy(e,t)}async flushall(){return await this.raw.flushAll()}}class rI{constructor(e,t){this.raw=e,this.scripts=t,this.transformers=[]}addIdentityTransformer(){this.transformers.push(e=>e)}hgetall(e){return this.raw.hGetAll(e),this.addIdentityTransformer(),this}hset(e,t){return this.raw.hSet(e,t),this.addIdentityTransformer(),this}hscan(e,t,r){let n={};return(null==r?void 0:r.COUNT)!=null&&(n.COUNT=r.COUNT),this.raw.hScan(e,String(t),n),this.transformers.push(e=>{if(!e)return["0",[]];let t=[];for(let r of e.entries||[])t.push(r.field,r.value);return[String(e.cursor),t]}),this}smembers(e){return this.raw.sMembers(e),this.addIdentityTransformer(),this}sscan(e,t,r){let n={};return(null==r?void 0:r.COUNT)!=null&&(n.COUNT=r.COUNT),this.raw.sScan(e,String(t),n),this.transformers.push(e=>e?[String(e.cursor),e.members||[]]:["0",[]]),this}zrange(e,t,r){return this.raw.zRange(e,t,r),this.addIdentityTransformer(),this}lrange(e,t,r){return this.raw.lRange(e,t,r),this.addIdentityTransformer(),this}llen(e){return this.raw.lLen(e),this.addIdentityTransformer(),this}del(...e){return e.length>0&&(this.raw.del(e),this.addIdentityTransformer()),this}runCommand(e,t){let r=this.scripts.get(e);if(!r)throw Error(`BullMQ: unknown command "${e}" in transaction`);let n=rv(t),{sha:a,lua:i,numberOfKeys:s}=r,o=n.slice(0,s).map(String),l=n.slice(s).map(e=>Buffer.isBuffer(e)?e:null==e?"":String(e));return this.raw.evalSha(a,{keys:o,arguments:l}),this.addIdentityTransformer(),this}async exec(){let e=await this.raw.exec();return e?e.map((e,t)=>{if(e instanceof Error)return[e,null];let r=this.transformers[t];return[null,r?r(e):e]}):null}}var rk=N;function rw(e){return 1===e.length&&Array.isArray(e[0])?e[0]:e}function rj(e){return null==e?[]:Array.isArray(e)?e.map(String):e instanceof Set?Array.from(e,e=>String(e)):[]}class rx extends rk.EventEmitter{get status(){return this.statusOverride?this.statusOverride:this.closed?"end":this.raw.connected?"ready":this.hasConnected?"end":"wait"}set status(e){"end"===e&&(this.closing=!0,this.closed=!0),this.statusOverride=e}get options(){return{}}set options(e){}constructor(e,t){super(),this.raw=e,this.scripts=new Map,this.loadedScriptShas=new Set,this.hasConnected=!1,this.closed=!1,this.closing=!1,this.reconnecting=!1,this.reconnectTimer=null,this.reconnectAttempts=0,this.maxReconnectDelay=2e4,this.isCluster=!1,this._setupCallbacks(),(null==t?void 0:t.lazyConnect)||this.connect().catch(()=>{})}_setupCallbacks(){this.raw.onconnect=()=>{this.hasConnected=!0,this.closed=!1,this.closing=!1,this.reconnecting=!1,this.reconnectAttempts=0,this.statusOverride=void 0,this.loadedScriptShas.clear(),this.connectionName?this.clientSetName(this.connectionName).then(()=>this.emit("ready"),()=>this.emit("ready")):this.emit("ready")},this.raw.onclose=e=>{if(this.closing){this.closed=!0,this.emit("close"),this.emit("end");return}this.closed=!0,this.emit("close"),e&&this.emit("error",e),this._scheduleReconnect()}}_scheduleReconnect(){if(this.closing||this.reconnecting)return;this.reconnecting=!0,this.reconnectAttempts++;let e=Math.max(Math.min(100*Math.exp(this.reconnectAttempts),this.maxReconnectDelay),1e3);this.reconnectTimer=setTimeout(async()=>{if(this.reconnectTimer=null,this.closing){this.reconnecting=!1;return}try{let e=new this.raw.constructor(this.raw.url);this.raw=e,this.closed=!1,this.connecting=void 0,this._setupCallbacks(),await e.connect()}catch(e){this.reconnecting=!1,this.closing||this._scheduleReconnect()}},e)}async connect(){if(this.raw.connected){this.hasConnected=!0,this.closed=!1,this.closing=!1,this.statusOverride=void 0;return}if(!this.connecting){if(this.closed=!1,this.closing=!1,this.statusOverride=void 0,this.hasConnected&&!this.raw.connected){let e=this.raw.constructor;this.raw=new e(this.raw.url),this._setupCallbacks()}this.connecting=this.raw.connect().then(()=>{this.hasConnected=!0,this.closed=!1,this.closing=!1,this.statusOverride=void 0}).finally(()=>{this.connecting=void 0})}await this.connecting}_closeRaw(){this.reconnectTimer&&(clearTimeout(this.reconnectTimer),this.reconnectTimer=null),this.reconnecting=!1;let e=this.raw;e.onconnect=()=>{},e.onclose=()=>{},e.onerror=()=>{},e.connected&&setImmediate(()=>{try{e.connected&&e.close()}catch(e){}})}disconnect(e){if(!this.closed||e)if(e){this.closed=!0,this.statusOverride=void 0;let e=this.raw;e.onclose=()=>{},e.connected&&setImmediate(()=>{try{e.connected&&e.close()}catch(e){}}),this.emit("close"),this._scheduleReconnect()}else this.closing=!0,this.closed=!0,this.statusOverride="end",this._closeRaw(),this.emit("close"),this.emit("end")}async quit(){return this.closed?setImmediate(()=>{this.emit("end"),this.emit("close")}):(this.closing=!0,this.closed=!0,this.statusOverride="end",this._closeRaw(),setImmediate(()=>{this.emit("end"),this.emit("close")})),"OK"}duplicate(...e){let t=new rx(new this.raw.constructor(this.raw.url));for(let[e,r]of this.scripts)t.scripts.set(e,r),t[e]=(...r)=>t.runCommand(e,r);let r=e[0];return r&&"object"==typeof r&&r.connectionName&&(t.connectionName=r.connectionName),t}defineCommand(e,t){let r=(0,L.createHash)("sha1").update(t.lua).digest("hex");this.scripts.set(e,{sha:r,lua:t.lua,numberOfKeys:t.numberOfKeys}),this[e]=(...t)=>this.runCommand(e,t)}async runCommand(e,t){let r=this.scripts.get(e);if(!r)throw Error(`BullMQ: unknown command "${e}"`);let n=rw(t),{sha:a,lua:i,numberOfKeys:s}=r,o=n.slice(0,s).map(String),l=n.slice(s).map(e=>Buffer.isBuffer(e)?e:null==e?"":String(e)),d=[a,String(o.length),...o,...l];return(async()=>{var e,t;try{let e=await this.sendCommand("EVALSHA",d);return this.loadedScriptShas.add(a),e}catch(r){if(null==(t=null==(e=null==r?void 0:r.message)?void 0:e.includes)?void 0:t.call(e,"NOSCRIPT")){let e=[i,String(o.length),...o,...l],t=await this.sendCommand("EVAL",e);return this.loadedScriptShas.add(a),t}throw r}})()}async ensureScriptsLoaded(e){let t=[],r=new Set;for(let n of e)this.loadedScriptShas.has(n.sha)||r.has(n.sha)||(r.add(n.sha),t.push(n));0!==t.length&&await Promise.all(t.map(async e=>{await this.sendCommand("SCRIPT",["LOAD",e.lua]),this.loadedScriptShas.add(e.sha)}))}sendCommand(e,t){return this.closing||this.closed?Promise.reject(new F("Connection is closed")):this.raw.send(e,t).catch(e=>{var t;let r;if("Socket closed unexpectedly"===(r=null!=(t=null==e?void 0:e.message)?t:"")||r.startsWith("Connection closed")||"Connection is closed."===r||"Connection has failed"===r)return Promise.reject(new F(this.closing||this.closed?"Connection is closed":e.message,e));throw e})}multi(){return new rA(this.raw,this.scripts,!0,this)}pipeline(){return new rA(this.raw,this.scripts,!1,this)}async hgetall(e){let t=await this.sendCommand("HGETALL",[e]);if(!t||Array.isArray(t)&&0===t.length)return{};if(Array.isArray(t)){let e={};for(let r=0;r<t.length;r+=2)e[String(t[r])]=String(t[r+1]);return e}return t}async hget(e,t){let r=await this.sendCommand("HGET",[e,t]);return null!=r?r:null}async hmget(e,...t){return(await this.sendCommand("HMGET",[e,...t])||[]).map(e=>null!=e?e:null)}async hset(e,t,...r){let n;if("object"==typeof t)for(let[r,a]of(n=[e],Object.entries(t)))n.push(r,String(a));else{n=[e,t,String(r[0])];for(let e=1;e<r.length;e+=2)n.push(String(r[e]),String(r[e+1]))}return await this.sendCommand("HSET",n)}async hdel(e,...t){return await this.sendCommand("HDEL",[e,...t])}async hexists(e,t){let r=await this.sendCommand("HEXISTS",[e,t]);return+(!0===r||1===r)}async get(e){let t=await this.sendCommand("GET",[e]);return null!=t?t:null}async set(e,t,r){let n=[e,String(t)];return(null==r?void 0:r.PX)!=null?n.push("PX",String(r.PX)):(null==r?void 0:r.EX)!=null&&n.push("EX",String(r.EX)),await this.sendCommand("SET",n)}async del(...e){return 0===e.length?0:await this.sendCommand("DEL",e)}async zrange(e,t,r,n){let a=[e,String(t),String(r)];(null==n?void 0:n.WITHSCORES)&&a.push("WITHSCORES");let i=await this.sendCommand("ZRANGE",a);return i?(null==n?void 0:n.WITHSCORES)&&i.length>0&&Array.isArray(i[0])?i.flatMap(e=>[String(e[0]),String(e[1])]):i.map(String):[]}async zrevrange(e,t,r,n){let a=[e,String(t),String(r)];(null==n?void 0:n.WITHSCORES)&&a.push("WITHSCORES"),a.push("REV");let i=await this.sendCommand("ZRANGE",a);return i?(null==n?void 0:n.WITHSCORES)&&i.length>0&&Array.isArray(i[0])?i.flatMap(e=>[String(e[0]),String(e[1])]):i.map(String):[]}async zcard(e){return await this.sendCommand("ZCARD",[e])}async zscore(e,t){let r=await this.sendCommand("ZSCORE",[e,t]);return null!=r?String(r):null}async lrange(e,t,r){return(await this.sendCommand("LRANGE",[e,String(t),String(r)])||[]).map(String)}async llen(e){return await this.sendCommand("LLEN",[e])}async ltrim(e,t,r){return await this.sendCommand("LTRIM",[e,String(t),String(r)]),"OK"}async lpos(e,t){let r=await this.sendCommand("LPOS",[e,t]);return null!=r?r:null}async smembers(e){return rj(await this.sendCommand("SMEMBERS",[e]))}async xadd(e,t,r,n){let a=[e];for(let[e,i]of((null==n?void 0:n.MAXLEN)!=null&&(a.push("MAXLEN"),!1!==n.approximate&&a.push("~"),a.push(String(n.MAXLEN))),a.push(t),Object.entries(r)))a.push(e,String(i));return await this.raw.send("XADD",a)}async xread(e,t){let r,n=[];for(let r of((null==t?void 0:t.COUNT)!=null&&n.push("COUNT",String(t.COUNT)),(null==t?void 0:t.BLOCK)!=null&&n.push("BLOCK",String(t.BLOCK)),n.push("STREAMS"),e))n.push(r.key);for(let t of e)n.push(t.id);try{r=await this.sendCommand("XREAD",n)}catch(e){if(this.closing)return null;throw e}return r?Array.isArray(r)?r.map(e=>[String(e[0]),(e[1]||[]).map(e=>[String(e[0]),(e[1]||[]).map(String)])]):Object.entries(r).map(([e,t])=>[e,(t||[]).map(e=>[String(e[0]),(e[1]||[]).map(String)])]):null}async xtrim(e,t,r,n){let a=[e,t];return(null==n?void 0:n.approximate)!==!1&&a.push("~"),a.push(String(r)),await this.sendCommand("XTRIM",a)}async bzpopmin(e,t){let r;try{r=await this.sendCommand("BZPOPMIN",[e,String(t)])}catch(e){if(this.closing)return null;throw e}return r&&0!==r.length?[String(r[0]),String(r[1]),String(r[2])]:null}async info(){return await this.sendCommand("INFO",[])}async clientSetName(e){return await this.sendCommand("CLIENT",["SETNAME",e])}async clientList(){return await this.sendCommand("CLIENT",["LIST"])}async scan(e,t){let r=[String(e)];(null==t?void 0:t.MATCH)&&r.push("MATCH",t.MATCH),(null==t?void 0:t.COUNT)&&r.push("COUNT",String(t.COUNT));let n=await this.sendCommand("SCAN",r),a=n[1];return[String(n[0]),Array.isArray(a)?a.map(String):[]]}scanStream(e){let t=this,r="0",n=!1,a=new tl.Readable({objectMode:!0,async read(){if(n&&"0"===r)return void a.push(null);n=!0;try{for(;;){let[n,i]=await t.scan(r,{MATCH:e.match,COUNT:e.count});if(r=n,i.length>0){a.push(i),"0"===r&&a.push(null);return}if("0"===r)return void a.push(null)}}catch(e){a.destroy(e)}}});return a}async keys(e){return(await this.sendCommand("KEYS",[e])||[]).map(String)}async exists(...e){if(0===e.length)return 0;let t=await this.sendCommand("EXISTS",e);return"boolean"==typeof t?+!!t:t}async zadd(e,...t){let r=[e];for(let e=0;e<t.length;e+=2)r.push(String(t[e]),String(t[e+1]));return await this.sendCommand("ZADD",r)}async zrem(e,...t){return await this.sendCommand("ZREM",[e,...t])}async xlen(e){return await this.sendCommand("XLEN",[e])}async xrevrange(e,t,r,...n){let a=[e,t,r];"COUNT"===n[0]&&a.push("COUNT",String(n[1]));let i=await this.sendCommand("XREVRANGE",a);return i?i.map(e=>[String(e[0]),(e[1]||[]).map(String)]):[]}async sadd(e,...t){return await this.sendCommand("SADD",[e,...t.map(String)])}async scard(e){return await this.sendCommand("SCARD",[e])}async lpush(e,...t){return await this.sendCommand("LPUSH",[e,...t])}async rpop(e){let t=await this.sendCommand("RPOP",[e]);return null!=t?t:null}async incr(e){return await this.sendCommand("INCR",[e])}async incrby(e,t){return await this.sendCommand("INCRBY",[e,String(t)])}async flushall(){return await this.sendCommand("FLUSHALL",[])}}class rA{constructor(e,t,r,n){this.raw=e,this.scripts=t,this.transactional=r,this.adapter=n,this.commands=[],this.transformers=[],this.scriptsToLoad=[]}addCommand(e,t,r){this.commands.push({cmd:e,args:t}),this.transformers.push(r||(e=>e))}hgetall(e){return this.addCommand("HGETALL",[e],e=>{if(!e||Array.isArray(e)&&0===e.length)return{};if(Array.isArray(e)){let t={};for(let r=0;r<e.length;r+=2)t[String(e[r])]=String(e[r+1]);return t}return e}),this}hset(e,t){let r=[e];for(let[e,n]of Object.entries(t))r.push(e,String(n));return this.addCommand("HSET",r),this}hscan(e,t,r){let n=[e,String(t)];return(null==r?void 0:r.COUNT)!=null&&n.push("COUNT",String(r.COUNT)),this.addCommand("HSCAN",n,e=>e&&Array.isArray(e)?[String(e[0]),rj(e[1])]:["0",[]]),this}smembers(e){return this.addCommand("SMEMBERS",[e],e=>rj(e)),this}sscan(e,t,r){let n=[e,String(t)];return(null==r?void 0:r.COUNT)!=null&&n.push("COUNT",String(r.COUNT)),this.addCommand("SSCAN",n,e=>e&&Array.isArray(e)?[String(e[0]),rj(e[1])]:["0",[]]),this}zrange(e,t,r){return this.addCommand("ZRANGE",[e,String(t),String(r)],e=>Array.isArray(e)?e.map(String):[]),this}lrange(e,t,r){return this.addCommand("LRANGE",[e,String(t),String(r)],e=>Array.isArray(e)?e.map(String):[]),this}llen(e){return this.addCommand("LLEN",[e]),this}del(...e){return e.length>0&&this.addCommand("DEL",e),this}runCommand(e,t){let r=this.scripts.get(e);if(!r)throw Error(`BullMQ: unknown command "${e}" in transaction`);let n=rw(t),{sha:a,numberOfKeys:i}=r,s=n.slice(0,i).map(String),o=n.slice(i).map(e=>Buffer.isBuffer(e)?e:null==e?"":String(e));return this.scriptsToLoad.push(r),this.addCommand("EVALSHA",[a,String(s.length),...s,...o]),this}async exec(){if(0===this.commands.length)return[];if(this.scriptsToLoad.length>0&&await this.adapter.ensureScriptsLoaded(this.scriptsToLoad),!this.transactional)return(await Promise.allSettled(this.commands.map(({cmd:e,args:t})=>this.adapter.sendCommand(e,t)))).map((e,t)=>{if("rejected"===e.status)return[e.reason,null];let r=this.transformers[t];return[null,r?r(e.value):e.value]});let e=e=>{};try{for(let{cmd:t,args:r}of(this.raw.send("MULTI",[]).catch(e),this.commands))this.raw.send(t,r).catch(e);let t=await this.raw.send("EXEC",[]);if(!t)return null;return t.map((e,t)=>{if(e instanceof Error)return[e,null];let r=this.transformers[t],n=r?r(e):e;return[null,n]})}catch(e){try{await this.raw.send("DISCARD",[])}catch(e){}throw e}}}var rT=e.i(26938),rD=N;class rC extends rD.EventEmitter{constructor(e,t={connection:{}},r=rg,n=!1){if(super(),this.name=e,this.opts=t,this.closed=!1,this.hasBlockingConnection=!1,this.hasBlockingConnection=n,this.opts=Object.assign({prefix:"bull"},t),!e)throw Error("Queue name must be provided");if(e.includes(":"))throw Error("Queue name cannot contain :");this.connection=new r(t.connection,{shared:H(t.connection),blocking:n,skipVersionCheck:t.skipVersionCheck,skipWaitingForReady:t.skipWaitingForReady}),this.connection.on("error",e=>this.emit("error",e)),this.connection.on("close",()=>{this.closing||this.emit("ioredis:close")});const a=new tg(t.prefix);this.qualifiedName=a.getQueueQualifiedName(e),this.keys=a.getKeys(e),this.toKey=t=>a.toKey(e,t),this.createScripts()}get client(){return this.connection.client}createScripts(){this.scripts=ty(this)}get redisVersion(){return this.connection.redisVersion}get databaseType(){return this.connection.databaseType}get Job(){return tf}emit(e,...t){try{return super.emit(e,...t)}catch(e){try{return super.emit("error",e)}catch(e){return console.error(e),!1}}}waitUntilReady(){return this.client}base64Name(){return Buffer.from(this.name).toString("base64")}clientName(e=""){let t=this.base64Name();return`${this.opts.prefix}:${t}${e}`}async close(){this.closing||(this.closing=this.connection.close()),await this.closing,this.closed=!0}disconnect(){return this.connection.disconnect()}async checkConnectionError(e,t=5e3){try{return await e()}catch(e){if(X(e)&&this.emit("error",e),this.closing||!t)return;await new Promise(e=>{let r;r=setTimeout(()=>{clearTimeout(r),e()},t)})}}trace(e,t,r,n,a){return er(this.opts.telemetry,e,this.name,t,r,n,a)}}class rO extends rC{constructor(e,t,r){super(e,t,r),this.repeatStrategy=t.settings&&t.settings.repeatStrategy||rR}async upsertJobScheduler(e,t,r,n,a,{override:i,producerId:s}){let o,{every:l,limit:d,pattern:u,offset:c}=t;if(u&&l)throw Error("Both .pattern and .every options are defined for this repeatable job");if(!u&&!l)throw Error("Either .pattern or .every options must be defined for this repeatable job");if(t.immediately&&t.startDate)throw Error("Both .immediately and .startDate options are defined for this repeatable job");t.immediately&&t.every&&console.warn("Using option immediately with every does not affect the job's schedule. Job will run immediately anyway.");let p=t.count?t.count+1:1;if(void 0!==t.limit&&p>t.limit)return;let h=Date.now(),{endDate:y}=t;if(y&&h>new Date(y).getTime())return;let m=a.prevMillis||0;h=m<h?h:m;let{immediately:f}=t,b=en(t,["immediately"]),g=l&&c?c:null;if(u&&(o=await this.repeatStrategy(h,t,r))<h&&(o=h),o||l)return this.trace(k.PRODUCER,"add",`${this.name}.${r}`,async(c,m)=>{var f,K;let v=a.telemetry;if(m){let e=null==(f=a.telemetry)?void 0:f.omitContext,t=(null==(K=a.telemetry)?void 0:K.metadata)||!e&&m;(t||e)&&(v={metadata:t,omitContext:e})}let S=this.getNextJobOpts(o,e,Object.assign(Object.assign({},a),{repeat:b,telemetry:v}),p,g);if(i){o<h&&(o=h);let[i,p]=await this.scripts.addJobScheduler(e,o,JSON.stringify(void 0===n?{}:n),tf.optsAsJSON(a),{name:r,startDate:t.startDate?new Date(t.startDate).getTime():void 0,endDate:y?new Date(y).getTime():void 0,tz:t.tz,pattern:u,every:l,limit:d,offset:g},tf.optsAsJSON(S),s),m="string"==typeof p?parseInt(p,10):p,f=new this.Job(this,r,n,Object.assign(Object.assign({},S),{delay:m}),i);return f.id=i,null==c||c.setAttributes({[E.JobSchedulerId]:e,[E.JobId]:f.id}),f}{let t=await this.scripts.updateJobSchedulerNextMillis(e,o,JSON.stringify(void 0===n?{}:n),tf.optsAsJSON(S),s);if(t){let a=new this.Job(this,r,n,S,t);return a.id=t,null==c||c.setAttributes({[E.JobSchedulerId]:e,[E.JobId]:a.id}),a}}})}getNextJobOpts(e,t,r,n,a){var i,s;let o=this.getSchedulerNextJobId({jobSchedulerId:t,nextMillis:e}),l=Date.now(),d=e+a-l,u=Object.assign(Object.assign({},r),{jobId:o,delay:d<0?0:d,timestamp:l,prevMillis:e,repeatJobKey:t});return u.repeat=Object.assign(Object.assign({},r.repeat),{offset:a,count:n,startDate:(null==(i=r.repeat)?void 0:i.startDate)?new Date(r.repeat.startDate).getTime():void 0,endDate:(null==(s=r.repeat)?void 0:s.endDate)?new Date(r.repeat.endDate).getTime():void 0}),u}async removeJobScheduler(e){return this.scripts.removeJobScheduler(e)}async getSchedulerData(e,t,r){let n=await e.hgetall(this.toKey("repeat:"+t));return this.transformSchedulerData(t,n,r)}transformSchedulerData(e,t,r){if(t&&Object.keys(t).length>0){let n={key:e,name:t.name,next:r};return t.ic&&(n.iterationCount=parseInt(t.ic)),t.limit&&(n.limit=parseInt(t.limit)),t.startDate&&(n.startDate=parseInt(t.startDate)),t.endDate&&(n.endDate=parseInt(t.endDate)),t.tz&&(n.tz=t.tz),t.pattern&&(n.pattern=t.pattern),t.every&&(n.every=parseInt(t.every)),t.offset&&(n.offset=parseInt(t.offset)),(t.data||t.opts)&&(n.template=this.getTemplateFromJSON(t.data,t.opts)),n}if(e.includes(":"))return this.keyToData(e,r)}keyToData(e,t){let r=e.split(":"),n=r.slice(4).join(":")||null;return{key:e,name:r[0],id:r[1]||null,endDate:parseInt(r[2])||null,tz:r[3]||null,pattern:n,next:t}}async isJobScheduler(e){let t=await this.client;return 1===await t.hexists(`${this.keys.repeat}:${e}`,"ic")}async getScheduler(e){let[t,r]=await this.scripts.getJobScheduler(e);return this.transformSchedulerData(e,t?Y(t):null,r?parseInt(r):null)}getTemplateFromJSON(e,t){let r={};return e&&(r.data=JSON.parse(e)),t&&(r.opts=tf.optsFromJSON(t)),r}async getJobSchedulers(e=0,t=-1,r=!1){let n=await this.client,a=this.keys.repeat,i=r?await n.zrange(a,e,t,{WITHSCORES:!0}):await n.zrevrange(a,e,t,{WITHSCORES:!0}),s=[];for(let e=0;e<i.length;e+=2)s.push(this.getSchedulerData(n,i[e],parseInt(i[e+1])));return Promise.all(s)}async getSchedulersCount(){let e=this.keys.repeat;return(await this.client).zcard(e)}getSchedulerNextJobId({nextMillis:e,jobSchedulerId:t}){return`repeat:${t}:${e}`}}let rR=(e,t)=>{let{pattern:r}=t,n=new Date(e),a=t.startDate&&new Date(t.startDate),i=(0,rT.parseExpression)(r,Object.assign(Object.assign({},t),{currentDate:a>n?a:n}));try{if(t.immediately)return new Date().getTime();return i.next().getTime()}catch(e){}};function rM(e){return String(e).replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\n/g,"\\n")}class rP extends rC{getJob(e){return this.Job.fromId(this,e)}commandByType(e,t,r){return e.map(e=>{e="waiting"===e?"wait":e;let n=this.toKey(e);switch(e){case"completed":case"failed":case"delayed":case"prioritized":case"repeat":case"waiting-children":return r(n,t?"zcard":"zrange");case"active":case"wait":case"paused":return r(n,t?"llen":"lrange")}})}sanitizeJobTypes(e){let t="string"==typeof e?[e]:e;if(Array.isArray(t)&&t.length>0){let e=[...t];return -1!==e.indexOf("waiting")&&e.push("paused"),[...new Set(e)]}return["active","completed","delayed","failed","paused","prioritized","waiting","waiting-children"]}async count(){return await this.getJobCountByTypes("waiting","paused","delayed","prioritized","waiting-children")}async getRateLimitTtl(e){return this.scripts.getRateLimitTtl(e)}async getDebounceJobId(e){return(await this.client).get(`${this.keys.de}:${e}`)}async getDeduplicationJobId(e){return(await this.client).get(`${this.keys.de}:${e}`)}async getGlobalConcurrency(){let e=await this.client,t=await e.hget(this.keys.meta,"concurrency");return t?Number(t):null}async getGlobalRateLimit(){let e=await this.client,[t,r]=await e.hmget(this.keys.meta,"max","duration");return t&&r?{max:Number(t),duration:Number(r)}:null}async getJobCountByTypes(...e){return Object.values(await this.getJobCounts(...e)).reduce((e,t)=>e+t,0)}async getJobCounts(...e){let t=this.sanitizeJobTypes(e),r=await this.scripts.getCounts(t),n={};return r.forEach((e,r)=>{n[t[r]]=e||0}),n}async recordJobCountsMetric(...e){var t;let r=await this.getJobCounts(...e),n=null==(t=this.opts.telemetry)?void 0:t.meter;if(n&&"function"==typeof n.createGauge){let e=n.createGauge(I.QueueJobsCount,{description:"Number of jobs in the queue by state",unit:"{jobs}"});for(let[t,n]of Object.entries(r))e.record(n,{[E.QueueName]:this.name,[E.QueueJobsState]:t})}return r}getJobState(e){return this.scripts.getState(e)}async getMeta(){let e=await this.client,t=await e.hgetall(this.keys.meta),{concurrency:r,max:n,duration:a,paused:i,"opts.maxLenEvents":s}=t,o=en(t,["concurrency","max","duration","paused","opts.maxLenEvents"]);return r&&(o.concurrency=Number(r)),s&&(o.maxLenEvents=Number(s)),n&&(o.max=Number(n)),a&&(o.duration=Number(a)),o.paused="1"===i,o}getCompletedCount(){return this.getJobCountByTypes("completed")}getFailedCount(){return this.getJobCountByTypes("failed")}getDelayedCount(){return this.getJobCountByTypes("delayed")}getActiveCount(){return this.getJobCountByTypes("active")}getPrioritizedCount(){return this.getJobCountByTypes("prioritized")}async getCountsPerPriority(e){let t=[...new Set(e)],r=await this.scripts.getCountsPerPriority(t),n={};return r.forEach((e,r)=>{n[`${t[r]}`]=e||0}),n}getWaitingCount(){return this.getJobCountByTypes("waiting")}getWaitingChildrenCount(){return this.getJobCountByTypes("waiting-children")}getWaiting(e=0,t=-1){return this.getJobs(["waiting"],e,t,!0)}getWaitingChildren(e=0,t=-1){return this.getJobs(["waiting-children"],e,t,!0)}getActive(e=0,t=-1){return this.getJobs(["active"],e,t,!0)}getDelayed(e=0,t=-1){return this.getJobs(["delayed"],e,t,!0)}getPrioritized(e=0,t=-1){return this.getJobs(["prioritized"],e,t,!0)}getCompleted(e=0,t=-1){return this.getJobs(["completed"],e,t,!1)}getFailed(e=0,t=-1){return this.getJobs(["failed"],e,t,!1)}async getDependencies(e,t,r,n){let a=this.toKey("processed"==t?`${e}:processed`:`${e}:dependencies`),{items:i,total:s,jobs:o}=await this.scripts.paginate(a,{start:r,end:n,fetchJobs:!0});return{items:i,jobs:o,total:s}}async getRanges(e,t=0,r=1,n=!1){let a=[];this.commandByType(e,!1,(e,t)=>{switch(t){case"lrange":a.push("lrange");break;case"zrange":a.push("zrange")}});let i=await this.scripts.getRanges(e,t,r,n),s=[];return i.forEach((e,t)=>{let r=e||[];s=n&&"lrange"===a[t]?s.concat(r.reverse()):s.concat(r)}),[...new Set(s)]}async getJobs(e,t=0,r=-1,n=!1){let a=this.sanitizeJobTypes(e);return Promise.all((await this.getRanges(a,t,r,n)).map(e=>this.Job.fromId(this,e)))}async getJobLogs(e,t=0,r=-1,n=!0){let a=(await this.client).multi(),i=this.toKey(e+":logs");n?a.lrange(i,t,r):a.lrange(i,-(r+1),-(t+1)),a.llen(i);let s=await a.exec();return n||s[0][1].reverse(),{logs:s[0][1],count:s[1][1]}}async baseGetClients(e){let t=await this.client;try{if(t.isCluster&&"function"==typeof t.nodes){let r=t.nodes(),n=[];for(let t=0;t<r.length;t++){let a=r[t],i="function"==typeof a.clientList?await a.clientList():await a.client("LIST"),s=this.parseClientList(i,e);n.push(s)}return n.reduce((e,t)=>e.length>t.length?e:t,[])}{let r=await t.clientList();return this.parseClientList(r,e)}}catch(e){if(!Z.test(e.message))throw e;return[{name:"GCP does not support client list"}]}}getWorkers(){let e=`${this.clientName()}`,t=`${this.clientName()}:w:`;return this.baseGetClients(r=>r&&(r===e||r.startsWith(t)))}async getWorkersCount(){return(await this.getWorkers()).length}async getQueueEvents(){let e=`${this.clientName()}:qe`;return this.baseGetClients(t=>t===e)}async getMetrics(e,t=0,r=-1){let[n,a,i]=await this.scripts.getMetrics(e,t,r);return{meta:{count:parseInt(n[0]||"0",10),prevTS:parseInt(n[1]||"0",10),prevCount:parseInt(n[2]||"0",10)},data:a.map(e=>+e||0),count:i}}parseClientList(e,t){let r=e.split(/\r?\n/),n=[];return r.forEach(e=>{let r={};e.split(" ").forEach(function(e){let t=e.indexOf("="),n=e.substring(0,t),a=e.substring(t+1);r[n]=a});let a=r.name;t(a)&&(r.name=this.name,r.rawname=a,n.push(r))}),n}async exportPrometheusMetrics(e){let t=await this.getJobCounts(),r=[];r.push("# HELP bullmq_job_count Number of jobs in the queue by state"),r.push("# TYPE bullmq_job_count gauge");let n=rM(this.name),a=e?Object.keys(e).reduce((t,r)=>`${t}, ${r}="${rM(e[r])}"`,""):"";for(let[e,i]of Object.entries(t))r.push(`bullmq_job_count{queue="${n}", state="${e}"${a}} ${i}`);let[i,s]=await Promise.all([this.getMetrics("completed"),this.getMetrics("failed")]);return r.push("# HELP bullmq_job_completed_total Total number of completed jobs"),r.push("# TYPE bullmq_job_completed_total counter"),r.push(`bullmq_job_completed_total{queue="${n}"${a}} ${i.meta.count}`),r.push("# HELP bullmq_job_failed_total Total number of failed jobs"),r.push("# TYPE bullmq_job_failed_total counter"),r.push(`bullmq_job_failed_total{queue="${n}"${a}} ${s.meta.count}`),r.join("\n")}}class rN extends rC{constructor(e,t,r){super(e,t,r),this.repeatStrategy=t.settings&&t.settings.repeatStrategy||rL,this.repeatKeyHashAlgorithm=t.settings&&t.settings.repeatKeyHashAlgorithm||"md5"}async updateRepeatableJob(e,t,r,{override:n}){var a;let i=Object.assign({},r.repeat);null!=i.pattern||(i.pattern=i.cron),delete i.cron;let s=i.count?i.count+1:1;if(void 0!==i.limit&&s>i.limit)return;let o=Date.now(),{endDate:l}=i;if(l&&o>new Date(l).getTime())return;let d=r.prevMillis||0;o=d<o?o:d;let u=await this.repeatStrategy(o,i,e),{every:c,pattern:p}=i,h=!!((c||p)&&i.immediately),y=h&&c?o-u:void 0;if(u){let o;!d&&r.jobId&&(i.jobId=r.jobId);let m=rJ(e,i),f=null!=(a=r.repeat.key)?a:this.hash(m);if(n)o=await this.scripts.addRepeatableJob(f,u,{name:e,endDate:l?new Date(l).getTime():void 0,tz:i.tz,pattern:p,every:c},m);else{let e=await this.client;o=await this.scripts.updateRepeatableJobMillis(e,f,u,m)}let{immediately:b}=i,g=en(i,["immediately"]);return this.createNextJob(e,u,o,Object.assign(Object.assign({},r),{repeat:Object.assign({offset:y},g)}),t,s,h)}}async createNextJob(e,t,r,n,a,i,s){let o=this.getRepeatJobKey(e,t,r,a),l=Date.now(),d=t+(n.repeat.offset?n.repeat.offset:0)-l,u=Object.assign(Object.assign({},n),{jobId:o,delay:d<0||s?0:d,timestamp:l,prevMillis:t,repeatJobKey:r});return u.repeat=Object.assign(Object.assign({},n.repeat),{count:i}),this.Job.create(this,e,a,u)}getRepeatJobKey(e,t,r,n){return r.split(":").length>2?this.getRepeatJobId({name:e,nextMillis:t,namespace:this.hash(r),jobId:null==n?void 0:n.id}):this.getRepeatDelayedJobId({customKey:r,nextMillis:t})}async removeRepeatable(e,t,r){var n;let a=rJ(e,Object.assign(Object.assign({},t),{jobId:r})),i=null!=(n=t.key)?n:this.hash(a),s=this.getRepeatJobId({name:e,nextMillis:"",namespace:this.hash(a),jobId:null!=r?r:t.jobId,key:t.key});return this.scripts.removeRepeatable(s,a,i)}async removeRepeatableByKey(e){let t=this.keyToData(e),r=this.getRepeatJobId({name:t.name,nextMillis:"",namespace:this.hash(e),jobId:t.id});return this.scripts.removeRepeatable(r,"",e)}async getRepeatableData(e,t,r){let n=await e.hgetall(this.toKey("repeat:"+t));return n?{key:t,name:n.name,endDate:parseInt(n.endDate)||null,tz:n.tz||null,pattern:n.pattern||null,every:n.every||null,next:r}:this.keyToData(t,r)}keyToData(e,t){let r=e.split(":"),n=r.slice(4).join(":")||null;return{key:e,name:r[0],id:r[1]||null,endDate:parseInt(r[2])||null,tz:r[3]||null,pattern:n,next:t}}async getRepeatableJobs(e=0,t=-1,r=!1){let n=await this.client,a=this.keys.repeat,i=r?await n.zrange(a,e,t,{WITHSCORES:!0}):await n.zrevrange(a,e,t,{WITHSCORES:!0}),s=[];for(let e=0;e<i.length;e+=2)s.push(this.getRepeatableData(n,i[e],parseInt(i[e+1])));return Promise.all(s)}async getRepeatableCount(){return(await this.client).zcard(this.toKey("repeat"))}hash(e){return(0,L.createHash)(this.repeatKeyHashAlgorithm).update(e).digest("hex")}getRepeatDelayedJobId({nextMillis:e,customKey:t}){return`repeat:${t}:${e}`}getRepeatJobId({name:e,nextMillis:t,namespace:r,jobId:n,key:a}){let i=null!=a?a:this.hash(`${e}${n||""}${r}`);return`repeat:${i}:${t}`}}function rJ(e,t){let r=t.endDate?new Date(t.endDate).getTime():"",n=t.tz||"",a=t.pattern||String(t.every)||"",i=t.jobId?t.jobId:"";return`${e}:${i}:${r}:${n}:${a}`}let rL=(e,t)=>{let r=t.pattern;if(r&&t.every)throw Error("Both .pattern and .every options are defined for this repeatable job");if(t.every)return Math.floor(e/t.every)*t.every+(t.immediately?0:t.every);let n=new Date(t.startDate&&new Date(t.startDate)>new Date(e)?t.startDate:e),a=(0,rT.parseExpression)(r,Object.assign(Object.assign({},t),{currentDate:n}));try{if(t.immediately)return new Date().getTime();return a.next().getTime()}catch(e){}};class r_ extends rP{constructor(e,t,r){var n;super(e,Object.assign({},t),r),this.token=function(){if("function"==typeof L.randomUUID)return(0,L.randomUUID)();let e=(0,L.randomBytes)(16);return e[6]=15&e[6]|64,e[8]=63&e[8]|128,[e.toString("hex",0,4),e.toString("hex",4,6),e.toString("hex",6,8),e.toString("hex",8,10),e.toString("hex",10,16)].join("-")}(),this.libName="bullmq",this.jobsOpts=null!=(n=null==t?void 0:t.defaultJobOptions)?n:{},this.waitUntilReady().then(e=>{if(!this.closing&&!(null==t?void 0:t.skipMetasUpdate))return e.hset(this.keys.meta,this.metaValues)}).catch(e=>{})}emit(e,...t){return super.emit(e,...t)}off(e,t){return super.off(e,t),this}on(e,t){return super.on(e,t),this}once(e,t){return super.once(e,t),this}get defaultJobOptions(){return Object.assign({},this.jobsOpts)}get metaValues(){var e,t,r,n;return{"opts.maxLenEvents":null!=(n=null==(r=null==(t=null==(e=this.opts)?void 0:e.streams)?void 0:t.events)?void 0:r.maxLen)?n:1e4,version:`${this.libName}:${td}`}}async getVersion(){let e=await this.client;return await e.hget(this.keys.meta,"version")}get repeat(){return new Promise(async e=>{this._repeat||(this._repeat=new rN(this.name,Object.assign(Object.assign({},this.opts),{connection:await this.client})),this._repeat.on("error",this.emit.bind(this,"error"))),e(this._repeat)})}get jobScheduler(){return new Promise(async e=>{this._jobScheduler||(this._jobScheduler=new rO(this.name,Object.assign(Object.assign({},this.opts),{connection:await this.client})),this._jobScheduler.on("error",this.emit.bind(this,"error"))),e(this._jobScheduler)})}async setGlobalConcurrency(e){return(await this.client).hset(this.keys.meta,{concurrency:e})}async setGlobalRateLimit(e,t){return(await this.client).hset(this.keys.meta,{max:e,duration:t})}async removeGlobalConcurrency(){return(await this.client).hdel(this.keys.meta,"concurrency")}async removeGlobalRateLimit(){return(await this.client).hdel(this.keys.meta,"max","duration")}async add(e,t,r){return this.trace(k.PRODUCER,"add",`${this.name}.${e}`,async(n,a)=>{var i;!a||(null==(i=null==r?void 0:r.telemetry)?void 0:i.omitContext)||(r=Object.assign(Object.assign({},r),{telemetry:{metadata:a}}));let s=await this.addJob(e,t,r);return null==n||n.setAttributes({[E.JobName]:e,[E.JobId]:s.id}),s})}async addJob(e,t,r){if(r&&r.repeat){if(r.repeat.endDate&&+new Date(r.repeat.endDate)<Date.now())throw Error("End date must be greater than current timestamp");return(await this.repeat).updateRepeatableJob(e,t,Object.assign(Object.assign({},this.jobsOpts),r),{override:!0})}{let n=null==r?void 0:r.jobId;if("0"==n||(null==n?void 0:n.startsWith("0:")))throw Error("JobId cannot be '0' or start with 0:");let a=Object.assign(Object.assign(Object.assign({},this.jobsOpts),r),{jobId:n}),i=await this.Job.create(this,e,t,a);return this.emit("waiting",i),i}}async addBulk(e){return this.trace(k.PRODUCER,"addBulk",this.name,async(t,r)=>(t&&t.setAttributes({[E.BulkNames]:e.map(e=>e.name),[E.BulkCount]:e.length}),await this.Job.createBulk(this,e.map(e=>{var t,n,a,i,s,o;let l=null==(t=e.opts)?void 0:t.telemetry;if(r){let t=null==(a=null==(n=e.opts)?void 0:n.telemetry)?void 0:a.omitContext,o=(null==(s=null==(i=e.opts)?void 0:i.telemetry)?void 0:s.metadata)||!t&&r;(o||t)&&(l={metadata:o,omitContext:t})}let d=Object.assign(Object.assign(Object.assign({},this.jobsOpts),e.opts),{jobId:null==(o=e.opts)?void 0:o.jobId,telemetry:l});return{name:e.name,data:e.data,opts:d}}))))}async upsertJobScheduler(e,t,r){var n,a;if(t.endDate&&+new Date(t.endDate)<Date.now())throw Error("End date must be greater than current timestamp");return(await this.jobScheduler).upsertJobScheduler(e,t,null!=(n=null==r?void 0:r.name)?n:e,null!=(a=null==r?void 0:r.data)?a:{},Object.assign(Object.assign({},this.jobsOpts),null==r?void 0:r.opts),{override:!0})}async pause(){await this.trace(k.INTERNAL,"pause",this.name,async()=>{await this.scripts.pause(!0),this.emit("paused")})}async close(){await this.trace(k.INTERNAL,"close",this.name,async()=>{!this.closing&&this._repeat&&await this._repeat.close(),await super.close()})}async rateLimit(e){await this.trace(k.INTERNAL,"rateLimit",this.name,async t=>{null==t||t.setAttributes({[E.QueueRateLimit]:e}),await this.client.then(t=>t.set(this.keys.limiter,Number.MAX_SAFE_INTEGER,{PX:e}))})}async resume(){await this.trace(k.INTERNAL,"resume",this.name,async()=>{await this.scripts.pause(!1),this.emit("resumed")})}async isPaused(){let e=await this.client;return 1===await e.hexists(this.keys.meta,"paused")}isMaxed(){return this.scripts.isMaxed()}async getRepeatableJobs(e,t,r){return(await this.repeat).getRepeatableJobs(e,t,r)}async getJobScheduler(e){return(await this.jobScheduler).getScheduler(e)}async getJobSchedulers(e,t,r){return(await this.jobScheduler).getJobSchedulers(e,t,r)}async getJobSchedulersCount(){return(await this.jobScheduler).getSchedulersCount()}async removeRepeatable(e,t,r){return this.trace(k.INTERNAL,"removeRepeatable",`${this.name}.${e}`,async n=>{null==n||n.setAttributes({[E.JobName]:e,[E.JobId]:r});let a=await this.repeat;return!await a.removeRepeatable(e,t,r)})}async removeJobScheduler(e){let t=await this.jobScheduler;return!await t.removeJobScheduler(e)}async removeDebounceKey(e){return this.trace(k.INTERNAL,"removeDebounceKey",`${this.name}`,async t=>{null==t||t.setAttributes({[E.JobKey]:e});let r=await this.client;return await r.del(`${this.keys.de}:${e}`)})}async removeDeduplicationKey(e){return this.trace(k.INTERNAL,"removeDeduplicationKey",`${this.name}`,async t=>(null==t||t.setAttributes({[E.DeduplicationKey]:e}),(await this.client).del(`${this.keys.de}:${e}`)))}async removeRateLimitKey(){return(await this.client).del(this.keys.limiter)}async removeRepeatableByKey(e){return this.trace(k.INTERNAL,"removeRepeatableByKey",`${this.name}`,async t=>{null==t||t.setAttributes({[E.JobKey]:e});let r=await this.repeat;return!await r.removeRepeatableByKey(e)})}async remove(e,{removeChildren:t=!0}={}){return this.trace(k.INTERNAL,"remove",this.name,async r=>{null==r||r.setAttributes({[E.JobId]:e,[E.JobOptions]:JSON.stringify({removeChildren:t})});let n=await this.scripts.remove(e,t);return 1===n&&this.emit("removed",e),n})}async updateJobProgress(e,t){await this.trace(k.INTERNAL,"updateJobProgress",this.name,async r=>{null==r||r.setAttributes({[E.JobId]:e,[E.JobProgress]:JSON.stringify(t)}),await this.scripts.updateProgress(e,t),this.emit("progress",e,t)})}async addJobLog(e,t,r){return tf.addJobLog(this,e,t,r)}async drain(e=!1){await this.trace(k.INTERNAL,"drain",this.name,async t=>{null==t||t.setAttributes({[E.QueueDrainDelay]:e}),await this.scripts.drain(e)})}async clean(e,t,r="completed"){return this.trace(k.INTERNAL,"clean",this.name,async n=>{let a=t||1/0,i=Math.min(1e4,a),s=Date.now()-e,o=0,l=[],d="waiting"===r?"wait":r;for(;o<a;){let e=await this.scripts.cleanJobsInSet(d,s,i);if(this.emit("cleaned",e,d),o+=e.length,l.push(...e),e.length<i)break}return null==n||n.setAttributes({[E.QueueGrace]:e,[E.JobType]:r,[E.QueueCleanLimit]:a,[E.JobIds]:l}),l})}async obliterate(e){await this.trace(k.INTERNAL,"obliterate",this.name,async()=>{await this.pause();let t=0;do t=await this.scripts.obliterate(Object.assign({force:!1,count:1e3},e));while(t)})}async retryJobs(e={}){await this.trace(k.PRODUCER,"retryJobs",this.name,async t=>{null==t||t.setAttributes({[E.QueueOptions]:JSON.stringify(e)});let r=0;do r=await this.scripts.retryJobs(e.state,e.count,e.timestamp);while(r)})}async promoteJobs(e={}){await this.trace(k.INTERNAL,"promoteJobs",this.name,async t=>{null==t||t.setAttributes({[E.QueueOptions]:JSON.stringify(e)});let r=0;do r=await this.scripts.promoteJobs(e.count);while(r)})}async trimEvents(e){return this.trace(k.INTERNAL,"trimEvents",this.name,async t=>{null==t||t.setAttributes({[E.QueueEventMaxLength]:e});let r=await this.client;return await r.xtrim(this.keys.events,"MAXLEN",e,{approximate:!0})})}async removeDeprecatedPriorityKey(){return(await this.client).del(this.toKey("priority"))}async removeOrphanedJobs(e=1e3,t=0){let r=await this.client,n=new Set(Object.keys(this.keys)),a=Object.keys(this.keys).filter(e=>""!==e),i=["logs","dependencies","processed","failed","unsuccessful","lock"],s=this.qualifiedName+":",o=s+"*",l=0,d="0";do{let[u,c]=await r.scan(d,{MATCH:o,COUNT:e});d=u;let p=new Set;for(let e of c){let t=e.slice(s.length);if(n.has(t))continue;let r=t.indexOf(":");if(-1!==r){let e=t.slice(0,r);if(n.has(e))continue}let a=-1===r?t:t.slice(0,r);if(-1!==r){let e=t.slice(r+1);if(!i.includes(e))continue}p.add(a)}if(0===p.size)continue;if(l+=await this.scripts.removeOrphanedJobs([...p],a,i)||0,t>0&&l>=t)break}while("0"!==d)return l}}e.i(22734),e.i(92509),(b=M||(M={})).blocking="blocking",b.normal="normal";let rF=globalThis;function rq(){return rF.__omRedis||(rF.__omRedis=new tv.default({host:process.env.REDIS_HOST??"localhost",port:Number(process.env.REDIS_PORT??6379),maxRetriesPerRequest:null,retryStrategy:e=>e>3?(console.error("[queue] 无法连接 Redis。请确认 Docker Desktop 已启动，并执行: npm run redis:up"),null):Math.min(500*e,2e3)})),rF.__omRedis}function rG(){let e=null,t=new Map;return{async publish(e,t){await rq().publish(e,JSON.stringify(t))},async subscribe(r,n){e||((e=rq().duplicate()).on("message",(e,r)=>{let n,a=t.get(e);if(a){try{n=JSON.parse(r)}catch{return}for(let e of Array.from(a))try{e(n)}catch{}}}),e.on("error",()=>{}));let a=t.get(r);return a||(a=new Set,t.set(r,a)),a.add(n),await e.subscribe(r),async()=>{a?.delete(n),e&&await e.unsubscribe(r).catch(()=>{})}}}}e.s(["getQueue",0,function(){return rF.__omQueue||(rF.__omQueue=new r_("video-generation",{connection:rq(),defaultJobOptions:{removeOnComplete:{count:100},removeOnFail:{count:100},attempts:1}})),rF.__omQueue},"getRedisConnection",0,rq],68486),e.s(["createRedisEventBus",0,rG],99663),rG();let rV={research:"research",generate_proposal:"proposal",script_generation:"script",asset_gen:"assets",tts:"audio",scene_json_assembler:"scenes",shot_video_gen:"shots",video_merge:"video"};e.s(["GATE_QUESTIONS",0,{pause_gate_1:"已确认需求，开始设计提案？",pause_gate_2:"提案与脚本就绪，开始生成素材与配音？",pause_gate_3:"场景规格已组装，开始逐镜头生成视频？",pause_gate_4:"镜头已全部生成，确认开始拼接？",pause_gate_video:"视频生成：等待 Claude 用套餐视频模型生成各场景视频（跳过视频 API）。"},"eventChannel",0,e=>`om:events:${e}`,"nodeToCardType",0,function(e){return rV[e]??null}],70322);let rY=e=>`om:paused:${e}`,rB=e=>`om:deleted:${e}`,rz=e=>`om:awaiting:${e}`;async function rU(e){let t=rq();return await t.exists(rY(e))===1}async function rW(e,t){let r=rq();t?await r.set(rY(e),"1"):await r.del(rY(e))}async function rH(e){let t=rq();return await t.exists(rz(e))===1}async function r$(e,t){let r=rq();t?await r.set(rz(e),"1"):await r.del(rz(e))}async function rQ(e){let t=rq();await t.set(rB(e),"1","EX",3600)}async function rZ(e){let t=rq();await t.del(rB(e))}async function rX(e){let t=rq();await t.del(...["pause_gate_1","pause_gate_2","pause_gate_3","pause_gate_4","pause_gate_video"].map(t=>`om:decision:${e}:${t}`))}e.s(["clearJobDecisions",0,rX,"clearJobDeleted",0,rZ,"isJobAwaitingReply",0,rH,"isJobPaused",0,rU,"markJobDeleted",0,rQ,"setJobAwaitingReply",0,r$,"setJobPaused",0,rW],22660)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__1uacusg._.js.map