package com.cryptoview.controller;

import java.util.ArrayList;
import java.util.List;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cryptoview.model.CryptoDetail;
import com.cryptoview.model.News;
import com.cryptoview.model.Stats;
import com.cryptoview.service.LatestNews;
import com.cryptoview.service.MarketStats;
import com.cryptoview.service.TopCryptos;
import com.cryptoview.model.api.TopCryptoFetcher;

@RestController
@CrossOrigin(origins = {"*"})
public class CryptoDataController {
	
	@GetMapping("/topCrypto")
	//restituisce il primo object della lista, quindi la prima cripto, è solo per dimostrare che funfa e che
	//marco è frocio
	private JSONObject getTop100() {
		JSONArray top100 = TopCryptoFetcher.getInstance().fetch(100);
		JSONObject obj = (JSONObject) top100.get(0);
		System.out.println(obj);
		return obj;
	}

	
	@GetMapping("/getTop100")
	private List<CryptoDetail> top100(){
		return TopCryptos.getInstance().getTop100();
	}
	
	@GetMapping("/topGainers")
	private List<CryptoDetail> getTopCryptoDetail() {
		return TopCryptos.getInstance().getTopGainers();
	}
	
	@GetMapping("/worstPerformers")
	private List<CryptoDetail> getWorstPerformers() {
		return TopCryptos.getInstance().getWorstPerformers();
	}
	
	@GetMapping("/latestNews")
	private List<News> getLatestNews(){
		return LatestNews.getInstance().getLatestNews();
	}
	
	@GetMapping("/marketStats")
	private Stats getMarketStats() {
		return MarketStats.getInstance().getStats();
	}
}
