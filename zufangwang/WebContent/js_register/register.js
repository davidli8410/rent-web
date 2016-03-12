/*
duration:44ms

|user/register

|--user/UserForm

|----ui/validate/validateFormEle

|----user/verifyImg

|------common/layer/BaseLayer

|------ui/validate/validateFormEle

|--ui/validate/validateFormEle

*/
/**
 * 验证表单元素
 * validate:需要验证的方法f
 * validatename:提示语
 * validatedata:验证方法需要的数据。目前密码要求的长度为6，后续如果需要验证复杂度，需要在这里添加
 * <input type="password" name="password" id="password" placeholder="请输入密码" validate="notNull,minLength" validatedata="minLength=6" validatename="密码">
 */
define("ui/validate/validateFormEle", function($) {
    var validate = {
        notNull: function(val) {
            return $.trim(val);
        },
        isTel: function(val) {
            var reg = /^(13[0-9]|14(5|7)|15(0|1|2|3|5|6|7|8|9)|17[0-9]|18[0-9])\d{8}$/;
            return reg.test(val);
        },
        isSame: function(val1, ele, data) {
            var obj = $(data);
            if (!obj.length) {
                return false;
            }
            return val1 == obj.val();
        },
        maxLength: function(val, ele, data) {
            val = $.trim(val);
            data = parseInt(data);
            return val.length <= data;
        },
        minLength: function(val, ele, data) {
            val = $.trim(val);
            data = parseInt(data);
            return val.length >= data;
        },
        length: function(val, ele, data) {
            val = $.trim(val);
            data = parseInt(data);
            return val.length == data;
        },
        isChecked: function(val, ele) {
            return ele.checked;
        }
    };
    var $ = jQuery;
    var validateEl = function(element) {
        element = $(element);
        if (!element.length) {
            return true;
        }
        function showError(fun, name, data) {
            var text = "";
            switch (fun) {
              case "notNull":
                text = name + "不能为空";
                break;

              case "isTel":
                text = "请输入正确的" + name;
                break;

              case "isSame":
                text = name + "输入不一致";
                break;

              case "isChecked":
                text = name + "没有选中";
                break;

              case "length":
                text = name + "长度为" + data;
                break;

              case "maxLength":
                text = name + "最大长度为" + data;
                break;

              case "minLength":
                text = name + "最小长度为" + data;
                break;
            }
            text && validateEl.showError(element, text);
        }
        var validateFuns = element.attr("validate");
        if (validateFuns) {
            var vs = validateFuns.split(","), val = element.val(), ele = element.get(0), vName = element.attr("validateName");
            var validateData = element.attr("validateData");
            if (validateData) {
                validateData = $.queryToJson(validateData);
            } else {
                validateData = {};
            }
            for (var i = 0; i < vs.length; i++) {
                var fun = vs[i];
                if (validate[fun] && !validate[fun].call(null, val, ele, validateData[fun])) {
                    showError(fun, vName, validateData[fun]);
                    return false;
                }
            }
        }
        return true;
    };
    function removeError(e) {
        var ele = $(this).parent();
        ele.removeClass("error");
        ele.find("p").remove();
    }
    validateEl.showError = function(el, text, nohide) {
        var p = el.parent();
        var msg = p.find("p");
        if (!msg.length) {
            msg = p.append($("<p></p>")).find("p");
        }
        msg.html(text);
        p.addClass("error");
        !nohide && el.one("focus", removeError);
    };
    validateEl.hideError = function(el) {
        var p = el.parent();
        el.off("focus", removeError);
        p.removeClass("error");
        p.find("p").remove();
    };
    validateEl.showMsg = function(el) {};
    return validateEl;
})

/**
 * 基础浮层
 * 
 */
