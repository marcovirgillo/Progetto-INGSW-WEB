package com.cryptoview.model.api;

import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;

public class ExchangesFetcher {
	
	private static ExchangesFetcher instance = null;

	private ExchangesFetcher() {}
	
	public static ExchangesFetcher getInstance() {
		if (instance == null) 
			instance = new ExchangesFetcher();
		return instance;
	}
	
	public JSONArray fetch() {
		try {
			String response = Fetcher.getInstance().fetch(API.getInstance().getExchangesAPI(), "ERROR fetching exchanges.");
		    JSONParser parser = new JSONParser();
		    JSONArray array = (JSONArray) parser.parse(response); 
		    
		    return array;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new JSONArray();
	}

}
