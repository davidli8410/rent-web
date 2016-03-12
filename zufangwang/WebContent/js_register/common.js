/*
duration:60ms

|common/common

|--common/jquery.scrollLoading

|--common/fixtop

|--common/utils

|--common/base

|--common/ajax

|--common/mapTranslate

|--common/fixed

|--common/pagination

|--common/backtop

|--common/login

|----common/env

|----xd/Trans

|------xd/crossRequest

|--------xd/Messenger

|--------xd/json2

|------common/env

|--common/scrollCaller

|----common/scrollCaller

|--common/statistic

|--common/env

|--common/env

*/
/*!
 * jquery.scrollLoading.js
 * by zhangxinxu  http://www.zhangxinxu.com
 * 2010-11-19 v1.0
 * 2012-01-13 v1.1 偏移值计算修改 position → offset
 * 2012-09-25 v1.2 增加滚动容器参数, 回调参数
*/
(function($) {

    $.fn.scrollLoading = function(options) {
        var defaults = {
            attr: 'data-url',
            container: $(window),
            callback: $.noop
        };
        var params = $.extend({}, defaults, options || {});
        params.cache = [];
        $(this).each(function() {
            var node = this.nodeName.toLowerCase(), url = $(this).attr(params['attr']);
            //重组
            var data = {
                obj: $(this),
                tag: node,
                url: url
            };
            params.cache.push(data);
        });
        
        var callback = function(call) {
            if ($.isFunction(params.callback)) {
                params.callback.call(call.get(0));
            }
        };
        //动态显示数据
        var loading = function() {
            var contop;
            
            var contHeight = params.container.height();
            if ($(window).get(0) === window) {
                contop = $(window).scrollTop();
            } else {
                contop = params.container.offset().top;
            }       
            
            $.each(params.cache, function(i, data) {
                var o = data.obj;
                var tag = data.tag;
                var url = data.url;

                if (o) {
                    var post = o.offset().top - contop;
                    var posb = post + o.height();
    
                    if ((post >= 0 && post < contHeight) || (posb > 0 && posb <= contHeight)) {
                        if (url) {
                            //在浏览器窗口内
                            if (tag === 'img') {
                                //图片，改变src
                                callback(o.attr('src', url));       
                            } else {
                                o.load(url, {}, function() {
                                    callback(o);
                                });
                            }       
                        } else {
                            // 无地址，直接触发回调
                            callback(o);
                        }
                        data.obj = null;    
                    }
                }
            }); 
        };
        
        //事件触发
        //加载完毕即执行
        loading();
        //滚动执行
        params.container.bind('scroll', loading);
    };

})(jQuery);
/*
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2013 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.9.3
 *
 */

