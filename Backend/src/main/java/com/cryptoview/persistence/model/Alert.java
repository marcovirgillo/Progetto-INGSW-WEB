package com.cryptoview.persistence.model;

import java.sql.ResultSet;
import java.sql.SQLException;

public class Alert {
	private int id;
	private String criptoName;
	private String criptoTicker;
	private String criptoLogo;
	private Double targetPrice;
	private String username;
	private boolean isAbove;
	
	public int getId() {
		return id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	public String getCriptoName() {
		return criptoName;
	}
	
	public void setCriptoName(String criptoName) {
		this.criptoName = criptoName;
	}
	
	public String getCriptoTicker() {
		return criptoTicker;
	}
	
	public void setCriptoTicker(String criptoTicker) {
		this.criptoTicker = criptoTicker;
	}
	
	public String getCriptoLogo() {
		return criptoLogo;
	}
	
	public void setCriptoLogo(String criptoLogo) {
		this.criptoLogo = criptoLogo;
	}
	
	public Double getTargetPrice() {
		return targetPrice;
	}
	
	public void setTargetPrice(Double targetPrice) {
		this.targetPrice = targetPrice;
	}
	
	public String getUsername() {
		return username;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
	
	public boolean isAbove() {
		return isAbove;
	}
	
	public void setAbove(boolean isAbove) {
		this.isAbove = isAbove;
	}
	
	public static Alert parseFromDB(ResultSet rs) throws SQLException {
		Alert alert = new Alert();
		alert.setId(rs.getInt("id"));
		alert.setAbove(rs.getBoolean("is_above"));
		alert.setCriptoTicker(rs.getString("ticker"));
		alert.setUsername("username");
		alert.setTargetPrice(rs.getDouble("price"));
		
		return alert;
	}
	
}
