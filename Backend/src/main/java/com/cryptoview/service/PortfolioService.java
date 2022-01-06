package com.cryptoview.service;

public class PortfolioService {

	private PortfolioService instance;
	
	public PortfolioService getInstance() {
		if(instance == null)
			instance = new PortfolioService();
		
		return instance;
	}
	
	
}
