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
				updateLatestNews();
				
				lastUpdate = System.currentTimeMillis();
			}
		}
	}

	private void updateLatestNews() {
		System.out.println(java.time.LocalDateTime.now() + " UPDATE Latest news");
		LatestNews.getInstance().fetchData();
		System.out.println(java.time.LocalDateTime.now() + " FETCHED Lastest news");
	}


	@Override
	public void destroy() throws Exception {
		isRunning = false;
	}
}
