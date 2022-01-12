package com.cryptoview.controller;

import java.sql.SQLException;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.cryptoview.controller.transfers.TransactionData;
import com.cryptoview.model.CryptoDetail;
import com.cryptoview.model.Exchanges;
import com.cryptoview.model.News;
import com.cryptoview.model.Stats;
import com.cryptoview.persistence.dao.PortfolioDaoJDBC;
import com.cryptoview.persistence.dao.TransactionDaoJDBC;
import com.cryptoview.persistence.dao.UserDaoJDBC;
import com.cryptoview.persistence.model.Portfolio;
import com.cryptoview.persistence.model.Transaction;
import com.cryptoview.persistence.model.User;
import com.cryptoview.service.LatestNews;
import com.cryptoview.service.MarketStats;
import com.cryptoview.service.PortfolioService;
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
	
	@SuppressWarnings("unchecked")
	@GetMapping("/portfolioValue")
	private JSONObject getPrices(HttpServletRequest request, HttpServletResponse response) {
		String timeStamp = request.getHeader("timeStamp");
		String token = request.getHeader("Authorization");
		
		try {
			User user = UserDaoJDBC.getInstance().findByToken(token);
			
			if(user == null) {
				JSONObject resp = new JSONObject();
				response.setStatus(Protocol.INVALID_TOKEN);
				resp.put("msg", "The auth token is not valid");
				
				return resp;
			}
			
			response.setStatus(Protocol.OK);
			Portfolio portfolio = PortfolioDaoJDBC.getInstance().get(user.getUsername());
			if(portfolio != null)
				return PortfolioService.getInstance().getPortfolioValueTime(portfolio, timeStamp);
			else {
				JSONObject resp = new JSONObject();
				response.setStatus(portfolioDoesnExist(resp));
				
				return resp;
			}
			
		} catch (SQLException e) {
			JSONObject resp = new JSONObject();
			response.setStatus(Protocol.SERVER_ERROR);
			resp.put("msg", "Internal server error");
			
			return resp;
		}
	}
	
	@SuppressWarnings("unchecked")
	@GetMapping("/portfolioInfo")
	private JSONObject getPortfolio(HttpServletRequest request, HttpServletResponse response) {
		String token = request.getHeader("Authorization");
		
		try {
			User user = UserDaoJDBC.getInstance().findByToken(token);
			
			if(user == null) {
				JSONObject resp = new JSONObject();
				response.setStatus(Protocol.INVALID_TOKEN);
				resp.put("msg", "The auth token is not valid");
				
				return resp;
			}
			
			Portfolio portfolio = PortfolioDaoJDBC.getInstance().get(user.getUsername());
			
			if(portfolio != null) {
				response.setStatus(Protocol.OK);
				return PortfolioService.getInstance().getPortfolioInfo(portfolio);
			}
			else {
				JSONObject resp = new JSONObject();
				response.setStatus(portfolioDoesnExist(resp));
				
				return resp;
			}
			
		} catch (SQLException e) {
			JSONObject resp = new JSONObject();
			response.setStatus(Protocol.SERVER_ERROR);
			resp.put("msg", "Internal server error");
			
			return resp;
		}
	}
	
	@SuppressWarnings("unchecked")
	@PostMapping("/addTransaction")
	public JSONObject addTransactionPortfolio(@RequestBody TransactionData transaction, HttpServletRequest request, HttpServletResponse response) {
		String token = request.getHeader("Authorization");
		JSONObject resp = new JSONObject();
		
		try {
			User user = UserDaoJDBC.getInstance().findByToken(token);
			
			if(user == null) {
				response.setStatus(Protocol.INVALID_TOKEN);
				resp.put("msg", "The auth token is not valid");
				
				return resp;
			}
			
			Portfolio portfolio = PortfolioDaoJDBC.getInstance().get(user.getUsername());
			
			if(portfolio != null) {
				Transaction transfer = Transaction.parseFromdata(transaction);	
				transfer.setPortfolioOwner(user.getUsername());
				TransactionDaoJDBC.getInstance().save(transfer);
				
				response.setStatus(Protocol.OK);
				resp.put("msg", "Transaction added succesfully");
				return resp;
				
			}
			else {
				response.setStatus(portfolioDoesnExist(resp));
				return resp;
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
			response.setStatus(Protocol.TRANSACTION_ERROR);
			resp.put("msg", "Cannot add this transaction");
			
			return resp;
		} catch (IllegalArgumentException e2) {
			response.setStatus(Protocol.INVALID_DATA);
			resp.put("msg", "The data provided are not valid");
			
			return resp;
		}
	}
	
	@SuppressWarnings("unchecked")
	private int portfolioDoesnExist(JSONObject resp) {
		resp.put("msg", "The user doesn't have a portfolio");
		return Protocol.PORTFOLIO_DOESNT_EXISTS;
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
