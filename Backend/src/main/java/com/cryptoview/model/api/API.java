package com.cryptoview.model.api;

public class API {

	public static API instance = null;
	private final String newsAPIKey = "5b515b57ab5945328c3e6b2a0456aded";
	private final String newsAPIPart1 = "https://newsapi.org/v2/everything?domains=cointelegraph.com&pageSize=";
	private final String newsAPIPart2 = "&apiKey=";
	private final String newsExchangesAPI = "https://newsapi.org/v2/everything?domains=cointelegraph.com&pageSize=8&q=exchange&apiKey=5b515b57ab5945328c3e6b2a0456aded";
	private final String topAPIPart1 = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=";
	private final String topAPIPart2 = "&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d";
	private final String marketStatsAPI = "https://api.coingecko.com/api/v3/global";
	private final String exchangesAPI = "https://api.coingecko.com/api/v3/exchanges";
	private final String criptoDataAPIPart1 = "https://api.coingecko.com/api/v3/coins/";
	private final String criptoDatatAPIpart2 = "?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false";
			
	private API() {}
	
	public static API getInstance() {
		if (instance == null)
			instance = new API();
		return instance;
	}
	
	public String getNewsAPI(int number) {
		return newsAPIPart1 + number + newsAPIPart2 + newsAPIKey;
	}
	
	public String getTopAPI(int number) {
		return topAPIPart1 + number + topAPIPart2;
	}
	
	public String getCriptoDataAPI(String id) {
		return criptoDataAPIPart1 + id + criptoDatatAPIpart2;
	}
	
	public String getMarketStatsAPI() {
		return marketStatsAPI;
	}
	
	public String getExchangesAPI() {
		return exchangesAPI;
	}
	
	public String getNewsExchangesAPI() {
		return newsExchangesAPI;
	}
}
