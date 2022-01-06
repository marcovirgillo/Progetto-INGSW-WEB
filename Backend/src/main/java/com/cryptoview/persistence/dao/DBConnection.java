package com.cryptoview.persistence.dao;

import java.sql.Connection;
import java.sql.DriverManager;

public class DBConnection {
	
	private static DBConnection instance;
	private String username = "postgres";
	private String pass = "BX{7BJ}I+x9b[0V1A<O}Io0QdPk7I!";
	private String url = "jdbc:postgresql://cryptoview.cezzkoqixzjw.us-east-1.rds.amazonaws.com/cryptoview";
	
	private Connection dbConnection = null;
	
	public DBConnection() {
		try {
			dbConnection = DriverManager.getConnection(url, username, pass);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public static DBConnection getInstance() {
		if(instance == null)
			instance = new DBConnection();
		
		return instance;
	}
	
	public Connection getConnection() {
		return dbConnection;
	}
}
