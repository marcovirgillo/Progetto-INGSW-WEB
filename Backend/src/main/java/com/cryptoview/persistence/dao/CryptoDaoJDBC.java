package com.cryptoview.persistence.dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.cryptoview.persistence.model.Crypto;

public class CryptoDaoJDBC extends CryptoDao {

	private static CryptoDaoJDBC instance;
	
	//è la mappa di cripto supportate dal sistema
	private final Map <String, Crypto> cryptosMap;
	
	private final String getAllQuery = "select * from crypto;";
	private final String insertCrypto = "insert into crypto values(?,?,?,?);";
	private final String getCryptoPortfolio = "select * from criptoinportfolio where username=?";
	
	private CryptoDaoJDBC() {
		cryptosMap = new HashMap<>();
		
		try {
			fillCripto();
		} catch(Exception e) {
			e.printStackTrace();
		}
	}
	
	public Crypto getCrypto(String ticker) {
		return cryptosMap.get(ticker);
	}
	
	public Set<String> getSupportedCripto() {
		return cryptosMap.keySet();
	}
	
	private void fillCripto() throws SQLException {
		Statement stm = DBConnection.getInstance().getConnection().createStatement();
		ResultSet rs = stm.executeQuery(getAllQuery);
		
		while(rs.next()) {
			Crypto crypto = Crypto.parseFromDB(rs);
			cryptosMap.put(crypto.getTicker(), crypto);
		}
		
		rs.close();
		stm.close();
	}

	public static CryptoDaoJDBC getInstance() {
		if(instance == null)
			instance = new CryptoDaoJDBC();
		
		return instance;
	}
	
	
	@Override
	public List<Crypto> getAll() throws SQLException {
		return new ArrayList<>(cryptosMap.values());
	}

	@Override
	public void save(Crypto obj) throws SQLException {
		// TODO Auto-generated method stub
		
	}

	@Override
	public Map<Crypto, Double> getCryptoInPortfolio(String owner) throws SQLException {
		PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(getCryptoPortfolio);
		stm.setString(1, owner);
		
		ResultSet rs = stm.executeQuery();
		Map <Crypto, Double> map = new HashMap<>();
		while(rs.next()) {
			Crypto crypto = CryptoDaoJDBC.getInstance().getCrypto(rs.getString("ticker"));
			Double quant = rs.getDouble("quantity");
			map.put(crypto, quant);
		}
		
		rs.close();
		stm.close();
		
		return map;
	}
	
	//Questo metodo deve essere eseguito SOLO per aggiornare le cripto supportate
	/*public void updateSupportedCrypto() throws SQLException {
		String query = "insert into crypto values(?,?,?,?) ON CONFLICT DO NOTHING";		
		JSONArray cryptos = TopCryptoFetcher.getInstance().fetch(200);
		
		for(int i = 0; i < cryptos.size(); ++i) {
			PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(query);
			JSONObject obj = (JSONObject) cryptos.get(i);
			
			CryptoDetail crypto = CryptoDetail.parseFromResponse(obj);
			
			stm.setString(1, crypto.getTicker());
			stm.setString(2, crypto.getName());
			stm.setInt(3, getIdFromLogo(crypto.getLogo()));
			stm.setString(4, crypto.getId());
			
			stm.execute();
			stm.close();
		}
	}
	
	private Integer getIdFromLogo(String chart) {
		chart = chart.substring(42, chart.length());
		chart = chart.substring(0, chart.indexOf("/"));
		return Integer.parseInt(chart);
	}*/

}
