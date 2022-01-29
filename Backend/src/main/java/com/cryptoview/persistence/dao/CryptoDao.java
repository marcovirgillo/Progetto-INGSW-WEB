package com.cryptoview.persistence.dao;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import com.cryptoview.persistence.model.Crypto;

public abstract class CryptoDao implements Dao <Crypto> {
	
	public abstract List<Crypto> getAll() throws SQLException;
	public abstract void save(Crypto obj) throws SQLException;
	
	public abstract Map <Crypto, Double> getCryptoInPortfolio(String owner) throws SQLException;

}