define("common/layer/BaseLayer", function() {
    var win = $(window);
    var Shadow = {
        _shadowLayer: false,
        _init: function() {
            var _this = this;
            if (!_this._shadowLayer) {
                _this._shadowLayer = $("<div style='position:absolute;position:fixed;left:0px;top:0px;width:100%;height:100%;z-index:1000;background-color:#000;'></div>");
                $(document.body).append(_this._shadowLayer);
            }
            return _this._shadowLayer;
        },
        show: function(opacity) {
            var _this = this;
            if (!_this._shadowLayer) {
                _this._init();
            }
            _this._shadowLayer.css("opacity", opacity);
            _this._shadowLayer.show();
            return _this._shadowLayer.css("z-index");
        },
        hide: function() {
            var _this = this;
            if (_this._shadowLayer) {
                _this._shadowLayer.hide();
            }
        }
    };
    return function(option) {
        var opt = {
            html: "",
            style: {
                position: "absolute",
                top: "center",
                left: "center"
            },
            className: "",
            shadow: .8,
            esc: false
        };
        $.extend(opt, option);
        var _this = {
            _div: false
        };
        var that = $({});
        function initDiv() {
            if (!_this._div) {
                _this._div = $('<div style="display:none"></div>');
                _this._div.css(opt.style);
                $(document.body).append(_this._div);
                _this._div.html(opt.html);
                _this._div.addClass(opt.className);
            }
            return _this._div;
        }
        function init() {
            initDiv();
            function doEsc(e) {
                if (e.keyCode == 27) {
                    if (opt.esc == "close") {
                        that.hide();
                    } else if (opt.esc == "destroy") {
                        that.destroy();
                    }
                }
            }
            function listenEsc(flag) {
                if (flag) {
                    win.on("keyup", doEsc);
                } else {
                    win.off("keyup", doEsc);
                }
            }
            if (opt.esc) {
                that.on("show", function() {
                    listenEsc(true);
                });
                that.on("hide", function() {
                    listenEsc(true);
                });
            }
        }
        that.init = init;
        that.show = function(position, ani) {
            if (!_this._div) {
                init();
            }
            var zIndex = 100001;
            if (opt.shadow != 0 && opt.shadow !== false) {
                zIndex = Shadow.show(opt.shadow) - 0 + 1;
            }
            var styles = {
                left: "0px",
                top: "0px"
            };
            _this._div.css("z-index", zIndex);
            if (position) {
                if (position.left) {
                    styles.left = position.left;
                }
                if (position.top) {
                    styles.top = position.top;
                }
                if (styles.left == "center") {
                    styles.left = (win.width() - _this._div.width()) / 2 + "px";
                }
                if (styles.top == "center") {
                    var st = _this._div.css("position") == "fixed" ? 0 : win.scrollTop();
                    styles.top = Math.max(st + (win.height() - _this._div.height()) / 2, 0) + "px";
                }
                _this._div.css(styles);
            }
            _this._div.show();
            that.trigger("show");
        };
        that.hide = function() {
            if (opt.shadow != 0 && opt.shadow !== false) {
                Shadow.hide();
            }
            _this._div.hide();
            that.trigger("hide");
        };
        that.getDOM = function() {
            if (!_this._div) {
                init();
            }
            return _this._div;
        };
        that.setHTML = function(html) {
            if (!_this._div) {
                init();
            }
            _this._div.html(html);
            that.trigger("setHTML");
        };
        that.isShow = function() {
            if (!_this._div) {
                return false;
            }
            return _this._div.css("display") == "block";
        };
        that.destroy = function() {
            that.trigger("destroy");
            if (opt.shadow != 0 && opt.shadow !== false) {
                Shadow.hide();
            }
            _this._div.undelegate();
            if (_this._div) {
                _this._div.remove();
            }
        };
        return that;
    };
})

/**
 * 验证码浮层
 * 
 * 
 */
define("user/verifyImg", function(require) {
    var BaseLayer = require("common/layer/BaseLayer"), trans = $.Trans, validateEl = require("ui/validate/validateFormEle");
    return function(option) {
        var opt = {
            url: "",
            verify: ""
        };
        $.extend(opt, option);
        opt.url = $.joinUrl(opt.url, {
            random: new Date().getTime()
        });
        var result = new BaseLayer({
            html: "<p>" + '<input type="text" validate="notNull,length" validatedata="length=4" validatename="验证码" placeholder="请输入右侧图片内容"><img src="' + opt.url + '">' + "</p>" + '<button class="actValidate">提交</button>' + '<a href="#" class="actClose"></a>',
            style: {
                position: "fixed"
            },
            esc: "destroy",
            className: "verifyLayer"
        });
        result.show({
            left: "center",
            top: "center"
        });
        var layer = result.getDOM();
        layer.find("input").focus();
        layer.delegate(".actClose", "click", function() {
            result.trigger("cancel");
            result.destroy();
            return false;
        });
        layer.delegate(".actValidate", "click", function() {
            var input = layer.find("input");
            if (!validateEl(layer.find("input"))) {
                return;
            }
            var request = trans({
                url: opt.verify,
                method: "post"
            });
            var args = {
                verifyCode: input.val()
            };
            request.request(args).done(function(data) {
                if (data.success) {
                    result.trigger("success", args);
                    result.destroy();
                } else {
                    result.resetImg();
                    validateEl.showError(input, "验证码输入错误");
                }
            });
            return false;
        });
        layer.delegate("input", "keyup", function(e) {
            if(e.keyCode == 13){
            	layer.find(".actValidate").click();
            }
        });
        layer.delegate("img", "click", function() {
            result.resetImg();
            return false;
        });
        result.resetImg = function() {
            layer.find("img").attr("src", $.joinUrl(opt.url, {
                random: new Date().getTime()
            }));
        };
        return result;
    };
})

