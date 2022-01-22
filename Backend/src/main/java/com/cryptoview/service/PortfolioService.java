package com.cryptoview.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.cryptoview.model.api.TopCryptoFetcher;
import com.cryptoview.persistence.dao.CryptoDaoJDBC;
import com.cryptoview.persistence.dao.TransactionDaoJDBC;
import com.cryptoview.persistence.model.Crypto;
import com.cryptoview.persistence.model.Portfolio;
import com.cryptoview.persistence.model.Transaction;

public class PortfolioService {

	private static PortfolioService instance;
	private Map <String, Double> portfolioValue24hOld;
 	
	public class Pair <T1, T2> {
		public T1 first;
		public T2 second;
		
		public Pair(T1 first, T2 second) {
			this.first = first;
			this.second = second;
		}
		
		public Pair() {}
	}
	
	private PortfolioService() {
		portfolioValue24hOld = new HashMap<>();
	}
	
	public static  PortfolioService getInstance() {
		if(instance == null)
			instance = new PortfolioService();
		
		return instance;
	}
	
	@SuppressWarnings("unchecked")
	public JSONObject getPortfolioInfo(Portfolio portfolio) throws SQLException {
		JSONObject response = new JSONObject();
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
			cryptoObj.put("holdings", formatHoldingStr(portfolio.getCryptoMap().get(crypto)) + " " + crypto.getTicker().toUpperCase());
			cryptoObj.put("holding_dollar", portfolio.getCryptoMap().get(crypto) * TopCryptos.getInstance().getSupportedCryptoPrice(crypto.getTicker()));
			cryptoObj.put("avg_buy_price", avgPrices.get(crypto.getTicker()));
			cryptoObj.put("profit_dollar", dollarProfit.get(crypto.getTicker()));
			cryptoObj.put("profit_percentage", percentageProfit.get(crypto.getTicker()));
			
			assets.add(cryptoObj);
		}
		
		response.put("assets", assets);
		
