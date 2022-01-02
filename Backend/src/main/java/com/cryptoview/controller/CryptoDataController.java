package com.cryptoview.controller;

import java.util.ArrayList;
import java.util.List;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cryptoview.model.Gainers;
import com.cryptoview.model.News;
import com.cryptoview.service.CryptoGainers;
import com.cryptoview.service.LatestNews;
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
	
	@GetMapping("/topGainers")
	private List<Gainers> getTopGainers() {
		return CryptoGainers.getInstance().getTopGainers();
	}
	
	@GetMapping("/worstPerformers")
	private List<Gainers> getWorstPerformers() {
		return CryptoGainers.getInstance().getWorstPerformers();
	}
	
	@GetMapping("/latestNews")
	private List<News> getLatestNews(){
		return LatestNews.getInstance().getLatestNews();
	}
}