(function($, window, document, undefined) {
    var $window = $(window);

    $.fn.lazyload = function(options) {
        var elements = this;
        var $container;
        var settings = {
            threshold       : 0,
            failure_limit   : 0,
            event           : "scroll",
            effect          : "show",
            container       : window,
            data_attribute  : "original",
            skip_invisible  : true,
            appear          : null,
            load            : null,
            placeholder     : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
        };

        function update() {
            var counter = 0;

            elements.each(function() {
                var $this = $(this);
                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }
                if ($.abovethetop(this, settings) ||
                    $.leftofbegin(this, settings)) {
                        /* Nothing. */
                } else if (!$.belowthefold(this, settings) &&
                    !$.rightoffold(this, settings)) {
                        $this.trigger("appear");
                        /* if we found an image we'll load, reset the counter */
                        counter = 0;
                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });

        }

        if(options) {
            /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit;
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed;
                delete options.effectspeed;
            }

            $.extend(settings, options);
        }

        /* Cache container as jQuery as object. */
        $container = (settings.container === undefined ||
                      settings.container === window) ? $window : $(settings.container);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
            $container.bind(settings.event, function() {
                return update();
            });
        }

        this.each(function() {
            var self = this;
            var $self = $(self);

            self.loaded = false;

            /* If no src attribute given use data:uri. */
            if ($self.attr("src") === undefined || $self.attr("src") === false) {
                if ($self.is("img")) {
                    $self.attr("src", settings.placeholder);
                }
            }

            /* When appear is triggered load original image. */
            $self.one("appear", function() {
                if (!this.loaded) {
                    if (settings.appear) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }
                    $("<img />")
                        .bind("load", function() {

                            var original = $self.attr("data-" + settings.data_attribute);
                            $self.hide();
                            if ($self.is("img")) {
                                $self.attr("src", original);
                            } else {
                                $self.css("background-image", "url('" + original + "')");
                            }
                            $self[settings.effect](settings.effect_speed);

                            self.loaded = true;

                            /* Remove image from array so it is not looped next time. */
                            var temp = $.grep(elements, function(element) {
                                return !element.loaded;
                            });
                            elements = $(temp);

                            if (settings.load) {
                                var elements_left = elements.length;
                                settings.load.call(self, elements_left, settings);
                            }
                        })
                        .attr("src", $self.attr("data-" + settings.data_attribute));
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.bind(settings.event, function() {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        $window.bind("resize", function() {
            update();
        });

        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        if ((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)) {
            $window.bind("pageshow", function(event) {
                if (event.originalEvent && event.originalEvent.persisted) {
                    elements.each(function() {
                        $(this).trigger("appear");
                    });
                }
            });
        }

        /* Force initial check if images should appear. */
        $(document).ready(function() {
            update();
        });

        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };

    $.rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };

    $.abovethetop = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };

    $.leftofbegin = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.inviewport = function(element, settings) {
         return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
                !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
     };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */

    $.extend($.expr[":"], {
        "below-the-fold" : function(a) { return $.belowthefold(a, {threshold : 0}); },
        "above-the-top"  : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-screen": function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-screen" : function(a) { return !$.rightoffold(a, {threshold : 0}); },
        "in-viewport"    : function(a) { return $.inviewport(a, {threshold : 0}); },
        /* Maintain BC for couple of versions. */
        "above-the-fold" : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-fold"  : function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-fold"   : function(a) { return !$.rightoffold(a, {threshold : 0}); }
    });

})(jQuery, window, document);
define("common/jquery.scrollLoading", function() {});

/**
 * @file 自动置顶插件
 */
(function( $ ) {

    $.fn.fixtop = function(options) {

        // Define default setting
        var settings = $.extend({
            marginTop: 0,
            zIndex: 1000,
            fixedWidth: '100%'
        }, options);

        var formTop = this.offset().top - settings.marginTop;
        var el = this;
        var missingHeight = el.height() + settings.marginTop;
        var blankArea = $('<div/>').css({
            'display' : el.css('display'),
            'width' : el.outerWidth(true),
            'height' : el.outerHeight(true),
            'float' : el.css('float')
        });

        $(window).scroll(function(e){ 
            //Set position of sub navogation
            var y = formTop;
            if ($(this).scrollTop() > y && el.css('position') != 'fixed'){ 
                el.after(blankArea);
                el.css({
                    'position': 'fixed', 
                    'top': settings.marginTop+'px',
                    'z-index': settings.zIndex, 
                    'width': settings.fixedWidth
                }); 
                if (settings.fixed !== undefined) {
                    settings.fixed(el);
                }
            } 

            if ($(this).scrollTop() < y && el.css('position') == 'fixed'){
                blankArea.remove();
                el.css({
                    'position': 'relative', 
                    'top': '0px',
                    'z-index': settings.zIndex 
                });
                
                if(settings.unfixed !== undefined){
                    settings.unfixed(el);
                }
            }
        });

    
        // Return jQuery so that it's chainable 
        return this;        
    };
 
}( jQuery )); 
define("common/fixtop", function() {});
$.stringFormat = function (source, opts) {
    source = String(source);
    var data = Array.prototype.slice.call(arguments, 1);
    var toString = Object.prototype.toString;

    if ( data.length ) {
        data = data.length == 1 ? 

            /* ie 下 Object.prototype.toString.call(null) == '[object Object]' */
            (opts !== null && (/\[object Array\]|\[object Object\]/.test(toString.call(opts))) ? opts : data) 
            : data;
        return source.replace(/#\{(.+?)\}/g, function (match, key){
            var replacer = data[key];

            // chrome 下 typeof /a/ == 'function'
            if('[object Function]' == toString.call(replacer)){
                replacer = replacer(key);
            }
            return ('undefined' == typeof replacer ? '' : replacer);
        });
    }
    return source;
};
$.trimN = function(str){
  return str.replace(/\n{2,}/mg,"\n")
}
$.fixedOldComment = function(str){
  // 所有html 换成\n
  if(!str){
    return str;
  }
  return $.decodeHTML($.trimN(str.replace(/<[^>]+>/g,"\n")));
  
}
$.replaceTpl = function (tpl, data, label) {
    var t = String(tpl),
        s = label || /#\{([^}]*)\}/mg,
        trim = String.trim ||
            function (str) {
                return str.replace(/^\s+|\s+$/g, '')
            };
    return t.replace(s, function (value, name) {
        //从模板获取name,容错处理
        return value = data[trim(name)];
    });
};

$.strHTML = function (source, opts) {
    source = String(source);
    var data = Array.prototype.slice.call(arguments, 1);
    var toString = Object.prototype.toString;

    if ( data.length ) {
        data = data.length == 1 ? 

            /* ie 下 Object.prototype.toString.call(null) == '[object Object]' */
            (opts !== null && (/\[object Array\]|\[object Object\]/.test(toString.call(opts))) ? opts : data) 
            : data;
        return source.replace(/#\{(.+?)\}/g, function (match, key){
            var replacer = data[key];

            // chrome 下 typeof /a/ == 'function'
            if('[object Function]' == toString.call(replacer)){
                replacer = replacer(key);
            }
            return ('undefined' == typeof replacer ? '' : $.encodeHTML(replacer));
        });
    }
    return source;
};

$.showIframeImg = function (parent, url) {
    var stylesTpl = '' 
        + '<style>' 
        + 'body{margin:0;padding:0}img{width:#{0}px;height:#{1}px;}'
        + '</style>';
    
    var item = $(parent);
    var height = item.height();
    var width = item.width();
    var styles = $.stringFormat(stylesTpl, width, height);

    var frameid = 'frameimg' + Math.round(Math.random() * 1000000000); 
    window.betafang[frameid] = ''
        + '<head>' + styles + '</head>'
        + '<body><img id="img-' + frameid + '" src=\'' + url + '\' />' 
        + '</body>'; 
    parent.append(''
        + '<iframe style="display:none" id="' + frameid + '" src="javascript:parent.betafang[\'' + frameid + '\'];"' 
        + ' frameBorder="0" scrolling="no" width="' + width + '" height="' + height + '"></iframe>'
    );
    
};

