package com.cryptoview.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.cryptoview.model.api.TopCryptoFetcher;
import com.cryptoview.persistence.dao.CryptoDaoJDBC;
import com.cryptoview.persistence.dao.PortfolioDaoJDBC;
import com.cryptoview.persistence.model.Crypto;
import com.cryptoview.persistence.model.Portfolio;
import com.cryptoview.persistence.model.Transaction;

public class PortfolioService {

	private static PortfolioService instance;
	private Map <String, Double> portfolioValue24hOld;
 	
	public class Pair <T1, T2> {
		public T1 first;
		public T2 second;
	}
	
	private PortfolioService() {
		portfolioValue24hOld = new HashMap<>();
	}
	
	public static  PortfolioService getInstance() {
		if(instance == null)
			instance = new PortfolioService();
		
		return instance;
	}
	
	private ArrayList<Crypto> getCryptoEverPresentInPortfolio(Portfolio userPortfolio) {
		//prendo tutte le cripto che sono state presenti almeno una volta nel portfolio
		ArrayList <String> tickerList = new ArrayList<>();
		for(Transaction transaction : userPortfolio.getTransactionList()) {
			if(!tickerList.contains(transaction.getCryptoTicker()))
				tickerList.add(transaction.getCryptoTicker());
		}
		
		//mi serve l'oggetto cripto per l'id dell'api e altri dati
		ArrayList <Crypto> cryptoList = new ArrayList<>();
		for(String ticker : tickerList) 
			cryptoList.add(CryptoDaoJDBC.getInstance().getCrypto(ticker));
		
		return cryptoList;
	}
	
	//questa funzione calcola la quantita di cripto presente nel portfolio all'istante timestampstart
	private Map<String, Double> getCryptoQuantityAtTimeOfBeginning(Long timestampStart, ArrayList <Transaction> portfolioTransactions, ArrayList<Crypto> portfolioCripto) {
		Map <String, Double> cryptoQuantityMap = new HashMap<>();
		
		for(Crypto cripto : portfolioCripto) {
			cryptoQuantityMap.put(cripto.getTicker(), 0.0);
		}
		
		//scorro le transazioni e considero quelle avvenute
		Iterator<Transaction> transactionIterator = portfolioTransactions.iterator();
		while(transactionIterator.hasNext()) {
			Transaction transaction = transactionIterator.next();
			Long transactionTime = transaction.getTransactionDatestamp().getTime();
			
			if(transactionTime > timestampStart)
				continue;
			
			String ticker = transaction.getCryptoTicker();
			
			if(transaction.getType() == Transaction.BUY)
				cryptoQuantityMap.put(ticker, cryptoQuantityMap.get(ticker) + transaction.getQuantity());
			else 
				cryptoQuantityMap.put(ticker, cryptoQuantityMap.get(ticker) - transaction.getQuantity());
			
			transactionIterator.remove();
			
		}
		
		return cryptoQuantityMap;
	}	
	
	
	
	
	@SuppressWarnings("unchecked")
	public JSONObject getPortfolioValueTime(String user, String timestamp) throws SQLException {
		Portfolio userPortfolio = PortfolioDaoJDBC.getInstance().get(user);
		
		ArrayList <Crypto> cryptoPortfolio = getCryptoEverPresentInPortfolio(userPortfolio);
		ArrayList <Transaction> portfolioTransactions = (ArrayList<Transaction>) userPortfolio.getTransactionList();
		
		//per ogni cripto, mappo lo storico di prezzi
		Map <String, ArrayList <Double>> cryptoPricesOverTime = new HashMap<>();
		//è la lista con tutti i timestamp, per cui calcolo il valore del portfolio
		ArrayList <Long> timestampList = new ArrayList<>();
				
		//serve per riempire la timestamp list solo una votla
		boolean filled = false;
		for(Crypto crypto : cryptoPortfolio) {
			JSONArray history = TopCryptoFetcher.getInstance().fetchCryptoHistoricprices(crypto.getIdApi(), timestamp);
			
			//per ogni cripto, recupero lo storico dei prezzi e lo inserisco nella mappa di liste
			ArrayList <Double> cryptoPrices = new ArrayList<>();
			for(Object value : history) {
				JSONArray arr = (JSONArray) value;
				
				Long cryptoTimestamp = (Long) arr.get(0);
				Double price = (Double) arr.get(1);
				
				cryptoPrices.add(price);
				
				if(!filled)
					timestampList.add(cryptoTimestamp);
			}
			
			filled = true;
			
			cryptoPricesOverTime.put(crypto.getTicker(), cryptoPrices);
		}
		
		//mi dice le quantitò di cripto che ho all'inizio del periodo di riferimento del portfolio
		Map <String, Double> cryptoQuantity = getCryptoQuantityAtTimeOfBeginning(timestampList.get(0), portfolioTransactions, cryptoPortfolio);
		
		//è la lista finale
		JSONArray portfolioValueOverTime = new JSONArray();
		
		//per ogni timestamp, calcolo il valore del portfolio in quell'istante
		for(int i = 0; i < timestampList.size(); ++i) {
			Long time = timestampList.get(i);
			
			Pair <Long, Double> pair = new Pair <Long, Double>();
			pair.first = time;
			
			Double valueAtTimeZeroDollar = 0.0;
			
			Iterator<Transaction> transactionIterator = portfolioTransactions.iterator();
			while(transactionIterator.hasNext()) {
				Transaction transaction = transactionIterator.next();
				
				//se la transazione è avvenuta prima dell'istante di tempo che sto considerando, allora la considero
				//e poi la rimuovo dalla lista
				if(time > transaction.getTransactionDatestamp().getTime()) {	
					String ticker = transaction.getCryptoTicker();
					
					//aggiorno le quantità di cripto, in base al fatto che sia acquisto o meno
					if(transaction.getType() == Transaction.BUY)
						cryptoQuantity.put(ticker, cryptoQuantity.get(ticker) + transaction.getQuantity());
					else 
						cryptoQuantity.put(ticker, cryptoQuantity.get(ticker) - transaction.getQuantity());
					
					transactionIterator.remove();
				}
			}
			
			
			boolean incomplete = false;
			//per ogni cripto presente nel portfolio all'istante di tempo che sto considerando, calcolo il valore
			//come quantità * prezzo storico, dove il prezzo storico è nella lista di prezzi storici
			for(String cryptoTicker : cryptoQuantity.keySet()) {
				Double cryptoQuant = cryptoQuantity.get(cryptoTicker);
				
				ArrayList <Double> prices = cryptoPricesOverTime.get(cryptoTicker);
				
				if(prices.size() > i)
					valueAtTimeZeroDollar += cryptoQuant * prices.get(i);
				else 
					incomplete = true;
			}
			
			if(incomplete)
				continue;
			
			pair.second = valueAtTimeZeroDollar;
			
			JSONObject item = new JSONObject();
			item.put("value", valueAtTimeZeroDollar);
			item.put("time", time);
			portfolioValueOverTime.add(item);
		}
		
		//se sto calcolando l'andamento giornaliero, aggiorno il valore del portfolio 24h fa e le varie percentuali
		if(timestamp.equals("1"))
			portfolioValue24hOld.put(user, (Double) ((JSONObject) portfolioValueOverTime.get(0)).get("value"));
		
		JSONObject resp = new JSONObject();
		insertPortfolioChangeData(resp, userPortfolio);
		resp.put("data", portfolioValueOverTime);
		
		return resp;
	}
	
