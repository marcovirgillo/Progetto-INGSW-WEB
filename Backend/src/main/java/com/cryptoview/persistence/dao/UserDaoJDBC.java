package com.cryptoview.persistence.dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import com.cryptoview.persistence.model.User;
import com.cryptoview.persistence.model.domain.Password;
import com.cryptoview.persistence.model.domain.Username;

public class UserDaoJDBC extends UserDao {

	private static UserDaoJDBC instance;
	
	private String findByTokenQuery = "select * from utente where token=?";
	private String checkCredentialsQuery = "select * from utente where username=?";
	private String saveTokenQuery = "update utente set token=? where username=?";
	
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
			if (password.toString().equals(dbPassword))
				utente = User.parseFromDB(rs);
			
			/*if(SpringUtil.checkPassword(possiblePass, password))
				utente = User.parseFromDB(rs);*/
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

}
