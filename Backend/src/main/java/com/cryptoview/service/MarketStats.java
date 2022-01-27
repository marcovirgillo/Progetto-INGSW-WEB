package com.cryptoview.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;

import org.json.simple.JSONObject;

import com.cryptoview.model.Stats;
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
	
	private String useBigDecimal(Double value, Integer multiple, String multipleChar) { 
		value = value / Math.pow(10, multiple);
		BigDecimal bd = new BigDecimal(value);
		bd.setScale(2, RoundingMode.DOWN);
		
		return bd.toPlainString().substring(0,5) + " " + multipleChar;
	}
	
	// imposta il multiplo del valore attuale relativo al market cap e al volume
	private String setOrder(Double value, String valueStr) {
		if (value < Math.pow(10, 6)) 	
			return useBigDecimal(value, 3, "K");
		
		if (value >= Math.pow(10, 6) && value < Math.pow(10, 9)) 
			return useBigDecimal(value, 6, "M");
		
		if (value >= Math.pow(10, 9) && value < Math.pow(10, 12)) 
			return useBigDecimal(value, 9, "B");
		
		return useBigDecimal(value, 12, "T");
	}
	
	public void fetchData() {
		JSONObject statsJSON = MarketStatsFetcher.getInstance().fetch();
		if(statsJSON.get("total_market_cap") == null)
			return;
		
		synchronized (this) {
			stats.clear();
			
			JSONObject total_market_capJSON = (JSONObject) statsJSON.get("total_market_cap");
			Double total_market_cap = (Double) total_market_capJSON.get("usd");
			String total_market_cap_str = total_market_cap.toString();
			Stats obj = new Stats();
			obj.setName("Total market cap");
			obj.setValue(setOrder(total_market_cap, total_market_cap_str));
			stats.add(obj);
			
			Stats obj2 = new Stats();
			JSONObject volume_24h_JSON = (JSONObject) statsJSON.get("total_volume");
			Double volume_24h = (Double) volume_24h_JSON.get("usd");
			String volume_24h_str = volume_24h.toString();
			obj2.setName("Volume 24h");
			obj2.setValue(setOrder(volume_24h, volume_24h_str));
			
			stats.add(obj2);
			
			Stats obj3 = new Stats();
			JSONObject dominance = (JSONObject) statsJSON.get("market_cap_percentage");
			String btc_dominance = dominance.get("btc").toString();
			
			obj3.setName("Bitcoin dominance");
			obj3.setValue(btc_dominance.substring(0, 5) + "%");
			stats.add(obj3);
		}
	}
	
	public ArrayList<Stats> getStats() {
		return stats;
	}
}
