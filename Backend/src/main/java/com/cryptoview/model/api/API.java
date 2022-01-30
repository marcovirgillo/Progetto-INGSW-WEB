package com.cryptoview.model.api;

import java.time.LocalDate;

public class API {

	public static API instance = null;
	private final String newsAPIKey[] = {"5b515b57ab5945328c3e6b2a0456aded", "5d711f7e4dc7434bb70e91331a269d34", "42d4fff021654ddcb5448c22ad99c88b", "98bad8fc685b45d3b8275254d25a0cf1"};
	private final String newsAPIPart1 = "https://newsapi.org/v2/everything?domains=cointelegraph.com&pageSize=";
	private final String newsAPIPart2 = "&apiKey=";
	private final String newsExchangesAPI = "https://newsapi.org/v2/everything?domains=cointelegraph.com&pageSize=8&q=exchange&apiKey=";
	

	private final String topAPIPart1 = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=";
	private final String topAPIPart2 = "&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d";
	
	private final String marketStatsAPI = "https://api.coingecko.com/api/v3/global";
	
	private final String exchangesAPI = "https://api.coingecko.com/api/v3/exchanges";
	
	private final String criptoDataAPIPart1 = "https://api.coingecko.com/api/v3/coins/";
	private final String criptoDatatAPIpart2 = "?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false";
	
	private final String criptoHistoryAPIPart1 = "https://api.coingecko.com/api/v3/coins/";
	private final String cryptoHistoryAPIPart2 = "/market_chart?vs_currency=usd&days=";
	
	private final String popularNewsKeyPart1 = "https://newsapi.org/v2/everything?from=";
	private final String popularNewsKeyPart2 = "&to=";
	private final String popularNewsKeyPart3 = "&domains=cointelegraph.com,coindesk.com&pageSize=4&sortBy=popularity&apiKey=";
	
	
	private final String allLatestNewsKey = "https://newsapi.org/v2/everything?domains=cointelegraph.com,coindesk.com&pageSize=100&sortBy=publishedAt&apiKey=";		
	
	private final String preferredNewsPart1 = "https://newsapi.org/v2/everything?";
	private final String preferredNewsPart2 = "domains=cointelegraph.com&pageSize=20&sortBy=publishedAt&apiKey=";
	
	private int newsKeyIndex = 0;
	
	private API() {}
	
	public static API getInstance() {
		if (instance == null)
			instance = new API();
		return instance;
	}
	
	private String getNewsKey() {
		String key = newsAPIKey[newsKeyIndex];
		newsKeyIndex++;
		if(newsKeyIndex == newsAPIKey.length)
			newsKeyIndex = 0;
		return key;
	}
	
	public String getNewsAPI(int number) {
		return newsAPIPart1 + number + newsAPIPart2 + getNewsKey();
	}
	
	public String getTopAPI(int number) {
		return topAPIPart1 + number + topAPIPart2;
	}
	
	public String getCriptoDataAPI(String id) {
		return criptoDataAPIPart1 + id + criptoDatatAPIpart2;
	}
	
	public String getCriptoHistoryAPI(String id, String timeStamp) {
		return criptoHistoryAPIPart1 + id + cryptoHistoryAPIPart2 + timeStamp;
	}
	
	public String getMarketStatsAPI() {
		return marketStatsAPI;
	}
	
	public String getExchangesAPI() {
		return exchangesAPI;
	}
	
	public String getNewsExchangesAPI() {
		return newsExchangesAPI + getNewsKey();
	}
	
	public String getPopularNewsKey() {
		LocalDate currentDate = LocalDate.now();
		LocalDate yesterdayDate = currentDate.minusDays(1);
		
		String currentDateString = currentDate.toString();
		String yesterdayDateString = yesterdayDate.toString();
		
		return popularNewsKeyPart1 + yesterdayDateString + popularNewsKeyPart2 + currentDateString + popularNewsKeyPart3 + getNewsKey();
	
	}
	
	public String getAllNewsKey() {
		return allLatestNewsKey + getNewsKey();
	}
	
	public String getPreferredNewsPart1() {
		return preferredNewsPart1;
	}
	
	public String getPreferredNewsPart2() {
		return preferredNewsPart2 + getNewsKey();
	}

	public int getNumberOfKeys() {
		return newsAPIKey.length;
	}

	public String getCurrentAPIKey() {
		if(newsKeyIndex==0)
			return newsAPIKey[newsAPIKey.length - 1];
		return newsAPIKey[newsKeyIndex - 1];
	}
}
