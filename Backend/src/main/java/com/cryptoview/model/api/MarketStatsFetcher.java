package com.cryptoview.model.api;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

public class MarketStatsFetcher {

private static MarketStatsFetcher instance = null;
	
	public static MarketStatsFetcher getInstance() {
		if (instance == null) 
			instance = new MarketStatsFetcher();
		return instance;
	}
	
	public JSONObject fetch() {
		try {
			String response = Fetcher.getInstance().fetch(API.getInstance().getMarketStatsAPI(), "ERROR fetching market stats.");
		    
		    JSONParser parser = new JSONParser();
		    JSONObject result = (JSONObject) parser.parse(response); 
		    
		    JSONObject stats = (JSONObject) result.get("data");
		    
		    return stats;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new JSONObject();		
	}
}
