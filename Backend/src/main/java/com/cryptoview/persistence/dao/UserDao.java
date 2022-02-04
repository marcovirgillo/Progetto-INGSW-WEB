package com.cryptoview.persistence.dao;

import java.sql.SQLException;
import java.util.List;

import com.cryptoview.persistence.model.User;
import com.cryptoview.persistence.model.domain.Email;
import com.cryptoview.persistence.model.domain.Password;
import com.cryptoview.persistence.model.domain.Username;

public abstract class UserDao implements Dao<User>{

	public abstract List<User> getAll() throws SQLException;
	public abstract void save(User obj) throws SQLException;
	
	public abstract User findByToken(String token) throws SQLException, IllegalArgumentException, NullPointerException;
	public abstract User findByEmail(Email email) throws SQLException, IllegalArgumentException, NullPointerException;
	public abstract User findByTokenWithAvatar(String token) throws SQLException, IllegalArgumentException, NullPointerException;
	public abstract String getToken(String username) throws SQLException;
	public abstract User checkCredentials(Username username, Password password) throws SQLException;
	public abstract void saveToken(String user, String token) throws SQLException;
	
	public abstract void updateUserEmail(Email emai, String token) throws SQLException;
	public abstract void updateUserAvatar(byte[] avatar, String token) throws SQLException;
	public abstract void resetUserAvatar(String token) throws SQLException;
	public abstract void updateUserPassword(Password newPass, String token) throws SQLException;
	public abstract void updateUserPasswordByEmail(Password newPass, Email email) throws SQLException;
	public abstract void deleteToken(String token) throws SQLException;
	public abstract boolean isUserAdmin(Username username) throws SQLException;
	
	public abstract Email getUserEmail(Username username) throws SQLException;
	public abstract void removeUser(Username username) throws SQLException;

}
