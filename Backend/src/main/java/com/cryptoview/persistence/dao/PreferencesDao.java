package com.cryptoview.persistence.dao;

import java.sql.SQLException;
import java.util.List;

import com.cryptoview.persistence.model.Alert;
import com.cryptoview.persistence.model.Preference;

public abstract class PreferencesDao {
	public abstract List<Preference> getUserPreferences(String username) throws SQLException;
	
	//Per la home che consente di aggiungere e rimuovere più preferenze per volta
	public abstract boolean save(List<Preference> preferences, String username) throws SQLException;
	public abstract boolean remove(List<Preference> preferences, String username) throws SQLException;
	
	//Per la singola cripto che consente di selezionare se rendere la cripto preferita o meno
	public abstract boolean save(Preference preferences, String username) throws SQLException;
	public abstract boolean remove(Preference preferences, String username) throws SQLException;
	
	//Per l'aggiunta o rimozione di allerte specificati dagli utenti
	public abstract void save(Alert alert, String username) throws SQLException;
	public abstract boolean remove(Integer id, String username) throws SQLException;
	public abstract List<Alert> getUserAlerts(String username) throws SQLException;
}
