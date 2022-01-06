package com.cryptoview.persistence.dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.cryptoview.persistence.model.Transaction;

public class TransactionDaoJDBC extends TransactionDao{
	
	private static TransactionDao instance;
	
	private final String getAllQuery = "select * from Transaction;";
	private final String queryTransactionUser = "select * from transaction where portfolio_owner=?";
	
	public static TransactionDao getInstance() {
		if(instance == null)
			instance = new TransactionDaoJDBC();
		
		return instance;
	}

	@Override
	public List<Transaction> getAll() throws SQLException {
		List <Transaction> transactions = new ArrayList<>();
		Statement stm = DBConnection.getInstance().getConnection().createStatement();
		ResultSet rs = stm.executeQuery(getAllQuery);
		while(rs.next()) {
			Transaction transaction = Transaction.parseFromDB(rs);
			transactions.add(transaction);
		}
		
		stm.close();
		return transactions;
	}

	@Override
	public void save(Transaction obj) throws SQLException {
		// TODO Auto-generated method stub
		
	}

	@Override
	public List<Transaction> getUserTransaction(String username) throws SQLException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(queryTransactionUser);
		stm.setString(1, username);
		
		ResultSet rs = stm.executeQuery();
		List <Transaction> transactionList = new ArrayList<>();
		while(rs.next()) {
			Transaction transaction = Transaction.parseFromDB(rs);
			transactionList.add(transaction);
		}
		
		Collections.sort(transactionList);
		return transactionList;
	}
}
