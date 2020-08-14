
layui.define(['flow','jquery','laytpl','layer'] ,function(exports){
	href = window.location.href.split('?') 

	var custom = {}
	device = layui.device()
	var $ = layui.jquery


	
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
	

	custom.params = params



	custom.ajaxErrorHandler = function(xhr){

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
						   url:'../user/auth.html'
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
		if(msg.data.length == 1) {
			layer.open({
			  title: '友情提醒',
			  btn:[],
			  closeBtn:1,
			  content: '抱歉视频加载失败！当前暂无其它线路切换，看看其它的吧~',
			  cancel: function(index, layero){ 
			    mui.openWindow({
			        id:'index' ,
			        url:'index.html'
			      });
			    return false; 
			  }   
			});
			// 当播放线路加载失败 且 只有一条的时候 发送 load_error 信息
			markWrongLine()

			return
		}else{
			markWrongLine()

			// 如果有不止一个线路 自动切换线路播放
			dp.notice('视频加载失败~ ,正在为您切换线路！')
			// 删除掉 当前线路
			window.swiper_play_line.removeSlide(window.swiper_play_line.activeIndex);
			//切换到下一个线路
			window.swiper_play_line.slideTo(0)
			layui.cache.play_info.play_line_index = window.swiper_play_line.activeIndex
			
			
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
	
	

	
	
	// $('html').on('tap',function(){
		
	// 	// 点击页面空白处 关闭掉 用户菜单
	// 	if($('.layui-nav-child').hasClass('layui-show')){
	// 		$('.layui-nav-child').removeClass('layui-anim layui-anim-upbit layui-show')
	// 	}
		
	// })
	
	exports('custom', custom);
})