package com.cryptoview.persistence.dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import com.cryptoview.persistence.model.Portfolio;

public class PortfolioDaoJDBC extends PortfolioDao {
	
	private static PortfolioDaoJDBC instance = null;
	
	private final String getAllQuery = "select * from portfolio;";
	private final String getUserPortfolio = "select * from portfolio where username_owner=?";
	private final String removeCryptoQuery = "delete from criptoinportfolio where username=? and ticker=?";
	private final String insertPortfolio = "insert into portfolio values(?, now(), ?)";
	private final String removeAllCryptoQuery = "delete from criptoinportfolio where username=?";
	
	private PortfolioDaoJDBC() {}
	
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
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(insertPortfolio);
		stm.setString(1, obj.getUsernameOwner());
		stm.setString(2, obj.getPortfolioName());
		
		stm.execute();
		stm.close();
	}

	@Override
	public Portfolio get(String owner) throws SQLException {
		Portfolio portfolio = null;
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(getUserPortfolio);
		stm.setString(1, owner);
		
		ResultSet rs = stm.executeQuery();
		if(rs.next()) {
			portfolio = Portfolio.parseFromDB(rs);
			portfolio.setTransactionList(TransactionDaoJDBC.getInstance().getUserTransactions(owner));
			portfolio.setCryptoMap(CryptoDaoJDBC.getInstance().getCryptoInPortfolio(owner));
		}
		
		rs.close();
		stm.close();
		
		return portfolio;
	}

	@Override
	public boolean removeCrypto(String ticker, String portfolioOwner) throws SQLException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(removeCryptoQuery);
		stm.setString(1, portfolioOwner);
		stm.setString(2, ticker);
		
		boolean result = stm.execute();
		stm.close();
		
		return result;
	}

	@Override
	public void removeAllCryptos(String portfolio) throws SQLException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(removeAllCryptoQuery);
		stm.setString(1, portfolio);
		
		stm.execute();
		stm.close();	
	}
}
