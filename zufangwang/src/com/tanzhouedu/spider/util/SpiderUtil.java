package com.tanzhouedu.spider.util;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import com.tanzhouedu.spider.bean.Image;

/**
 * java doc 注释 文档注释，可以生成api文档
 * 抓取豆瓣网上的图片
 * @author wuyudeng
 * @version 1.0
 */
public class SpiderUtil {

	
	//保存要下载图片的网址
	private static Map<String,String> urls=new HashMap<String,String>();
	static{
		urls.put("fresh", "http://bj.lianjia.com/zufang/");
		urls.put("art", "http://bj.lianjia.com/zufang/");
	}
	/**
	 * 获得制定类型和页码以及网页对象
	 * @param category
	 * @param pageNum
	 * @return
	 */
	public static List<Image> queryImageList(String category,String pageNum ){
		System.out.println(category);
		System.out.println(pageNum);
		
		List<Image> images=new ArrayList<Image>();
		try {
			Document doc=Jsoup.connect(urls.get(category)+"pg"+pageNum)
						//.data("cid",pageNum)
						.get();
			System.out.println(urls.get(category)+"pg"+pageNum);
			Elements imgs=doc.getElementsByTag("img");

			//System.out.println("imgs.toString()"+imgs.toString());
			Image image=null;
			for(Element img:imgs){
				image=new Image();
				String shortUrl=img.attr("src");
				String title=img.attr("alt");
				String oriUrl=img.attr("data-img");
				
				if(shortUrl!=null && !"".equals(shortUrl)
					&& title!=null && !"".equals(title)){
					
					image.setOriUrl(oriUrl);
					image.setShortUrl(shortUrl);
					image.setTitle(title);
					
					images.add(image);
				}
			}
		} catch (IOException e) {
			//写日志
		}
		return images;
		
	}
}






















