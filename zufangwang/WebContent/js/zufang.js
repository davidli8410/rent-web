$(function() {//页面加载完之后自动执行函数 
		var pageNum = 1;

		loadImages();
		blockImages();

		//按钮绑定事件
		$("#getImgBtn").click(function() {
			//alert("taibanl");
			loadImages();
		});

		//回到顶部事件,500毫秒内回到顶部
		$("#gotop").click(function() {
			$("body,html").animate({
				scrollTop : 0
			}, '500');
		});

		//流式布局，numOfCol-->定义列数
		function blockImages() {
			$("#container").BlocksIt({
				numOfCol : 3
			});
		}

		//给下拉列表绑定一个change事件
		$("#category").change(function() {
			// 清空
			$("#container").html('');
			pageNum = 1;
		});

		//获取图片
		function loadImages() {
			var category = "fresh";
			//var category = $("#category").val();
			//alert($("#category").val());
			//alert(pageNum);
			$
					.ajax({
						//请求后台
						url : 'data.jsp',
						type : 'post',
						data : {
							pageNum : pageNum,
							category : category
						},
						dataType : "Json",
						//请求成功之后
						success : function(data) {
							//动态把图片加载
							for (var i = 0; i < data.length; i++) {
								var img = '';
								img += "<div class='grid'><div class='imgholder'> <img class='lazy' ";
								img+="src='images/pixel.gif' data-original=' ";
								img+=data[i].oriUrl;					
								img+="' width='500' /></div> <strong>";
								img += data[i].title;
								img += "</strong> <div class='meta'> <a href=' ";
								img+=data[i].oriUrl;
								img+="' class='lightbox'>链接 </a> </div></div>";

								//拼接，连接
								$("#container").append(img);
							}
							pageNum++;

							//alert(pageNum);	
							$("a.lightbox").lightBox();

							//流式布局 
							blockImages();
							//图片懒加载
							$("img.lazy").lazyload();
						}

					});
		}

		//给窗口绑定滚动事件
		$(window).scroll(
				function() {
					//alert(Number($(window).scrollTop()-$(document).height() - $(window).height()));   
					//当滚动到底部以上50像素的时候，加载新的内容
					if (Number($(document).height() - $(window).height()
							- $(window).scrollTop()) < 500) {
						loadImages();
						//alert("加载");
					}
					if ($(this).scrollTop() > 200) {
						$("#gotop").fadeIn(400);//淡入
						//alert("淡入");
					} else {
						$("#gotop").stop().fadeOut(400);//淡出
						//alert("淡出");
					}
				})

	});