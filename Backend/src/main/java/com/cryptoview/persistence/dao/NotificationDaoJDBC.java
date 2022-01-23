package com.cryptoview.persistence.dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.cryptoview.model.CryptoDetail;
import com.cryptoview.persistence.model.Notification;
import com.cryptoview.service.TopCryptos;

public class NotificationDaoJDBC extends NotificationDao {

	private static NotificationDaoJDBC instance = null;
	
	private String addNewNotification = "insert into notification values (default, ?, ?, ?, now(), now(), ?)";
	private String getUserNotification = "select * from notification where username=?";
	private String deleteNotification = "delete from notification where username=? and id=?";
	
	private NotificationDaoJDBC() {}
	
	public static NotificationDaoJDBC getInstance() {
		if(instance == null)
			instance = new NotificationDaoJDBC();
		
		return instance;
	}
	
	@Override
	public List<Notification> getAll() throws SQLException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void save(Notification obj) throws SQLException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(addNewNotification);
		stm.setString(1, obj.getUsername());
		stm.setString(2, obj.getCripto_Ticker());
		stm.setDouble(3, obj.getPrice_Change());
		stm.setInt(4, obj.getPrice_Change_Interval());
		
		stm.execute();
		stm.close();
	}

	@Override
	public List<Notification> getUserNotification(String user) throws SQLException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(getUserNotification);
		stm.setString(1, user);
		
		List <Notification> notifications = new ArrayList<>();
		ResultSet rs = stm.executeQuery();
		
		while(rs.next()) {
			Notification notif = Notification.parseFromDB(rs);
			CryptoDetail crypto = TopCryptos.getInstance().getSupportedCryptoDetail(notif.getCripto_Ticker());
			notif.setLogo(crypto.getLogo());
			notif.setCriptoName(crypto.getName());
			notif.setCriptoId(crypto.getId());
			notifications.add(notif);
		}
		
		rs.close();
		stm.close();
		
		return notifications;
	}

	@Override
	public void remove(Integer id, String user) throws SQLException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(deleteNotification);
		stm.setString(1, user);
		stm.setInt(2, id);
		
		stm.execute();
		stm.close();
	}

}
