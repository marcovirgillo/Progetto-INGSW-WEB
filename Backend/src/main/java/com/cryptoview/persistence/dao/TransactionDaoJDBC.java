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
	
	private final String getAllQuery = "select * from transaction;";
	private final String queryTransactionUser = "select * from transaction where portfolio_owner=?";
	private final String insertTransaction = "insert into transaction values (nextval('transaction_ids'), ?, ?, ?, ?, ?, ?, ?, ?)";
	private final String updateTransaction = "update transaction set type=?, quantity=?, price_usd_crypto=?, "
										   + "transaction_date=?, transaction_time=? where id=? and portfolio_owner=?";
	private final String deleteTransaction = "delete from transaction where id=? and portfolio_owner=?";
	
	private TransactionDaoJDBC() {}
	
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
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(insertTransaction);
		stm.setString(1, obj.getPortfolioOwner());
		stm.setString(2, obj.getCryptoTicker());
		stm.setString(3, String.valueOf(obj.getType()));
		stm.setDouble(4, obj.getQuantity());
		stm.setDouble(5, obj.getPriceUsdCrypto());
		stm.setDate(6, java.sql.Date.valueOf(obj.getTransactionDate()));
		stm.setTime(7, java.sql.Time.valueOf(obj.getTransactionTime()));
		stm.setDouble(8, obj.getTotalUsdSpent());
		
		stm.execute();
		stm.close();
	}

	@Override
	public List<Transaction> getUserTransactions(String username) throws SQLException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(queryTransactionUser);
		stm.setString(1, username);
		
		ResultSet rs = stm.executeQuery();
		List <Transaction> transactionList = new ArrayList<>();
		while(rs.next()) {
			Transaction transaction = Transaction.parseFromDB(rs);
			transactionList.add(transaction);
		}
		
		stm.close();
		rs.close();
		Collections.sort(transactionList);
		
		return transactionList;
	}

	@Override
	public void removeTransaction(int id, String user) throws SQLException {
		PreparedStatement stm  = DBConnection.getInstance().getConnection().prepareStatement(deleteTransaction);
		stm.setInt(1, id);
		stm.setString(2, user);
		
		stm.execute();
		stm.close();
	}

	@Override
	public void updateTransaction(int id, Transaction newTransaction) throws SQLException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updateTransaction);
		stm.setString(1, String.valueOf(newTransaction.getType()));
		stm.setDouble(2, newTransaction.getQuantity());
		stm.setDouble(3, newTransaction.getPriceUsdCrypto());
		stm.setDate(4, java.sql.Date.valueOf(newTransaction.getTransactionDate()));
		stm.setTime(5, java.sql.Time.valueOf(newTransaction.getTransactionTime()));
		
		stm.setInt(6, id);
		stm.setString(7, newTransaction.getPortfolioOwner());
		
		stm.execute();
		stm.close();
		
	}
}
