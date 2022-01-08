package com.cryptoview.controller;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cryptoview.model.CryptoDetail;
import com.cryptoview.model.Exchanges;
import com.cryptoview.model.News;
import com.cryptoview.model.Stats;
import com.cryptoview.model.api.TopCryptoFetcher;
import com.cryptoview.persistence.dao.CryptoDaoJDBC;
import com.cryptoview.persistence.dao.PortfolioDaoJDBC;
import com.cryptoview.persistence.dao.TransactionDaoJDBC;
import com.cryptoview.persistence.model.Crypto;
import com.cryptoview.persistence.model.Portfolio;
import com.cryptoview.persistence.model.Transaction;
import com.cryptoview.service.LatestNews;
import com.cryptoview.service.MarketStats;
import com.cryptoview.service.PortfolioService;
import com.cryptoview.service.PortfolioService.Pair;
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
	
	@GetMapping("/portfolio") 
	private Portfolio getPortfolio(HttpServletResponse response) {
		try {
			Portfolio portfolio = PortfolioDaoJDBC.getInstance().get("prova");
			return portfolio;
		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus(500);
		}
		
		return new Portfolio();
	}
	
	@GetMapping("/getTop100Exchanges")
	private List<Exchanges> getExchanges() {
		return TopExchanges.getInstance().getTop100();
	}
	
	@GetMapping("/portfolioValue")
	private JSONObject getPrices(HttpServletRequest request) throws Exception{
		String timeStamp = request.getHeader("timeStamp");
		return PortfolioService.getInstance().getPortfolioValueTime("prova", timeStamp);
	}
	
	@GetMapping("/portfolioInfo")
	private JSONObject getPortfolio() throws Exception {
		return PortfolioService.getInstance().getPortfolioInfo("prova");
	}
	
}
