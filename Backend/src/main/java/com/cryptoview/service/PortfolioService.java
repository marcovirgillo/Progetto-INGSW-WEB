package com.cryptoview.service;

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
	
	public class Pair <T1, T2> {
		public T1 first;
		public T2 second;
	}
	
	private PortfolioService() {}
	
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
	public JSONArray  getPortfolioValueTime(String user, String timestamp) throws SQLException {
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
			
			//per ogni cripto presente nel portfolio all'istante di tempo che sto considerando, calcolo il valore
			//come quantità * prezzo
			for(String cryptoTicker : cryptoQuantity.keySet()) {
				Double cryptoQuant = cryptoQuantity.get(cryptoTicker);
				
				valueAtTimeZeroDollar += cryptoQuant * cryptoPricesOverTime.get(cryptoTicker).get(i);
			}
			
			pair.second = valueAtTimeZeroDollar;
			
			JSONObject item = new JSONObject();
			item.put("value", valueAtTimeZeroDollar);
			item.put("time", time);
			portfolioValueOverTime.add(item);
		}
		
		return portfolioValueOverTime;
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
		
		response.put("portfolio_name", portfolio.getPortfolioName());
		response.put("balance", calculatePortfolioBalance(portfolio));
		response.put("balance_change_24h", "+ 2.21%");
		response.put("balance_change_24h_percentage", "+ $36.81");
		
		JSONArray assets = new JSONArray();
		
		for(Crypto crypto : portfolio.getCryptoMap().keySet()) {
			JSONObject cryptoObj = new JSONObject();
			cryptoObj.put("id", crypto.getIdApi());
			cryptoObj.put("logo", TopCryptos.getInstance().getSupportedCryptoLogo(crypto.getTicker()));
			cryptoObj.put("name", crypto.getName());
			cryptoObj.put("ticker", crypto.getTicker());
			cryptoObj.put("price", TopCryptos.getInstance().getSupportedCryptoPrice(crypto.getTicker()));
			cryptoObj.put("change_24h", TopCryptos.getInstance().getSupportedCrypto24hChange(crypto.getTicker()));
			cryptoObj.put("change_7d", TopCryptos.getInstance().getSupportedCrypto7dChange(crypto.getTicker()));
			cryptoObj.put("holdings", portfolio.getCryptoMap().get(crypto) + " " + crypto.getTicker().toUpperCase());
			cryptoObj.put("holding_dollar", portfolio.getCryptoMap().get(crypto) * TopCryptos.getInstance().getSupportedCryptoPrice(crypto.getTicker()));
			//TODO
			cryptoObj.put("avg_buy_price", 100.0);
			cryptoObj.put("profit_dollar", 100.0);
			cryptoObj.put("profit_percentage", 10.0);
			
			assets.add(cryptoObj);
		}
		
		response.put("assets", assets);
		
		return response;
	}
	
	
	
}
