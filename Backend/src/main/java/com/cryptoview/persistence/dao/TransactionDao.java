package com.cryptoview.persistence.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.cryptoview.persistence.model.Transaction;

public class TransactionDao implements Dao<Transaction>{
	
	private static TransactionDao instance;
	
	private final String getAllQuery = "select * from public.Transaction;";
	
	public static TransactionDao getInstance() {
		if(instance == null)
			instance = new TransactionDao();
		
		return instance;
	}

	@Override
	public List<Transaction> getAll() throws SQLException {
		List <Transaction> transactions = new ArrayList<>();
		Statement stm = DBConnection.getInstance().getConnection().createStatement();
		ResultSet rs = stm.executeQuery(getAllQuery);
		while(rs.next()) {
			Transaction transaction = new Transaction();
			transaction.setPortfolioOwner(rs.getString("portfolio_owner"));
			transaction.setCryptoTicker(rs.getString("crypto_ticker"));
			transaction.setType(rs.getString("type").charAt(0));
			transaction.setQuantity(rs.getDouble("quantity"));
			transaction.setPriceUsdCrypto(rs.getDouble("price_usd_crypto"));
			transaction.setTransactionDate(rs.getString("transaction_date"));
			transaction.setTransactionTime(rs.getString("transaction_time"));
			transaction.setTotalUsdSpent(rs.getDouble("total_usd_spent"));
			transactions.add(transaction);
		}
		
		return transactions;
	}
}
