package com.cryptoview.service;

import java.sql.SQLException;
import java.util.ArrayList;

import org.json.simple.JSONArray;

import com.cryptoview.persistence.dao.CryptoDaoJDBC;
import com.cryptoview.persistence.dao.PortfolioDaoJDBC;
import com.cryptoview.persistence.model.Crypto;
import com.cryptoview.persistence.model.Portfolio;
import com.cryptoview.persistence.model.Transaction;

public class PortfolioService {

	private PortfolioService instance;
	
	private class Pair <T1, T2> {
		public T1 first;
		public T2 second;
	}
	
	public PortfolioService getInstance() {
		if(instance == null)
			instance = new PortfolioService();
		
		return instance;
	}
	
	private ArrayList <JSONArray> getPortfolioValueTime(String user) throws SQLException {
		Portfolio userPortfolio = PortfolioDaoJDBC.getInstance().get(user);
		
		ArrayList <Crypto> cryptoPortfolio = getCryptoEverPresentInPortfolio(userPortfolio);
		return null;
	}

	private ArrayList<Crypto> getCryptoEverPresentInPortfolio(Portfolio userPortfolio) {
		//prendo tutte le cripto che sono state presenti almeno una volta nel portfolio
		ArrayList <String> tickerList = new ArrayList<>();
		for(Transaction transaction : userPortfolio.getTransactionList()) {
			if(!tickerList.contains(transaction.getCryptoTicker()))
				tickerList.add(transaction.getCryptoTicker());
		}
		
		ArrayList <Crypto> cryptoList = new ArrayList<>();
		for(String ticker : tickerList) 
			cryptoList.add(CryptoDaoJDBC.getInstance().getCrypto(ticker));
		
		ArrayList <ArrayList <Pair<Double, Long>>> cryptoPriceTimeList = new ArrayList<>();
		for(Crypto crypto : cryptoList) {
			
		}
	}
}