		return response;
	}
	
	@SuppressWarnings("unchecked")
	public JSONObject getPortfolioValueTime(Portfolio userPortfolio, String timestamp) throws SQLException {
		ArrayList <Crypto> cryptoPortfolio = getCryptoEverPresentInPortfolio(userPortfolio);
		ArrayList <Transaction> portfolioTransactions = (ArrayList<Transaction>) userPortfolio.getTransactionList();
		
		if(portfolioTransactions.size() == 0)
			return getEmptyPortfolioValue(timestamp);
		
		//per ogni cripto, mappo lo storico di prezzi come coppia timestamp-prezzo
		Map <String, ArrayList <Pair<Long, Double>>> cryptoPricesOverTime = new HashMap<>();
		
		//è la lista con tutti i timestamp, per cui calcolo il valore del portfolio
		ArrayList <Long> timestampList = new ArrayList<>();
				
		for(Crypto crypto : cryptoPortfolio) {
			JSONArray history = TopCryptoFetcher.getInstance().fetchCryptoHistoricprices(crypto.getIdApi(), timestamp);
			
			//per ogni cripto, recupero lo storico dei prezzi e lo inserisco nella mappa di liste
			ArrayList <Pair<Long, Double>> cryptoPrices = new ArrayList<>();
			for(Object value : history) {
				JSONArray arr = (JSONArray) value;
				
				Long cryptoTimestamp = (Long) arr.get(0);
				Double price = (Double) arr.get(1);
				
				cryptoPrices.add(new Pair <Long, Double>(cryptoTimestamp, price));
				timestampList.add(cryptoTimestamp);
			}
			
			cryptoPricesOverTime.put(crypto.getTicker(), cryptoPrices);
		}
		
		removeDuplicatesAndSort(timestampList, timestamp);
		
		//mi dice le quantitò di cripto che ho all'inizio del periodo di riferimento del portfolio
		//rimangono da calcolare solo le transazioni non ancora avvenute
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
					if(transaction.getType() == Transaction.BUY || transaction.getType() == Transaction.TRANSFER_IN)
						cryptoQuantity.put(ticker, cryptoQuantity.get(ticker) + transaction.getQuantity());
					else 
						cryptoQuantity.put(ticker, cryptoQuantity.get(ticker) - transaction.getQuantity());
					
					transactionIterator.remove();
				}
			}
			
			
			//per ogni cripto presente nel portfolio all'istante di tempo che sto considerando, calcolo il valore
			//come quantità * prezzo storico, dove il prezzo storico è nella lista di prezzi storici
			boolean incomplete = false;
			for(String cryptoTicker : cryptoQuantity.keySet()) {
				Double cryptoQuant = cryptoQuantity.get(cryptoTicker);
				
				ArrayList <Pair<Long, Double>> cryptoPrices = cryptoPricesOverTime.get(cryptoTicker);				
				Double price = findPrice(time, cryptoPrices);
				
				//se per una cripto trovo quantità diversa da zero, e prezzo zero, significa che ancora
				//non c'è in prezzo in quel timestamp, e il calcolo è quindi incompleto
				if(cryptoQuant != 0 && price == 0.0)
					incomplete = true;

				valueAtTimeZeroDollar += cryptoQuant * price;
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
			portfolioValue24hOld.put(userPortfolio.getUsernameOwner(), (Double) ((JSONObject) portfolioValueOverTime.get(0)).get("value"));
		
		JSONObject resp = new JSONObject();
		insertPortfolioChangeData(resp, userPortfolio);
		resp.put("data", portfolioValueOverTime);
		
		return resp;
	}
	
	private Double findPrice(Long timeBeginning, ArrayList<Pair<Long, Double>> cryptoPrices) {
		//prendo il primo prezzo superiore al timeBeginning, quindi quello piu' vicino
		for(Pair <Long, Double> pair : cryptoPrices) {
			if(pair.first >= timeBeginning)
				return pair.second;
		}
		
		return 0.0;
	}

	//per ogni chart interval, restituisco l'intervallo di tempo tra due valori
	// es per un chart 24h, restituisco un intervallo di 60 secondi
	private int getTimesInterval(String chartInterval) {
		if(chartInterval.equals("1"))
			return 60000; //sono 60 secondi, in millisecondi
		else if(chartInterval.equals("7"))
			return 1800000; //30 minuti
		else if(chartInterval.equals("30"))
			return 3600000; //un'ora
		else if(chartInterval.equals("90"))
			return 7200000; //due ore
		else if(chartInterval.equals("360"))
			return 86400000; //un giorno
		
		return 1000;
		
	}
	
	//ordino l'array di timestamp per il portfolio, e rimuovo i valori dentro l'intervallo per ridurre le operazioni da fare
	private void removeDuplicatesAndSort(ArrayList<Long> timestampList, String chartInterval) {
		Collections.sort(timestampList);
		
		//se due valori di tempo consecutivi sono troppo vicini, rimuovo il successivo
		for(int i = 0; i < timestampList.size() - 1;) {
			if(timestampList.get(i+1) - timestampList.get(i) <= getTimesInterval(chartInterval))
				timestampList.remove(i+1);
			else 
				++i;
		}
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
	//considero quindi tutte le transazione avvenute prima di quella data
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
			
			if(transaction.getType() == Transaction.BUY || transaction.getType() == Transaction.TRANSFER_IN)
				cryptoQuantityMap.put(ticker, cryptoQuantityMap.get(ticker) + transaction.getQuantity());
			else 
				cryptoQuantityMap.put(ticker, cryptoQuantityMap.get(ticker) - transaction.getQuantity());
			
			transactionIterator.remove();
			
		}
		
		return cryptoQuantityMap;
	}	
	
	
	@SuppressWarnings("unchecked")
	private JSONObject getEmptyPortfolioValue(String timestamp) {
		JSONArray history = TopCryptoFetcher.getInstance().fetchCryptoHistoricprices("bitcoin", timestamp);
		JSONArray newArr = new JSONArray();
		
		for(Object obj : history) {
			JSONArray arr = (JSONArray) obj;
			JSONObject item = new JSONObject();
			
			item.put("time", (Long) arr.get(0));
			item.put("value",  0.0);
			
			newArr.add(item);
		}
		JSONObject resp = new JSONObject();
		resp.put("balance_change_24h", 0.0);
		resp.put("balance_change_24h_percentage", 0.0);
		resp.put("data", newArr);
		
		return resp;
	}

	@SuppressWarnings("unchecked")
	private void insertPortfolioChangeData(JSONObject obj, Portfolio portfolio) {
		Double actualBalance = calculatePortfolioBalance(portfolio);
		Double oldBalance = portfolioValue24hOld.getOrDefault(portfolio.getUsernameOwner(), 0.0);
		Double portfolioChange24h = actualBalance - oldBalance;
		
		obj.put("balance_change_24h", round(portfolioChange24h, 2));
		Double percentage_change_24h = 0.0;
		if(oldBalance == 0.0)
			percentage_change_24h = 100.0;
		else 
			percentage_change_24h = portfolioChange24h / oldBalance * 100;
		obj.put("balance_change_24h_percentage", round(percentage_change_24h, 2));
		obj.put("balance", actualBalance);
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
	public JSONObject getPortfolioOverview(Portfolio portfolio) throws SQLException {
		//se non ho il valore del portfolio di 24h fa, chiamo la funzione che calcola il chart, perchè il valore vienne
		//aggiornato là, quando il timestamp è 1
		if(portfolioValue24hOld.get(portfolio.getUsernameOwner()) == null)
			getPortfolioValueTime(portfolio, "1");
		
		JSONObject resp = new JSONObject();
		insertPortfolioChangeData(resp, portfolio);
		
		Double balance_change_24h = (Double) resp.get("balance_change_24h");
		Double btcPrice = TopCryptos.getInstance().getBitcoinPrice();
		
		Double balance_change_btc = 0.0;
		if(btcPrice != 0.0)
			balance_change_btc = balance_change_24h / btcPrice;
		
		resp.put("balance_change_btc", balance_change_btc);
		return resp;
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
				totalCryptoInPortfolio.put(ticker, totalCryptoInPortfolio.getOrDefault(ticker, 0.0) - transaction.getQuantity());
			}
			
			if(transaction.getType() == Transaction.TRANSFER_OUT) {
				totalCryptoInPortfolio.put(ticker, totalCryptoInPortfolio.getOrDefault(ticker, 0.0) - transaction.getQuantity());
			}
			
			if(transaction.getType() == Transaction.TRANSFER_IN) {
				totalCryptoInPortfolio.put(ticker, totalCryptoInPortfolio.getOrDefault(ticker, 0.0) + transaction.getQuantity());
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
	
	@SuppressWarnings("unchecked")
	public JSONArray getCriptoTransactionOfUser(Portfolio portfolio, String ticker) throws SQLException {
		List <Transaction> transactions = TransactionDaoJDBC.getInstance().getUserTransactions(portfolio.getUsernameOwner());
		JSONArray array = new JSONArray();
		for(Transaction transaction : transactions) {
			if(transaction.getCryptoTicker().equalsIgnoreCase(ticker)) {
				JSONObject obj = new JSONObject();
				
				obj.put("type", fomatType(transaction.getType()));
				obj.put("quantity", formatHoldingStr(transaction.getQuantity()) + " " + ticker.toUpperCase());
				obj.put("quantity_cripto", transaction.getQuantity());
				obj.put("quantity_usd", transaction.getTotalUsdSpent());
				obj.put("date", transaction.getTransactionDatestamp());
				obj.put("cripto_price", transaction.getPriceUsdCrypto());
				obj.put("id", transaction.getId());
				
				array.add(obj);
			}
		}
		
		return array;
	}
	
	private String fomatType(char type) {
		switch(type) {
			case 'b':
				return "Buy";
			
			case 's':
				return "Sell";
				
			case 'i':
				return "Transfer In";
				
			case 'o':
				return "Transfer Out";
		}
		
		return "";
	}

	private static double round(double value, int places) {
	    if (places < 0) throw new IllegalArgumentException();
	 
	    BigDecimal bd = new BigDecimal(Double.toString(value));
	    bd = bd.setScale(places, RoundingMode.HALF_UP);
	    return bd.doubleValue();
	}
	
	private String formatHoldingStr(double value) {
		String str = roundHoldings(value);
		String val = str.replace(",", ".");
		int dotPos = val.indexOf('.');
		int positions = 0;
		for(int i = dotPos; i > 0; --i) {
			if(positions >= 3) {
				val = val.substring(0, i) + "," + val.substring(i);
				positions = 0;
			}
			
			positions++;
		}
		
		return val;
	}
	
	private String roundHoldings(double val) {
		if(val == 0)
			return "0.0";
		else if (val >= 1) {
			if(val < 10000)
				return String.valueOf(round(val, 4));
			else if(val < 1000000)
				return String.format("%." + 2 + "f", val);
			
			return String.format("%." + 1 + "f", val);
		} 
		else if (val < 1) {
			double valTmp = val;
			int decimals = 0;
			while(valTmp < 1) {
				valTmp *= 10;
				decimals++;
			}
			
			return String.format("%." + (decimals + 1) + "f", val);
		}
		
		return "";
	}
}
