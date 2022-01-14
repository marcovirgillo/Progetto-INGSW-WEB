package com.cryptoview.persistence.model;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.Date;

import com.cryptoview.controller.transfers.TransactionData;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class Transaction implements Comparable<Transaction> {
	
	@JsonIgnore
	public static final char BUY = 'b';
	@JsonIgnore
	public static final char SELL = 's';
	@JsonIgnore
	public static final char TRANSFER_IN = 'i';
	@JsonIgnore
	public static final char TRANSFER_OUT = 'o';
	
	private String portfolioOwner;
	private String cryptoTicker;
	private char type;
	private double quantity;
	private double priceUsdCrypto;
	private double totalUsdSpent;
	private String transactionDate;
	private String transactionTime;
	private Date transactionDatestamp;
	
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
	
	public Date getTransactionDatestamp() {
		return transactionDatestamp;
	}
	
	public void calculateDateStamp() throws ParseException {
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
		transactionDatestamp = formatter.parse(transactionDate + " " + transactionTime);
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
	
	public void setTransactionDatestamp(Date transactionDatestamp) {
		this.transactionDatestamp = transactionDatestamp;
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
		try {
			transaction.calculateDateStamp();
		} catch (ParseException e) {
			transaction.setTransactionDatestamp(Date.from(Instant.now()));
		}
		return transaction;
	}

	@Override
	public int compareTo(Transaction t2) {
		if(t2.getTransactionDatestamp().getTime() > this.transactionDatestamp.getTime())
			return -1;
		
		if(t2.getTransactionDatestamp().getTime() < this.transactionDatestamp.getTime())
			return 1;
		
		return 0;
	}

	public static Transaction parseFromdata(TransactionData transaction) throws IllegalArgumentException {
		Transaction transfer = new Transaction();
		transfer.setCryptoTicker(transaction.ticker);
		
		if(transaction.quantity <= 0)
			throw new IllegalArgumentException();
		
		transfer.setQuantity(transaction.quantity);
		
		if(transaction.price_usd_crypto <= 0)
			throw new IllegalArgumentException();
		
		transfer.setPriceUsdCrypto(transaction.price_usd_crypto);
		
		if(transaction.type != BUY && transaction.type != SELL && transaction.type != TRANSFER_IN && transaction.type != TRANSFER_OUT)
			throw new IllegalArgumentException();
		
		transfer.setType(transaction.type);
				
		transfer.setTransactionDate(transaction.transaction_date);
		transfer.setTransactionTime(transaction.transaction_time.split("\\.")[0]);
		
		try {
			transfer.calculateDateStamp();
		} catch (ParseException e) {
			throw new IllegalArgumentException();
		}
		
		transfer.setTotalUsdSpent(transfer.priceUsdCrypto * transfer.quantity);
		
		return transfer;
	}
	
}
