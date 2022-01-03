package com.cryptoview.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cryptoview.model.CryptoDetail;
import com.cryptoview.model.News;
import com.cryptoview.model.Stats;
import com.cryptoview.service.LatestNews;
import com.cryptoview.service.MarketStats;
import com.cryptoview.service.TopCryptos;

@RestController
@CrossOrigin(origins = {"*"})
public class CryptoDataController {
	//TODO: Collegare frontend con Market Stats e Top 100 E RENDERE MIGLIORE IL RESPONSIVE DELLE CARDS GAINERS E STATS

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
	private List<Stats> getMarketStats() {
		return MarketStats.getInstance().getStats();
	}
}
