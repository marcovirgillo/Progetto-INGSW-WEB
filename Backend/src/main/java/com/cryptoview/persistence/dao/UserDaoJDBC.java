package com.cryptoview.persistence.dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.cryptoview.persistence.model.User;
import com.cryptoview.persistence.model.domain.Email;
import com.cryptoview.persistence.model.domain.Password;
import com.cryptoview.persistence.model.domain.Username;
import com.cryptoview.utilities.SpringUtil;

public class UserDaoJDBC extends UserDao {

	private static UserDaoJDBC instance;

	private String findByTokenQuery = "select * from utente where token=? and token !=''";
	private String findByEmailQuery = "select * from utente where email=? and email != ''";
	private String findByTokenNoAvatarQuery = "select username, email from utente where token=? and token !=''";
	private String checkCredentialsQuery = "select * from utente where username=?";
	private String saveTokenQuery = "update utente set token=? where username=?";
	private String saveUserQuery = "insert into utente values(?,?, null, '', ?)";
	private String getTokenQuery = "select token from utente where username=?";
	private String updateUserEmailQuery = "update utente set email=? where token=?";
	private String updateUserPasswordQuery = "update utente set password=? where token=?";
	private String updateUserPasswordByEmailQuery = "update utente set password=? where email=?";
	private String updateAvatarQuery = "update utente set avatar=? where token=?";
	private String resetAvatarQuery = "update utente set avatar=null where token=?";
	private String getAllUsers = "select * from utente";
	private String deleteTokenQuery = "delete from tokens where token=?";
	private String checkUserAdmin = "select * from utente where username=? and is_admin=true";
	private String deleteUser = "delete from utente where username=?";
	private String getUserEmail = "select email from utente where username=?";

	private UserDaoJDBC() {
	}

	public static UserDaoJDBC getInstance() {
		if (instance == null)
			instance = new UserDaoJDBC();

		return instance;
	}

	@Override
	public List<User> getAll() throws SQLException {
		Statement stm = DBConnection.getInstance().getConnection().createStatement();
		ResultSet rs = stm.executeQuery(getAllUsers);

		ArrayList<User> users = new ArrayList<>();

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
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(findByTokenNoAvatarQuery);
		stm.setString(1, token);

		ResultSet rs = stm.executeQuery();
		User utente = null;
		if (rs.next()) {
			utente = new User();
			utente.setUsername(new Username(rs.getString("username")));
			utente.setEmail(new Email(rs.getString("email")));
		}

		rs.close();
		stm.close();

		return utente;
	}

	@Override
	public User findByEmail(Email email) throws SQLException, IllegalArgumentException, NullPointerException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(findByEmailQuery);
		stm.setString(1, email.toString());

		ResultSet rs = stm.executeQuery();
		User utente = null;
		if (rs.next()) {
			utente = new User();
			utente.setUsername(new Username(rs.getString("username")));
			utente.setEmail(new Email(rs.getString("email")));
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
		if (rs.next()) {
			String dbPassword = rs.getString("password");

			if (SpringUtil.checkPassword(dbPassword, password.toString()))
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
		if (rs.next())
			token = rs.getString("token");

		rs.close();
		stm.close();

		return token;

	}

	@Override
	public void updateUserEmail(Email email, String token) throws SQLException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updateUserEmailQuery);
		stm.setString(1, email.toString());
		stm.setString(2, token);

		stm.execute();
		stm.close();
	}

	@Override
	public void updateUserPassword(Password newPass, String token) throws SQLException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updateUserPasswordQuery);
		stm.setString(1, SpringUtil.hashPassword(newPass.toString()));
		stm.setString(2, token);

		stm.execute();
		stm.close();
	}

	@Override
	public void updateUserAvatar(byte[] avatar, String token) throws SQLException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updateAvatarQuery);
		stm.setBytes(1, avatar);
		stm.setString(2, token);

		stm.execute();
		stm.close();

	}

	@Override
	public void resetUserAvatar(String token) throws SQLException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(resetAvatarQuery);
		stm.setString(1, token);

		stm.execute();
		stm.close();

	}

	@Override
	public User findByTokenWithAvatar(String token)
			throws SQLException, NullPointerException, IllegalArgumentException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(findByTokenQuery);
		stm.setString(1, token);

		ResultSet rs = stm.executeQuery();
		User utente = null;
		if (rs.next()) {
			utente = User.parseFromDB(rs);
		}

		rs.close();
		stm.close();

		return utente;
	}

	public void deleteToken(String token) throws SQLException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(deleteTokenQuery);
		stm.setString(1, token);

		stm.execute();
		stm.close();
	}

	@Override
	public void updateUserPasswordByEmail(Password newPass, Email email) throws SQLException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updateUserPasswordByEmailQuery);
		stm.setString(1, SpringUtil.hashPassword(newPass.toString()));
		stm.setString(2, email.toString());

		stm.execute();
		stm.close();
	}

	@Override
	public boolean isUserAdmin(Username username) throws SQLException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(checkUserAdmin);
		stm.setString(1, username.toString());
		
		ResultSet rs = stm.executeQuery();
		
		boolean res = false;
		if(rs.next()) 
			res = true;
		
		rs.close();
		stm.close();
		
		return res;
	}

	@Override
	public void removeUser(Username username) throws SQLException {
		//rimuovo tutte le cripto dal portfolio e le transazioni
		PortfolioDaoJDBC.getInstance().removeAllCryptos(username.toString());
		PortfolioDaoJDBC.getInstance().remove(username.toString());
		PreferencesDaoJDBC.getInstance().removeAllUserPreferences(username.toString());
		NotificationDaoJDBC.getInstance().removeAllUserNotifications(username.toString());
		
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(deleteUser);
		stm.setString(1, username.toString());
		
		stm.execute();
		stm.close();
	}

	@Override
	public Email getUserEmail(Username username) throws SQLException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(getUserEmail);
		stm.setString(1, username.toString());
		
		ResultSet rs = stm.executeQuery();
		Email email = null;
		if(rs.next()) {
			email = new Email(rs.getString("email"));
		}
		
		stm.close();
		rs.close();
		
		return email;
	}
}
