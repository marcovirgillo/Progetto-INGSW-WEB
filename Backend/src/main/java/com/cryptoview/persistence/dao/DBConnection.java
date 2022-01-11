package com.cryptoview.persistence.dao;

import java.sql.Connection;
import java.sql.DriverManager;

public class DBConnection {
	
	private static DBConnection instance;
	private String username = "rseqigudzofzrm";
	private String pass = "913ee2e42f70c42de7063cc245f39a2c2e94837409e2a2f4ca7a82a6fcceaad9";
	private String url = "jdbc:postgresql://ec2-34-255-21-191.eu-west-1.compute.amazonaws.com/d2dh9n0jn3qvqd";
	
	private Connection dbConnection = null;
	
	private DBConnection() {
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
