package com.cryptoview.model.api;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;

import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;

import com.cryptoview.service.log.Logger;

public class TopCryptoFetcher {

	private static TopCryptoFetcher instance = null;
	
	public static TopCryptoFetcher getInstance() {
		if (instance == null) 
			instance = new TopCryptoFetcher();
		return instance;
	}
	
	public JSONArray fetch(int cryptoNum) {
		try {
			String url = API.getInstance().getTopAPI(cryptoNum);
			
			URL obj = new URL(url);
			
			HttpURLConnection conn = (HttpURLConnection) obj.openConnection();
			conn.setRequestMethod("GET");
			
			//Getting the response code
			int responsecode = conn.getResponseCode();
			
			if(responsecode != 200) {
				System.out.println(java.time.LocalDateTime.now() + " ERROR fetching Top Cryptos. [" + responsecode + "]");
				Logger.getInstance().addEvent("ERROR fetching Top Cryptos. [" + responsecode + "]");
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
		    JSONArray array = (JSONArray) parser.parse(inline); 
		    
		    return array;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;		
	}
}