/**
 * 异步加载script jquery是采用jsonp方式，不采用
 * 
 */
$.loadScript = function(option){
  var opt = {
    url:"",
    charset:"utf-8",
    complete:$.noop,
    fail:$.noop
  }
  $.extend(opt,option);
  
  if(!opt.url){
    throw "url is requireed"
  }
  var isloaded = false;
  var script = document.createElement("script"),
      head = document.getElementsByTagName("head")[0],
      result = $.Deferred();
  
  function success(){
    if(isloaded){
      return false;
    }
    isloaded = true;
    script.onload = null;
    script.onerror = null;
    
    opt.complete && opt.complete();
    result.resolve();
    head.removeChild(script);
  }
  function fail(){
    if(isloaded){
      return false;
    }
    isloaded = true;
    
    opt.fail && opt.fail();
    head.removeChild(script);
    result.reject();
  }
  script.onload = success;
  script.onerror = fail;
  script.onreadystatechange = function(state){
    if(script.readyState == "complete"){
      success();
    }
  }
  
  
  script.type="text/javascript";
  script.src = opt.url;
  script.charset=opt.charset;
  
  head.appendChild(script);
  
  return result;
}

$.TextAreaUtil = (function(win){
  var ds = document.selection;
  var util = {
    getCursorPosition : function(element) {
      var result = 0;
      
      //处理兼容
      if (ds) {
        //ie
        element.focus();
        try{
           var range = null;
          range = ds.createRange();
          var g = range.duplicate();
          g.moveToElementText(element);
          g.setEndPoint("EndToEnd", range);
          
          element.selectionStartIE = g.text.length - range.text.length;
          element.selectionEndIE = element.selectionEndIE + range.text.length;
          result = element.selectionStartIE;
        }catch(e){
          result = element.value.length;
        }
      } else {
        //ff-chrome-opera
        //加层判断
        if (element.selectionStart || element.selectionStart == "0") {
          //ff和opera多是element.value.length
          //chrome
          result = element.selectionStart;
        }
      }
      return result;
    },
    getSelectedText : function(element) {
      var result = "";
      var find = function(el) {
        if (el.selectionStart != undefined && el.selectionEnd != undefined) {
          return el.value.slice(el.selectionStart, el.selectionEnd);
        } else {
          return "";
        }
      }
      if (win.getSelection) {
        //ff-chrome-opera
        result = find(element);
      } else {
        //ie
        result = document.selection.createRange().text;
      }
      return result;
    }
  }
  return util;
})(window);

/**
 * IE浏览器判断函数
 */
$.browser = $.browser || {};
$.browser.ie = /msie (\d+\.\d+)/i.test(navigator.userAgent) 
    ? (document.documentMode || + RegExp['\x241']) 
    : undefined;

var betafang = window.betafang || {};



$(function () {
    /****************
    //页面PV统计
    //默认发送,参数配置
    ******************/
    
    var onlyCity = $("#only").attr("data-city");
    var onlyPage = $("#only").attr("data-page");
    var LS = window.localStorage;

    function getcookie(objname){
        var arrstr = document.cookie.split("; ");
        for(var i = 0;i < arrstr.length;i ++){
            var temp = arrstr[i].split("=");
            if(temp[0] == objname) return unescape(temp[1]);
        }
    }
    
    if(LS && typeof LS.unicID=='undefined'){
        var id="lianjia_"+Math.random().toString().substring(2);
        LS.unicID = id;
    }
    
    LS && (window.conf={UT:{params:{page:onlyPage,city:onlyCity,id:LS.unicID,type:"load",lianjia_uuid:getcookie("lianjia_uuid")}}});
    
    UT.send();

    //添加全量统计代码

    $("a").on("click" , function(){
        function getMod(id){
            var tmp = $(id).parents();

            for(var i=0;i<tmp.length;i++){
               if(typeof tmp.eq(i).attr("mod-id") != "undefined"){
                   return tmp.eq(i).attr("mod-id");
               }
            }
        };
        
        UT.send({
            "type":"click",
            "ac":"a",
            "mod-id":getMod($(this)),
            "position":$(this).text()
        });
        
    });
    /**************
    统计结束
    ***************/

    if (/msie (\d+\.\d+)/i.test(navigator.userAgent)) {
        $('body').addClass('ie', 'ie' + (document.documentMode || + RegExp['\x241']));
    }

    $(".lj-lazy").lazyload();
    
    $('.lazyload').scrollLoading();

    
    /*$('.iframe-img').each(function () {
        var img = $(this);
        var parent = img.parent();
        var url = img.attr('data-url') || img.attr('src');
        $.showIframeImg(parent, url);

        img.remove();
        parent.children('iframe').show();
    });*/


    // search form submit
    var keywordBox = $('#keyword-box,#keyword-box-01');
    
    keywordBox.closest('form').on('submit', function () {
        var form = $(this);
        var url = form.attr('action');
        var keywordBox = form.find(".txt");
        
        var val = $.trim(keywordBox.val());
        if(val == keywordBox.attr("placeholder")){
          val = "";
        }
        
        url += encodeURIComponent(val);

        window.location.href = url;

        return false;
    });
    
});
define("common/base", function() {});

