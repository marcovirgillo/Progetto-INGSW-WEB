package com.cryptoview.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.cryptoview.model.Gainers;
import com.cryptoview.model.api.TopCryptoFetcher;

public class CryptoGainers {
	private ArrayList <Gainers> gainers;
	
	private static CryptoGainers instance = null;
	
	private CryptoGainers() {
		gainers = new ArrayList<Gainers>();
	}
	
	public static CryptoGainers getInstance() {
		if(instance == null)
			instance = new CryptoGainers();
		
		return instance;
	}
	
	public void fetchData() {
		JSONArray cryptos = TopCryptoFetcher.getInstance().fetch(250);
		
		synchronized (this) {
			gainers.clear();
			
			for(int i = 0; i < cryptos.size(); ++i) {
				JSONObject obj = (JSONObject) cryptos.get(i);
				
				Gainers gainerz = new Gainers();
				gainerz.setChange((Double) obj.get("price_change_percentage_24h"));
				gainerz.setLogo((String) obj.get("image"));
				gainerz.setName((String) obj.get("name"));
				gainerz.setId(getNameFromImage((String) obj.get("image")));				
				gainerz.setTicker((String) obj.get("symbol"));
				
				gainers.add(gainerz);
			}
			
			Collections.sort(gainers);
		}
	}
	
	public List<Gainers> getTopGainers() {
		return gainers.subList(0, 3);
	}
	
	public List<Gainers> getWorstPerformers() {
		//System.out.println(gainers.size());
		List <Gainers> tmp = gainers.subList(gainers.size() - 3, gainers.size());
		
		Collections.reverse(tmp);

		return tmp;
	}

	private Integer getNameFromImage(String name) {
		name = name.substring(42, name.length());
		name = name.substring(0, name.indexOf("/"));
		return Integer.parseInt(name);
	}
}
