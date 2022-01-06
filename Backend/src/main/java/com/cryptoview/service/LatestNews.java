package com.cryptoview.service;

import java.util.ArrayList;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.cryptoview.model.News;
import com.cryptoview.model.api.LatestNewsFetcher;

public class LatestNews {
	private ArrayList <News> latestCryptoNews;
	private ArrayList <News> latestExchangesNews;
	
	private static LatestNews instance = null;
	
	private LatestNews() {
		latestCryptoNews = new ArrayList<News>();
		latestExchangesNews = new ArrayList<News>();
	}
	
	public static LatestNews getInstance() {
		if(instance == null)
			instance = new LatestNews();
		
		return instance;
	}
	
	public void fetchCryptoData() {
		JSONArray latestNewsJSON = LatestNewsFetcher.getInstance().fetch("crypto");
		
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
		JSONArray latestNewsJSON = LatestNewsFetcher.getInstance().fetch("exchanges");
		
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
	
	public ArrayList<News> getLatestCryptoNews() {
		return latestCryptoNews;
	}
	
	public ArrayList<News> getLatestExchangesNews() {
		return latestExchangesNews;
	}
}
