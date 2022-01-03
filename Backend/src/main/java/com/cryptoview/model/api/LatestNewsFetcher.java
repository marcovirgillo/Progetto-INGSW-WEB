package com.cryptoview.model.api;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.cryptoview.service.log.Logger;

public class LatestNewsFetcher {
	
	private static LatestNewsFetcher instance = null;
	
	public static LatestNewsFetcher getInstance() {
		if (instance == null) 
			instance = new LatestNewsFetcher();
		return instance;
	}
	
	public JSONArray fetch(int newsNum) {
		try {
			String url = API.getInstance().getNewsAPI(newsNum);
			
			URL obj = new URL(url);
			
			HttpURLConnection conn = (HttpURLConnection) obj.openConnection();
			conn.setRequestMethod("GET");
			
			//Getting the response code
			int responsecode = conn.getResponseCode();
			
			if(responsecode != 200) {
				System.out.println(java.time.LocalDateTime.now() + " ERROR fetching Latest News. [" + responsecode + "]");
				Logger.getInstance().addEvent("ERROR fetching Latest News. [" + responsecode + "]");
			}
			
			String inline = "";
		    Scanner scanner = new Scanner(obj.openStream());
		  
		   //Write all the JSON data into a string using a scanner
		    while (scanner.hasNext()) {
		       inline += scanner.nextLine();
		    }
		    
		    //Close the scanner
		    scanner.close();
		    
		    JSONParser parser = new JSONParser();
		    JSONObject result = (JSONObject) parser.parse(inline); 
		    
		    JSONArray news = (JSONArray) result.get("articles");
		    
		    return news;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;		
	}
}
