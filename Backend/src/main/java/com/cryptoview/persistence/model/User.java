package com.cryptoview.persistence.model;

import java.sql.ResultSet;
import java.sql.SQLException;

import com.cryptoview.persistence.model.domain.Email;
import com.cryptoview.persistence.model.domain.Password;
import com.cryptoview.persistence.model.domain.Username;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class User {
	
	@JsonIgnore
	private Password password;
	
	private Email email;
	private Username username;
	private byte[] avatar;
	private boolean isAdmin;
	private boolean isGoogleUser;
	
	public User() {
		this.isAdmin = false;
	}

	public String getEmail() {
		return email.toString();
	}
	
	public boolean isGoogleUser() {
		return isGoogleUser;
	}
	
	public void setGoogleUser(boolean isGoogleUser) {
		this.isGoogleUser = isGoogleUser;
	}
	
	public void setAdmin(boolean isAdmin) {
		this.isAdmin = isAdmin;
	}
	
	public boolean isAdmin() {
		return isAdmin;
	}
	
	public void setEmail(Email email) {
		this.email = email;
	}
	
	public String getUsername() {
		return username.toString();
	}
	
	@JsonIgnore
	public Username getUsernameField() {
		return username;
	}
	
	public void setUsername(Username username) {
		this.username = username;
	}
	
	public byte[] getAvatar() {
		return avatar;
	}
	
	public void setPassword(Password password) {
		this.password = password;
	}
	
	public String getPassword() {
		return password.toString();
	}
	
	public void setAvatar(byte[] avatar) {
		this.avatar = avatar;
	}
	
	public static User parseFromDB(ResultSet rs) throws SQLException, IllegalArgumentException, NullPointerException {
		User user = new User();
		user.setAvatar(rs.getBytes("avatar"));
		user.setEmail(new Email(rs.getString("email")));
		user.setUsername(new Username(rs.getString("username")));
		
		if(rs.getBoolean("is_admin") == true)
			user.setAdmin(true);
		
		String googleId = rs.getString("google_id");
		if(googleId != null && googleId.length() > 0)
			user.setGoogleUser(true);
		
		return user;
	}
}
