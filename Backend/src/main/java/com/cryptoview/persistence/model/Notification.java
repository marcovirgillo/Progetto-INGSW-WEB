package com.cryptoview.persistence.model;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;

public abstract class Notification {
	
	@JsonIgnore
	public static final char PRICE = 'p';
	@JsonIgnore
	public static final char ALERT = 'a';
	
	protected int id;
	protected String criptoTicker;
	protected String criptoId;
	protected String criptoName;
	protected String username;
	protected String logo;
	protected char type;
	
	@JsonIgnore
	protected String notificationDate;
	@JsonIgnore
	protected String notificationTime;
	
	protected Date notificationDatestamp;
	
	public int getId() {
		return id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	public void setCriptoId(String criptoId) {
		this.criptoId = criptoId;
	}
	
	public String getCripto_Id() {
		return criptoId;
	}
	
	public void setCriptoName(String criptoName) {
		this.criptoName = criptoName;
	}
	
	public void setType(char type) {
		this.type = type;
	}
	
	public char getType() {
		return type;
	}
	
	public String getCripto_Name() {
		return criptoName;
	}
	
	public void setLogo(String logo) {
		this.logo = logo;
	}
	
	public String getLogo() {
		return logo;
	}
	
	public String getCripto_Ticker() {
		return criptoTicker;
	}
	
	public void setCriptoTicker(String cripto_ticker) {
		this.criptoTicker = cripto_ticker;
	}
	
	public String getUsername() {
		return username;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
	
	public String getNotificationDate() {
		return notificationDate;
	}
	
	public String getNotificationTime() {
		return notificationTime;
	}
	
	public Date getNotification_datestamp() {
		return notificationDatestamp;
	}
	
	public void setNotificationDate(String notificationDate) {
		this.notificationDate = notificationDate;
	}
	
	public void setNotificationDatestamp(Date notificationDatestamp) {
		this.notificationDatestamp = notificationDatestamp;
	}
	
	public void setNotificationTime(String notificationTime) {
		this.notificationTime = notificationTime;
	}
	
	public void calculateDateStamp() throws ParseException {
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
		notificationDatestamp = formatter.parse(notificationDate + " " + notificationTime);
	}	
}