/**
 * 验证form
 * 
 * 
 */
define("user/UserForm", function(require) {
    var validateEl = require("ui/validate/validateFormEle"), verifyImg = require("user/verifyImg"), trans = $.Trans;
    var UserForm = function(form) {
        var _this = this;
        _this.$el = $(form);
        _this.action = _this.$el.attr("action");
        _this.method = _this.$el.attr("method");
        _this.init();
    };
    var BaseLayer = require("common/layer/BaseLayer")
    $.extend(UserForm.prototype, {
        bindEvent: function() {
            var _this = this;
            _this.$el.on("submit", function() {
                return false;
            });
            var dom = _this.$el.parent();
            function addDelegate(events) {
                for (var i in events) {
                    var evt = events[i], nameType = i.split(" ");
                    dom.delegate(nameType[1], nameType[0], $.proxy(_this[evt], _this));
                }
            }
            if (_this._events) {
                $.extend(_this.events, _this._events);
            }
            addDelegate(_this.events);
        },
        init: function() {
            var _this = this;
            _this.bindEvent();
        },
        api: {
            checkExists: "/register/ljRegister/CheckExist",
            sendVerifyCode: "/register/ljRegister/SendVerifyCode",
            verifyCode: "/register/ljRegister/GenerateVerifyCode",
            checkVerifyCode: "/register/ljRegister/CheckVerifyCode",
            sendSMS: "/register/ljRegister/SendMobileVerifyCode",
            checkMobileCode: "/register/ljRegister/CheckMobileVerifyCode"
        },
        events: {
            "blur input": "checkEl",
            "blur .actCheckVerify": "checkTelVerify",
            "click .actSubmit": "submit",
            "keyup input": "autoSubmit",
            "click .actSendYuyin":"actSendYuyin"
        },
        autoSubmit: function(e) {
            if (e.keyCode == 13) {
                this.$el.find(".actSubmit").click();
            }
        },
        checkVerifyImg: function(telNumber, cb) {
            var _this = this;
            _this.checkIsNeedVerify(telNumber.val(), function(need) {
                if (need) {
                    var verify = _this.showVerifyImg();
                    verify.on("success", function(e, args) {
                        cb(true, args);
                    });
                    verify.on("cancel", function() {
                        cb(false);
                    });
                } else {
                    cb(true);
                }
            });
        },
        showVerifyImg: function() {
            var _this = this;
            var verify = verifyImg({
                url: _this.api.verifyCode,
                verify: _this.api.checkVerifyCode
            });
            return verify;
        },
        sendSMS: function(e) {
            var _this = this;
            var telNumber = _this.$el.find(".phonecode");
            if (telNumber.hasClass("disable")) {
                return;
            }
            var btn = $(e.target);
            if (validateEl(telNumber)) {
                btn.addClass("disable");
                var verify = _this.showVerifyImg();
                verify.on("success", function(e,args) {
                    _this._sendSMS(telNumber.val(),args.verifyCode);
                });
                verify.on("cancel", function() {
                    btn.removeClass("disable");
                });
            }
            return false;
        },
        sendVerifySMS: function(e) {
            this.sendSMS(e, true);
        },
        checkIsNeedVerify: function(telNumber, cb) {
            var _this = this;
            var request = trans({
                url: _this.api.sendVerifyCode,
                method: "post",
                dataType: "json"
            });
            request.request({
                mobileNumber: telNumber
            }).done(function(data) {
                if (data && data.data != null) {
                    cb(data.data);
                } else {
                    cb(data);
                }
            });
        },
        _sendSmsSuccess: function() {
            var _this = this;
            var btn = _this.$el.find(".send");
            btn.addClass("disable");
            var timeout = 60;
            function secondCount() {
                timeout--;
                if (timeout < 0) {
                    btn.html("重新发送验证码");
                    btn.removeClass("disable");
                } else {
                    if(timeout <= 39){
                      _this._showYuyin();
                    }
                    btn.html(timeout + 1 + "s后重新发送");
                    setTimeout(secondCount, 1e3);
                }
            }
            secondCount();
        },
        // 显示语音验证码
        _showYuyin:function(){
          var _this = this;
          if(_this.$el.find(".yuyin").length){
            return;
          }
          validateEl.showError(_this.$el.find(".phonecode"), '<p class="yuyin" style="color:#333;text-align:right;">没收到验证码？试试<a href="#" style="color:#4fac6a;text-decoration: underline;" class="actSendYuyin">语音验证码</a>吧</span>');
        },
        actSendYuyin:function(){
          var _this = this;
          var verifyCode = _this.api.verifyCode;
          function getVerifyUrl(){
            return verifyCode+"?r="+new Date().getTime();
          }
          var layer = BaseLayer({
            html:'<div style=background-color:#FFF;""><div style="padding:15px;border-bottom:1px solid #4fac6a;color:#4fac6a;font-size:16px;">获取语音验证码<span class="tishi" style="font-size:12px;color:red;display:none;"></span></div>'+
                  '<div style="line-height: 30px;padding: 15px 0 0 15px;">'+
                      '<input type="text" style="height: 30px;width: 200px;">'+
                      '<img src="'+getVerifyUrl()+'" style="width: 80px;height: 30px;">'+
                  '</div>'+
                  '<div style="padding:15px;border-bottom:1px solid #ccc;color:#333;width:300px">验证码将以电话形式通知您，请注意接听</div>'+
                  '<div style="padding:15px;text-align:center;"><a href="#" class="actOK" style="color:#333;margin-right:30px">好的</a><a class="actClose" href="#" style="color:#ccc;">不了</a></div></div>'
          })
          
          layer.show({
            left:"center",
            top:"center"
          })
          var dom = layer.getDOM();
          dom.delegate("img","click",function(e){
            $(e.currentTarget).attr("src",getVerifyUrl());
          })
          dom.find("input").focus();
          dom.delegate("input","keyup",function(e){
            if(e.keyCode == 13){
              dom.find(".actOK").click();
            }
          })
          dom.delegate(".actOK","click",function(){
            var verifyCode = dom.find("input").val();
            var tishi = dom.find(".tishi")
            if(!verifyCode){
              tishi.html("验证码不能为空");
              tishi.show();
              return false;
            }
            
            // 发送消息
            var request = trans({
              url:"/register/ljRegister/SendVoiceVerifyCode",
              method:"post"
            })
            request.request({
              mobileNumber: _this.$el.find(".phonecode").val(),
              verifyCode:verifyCode
            }).done(function(data){
              if(data && data.success ){
                layer.destroy();
              }else{
                tishi.html(data.msg || "发送失败");
                tishi.show();
                dom.find("img").attr("src",getVerifyUrl());
              }
            }).fail(function(data){
                tishi.html((data?data.msg:"") || "发送失败");
                tishi.show();
                dom.find("img").attr("src",getVerifyUrl());
            })
            return false;
          });
          layer.getDOM().delegate(".actClose","click",function(){
            layer.destroy();
            return false;
          });
          // SendVoiceVerifyCode
          return false;
        },
        _sendSmsFail: function() {
            var _this = this;
            var btn = _this.$el.find(".send");
            btn.html("重新发送验证码");
            btn.removeClass("disable");
        },
        _sendSMS: function(telNumber,verifyCode) {
            var _this = this;
            var btn = _this.$el.find(".send");
            btn.addClass("disable");
            var request = trans({
                url: _this.api.sendSMS,
                method: "post",
                dataType: "json"
            });
            request.request({
                mobileNumber: telNumber,
                verifyCode:verifyCode || ''
            }).done(function(data) {
            	btn.removeClass("disable");
                if (data.success) {
                    validateEl.hideError(_this.$el.find(".phonecode"));
                    _this._sendSmsSuccess();
                } else {
                    validateEl.showError(_this.$el.find(".phonecode"), data.msg || "发送失败，请重试");
                    _this._sendSmsFail();
                    _this._showYuyin();
                }
            }).fail(function(){
            	validateEl.showError(_this.$el.find(".phonecode"),"发送失败，请重试");
            	btn.removeClass("disable");
            	_this._showYuyin();
            });
        },
        checkTelVerify: function(e) {
            var _this = this;
            var input = $(e.target);
            if (validateEl(e.target)) {
                var request = trans({
                    url: _this.api.checkMobileCode,
                    method: "post"
                });
                var telNumber = _this.$el.find(".phonecode");
                request.request({
                    mobileVerifyCode: input.val(),
                    mobileNumber: telNumber.val()
                }).done(function(data) {
                    if (!data.success) {
                        validateEl.showError(input, "验证码输入不正确");
                    }
                });
            }
        },
        checkEl: function(e) {
            validateEl(e.target);
        },
        submit: function(e, cb) {
            var _this = this;
            var args = _this.validateForm();
            if (args === false) {
                return false;
            }
            if (_this.$el.find(".error").length) {
                _this.$el.find(".error").eq(0).find("input").focus();
                return false;
            }
            _this.submitRequest(args).done(function(data) {
                if (data.success) {
                    cb && cb(true, data);
                    var r = _this.$el.find("#r").val();
                    if (!r) {
                        r = "https://passport.lianjia.com/cas/login";
                    }
                    var query = $.parseURL(location.href).query;
                    location.href = "https://passport.lianjia.com/cas/login?" +query;
                } else {
                    cb && cb(false, data);
                }
            }).fail(function(data) {
                cb && cb(false, data);
                _this.trigger("submitFail", data);
            });
            return false;
        },
        submitRequest: function(args) {
            var _this = this;
            var request = trans({
                url: _this.action,
                method: _this.method,
                args: args
            });
            return request.request();
        },
        validateForm: function() {
            var element = this.$el.get(0).elements;
            var args = {};
            for (var i = 0, len = element.length; i < len; i++) {
                var el = $(element[i]);
                if (!validateEl(el)) {
                    return false;
                }
                var type = el.attr("type");
                if (type) {
                    type = type.toLowerCase();
                    if (type == "checkbox" || type == "radio") {
                        if (!el.get(0).checked) {
                            continue;
                        }
                    }
                }
                var name = el.attr("name");
                if (name) {
                    args[name] = el.val();
                }
            }
            return args;
        }
    });
    return UserForm;
})

