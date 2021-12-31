package com.cryptoview.prova;

public class Cripto {
	private String name;
	private String ticker;
	private String change;
	private String logo;
	
	public Cripto() {
		// TODO Auto-generated constructor stub
	}

	public Cripto(String name, String ticker, String change, String logo) {
		super();
		this.name = name;
		this.ticker = ticker;
		this.change = change;
		this.logo = logo;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getTicker() {
		return ticker;
	}

	public void setTicker(String ticker) {
		this.ticker = ticker;
	}

	public String getChange() {
		return change;
	}

	public void setChange(String change) {
		this.change = change;
	}

	public String getLogo() {
		return logo;
	}

	public void setLogo(String logo) {
		this.logo = logo;
	}
	
	
}
