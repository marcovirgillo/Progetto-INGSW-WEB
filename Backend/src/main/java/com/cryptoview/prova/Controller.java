package com.cryptoview.prova;

import java.util.ArrayList;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080", "http://192.168.1.12:3000"})
public class Controller {

	@GetMapping("/topGainers")
	public ArrayList<Cripto> getTopGainers() {
		Cripto c1 = new Cripto("Bitcoin", "BTC", "12.89%", "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png");
		Cripto c2 = new Cripto("Ethereum", "ETH", "8.49%", "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png");
		Cripto c3 = new Cripto("HOGE Finance", "HOGE", "4.11%", "https://s2.coinmarketcap.com/static/img/coins/64x64/8438.png");
		
		ArrayList <Cripto> arr = new ArrayList<Cripto>();
		arr.add(c1);
		arr.add(c2);
		arr.add(c3);
		
		return arr;
	}
	
	@GetMapping("/worstPerformers")
	public ArrayList<Cripto> getWorstPerformers() {
		Cripto c1 = new Cripto("Marco coin", "MRCGY", "- 80.12%", "https://s2.coinmarketcap.com/static/img/coins/64x64/4963.png");
		Cripto c2 = new Cripto("Polkadot", "DOT", "- 12.49%", "https://s2.coinmarketcap.com/static/img/coins/64x64/6636.png");
		Cripto c3 = new Cripto("Aave", "AAVE", "- 9.11%", "https://s2.coinmarketcap.com/static/img/coins/64x64/7278.png");
		
		ArrayList <Cripto> arr = new ArrayList<Cripto>();
		arr.add(c1);
		arr.add(c2);
		arr.add(c3);
		
		return arr;
	}
	
	@GetMapping("/marketStats")
	public ArrayList <Stats> getStats() {
		Stats stat1 = new Stats("Total Market Cap", "2,218T $");
		Stats stat2 = new Stats("24h Total Volume", "89,318T $");
		Stats stat3 = new Stats("Bitcoin Dominance", "39.1%");
		
		ArrayList <Stats> arr = new ArrayList<Stats>();
		arr.add(stat1);
		arr.add(stat2);
		arr.add(stat3);
		
		return arr;
	}
}
