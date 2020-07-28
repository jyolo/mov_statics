/**
 * echo.min.js 图片懒加载
 */
﻿window.Echo=(function(window,document,undefined){'use strict';var store=[],offset,throttle,poll;var _inView=function(el){var coords=el.getBoundingClientRect();return((coords.top>=0&&coords.left>=0&&coords.top)<=(window.innerHeight||document.documentElement.clientHeight)+parseInt(offset));};var _pollImages=function(){for(var i=store.length;i--;){var self=store[i];if(_inView(self)){self.src=self.getAttribute('data-echo');store.splice(i,1);}}};var _throttle=function(){clearTimeout(poll);poll=setTimeout(_pollImages,throttle);};var init=function(obj){var nodes=document.querySelectorAll('[data-echo]');var opts=obj||{};offset=opts.offset||0;throttle=opts.throttle||250;for(var i=0;i<nodes.length;i++){store.push(nodes[i]);}_throttle();if(document.addEventListener){window.addEventListener('scroll',_throttle,false);}else{window.attachEvent('onscroll',_throttle);}};return{init:init,render:_throttle};})(window,document);
window.conf = {
    // 'host' : 'https://api.yy8.pw',
    'host' : 'http://api.m.com',
    'ws_host' : 'wss://ws.yy8.pw',
    'cover_host' : 'https://cdn.jsdelivr.net/gh/zenhiss/mov_img/cover/',
    'isApp':false,
}

var isApp = false
// 没登陆跳转到登陆页面
// if(localStorage.authToken == undefined && window.location.href.indexOf('auth') == -1){
//     mui.openWindow({
//         id:'auth' ,
//         url:'./user/auth.html'
//     });
// }
// if(localStorage.authToken != undefined && window.location.href.indexOf('auth') != -1){
//     mui.openWindow({
//         id:'index' ,
//         url:'../index.html'
//     });
// }

window.gotoLogin = function(){
    mui.openWindow({
        id:'auth' ,
        url:'./user/auth.html'
    });

}

if(localStorage.authToken != undefined){
    window.isLogin = true
}else{
    window.isLogin = false
}

if (window.plus != undefined){
    conf.isApp = true
}