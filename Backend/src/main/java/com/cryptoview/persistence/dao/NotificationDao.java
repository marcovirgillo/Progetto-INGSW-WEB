package com.cryptoview.persistence.dao;

import java.sql.SQLException;
import java.util.List;

import com.cryptoview.persistence.model.Notification;

public abstract class NotificationDao implements Dao<Notification> {

	public abstract List<Notification> getAll() throws SQLException;
	public abstract void save(Notification obj) throws SQLException;
	
	public abstract List<Notification> getUserNotification(String user) throws SQLException;
	public abstract void removePriceNotification(Integer id, String user) throws SQLException;
	public abstract void removeAlertNotification(Integer id, String user) throws SQLException;
	
	public abstract void removeAllUserNotifications(String username) throws SQLException;

}
