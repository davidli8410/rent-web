<%@ page language="java"
	import="java.util.*, com.tanzhouedu.spider.util.*"
	contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.tanzhouedu.spider.bean.*,com.alibaba.fastjson.*"%>
<%
	String pageNum = request.getParameter("pageNum");
	String category = request.getParameter("category");
	/* 	String pageNum="4";
		String category="fresh"; */
	List<Image> images = SpiderUtil.queryImageList(category, pageNum);
	System.out.println(images.toString());
	response.setContentType("text/html; charset=UTF-8");
	out.print(JSONArray.toJSONString(images, true));
%>