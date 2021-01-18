
layui.config({
    version: "3.0.0"
    ,base: 'https://cdn.jsdelivr.net/gh/jyolo/mov_statics/static/mods/' //这里实际使用时，建议改成绝对路径
}).use(['element','jquery','util','laytpl'],function(){

    var $ = layui.jquery
    var element = layui.element
    var laytpl = layui.laytpl
    var util = layui.util


    $('.top_menu_icon').on(click_event_type,function(){
        if($('.top_menu_content').css('display') == 'block'){
            $('.top_menu_content').slideUp()
        }else{
            $('.top_menu_content').slideDown();
            $(this).fadeOut()
        }
    })

    $('.slide_up').on(click_event_type,function () {
        $('.top_menu_content').slideUp()
        $('.top_menu_icon').fadeIn()
    })

    $('.top_menu_content').find('.layui-card').unbind(click_event_type).bind(click_event_type,function(){
        layer.msg('尽请期待！');

    })



    window.render_login_status = function(){

        laytpl(user_login_status.innerHTML).render({'islogin': (localStorage.authToken != undefined) }, function(html){

            $('.user_login_status').find('.layui-btn').remove()
            $('.user_login_status').append(html)

            $('.user_login_status').find('.layui-btn').unbind(click_event_type).bind(click_event_type,function(){

                switch ($(this).attr('lay-type')) {
                    case 'auth':
                        if((localStorage.authToken != undefined) == false){
                            mui.openWindow({
                                id:'auth' ,
                                url:'user/auth.html'
                            });
                        }else{
                            if(window.plus != undefined){
                                home_webview = plus.webview.getWebviewById('home')
                                mui.fire(home_webview,'checkLogin');
                            }
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
                        }
                        mui.openWindow({
                            id:'home' ,
                            url:'user/home.html'
                        });
                        break;

                }
                $('.top_menu_content').slideUp()
                $('.top_menu_icon').fadeIn()
            })

        });

    }
    render_login_status()
    window.addEventListener('refresh_login_status',function(event){
        render_login_status()
    })


    var animate_scrollTop_height = 300

    // $('#search_result_swpier').height(window.screen.height)

    // 初始化 获取列表的cache
    layui.cache.getListDataFuncArgs = {}
    var list_tpl = vlistScript.innerHTML
    var list_requst_url = '/v1/search'


    var backNum = 0
    mui.init({
        beforeback: function() {
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
    })

    // $('#fly-main').height($(window).height())



    // 初始化选项卡的 swiper
    window.search_result_swpier = new Swiper('#search_result_swpier',{
        autoHeight: true,
        on: {
            slideChangeTransitionStart: function () {
                $('.layui-tab-title').find('li').removeClass('layui-this');
                $('.layui-tab-title').find('li').eq(this.activeIndex).addClass('layui-this');
                layui.cache.current_data_type =  $('#search_result_swpier > .swiper-wrapper').find('.swiper-slide').eq(this.activeIndex).attr('id')

                //首次切换过来没有数据的时候 加载一次数据
                if(layui.cache.getListDataFuncArgs[layui.cache.current_data_type].page == 0 && $('#'+layui.cache.current_data_type).find('li').length == 0){
                    // 滚动到指定位置获取 数据
                    // 当前选项卡 toend 赋值 false 主动触发 getListData
                    layui.cache.getListDataFuncArgs[layui.cache.current_data_type].toend = false
                    $('html,body').animate({scrollTop: animate_scrollTop_height},100);
                    getListData()
                    this.update()

                }else{

                    if(layui.cache.getListDataFuncArgs[layui.cache.current_data_type].scrollTop == undefined){
                        $('html,body').animate({scrollTop: animate_scrollTop_height},100);
                    }else{
                        // 不能小于298 否则贴不到 顶上
                        if(layui.cache.getListDataFuncArgs[layui.cache.current_data_type].scrollTop < animate_scrollTop_height){
                            layui.cache.getListDataFuncArgs[layui.cache.current_data_type].scrollTop = animate_scrollTop_height
                        }
                        $('html,body').animate({scrollTop: layui.cache.getListDataFuncArgs[layui.cache.current_data_type].scrollTop},10);

                    }
                }

            },
            slideChangeTransitionEnd:function(){
                this.update()
            }
        }
    })


    //监听 mov_category 点击
    element.on('tab(mov_category)', function(data){
        search_result_swpier.slideTo(data.index)
    })

    //固定Bar
    util.fixbar({
        bgcolor: '#009688',
        click: function(type){

        }
    });


    window.getListData_max_retry_times = 5;
    window.getListData_max_retry_start = 0;
    window.getListData = function(){

        let params = layui.cache.form_data
        params.page = layui.cache.getListDataFuncArgs[layui.cache.current_data_type].page
        params.data_type = layui.cache.current_data_type

        var heards = {}
        if(isLogin){
            var heards = {'Authorization':localStorage.authToken}
        }
        mui.ajax(conf.host + list_requst_url,{
            data:params,
            dataType:'json',//服务器返回json格式数据
            type:'get',//HTTP请求类型
            timeout:20000,//超时时间设置为10秒；
            headers:heards,
            beforeSend:function(){

                if($('#' + layui.cache.current_data_type).find('.layui-flow-more').length == 0){
                    $('#' + layui.cache.current_data_type).append(loading_dom)
                    search_result_swpier.update()

                }

            },
            success:function(msg){

                if(msg.data.list.length > 0){

                    layui.laytpl(list_tpl).render(msg.data.list, function(html){
                        $('#' + layui.cache.current_data_type).find('.layui-flow-more').remove()
                        $('#' + layui.cache.current_data_type).find('ul').append(html)

                        layui.cache.getListDataFuncArgs[layui.cache.current_data_type].toend = true
                    });

                }else{
                    layui.cache.getListDataFuncArgs[layui.cache.current_data_type].toend = false

                    $('#' + layui.cache.current_data_type).find('.layui-flow-more').remove()
                    $('#' + layui.cache.current_data_type).append('<div class="layui-flow-more" style="margin-top: 1.5rem"><i class="layui-icon layui-icon-left" style=""></i>  暂无数据,左右滑动切换其它板块试试  <i class="layui-icon layui-icon-right" style=""></i>  </div>')
                }


                window.sticky.refresh()
                window.Echo.init()
                search_result_swpier.update()

                play_item_bind_click_event()
                // 请求成功清零
                window.getListData_max_retry_start = 0

            },
            error:function(xhr,type,errorThrown){
                console.log('--------getListData request error retrying--------')
                if(window.getListData_max_retry_start < window.getListData_max_retry_times){
                    window.getListData()
                    window.getListData_max_retry_start++
                }


            }
        });
    }


    // 加载出来的数据 绑定点击/tap 事件
    window.play_item_bind_click_event = function(){
        $('#search_result_swpier').find('.vlist').unbind(click_event_type).bind(click_event_type,function(){

            if(window.plus != undefined){
                detail_id = this.getAttribute('data')

                localStorage.setItem('play_detail_id',detail_id)

                detail_webview = plus.webview.getWebviewById('detail')

                mui.fire(detail_webview,'checkLogin');
                mui.fire(detail_webview,'startPlay');
                mui.openWindow({
                    id:'detail' ,
                    url:'detail.html',
                });
                return false
            }else{

                return true
            }

        })


    }


    window.addEventListener('play_item_bind_click_event',play_item_bind_click_event)

    // console.log(window.screen.height)

    window.form_submit = function(formData){

        //初始化 4个 选项卡的 cache
        $('#search_result_swpier').find('.swiper-slide').each(function (k,v) {
            layui.cache.getListDataFuncArgs[ $(v).attr('id') ] = {page:0 ,toend:false}
            if($(v).hasClass('swiper-slide-active')){
                layui.cache.current_data_type = $(v).attr('id')
            }else if(k == 0){
                layui.cache.current_data_type = $(v).attr('id')
            }
        })


        $('#search_result_swpier').removeClass('hidden')
        $('.layui-tab-title').removeClass('hidden')


        layui.cache.form_data = formData

        //清楚4个选项卡里面的所有li
        $('.fly-case-list').find('li').remove()

        // 搜索结果区最小高 ，否则不够高度向上滚动
        $('#search_result_swpier').css('min-height',window.screen.height)


        $('html,body').animate({scrollTop: animate_scrollTop_height},500);

        getListData()

        if(window.sticky == undefined){
            window.sticky = new hcSticky('#mov_category', {
                stickTo: '#main-content',
                top:-10
            });
        }else{
            window.sticky.refresh()
        }




    }



    $('.search-form').on('submit',function(){
        p = $(this).serialize().split('=')

        if(p[1].indexOf('%') > -1){
            p[1] = decodeURIComponent(p[1])
        }

        form_submit({kw:p[1]})
        return false
    })


    // app 中事件 从 个人中心过来的 触发事件
    window.addEventListener('fromSearchHistory',function(event){
        //确保每个webview 的 window.isLogin 是 最新的状态

        var self = plus.webview.currentWebview();

        $('.keyword').val(event.detail.search_tag_value)


        $('.search-form').submit()


    })
    // H5 处理
    if(window.plus == undefined && window.params.search_tag_value != undefined){
        // 从个人中心 搜索历史跳转过来的
        // kw 赋值
        $('.keyword').val(decodeURIComponent(window.params.search_tag_value))
        //触发表单提交事件
        $('.search-form').submit()
    }


    $(window).scroll(
        function () {
            var scrollTop = $(window).scrollTop();
            var scrollHeight = $('#'+ layui.cache.current_data_type).height();
            var windowHeight = $(this).height();
            var current_data_type = layui.cache.current_data_type

            if(current_data_type != undefined){

                // 记录每个选项卡的滚动位置
                layui.cache.getListDataFuncArgs[current_data_type].scrollTop = scrollTop

                // 距离底部 还有100 px  （滚动高度 + 窗口高度 + 100 > 窗口高度）
                if (scrollTop + windowHeight + 100 >= scrollHeight && layui.cache.getListDataFuncArgs[current_data_type].toend == true) {
                    layui.cache.getListDataFuncArgs[current_data_type].toend=false;
                    // 分页 + 1
                    layui.cache.getListDataFuncArgs[current_data_type].page = layui.cache.getListDataFuncArgs[current_data_type].page + 1
                    getListData()
                }

            }

        }
    );


});
