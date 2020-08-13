//echo.min.js 图片懒加载
﻿;window.Echo=(function(window,document,undefined){'use strict';var store=[],offset,throttle,poll;var _inView=function(el){var coords=el.getBoundingClientRect();return((coords.top>=0&&coords.left>=0&&coords.top)<=(window.innerHeight||document.documentElement.clientHeight)+parseInt(offset));};var _pollImages=function(){for(var i=store.length;i--;){var self=store[i];if(_inView(self)){self.src=self.getAttribute('data-echo');store.splice(i,1);}}};var _throttle=function(){clearTimeout(poll);poll=setTimeout(_pollImages,throttle);};var init=function(obj){var nodes=document.querySelectorAll('[data-echo]');var opts=obj||{};offset=opts.offset||0;throttle=opts.throttle||250;for(var i=0;i<nodes.length;i++){store.push(nodes[i]);}_throttle();if(document.addEventListener){window.addEventListener('scroll',_throttle,false);}else{window.attachEvent('onscroll',_throttle);}};return{init:init,render:_throttle};})(window,document);
//HC-Sticky  https://github.com/somewebmedia/hc-sticky
;!function(t,e){"use strict";if("object"==typeof module&&"object"==typeof module.exports){if(!t.document)throw new Error("HC-Sticky requires a browser to run.");module.exports=e(t)}else"function"==typeof define&&define.amd?define("hcSticky",[],e(t)):e(t)}("undefined"!=typeof window?window:this,function(U){"use strict";var Y={top:0,bottom:0,bottomEnd:0,innerTop:0,innerSticker:null,stickyClass:"sticky",stickTo:null,followScroll:!0,responsive:null,mobileFirst:!1,onStart:null,onStop:null,onBeforeResize:null,onResize:null,resizeDebounce:100,disable:!1,queries:null,queryFlow:"down"},$=function(t,e,o){console.log("%c! HC Sticky:%c "+t+"%c "+o+" is now deprecated and will be removed. Use%c "+e+"%c instead.","color: red","color: darkviolet","color: black","color: darkviolet","color: black")},Q=U.document,X=function(n,f){var o=this;if("string"==typeof n&&(n=Q.querySelector(n)),!n)return!1;f.queries&&$("queries","responsive","option"),f.queryFlow&&$("queryFlow","mobileFirst","option");var p={},d=X.Helpers,s=n.parentNode;"static"===d.getStyle(s,"position")&&(s.style.position="relative");var u=function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};d.isEmptyObject(t)&&!d.isEmptyObject(p)||(p=Object.assign({},Y,p,t))},t=function(){return p.disable},e=function(){var t,e=p.responsive||p.queries;if(e){var o=U.innerWidth;if(t=f,(p=Object.assign({},Y,t||{})).mobileFirst)for(var i in e)i<=o&&!d.isEmptyObject(e[i])&&u(e[i]);else{var n=[];for(var s in e){var r={};r[s]=e[s],n.push(r)}for(var l=n.length-1;0<=l;l--){var a=n[l],c=Object.keys(a)[0];o<=c&&!d.isEmptyObject(a[c])&&u(a[c])}}}},r={css:{},position:null,stick:function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};d.hasClass(n,p.stickyClass)||(!1===l.isAttached&&l.attach(),r.position="fixed",n.style.position="fixed",n.style.left=l.offsetLeft+"px",n.style.width=l.width,void 0===t.bottom?n.style.bottom="auto":n.style.bottom=t.bottom+"px",void 0===t.top?n.style.top="auto":n.style.top=t.top+"px",n.classList?n.classList.add(p.stickyClass):n.className+=" "+p.stickyClass,p.onStart&&p.onStart.call(n,Object.assign({},p)))},release:function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};if(t.stop=t.stop||!1,!0===t.stop||"fixed"===r.position||null===r.position||!(void 0===t.top&&void 0===t.bottom||void 0!==t.top&&(parseInt(d.getStyle(n,"top"))||0)===t.top||void 0!==t.bottom&&(parseInt(d.getStyle(n,"bottom"))||0)===t.bottom)){!0===t.stop?!0===l.isAttached&&l.detach():!1===l.isAttached&&l.attach();var e=t.position||r.css.position;r.position=e,n.style.position=e,n.style.left=!0===t.stop?r.css.left:l.positionLeft+"px",n.style.width="absolute"!==e?r.css.width:l.width,void 0===t.bottom?n.style.bottom=!0===t.stop?"":"auto":n.style.bottom=t.bottom+"px",void 0===t.top?n.style.top=!0===t.stop?"":"auto":n.style.top=t.top+"px",n.classList?n.classList.remove(p.stickyClass):n.className=n.className.replace(new RegExp("(^|\\b)"+p.stickyClass.split(" ").join("|")+"(\\b|$)","gi")," "),p.onStop&&p.onStop.call(n,Object.assign({},p))}}},l={el:Q.createElement("div"),offsetLeft:null,positionLeft:null,width:null,isAttached:!1,init:function(){for(var t in l.el.className="sticky-spacer",r.css)l.el.style[t]=r.css[t];l.el.style["z-index"]="-1";var e=d.getStyle(n);l.offsetLeft=d.offset(n).left-(parseInt(e.marginLeft)||0),l.positionLeft=d.position(n).left,l.width=d.getStyle(n,"width")},attach:function(){s.insertBefore(l.el,n),l.isAttached=!0},detach:function(){l.el=s.removeChild(l.el),l.isAttached=!1}},a=void 0,c=void 0,g=void 0,m=void 0,h=void 0,v=void 0,y=void 0,b=void 0,S=void 0,w=void 0,k=void 0,E=void 0,x=void 0,L=void 0,T=void 0,j=void 0,O=void 0,C=void 0,i=function(){var t,e,o,i;r.css=(t=n,e=d.getCascadedStyle(t),o=d.getStyle(t),i={height:t.offsetHeight+"px",left:e.left,right:e.right,top:e.top,bottom:e.bottom,position:o.position,display:o.display,verticalAlign:o.verticalAlign,boxSizing:o.boxSizing,marginLeft:e.marginLeft,marginRight:e.marginRight,marginTop:e.marginTop,marginBottom:e.marginBottom,paddingLeft:e.paddingLeft,paddingRight:e.paddingRight},e.float&&(i.float=e.float||"none"),e.cssFloat&&(i.cssFloat=e.cssFloat||"none"),o.MozBoxSizing&&(i.MozBoxSizing=o.MozBoxSizing),i.width="auto"!==e.width?e.width:"border-box"===i.boxSizing||"border-box"===i.MozBoxSizing?t.offsetWidth+"px":o.width,i),l.init(),a=!(!p.stickTo||!("document"===p.stickTo||p.stickTo.nodeType&&9===p.stickTo.nodeType||"object"==typeof p.stickTo&&p.stickTo instanceof("undefined"!=typeof HTMLDocument?HTMLDocument:Document))),c=p.stickTo?a?Q:"string"==typeof p.stickTo?Q.querySelector(p.stickTo):p.stickTo:s,T=(C=function(){var t=n.offsetHeight+(parseInt(r.css.marginTop)||0)+(parseInt(r.css.marginBottom)||0),e=(T||0)-t;return-1<=e&&e<=1?T:t})(),m=(O=function(){return a?Math.max(Q.documentElement.clientHeight,Q.body.scrollHeight,Q.documentElement.scrollHeight,Q.body.offsetHeight,Q.documentElement.offsetHeight):c.offsetHeight})(),h=a?0:d.offset(c).top,v=p.stickTo?a?0:d.offset(s).top:h,y=U.innerHeight,j=n.offsetTop-(parseInt(r.css.marginTop)||0),g=p.innerSticker?"string"==typeof p.innerSticker?Q.querySelector(p.innerSticker):p.innerSticker:null,b=isNaN(p.top)&&-1<p.top.indexOf("%")?parseFloat(p.top)/100*y:p.top,S=isNaN(p.bottom)&&-1<p.bottom.indexOf("%")?parseFloat(p.bottom)/100*y:p.bottom,w=g?g.offsetTop:p.innerTop?p.innerTop:0,k=isNaN(p.bottomEnd)&&-1<p.bottomEnd.indexOf("%")?parseFloat(p.bottomEnd)/100*y:p.bottomEnd,E=h-b+w+j},z=U.pageYOffset||Q.documentElement.scrollTop,N=0,H=void 0,R=function(){T=C(),m=O(),x=h+m-b-k,L=y<T;var t=U.pageYOffset||Q.documentElement.scrollTop,e=d.offset(n).top,o=e-t,i=void 0;H=t<z?"up":"down",N=t-z,E<(z=t)?x+b+(L?S:0)-(p.followScroll&&L?0:b)<=t+T-w-(y-(E-w)<T-w&&p.followScroll&&0<(i=T-y-w)?i:0)?r.release({position:"absolute",bottom:v+s.offsetHeight-x-b}):L&&p.followScroll?"down"===H?o+T+S<=y+.9?r.stick({bottom:S}):"fixed"===r.position&&r.release({position:"absolute",top:e-b-E-N+w}):Math.ceil(o+w)<0&&"fixed"===r.position?r.release({position:"absolute",top:e-b-E+w-N}):t+b-w<=e&&r.stick({top:b-w}):r.stick({top:b-w}):r.release({stop:!0})},A=!1,B=!1,I=function(){A&&(d.event.unbind(U,"scroll",R),A=!1)},q=function(){null!==n.offsetParent&&"none"!==d.getStyle(n,"display")?(i(),m<=T?I():(R(),A||(d.event.bind(U,"scroll",R),A=!0))):I()},F=function(){n.style.position="",n.style.left="",n.style.top="",n.style.bottom="",n.style.width="",n.classList?n.classList.remove(p.stickyClass):n.className=n.className.replace(new RegExp("(^|\\b)"+p.stickyClass.split(" ").join("|")+"(\\b|$)","gi")," "),r.css={},!(r.position=null)===l.isAttached&&l.detach()},M=function(){F(),e(),t()?I():q()},D=function(){p.onBeforeResize&&p.onBeforeResize.call(n,Object.assign({},p)),M(),p.onResize&&p.onResize.call(n,Object.assign({},p))},P=p.resizeDebounce?d.debounce(D,p.resizeDebounce):D,W=function(){B&&(d.event.unbind(U,"resize",P),B=!1),I()},V=function(){B||(d.event.bind(U,"resize",P),B=!0),e(),t()?I():q()};this.options=function(t){return t?p[t]:Object.assign({},p)},this.refresh=M,this.update=function(t){u(t),f=Object.assign({},f,t||{}),M()},this.attach=V,this.detach=W,this.destroy=function(){W(),F()},this.triggerMethod=function(t,e){"function"==typeof o[t]&&o[t](e)},this.reinit=function(){$("reinit","refresh","method"),M()},u(f),V(),d.event.bind(U,"load",M)};if(void 0!==U.jQuery){var i=U.jQuery,n="hcSticky";i.fn.extend({hcSticky:function(e,o){return this.length?"options"===e?i.data(this.get(0),n).options():this.each(function(){var t=i.data(this,n);t?t.triggerMethod(e,o):(t=new X(this,e),i.data(this,n,t))}):this}})}return U.hcSticky=U.hcSticky||X,X}),function(c){"use strict";var t=c.hcSticky,f=c.document;"function"!=typeof Object.assign&&Object.defineProperty(Object,"assign",{value:function(t,e){if(null==t)throw new TypeError("Cannot convert undefined or null to object");for(var o=Object(t),i=1;i<arguments.length;i++){var n=arguments[i];if(null!=n)for(var s in n)Object.prototype.hasOwnProperty.call(n,s)&&(o[s]=n[s])}return o},writable:!0,configurable:!0}),Array.prototype.forEach||(Array.prototype.forEach=function(t){var e,o;if(null==this)throw new TypeError("this is null or not defined");var i=Object(this),n=i.length>>>0;if("function"!=typeof t)throw new TypeError(t+" is not a function");for(1<arguments.length&&(e=arguments[1]),o=0;o<n;){var s;o in i&&(s=i[o],t.call(e,s,o,i)),o++}});var e=function(){var t=f.documentElement,e=function(){};function i(t){var e=c.event;return e.target=e.target||e.srcElement||t,e}t.addEventListener?e=function(t,e,o){t.addEventListener(e,o,!1)}:t.attachEvent&&(e=function(e,t,o){e[t+o]=o.handleEvent?function(){var t=i(e);o.handleEvent.call(o,t)}:function(){var t=i(e);o.call(e,t)},e.attachEvent("on"+t,e[t+o])});var o=function(){};return t.removeEventListener?o=function(t,e,o){t.removeEventListener(e,o,!1)}:t.detachEvent&&(o=function(e,o,i){e.detachEvent("on"+o,e[o+i]);try{delete e[o+i]}catch(t){e[o+i]=void 0}}),{bind:e,unbind:o}}(),r=function(t,e){return c.getComputedStyle?e?f.defaultView.getComputedStyle(t,null).getPropertyValue(e):f.defaultView.getComputedStyle(t,null):t.currentStyle?e?t.currentStyle[e.replace(/-\w/g,function(t){return t.toUpperCase().replace("-","")})]:t.currentStyle:void 0},l=function(t){var e=t.getBoundingClientRect(),o=c.pageYOffset||f.documentElement.scrollTop,i=c.pageXOffset||f.documentElement.scrollLeft;return{top:e.top+o,left:e.left+i}};t.Helpers={isEmptyObject:function(t){for(var e in t)return!1;return!0},debounce:function(i,n,s){var r=void 0;return function(){var t=this,e=arguments,o=s&&!r;clearTimeout(r),r=setTimeout(function(){r=null,s||i.apply(t,e)},n),o&&i.apply(t,e)}},hasClass:function(t,e){return t.classList?t.classList.contains(e):new RegExp("(^| )"+e+"( |$)","gi").test(t.className)},offset:l,position:function(t){var e=t.offsetParent,o=l(e),i=l(t),n=r(e),s=r(t);return o.top+=parseInt(n.borderTopWidth)||0,o.left+=parseInt(n.borderLeftWidth)||0,{top:i.top-o.top-(parseInt(s.marginTop)||0),left:i.left-o.left-(parseInt(s.marginLeft)||0)}},getStyle:r,getCascadedStyle:function(t){var e=t.cloneNode(!0);e.style.display="none",Array.prototype.slice.call(e.querySelectorAll('input[type="radio"]')).forEach(function(t){t.removeAttribute("name")}),t.parentNode.insertBefore(e,t.nextSibling);var o=void 0;e.currentStyle?o=e.currentStyle:c.getComputedStyle&&(o=f.defaultView.getComputedStyle(e,null));var i={};for(var n in o)!isNaN(n)||"string"!=typeof o[n]&&"number"!=typeof o[n]||(i[n]=o[n]);if(Object.keys(i).length<3)for(var s in i={},o)isNaN(s)||(i[o[s].replace(/-\w/g,function(t){return t.toUpperCase().replace("-","")})]=o.getPropertyValue(o[s]));if(i.margin||"auto"!==i.marginLeft?i.margin||i.marginLeft!==i.marginRight||i.marginLeft!==i.marginTop||i.marginLeft!==i.marginBottom||(i.margin=i.marginLeft):i.margin="auto",!i.margin&&"0px"===i.marginLeft&&"0px"===i.marginRight){var r=t.offsetLeft-t.parentNode.offsetLeft,l=r-(parseInt(i.left)||0)-(parseInt(i.right)||0),a=t.parentNode.offsetWidth-t.offsetWidth-r-(parseInt(i.right)||0)+(parseInt(i.left)||0)-l;0!==a&&1!==a||(i.margin="auto")}return e.parentNode.removeChild(e),e=null,i},event:e}}(window);

