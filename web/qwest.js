!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.qwest=e()}}(function(){var e;return function t(e,n,r){function o(s,a){if(!n[s]){if(!e[s]){var u="function"==typeof require&&require;if(!a&&u)return u(s,!0);if(i)return i(s,!0);var p=new Error("Cannot find module '"+s+"'");throw p.code="MODULE_NOT_FOUND",p}var f=n[s]={exports:{}};e[s][0].call(f.exports,function(t){var n=e[s][1][t];return o(n?n:t)},f,f.exports,t,e,n,r)}return n[s].exports}for(var i="function"==typeof require&&require,s=0;s<r.length;s++)o(r[s]);return o}({1:[function(t,n,r){!function(t){"use strict";var r=function(e){var t=function(e,t,n){n="function"==typeof n?n():null===n?"":void 0===n?"":n,e[e.length]=encodeURIComponent(t)+"="+encodeURIComponent(n)},n=function(e,r,o){var i,s,a;if("[object Array]"===Object.prototype.toString.call(r))for(i=0,s=r.length;s>i;i++)n(e+"["+("object"==typeof r[i]?i:"")+"]",r[i],o);else if(r&&"[object Object]"===r.toString())for(a in r)r.hasOwnProperty(a)&&(e?n(e+"["+a+"]",r[a],o,t):n(a,r[a],o,t));else if(e)t(o,e,r);else for(a in r)t(o,a,r[a]);return o};return n("",e,[]).join("&").replace(/%20/g,"+")};"object"==typeof n&&"object"==typeof n.exports?n.exports=r:"function"==typeof e&&e.amd?e([],function(){return r}):t.param=r}(this)},{}],2:[function(e,t,n){!function(e){function t(e){return"function"==typeof e}function n(e){return"object"==typeof e}function r(e){"undefined"!=typeof setImmediate?setImmediate(e):"undefined"!=typeof process&&process.nextTick?process.nextTick(e):setTimeout(e,0)}var o;e[0][e[1]]=function i(e){var s,a=[],u=[],p=function(e,t){return null==s&&null!=e&&(s=e,a=t,u.length&&r(function(){for(var e=0;e<u.length;e++)u[e]()})),s};return p.then=function(p,f){var c=i(e),l=function(){function e(r){var i,s=0;try{if(r&&(n(r)||t(r))&&t(i=r.then)){if(r===c)throw new TypeError;i.call(r,function(){s++||e.apply(o,arguments)},function(e){s++||c(!1,[e])})}else c(!0,arguments)}catch(a){s++||c(!1,[a])}}try{var r=s?p:f;t(r)?e(r.apply(o,a||[])):c(s,a)}catch(i){c(!1,[i])}};return null!=s?r(l):u.push(l),c},e&&(p=e(p)),p}}("undefined"==typeof t?[window,"pinkySwear"]:[t,"exports"])},{}],qwest:[function(e,t,n){t.exports=function(){var t="undefined"!=typeof window?window:self,n=e("pinkyswear"),r=e("jquery-param"),o={},i="json",s="post",a=null,u=0,p=[],f=t.XMLHttpRequest?function(){return new t.XMLHttpRequest}:function(){return new ActiveXObject("Microsoft.XMLHTTP")},c=""===f().responseType,l=function(e,l,d,y,m){e=e.toUpperCase(),d=d||null,y=y||{};for(var h in o)if(!(h in y))if("object"==typeof o[h]&&"object"==typeof y[h])for(var T in o[h])y[h][T]=o[h][T];else y[h]=o[h];var w,g,v,x,b,j=!1,q=!1,C=!1,O=0,D={},E={text:"*/*",xml:"text/xml",json:"application/json",post:"application/x-www-form-urlencoded",document:"text/html"},M={text:"*/*",xml:"application/xml; q=1.0, text/xml; q=0.8, */*; q=0.1",json:"application/json; q=1.0, text/*; q=0.8, */*; q=0.1"},X=!1,L=n(function(n){return n.abort=function(){C||(g&&4!=g.readyState&&g.abort(),X&&(--u,X=!1),C=!0)},n.send=function(){if(!X){if(u==a)return void p.push(n);if(C)return void(p.length&&p.shift().send());if(++u,X=!0,g=f(),w&&("withCredentials"in g||!t.XDomainRequest||(g=new XDomainRequest,q=!0,"GET"!=e&&"POST"!=e&&(e="POST"))),q?g.open(e,l):(g.open(e,l,y.async,y.user,y.password),c&&y.async&&(g.withCredentials=y.withCredentials)),!q)for(var r in D)D[r]&&g.setRequestHeader(r,D[r]);if(c&&"auto"!=y.responseType)try{g.responseType=y.responseType,j=g.responseType==y.responseType}catch(o){}c||q?(g.onload=R,g.onerror=S,q&&(g.onprogress=function(){})):g.onreadystatechange=function(){4==g.readyState&&R()},y.async?"timeout"in g?(g.timeout=y.timeout,g.ontimeout=k):v=setTimeout(k,y.timeout):q&&(g.ontimeout=function(){}),"auto"!=y.responseType&&"overrideMimeType"in g&&g.overrideMimeType(E[y.responseType]),m&&m(g),q?setTimeout(function(){g.send("GET"!=e?d:null)},0):g.send("GET"!=e?d:null)}},n}),R=function(){var e;if(X=!1,clearTimeout(v),p.length&&p.shift().send(),!C){--u;try{if(j){if("response"in g&&null===g.response)throw"The request response is empty";b=g.response}else{if(e=y.responseType,"auto"==e)if(q)e=i;else{var n=g.getResponseHeader("Content-Type")||"";e=n.indexOf(E.json)>-1?"json":n.indexOf(E.xml)>-1?"xml":"text"}switch(e){case"json":if(g.responseText.length)try{b="JSON"in t?JSON.parse(g.responseText):new Function("return ("+g.responseText+")")()}catch(r){throw"Error while parsing JSON body : "+r}break;case"xml":try{t.DOMParser?b=(new DOMParser).parseFromString(g.responseText,"text/xml"):(b=new ActiveXObject("Microsoft.XMLDOM"),b.async="false",b.loadXML(g.responseText))}catch(r){b=void 0}if(!b||!b.documentElement||b.getElementsByTagName("parsererror").length)throw"Invalid XML";break;default:b=g.responseText}}if("status"in g&&!/^2|1223/.test(g.status))throw g.status+" ("+g.statusText+")";L(!0,[g,b])}catch(r){L(!1,[r,g,b])}}},S=function(e){C||(e="string"==typeof e?e:"Connection aborted",L.abort(),L(!1,[new Error(e),g,null]))},k=function(){C||(y.attempts&&++O==y.attempts?S("Timeout ("+l+")"):(g.abort(),X=!1,L.send()))};if(y.async="async"in y?!!y.async:!0,y.cache="cache"in y?!!y.cache:!1,y.dataType="dataType"in y?y.dataType.toLowerCase():s,y.responseType="responseType"in y?y.responseType.toLowerCase():"auto",y.user=y.user||"",y.password=y.password||"",y.withCredentials=!!y.withCredentials,y.timeout="timeout"in y?parseInt(y.timeout,10):3e4,y.attempts="attempts"in y?parseInt(y.attempts,10):1,x=l.match(/\/\/(.+?)\//),w=x&&(x[1]?x[1]!=location.host:!1),"ArrayBuffer"in t&&d instanceof ArrayBuffer?y.dataType="arraybuffer":"Blob"in t&&d instanceof Blob?y.dataType="blob":"Document"in t&&d instanceof Document?y.dataType="document":"FormData"in t&&d instanceof FormData&&(y.dataType="formdata"),null!==d)switch(y.dataType){case"json":d=JSON.stringify(d);break;case"post":d=r(d)}if(y.headers){var P=function(e,t,n){return t+n.toUpperCase()};for(x in y.headers)D[x.replace(/(^|-)([^-])/g,P)]=y.headers[x]}return"Content-Type"in D||"GET"==e||y.dataType in E&&E[y.dataType]&&(D["Content-Type"]=E[y.dataType]),D.Accept||(D.Accept=y.responseType in M?M[y.responseType]:"*/*"),w||"X-Requested-With"in D||(D["X-Requested-With"]="XMLHttpRequest"),y.cache||"Cache-Control"in D||(D["Cache-Control"]="no-cache"),"GET"==e&&d&&"string"==typeof d&&(l+=(/\?/.test(l)?"&":"?")+d),y.async&&L.send(),L},d=function(e){var t=[],r=0,o=[];return n(function(n){var i=-1,s=function(e){return function(s,a,u,p){var f=++i;return++r,t.push(l(e,n.base+s,a,u,p).then(function(e,t){o[f]=arguments,--r||n(!0,1==o.length?o[0]:[o])},function(){n(!1,arguments)})),n}};n.get=s("GET"),n.post=s("POST"),n.put=s("PUT"),n["delete"]=s("DELETE"),n["catch"]=function(e){return n.then(null,e)},n.complete=function(e){var t=function(){e()};return n.then(t,t)},n.map=function(e,t,n,r,o){return s(e.toUpperCase()).call(this,t,n,r,o)};for(var a in e)a in n||(n[a]=e[a]);return n.send=function(){for(var e=0,r=t.length;r>e;++e)t[e].send();return n},n.abort=function(){for(var e=0,r=t.length;r>e;++e)t[e].abort();return n},n})},y={base:"",get:function(){return d(y).get.apply(this,arguments)},post:function(){return d(y).post.apply(this,arguments)},put:function(){return d(y).put.apply(this,arguments)},"delete":function(){return d(y)["delete"].apply(this,arguments)},map:function(){return d(y).map.apply(this,arguments)},xhr2:c,limit:function(e){return a=e,y},setDefaultOptions:function(e){return o=e,y},setDefaultXdrResponseType:function(e){return i=e.toLowerCase(),y},setDefaultDataType:function(e){return s=e.toLowerCase(),y},getOpenRequests:function(){return u}};return y}()},{"jquery-param":1,pinkyswear:2}]},{},[1,2])("qwest")});