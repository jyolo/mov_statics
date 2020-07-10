var host = 'https://api.yy8.pw'
var ws_host = 'ws://ws.yy8.pw'
var cover_host = 'http://cstatic.yy8.pw/'

//var host = 'http://api.m.com'
// var ws_host = 'ws://ws.m.com:2345'
// var cover_host = 'http://img.i3tp.cn:66/'
var chooseTag = Function()
var isApp = false



// 没登陆跳转到登陆页面
if(localStorage.authToken == undefined && window.location.href.indexOf('auth') == -1){
	mui.openWindow({
	    id:'auth' ,
	    url:'./user/auth.html' 
	  });
}

if(localStorage.authToken != undefined && window.location.href.indexOf('auth') != -1){
	mui.openWindow({
	    id:'index' ,
	    url:'../index.html' 
	  });
}


if (window.plus != undefined){
	isApp = true
}

window.loginOut = function(){}

layui.define(['flow','jquery','laytpl','layer'] ,function(exports){
	href = window.location.href.split('?') 
	var flow = layui.flow
	var custom = {}
	device = layui.device()
	var $ = layui.jquery
	// console.log(device)
	var laytpl = layui.laytpl
	custom.host = host	
	custom.ws_host = ws_host	
	
	
	let params = {},arg = []
	if(href.length >= 2){
		arg = href[1].split('&')
	}
	for (i = 0 ; i < arg.length ; i++){
		let p = arg[i].split('=')
		params[p[0]] = p[1]
	}
	
	if(Object.keys(params).length == 0){
		params = false
	}
	
	window.loginOut = function(){
		mui.ajax(custom.host + '/v1/auth/loginOut',{
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			headers:{'Authorization':localStorage.authToken},
			success:function(msg){
				
				if(msg.code == 1){
					localStorage.removeItem('authToken')
					mui.openWindow({
					    id:'auth' ,
					    url:'./user/auth.html' 
					  });
					// window.location.reload()
				}
			},
			error:function(xhr,type,errorThrown){
				console.log(xhr)
				
			}
		});
	}
	
	custom.params = params
	custom.flow = function flowload(ListTpl,requestUrl ,paramField = {} ){
			flow.load({
				elem: '#vlistView' ,//指定列表容器
				isLazyimg:false, // 图片懒加载
				mb:200,
				done: function(page, next){ //到达临界点（默认滚动触发），触发下一页
				  var lis = [];
				  console.log('to the end')
				  p = $.extend(paramField ,{'page':page})
				  mui.ajax(custom.host + requestUrl,{
					data:p,
					dataType:'json',//服务器返回json格式数据
					type:'get',//HTTP请求类型
					timeout:10000,//超时时间设置为10秒；
					headers:{'Authorization':localStorage.authToken},
					success:function(msg){
						
						layui.laytpl(ListTpl).render(msg.data.list, function(html){
							next(html, page < msg.data.max_page	);    
						});
					},
					error:function(xhr,type,errorThrown){
						console.log(xhr)
						
					}
				  });
				 
				}
			});
			
		}
	
	
	custom.ajaxErrorHandler = function(xhr){
		console.log(xhr)
		switch(xhr.status){
			case 0:
			layer.open({
			  title: '友情提醒',
			  // btn:['重试'],
			  closeBtn:1,
			  content: '网络异常',
			 //  yes:function(){
				// console.log(1111)  
			 //  },
			  cancel: function(index, layero){ 
					mui.back();
			  }   
			});
			break;
			case 401:
				layer.open({
				  title: '友情提醒',
				  btn:[],
				  closeBtn:1,
				  content: '登录凭证已过期！请重新登录',
				  cancel: function(index, layero){ 
					  delete localStorage.authToken
						mui.openWindow({
						   id:'auth' ,
						   url:'./user/auth.html' 
						  });
				    return false; 
				  }   
				});
			default:
				console.log(xhr)
			
			break;
		}
	}
	
	var retry_max_times = 3 
	var retry_times = 0 
	custom.hlsNetWrokerErrorHandler = function(msg){
		// 小于重试最大次数 继续重试
		if (retry_times <  retry_max_times){
			// layer.msg('该播放地址已失效正在为您切换线路..请稍等')
			layer.msg('播放地址加载失败，重试中....',{time:1500},function(){
				hls.loadSource(hls.url)
				hls.startLoad()
				console.log(retry_times)
				retry_times++
			})
			
			return
		}
		
		// 超过最大重试次数 标记该资源线路 无效
		
		// 只有一个无法切换线路
		if(msg.data['play_m3u8'].length == 1) {
			layer.open({
			  title: '友情提醒',
			  btn:[],
			  closeBtn:1,
			  content: '抱歉视频加载失败！当前暂无其它线路切换，看看其它的吧~',
			  cancel: function(index, layero){ 
			    mui.openWindow({
			        id:'search' ,
			        url:'search.html'
			      });
			    return false; 
			  }   
			});
			// 当播放线路加载失败 且 只有一条的时候 发送 load_error 信息
			isopen_ws = false
			return
		}else{
			
			// 发送后台播放错误的线路
			mui.ajax(custom.host + '/v1/markWrongLine',{
				data:{'detail_id':custom.params.id,'play_line_index':layui.cache.play_info.play_line_index},
				dataType:'json',//服务器返回json格式数据
				type:'get',//HTTP请求类型
				timeout:10000,//超时时间设置为10秒；
				headers:{'Authorization':localStorage.authToken},
				success:function(msg){
					console.log(msg)
				},
			});
			
			// 如果有不止一个线路 自动切换线路播放
			dp.notice('视频加载失败~ ,正在为您切换线路！')
			//切换到下一个线路
			window.swiper_play_line.slideTo(window.swiper_play_line.activeIndex + 1)
			layui.cache.play_info.play_line_index = window.swiper_play_line.activeIndex + 1
			
			
			// 获取下个线路的当前的 播放play_item_index 索引
			let _url = $(window.swiper_play_line.slides[window.swiper_play_line.activeIndex])
			.find('.play-botton').eq(layui.cache.play_info.play_item_index).attr('data')
			dp.switchVideo({
			    url: _url,
				type: 'hls',
			    pic: 'http://static.smartisanos.cn/pr/img/video/video_03_cc87ce5bdb.jpg',
			    thumbnails: 'https://moeplayer.b0.upaiyun.com/dplayer/hikarunara_thumbnails.jpg'
			})
			setTimeout(function(){
				dp.notice('已自动切换线路')
				dp.play()
			},2000)
			
			$('.swiper-slide').find('.play-botton').removeClass('layui-btn-disabled')
			$(window.swiper_play_line.slides[window.swiper_play_line.activeIndex]).find('.play-botton').eq(layui.cache.play_info.play_item_index).addClass('layui-btn-disabled')
			
			retry_times = 0
		}
		
		
		return
		
		
	}
	
	
	mui('.user_info').on('tap','.fly-nav-avatar',function(){
		if ($(this).next().hasClass('layui-show')){
			$(this).next().removeClass('layui-anim layui-anim-upbit layui-show')
		}else{
			$(this).next().addClass('layui-anim layui-anim-upbit layui-show')
		}
	})
	
	mui('.user_info').on('tap','.loginOut',function(){
		loginOut()
	})
	
	
	// $('html').on('tap',function(){
		
	// 	// 点击页面空白处 关闭掉 用户菜单
	// 	if($('.layui-nav-child').hasClass('layui-show')){
	// 		$('.layui-nav-child').removeClass('layui-anim layui-anim-upbit layui-show')
	// 	}
		
	// })
	
	exports('custom', custom);
})