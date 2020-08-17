layui.config({
    version: "3.0.0"
    ,base: 'https://cdn.jsdelivr.net/gh/jyolo/mov_statics/static/mods/'
}).use(['custom','form','jquery','layer'],function(){
    var form = layui.form
    var $ = layui.jquery
    var custom = layui.custom
    var layer = layui.layer


    window.toggletab = function(indexNumber){
        window.swiper.slideTo(indexNumber)
    }
    window.swiper = new Swiper('#reglogin',{
        // 如果需要分页器
        pagination: {
            el: '.swiper-pagination',
            clickable:true,
            clickableClass : 'pagination-clickable',
            type: 'custom',
            renderCustom: function (swiper, current, total) {
                return '<li ><a onclick="javascript:toggletab(0)">找回密码 / 重置密码</a></li>'
            }
        },
    });
    $('#send_verify_code').click(function(){
        let _this = $(this)
        let mobile = $(this).parents('form').find('input[name="mobile"]').val().trim()
        // 防止重复点击触发事件
        if ($(this).hasClass('layui-btn-disabled')){return false}
        if(mobile.length == 0) {
            layer.msg('请输入手机号')
            return false
        }

        var timer
        mui.ajax(conf.host + '/v1/auth/sendVerifyCode',{
            data:{'account':mobile,'account_type':'mobile','action_type':'repassword'},
            dataType:'json',//服务器返回json格式数据
            type:'post',//HTTP请求类型
            timeout:10000,//超时时间设置为10秒；
            beforeSend:function(){loading = layer.load()},
            success:function(msg){
                if(msg.code == 0) {
                    layer.msg(msg.msg)
                    layer.close(loading);
                    return false
                }else{
                    layer.msg('短信发送成功，注意查收!')
                    // 倒计时
                    _this.addClass('layui-btn-disabled')
                    let old_text = _this.html()
                    let waittime = 60
                    _this.html(waittime)
                    timer = setInterval(function(){
                        waittime = waittime-1
                        if (waittime <= 0 ){
                            _this.html(old_text)
                            _this.removeClass('layui-btn-disabled')
                            clearInterval(timer)
                        }else{
                            _this.html(waittime)
                        }
                    },1000)
                    layer.msg('短信发送成功，注意查收!')
                }

                layer.close(loading);
            },
            error:function(xhr,type,errorThrown){
                //异常处理；
                clearInterval(timer)
            }
        });

        return false
    })

    form.on('submit(repassword)',function(data){
        if(isApp == false){
            data.field.client_type = 'h5'
            data.field.device_id = ''
        }else{
            data.field.client_type = 'android'
            data.field.device_id = plus.device.imei
        }

        let loading
        mui.ajax(conf.host + '/v1/auth/repassword',{
            data:data.field,
            dataType:'json',//服务器返回json格式数据
            type:'post',//HTTP请求类型
            timeout:20000,//超时时间设置为20秒；
            beforeSend:function(){loading = layer.load()},
            success:function(msg){
                console.log(msg.data)
                if(msg.code == 1){
                    layer.alert('修改成功,前往登录',{closeBtn:0},function(){
                        mui.openWindow({
                            id:'home' ,
                            url:'../user/auth.html'
                        });
                    })

                }else{
                    layer.msg(msg.msg,{
                        icon: 5,
                        time:2000
                    })
                }
                layer.close(loading);

            },
            error:function(xhr,type,errorThrown){
                //异常处理；
                console.log(type);
            }
        });

        return false
    })






});