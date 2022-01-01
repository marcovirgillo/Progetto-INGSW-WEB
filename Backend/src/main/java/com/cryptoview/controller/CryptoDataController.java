package com.cryptoview.controller;

import java.util.ArrayList;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cryptoview.model.Gainers;
import com.cryptoview.service.CryptoGainers;
import com.cryptoview.model.api.TopCryptoFetcher;

@RestController
@CrossOrigin(origins = {"localhost:3000", "localhost:8080"})
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
	
	@GetMapping("/getTopGainers")
	private ArrayList <Gainers> getTopGainers() {
		//Il fetch deve essere fatto ogni tot, e non ad ogni richiesta
		//è qui solo per test
		CryptoGainers.getInstance().fetchData();
		return CryptoGainers.getInstance().getTopGainers();
	}
	
	@GetMapping("/getWorstPerformers")
	private ArrayList <Gainers> getWorstPerformers() {
		CryptoGainers.getInstance().fetchData();
		return CryptoGainers.getInstance().getWorstPerformers();
	}
}
