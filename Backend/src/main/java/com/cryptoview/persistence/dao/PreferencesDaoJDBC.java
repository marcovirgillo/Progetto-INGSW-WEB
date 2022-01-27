package com.cryptoview.persistence.dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.cryptoview.persistence.model.Alert;
import com.cryptoview.persistence.model.Preference;

public class PreferencesDaoJDBC extends PreferencesDao{
	
	private static PreferencesDaoJDBC instance = null;
	
	private String getAllPreferencesQuery = "select * from preferire where username=?";
	private String savePreferenceQuery = "insert into preferire values(?, ?)";
	private String removePreferenceQuery = "delete from preferire where ticker=? and username=?";
	private String findPreference = "select * from preferire where ticker=? and username=?";
	private String saveAlert = "insert into alerts values(default, ?,?,?,?)";
	private String removeAlert = "delete from alerts where id=? and username=?";
	private String getAllAlerts = "select * from alerts where username=?";
	private String getCryptoAlerstQuery = "select * from alerts where ticker=?";
	
	private PreferencesDaoJDBC() {}
	
	public static PreferencesDaoJDBC getInstance() {
		if(instance == null)
			instance = new PreferencesDaoJDBC();
		
		return instance;
	}
	
	@Override
	public List<Preference> getUserPreferences(String username) throws SQLException {
		List<Preference> preferences = new ArrayList<Preference>();
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(getAllPreferencesQuery);
		stm.setString(1, username);
		
		ResultSet rs = stm.executeQuery();
		
		while(rs.next()) {
			Preference preference = Preference.parseFromDB(rs);
			preferences.add(preference);
		}
		
		rs.close();
		stm.close();
		
		return preferences;
	}
	
	@Override
	public boolean save(List<Preference> preferences, String username) throws SQLException {
		int cont = 0;
		for(var i : preferences) {
			if(find(i, username))
				continue;
			
			PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(savePreferenceQuery);
			stm.setString(1, username);
			stm.setString(2, i.getTicker());
			
			stm.executeUpdate();
			stm.close();
			
			cont++;
		}
		
		if(cont != 0) //Se ho aggiunta almeno una
			return true;
		return false; //altrimenti non sono state aggiunte poiché esistevano già
	}
	
	@Override
	public boolean save(Preference preference, String username) throws SQLException {
		if(find(preference, username))
			return false;
		
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(savePreferenceQuery);
		stm.setString(1, username);
		stm.setString(2, preference.getTicker());
		
		stm.executeUpdate();
		stm.close();

		return true;
	}

	@Override
	public boolean remove(List<Preference> preferences, String username) throws SQLException {
		int cont = 0;
		for(var i : preferences) {
			PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(removePreferenceQuery);
			stm.setString(1, i.getTicker());
			stm.setString(2, username);
			
			int rs = stm.executeUpdate();
			
			if(rs!=0)
				cont++;
			
			stm.close();
		}
		if(cont != 0) //Se sono state eliminate righe
			return true;
		return false; //altrimenti non sono state trovate preferenze specificate
	}


	@Override
	public boolean remove(Preference preference, String username) throws SQLException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(removePreferenceQuery);
		stm.setString(1, preference.getTicker());
		stm.setString(2, username);
		
		int rs = stm.executeUpdate();
		
		stm.close();
		
		if(rs == 0)
			return false;
		return true;
	}
	
	private boolean find(Preference preference, String username) throws SQLException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(findPreference);
		stm.setString(1, preference.getTicker());
		stm.setString(2, username);
		
		ResultSet rs = stm.executeQuery();
		
		if(rs.next())
			return true;
		return false;
	}
	
	@Override
	public void save(Alert alert, String username) throws SQLException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(saveAlert);
		stm.setString(1, alert.getCriptoTicker());
		stm.setDouble(2, alert.getTargetPrice());
		stm.setString(3, username);
		stm.setBoolean(4, alert.isAbove());
			
		stm.executeUpdate();	
		stm.close();
	}
	
	@Override
	public boolean removeAlert(Integer id, String username) throws SQLException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(removeAlert);
		stm.setInt(1, id);
		stm.setString(2, username);
		
		int rs = stm.executeUpdate();
		stm.close();
		
		if(rs == 0)
			return false;
		return true;
	}

	public List<Alert> getUserAlerts(String username) throws SQLException {
		List<Alert> alerts = new ArrayList<Alert>();
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(getAllAlerts);
		stm.setString(1, username);
		
		ResultSet rs = stm.executeQuery();
		
		while(rs.next()) {
			Alert alert = Alert.parseFromDB(rs);
			alerts.add(alert);
		}
		
		rs.close();
		stm.close();
		
		return alerts;
	}
	
	@Override
	public List<Alert> getCryptoAlerts(String ticker) throws SQLException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(getCryptoAlerstQuery);
		stm.setString(1, ticker);
		
		ResultSet rs = stm.executeQuery();
		List <Alert> list = new ArrayList <Alert>();
		while(rs.next()) {
			Alert alert = Alert.parseFromDB(rs);
			list.add(alert);
		}
		
		stm.close();
		rs.close();
		
		return list;
	}
}
