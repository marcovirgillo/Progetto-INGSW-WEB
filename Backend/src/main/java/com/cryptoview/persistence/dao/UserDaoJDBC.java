package com.cryptoview.persistence.dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.cryptoview.persistence.model.User;
import com.cryptoview.persistence.model.domain.Password;
import com.cryptoview.persistence.model.domain.Username;
import com.cryptoview.utilities.SpringUtil;

public class UserDaoJDBC extends UserDao {

	private static UserDaoJDBC instance;
	
	private String findByTokenQuery = "select * from utente where token=?";
	private String checkCredentialsQuery = "select * from utente where username=?";
	private String saveTokenQuery = "update utente set token=? where username=?";
	private String saveUserQuery = "insert into utente values(?,?, null, '', ?)";
	private String getTokenQuery = "select token from utente where username=?";
	private String updateUserQuery = "update utente set username=?, email=?, avatar=?";
	private String updateUserPasswordQuery = "update utente set password=? where username=?";
	private String getAllUsers = "select * from utente";
	
	private UserDaoJDBC() {}
	
	public static UserDaoJDBC getInstance() {
		if(instance == null)
			instance = new UserDaoJDBC();
		
		return instance;
	}
	
	@Override
	public List<User> getAll() throws SQLException {
		Statement stm = DBConnection.getInstance().getConnection().createStatement();
		ResultSet rs = stm.executeQuery(getAllUsers);
		
		ArrayList <User> users = new ArrayList<>();
		
		while (rs.next()) {
			User utente = User.parseFromDB(rs);
			users.add(utente);
		}
		
		stm.close();
		rs.close();
		
		return users;
	}

	@Override
	public void save(User obj) throws SQLException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(saveUserQuery);
		stm.setString(1, obj.getEmail());
		stm.setString(2, SpringUtil.hashPassword(obj.getPassword()));
		stm.setString(3, obj.getUsername());
		
		stm.execute();
		
		stm.close();
	}

	@Override
	public User findByToken(String token) throws SQLException, IllegalArgumentException, NullPointerException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(findByTokenQuery);
		stm.setString(1, token);
		
		ResultSet rs = stm.executeQuery();
		User utente = null;
		if(rs.next()) {
			utente = User.parseFromDB(rs);
		}
		
		rs.close();
		stm.close();
		
		return utente;
	}

	@Override
	public User checkCredentials(Username username, Password password) throws SQLException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(checkCredentialsQuery);
		stm.setString(1, username.toString());
		
		ResultSet rs = stm.executeQuery();
		User utente = null;
		if(rs.next()) {
			String dbPassword = rs.getString("password");
			
			if(SpringUtil.checkPassword(dbPassword, password.toString()))
				utente = User.parseFromDB(rs);
		}
		
		rs.close();
		stm.close();
		
		return utente;
		
	}

	@Override
	public void saveToken(String user, String token) throws SQLException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(saveTokenQuery);
		stm.setString(1, token);
		stm.setString(2, user);
		
		stm.execute();
		
		stm.close();
	}

	@Override
	public String getToken(String username) throws SQLException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(getTokenQuery);
		stm.setString(1, username);
		
		ResultSet rs = stm.executeQuery();
		String token = "";
		if(rs.next())
			token = rs.getString("token");
		
		rs.close();
		stm.close();
		
		return token;
		
	}
}
