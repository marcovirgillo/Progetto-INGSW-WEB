package com.cryptoview.persistence.dao;

import java.sql.SQLException;
import java.util.List;

import com.cryptoview.persistence.model.Transaction;

public abstract class TransactionDao implements Dao<Transaction> {
	
	public abstract List<Transaction> getAll() throws SQLException;
	public abstract void save(Transaction obj) throws SQLException;
	public abstract List<Transaction> getUserTransaction(String username) throws SQLException;
}
