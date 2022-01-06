package com.cryptoview.persistence.dao;

import java.sql.SQLException;
import java.util.List;

import com.cryptoview.persistence.model.Crypto;

public class CryptoDaoJDBC extends CryptoDao {

	private static CryptoDaoJDBC instance;
	
	private final String getAllQuery = "select * from crypto;";
	private final String insertCrypto = "insert into crypto values(?,?,?,?);";
	private final String getCryptoPortfolio = "";
	
	public static CryptoDao getInstance() {
		if(instance == null)
			instance = new CryptoDaoJDBC();
		
		return instance;
	}
	
	
	@Override
	public List<Crypto> getAll() throws SQLException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void save(Crypto obj) throws SQLException {
		// TODO Auto-generated method stub
		
	}

	@Override
	public List<Crypto> getCryptoInPortfolio(String owner) throws SQLException {
		// TODO Auto-generated method stub
		return null;
	}

}
