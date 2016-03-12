package com.tanzhouedu.spider.bean;
/**
 * 图片实体
 * @author wuyudeng
 *
 */
public class Image {
	private String shortUrl;//小图地址
	private String oriUrl;//大图地址
	private String title;//标题
	public String getShortUrl() {
		return shortUrl;
	}
	public void setShortUrl(String shortUrl) {
		this.shortUrl = shortUrl;
	}
	public String getOriUrl() {
		return oriUrl;
	}
	public void setOriUrl(String oriUrl) {
		this.oriUrl = oriUrl;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
}
