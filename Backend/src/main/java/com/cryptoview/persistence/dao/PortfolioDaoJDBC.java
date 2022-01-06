package com.cryptoview.persistence.dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.cryptoview.persistence.model.Crypto;
import com.cryptoview.persistence.model.Portfolio;
import com.cryptoview.persistence.model.Transaction;

public class PortfolioDaoJDBC extends PortfolioDao {
	
	private static PortfolioDaoJDBC instance;
	
	private final String getAllQuery = "select * from portfolio;";
	private final String getUserPortfolio = "select * from portfolio where username_owner=?";
	//private final String insertPortfolio = "insert into portfolio values(?, now(), ?);";
	
	public static PortfolioDaoJDBC getInstance() {
		if(instance == null)
			instance = new PortfolioDaoJDBC();
		
		return instance;
	}

	@Override
	public List<Portfolio> getAll() throws SQLException {
		List <Portfolio> list = new ArrayList<>();
		Statement stm = DBConnection.getInstance().getConnection().createStatement();
		ResultSet rs = stm.executeQuery(getAllQuery);
		while(rs.next()) {
			Portfolio portfolio = Portfolio.parseFromDB(rs);
			list.add(portfolio);
		}
		
		stm.close();
		return list;
	}

	@Override
	public void save(Portfolio obj) throws SQLException {
		// TODO Auto-generated method stub
		
	}

	@Override
	public Portfolio get(String owner) throws SQLException {
		Portfolio portfolio = null;
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(getUserPortfolio);
		stm.setString(1, owner);
		
		ResultSet rs = stm.executeQuery();
		if(rs.next()) {
			portfolio = Portfolio.parseFromDB(rs);
			fillTransaction(portfolio, owner);
			getActualCripto(portfolio);
		}
		
		rs.close();
		
		return portfolio;
	}

	private void fillTransaction(Portfolio portfolio, String owner) throws SQLException {
		List <Transaction> transactionList = TransactionDaoJDBC.getInstance().getUserTransaction(owner);
		portfolio.setTransactionList(transactionList);
	}
	
	private void getActualCripto(Portfolio portfolio) throws SQLException {
		Map <Crypto, Double> cryptoMap = new HashMap <Crypto, Double>();
		for(Transaction transaction : portfolio.getTransactionList()) {
			Crypto crypto = CryptoDaoJDBC.getInstance().getCrypto(transaction.getCryptoTicker());
			
			if(cryptoMap.containsKey(crypto)) {
				if(transaction.getType() == Transaction.BUY)
					cryptoMap.put(crypto, cryptoMap.get(crypto) + transaction.getQuantity());
				else 
					cryptoMap.put(crypto, cryptoMap.get(crypto) - transaction.getQuantity());
			}
			else {
				if(transaction.getType() == Transaction.BUY)
					cryptoMap.put(crypto, transaction.getQuantity());
			}
		}
		
		portfolio.setCryptoMap(cryptoMap);
	}
}
