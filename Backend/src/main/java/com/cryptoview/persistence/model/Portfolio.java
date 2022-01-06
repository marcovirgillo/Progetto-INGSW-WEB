package com.cryptoview.persistence.model;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

public class Portfolio {
	private String usernameOwner;
	private String dateCreation;
	private String portfolioName;
	
	private List <CryptoPair> cryptoList;
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
		return portfolioName;
	}

	public void setPortfolioName(String portfolioName) {
		this.portfolioName = portfolioName;
	}

	public static Portfolio parseFromDB(ResultSet rs) throws SQLException {
		Portfolio portfolio = new Portfolio();
		portfolio.setDateCreation(rs.getString("date_creation"));
		portfolio.setUsernameOwner(rs.getString("username_owner"));
		portfolio.setPortfolioName(rs.getString("portfolio_name"));
		return portfolio;
	}
}