window.conf = {
    // 'host' : 'https://api.yy8.pw',
    'host' : 'http://api.m.com',
    'ws_host' : 'wss://ws.yy8.pw',
    'cover_host' : 'https://cdn.jsdelivr.net/gh/zenhiss/mov_img/cover/',
    'isApp':false,
}
var loading_dom = '<div class="layui-flow-more"><a href="javascript:;"><i class="layui-anim layui-anim-rotate layui-anim-loop layui-icon ">&#xe63d;</i></a></div>'

var isApp = false


if(localStorage.authToken != undefined){
    window.isLogin = true
}else{
    window.isLogin = false
}

if(isLogin && window.location.href.indexOf('auth') > -1){
    mui.openWindow({
        id:'index' ,
        url:'../index.html'
    });
}


// 用户没有登陆 进入 不是 登陆页面的 用户页面
if(isLogin == false && (window.location.href.indexOf('user') > -1) && !(window.location.href.indexOf('user/auth') > -1) && !(window.location.href.indexOf('user/forget') > -1) ){
	mui.openWindow({
	    id:'auth' ,
	    url:'../user/auth.html'
	});
}




// app 中 重写 返回的逻辑
mui.plusReady(function () {
    conf.isApp = true
	
	var backNum = 0
	mui.init({
	    beforeback: function() {
			curren_webview = plus.webview.currentWebview()
	        prev_webview = plus.webview.currentWebview().opener()
			if(prev_webview == undefined || curren_webview.id == 'HBuilder' || curren_webview.id == 'index'){
				backNum++;
				if(backNum > 1) {
				    plus.runtime.quit();
				} else {
				    mui.toast("再按一次退出应用");
				}
				setTimeout(function() {
				    backNum = 0
				}, 2000);
				return false;
			}
			
	        // console.log('对象' + JSON.stringify(prev_webview))
	        // console.log('是否登陆：' + isLogin)
	        console.log('上一页id：' + prev_webview.id)
	        console.log('当前页id：' + curren_webview.id)
			
			// 上一页是 登陆页面 但是以及登陆 返回这 直接跳到首页
	        if(prev_webview.id  == 'auth' && isLogin == true){
				// index_webview = plus.webview.getWebviewById('index')
				HBuilder_webview = plus.webview.getWebviewById('HBuilder')
				// mui.fire(index_webview,'checkLogin');
				mui.fire(HBuilder_webview,'checkLogin');
	            mui.openWindow({
	                id:'HBuilder' ,
	                url:'../index.html'
	            });
	            return false
	        }
			// 当前页是首页 上一页是 用户中心 但是  没有登陆
	        if(curren_webview.id == 'HBuilder' && prev_webview.id == 'home' && isLogin == false){
				
				mui.fire(curren_webview,'checkLogin');
	            mui.openWindow({
	                id:'auth' ,
	                url:'../user/auth.html'
	            });
	            return false
	        }
			// 详情页返回 触发 个人中心里面的 两个事件
			if(curren_webview.id == 'detail' && isLogin == true){
				home_webview = plus.webview.getWebviewById('home')
				mui.fire(home_webview,'getSearchHistory');
				mui.fire(home_webview,'getWatchLoggerList');
			}
			
			if(curren_webview.id == 'watch_history' && prev_webview.id == 'home'){
				home_webview = plus.webview.getWebviewById('home')
				mui.fire(home_webview,'getSearchHistory');
				mui.fire(home_webview,'getWatchLoggerList');
				
			}
			
			if(curren_webview.id == 'detail' && prev_webview.id == 'watch_history' && isLogin == true){
				watch_history_webview = plus.webview.getWebviewById('watch_history')
				mui.fire(watch_history_webview,'getWatchLoggerListByTimeLine');
				console.log('123123123123')
			}
			
			// auth_page = plus.webview.getWebviewById('auth');
			// mui.fire(auth_page,'checkLogin');
			curren_webview = plus.webview.currentWebview()
			mui.fire(curren_webview,'checkLogin');
			
	        return true
	
	
	    }
	})
	
	
	//进入页面就触发 checkLogin 函数
	curren_webview = plus.webview.currentWebview()
	mui.fire(curren_webview,'checkLogin 函数');
	
})


 if(window.plus == undefined){
		window.click_event_type = 'click'
  }else{
		window.click_event_type = 'tap'
  }
  


