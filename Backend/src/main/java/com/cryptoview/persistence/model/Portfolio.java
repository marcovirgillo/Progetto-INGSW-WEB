package com.cryptoview.persistence.model;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import com.cryptoview.persistence.model.domain.PortfolioName;

public class Portfolio {
	private String usernameOwner;
	private String dateCreation;
	private PortfolioName portfolioName;
	
	private Map <Crypto, Double> cryptoMap;
	private List <Transaction> transactionList;

	
	public String getUsernameOwner() {
		return usernameOwner;
	}

	public void setUsernameOwner(String usernameOwner) {
		this.usernameOwner = usernameOwner;
	}

	public String getDateCreation() {
		return dateCreation;
	}

	public void setDateCreation(String date_creation) {
		this.dateCreation = date_creation;
	}

	public String getPortfolioName() {
		return portfolioName.toString();
	}
	
	public void setTransactionList(List<Transaction> transactionList) {
		this.transactionList = transactionList;
	}
	
	public List<Transaction> getTransactionList() {
		return transactionList;
	}
	
	public Map<Crypto, Double> getCryptoMap() {
		return cryptoMap;
	}
	
	public void setCryptoMap(Map<Crypto, Double> cryptoMap) {
		this.cryptoMap = cryptoMap;
	}

	public void setPortfolioName(PortfolioName name) {
		this.portfolioName = name;
	}

	public static Portfolio parseFromDB(ResultSet rs) throws SQLException {
		Portfolio portfolio = new Portfolio();
		portfolio.setDateCreation(rs.getString("date_creation"));
		portfolio.setUsernameOwner(rs.getString("username_owner"));
		portfolio.setPortfolioName(new PortfolioName(rs.getString("portfolio_name")));
		return portfolio;
	}

}
