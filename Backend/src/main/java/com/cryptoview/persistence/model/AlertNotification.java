package com.cryptoview.persistence.model;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.time.Instant;
import java.util.Date;

public class AlertNotification extends Notification {
	private Double targetPrice;
	private boolean isAbove;
	
	public Double getTarget_Price() {
		return targetPrice;
	}
	
	public void setTargetPrice(Double targetPrice) {
		this.targetPrice = targetPrice;
	}
	
	public boolean isAbove() {
		return isAbove;
	}
	
	public void setAbove(boolean isAbove) {
		this.isAbove = isAbove;
	}
	
	public static AlertNotification parseFromDB(ResultSet rs) throws SQLException {
		AlertNotification notification = new AlertNotification();
		notification.setId(rs.getInt("id"));
		notification.setUsername(rs.getString("username"));
		notification.setCriptoTicker(rs.getString("ticker"));
		notification.setTargetPrice(rs.getDouble("price"));
		notification.setAbove(rs.getBoolean("is_above"));
		notification.setNotificationDate(rs.getString("notification_date"));
		notification.setNotificationTime(rs.getString("notification_time"));
		notification.setType(ALERT);
		
		try {
			notification.calculateDateStamp();
		} catch (ParseException e) {
			notification.setNotificationDatestamp(Date.from(Instant.now()));
		}
		
		return notification;
	}
	
	
}
