package com.cryptoview.model.api;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;

import com.cryptoview.service.log.Logger;

public class Fetcher {
	
	private static Fetcher instance = null;
	
	private Fetcher() {
		
	}
	
	public static Fetcher getInstance() {
		if(instance == null)
			instance = new Fetcher();
		
		return instance;
	}
	
	public String fetch(String url, String errorMsg) {
		try {
			URL obj = new URL(url);
			
			HttpURLConnection conn = (HttpURLConnection) obj.openConnection();
			conn.setRequestMethod("GET");
			
			//Getting the response code
			int responsecode = conn.getResponseCode();
			
			if(responsecode != 200) {
				System.out.println(java.time.LocalDateTime.now() + " " + errorMsg +  " [" + responsecode + "]");
				Logger.getInstance().addEvent(errorMsg + " [" + responsecode + "]");
			}
			
			String inline = "";
		    Scanner scanner = new Scanner(obj.openStream());
		  
		    //Write all the JSON data into a string using a scanner
		    while (scanner.hasNext()) {
		       inline += scanner.nextLine();
		    }
		   
		    scanner.close();
		    
		   return inline;
		} catch (Exception e) {
			e.printStackTrace();
		} 
		
		return null;		
	}
}