/**
 * @file  通用ajax模块
 */

var ajax = (function () {

    var exports = {};

    var _blankFn = function () {};
    
    /**
     * GET方法
     * 
     * @param {string} url 
     * @param {Function} callback 
     */
    exports.get = function (url, param, success, failure) {
        success = success || _blankFn;
        failure = failure || _blankFn;

        if (!url) {
            return false;
        }

        $.getJSON(url, param, function (response) {
            if (response.status === 0) {
                success(response.data);
            }
            else {
                failure(response);
            }
        }, function (response) {
            var resp = {
                status: 500,
                statusInfo: '服务请求失败'
            };
            failure(resp);
        });
    };

    exports.post = function (url, param, success, failure) {
        success = success || _blankFn;
        failure = failure || _blankFn;
        
        if (!url) {
            return false;
        }
        
        $.ajax({
            type: 'POST',
            url: url,
            data: param,
            success: function (response) {
                if (response.status === 0) {
                    success(response.data);
                }
                else {
                    failure(response);
                }
            },
            failure: function (response) {
                var resp = {
                    status: 500,
                    statusInfo: '服务请求失败'
                };
                failure(resp);
            },
            dataType: 'json'
        });
    };

    return exports;

})();
define("common/ajax", function() {});

/**
 * @file 谷歌地图转换百度地图JS模块
 */
(function () {  

    var transUrl = 'http://api.map.baidu.com/ag/coord/convert';

    function loadScript(xyUrl, callback) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = xyUrl;

        callback = callback || function () {};

        //借鉴了jQuery的script跨域方法
        script.onload = script.onreadystatechange = function () {
            if((!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')){
                callback();
                // Handle memory leak in IE
                script.onload = script.onreadystatechange = null;
                if ( head && script.parentNode) {
                    head.removeChild( script );
                }
            }
        };
        // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
        head.insertBefore( script, head.firstChild );
    }

    function translate(point, type, callback) {
        var callbackName = 'cbk_' + Math.round(Math.random() * 10000);    //随机函数名
        var xyUrl = transUrl + '?from='+ type 
            + '&to=4&x=' + point.lng + '&y=' + point.lat 
            + '&callback=BMap.Convertor.' + callbackName;

        callback = callback || function () {};
        
        //动态创建script标签
        loadScript(xyUrl);
        BMap.Convertor[callbackName] = function (xyResult) {
            delete BMap.Convertor[callbackName];    //调用完需要删除改函数
            var point = new BMap.Point(xyResult.x, xyResult.y);
            callback(point);
        };
    }

    function translateMore(points, type, callback) {
        var xyUrl = transUrl + '?from=' + type + '&to=4&mode=1';
        var xs = [];
        var ys = [];
        var maxCnt = 20; //每次发送的最大个数

        callback = callback || function () {};

        var send = function () {
            var callbackName = 'cbk_' + Math.round(Math.random() * 10000);    //随机函数名
            var url = xyUrl + '&x=' + xs.join(',') + '&y=' + ys.join(',') + '&callback=BMap.Convertor.' + callbackName;
            
            //动态创建script标签
            loadScript(url);
            xs = [];
            ys = [];

            BMap.Convertor[callbackName] = function (xyResults) {
                delete BMap.Convertor[callbackName];    //调用完需要删除改函数

                var xyResult = null;
                var points = [];

                for (var index in xyResults) {
                    xyResult = xyResults[index];

                    if (xyResult.error !== 0) {

                        //出错就直接返回;
                        points[index] = null;
                        continue;
                    }

                    var point = new BMap.Point(xyResult.x, xyResult.y);
                    points[index] = point;
                }

                callback(points);
            };
        };

        for (var index in points) {
            if(index % maxCnt === 0 && index !== 0){
                send();
            }

            xs.push(points[index].lng);
            ys.push(points[index].lat);
            if(index == points.length - 1){
                send();
            }
        }
        
    }

    window.BMap = window.BMap || {};
    BMap.Convertor = $({});
    BMap.Convertor.translate = translate;
    BMap.Convertor.translateMore = translateMore;
})();
/**
 * fixed hack
 * 
 * js hack
 * 1.支持placeholder
 */

;
var LJFixed = (function($,DOC){
	var hack = {
		isSupportPlaceHolder:('placeholder' in DOC.createElement('input')) 
	};
	
	
	// 1.placeholder
	function fixedPlaceHolder(dom){
		if(hack.isSupportPlaceHolder){
			return;
		}
		var that = $(dom),    
		  text= that.attr('placeholder');    
		if(that.val()===""){    
			that.val(text).addClass('placeholder');    
		}
		that.focus(function(){    
			if(that.val()===text){    
		      that.val("").removeClass('placeholder');    
		    }    
		})
		.blur(function(){    
		  if(that.val()===""){    
			  that.val(text).addClass('placeholder');    
		  }    
		})
		.closest('form').submit(function(){    
			if(that.val() === text){    
		 		that.val('');    
		    }    
		});
	}
	
	function init(){
		// 页面定义
    $('input[placeholder],textarea[placeholder]').each(function() {
      var dom = $(this);
      if(dom.attr("type") != "password"){
        fixedPlaceHolder(this);
      }
    });
	}
	
	$(function(){
		init();
	});
	
	var exports = {};
	exports.fixedPlaceHolder = fixedPlaceHolder;
	
	return exports;
})($,document);
define("common/fixed", function() {});
/**
 * 分页
 * 1.查找dom，填充dom分页
 * 2.添加分页事件。分页事件默认处理为：
 *  1）跳转页面
 *  2）根据数据分页填充dom
 *  3）callback
 * @author dongyajie
 */
