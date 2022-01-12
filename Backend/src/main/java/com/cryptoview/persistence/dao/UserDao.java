package com.cryptoview.persistence.dao;

import java.sql.SQLException;
import java.util.List;

import com.cryptoview.persistence.model.User;
import com.cryptoview.persistence.model.domain.Password;
import com.cryptoview.persistence.model.domain.Username;

public abstract class UserDao implements Dao<User>{

	public abstract List<User> getAll() throws Exception;
	public abstract void save(User obj) throws SQLException;
	
	public abstract User findByToken(String token) throws SQLException, IllegalArgumentException, NullPointerException;
	public abstract String getToken(String username) throws SQLException;
	public abstract User checkCredentials(Username username, Password password) throws SQLException;
	public abstract void saveToken(String user, String token) throws SQLException;

}
