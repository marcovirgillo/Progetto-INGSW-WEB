package com.cryptoview.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.cryptoview.model.CryptoDetail;
import com.cryptoview.model.api.TopCryptoFetcher;

public class TopCryptos {
	private ArrayList <CryptoDetail> cryptosList;
	private ArrayList <CryptoDetail> top100Cryptos;
	
	private static TopCryptos instance = null;
	
	private TopCryptos() {
		cryptosList = new ArrayList<CryptoDetail>();
	}
	
	public static TopCryptos getInstance() {
		if(instance == null)
			instance = new TopCryptos();
		
		return instance;
	}
	
	public void fetchData() {
		JSONArray cryptos = TopCryptoFetcher.getInstance().fetch(250);
		
		synchronized (this) {
			cryptosList.clear();
			
			for(int i = 0; i < cryptos.size(); ++i) {
				JSONObject obj = (JSONObject) cryptos.get(i);
				
				CryptoDetail crypto = new CryptoDetail();
				crypto.setChange((Double) obj.get("price_change_percentage_24h"));
				crypto.setLogo((String) obj.get("image"));
				crypto.setName((String) obj.get("name"));
				crypto.setId(getNameFromImage((String) obj.get("image")));				
				crypto.setTicker((String) obj.get("symbol"));
				crypto.setChange_7d((Double) obj.get("price_change_percentage_7d_in_currency"));
				
				Object o = obj.get("total_volume");
				Long volume = ((Number) o).longValue();
				crypto.setVolume(volume);
				
				o = obj.get("current_price");
				Double price = ((Number) o).doubleValue();
				crypto.setPrice(price);
				
				crypto.setMarket_cap((Long) obj.get("market_cap"));
				
				crypto.setRank((Long) obj.get("market_cap_rank"));
				
				cryptosList.add(crypto);
			}
			
			top100Cryptos = new ArrayList<CryptoDetail>(cryptosList.subList(0, 100));
			
			Collections.sort(cryptosList);
		}
	}
	
	public List<CryptoDetail> getTopGainers() {
		if(cryptosList.isEmpty())
			return Arrays.asList();
		
		return cryptosList.subList(0, 3);
	}
	
	public List<CryptoDetail> getWorstPerformers() {
		if(cryptosList.isEmpty())
			return Arrays.asList();
		
		List <CryptoDetail> tmp = cryptosList.subList(cryptosList.size() - 3, cryptosList.size());
		Collections.reverse(tmp);
		return tmp;
	}
	
	public List<CryptoDetail> getTop100(){
		if(top100Cryptos == null)
			return Arrays.asList();
		
		return top100Cryptos;
	}

	private Integer getNameFromImage(String name) {
		name = name.substring(42, name.length());
		name = name.substring(0, name.indexOf("/"));
		return Integer.parseInt(name);
	}
}