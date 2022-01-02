package com.cryptoview.service.task;

import org.springframework.beans.factory.DisposableBean;
import org.springframework.stereotype.Component;

import com.cryptoview.service.TopCryptos;
import com.cryptoview.service.LatestNews;
import com.cryptoview.service.MarketStats;

//è la classe che si occupa di processare dati ogni tot tempo, in modo da averli pronti ad ogni richiesta
@Component
public class GainersTimer implements DisposableBean, Runnable {

	//è la frequenza di aggiornamento in millisecondi dei topGainers/worstPerformers
	private final int FREQUENCY = 1000 * 60 * 10; //update ogni 10 minuti
	
	private long lastUpdate = 0;
	
	private Thread myThread;
	boolean isRunning = true;
	
	public GainersTimer() {
		myThread = new Thread(this);
		this.myThread.start();
	}
	
	@Override
	public void run() {
		while(isRunning) {
			if(System.currentTimeMillis() - lastUpdate > FREQUENCY) {
				updateGainers();
				updateStats();

				lastUpdate = System.currentTimeMillis();
			}
		}
	}

	private void updateStats() {
		System.out.println(java.time.LocalDateTime.now() + " UPDATE Market Statistics");
		MarketStats.getInstance().fetchData();
		System.out.println(java.time.LocalDateTime.now() + " FETCHED Market Statistics");
	}

	private void updateGainers() {
		System.out.println(java.time.LocalDateTime.now() + " UPDATE Gainers");
		TopCryptos.getInstance().fetchData();
		System.out.println(java.time.LocalDateTime.now() + " FETCHED Gainers");
	}

	@Override
	public void destroy() throws Exception {
		isRunning = false;
	}
}
