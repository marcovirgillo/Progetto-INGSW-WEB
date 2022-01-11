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
	private final String insertTransaction = "insert into transaction values (nextval('transaction_ids'), ?, ?, ?, ?, ?, ?, ?, ?)";
	
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
		String portfolioOwner = obj.getPortfolioOwner();
		String cryptoTicker = obj.getCryptoTicker();
		char transactionType = obj.getType();
		double quantity = obj.getQuantity();
		double priceUsdCrypto = obj.getPriceUsdCrypto();
		String transactionDate = obj.getTransactionDate();
		String transactionTime = obj.getTransactionTime();
		double totalUsdSpent = quantity * priceUsdCrypto;
		
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(insertTransaction);
		stm.setString(1, portfolioOwner);
		stm.setString(2, cryptoTicker);
		stm.setString(3, String.valueOf(transactionType));
		stm.setDouble(4, quantity);
		stm.setDouble(5, priceUsdCrypto);
		stm.setString(6,  transactionDate);
		stm.setString(7, transactionTime);
		stm.setDouble(8, totalUsdSpent);
		
		stm.executeQuery();
		stm.close();
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
		stm.close();
		rs.close();
		Collections.sort(transactionList);
		return transactionList;
	}
}
