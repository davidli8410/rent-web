define("ui/validate/validateFormEle", function(e) {
    function t() {
        var t = e(this).parent();
        t.removeClass("error"), t.find("p").remove()
    }
    var i = {notNull: function(t) {
            return e.trim(t)
        },isTel: function(e) {
            var t = /^(13[0-9]|14(5|7)|15(0|1|2|3|5|6|7|8|9)|18[0-9]|17[0-9])\d{8}$/;
            return t.test(e)
        },
        isNumber: function(val, ele, data) {
            if (!val) {
                return true;
            }
            if (/^(-?\d+)(\.\d+)?$/.test(val)) {
                if (data) {
                    data = parseInt(data);
                    val = parseInt(parseFloat(val) * Math.pow(10, data)) / Math.pow(10, data);
                    ele.value = val + "";
                }
                return true;
            } else {
                return false;
            }
        }
        ,isSame: function(t, i, n) {
            var r = e(n);
            return r.length ? t == r.val() : !1
        },maxLength: function(t, i, n) {
            return t = e.trim(t), n = parseInt(n), t.length <= n
        },minLength: function(t, i, n) {
            return t = e.trim(t), n = parseInt(n), t.length >= n
        },length: function(t, i, n) {
            return t = e.trim(t), n = parseInt(n), t.length == n
        },isChecked: function(e, t) {
            return t.checked
        }}, e = jQuery, n = function(t) {
        function r(e, i, r) {
            var o = "";
            switch (e) {
                case "notNull":
                    o = i + "不能为空";
                    break;
                case "isTel":
                    o = "请输入正确的" + i;
                    break;
                case "isSame":
                    o = i + "输入不一致";
                    break;
                case "isChecked":
                    o = i + "没有选中";
                    break;
                case "length":
                    o = i + "长度为" + r;
                    break;
                case "isNumber":
	                o = i + "应为数字格式";
	                break;
                case "maxLength":
                    o = i + "最大长度为" + r;
                    break;
                case "minLength":
                    o = i + "最小长度为" + r
            }
            o && n.showError(t, o)
        }
        if (t = e(t), !t.length)
            return !0;
        var o = t.attr("validate");
        if (o) {
            var a = o.split(","), s = t.val(), d = t.get(0), c = t.attr("validateName"), l = t.attr("validateData");
            l = l ? e.queryToJson(l) : {};
            for (var u = 0; u < a.length; u++) {
                var f = a[u];
                if (i[f] && !i[f].call(null, s, d, l[f]))
                    return r(f, c, l[f]), !1
            }
        }
        return !0
    };
    return n.showError = function(i, n, r) {
        var o = i.parent(), a = o.find("p");
        a.length || (a = o.append(e("<p></p>")).find("p")), a.html(n), o.addClass("error"), !r && i.one("focus", t)
    }, n.hideError = function(e) {
        var i = e.parent();
        e.off("focus", t), i.removeClass("error"), i.find("p").remove()
    }, n.showMsg = function() {
    }, n
}), define("common/layer/BaseLayer", function() {
    var e = $(window), t = {_shadowLayer: !1,_init: function() {
            var e = this;
            return e._shadowLayer || (e._shadowLayer = $("<div style='position:absolute;position:fixed;left:0px;top:0px;width:100%;height:100%;z-index:1000;background-color:#000;'></div>"), $(document.body).append(e._shadowLayer)), e._shadowLayer
        },show: function(e) {
            var t = this;
            return t._shadowLayer || t._init(), t._shadowLayer.css("opacity", e), t._shadowLayer.show(), t._shadowLayer.css("z-index")
        },hide: function() {
            var e = this;
            e._shadowLayer && e._shadowLayer.hide()
        }};
    return function(i) {
        function n() {
            return a._div || (a._div = $('<div style="display:none"></div>'), a._div.css(o.style), $(document.body).append(a._div), a._div.html(o.html), a._div.addClass(o.className)), a._div
        }
        function r() {
            function t(e) {
                27 == e.keyCode && ("close" == o.esc ? s.hide() : "destroy" == o.esc && s.destroy())
            }
            function i(i) {
                i ? e.on("keyup", t) : e.off("keyup", t)
            }
            n(), o.esc && (s.on("show", function() {
                i(!0)
            }), s.on("hide", function() {
                i(!0)
            }))
        }
        var o = {html: "",style: {position: "absolute",top: "center",left: "center"},className: "",shadow: .8,esc: !1};
        $.extend(o, i);
        var a = {_div: !1}, s = $({});
        return s.init = r, s.show = function(i) {
            a._div || r();
            var n = 100001;
            0 != o.shadow && o.shadow !== !1 && (n = t.show(o.shadow) - 0 + 1);
            var d = {left: "0px",top: "0px"};
            if (a._div.css("z-index", n), i) {
                if (i.left && (d.left = i.left), i.top && (d.top = i.top), "center" == d.left && (d.left = (e.width() - a._div.width()) / 2 + "px"), "center" == d.top) {
                    var c = "fixed" == a._div.css("position") ? 0 : e.scrollTop();
                    d.top = Math.max(c + (e.height() - a._div.height()) / 2, 0) + "px"
                }
                a._div.css(d)
            }
            a._div.show(), s.trigger("show")
        }, s.hide = function() {
            0 != o.shadow && o.shadow !== !1 && t.hide(), a._div.hide(), s.trigger("hide")
        }, s.getDOM = function() {
            return a._div || r(), a._div
        }, s.setHTML = function(e) {
            a._div || r(), a._div.html(e), s.trigger("setHTML")
        }, s.isShow = function() {
            return a._div ? "block" == a._div.css("display") : !1
        }, s.destroy = function() {
            s.trigger("destroy"), 0 != o.shadow && o.shadow !== !1 && t.hide(), a._div.undelegate(), a._div && a._div.remove()
        }, s
    }
}), define("user/verifyImg", function(require) {
    var e = require("common/layer/BaseLayer"), t = $.Trans, i = require("ui/validate/validateFormEle");
    return function(n) {
        var r = {url: "",verify: ""};
        $.extend(r, n), r.url = $.joinUrl(r.url, {random: (new Date).getTime()});
        var o = new e({html: '<p><input type="text" validate="notNull,length" validatedata="length=4" validatename="验证码" placeholder="请输入右侧图片内容"><img src="' + r.url + '"></p><button class="actValidate">提交</button><a href="#" class="actClose"></a>',style: {position: "fixed"},esc: "destroy",className: "verifyLayer"});
        o.show({left: "center",top: "center"});
        var a = o.getDOM();
        return a.find("input").focus(), a.delegate(".actClose", "click", function() {
            return o.trigger("cancel"), o.destroy(), !1
        }), a.delegate(".actValidate", "click", function() {
            var e = a.find("input");
            if (i(a.find("input"))) {
                var n = t({url: r.verify,method: "post"}), s = {verifyCode: e.val()};
                return n.request(s).done(function(t) {
                    t.success ? (o.trigger("success", s), o.destroy()) : (o.resetImg(), i.showError(e, "验证码输入错误"))
                }), !1
            }
        }), a.delegate("img", "click", function() {
            return o.resetImg(), !1
        }), o.resetImg = function() {
            a.find("img").attr("src", $.joinUrl(r.url, {random: (new Date).getTime()}))
        }, o
    }
}), define("user/UserForm", function(require) {
    var e = require("ui/validate/validateFormEle"), t = require("user/verifyImg"), i = $.Trans, n = function(e) {
        var t = this;
        t.$el = $(e), t.action = t.$el.attr("action"), t.method = t.$el.attr("method"), t.init()
    };
    return $.extend(n.prototype, {bindEvent: function() {
            function e(e) {
                for (var n in e) {
                    var r = e[n], o = n.split(" ");
                    i.delegate(o[1], o[0], $.proxy(t[r], t))
                }
            }
            var t = this;
            var i = t.$el.parent();
            t._events && $.extend(t.events, t._events), e(t.events)
        },init: function() {
            var e = this;
            e.bindEvent()
        },api: {checkExists: "/login/CheckExist",
        	sendVerifyCode: "/login/SendVerifyCode",verifyCode: "/login/GenerateVerifyCode",
        	checkVerifyCode: "/login/CheckVerifyCode",sendSMS: "/login/SendMobileVerifyCode",
        	checkMobileCode: "/login/CheckMobileVerifyCode"},
        events: {"blur input": "checkEl","blur .actCheckVerify": "checkTelVerify",
        	"click .actSubmit": "submit",
        	"keyup input": "autoSubmit",
        	"click .actDoSubmit":"actDoSubmit"
        },
        actDoSubmit:function(e){
    	 var i = this, n = i.validateForm();
    	 if(n){
    		 i.$el.submit();
    	 }
    	 return false
        },
        autoSubmit: function(e) {
            13 == e.keyCode && this.$el.find(".actSubmit").click()
        },checkVerifyImg: function(e, t) {
            var i = this;
            i.checkIsNeedVerify(e.val(), function(e) {
                if (e) {
                    var n = i.showVerifyImg();
                    n.on("success", function(e, i) {
                        t(!0, i)
                    }), n.on("cancel", function() {
                        t(!1)
                    })
                } else
                    t(!0)
            })
        },showVerifyImg: function() {
            var e = this, i = t({url: e.api.verifyCode,verify: e.api.checkVerifyCode});
            return i
        },sendSMS: function(t) {
            var i = this, n = i.$el.find(".phonecode");
            if (!n.hasClass("disable")) {
                var r = $(t.target);
                if (e(n)) {
                    r.addClass("disable");
                    var o = i.showVerifyImg();
                    o.on("success", function(e, t) {
                        i._sendSMS(n.val(), t && t.verifyCode)
                    }), o.on("cancel", function() {
                        r.removeClass("disable")
                    })
                }
                return !1
            }
        },sendVerifySMS: function(e) {
            this.sendSMS(e, !0)
        },checkIsNeedVerify: function(e, t) {
            var n = this, r = i({url: n.api.sendVerifyCode,method: "post",dataType: "json"});
            r.request({mobileNumber: e}).done(function(e) {
                t(e && null != e.data ? e.data : e)
            })
        },_sendSmsSuccess: function() {
            function e() {
                n--, 0 > n ? (i.html("重新发送验证码"), i.removeClass("disable")) : (i.html(n + 1 + "s后重新发送"), setTimeout(e, 1e3))
            }
            var t = this, i = t.$el.find(".send");
            i.addClass("disable");
            var n = 60;
            e()
        },_sendSmsFail: function() {
            var e = this, t = e.$el.find(".send");
            t.html("重新发送验证码"), t.removeClass("disable")
        },_sendSMS: function(t, n) {
            var r = this, o = r.$el.find(".send");
            o.addClass("disable");
            var a = i({url: r.api.sendSMS,method: "post",dataType: "json"}), s = {mobileNumber: t};
            n && (s.verifyCode = n), a.request(s).done(function(t) {
                t.success ? (e.hideError(r.$el.find(".phonecode")), r._sendSmsSuccess()) : (e.showError(r.$el.find(".phonecode"), "发送失败，请重试"), r._sendSmsFail())
            })
        },checkTelVerify: function(t) {
            var n = this, r = $(t.target);
            if (e(t.target)) {
                var o = i({url: n.api.checkMobileCode,method: "post"}), a = n.$el.find(".phonecode");
                o.request({mobileVerifyCode: r.val(),mobileNumber: a.val()}).done(function(t) {
                    t.success || e.showError(r, "验证码输入不正确")
                })
            }
        },checkEl: function(t) {
            e(t.target)
        },submit: function(e, t) {
            var i = this, n = i.validateForm();
            return n === !1 ? !1 : i.$el.find(".error").length ? (i.$el.find(".error").eq(0).find("input").focus(), !1) : (i.submitRequest(n).done(function(e) {
                if (e.success) {
                    t && t(!0, e);
                    var n = i.$el.find("#r").val();
                    n || (n = "http://www.lianjia.com"), location.href = n
                } else
                    t && t(!1, e)
            }).fail(function(e) {
                t && t(!1, e), i.trigger("submitFail", e)
            }), !1)
        },submitRequest: function(e) {
            var t = this, n = i({url: t.action,method: t.method,args: e});
            return n.request()
        },validateForm: function() {
            for (var t = this.$el.get(0).elements, i = {}, n = 0, r = t.length; r > n; n++) {
                var o = $(t[n]);
                if (!e(o))
                    return !1;
                var a = o.attr("type");
                if (!a || (a = a.toLowerCase(), "checkbox" != a && "radio" != a || o.get(0).checked)) {
                    var s = o.attr("name");
                    s && (i[s] = o.val())
                }
            }
            return i
        }}), n
})