/**
 * 用户注册页面
 * 
 * 
 */
define("user/register", function(require) {
    var UserForm = require("user/UserForm"), trans = $.Trans, validateEl = require("ui/validate/validateFormEle");
    var RegisterForm = UserForm;
    $.extend(RegisterForm.prototype, {
        _events: {
            "click .actRegisterSMS": "registerSMS",
            "click .actSubmit": "submitRegister",
            "click .alwayCheck":"alwayCheck"
        },
        alwayCheck:function(e){
        	if(validateEl(e.currentTarget)){
        		  validateEl.hideError($(e.currentTarget));
        		}
        },
        initialize: function() {
            var _this = this;
            _this._super.apply(_this, arguments);
            _this.on("submitFail", function(data) {
                console.log(data);
            });
        },
        submitRegister: function(e) {
            var _this = this;
            _this.submit(e, function(success, data) {
                if (!success) {
                    var msg = "";
                    switch (data.errorCode) {
                      case 0:
                        break;

                      case 1:
                        msg = "手机验证码超时";
                        break;

                      case 2:
                        msg = "验证码输入错误";
                        
                        validateEl.showError(_this.$el.find("[name='verifyCode']"), msg || "接口请求失败");
                        return;
                        break;

                      case 3:
                        msg = "该用户已经存在";
                        _this.showReady();
                        return;
                    }
                    validateEl.showError(_this.$el.find(".phonecode"), msg || "接口请求失败");
                }
            });
        },
        showReady: function() {
            var _this = this;
            var query = $.parseURL(location.href).query;
            var json = $.queryToJson(query);
            var r = ""
            if(json.service){
            	r = json.service;
			}
            validateEl.showError(_this.$el.find(".phonecode"), '该手机号已经被注册<span class="pull-right"><a href="https://passport.lianjia.com/cas/login?service=' +r + '">登录</a>或者<a href="https://passport.lianjia.com/register/resources/lianjia/forget.html?service=' +r + '">找回密码</a></span>');
        },
        registerSMS: function(e) {
            var _this = this;
            var phoneCode = _this.$el.find(".phonecode");
            var tel = phoneCode.val();
            if($(e.currentTarget).hasClass("disable")){
            	return false;
            }
            if (!tel) {
                validateEl(_this.$el.find(".phonecode").get(0));
                return;
            }
            var request = trans({
                url: _this.api.checkExists,
                method: "post"
            });
            request.request({
                mobileNumber: tel
            }).done(function(data) {
                if (data == 1) {
                    _this.showReady();
                } else {
                    _this.sendVerifySMS(e);
                }
            }).fail(function() {
                validateEl.showError(_this.$el.find(".phonecode"), "<span>接口请求失败</span>");
            });
        }
    });
    return function(form) {
        var that = new RegisterForm(form);
        return that;
    };
})