package com.cryptoview.persistence.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class Alert {
	private String ticker;
	
	@JsonIgnore
	private String username;
	
	private Float price;
	
	private Boolean above;
	
	public String getTicker() {
		return ticker;
	}
	public void setTicker(String ticker) {
		this.ticker = ticker;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public Float getPrice() {
		return price;
	}
	public void setPrice(Float price) {
		this.price = price;
	}
	public Boolean getAbove() {
		return above;
	}
	public void setAbove(Boolean above) {
		this.above = above;
	}
	
	
}
