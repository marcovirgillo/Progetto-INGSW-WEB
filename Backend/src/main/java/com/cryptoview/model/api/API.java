package com.cryptoview.model.api;

public class API {

	public static API instance = null;
	private final String newsAPIKey = "5b515b57ab5945328c3e6b2a0456aded";
	private final String newsAPI = "https://newsapi.org/v2/everything?domains=cointelegraph.com&pageSize=8&apiKey=";
	private final String topApiPart1 = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=";
	private final String topApiPart2 = "&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d";

	public static API getInstance() {
		if (instance == null)
			instance = new API();
		return instance;
	}
	
	public String getNewsAPI() {
		return newsAPI + newsAPIKey;
	}
	
	public String getTopAPI(int number) {
		return topApiPart1 + number + topApiPart2;
	}
	
	
	
	
}
