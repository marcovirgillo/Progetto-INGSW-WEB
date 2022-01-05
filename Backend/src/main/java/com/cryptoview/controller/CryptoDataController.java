package com.cryptoview.controller;

import java.net.http.HttpResponse;
import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cryptoview.model.CryptoDetail;
import com.cryptoview.model.Exchanges;
import com.cryptoview.model.News;
import com.cryptoview.model.Stats;
import com.cryptoview.persistence.dao.TransactionDao;
import com.cryptoview.persistence.model.Transaction;
import com.cryptoview.service.LatestNews;
import com.cryptoview.service.MarketStats;
import com.cryptoview.service.TopCryptos;
import com.cryptoview.service.TopExchanges;

@RestController
@CrossOrigin(origins = {"*"})
public class CryptoDataController {

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
	
	@GetMapping("/transactions") 
	private List <Transaction> getTransactions(HttpServletResponse response) {
		List <Transaction> list = Arrays.asList();
		try {
			list = TransactionDao.getInstance().getAll();
		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus(500);
		}
		
		return list;
	}
	@GetMapping("/getTop100Exchanges")
	private List<Exchanges> getExchanges() {
		return TopExchanges.getInstance().getTop100();
	}
	
}
