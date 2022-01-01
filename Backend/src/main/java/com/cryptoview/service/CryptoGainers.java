package com.cryptoview.service;

import java.util.ArrayList;
import java.util.Collections;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.cryptoview.model.Gainers;
import com.cryptoview.model.api.TopCryptoFetcher;

public class CryptoGainers {
	private ArrayList <Gainers> topGainers;
	private ArrayList <Gainers> worstPerformers;
	
	private static CryptoGainers instance = null;
	
	private CryptoGainers() {
		topGainers = new ArrayList<>();
		worstPerformers = new ArrayList<>();
	}
	
	public static CryptoGainers getInstance() {
		if(instance == null)
			instance = new CryptoGainers();
		
		return instance;
	}
	
	public void fetchData() {
		topGainers.clear();
		worstPerformers.clear();
		
		JSONArray cryptos = TopCryptoFetcher.getInstance().fetch(200);
		for(int i = 0; i < cryptos.size(); ++i) {
			JSONObject obj = (JSONObject) cryptos.get(i);
			
			Gainers gainerz = new Gainers();
			gainerz.setChange_24h((Double) obj.get("price_change_percentage_24h"));
			gainerz.setImage((String) obj.get("image"));
			gainerz.setName((String) obj.get("name"));
			gainerz.setId(getNameFromImage((String) obj.get("image")));
			
			if(gainerz.getChange_24h() < 0)
				worstPerformers.add(gainerz);
			else
				topGainers.add(gainerz);
		}
		
		Collections.sort(topGainers);
		Collections.sort(worstPerformers);
	}
	
	public ArrayList<Gainers> getTopGainers() {
		return topGainers;
	}
	
	public ArrayList<Gainers> getWorstPerformers() {
		return worstPerformers;
	}

	private Integer getNameFromImage(String name) {
		name = name.substring(42, name.length());
		name = name.substring(0, name.indexOf("/"));
		return Integer.parseInt(name);
	}
}
