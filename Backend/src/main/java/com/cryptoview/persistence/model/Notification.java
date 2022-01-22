package com.cryptoview.persistence.model;

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
	private String username;
	private String content;
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
	
	public void setLogo(String logo) {
		this.logo = logo;
	}
	
	public String getLogo() {
		return logo;
	}
	
	public String getCriptoTicker() {
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
	
	public String getContent() {
		return content;
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
	
	public void setContent(String content) {
		this.content = content;
	}
	
	public static Notification parseFromDB(ResultSet rs) throws SQLException {
		Notification notification = new Notification();
		notification.setId(rs.getInt("id"));
		notification.setUsername(rs.getString("username"));
		notification.setContent(rs.getString("notification_content"));
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
