package com.cryptoview.persistence.dao;

import java.sql.SQLException;
import java.util.List;

import com.cryptoview.persistence.model.Transaction;

public abstract class TransactionDao implements Dao<Transaction> {
	
	public abstract List<Transaction> getAll() throws SQLException;
	public abstract void save(Transaction obj) throws SQLException;
	public abstract List<Transaction> getUserTransactions(String username) throws SQLException;
	
	public abstract void removeTransaction(int id, String user) throws SQLException;
	public abstract void updateTransaction(int id, Transaction newTransaction) throws SQLException;
}
