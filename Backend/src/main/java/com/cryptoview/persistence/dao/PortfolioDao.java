package com.cryptoview.persistence.dao;

import java.sql.SQLException;
import java.util.List;

import com.cryptoview.persistence.model.Portfolio;

public abstract class PortfolioDao implements Dao<Portfolio> {
	
	public abstract List<Portfolio> getAll() throws SQLException;
	public abstract void save(Portfolio obj) throws SQLException;
	
	public abstract Portfolio get(String owner) throws Exception;
	public abstract boolean removeCrypto(String ticker, String portfolio) throws SQLException;
	public abstract void removeAllCryptos(String portfolio) throws SQLException;
	
	public abstract void remove(String portfolio) throws SQLException;
}
