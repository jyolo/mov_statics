layui.config({
    version: "3.0.0"
    ,base: 'https://cdn.jsdelivr.net/gh/jyolo/mov_statics@f3a7fd33aec1021822e5a0d4c83cabcd112eb8bb/static/mods/' //这里实际使用时，建议改成绝对路径
}).use(['element','jquery','laytpl','util'],function(){

    var $ = layui.jquery
    var element = layui.element
    var laytpl = layui.laytpl
    var util = layui.util

    var history_tpl = history_list.innerHTML
    var toend=false;
    layui.cache.page = 0

    //固定Bar
    util.fixbar({
        bgcolor: '#009688',
        click: function(type){
        }
    });


    window.getWatchLoggerListByTimeLine = function(){
        page = layui.cache.page
        mui.ajax(conf.host + '/v1/getWatchLoggerListByTimeLine',{
            data:{page:page},
            dataType:'json',//服务器返回json格式数据
            type:'get',//HTTP请求类型,
            timeout:10000,//超时时间设置为10秒；
            headers:{'Authorization':localStorage.authToken},
            beforeSend:function(){
                $('.layui-timeline').html()
                $('.layui-timeline').append('<li style="padding-bottom: 20px">' + loading_dom + '</li>')
            },
            success:function(msg){
                $('.layui-timeline').find('.layui-flow-more').remove()
                if(msg.data.length > 0){
                    laytpl(history_tpl).render(msg.data, function(html){
                        // document.getElementById('history_timelimie_content').innerHTML = html
                        $('.layui-timeline').append(html)
                        element.init()
                        window.Echo.init()
                        toend = true
                    });
                }else{
                    $('.layui-timeline').append('<li class="layui-timeline-item"><div class="layui-flow-more" >没有更多了</div></li>')
                }

            },
        });

    }

    window.addEventListener('getWatchLoggerListByTimeLine',getWatchLoggerListByTimeLine)

    getWatchLoggerListByTimeLine()

    window.continue_play = function(obj){

        var detail_id = $(obj).attr('data')
        setTimeout(function(){
            if(window.plus != undefined){
                localStorage.setItem('play_detail_id',detail_id)

                detail_webview = plus.webview.getWebviewById('detail')
                mui.fire(detail_webview,'checkLogin');
                mui.fire(detail_webview,'startPlay');
                mui.openWindow({
                    id:'detail' ,
                    url:'../detail.html',
                });

            }else{
                return true
            }

        },200)


    }

    $(window).scroll(
        function () {
            var scrollTop = $(this).scrollTop();
            var scrollHeight = $('.layui-timeline').height();
            var windowHeight = $(this).height();
            // 距离底部 还有100 px  （滚动高度 + 窗口高度 + 100 > 窗口高度）
            if (scrollTop + windowHeight + 100 >= scrollHeight && toend == true) {
                toend=false;
                layui.cache.page = layui.cache.page + 1
                getWatchLoggerListByTimeLine()
            }
        }
    );



    mui('.fly-nav-user').on(click_event_type,'.layui-icon-username',function(){
        mui.openWindow({
            id:'home' ,
            url:'../user/home.html'
        });
    })

});