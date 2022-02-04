package com.cryptoview.persistence.dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.cryptoview.model.CryptoDetail;
import com.cryptoview.persistence.model.AlertNotification;
import com.cryptoview.persistence.model.Notification;
import com.cryptoview.persistence.model.PriceNotification;
import com.cryptoview.service.TopCryptos;

public class NotificationDaoJDBC extends NotificationDao {

	private static NotificationDaoJDBC instance = null;
	
	private String addNewNotification = "insert into notification values (default, ?, ?, ?, now(), now(), ?)";
	private String addNewAlertNotification = "insert into alert_notification values (default, ?, ?, ?, ?, now(), now())";
	private String getUserPriceNotification = "select * from notification where username=?";
	private String getUserAlertNotification = "select * from alert_notification where username=?";
	private String deleteNotification = "delete from notification where username=? and id=?";
	private String deleteAlertNotification = "delete from alert_notification where username=? and id=?";
	private String deleteUserPriceNotifications = "delete from notification where username=?";
	private String deleteUserAlertNotifications = "delete from alert_notification where username=?";
	
	private NotificationDaoJDBC() {}
	
	public static NotificationDaoJDBC getInstance() {
		if(instance == null)
			instance = new NotificationDaoJDBC();
		
		return instance;
	}
	
	@Override
	public List<Notification> getAll() throws SQLException {
		//Non serve
		return null;
	}

	@Override
	public void save(Notification obj) throws SQLException {
		if(obj instanceof PriceNotification) {
			PriceNotification notif = (PriceNotification) obj;
			PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(addNewNotification);
			stm.setString(1, notif.getUsername());
			stm.setString(2, notif.getCripto_Ticker());
			stm.setDouble(3, notif.getPrice_Change());
			stm.setInt(4, notif.getPrice_Change_Interval());
			
			stm.execute();
			stm.close();
		}
		else if(obj instanceof AlertNotification){
			AlertNotification notif = (AlertNotification) obj;
			PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(addNewAlertNotification);
			stm.setString(1, notif.getCripto_Ticker());
			stm.setString(2, notif.getUsername());
			stm.setDouble(3, notif.getTarget_Price());
			stm.setBoolean(4, notif.isAbove());
			
			stm.execute();
			stm.close();
		}
	}

	@Override
	public List<Notification> getUserNotification(String user) throws SQLException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(getUserPriceNotification);
		stm.setString(1, user);
		
		List <Notification> notifications = new ArrayList<>();
		ResultSet rs = stm.executeQuery();
		
		while(rs.next()) {
			PriceNotification notif = PriceNotification.parseFromDB(rs);
			CryptoDetail crypto = TopCryptos.getInstance().getSupportedCryptoDetail(notif.getCripto_Ticker());
			notif.setLogo(crypto.getLogo());
			notif.setCriptoName(crypto.getName());
			notif.setCriptoId(crypto.getId());
			notifications.add(notif);
		}
		
		rs.close();
		stm.close();
		
		stm = DBConnection.getInstance().getConnection().prepareStatement(getUserAlertNotification);
		stm.setString(1, user);
		
		rs = stm.executeQuery();
		while(rs.next()) {
			AlertNotification notif = AlertNotification.parseFromDB(rs);
			CryptoDetail crypto = TopCryptos.getInstance().getSupportedCryptoDetail(notif.getCripto_Ticker());
			notif.setLogo(crypto.getLogo());
			notif.setCriptoName(crypto.getName());
			notif.setCriptoId(crypto.getId());
			notifications.add(notif);
		}
		
		stm.close();
		rs.close();
		
		return notifications;
	}

	@Override
	public void removePriceNotification(Integer id, String user) throws SQLException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(deleteNotification);
		stm.setString(1, user);
		stm.setInt(2, id);
		
		stm.execute();
		stm.close();
	}

	@Override
	public void removeAlertNotification(Integer id, String user) throws SQLException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(deleteAlertNotification);
		stm.setString(1, user);
		stm.setInt(2, id);
		
		stm.execute();
		stm.close();
	}

	@Override
	public void removeAllUserNotifications(String username) throws SQLException {
		PreparedStatement stm1 = DBConnection.getInstance().getConnection().prepareStatement(deleteUserAlertNotifications);
		PreparedStatement stm2 = DBConnection.getInstance().getConnection().prepareStatement(deleteUserPriceNotifications);
		
		stm1.setString(1, username);
		stm2.setString(1, username);
		
		stm1.execute();
		stm2.execute();
		
		stm1.close();
		stm2.close();
	}

}
