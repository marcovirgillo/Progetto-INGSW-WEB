package com.cryptoview.model.api;

import java.io.IOException;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import com.cryptoview.service.PreferencesService;

public class NewsFetcher {
	
	private static NewsFetcher instance = null;
	
	private NewsFetcher() {
		
	}
	
	public static NewsFetcher getInstance() {
		if (instance == null) 
			instance = new NewsFetcher();
		return instance;
	}
	
	public JSONArray fetch(String type) {
		try {
			int cont = 0;
			String response = "";
			while(response == "" && cont < API.getInstance().getNumberOfKeys()) {
				switch(type) {
					case "crypto":{
						response = Fetcher.getInstance().fetch(API.getInstance().getNewsAPI(8), "ERROR fetching latest news.");
						break;
					}
					case "exchanges":{
						response = Fetcher.getInstance().fetch(API.getInstance().getNewsExchangesAPI(), "ERROR fetching latest news.");
						break;
					}
					case "popular":{
						response = Fetcher.getInstance().fetch(API.getInstance().getPopularNewsKey(), "ERROR fetching popular news.");
						break;
					}
					case "all":{
						response = Fetcher.getInstance().fetch(API.getInstance().getAllNewsKey(), "ERROR fetching popular news.");
						break;
					}
				}	
				System.out.println("Refetching " + type + " news...");
				cont++;
			}
			if(response == "") {
				System.out.println("All keys have reached maximum requests for today!");
				return new JSONArray();
			}
			return parser(response);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return new JSONArray();		
	}
	
	public JSONArray fetchPreferredNews(String request) throws ParseException, IOException {
		String response = Fetcher.getInstance().fetch(request, "ERROR fetching latest news.");
		if(response == "") {
			return null;
		}
		return parser(response);
	}

	private JSONArray parser(String response) throws ParseException {
	    JSONParser parser = new JSONParser();
	    JSONObject result = (JSONObject) parser.parse(response); 
	    
	    JSONArray news = (JSONArray) result.get("articles");
	    
	    return news;
	}
}
