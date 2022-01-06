package com.cryptoview.model.api;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

public class LatestNewsFetcher {
	
	private static LatestNewsFetcher instance = null;
	
	private LatestNewsFetcher() {
		
	}
	
	public static LatestNewsFetcher getInstance() {
		if (instance == null) 
			instance = new LatestNewsFetcher();
		return instance;
	}
	
	public JSONArray fetch(String type) {
		try {
			if (type == "crypto") {
				String response = Fetcher.getInstance().fetch(API.getInstance().getNewsAPI(8), "ERROR fetching latest news.");
			    
			    JSONParser parser = new JSONParser();
			    JSONObject result = (JSONObject) parser.parse(response); 
			    
			    JSONArray news = (JSONArray) result.get("articles");
			    
			    return news;
			}
			
			if (type == "exchanges") {
				String response = Fetcher.getInstance().fetch(API.getInstance().getNewsExchangesAPI(), "ERROR fetching latest news.");
			    
			    JSONParser parser = new JSONParser();
			    JSONObject result = (JSONObject) parser.parse(response); 
			    
			    JSONArray news = (JSONArray) result.get("articles");
			    
			    return news;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return new JSONArray();		
	}
}
