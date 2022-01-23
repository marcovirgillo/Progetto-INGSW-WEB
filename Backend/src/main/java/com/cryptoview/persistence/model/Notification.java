package com.cryptoview.persistence.model;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class Notification {
	
	private int id;
	private String criptoTicker;
	private String criptoId;
	private String criptoName;
	private String username;
	private Double priceChange;
	private Integer priceChangeInterval;
	private String logo;
	
	@JsonIgnore
	private String notificationDate;
	@JsonIgnore
	private String notificationTime;
	
	private Date notificationDatestamp;
	
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
	
	public void setPriceChange(Double priceChange) {
		this.priceChange = priceChange;
	}
	
	public void setPriceChangeInterval(Integer priceChangeInterval) {
		this.priceChangeInterval = priceChangeInterval;
	}
	
	public Double getPrice_Change() {
		return priceChange;
	}
	
	public Integer getPrice_Change_Interval() {
		return priceChangeInterval;
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
	
	private static double round(double value, int places) {
	    if (places < 0) throw new IllegalArgumentException();
	 
	    BigDecimal bd = new BigDecimal(Double.toString(value));
	    bd = bd.setScale(places, RoundingMode.HALF_UP);
	    return bd.doubleValue();
	}
	
	public static Notification parseFromDB(ResultSet rs) throws SQLException {
		Notification notification = new Notification();
		notification.setId(rs.getInt("id"));
		notification.setUsername(rs.getString("username"));
		notification.setPriceChange(round(rs.getDouble("price_change"), 2));
		notification.setPriceChangeInterval(rs.getInt("price_change_interval"));
		notification.setCriptoTicker(rs.getString("cripto_ticker"));
		notification.setNotificationDate(rs.getString("notification_date"));
		notification.setNotificationTime(rs.getString("notification_time"));
		
		try {
			notification.calculateDateStamp();
		} catch (ParseException e) {
			notification.setNotificationDatestamp(Date.from(Instant.now()));
		}
		
		return notification;
	}
	
	
}
