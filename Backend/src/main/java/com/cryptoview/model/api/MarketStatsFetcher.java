package com.cryptoview.model.api;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.cryptoview.service.log.Logger;

public class MarketStatsFetcher {

private static MarketStatsFetcher instance = null;
	
	public static MarketStatsFetcher getInstance() {
		if (instance == null) 
			instance = new MarketStatsFetcher();
		return instance;
	}
	
	public JSONObject fetch() {
		try {
			String url = API.getInstance().getMarketStatsAPI();
			
			URL obj = new URL(url);
			
			HttpURLConnection conn = (HttpURLConnection) obj.openConnection();
			conn.setRequestMethod("GET");
			
			//Getting the response code
			int responsecode = conn.getResponseCode();
			
			if(responsecode != 200) {
				System.out.println(java.time.LocalDateTime.now() + " ERROR fetching Market Stats. [" + responsecode + "]");
				Logger.getInstance().addEvent("ERROR fetching Market Stats. [" + responsecode + "]");
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
		    
		    JSONObject stats = (JSONObject) result.get("data");
		    
		    return stats;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;		
	}
}
