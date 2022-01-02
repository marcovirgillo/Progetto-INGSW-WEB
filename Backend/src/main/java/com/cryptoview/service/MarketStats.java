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
	private Stats stats;
	
	private MarketStats() {
		stats = new Stats();
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
			Double total_market_cap = (Double) total_market_capJSON.get("usd");
			
			stats.setTotal_market_cap(total_market_cap.longValue());
			
			JSONObject volume_24h_JSON = (JSONObject) statsJSON.get("total_volume");
			Double volume_24h = (Double) volume_24h_JSON.get("usd");
			stats.setVolume_24h(volume_24h.longValue());
			
			JSONObject dominance = (JSONObject) statsJSON.get("market_cap_percentage");
			Double btc_dominance = (Double) dominance.get("btc");
			stats.setBitcoin_dominance(btc_dominance);
		}
	}
	
	public Stats getStats() {
		return stats;
	}
}
