package com.cryptoview.service;

import java.util.ArrayList;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.cryptoview.model.News;
import com.cryptoview.model.Stats;
import com.cryptoview.model.api.LatestNewsFetcher;
import com.cryptoview.model.api.MarketStatsFetcher;

public class MarketStats {
	
	private static MarketStats instance = null;
	private ArrayList<Stats> stats;
	
	private MarketStats() {
		stats = new ArrayList<Stats>();
	}
	
	public static MarketStats getInstance() {
		if(instance == null)
			instance = new MarketStats();
		
		return instance;
	}
	
	public void fetchData() {
		JSONObject statsJSON = MarketStatsFetcher.getInstance().fetch();
		
		synchronized (this) {			
			JSONObject total_market_capJSON = (JSONObject) statsJSON.get("total_market_cap");
			String total_market_cap = total_market_capJSON.get("usd").toString();
			Stats obj = new Stats();
			obj.setName("Total market cap");
			obj.setValue(total_market_cap);
			stats.add(obj);
			
			
			Stats obj2 = new Stats();
			JSONObject volume_24h_JSON = (JSONObject) statsJSON.get("total_volume");
			String volume_24h = volume_24h_JSON.get("usd").toString();
			obj2.setName("Volume 24h");
			obj2.setValue(volume_24h);
			stats.add(obj2);
			
			Stats obj3 = new Stats();
			JSONObject dominance = (JSONObject) statsJSON.get("market_cap_percentage");
			String btc_dominance = dominance.get("btc").toString();
			
			obj3.setName("Bitcoin dominance");
			obj3.setValue(btc_dominance);
			stats.add(obj3);
		}
	}
	
	public ArrayList<Stats> getStats() {
		return stats;
	}
}