	@SuppressWarnings("unchecked")
	private void insertPortfolioChangeData(JSONObject obj, Portfolio portfolio) {
		Double actualBalance = calculatePortfolioBalance(portfolio);
		Double oldBalance = portfolioValue24hOld.getOrDefault(portfolio.getUsernameOwner(), 0.0);
		Double portfolioChange24h = actualBalance - oldBalance;
		
		obj.put("balance_change_24h", round(portfolioChange24h, 2));
		Double percentage_change_24h = portfolioChange24h / oldBalance * 100;
		obj.put("balance_change_24h_percentage", round(percentage_change_24h, 2));
	}
	
	private Double calculatePortfolioBalance(Portfolio portfolio) {
		Map <Crypto, Double> cryptoMap = portfolio.getCryptoMap();
		Double totalValue = 0.0;
		
		for(Crypto crypto : cryptoMap.keySet()) {
			totalValue += TopCryptos.getInstance().getSupportedCryptoPrice(crypto.getTicker()) * cryptoMap.get(crypto);
		}
		
		return totalValue;
	}
	
	@SuppressWarnings("unchecked")
	public JSONObject getPortfolioInfo(String username) throws SQLException {
		JSONObject response = new JSONObject();
		Portfolio portfolio = PortfolioDaoJDBC.getInstance().get(username);
		Double actualBalance = calculatePortfolioBalance(portfolio);
		
		response.put("portfolio_name", portfolio.getPortfolioName());
		response.put("balance", actualBalance);
		
		JSONArray assets = new JSONArray();
		
		Map <String, Double> avgPrices = new HashMap<>();
		Map <String, Double> dollarProfit = new HashMap<>();
		Map <String, Double> percentageProfit = new HashMap<>();
		getPriceInfo((ArrayList<Transaction>) portfolio.getTransactionList(), dollarProfit, avgPrices, percentageProfit);
		
		for(Crypto crypto : portfolio.getCryptoMap().keySet()) {
			JSONObject cryptoObj = new JSONObject();
			cryptoObj.put("id", crypto.getIdApi());
			cryptoObj.put("logo", TopCryptos.getInstance().getSupportedCryptoLogo(crypto.getTicker()));
			cryptoObj.put("name", crypto.getName());
			cryptoObj.put("ticker", crypto.getTicker());
			cryptoObj.put("price", TopCryptos.getInstance().getSupportedCryptoPrice(crypto.getTicker()));
			cryptoObj.put("change_24h", TopCryptos.getInstance().getSupportedCrypto24hChange(crypto.getTicker()));
			cryptoObj.put("change_7d", TopCryptos.getInstance().getSupportedCrypto7dChange(crypto.getTicker()));
			cryptoObj.put("holdings", round(portfolio.getCryptoMap().get(crypto), 6) + " " + crypto.getTicker().toUpperCase());
			cryptoObj.put("holding_dollar", portfolio.getCryptoMap().get(crypto) * TopCryptos.getInstance().getSupportedCryptoPrice(crypto.getTicker()));
			cryptoObj.put("avg_buy_price", avgPrices.get(crypto.getTicker()));
			cryptoObj.put("profit_dollar", dollarProfit.get(crypto.getTicker()));
			cryptoObj.put("profit_percentage", percentageProfit.get(crypto.getTicker()));
			
			assets.add(cryptoObj);
		}
		
		response.put("assets", assets);
		
		return response;
	}
	