;var Pagination = (function(require) {
  
  /**
   * 计算分页显示数据
   * @param  {[int]} totalPage
   * @param  {[int]} curPage default:1
   * @return {[type]} [1,'',2,3,4,'',123];
   */
  function pagelist(totalPage, curPage,showPage) {
    var rs = [];
    showPage  = showPage ||6;
    curPage = curPage ||1;
    if(totalPage <= showPage){
      for(var i = 0 ; i < totalPage;i++){
        rs.push(i+1);
      }
    }else{
      rs.push(1);

      if(curPage >4){
        rs.push('');
      }
      var startPage = Math.max(curPage-2,2),
          endPage = Math.min(curPage+2,totalPage-1);

      for(var i = startPage;i<=endPage;i++){
        rs.push(i);
      }
      if(curPage < totalPage-3){
        rs.push('');
      }
      
      rs.push(totalPage);
      
    }

    return rs;
  }

  /**
   * 获得分页html
   */
  function getPageHtml(pageList,totalPage,curPage,template) {
    
    function getLink(page){
      if(template){
        return template.replace(/\{page\}/g,page);
      }
      return 'javascript:;';
    }

    var rs = [];
    curPage = curPage || 1;


    if(pageList && pageList.length){
      if(curPage > 1 && totalPage >6){
        rs.push('<a href="'+getLink(curPage-1)+'" data-page="'+(curPage-1)+'" >上一页</a>');
      }
      var length = pageList.length;
      for(var i = 0 ; i < length;i++){

        rs.push(pageList[i]?('<a '+(pageList[i]==curPage?'class="on"':'')+' href="'+getLink(pageList[i])+'" data-page="'+pageList[i]+'">'+pageList[i]+'</a>'):'<span>...</span>')
      }

      if(curPage < totalPage && totalPage >6){
        rs.push('<a href="'+getLink(curPage+1)+'" data-page="'+(curPage+1)+'">下一页</a>');
      }
    }
    return rs.join("");
  }
  
  function parsePage(dom){
    if(!dom){
      return;
    }
    var _this = {
      dom:$(dom),
      // 连接模板
      template:'',
      targetWrapper:'',

      // page-data {totalPage:10,curPage:1}
      totalPage:0,
      curPage:0
    };
    var that = $({});

    function init(){
      initData();
      bindEvent();
      bindListener();

      initDOM();
    }
    function initData(){ 

      _this.template = _this.dom.attr("page-url");
      var targetWrapper = _this.dom.attr("target-wrapper");
      if(targetWrapper){
        _this.targetWrapper = $(targetWrapper);
      }
      

      var data = _this.dom.attr("page-data");
      if(data){
        data = $.parseJSON(data);
        $.extend(_this,data);
      }else if(_this.targetWrapper){
        _this.curPage = 1;
        _this.totalPage = _this.targetWrapper.children().length;
      }
    }
    function initDOM(){
      var list = pagelist(_this.totalPage,_this.curPage);
      if(!list.length){
        _this.dom.hide();
      }
      var html = getPageHtml(list,_this.totalPage,_this.curPage,_this.template);
      _this.dom.html(html);

      if(_this.targetWrapper){
        var childs =  _this.targetWrapper.children()
        childs.hide();
        childs.eq(_this.curPage-1).show();
        _this.targetWrapper.find(".lj-lazy").lazyload();
      }
      
    }
    function bindListener(){
      if(_this.targetWrapper){
          that.on("showPage",function(e,page){
            _this.curPage = page;
            initDOM();
          })
      }
    }
    function bindEvent(){
      _this.dom.delegate('[data-page]',"click",function(){
        var p = $(this).attr("data-page");
        that.trigger("showPage",parseInt(p))
      })

    }

    init();
    return that;
  }

  $(function(){
    var compPage = $("[comp-module='page']");
    compPage.each(function(){
      parsePage($(this))
    })
  })

  return parsePage;
})(); 
define("common/pagination", function() {});

function b(){
	h = $(window).height();
	t = $(document).scrollTop();
	if(t > h){
		$('#gotop').show();
	}else{
		$('#gotop').hide();
	}
}
$(document).ready(function(e) {
	b();
	$('#gotop').click(function(){
		$('html , body').animate({scrollTop: 0},1000);	
	});
});
$(window).scroll(function(e){
	b();		
});
define("common/backtop", function() {});
/**
 * 当前环境
 * 
 */
