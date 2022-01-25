package com.cryptoview.persistence.model;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.time.Instant;
import java.util.Date;

public class PriceNotification extends Notification {
	private Double priceChange;
	private Integer priceChangeInterval;
	
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
	
	private static double round(double value, int places) {
	    if (places < 0) throw new IllegalArgumentException();
	 
	    BigDecimal bd = new BigDecimal(Double.toString(value));
	    bd = bd.setScale(places, RoundingMode.HALF_UP);
	    return bd.doubleValue();
	}
	
	public static PriceNotification parseFromDB(ResultSet rs) throws SQLException {
		PriceNotification notification = new PriceNotification();
		notification.setId(rs.getInt("id"));
		notification.setUsername(rs.getString("username"));
		notification.setPriceChange(round(rs.getDouble("price_change"), 2));
		notification.setPriceChangeInterval(rs.getInt("price_change_interval"));
		notification.setCriptoTicker(rs.getString("cripto_ticker"));
		notification.setNotificationDate(rs.getString("notification_date"));
		notification.setNotificationTime(rs.getString("notification_time"));
		notification.setType(PRICE);
		
		try {
			notification.calculateDateStamp();
		} catch (ParseException e) {
			notification.setNotificationDatestamp(Date.from(Instant.now()));
		}
		
		return notification;
	}

}
