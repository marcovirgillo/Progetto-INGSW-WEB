package com.cryptoview.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.cryptoview.model.CryptoDetail;
import com.cryptoview.model.api.TopCryptoFetcher;
import com.cryptoview.persistence.dao.CryptoDaoJDBC;

public class TopCryptos {
	private ArrayList <CryptoDetail> cryptosList;
	private ArrayList <CryptoDetail> top100Cryptos;
	private Double bitcoinPrice;
	
	private Map <String, CryptoDetail> supportedCryptoDetail;
	
	private static TopCryptos instance = null;
	
	private TopCryptos() {
		cryptosList = new ArrayList<CryptoDetail>();
		supportedCryptoDetail = new HashMap<String, CryptoDetail>();
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
			supportedCryptoDetail.clear();
			
			for(int i = 0; i < cryptos.size(); ++i) {
				JSONObject obj = (JSONObject) cryptos.get(i);
				
				CryptoDetail crypto = CryptoDetail.parseFromResponse(obj);
				crypto.setChart7d(getCryptoChart((String) obj.get("image")));
				
				//se una cripto delle top è anche supportata, aggiungo i suoi dati alla map
				if(CryptoDaoJDBC.getInstance().getSupportedCripto().contains(crypto.getTicker()))
					supportedCryptoDetail.put(crypto.getTicker(), crypto);
				
				if (crypto.getName().equals("Bitcoin"))
					bitcoinPrice = crypto.getPrice();
				
				crypto.setRank((Long) obj.get("market_cap_rank"));
				
				cryptosList.add(crypto);
			}
			
			top100Cryptos = new ArrayList<CryptoDetail>(cryptosList.subList(0, 100));
			
			Collections.sort(cryptosList);
			
			checkMissingPrices();
		}
	}
	
	private String getCryptoId(String ticker) {
		for(CryptoDetail crypto : cryptosList) {
			if(crypto.getTicker().equalsIgnoreCase(ticker))
				return crypto.getId();
		}
		
		return "";
	}
	
	private void checkMissingPrices() {
		//se non ho fetchato una cripto supportata nell'ultimo aggiornamento, la fetcho singolarmente
		//serve per il portfolio
		for(String ticker : CryptoDaoJDBC.getInstance().getSupportedCripto()) {
			if(!supportedCryptoDetail.keySet().contains(ticker)) {
				CryptoDetail cryptoDetail = CryptoDetail.parseFromSingleResponse(TopCryptoFetcher.getInstance().fetchCrypto(getCryptoId(ticker)));
				supportedCryptoDetail.put(ticker, cryptoDetail);
			}
		}
	}

	private String getCryptoChart(String imageUrl) {
		Integer cryptoId = getIdFromImage(imageUrl);
		return "https://www.coingecko.com/coins/" + cryptoId + "/sparkline";
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

	private Integer getIdFromImage(String name) {
		name = name.substring(42, name.length());
		name = name.substring(0, name.indexOf("/"));
		return Integer.parseInt(name);
	}
	
	public Double getBitcoinPrice() {
		return bitcoinPrice;
	}
	
}