	private void getPriceInfo(ArrayList<Transaction> transactionList, Map <String, Double> profitDollar,
			                  Map <String, Double> avgPrices, Map <String, Double> profitPercentage) {
		
		Map <String, Double> dollarSpent = new HashMap<>();
		Map <String, Double> cryptoQuantityAvg = new HashMap<>();
		Map <String, Double> totalBalance = new HashMap<>();
		Map <String, Double> totalCryptoInPortfolio = new HashMap<>();
		
		for(Transaction transaction : transactionList) {
			String ticker = transaction.getCryptoTicker();
			if(transaction.getType() == Transaction.BUY) {
				cryptoQuantityAvg.put(ticker, cryptoQuantityAvg.getOrDefault(ticker, 0.0) + transaction.getQuantity());
				dollarSpent.put(ticker, dollarSpent.getOrDefault(ticker, 0.0) + transaction.getTotalUsdSpent());
				
				totalBalance.put(ticker, totalBalance.getOrDefault(ticker, 0.0) - transaction.getTotalUsdSpent());
				totalCryptoInPortfolio.put(ticker, totalCryptoInPortfolio.getOrDefault(ticker, 0.0) + transaction.getQuantity());
			}
			
			if(transaction.getType() == Transaction.SELL) {
				totalBalance.put(ticker, totalBalance.getOrDefault(ticker, 0.0) + transaction.getTotalUsdSpent());
				totalCryptoInPortfolio.put(ticker, totalCryptoInPortfolio.get(ticker) - transaction.getQuantity());
			}
			
			if(transaction.getType() == Transaction.TRANSFER) {
				totalCryptoInPortfolio.put(ticker, totalCryptoInPortfolio.get(ticker) - transaction.getQuantity());
			}
		}
		
		for(String ticker : dollarSpent.keySet()) {
			Double avg = dollarSpent.get(ticker);
			avg = avg / cryptoQuantityAvg.get(ticker);
			avgPrices.put(ticker, avg);
			
			Double balance = totalBalance.get(ticker);
			Double liquidValue = TopCryptos.getInstance().getSupportedCryptoPrice(ticker);
			liquidValue = liquidValue * totalCryptoInPortfolio.get(ticker);
			balance = balance + liquidValue;
			Double totalSpent = dollarSpent.get(ticker);
			
			Double percentage = balance;
			percentage = percentage / totalSpent;
			percentage *= 100;
			profitPercentage.put(ticker, round(percentage, 2));
			profitDollar.put(ticker, round(balance, 2));
		}
	}
	
	private static double round(double value, int places) {
	    if (places < 0) throw new IllegalArgumentException();

	    BigDecimal bd = new BigDecimal(Double.toString(value));
	    bd = bd.setScale(places, RoundingMode.HALF_UP);
	    return bd.doubleValue();
	}
}
