layui.config({
    version: "3.0.0"
    ,base: 'https://cdn.jsdelivr.net/gh/jyolo/mov_statics//static/mods/'
}).use(['element','laytpl','jquery'],function(){
    var $ = layui.jquery
    var element = layui.element
    var laytpl = layui.laytpl

    mui.plusReady(function () {
        mui.init({
            beforeback:function(){
                if(window.plus != undefined){
                    prev_webview = plus.webview.currentWebview().opener()
                    if(prev_webview.id == 'detail'){
                        return true
                    }

                    HBuilder_webview = plus.webview.getWebviewById('HBuilder')
                    mui.fire(HBuilder_webview,'refresh_login_status')
                }
                mui.openWindow({
                    id:'HBuilder' ,
                    url:'../index.html'
                });
            }
        })
    })

    window.getUID = function() { // 获取唯一值
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }

    window.searchTpl = searchTpl.innerHTML

    window.getUserInfo = function(){
        mui.ajax(conf.host + '/v1/getUserInfo',{
            dataType:'json',//服务器返回json格式数据
            type:'post',//HTTP请求类型
            timeout:10000,//超时时间设置为10秒；
            headers:{'Authorization':localStorage.authToken},
            beforeSend:function(){
                $('#user_info').append(loading_dom)
            },
            success:function(msg){
                if(msg.code == 1){
                    $('#user_info').html('用户：' + msg.data['mobile'])
                    getWatchLoggerList()
                    getSearchHistory()
                }
            },
            error:function(xhr,type,errorThrown){
                ajaxErrorHandler(xhr)
            }

        })
    }();


    //获取搜索历史
    window.getSearchHistory = function(){


        if(isLogin == false){
            $('.search-history-content').append('<div class="notic-login" style="text-align: center"><span  class="layui-btn" onclick="window.gotoLogin()">请登录</span></div>')
        }else{

            mui.ajax(conf.host + '/v1/getSearchHistory',{
                dataType:'json',//服务器返回json格式数据
                type:'get',//HTTP请求类型
                timeout:10000,//超时时间设置为10秒；
                headers:{'Authorization':localStorage.authToken},
                beforeSend:function(){
                    $('.search-history-content').removeClass('hidden')
                    $('.search-history-content').find('.search-tag').remove()
                    $('.search-history-content').append(loading_dom)
                },
                success:function(msg){
                    $('.search-history-content').find('.layui-flow-more').remove()
                    laytpl(searchTpl).render(msg.data, function(html){
                        document.getElementById('search-history-box').innerHTML = html
                    });

                    $('.search-tag').on(click_event_type,function(){
                        searchTagvalue = $(this).find('button').attr('data')

                        if(window.plus != undefined){
                            index_webview = plus.webview.getWebviewById('HBuilder')
                            mui.fire(index_webview,'fromSearchHistory',{search_tag_value:searchTagvalue});

                        }
                        mui.openWindow({
                            id:'HBuilder',
                            url: '../index.html?search_tag_value=' + encodeURIComponent(searchTagvalue) + '&hash=' + getUID(),
                            extras:{search_tag_value:searchTagvalue}
                        });
                    })
                },
                error:function(xhr,type,errorThrown){
                    ajaxErrorHandler(xhr)
                }
            });
        }

    }
    window.addEventListener('getSearchHistory',getSearchHistory)

    // 获取播放记录
    window.getWatchLoggerList = function(){
        if(isLogin == false){
            $('.watchlog').append('<div class="notic-login" style="text-align: center"><span  class="layui-btn " onclick="window.gotoLogin()">请登录</span></div>')
        }else{
            mui.ajax(conf.host + '/v1/getWatchLoggerList',{
                dataType:'json',//服务器返回json格式数据
                type:'post',//HTTP请求类型
                timeout:10000,//超时时间设置为10秒；
                headers:{'Authorization':localStorage.authToken},
                beforeSend:function(){
                    $('.watch-log-content').addClass('layui-show')
                    $('.watch-log-content').find('.swiper-slide').remove()
                    $('.watch-log-content').append(loading_dom)
                },
                success:function(msg){
                    if(msg.data.length > 0){
                        $('.watch-log-content').find('.layui-flow-more').remove()

                        let _list = []
                        $.each(msg.data,function(k,v){

                            var watch_log_info = {
                                'play_detail_id' : v.play_detail_id,
                                'play_line_index' : v.play_line_index ? v.play_line_index : 0,
                                'play_item_index' : v.play_item_index ? v.play_item_index : 0 ,
                                'play_time' : v.play_time ? v.play_time : 0.00 ,
                                'video_total_time' : v.video_total_time ? v.video_total_time : 0.00 ,
                            }

                            let _dom = '<div class="layui-card watch_log_item">' +
                                '<div class="layui-card-header">'+v.title+'</div>'+
                                '<div class="layui-card-body">'+
                                '<a href="../detail.html?id='+v.play_detail_id+'" target="_blank" data-index="'+k+'" data="'+v.play_detail_id+'" ><img class="lazy" src="https://cdn.jsdelivr.net/gh/jyolo/mov_statics/static/images/default.png" data-echo="'+conf.cover_host + v.cover+'" /></a>'+
                                '<span class="watch_rate">'+
                                '<div class="layui-progress" lay-showPercent="true">'+
                                '<div class="layui-progress-bar layui-bg-red" lay-percent="'+v.watch_rate+'"></div>'+
                                '</div>' +
                                '</span>'+
                                '</div>'+
                                '</div>'

                            _list.push(_dom)
                        })
                        if(window.swiper_watchlog == undefined){
                            window.swiper_watchlog = new Swiper('.watchlog', {
                                slidesPerView: 3,
                                slidesPerGroup:3,
                                centeredSlides: false,
                                spaceBetween: 1,
                                virtual: {
                                    slides: [],
                                },
                                on:{
                                    slideChange: function(){
                                        bind_tap_on_history_item()
                                        element.init()
                                        window.Echo.init()
                                    },
                                },
                            });
                        }

                        window.swiper_watchlog.virtual.removeAllSlides()
                        window.swiper_watchlog.virtual.appendSlide(_list)
                        window.swiper_watchlog.virtual.update()


                        //初始化 进度条 绑定 点击事件
                        if(window.bind_tap_on_history_item == undefined){

                            window.bind_tap_on_history_item = function(){

                                // 先解绑 再 bind 否则事件会触发多次
                                // mui('.swiper-slide').on(click_event_type,'a',function(){
                                $('.swiper-slide').find('a').unbind(click_event_type).bind(click_event_type,function(){

                                    if(window.plus == undefined){
                                        return true
                                    }

                                    // app 中用 localStorage 传值
                                    detail_id = this.getAttribute('data')
                                    localStorage.setItem('play_detail_id',detail_id)

                                    detail_webview = plus.webview.getWebviewById('detail')
                                    if(detail_webview != null){
                                        mui.fire(detail_webview,'checkLogin')
                                        mui.fire(detail_webview,'startPlay');
                                        mui.openWindow({
                                            id:'detail' ,
                                            url:'../detail.html',
                                        });

                                    }else{
                                        mui.openWindow({
                                            id:'detail' ,
                                            url:'../detail.html',
                                        });
                                    }

                                    return false

                                })

                            }

                        }

                        bind_tap_on_history_item()
                        element.init()
                        window.Echo.init()
                    }else{
                        // $('.watchlog').fadeOut();
                        // $('.watchlog').next().fadeIn();
                        // $('.watchlog').parent().removeClass('layui-show')
                        $('.watch-log-content').append('<div class="layui-flow-more">暂无观看记录</div>')
                    }

                },
                error:function(xhr,type,errorThrown){
                    ajaxErrorHandler(xhr)
                }
            });
        }
    }

    window.addEventListener('getWatchLoggerList',getWatchLoggerList)




    $('.more').on(click_event_type,function(){
        switch ($(this).attr('lay-type')) {
            case 'watchlog':
                mui.openWindow({
                    id:'watch_history' ,
                    url:'../user/watch_history.html'
                });
                break;
            case 'searchlog':
                mui.openWindow({
                    id:'auth' ,
                    url:'user/home.html'
                });
                break;
        }
    })

    $('.logout').on(click_event_type,function () {

        layer.alert('确定退出？',function () {

            mui.ajax(conf.host + '/v1/auth/loginout',{
                dataType:'json',//服务器返回json格式数据
                type:'post',//HTTP请求类型
                timeout:10000,//超时时间设置为10秒；
                headers:{'Authorization':localStorage.authToken},
                beforeSend:function(){
                    // $('#user_info').append(loading_dom)
                },
                success:function(msg){
                    if(msg.code == 1){
                        localStorage.removeItem('authToken');
                        layer.alert('退出成功',{closeBtn:0},function(){
                            if(window.plus != undefined){
                                HBuilder_webview = plus.webview.getWebviewById('HBuilder')
                                mui.fire(HBuilder_webview,'refresh_login_status');
                                mui.openWindow({
                                    id:'HBuilder' ,
                                    url:'../index.html'
                                });
                            }else{
                                mui.openWindow({
                                    id:'HBuilder' ,
                                    url:'../index.html'
                                });
                            }
                        })

                    }
                },
                error:function(xhr,type,errorThrown){
                    ajaxErrorHandler(xhr)
                }

            })

        })



    })




});