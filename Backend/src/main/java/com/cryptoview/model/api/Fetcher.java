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
