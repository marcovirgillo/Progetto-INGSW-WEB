package com.cryptoview.model.api;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;

import com.cryptoview.model.CryptoStats;

public class Top100Fetch {

	private static Top100Fetch instance = null;
	
	public static Top100Fetch getInstance() {
		if (instance == null) 
			instance = new Top100Fetch();
		return instance;
	}
	
	public ArrayList<CryptoStats> fetch() {
		String api = API.getInstance().getTop100API();
		try {
			URL obj = new URL(api);
			HttpURLConnection connection = (HttpURLConnection) obj.openConnection();
			BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
			String inputLine = "";
			StringBuffer response = new StringBuffer();
			System.out.println(in.ready());
			int i = 0;
			while(i < 100) {
				System.out.println(inputLine);
				inputLine = in.readLine();
				response.append(inputLine);
				i++;
			}
			in.close();
			//System.out.println(response);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return null;
		
	}
}
