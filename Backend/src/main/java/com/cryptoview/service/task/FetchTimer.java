package com.cryptoview.service.task;

import java.sql.SQLException;
import java.sql.Statement;

import org.springframework.beans.factory.DisposableBean;
import org.springframework.stereotype.Component;

import com.cryptoview.service.TopCryptos;
import com.cryptoview.service.TopExchanges;
import com.cryptoview.persistence.dao.DBConnection;
import com.cryptoview.service.LatestNews;
import com.cryptoview.service.MarketStats;

//è la classe che si occupa di processare dati ogni tot tempo, in modo da averli pronti ad ogni richiesta
@Component
public class FetchTimer implements DisposableBean, Runnable {

	//è la frequenza di aggiornamento in millisecondi dei topGainers/worstPerformers
	private final int FREQUENCY_GAINERS = 1000 * 60 * 10; //update ogni 10 minuti
	private final int FREQUENCY_NEWS = 1000 * 60 * 30; //update ogni 30 minuti
	private final int FREQUENCY_TOKEN_EXPIRY = 1000 * 60 * 60 * 24; //24 ore
	
	private long lastUpdateGainers = 0;
	private long lastUpdateNews = 0;
	private long lastUpdateTokenCheck = 0;
	
	private Thread myThread;
	boolean isRunning = true;
	
	public FetchTimer() {
		myThread = new Thread(this);
		this.myThread.start();
	}
	
	@Override
	public void run() {
		while(isRunning) {
			if(System.currentTimeMillis() - lastUpdateGainers > FREQUENCY_GAINERS) {
				updateTopCryptos();
				updateStats();
				updateExchanges();
				
				lastUpdateGainers = System.currentTimeMillis();
			}
			
			if(System.currentTimeMillis() - lastUpdateNews > FREQUENCY_NEWS) {
				//updateLatestNews();
				
				lastUpdateNews = System.currentTimeMillis();
			}
			
			if(System.currentTimeMillis() - lastUpdateTokenCheck > FREQUENCY_TOKEN_EXPIRY) {
				checkExpiredTokens();
				
				lastUpdateTokenCheck = System.currentTimeMillis();
			}
		}
	}

	private void checkExpiredTokens() {
		System.out.println(java.time.LocalDateTime.now() + " CHECKING Expired Tokens");
		String query = "select check_tokens_expiration();";
		try {
			Statement stm = DBConnection.getInstance().getConnection().createStatement();
			stm.execute(query);
			
			stm.close();
		} catch (SQLException e) {
			e.printStackTrace();
			return;
		}
		
		System.out.println(java.time.LocalDateTime.now() + " REMOVED Expired Tokens");
	}

	private void updateStats() {
		System.out.println(java.time.LocalDateTime.now() + " UPDATE Market Statistics");
		MarketStats.getInstance().fetchData();
		System.out.println(java.time.LocalDateTime.now() + " FETCHED Market Statistics");
	}

	private void updateTopCryptos() {
		System.out.println(java.time.LocalDateTime.now() + " UPDATE Crypto Detail");
		TopCryptos.getInstance().fetchData();
		System.out.println(java.time.LocalDateTime.now() + " FETCHED Crypto Detail");
	}

	private void updateExchanges() {
		System.out.println(java.time.LocalDateTime.now() + " UPDATE Exchanges");
		TopExchanges.getInstance().fetchData();
		System.out.println(java.time.LocalDateTime.now() + " FETCHED Exchanges");
	}
	
	private void updateLatestNews() {
		System.out.println(java.time.LocalDateTime.now() + " UPDATE Latest crypto news");
		LatestNews.getInstance().fetchCryptoData();
		System.out.println(java.time.LocalDateTime.now() + " FETCHED Lastest crypto news");
		
		System.out.println(java.time.LocalDateTime.now() + " UPDATE Latest exchanges news");
		LatestNews.getInstance().fetchExchangesData();
		System.out.println(java.time.LocalDateTime.now() + " FETCHED Lastest exchanges news");
		
		System.out.println(java.time.LocalDateTime.now() + " UPDATE Popular news");
		LatestNews.getInstance().fetchPopularNewsData();
		System.out.println(java.time.LocalDateTime.now() + " FETCHED Popular news");
		
		System.out.println(java.time.LocalDateTime.now() + " UPDATE All latest news");
		LatestNews.getInstance().fetchAllLatestNewsData();
		System.out.println(java.time.LocalDateTime.now() + " FETCHED All latest news");
	}
	
	@Override
	public void destroy() throws Exception {
		isRunning = false;
	}
}
