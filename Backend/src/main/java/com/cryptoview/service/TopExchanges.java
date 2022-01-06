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
				
				Exchanges exchange = new Exchanges();
				exchange.setName((String) obj.get("name"));
				exchange.setTrust_score((Long) obj.get("trust_score"));
				exchange.setVolume((Double) obj.get("trade_volume_24h_btc") * TopCryptos.getInstance().getBitcoinPrice());
				exchange.setRank((Long) obj.get("trust_score_rank"));
				exchange.setLogo((String) obj.get("image"));
				exchange.setChart_7d(getExchangeChart((String) obj.get("image")));
				
				if (obj.get("country") != null) {
					exchange.setCountry((String) obj.get("country"));
				}
				else {
					exchange.setCountry("not available");
				}
				
				if (obj.get("year_established") != null) {
					exchange.setYearEstabilished((Long) obj.get("year_established"));
				}
				else {
					exchange.setYearEstabilished((long) 0);
				}
				
				top100Exchanges.add(exchange);
		
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
