package com.cryptoview.persistence.model;

import java.sql.ResultSet;
import java.sql.SQLException;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class Transaction {
	
	@JsonIgnore
	public final char BUY = 'b';
	@JsonIgnore
	public final char SELL = 's';
	@JsonIgnore
	public final char TRANSFER = 't';
	
	private String portfolioOwner;
	private String cryptoTicker;
	private char type;
	private double quantity;
	private double priceUsdCrypto;
	private double totalUsdSpent;
	private String transactionDate;
	private String transactionTime;
	
	public String getPortfolioOwner() {
		return portfolioOwner;
	}
	
	public void setPortfolioOwner(String portfolioOwner) {
		this.portfolioOwner = portfolioOwner;
	}
	
	public String getCryptoTicker() {
		return cryptoTicker;
	}
	
	public void setCryptoTicker(String cryptoTicker) {
		this.cryptoTicker = cryptoTicker;
	}
	
	public char getType() {
		return type;
	}
	
	public void setType(char type) {
		this.type = type;
	}
	public double getQuantity() {
		return quantity;
	}
	
	public void setQuantity(double quantity) {
		this.quantity = quantity;
	}
	
	public double getPriceUsdCrypto() {
		return priceUsdCrypto;
	}
	
	public void setPriceUsdCrypto(double priceUsdCrypto) {
		this.priceUsdCrypto = priceUsdCrypto;
	}
	
	public double getTotalUsdSpent() {
		return totalUsdSpent;
	}
	
	public void setTotalUsdSpent(double totalUsdSpent) {
		this.totalUsdSpent = totalUsdSpent;
	}
	
	public String getTransactionDate() {
		return transactionDate;
	}
	
	public void setTransactionDate(String transactionDate) {
		this.transactionDate = transactionDate;
	}
	
	public String getTransactionTime() {
		return transactionTime;
	}
	
	public void setTransactionTime(String transactionTime) {
		this.transactionTime = transactionTime;
	}
	
	public static Transaction parseFromDB(ResultSet rs) throws SQLException {
		Transaction transaction = new Transaction();
		transaction.setPortfolioOwner(rs.getString("portfolio_owner"));
		transaction.setCryptoTicker(rs.getString("crypto_ticker"));
		transaction.setType(rs.getString("type").charAt(0));
		transaction.setQuantity(rs.getDouble("quantity"));
		transaction.setPriceUsdCrypto(rs.getDouble("price_usd_crypto"));
		transaction.setTransactionDate(rs.getString("transaction_date"));
		transaction.setTransactionTime(rs.getString("transaction_time"));
		transaction.setTotalUsdSpent(rs.getDouble("total_usd_spent"));
		return transaction;
	}
	
}
