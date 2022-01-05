package com.cryptoview.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.cryptoview.model.CryptoDetail;
import com.cryptoview.model.Exchanges;
import com.cryptoview.model.api.ExchangesFetcher;

public class TopExchanges {
	private ArrayList <Exchanges> top100Exchanges;
	
	private static TopExchanges instance = null;
	
	private TopExchanges() {
		top100Exchanges = new ArrayList<Exchanges>();
	}
	
	public static TopExchanges getInstance() {
		if(instance == null)
			instance = new TopExchanges();
		
		return instance;
	}
	
	
	public void fetchData() {
		JSONArray exchanges = ExchangesFetcher.getInstance().fetch();
		
		synchronized (this) {
			top100Exchanges.clear();
			
			for(int i = 0; i < exchanges.size(); ++i) {
				JSONObject obj = (JSONObject) exchanges.get(i);
				
				Exchanges exchage = new Exchanges();
				exchage.setName((String) obj.get("name"));
				exchage.setTrust_score((Long) obj.get("trust_score"));
				exchage.setVolume((Double) obj.get("trade_volume_24h_btc"));
				exchage.setCountry((String) obj.get("country"));
				exchage.setYearEstabilished((Long) obj.get("year_established"));
				exchage.setRank((Long) obj.get("trust_score_rank"));
				exchage.setLogo((String) obj.get("image"));
				exchage.setChart_7d(getExchangeChart((String) obj.get("image")));
				
				top100Exchanges.add(exchage);
		
			}
			
		
		}
	}
	
	private String getExchangeChart(String name) {
		Integer exchangeId = getIdFromImage(name);
		return "https://www.coingecko.com/exchanges/" + exchangeId + "/sparkline";
	}
	
	private Integer getIdFromImage(String name) {
		name = name.substring(44, name.length());
		name = name.substring(0, name.indexOf("/"));
		return Integer.parseInt(name);
	}

	public List<Exchanges> getTop100() {
		if (top100Exchanges == null)
			return Arrays.asList();
		return top100Exchanges;
	}
	
}
