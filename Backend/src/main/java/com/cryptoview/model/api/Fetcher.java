package com.cryptoview.model.api;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.URL;
import java.nio.charset.Charset;

import com.cryptoview.service.log.Logger;

public class Fetcher {
	
	private static Fetcher instance = null;
	
	public static Fetcher getInstance() {
		if(instance == null)
			instance = new Fetcher();
		
		return instance;
	}
	
	public String fetch(String url, String errorMsg) throws IOException {
		try {
			/*URL obj = new URL(url);
			
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
		   
		    scanner.close();*/
			InputStream is = new URL(url).openStream();
		    BufferedReader rd = new BufferedReader(new InputStreamReader(is, Charset.forName("UTF-8")));
		    String response = readAll(rd);
		    
		    is.close();
		    return response;
		    
		} catch (Exception e) {
			System.out.println("News API key: " + API.getInstance().getCurrentAPIKey() + " has reached maximum requests for today.");
			Logger.getInstance().addEvent(errorMsg);
			return "";
		} 				
	}
	
	private static String readAll(Reader rd) throws IOException {
	    StringBuilder sb = new StringBuilder();
	    int cp;
	    while ((cp = rd.read()) != -1) {
	      sb.append((char) cp);
	    }
	    return sb.toString();
	  }
}
