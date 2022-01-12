package com.cryptoview.persistence.model;

import java.sql.ResultSet;
import java.sql.SQLException;

import com.cryptoview.persistence.model.domain.Email;
import com.cryptoview.persistence.model.domain.Username;

public class User {
	
	private Email email;
	private Username username;
	private byte[] avatar;
	
	public User() {}
	
	public String getEmail() {
		return email.toString();
	}
	
	public void setEmail(Email email) {
		this.email = email;
	}
	
	public String getUsername() {
		return username.toString();
	}
	
	public void setUsername(Username username) {
		this.username = username;
	}
	
	public byte[] getAvatar() {
		return avatar;
	}
	
	public void setAvatar(byte[] avatar) {
		this.avatar = avatar;
	}
	
	public static User parseFromDB(ResultSet rs) throws SQLException, IllegalArgumentException, NullPointerException {
		User user = new User();
		user.setAvatar(null);
		user.setEmail(new Email(rs.getString("email")));
		user.setUsername(new Username(rs.getString("username")));
		
		return user;
	}
}
