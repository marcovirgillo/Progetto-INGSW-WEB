package com.cryptoview.persistence.dao;

import java.sql.SQLException;
import java.util.List;

import com.cryptoview.persistence.model.User;

public abstract class UserDao implements Dao<User>{

	public abstract List<User> getAll() throws Exception;
	public abstract void save(User obj) throws SQLException;
	
	public abstract User findByToken(String token) throws SQLException;
	public abstract User checkCredentials(String username, String password) throws SQLException;

}
