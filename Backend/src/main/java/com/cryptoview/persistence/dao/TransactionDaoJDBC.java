package com.cryptoview.persistence.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.cryptoview.persistence.model.Transaction;

public class TransactionDaoJDBC extends TransactionDao{
	
	private static TransactionDao instance;
	
	private final String getAllQuery = "select * from Transaction;";
	//private final String getTransactionOfUser = "select * from Transaction where name=?;";
	
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
		// TODO Auto-generated method stub
		return null;
	}
}
