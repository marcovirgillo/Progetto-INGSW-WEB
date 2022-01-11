package com.cryptoview.persistence.model;

import java.sql.ResultSet;
import java.sql.SQLException;

public class User {
	
	private String email;
	private String username;
	private byte[] avatar;
	
	public User() {}
	
	public String getEmail() {
		return email;
	}
	
	public void setEmail(String email) {
		this.email = email;
	}
	
	public String getUsername() {
		return username;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
	
	public byte[] getAvatar() {
		return avatar;
	}
	
	public void setAvatar(byte[] avatar) {
		this.avatar = avatar;
	}
	
	public static User parseFromDB(ResultSet rs) throws SQLException {
		User user = new User();
		user.setAvatar(null);
		user.setEmail(rs.getString("email"));
		user.setUsername(rs.getString("username"));
		
		return user;
	}
}
