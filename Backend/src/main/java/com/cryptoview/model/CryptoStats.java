package com.cryptoview.model;

public class CryptoStats {

	private Integer rank;
	private String image;
	private String ticker;
	private String name;
	private Double price;
	private Double priceChange24h;
	private Double priceChange7d;
	private Integer marketCap;
	private Integer volume;
	private String chart;
	
	public CryptoStats(Integer rank, String image, String ticker, String name, Double price, Double priceChange24h,
			Double priceChange7d, Integer marketCap, Integer volume, String chart) {
		super();
		this.rank = rank;
		this.image = image;
		this.ticker = ticker;
		this.name = name;
		this.price = price;
		this.priceChange24h = priceChange24h;
		this.priceChange7d = priceChange7d;
		this.marketCap = marketCap;
		this.volume = volume;
		this.chart = chart;
	}

	public Integer getRank() {
		return rank;
	}

	public void setRank(Integer rank) {
		this.rank = rank;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public String getTicker() {
		return ticker;
	}

	public void setTicker(String ticker) {
		this.ticker = ticker;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Double getPriceChange24h() {
		return priceChange24h;
	}

	public void setPriceChange24h(Double priceChange24h) {
		this.priceChange24h = priceChange24h;
	}

	public Double getPriceChange7d() {
		return priceChange7d;
	}

	public void setPriceChange7d(Double priceChange7d) {
		this.priceChange7d = priceChange7d;
	}

	public Integer getMarketCap() {
		return marketCap;
	}

	public void setMarketCap(Integer marketCap) {
		this.marketCap = marketCap;
	}

	public Integer getVolume() {
		return volume;
	}

	public void setVolume(Integer volume) {
		this.volume = volume;
	}

	public String getChart() {
		return chart;
	}

	public void setChart(String chart) {
		this.chart = chart;
	}
	
	
	
	
	
}
