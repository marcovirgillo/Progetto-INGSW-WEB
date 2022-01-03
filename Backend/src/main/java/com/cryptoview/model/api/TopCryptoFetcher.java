package com.cryptoview.model.api;

import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;


public class TopCryptoFetcher {

	private static TopCryptoFetcher instance = null;
	
	public static TopCryptoFetcher getInstance() {
		if (instance == null) 
			instance = new TopCryptoFetcher();
		return instance;
	}
	
	public JSONArray fetch(int cryptoNum) {
		try {
			String response = Fetcher.getInstance().fetch(API.getInstance().getTopAPI(cryptoNum), "ERROR fetching top cryptos.");
		    
		    JSONParser parser = new JSONParser();
		    JSONArray array = (JSONArray) parser.parse(response); 
		    
		    return array;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new JSONArray();		
	}
}
