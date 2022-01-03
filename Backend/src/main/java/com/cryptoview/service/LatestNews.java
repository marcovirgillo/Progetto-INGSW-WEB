package com.cryptoview.service;

import java.util.ArrayList;
import java.util.Collections;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.cryptoview.model.CryptoDetail;
import com.cryptoview.model.News;
import com.cryptoview.model.api.LatestNewsFetcher;
import com.cryptoview.model.api.TopCryptoFetcher;

public class LatestNews {
	private ArrayList <News> latestNews;
	
	private static LatestNews instance = null;
	
	private LatestNews() {
		latestNews = new ArrayList<News>();
	}
	
	public static LatestNews getInstance() {
		if(instance == null)
			instance = new LatestNews();
		
		return instance;
	}
	
	public void fetchData() {
		JSONArray latestNewsJSON = LatestNewsFetcher.getInstance().fetch(8);
		
		synchronized (this) {
			latestNews.clear();
			
			for(int i = 0; i < latestNewsJSON.size(); ++i) {
				JSONObject obj = (JSONObject) latestNewsJSON.get(i);
				
				//System.out.println(obj.toString());
				
				News news = new News();
				news.setUrl((String) obj.get("url"));
				news.setImageUrl((String) obj.get("urlToImage")) ;
				news.setTitle((String) obj.get("title"));
				news.setDescription((String) obj.get("description"));
				
				latestNews.add(news);
			}
		}
	}
	
	public ArrayList<News> getLatestNews() {
		return latestNews;
	}
}
