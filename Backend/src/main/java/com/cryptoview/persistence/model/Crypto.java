package com.cryptoview.persistence.model;

import java.sql.ResultSet;
import java.sql.SQLException;

public class Crypto {
	
	private String ticker;
	private String name;
	private Integer idGraphic;
	private String idApi;
	
	public String getTicker() {
		return ticker;
	}
	
	public void setTicker(String ticker) {
		this.ticker = ticker;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public Integer getIdGraphic() {
		return idGraphic;
	}
	
	public void setIdGraphic(Integer idGraphic) {
		this.idGraphic = idGraphic;
	}
	
	public String getIdApi() {
		return idApi;
	}
	
	public void setIdApi(String idApi) {
		this.idApi = idApi;
	}
	
	public static Crypto parseFromDB(ResultSet rs) throws SQLException {
		Crypto crypto = new Crypto();
		crypto.setIdApi(rs.getString("id_api"));
		crypto.setIdGraphic(rs.getInt("id_graphic"));
		crypto.setName(rs.getString("name"));
		crypto.setTicker(rs.getString("ticker"));
		return crypto;
	}
	
	@Override
	public String toString() {
		return ticker;
	}
	
}
