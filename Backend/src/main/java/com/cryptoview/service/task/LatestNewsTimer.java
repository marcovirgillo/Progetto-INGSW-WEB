package com.cryptoview.service.task;

import org.springframework.beans.factory.DisposableBean;
import org.springframework.stereotype.Component;

import com.cryptoview.service.LatestNews;

//è la classe che si occupa di processare dati ogni tot tempo, in modo da averli pronti ad ogni richiesta
@Component
public class LatestNewsTimer implements DisposableBean, Runnable {

	//è la frequenza di aggiornamento in millisecondi dei topGainers/worstPerformers
	private final int FREQUENCY = 1000 * 60 * 30; //update ogni 30 minuti
	
	private long lastUpdate = 0;
	
	private Thread myThread;
	boolean isRunning = true;
	
	public LatestNewsTimer() {
		myThread = new Thread(this);
		this.myThread.start();
	}
	
	@Override
	public void run() {
		while(isRunning) {
			if(System.currentTimeMillis() - lastUpdate > FREQUENCY) {
				//updateLatestNews();
				
				lastUpdate = System.currentTimeMillis();
			}
		}
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
