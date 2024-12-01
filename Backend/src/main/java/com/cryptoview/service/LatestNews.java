package com.cryptoview.service;

import java.util.ArrayList;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.cryptoview.model.News;
import com.cryptoview.model.api.NewsFetcher;

public class LatestNews {
	private ArrayList <News> latestCryptoNews;
	private ArrayList <News> latestExchangesNews;
	private ArrayList <News> popularNews;
	private ArrayList <News> allLatestNews;
	
	private static LatestNews instance = null;
	
	private LatestNews() {
		latestCryptoNews = new ArrayList<News>();
		latestExchangesNews = new ArrayList<News>();
		popularNews = new ArrayList<News>();
		allLatestNews = new ArrayList<News>();
	}
	
	public static LatestNews getInstance() {
		if(instance == null)
			instance = new LatestNews();
		
		return instance;
	}
	
	public void fetchCryptoData() {
		JSONArray latestNewsJSON = NewsFetcher.getInstance().fetch("crypto");
		
		if(latestNewsJSON.isEmpty())
			return;
		
		synchronized (this) {
			latestCryptoNews.clear();
			
			for(int i = 0; i < latestNewsJSON.size(); ++i) {
				JSONObject obj = (JSONObject) latestNewsJSON.get(i);

				News news = new News();
				news.setUrl((String) obj.get("url"));
				news.setImageUrl((String) obj.get("urlToImage")) ;
				news.setTitle((String) obj.get("title"));
				news.setDescription((String) obj.get("description"));
				
				latestCryptoNews.add(news);
			}
		}
	}
	
	public void fetchExchangesData() {
		JSONArray latestNewsJSON = NewsFetcher.getInstance().fetch("exchanges");
		
		if(latestNewsJSON.isEmpty())
			return;
		
		synchronized (this) {
			latestExchangesNews.clear();
			
			for(int i = 0; i < latestNewsJSON.size(); ++i) {
				JSONObject obj = (JSONObject) latestNewsJSON.get(i);

				News news = new News();
				news.setUrl((String) obj.get("url"));
				news.setImageUrl((String) obj.get("urlToImage")) ;
				news.setTitle((String) obj.get("title"));
				news.setDescription((String) obj.get("description"));
				
				latestExchangesNews.add(news);
			}
		}
	}
	
	public void fetchPopularNewsData() {
		JSONArray popularNewsJSON = NewsFetcher.getInstance().fetch("popular");
		
		if(popularNewsJSON.isEmpty())
			return;

		synchronized (this) {
			popularNews.clear();
			
			for(int i = 0; i < popularNewsJSON.size(); ++i) {
				JSONObject obj = (JSONObject) popularNewsJSON.get(i);

				News news = new News();
				news.setUrl((String) obj.get("url"));
				news.setImageUrl((String) obj.get("urlToImage")) ;
				news.setTitle((String) obj.get("title"));
				news.setContent((String) obj.get("content"));
		
				
				String publishedAt = ((String) obj.get("publishedAt")).substring(0, 10);
				news.setPublishedAt(publishedAt);
				
				popularNews.add(news);

			}
		}
	}
	
	public void fetchAllLatestNewsData() {
		JSONArray allLatestNewsJSON = NewsFetcher.getInstance().fetch("all");
		
		if(allLatestNewsJSON.isEmpty())
			return;

		synchronized (this) {
			allLatestNews.clear();
			
			for(int i = 0; i <  allLatestNewsJSON.size(); ++i) {
				JSONObject obj = (JSONObject) allLatestNewsJSON.get(i);

				News news = new News();
				news.setUrl((String) obj.get("url"));
				news.setImageUrl((String) obj.get("urlToImage")) ;
				news.setTitle((String) obj.get("title"));
				news.setContent((String) obj.get("content"));
				
				String publishedAt = ((String) obj.get("publishedAt")).substring(0, 10);
				news.setPublishedAt(publishedAt);
				
				allLatestNews.add(news);

			}
		}
	}
	
	public ArrayList<News> getLatestCryptoNews() {
		return latestCryptoNews;
	}
	
	public ArrayList<News> getLatestExchangesNews() {
		return latestExchangesNews;
	}
	
	public ArrayList<News> getPopularNews() {
		return popularNews;
	}
	
	public ArrayList<News> getAllLatestNews() {
		return allLatestNews;
	} 
}
