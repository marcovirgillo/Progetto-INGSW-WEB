package com.cryptoview.controller;

import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cryptoview.model.CryptoDetail;
import com.cryptoview.model.Exchanges;
import com.cryptoview.model.News;
import com.cryptoview.model.Stats;
import com.cryptoview.persistence.dao.TransactionDaoJDBC;
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
		return LatestNews.getInstance().getLatestCryptoNews();
	}
	
	@GetMapping("/latestNewsExchanges")
	private List<News> getLatestExchangesNews(){
		return LatestNews.getInstance().getLatestExchangesNews();
	}
	
	@GetMapping("/supportedCrypto")
	private List<CryptoDetail> getSupportedCripto() {
		return TopCryptos.getInstance().getAllSupportedCrypto();
	}
	
	@GetMapping("/supportedCryptoSorted")
	private List<CryptoDetail> getSupportedCriptoSorted() {
		List <CryptoDetail> list = TopCryptos.getInstance().getAllSupportedCrypto();
		Collections.sort(list, new Comparator<CryptoDetail>() {
			public int compare(CryptoDetail o1, CryptoDetail o2) {
				return o1.getName().compareTo(o2.getName());
			}
		});
		
		return list;
	}
	
	@GetMapping("/marketStats")
	private List<Stats> getMarketStats() {
		return MarketStats.getInstance().getStats();
	}
	
	@GetMapping("/transactions") 
	private List <Transaction> getTransactions(HttpServletResponse response) {
		List <Transaction> list = Arrays.asList();
		try {
			list = TransactionDaoJDBC.getInstance().getAll();
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
	
	

	@GetMapping("/popularNews")
	private List<News> getPopularNews(){
		return LatestNews.getInstance().getPopularNews();
	}
	
	@GetMapping("/allLatestNews")
	private List<News> getAllLatestNews(){
		return LatestNews.getInstance().getAllLatestNews();
	}
	
}
