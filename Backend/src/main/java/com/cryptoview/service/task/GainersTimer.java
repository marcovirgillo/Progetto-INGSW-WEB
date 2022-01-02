package com.cryptoview.service.task;

import org.springframework.beans.factory.DisposableBean;
import org.springframework.stereotype.Component;

import com.cryptoview.service.CryptoGainers;
import com.cryptoview.service.LatestNews;

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

				lastUpdate = System.currentTimeMillis();
			}
		}
	}

	private void updateGainers() {
		System.out.println(java.time.LocalDateTime.now() + " UPDATE Gainers");
		CryptoGainers.getInstance().fetchData();
		System.out.println(java.time.LocalDateTime.now() + " FETCHED Gainers");
	}

	@Override
	public void destroy() throws Exception {
		isRunning = false;
	}
}
