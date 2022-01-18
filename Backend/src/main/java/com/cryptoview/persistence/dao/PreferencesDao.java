package com.cryptoview.persistence.dao;

import java.sql.SQLException;
import java.util.List;

import com.cryptoview.persistence.model.Preference;

public abstract class PreferencesDao {
	public abstract List<Preference> getUserPreferences(String username) throws SQLException;
	
	//Per la home che consente di aggiungere e rimuovere più preferenze per volta
	public abstract boolean save(List<Preference> preferences, String username) throws SQLException;
	public abstract boolean remove(List<Preference> preferences, String username) throws SQLException;
	
	//Per la singola cripto che consente di selezionare se rendere la cripto preferita o meno
	public abstract boolean save(Preference preferences, String username) throws SQLException;
	public abstract boolean remove(Preference preferences, String username) throws SQLException;
}
