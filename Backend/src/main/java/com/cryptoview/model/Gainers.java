package com.cryptoview.model;

public class Gainers implements Comparable <Gainers>{
	private Integer id;
	private String logo;
	private Double change;
	private String name;
	private String ticker;
	
	public Gainers() {
		// TODO Auto-generated constructor stub
	}
	
	public Gainers(Integer id, String image, Double change_24h, String name) {
		super();
		this.id = id;
		this.logo = image;
		this.change = change_24h;
		this.name = name;
	}

	public Integer getId() {
		return id;
	}
	
	public void setId(Integer id) {
		this.id = id;
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
		this.ticker = ticker;
	}
	
	public String getTicker() {
		return ticker;
	}

	@Override
	public int compareTo(Gainers gainerz) {
		if(this.change > gainerz.change)
			return -1;
		
		if(this.change == gainerz.change)
			return 0;
		
		return 1;
	}
	
}