window.addEventListener('checkLogin',function(event){
	//确保每个webview 的 window.isLogin 是 最新的状态
	if(localStorage.authToken != undefined){
		window.isLogin = true
	}else{
		window.isLogin = false
	}

	
})




// 进入播放页面之前 先记录播放记录 时间 等信息
window.setWatchLogger = function (detail_id ,successCallBack) {
	var headers = {}
	if(isLogin == true){
		var headers = {'Authorization':localStorage.authToken}
	}
	mui.ajax(conf.host + '/v1/watchLogger',{
		data:{'id':detail_id},
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		headers:headers,
		success:function(msg){
			if(msg.code == 1){
				successCallBack(msg)
			}else{
				layer.msg(msg.msg)
			}
		},
	});
}



mui('.layui-container').on(click_event_type,'.go_back',function(){

	
	// 首页不再返回
	if(window.plus != undefined){
	    mui.back()
	}else{
	    is_index = window.location.href.indexOf('index.html')
	    if(is_index > -1 ){
	        return false
	    }

		if(window.location.href.indexOf('watch_history.html') > -1){
			mui.openWindow({
				id:'home' ,
				url:'../user/home.html'
			});
			return false
		}

		if(window.location.href.indexOf('home.html') > -1){
			mui.openWindow({
				id:'index' ,
				url:'../index.html'
			});
			return false
		}
		
		
	    history.go(-1)
	}
})