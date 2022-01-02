package com.cryptoview.service;

import org.springframework.beans.factory.DisposableBean;
import org.springframework.stereotype.Component;

//è la classe che si occupa di processare dati ogni tot tempo, in modo da averli pronti ad ogni richiesta
@Component
public class BackgroundOperations implements DisposableBean, Runnable {

	//è la frequenza di aggiornamento in millisecondi dei topGainers/worstPerformers
	private final int FETCH_GAINERS_FREQUENCY = 1000 * 60 * 10; //update ogni 10 minuti
	
	private long lastUpdateGainers = 0;
	
	private Thread myThread;
	boolean isRunning = true;
	
	public BackgroundOperations() {
		myThread = new Thread(this);
		this.myThread.start();
	}
	
	@Override
	public void run() {
		while(isRunning) {
			if(System.currentTimeMillis() - lastUpdateGainers > FETCH_GAINERS_FREQUENCY) {
				System.out.println("UPDATE");
				CryptoGainers.getInstance().fetchData();
				System.out.println("FETCHED");
				lastUpdateGainers = System.currentTimeMillis();
			}
		}
	}

	@Override
	public void destroy() throws Exception {
		isRunning = false;
		
	}
}
