package com.cryptoview.model.api;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Scanner;

import com.cryptoview.model.CryptoStats;

public class Top100Fetch {

	private static Top100Fetch instance = null;
	
	public static Top100Fetch getInstance() {
		if (instance == null) 
			instance = new Top100Fetch();
		return instance;
	}
	
	public String fetch() {
		try {
			String url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d";
			
			URL obj = new URL(url);
			
			HttpURLConnection conn = (HttpURLConnection) obj.openConnection();
			conn.setRequestMethod("GET");
//			conn.connect();
			
			//Getting the response code
			int responsecode = conn.getResponseCode();
			
			System.out.println(responsecode);
			
			String inline = "";
		    Scanner scanner = new Scanner(obj.openStream());
		  
		   //Write all the JSON data into a string using a scanner
		    while (scanner.hasNext()) {
		       inline += scanner.nextLine();
		    }
		    
		    //Close the scanner
		    scanner.close();
		    
		    return inline;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;		
	}
}
