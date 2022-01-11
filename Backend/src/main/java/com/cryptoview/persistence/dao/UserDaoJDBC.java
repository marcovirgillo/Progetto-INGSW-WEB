package com.cryptoview.persistence.dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import com.cryptoview.persistence.model.User;
import com.cryptoview.utilities.SpringUtil;

public class UserDaoJDBC extends UserDao {

	private static UserDaoJDBC instance;
	
	private String findByTokenQuery = "select * from utente where authToken=?";
	private String checkCredentialsQuery = "select * from utente where username=?";
	
	private UserDaoJDBC() {}
	
	public static UserDaoJDBC getInstance() {
		if(instance == null)
			instance = new UserDaoJDBC();
		
		return instance;
	}
	
	@Override
	public List<User> getAll() throws Exception {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void save(User obj) throws SQLException {
		// TODO Auto-generated method stub	
	}

	@Override
	public User findByToken(String token) throws SQLException {
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
	public User checkCredentials(String username, String password) throws SQLException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(checkCredentialsQuery);
		stm.setString(1, username);
		
		ResultSet rs = stm.executeQuery();
		User utente = null;
		if(rs.next()) {
			String possiblePass = rs.getString("password");
			if (password.equals(possiblePass))
				utente = User.parseFromDB(rs);
			
			/*if(SpringUtil.checkPassword(possiblePass, password))
				utente = User.parseFromDB(rs);*/
		}
		
		rs.close();
		stm.close();
		
		return utente;
		
	}

}
