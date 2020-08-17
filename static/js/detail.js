mui.plusReady(function () {
    mui.init()
})

window.dp = new DPlayer({
    container: document.getElementById('playbox'),
    autoplay: true,
    airplay:true,
    video: {
        // pic: 'http://images.shejidaren.com/wp-content/uploads/2018/03/134715wPw.jpg',
        type: 'customHls',
        customType: {
            customHls: function (video, player) {
                window.hls = new Hls({
                    // debug: true,
                    manifestLoadingTimeOut:5000,
                    xhrSetup: (xhr, url) => {
                        //播放m3u8 url转换成 https  且 不对当页面发起请求
                        if(url.indexOf('mov_statics/detail.html?id=') == -1) {
                            xhr.open('GET', url.replace('http://', 'https://'))
                        }
                    }
                });
                console.log(video.src)
                hls.loadSource(video.src);
                hls.attachMedia(video);

            },
        },
    },
    theme: '#FADFA3',
    loop: false,
    lang: 'zh-cn',
    preload: 'auto',

});


layui.config({
    version: "3.0.0"
    ,base: 'https://cdn.jsdelivr.net/gh/jyolo/mov_statics/static/mods/' //这里实际使用时，建议改成绝对路径
}).use(['element','laytpl','layer','jquery','util'],function(){

    var $ = layui.jquery
    var laytpl = layui.laytpl
    var layer = layui.layer
    var util = layui.util


    // 修改播放器样式
    $('.dplayer-bar').css('height','7px')
    $('.dplayer-loaded').css('height','7px')
    $('.dplayer-played').css('height','7px')
    $('.dplayer-thumb').css('margin-top','-2px')


    window.render_login_status = function(){
        islogin = (localStorage.authToken != undefined)
        laytpl(user_login_status.innerHTML).render({'islogin': islogin }, function(html){
            $('.fly-nav-user').find('li').remove()
            $('.fly-nav-user').append(html)

            $('.fly-nav-user').find('a').on(click_event_type,function(){
                switch ($(this).attr('lay-type')) {
                    case 'auth':
                        if((localStorage.authToken == undefined) == true){

                            mui.openWindow({
                                id:'auth' ,
                                url:'user/auth.html'
                            });

                        }else{
                            if(window.plus != undefined){
                                home_webview = plus.webview.getWebviewById('home')
                                mui.fire(home_webview,'checkLogin');
                                mui.fire(home_webview,'getSearchHistory');
                                mui.fire(home_webview,'getWatchLoggerList');
                            }

                            dp.pause()
                            mui.openWindow({
                                id:'home' ,
                                url:'user/home.html'
                            });
                        }

                        break
                    case 'home':
                        if(window.plus != undefined){
                            home_webview = plus.webview.getWebviewById('home')
                            mui.fire(home_webview,'checkLogin');
                            mui.fire(home_webview,'getWatchLoggerList');
                            mui.fire(home_webview,'getSearchHistory');
                        }

                        dp.pause()

                        mui.openWindow({
                            id:'home' ,
                            url:'user/home.html'
                        });
                        break;

                }
            })

        });
        laytpl(login_tips.innerHTML).render({'islogin': islogin }, function(html){
            $('.tips').html()
            $('.tips').append(html)

        })
    }()


    var headers = {};
    if(isLogin == true){
        var headers = {'Authorization':localStorage.authToken}
    }


    window.startPlay = function(){

        if (window.plus == undefined){
            window.detail_id = window.params.id
            console.log('h5: ' + detail_id)
        }else{
            window.detail_id = localStorage.getItem('play_detail_id')
            console.log('app id :' + detail_id)
        }

        console.log('startPlay')
        if (!window.detail_id || window.detail_id == undefined){
            layer.open({
                title: '友情提醒',
                btn:[],
                closeBtn:0,
                content: '参数缺失！'
            });
            return false
        }


        mui.ajax(conf.host + '/v1/getWatchLoggerDetail', {
            data: {detail_id: detail_id},
            dataType: 'json',//服务器返回json格式数据
            type: 'get',//HTTP请求类型
            timeout: 10000,//超时时间设置为10秒；
            headers: headers,
            success: function (msg) {

                if(msg.code == 1){
                    watch_log_info = msg.data
                    layui.cache.play_info = {
                        'play_detail_id':watch_log_info.play_detail_id,
                        'play_line_index': watch_log_info.play_line_index ? watch_log_info.play_line_index : 0,
                        'play_item_index' : watch_log_info.play_item_index ? watch_log_info.play_item_index : 0 ,
                        'play_time':watch_log_info.play_time ? watch_log_info.play_time : 0,
                        'video_total_time' : watch_log_info.video_total_time ? watch_log_info.video_total_time : 0,
                    }

                }else{
                    watch_log_info = undefined
                    layui.cache.play_info = {
                        'play_detail_id':detail_id,
                        'play_line_index': 0,
                        'play_item_index' : 0 ,
                        'play_time':0,
                        'video_total_time' : 0,
                    }
                }

                getDetail()

            }
        })


    }

    window.addEventListener('startPlay',startPlay)


    //延迟100ms 检查 window.plus
    setTimeout(function(){
        startPlay()
    },100)

    var retry_max_times = 2
    var retry_times = 0
    var markWrongLine = function () {
        var headers = {}
        if(isLogin == true){
            var headers = {'Authorization':localStorage.authToken}
        }
        // 发送后台播放错误的线路
        mui.ajax(conf.host + '/v1/markWrongLine',{
            data:{'detail_id':window.params.id,'play_line_index':layui.cache.play_info.play_line_index},
            dataType:'json',//服务器返回json格式数据
            type:'get',//HTTP请求类型
            timeout:10000,//超时时间设置为10秒；
            headers:headers,
            success:function(msg){
                console.log(msg)
            },
        });
    }


    window.hlsNetWrokerErrorHandler = function(msg){
        console.log('hlsNetWrokerErrorHandler')
        if (retry_times <=  retry_max_times){
            window.retry_msg = layer.msg('播放地址加载失败，重试第 '+ (retry_times + 1) + '/' + (retry_max_times + 1) + '次',{time:1000000,shade:0.3})
            hls.loadSource(hls.url)
            hls.startLoad()
            console.log(retry_times)
            retry_times++
            return false
        }

        layer.close(retry_msg)
        markWrongLine()
        // 重置归0
        retry_times = 0
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
            return
        }
        else
        {

            // 如果有不止一个线路 自动切换线路播放
            layer.msg('视频加载失败~ ,正在为您切换线路！',{time:1500,shade:0.3})
            // 删除掉 当前线路
            window.swiper_play_line.removeSlide(window.swiper_play_line.activeIndex);
            //从0开始 切换到下一个线路
            window.swiper_play_line.slideTo(0)
            layui.cache.play_info.play_line_index = window.swiper_play_line.activeIndex

            // 获取下个线路的当前的 播放play_item_index 索引
            let _url = $(window.swiper_play_line.slides[window.swiper_play_line.activeIndex])
                .find('.play-botton').eq(layui.cache.play_info.play_item_index).attr('data')
            dp.switchVideo({
                url: _url,
                type: 'customHls',
                pic: 'http://static.smartisanos.cn/pr/img/video/video_03_cc87ce5bdb.jpg',
                thumbnails: 'https://moeplayer.b0.upaiyun.com/dplayer/hikarunara_thumbnails.jpg'
            })

            setTimeout(function(){
                dp.notice('已自动切换线路')
                dp.play()
            },2000)

            $('.swiper-slide').find('.play-botton').removeClass('layui-btn-disabled')
            $(window.swiper_play_line.slides[window.swiper_play_line.activeIndex]).find('.play-botton').eq(layui.cache.play_info.play_item_index).addClass('layui-btn-disabled')

        }


    }

    var playitem_tpl = playitem.innerHTML

    window.getDetail = function () {
        mui.ajax(conf.host + '/v1/getDetail',{
            data:{id:detail_id},
            dataType:'json',//服务器返回json格式数据
            type:'get',//HTTP请求类型
            timeout:10000,//超时时间设置为10秒；
            headers:headers,
            success:function(msg){
                if(msg.code == 0){
                    layer.alert('暂无数据',{closeBtn:0}, function(index){
                        //do something
                        mui.back()
                        layer.close(index);
                    });
                    return false
                }

                if(msg.data.length > 0){
                    $('#mov_title').html('')
                    $('#mov_title').append(msg.data[0]['title'])
                }

                let view = document.getElementById('playwrapper');
                layui.laytpl(playitem_tpl).render(msg.data, function(html){
                    view.innerHTML = html;
                });
                //遍历线路
                window.swiper_play_line = new Swiper('.play-line', {
                    slidesPerView: 1,
                    slidesPerGroup:1,
                    centeredSlides: true,
                    spaceBetween: 5,
                    pagination: {
                        el: '.swiper-pagination',
                        type: 'custom',
                        renderCustom: function (swiper, current, total) {
                            return '当前线路：' + current + ' ；共 ' + total + '条线路';
                        }
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                });
                $('#playwrapper').find('.layui-flow-more').fadeOut()
                $('.pre_nex').fadeIn()
                // 有播放记录
                if(
                    watch_log_info != undefined &&
                    watch_log_info.play_time > 0 &&
                    (msg.data[watch_log_info.play_line_index]['play_m3u8'][watch_log_info.play_item_index] != undefined)
                ){
                    layer.msg('开始继续播放',{time:1500})
                    // 预加载播放记录中的线路 和 item
                    dp.switchVideo({
                        url: msg.data[watch_log_info.play_line_index]['play_m3u8'][watch_log_info.play_item_index]['value'],
                        type: 'customHls',
                        // pic: 'http://images.shejidaren.com/wp-content/uploads/2018/03/134715wPw.jpg',
                    })
                    dp.seek(watch_log_info.play_time); //跳转到指定时间位置
                    pli = watch_log_info.play_line_index
                    pii = watch_log_info.play_item_index
                }else{
                    // 预加载第一个
                    console.log('预加载第一个')
                    dp.switchVideo({
                        url: msg.data[0]['play_m3u8'][0]['value'],
                        type: 'customHls',
                    })
                    pli = layui.cache.play_info.play_line_index = 0
                    pii = layui.cache.play_info.play_item_index = 0
                }

                // 捕获hls 错误
                // hls error info https://github.com/video-dev/hls.js/blob/master/docs/API.md#Errors
                hls.on(Hls.Events.ERROR,function(event,data){
                    console.log('捕获hls 错误')
                    console.log(data.type)
                    console.log(data.details)

                    if(data.type == 'mediaError' && data.details == 'bufferStalledError'){
                        dp.notice('视频缓冲中.....')
                        return
                    }
                    // 加载播放清单失败 或者 超时 5秒 直接hlsNetWrokerErrorHandler
                    if(data.type == 'networkError' && (data.details == 'manifestLoadError' || data.details == 'manifestLoadTimeOut')){
                        hlsNetWrokerErrorHandler(msg)
                    }


                })


                window.swiper_play_line.slideTo(pli)
                $(window.swiper_play_line.slides[pli]).find('.play-botton').eq(pii).addClass('layui-btn-disabled')

                //切换线路播放 只更新 play_line_index 和 play_item_index
                $('#playwrapper').find('.play-botton').unbind(click_event_type).bind(click_event_type,function(){
                    if($(this).hasClass('layui-btn-disabled')) {
                        return
                    }else{
                        $('#playwrapper').find('.play-botton').removeClass('layui-btn-disabled')
                        $(this).addClass('layui-btn-disabled')
                    }

                    playurl = this.getAttribute('data')

                    layui.cache.play_info['play_detail_id'] = detail_id
                    layui.cache.play_info['play_line_index'] = window.swiper_play_line.activeIndex

                    dp.switchVideo({
                        url: playurl,
                        type: 'customHls',
                    })
                    // 捕获hls 错误
                    // hls error info https://github.com/video-dev/hls.js/blob/master/docs/API.md#Errors
                    hls.on(Hls.Events.ERROR,function(event,data){

                        if(data.type == 'mediaError' && data.details == 'bufferStalledError'){
                            dp.notice('视频缓冲中.....')
                            return
                        }
                        // 加载播放清单失败 或者 超时 5秒 直接hlsNetWrokerErrorHandler
                        if(data.type == 'networkError' && (data.details == 'manifestLoadError' || data.details == 'manifestLoadTimeOut')){
                            hlsNetWrokerErrorHandler(msg)
                        }

                    })

                    // 如果之前有在其它线路 "同一个索引的 play_botton" 播放过，切换线路的时候 依然按照之前的 播放进度 播放
                    if(layui.cache.play_info['play_time'] > 0 && layui.cache.play_info['play_item_index'] == $(this).index()){
                        dp.seek(layui.cache.play_info.play_time)
                    }else{
                        layui.cache.play_info['play_item_index'] = $(this).index()
                    }

                })


            },
            error:function(xhr,type,errorThrown){
                //异常处理；
                ajaxErrorHandler(xhr)
            },


        });
    }

    window.isplayed = false


    // 获取播放的时候 当前的时间
    dp.on('timeupdate', function () {

        // 更新cache 里面的 play_time
        layui.cache.play_info.play_time = dp.video.currentTime
        layui.cache.play_info.video_total_time = dp.video.duration

        // 定时间没有初始化 且 视频状态已就绪 则开始 定时器轮询  已登陆 才记录
        if (window.send_watch_info_interval == undefined && dp.video.readyState == 4 && isLogin == true){
            // ajax 轮询
            window.send_watch_info_interval = setInterval(function(){

                mui.ajax(conf.host + '/v1/setWatchLog',{
                    data:layui.cache.play_info,
                    dataType:'json',//服务器返回json格式数据
                    type:'post',//HTTP请求类型,
                    timeout:10000,//超时时间设置为10秒；
                    headers:{'Authorization':localStorage.authToken},
                    success:function(msg){
                        // console.log(msg.msg)
                    },
                });
            },2500)

        }


    });

    dp.on('play',function(){
        //播放开始的时候 获取当前的 线路
        layui.cache.play_info['play_line_index'] = window.swiper_play_line.activeIndex
        window.isplayed = true

    })

    dp.on('seeked',function(){
        console.log('seeked')
        dp.play()
    })

    // 加载视频第一帧 成功后触发 得到 获取第一帧的 总时间 /秒
    dp.on('loadedmetadata',function(a,b){
        layer.msg('加载完成开始播放')
        dp.play()

    })

    dp.on('loadstart',function(a,b){
        layer.msg('开始加载视频.....');
        console.log('loadstart----------s')
        dp.play()
        console.log('loadstart----------e')
    })

    dp.on('error',function(){
        console.log('error----------s')
        console.log('error----------e')
    })

    // 播放结束开始下一集
    dp.on('ended', function () {
        current_slide = window.swiper_play_line.slides[layui.cache.play_info.play_line_index]
        current_play_botton = $(current_slide).find('.play-botton').eq(layui.cache.play_info.play_item_index)

        // 当前播放线路有下一集
        if(current_play_botton.next().length >= 1){
            playurl = current_play_botton.next().attr('data')
            dp.switchVideo({
                url: playurl,
                type: 'customHls',
                pic: 'http://static.smartisanos.cn/pr/img/video/video_03_cc87ce5bdb.jpg',
                thumbnails: 'https://moeplayer.b0.upaiyun.com/dplayer/hikarunara_thumbnails.jpg'
            })
            dp.play()

            $('#playwrapper').find('.play-botton').removeClass('layui-btn-disabled')
            current_play_botton.next().addClass('layui-btn-disabled')
            layer.msg('开始为您自动播放下一集',{'time':3000})

            // 更新播放记录
            layui.cache.play_info['play_line_index'] = window.swiper_play_line.activeIndex
            layui.cache.play_info['play_item_index'] = layui.cache.play_info.play_item_index + 1

            // 登录才发送播放记录的请求
            var headers = {}
            if(isLogin == true){
                var headers = {'Authorization':localStorage.authToken}
                mui.ajax(conf.host + '/v1/setWatchLog',{
                    data:layui.cache.play_info,
                    dataType:'json',//服务器返回json格式数据
                    type:'post',//HTTP请求类型,
                    timeout:10000,//超时时间设置为10秒；
                    headers:headers,
                    success:function(msg){
                        // console.log(msg.msg)
                    },
                });
            }


        }else{
            layer.msg('播放结束',{'time':3000})
            // 清除定时器
            clearInterval(window.send_watch_info_interval)
        }

    });






});