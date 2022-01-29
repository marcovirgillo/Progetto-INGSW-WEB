package com.cryptoview.persistence.model;

import java.sql.ResultSet;
import java.sql.SQLException;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class Preference {
	@JsonIgnore
	private String username; //ignore the username when sending back the list of preferences
	
	private String ticker;
	
	public String getUsername() {
		return username;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
	
	public String getTicker() {
		return ticker;
	}
	
	public void setTicker(String ticker) {
		this.ticker = ticker;
	}
	
	public static Preference parseFromDB(ResultSet rs) throws SQLException {
		Preference preference = new Preference();
		preference.setUsername(rs.getString("username"));
		preference.setTicker(rs.getString("ticker"));
		
		return preference;
	}
}
