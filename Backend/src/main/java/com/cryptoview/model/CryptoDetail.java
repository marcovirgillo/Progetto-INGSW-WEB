package com.cryptoview.model;

import org.json.simple.JSONObject;

import com.cryptoview.persistence.dao.CryptoDaoJDBC;

public class CryptoDetail implements Comparable <CryptoDetail>{
	private Long rank;
	private String id;
	
	//For Gainers
	private String logo; //Usando imageURL beccare ID per prendere la sparkline di 7 giorni
	private Double change_24h;
	private Double change_1h;
	private String name;
	private String ticker;
	private String chart_7d;
	
	//For Table
	private Double price;
	private Double change_7d;
	private Long market_cap;
	private Long volume;
	
	
	public CryptoDetail() {
	}
	
	public CryptoDetail(String id, String image, Double change_24h, String name) {
		super();
		this.id = id;
		this.logo = image;
		this.change_24h = change_24h;
		this.name = name;
	}

	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public void setChart7d(String chart7d) {
		this.chart_7d = chart7d;
	}
	
	public String getChart7d() {
		return chart_7d;
	}
	
	public void setLogo(String logo) {
		this.logo = logo;
	}
	
	public String getLogo() {
		return logo;
	}
	
	public Double getChange_24h() {
		return change_24h;
	}
	
	public void setChange_24h(Double change) {
		this.change_24h = change;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public Double getChange_1h() {
		return change_1h;
	}
	
	public void setChange_1h(Double change_1h) {
		this.change_1h = change_1h;
	}
	
	public void setTicker(String ticker) {
		this.ticker = ticker;
	}
	
	public String getTicker() {
		return ticker;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Double getChange_7d() {
		return change_7d;
	}

	public void setChange_7d(Double change_7d) {
		this.change_7d = change_7d;
	}

	public Long getMarket_cap() {
		return market_cap;
	}

	public void setMarket_cap(Long market_cap) {
		this.market_cap = market_cap;
	}

	public long getVolume() {
		return volume;
	}

	public void setVolume(Long volume) {
		this.volume = volume;
	}

	public Long getRank() {
		return rank;
	}

	public void setRank(Long rank) {
		this.rank = rank;
	}
	
	@Override
	public int compareTo(CryptoDetail gainerz) {
		if(this.change_24h == null)
			return 1;
		
		if(gainerz.change_24h == null)
			return -1;
		
		if(this.change_24h > gainerz.change_24h)
			return -1;
		
		if(this.change_24h == gainerz.change_24h)
			return 0;
		
		return 1;
	}
	
	public static CryptoDetail parseFromResponse(JSONObject obj) {
		CryptoDetail crypto = new CryptoDetail();
		crypto.setChange_24h((Double) obj.get("price_change_percentage_24h"));
		crypto.setChange_1h((Double) obj.get("price_change_percentage_1h_in_currency"));
		crypto.setLogo((String) obj.get("image"));
		crypto.setName((String) obj.get("name"));
		crypto.setId((String) obj.get("id"));				
		crypto.setTicker((String) obj.get("symbol"));
		crypto.setChange_7d((Double) obj.get("price_change_percentage_7d_in_currency"));
		
		Object o = obj.get("total_volume");
		Long volume = ((Number) o).longValue();
		crypto.setVolume(volume);
		
		o = obj.get("current_price");
		Double price = ((Number) o).doubleValue();
		crypto.setPrice(price);
		
		crypto.setMarket_cap((Long) obj.get("market_cap"));
		crypto.setRank((Long) obj.get("market_cap_rank"));
		
		crypto.checkNullField();
		
		return crypto;
	}
	
	public static CryptoDetail parseFromSingleResponse(JSONObject obj) {
		CryptoDetail detail = new CryptoDetail();
		detail.setName((String) obj.get("name"));
		detail.setId((String) obj.get("id"));
		detail.setTicker(((String) obj.get("symbol")));
		
		detail.setLogo((String) ((JSONObject) obj.get("image")).get("small"));
		detail.setPrice((Double) ((JSONObject) ((JSONObject) obj.get("market_data")).get("current_price")).get("usd"));
		detail.setChange_24h((Double) ((JSONObject) obj.get("market_data")).get("price_change_percentage_24h"));
		detail.setChange_7d((Double) ((JSONObject) obj.get("market_data")).get("price_change_percentage_7d"));
		detail.setChange_1h((Double) ((JSONObject) ((JSONObject) obj.get("market_data")).get("price_change_percentage_1h_in_currency")).get("usd"));
		
		detail.setMarket_cap(CryptoDetail.getMarketCap(obj));
		detail.setRank((long) 0);
		detail.setVolume(CryptoDetail.getVolume(obj));
		detail.setChart7d(getChart(CryptoDaoJDBC.getInstance().getCrypto(detail.getTicker()).getIdGraphic()));

		detail.checkNullField();
		
		return detail;
	}
	
	private static String getChart(Integer id) {
		if(id == null)
			return "";
		
		return "https://www.coingecko.com/coins/" + id + "/sparkline";
	}
	
	private static Long getMarketCap(JSONObject obj) {
		Object cap = (Object) ((JSONObject) ((JSONObject) obj.get("market_data")).get("market_cap")).get("usd");
		if(cap instanceof Double)
			return ((Double) cap).longValue();
		else if(cap instanceof Long)
			return (Long) cap;
		return 0L;
	}
	
	private static Long getVolume(JSONObject obj) {
		Object vol = (Object) ((JSONObject) ((JSONObject) obj.get("market_data")).get("total_volume")).get("usd");
		if(vol instanceof Double)
			return ((Double) vol).longValue();
		else if(vol instanceof Long)
			return (Long) vol;
		return 0L;
	}
	
	private void checkNullField() {
		if(change_24h == null)
			change_24h = 0.0;
		
		if(change_7d == null)
			change_7d = 0.0;
	}
}