define("common/env", function(require) {
    var _this = {
        host: "",
        scheme: "",
        port: "",
        env: "online"
    };
    function init() {
        var url = $.parseURL(location.href);
        _this.host = url.host;
        _this.scheme = url.scheme;
        _this.port = url.port;
        var childDomainName = _this.host.substring(0, _this.host.indexOf("."));
        if (childDomainName.indexOf("dev") === 0) {
            _this.env = "dev";
        } else if (childDomainName.indexOf("test") === 0) {
            _this.env = "test";
        }
    }
    function joinUrl(obj) {
        var str = "";
        if (obj.scheme) {
            str += obj.scheme + "://";
        }
        if (obj.host) {
            str += obj.host;
        }
        if (obj.port) {
            str += ":" + obj.port;
        }
        if (obj.path) {
            str += "/" + obj.path;
        }
        if (obj.query) {
            str += "?" + obj.query;
        }
        if (obj.hash) {
            str += "#" + obj.hash;
        }
        return str;
    }
    var env = {};
    env.getEnv = function() {
        return _this.env;
    };
    env.fixedHost = function(host) {
        if (!host) {
            return _this.host;
        }
        var childDomain = host.substring(0, host.indexOf("."));
        switch (_this.env) {
          case "dev":
          case "test":
            if (childDomain.indexOf(_this.env) !== 0) {
                return _this.env + host;
            }
            break;

          case "online":
            break;
        }
        return host;
    };
    env.fixedUrl = function(url) {
        var obj = $.parseURL(url);
        if (!obj.host) {
            obj.host = _this.host;
            obj.scheme = _this.scheme;
            obj.port = _this.port;
        } else {
            obj.host = env.fixedHost(obj.host);
            obj.port = _this.port;
            if (!obj.scheme) {
                obj.scheme = _this.scheme;
            }
        }
        return joinUrl(obj);
    };
    env.isSameDomain = function(url) {
        var obj = $.parseURL(url);
        return obj.host == _this.host;
    };
    init();
    return env;
})

/**
 *     __  ___
 *    /  |/  /___   _____ _____ ___   ____   ____ _ ___   _____
 *   / /|_/ // _ \ / ___// ___// _ \ / __ \ / __ `// _ \ / ___/
 *  / /  / //  __/(__  )(__  )/  __// / / // /_/ //  __// /
 * /_/  /_/ \___//____//____/ \___//_/ /_/ \__, / \___//_/
 *                                        /____/
 *
 * @description MessengerJS, a common cross-document communicate solution.
 * @author biqing kwok
 * @version 2.0
 * @license release under MIT license
 */

window.Messenger = (function(){
    // 消息前缀, 建议使用自己的项目名, 避免多项目之间的冲突
    // !注意 消息前缀应使用字符串类型
    var prefix = "[LIANJIA_CROSS]",
        supportPostMessage = 'postMessage' in window;

    // Target 类, 消息对象
    function Target(target, name){
        var errMsg = '';
        if(arguments.length < 2){
            errMsg = 'target error - target and name are both requied';
        } else if (typeof target != 'object'){
            errMsg = 'target error - target itself must be window object';
        } else if (typeof name != 'string'){
            errMsg = 'target error - target name must be string type';
        }
        if(errMsg){
            throw new Error(errMsg);
        }
        this.target = target;
        this.name = name;
    }

    // 往 target 发送消息, 出于安全考虑, 发送消息会带上前缀
    if ( supportPostMessage ){
        // IE8+ 以及现代浏览器支持
        Target.prototype.send = function(msg){
            this.target.postMessage(prefix + msg, '*');
        };
    } else {
        // 兼容IE 6/7
        Target.prototype.send = function(msg){
            var targetFunc = window.navigator[prefix + this.name];
            if ( typeof targetFunc == 'function' ) {
                targetFunc(prefix + msg, window);
            } else {
                throw new Error("target callback function is not defined");
            }
        };
    }

    // 信使类
    // 创建Messenger实例时指定, 必须指定Messenger的名字, (可选)指定项目名, 以避免Mashup类应用中的冲突
    // !注意: 父子页面中projectName必须保持一致, 否则无法匹配
    function Messenger(messengerName, projectName){
        this.targets = {};
        this.name = messengerName;
        this.listenFunc = [];
        prefix = projectName || prefix;
        if(typeof prefix !== 'string') {
            prefix = prefix.toString();
        }
        this.initListen();
    }

    // 添加一个消息对象
    Messenger.prototype.addTarget = function(target, name){
        var targetObj = new Target(target, name);
        this.targets[name] = targetObj;
    };

    // 初始化消息监听
    Messenger.prototype.initListen = function(){
        var self = this;
        var generalCallback = function(msg){
            if(typeof msg == 'object' && msg.data){
                msg = msg.data;
            }
            // 剥离消息前缀
            msg = msg.slice(prefix.length);
            for(var i = 0; i < self.listenFunc.length; i++){
                self.listenFunc[i](msg);
            }
        };

        if ( supportPostMessage ){
            if ( 'addEventListener' in document ) {
                window.addEventListener('message', generalCallback, false);
            } else if ( 'attachEvent' in document ) {
                window.attachEvent('onmessage', generalCallback);
            }
        } else {
            // 兼容IE 6/7
            window.navigator[prefix + this.name] = generalCallback;
        }
    };

    // 监听消息
    Messenger.prototype.listen = function(callback){
        this.listenFunc.push(callback);
    };
    // 注销监听
    Messenger.prototype.clear = function(){
        this.listenFunc = [];
    };
    // 广播消息
    Messenger.prototype.send = function(msg){
        var targets = this.targets,
            target;
        for(target in targets){
            if(targets.hasOwnProperty(target)){
                targets[target].send(msg);
            }
        }
    };

    return Messenger;
})();

