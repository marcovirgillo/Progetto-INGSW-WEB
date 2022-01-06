package com.cryptoview.model;

public class CryptoDetail implements Comparable <CryptoDetail>{
	private Long rank;
	private String id;
	
	//For Gainers
	private String logo; //Usando imageURL beccare ID per prendere la sparkline di 7 giorni
	private Double change;
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
		this.change = change_24h;
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
	
	public Double getChange() {
		return change;
	}
	
	public void setChange(Double change) {
		this.change = change;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public void setTicker(String ticker) {
		this.ticker = ticker.toUpperCase();
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
		if(this.change > gainerz.change)
			return -1;
		
		if(this.change == gainerz.change)
			return 0;
		
		return 1;
	}
	
}