/*
    json2.js
    2014-02-04
    Public Domain.
    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
    See http://www.JSON.org/js.html
    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html
    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
    This file creates a global JSON object containing two methods: stringify
    and parse.
        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.
            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.
            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.
            This method produces a JSON text from a JavaScript value.
            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value
            For example, this would serialize Dates as ISO strings.
                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }
                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };
            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.
            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.
            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.
            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.
            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.
            Example:
            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'
            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'
            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'
        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.
            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.
            Example:
            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.
            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });
            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });
    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function () {
                return this.valueOf();
            };
    }

    var cx,
        escapable,
        gap,
        indent,
        meta,
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        };
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

/**
 * 跨域请求
 * 
 */
/*
require("xd/Messenger");
require("xd/json2");
 */
define("xd/crossRequest", function(require) {
    var globalMessanger = new Messenger("LIANJIA_CROSS_MESSAGE", "LIANJIA-CROSS");
    globalMessanger.listen(function(msg) {
        msg = JSON.parse(msg);
        var name = msg.name;
        if (globalMessanger.targets[name]) {
            if (msg.type == "state") {
                globalMessanger.targets[name].readyState = "ready";
                globalMessanger.targets[name].dealReady();
            } else {
                globalMessanger.targets[name].deal(msg.data, msg.success);
            }
        }
    });
    var PageMessage = {};
    var Message = function(domain, name) {
        var _this = this;
        _this.domain = domain;
        name = name || $.parseURL(domain).host.replace(/\./g, "-");
        _this.name = name;
        _this.init();
    };
    function buildIframe(name, src) {
        var iframe = document.createElement("iframe");
        iframe.id = name;
        iframe.name = name;
        iframe.src = src;
        iframe.style.cssText = "display:none;width:0px;height:0px;";
        iframe.width = 0;
        iframe.height = 0;
        iframe.title = "empty";
        document.body.appendChild(iframe);
        return iframe;
    }
    $.extend(Message.prototype, {
        init: function() {
            var _this = this;
            var iframeUrl = _this.domain + "/xd/api/?name=" + _this.name;
            var iframe = buildIframe(_this.name, iframeUrl);
            _this.iframe = iframe.contentWindow;
            globalMessanger.addTarget(_this.iframe, _this.name);
            _this.reqArray = [];
            globalMessanger.targets[_this.name].deal = function(msg, success) {
                globalMessanger.targets[_this.name].isRequest = false;
                var request = _this.reqArray.shift(), msgData = false;
                try {
                    msgData = msg;
                } catch (e) {}
                success ? request.defer.resolve(msgData) : request.defer.reject(msgData);
                _this.next();
            };
            globalMessanger.targets[_this.name].dealReady = function() {
                _this.next();
            };
        },
        next: function() {
            var _this = this;
            if (!globalMessanger.targets[_this.name].readyState) {
                return;
            }
            if (_this.reqArray.length && !globalMessanger.targets[_this.name].isRequest) {
                globalMessanger.targets[_this.name].isRequest = true;
                var request = _this.reqArray[0];
                var cmd = {
                    type: "request",
                    data: request.request
                };
                var str = JSON.stringify(cmd);
                globalMessanger.targets[_this.name].send(str);
            }
        },
        request: function(args) {
            var _this = this;
            var defer = $.Deferred();
            _this.reqArray.push({
                defer: defer,
                request: args
            });
            _this.next();
            return defer;
        }
    });
    return function(domain, name) {
        if (PageMessage[domain]) {
            return PageMessage[domain];
        }
        return PageMessage[domain] = new Message(domain, name);
    };
})

/**
 * 跨域请求调用方
 *
 * 实现方式
 * 1.判断是否支持ajax2. 如果支持，直接调用返回
 * 2.如果不支持ajax2.采用messagerjs方式，首先加载跨域域名下 /service/api
 * 3./service/api 的文件与lianjia-login/views/service/api 一致，直接复制即可
 */
define("xd/Trans", function(require) {
    var Model = $.EventEmitter, crossRequest = require("xd/crossRequest");
    var env = require("common/env");
    var isSupport = false;
    var Cors = Model.extend({
        initialize: function(option) {
            var opt = {
                url: "",
                type: "get",
                dataType: "json",
                args: {}
            };
            $.extend(opt, option);
            opt.url = env.fixedUrl(opt.url);
            opt.method = opt.type;
            var _this = this;
            _this.opt = opt;
            if (!isSupport) {
                var host = env.fixedUrl($.parseURL(opt.url).host);
                if (!env.isSameDomain(host)) {
                    _this.crossRequest = crossRequest(host);
                } else {
                    _this.isSame = true;
                }
            }
        },
        request: function(args) {
            var _this = this;
            var opt = _this.opt;
            $.extend(opt.args, args);
            opt.data = opt.args;
            if (isSupport || _this.isSame) {
                return $.ajax(opt);
            } else {
                return this.crossRequest.request(opt);
            }
        }
    });
    return Cors;
})

/**
 * 监听win事件滚动，降隔100ms执行，做到scroll事件稀释
 * 
 * 
 * @example
 * var scrollCaller = require("common/scrollCaller");
 * 
 * var caller = scrollCaller(function(top){
 *   
 * });
 * caller.destroy();
 * 
 */
define("common/scrollCaller", function(require) {
    var timer = false, win = $(window);
    var callbacks = [];
    function calllbackCaller() {
        var st = win.scrollTop();
        for (var len = callbacks.length - 1; len >= 0; len--) {
            try {
                callbacks[len].call(win, st);
            } catch (e) {
                console.error && console.error(e.stack);
            }
        }
    }
    function winListener() {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function() {
            calllbackCaller();
        }, 30);
    }
    function eventListener(add) {
        if (add) {
            win.scroll(winListener);
        } else {
            win.unbind("scroll", winListener);
        }
    }
    function addCall(fun) {
        if (!callbacks.length) {
            eventListener(true);
        }
        callbacks.push(fun);
    }
    function removeCall(fun) {
        var index = $.inArray(fun, callbacks);
        if (index >= 0) {
            callbacks.splice(index, 1);
        }
        if (!callbacks.length) {
            eventListener(false);
        }
    }
    return function(fun) {
        if (!fun) {
            throw "fun is required";
        }
        addCall(fun);
        return {
            destroy: function() {
                removeCall(fun);
            }
        };
    };
})

/**
 * @file 数据统计相关的模块
 */

var UT = {
//  params: {type:'click'},             //全局固定发送参数(level,page,country,type='click')
    url: "http://cdn.lianjia.com/pc/asset/img/new-version/gut.gif",    //日志接收地址
//  /**
//   * 初始化全局的配置信息
//   * @param params
//   * @param conf
//   */
//  init: function(params, conf){ 
//      var uf;
//      if (params) {
//          for (var p in params) {
//              params[p] !== uf && (this.params[p] = params[p])
//          }
//      }
//      this.url = conf && conf.url || this.url;
//  },
    /**
     * 用于发送统计参数。升级支持了，允许自定义发送地址和覆盖原有的固定参数
     * <code>
     *    UT.send({type:'click', position: 'banner'});
     * </code>
     * @param data
     * @param config  可以覆盖url/params
     * @config url 发送地址
     * @config params 用于替代原已设置的，固定参数
     */
    send: function (data, config) {
        data = data || {};
        if(!window.conf){
          return;
        }
        var utConf = window.conf.UT;
        var logURL = config && config.url || this.url,
            params = config && config.params || utConf.params,
            timeStamp = data.r = +new Date(),
            win = window,
            enc = encodeURIComponent,
            img = win["UT" + timeStamp] = new Image(),
            j, h = [];
        if (params) {
            for (var d in params) {
                if(params[d] !== j && data[d] === j) {  //params是默认参数，不要覆盖data
                    data[d] = params[d];
                }
            }
        }
        
        for (j in data) {
            h.push(enc(j) + "=" + enc(data[j]))
        }
        img.onload = img.onerror = function () {
            win["UT" + timeStamp] = null
        };
       // img.src = logURL + "?" + h.join("&");
        img = h = null;
    },
    /**
     * 试图获取Log的特定参数
     *  对于模块：<div class="mod-XXX" log-mod="modXX" log-index="?">
     * @param element
     * @param attrList
     */
    attr: function (element, attrList) {
        var modId = element.getAttribute("log-mod");
        //试图找modId，同时获得它的index值
        if (!modId) { //如果没有，向父级找
            if (element.parentNode && element.parentNode.tagName.toUpperCase() != 'BODY') {
                this.attr(element.parentNode, attrList);
            }
        } else {    //如果找到了，就到此为止了
            var modIndex = element.getAttribute("log-index");
            if (modIndex) {
                attrList.modIndex = modIndex;
            }
            attrList.modId = modId;
        }
    },
    /**
     *    1. 获取链接的url,log-index(链接索引) eg: <a href="#" log-index="?" data-sort="typeXX" data-val="valueYY">
     *    2. 获取父元素的属性: log-mod,log-index(模块索引); 取到BODY以内
     * @param link
     * @return {Object} attr参数表
     */
    link: function (link) {     
        var attrList = {},
            url = link.getAttribute("href",2);
        if (url) {
            //非正常链接与正常链接发送不同的一组参数
            if(/^(javascript|#)/.test(url)){
                attrList['ac'] = "b";
                attrList['url'] = "none";
            }else{
                attrList['ac'] = "a";
                attrList['url'] = url;
            }
        }
        var linkIndex = link.getAttribute('log-index');
        if (linkIndex) {
            attrList['linkIndex'] = linkIndex;
        }
        var sort = link.getAttribute('data-sort') || '';
        if (sort) {
            attrList['sort'] = sort;
            attrList['value'] = link.getAttribute('data-val') || '';
        }
        var offerId = link.getAttribute('log-oid');
        if(offerId){
            attrList['offerid'] = offerId;
        }
        this.attr(link, attrList);
        return attrList;
    }
};
/**
 'src/common/jquery.scrollLoading.js',
  'src/common/fixtop.js',
  'src/common/base.js',
  'src/common/ajax.js',
  'src/common/mapTranslate.js',
  'src/common/fixed.js',
  'src/common/pagination.js',
  'src/common/backtop.js',
  'src/common/login.js'
 */
/*
不要删

require("common/jquery.scrollLoading");
require("common/fixtop");
require("common/utils");
require("common/base");
require("common/ajax");
require("common/mapTranslate");
require("common/fixed");
require("common/fixtop");
require("common/pagination");
require("common/backtop");
require("common/scrollCaller");
require("common/statistic");
require("common/env");
 */
;(function(){
  // 全局事件
  // 页面全局事件
  $.listener = new $.EventEmitter(true);
  $.env = require("common/env");
  
  
})();