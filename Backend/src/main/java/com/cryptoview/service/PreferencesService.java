package com.cryptoview.service;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;

import com.cryptoview.model.CryptoDetail;
import com.cryptoview.model.api.API;
import com.cryptoview.model.api.NewsFetcher;
import com.cryptoview.persistence.dao.NotificationDaoJDBC;
import com.cryptoview.persistence.dao.PreferencesDaoJDBC;
import com.cryptoview.persistence.dao.UserDaoJDBC;
import com.cryptoview.persistence.model.Notification;
import com.cryptoview.persistence.model.Preference;

public class PreferencesService {

	private static PreferencesService instance = null;
	
	private final Double NOTIFICATION_1H_TRESHOLD = 5.0;
	private final Double NOTIFICATION_24H_TRESHOLD = 7.0;


	private PreferencesService() {
	}

	public static PreferencesService getInstance() {
		if (instance == null)
			instance = new PreferencesService();
		return instance;
	}

	@SuppressWarnings("unchecked")
	public JSONObject preferencesToJSON(List<Preference> preferences) {
		JSONObject response = new JSONObject();

		JSONArray array = new JSONArray();

		for (var preference : preferences) {
			JSONObject obj = new JSONObject();
			obj.put("id", preference.getTicker());
			array.add(obj);
		}

		response.put("preferences", array);

		return response;
	}

	@SuppressWarnings("unchecked")
	public JSONObject dashboardPreferencesToJson(List<Preference> preferences) {

		ArrayList<CryptoDetail> array = new ArrayList<CryptoDetail>();
		List<CryptoDetail> allCrypto = new ArrayList<CryptoDetail>(TopCryptos.getInstance().getAllSupportedCrypto());
		
		
		//TODO INTERFERISCE CON I RANK DI TOP 100
		for (var preference : preferences) {
			for (var crypto : allCrypto) {
				if (preference.getTicker().equals(crypto.getTicker())) {
					array.add(crypto);
				}
			}
		}
		
		Collections.sort(array, new Comparator<CryptoDetail>() {
			  @Override
			  public int compare(CryptoDetail c1, CryptoDetail c2) {
			    return c2.getMarket_cap().compareTo(c1.getMarket_cap());
			  }
			});
		
		JSONObject response = new JSONObject();
		response.put("preferences", array);
		
		return response;
	}
	
	@SuppressWarnings("unchecked")
	public JSONObject dashboardGainersToJson(List<Preference> preferences) {

		ArrayList<CryptoDetail> array = new ArrayList<CryptoDetail>();
		List<CryptoDetail> allCrypto = TopCryptos.getInstance().getAllSupportedCrypto();
		JSONObject response = new JSONObject();
		
		for (var preference : preferences) {
			for (var crypto : allCrypto) {
				if (preference.getTicker().equals(crypto.getTicker())) {
					array.add(crypto);
				}
			}
		}
		
		Collections.sort(array, new Comparator<CryptoDetail>() {
			  @Override
			  public int compare(CryptoDetail c1, CryptoDetail c2) {
			    return c2.getChange_24h().compareTo(c1.getChange_24h());
			  }
			});
		
		
		response.put("preferences_top_gainers", array.subList(0, Math.min(3, array.size())));
		
		List <CryptoDetail> tmp = new ArrayList<>();
		for(int i = array.size() - 1; i >= array.size() - Math.min(3, array.size()); --i)
			tmp.add(array.get(i));
		
		response.put("preferences_worst_performer", tmp);
		
		return response;
	}

	@SuppressWarnings("unchecked")
	public JSONObject getNewsPreferences(List<Preference> preferences) throws ParseException, IOException {
		StringBuilder request = new StringBuilder(API.getInstance().getPreferredNewsPart1());
		List<CryptoDetail> allCrypto = new ArrayList<CryptoDetail>(TopCryptos.getInstance().getAllSupportedCrypto());
		ArrayList<String> preferredCryptos = new ArrayList<String>();
		
		for(var i : preferences) {
			for(var j : allCrypto) {
				if(j.getTicker().equals(i.getTicker()))
					preferredCryptos.add(j.getName().replaceAll("\\s.*", ""));
			}
		}
		
		request.append("qInTitle=");
		for(int i=0; i<preferredCryptos.size() - 1; i++) {
			request.append(preferredCryptos.get(i));
			request.append("+OR+");
		}
		request.append(preferredCryptos.get(preferredCryptos.size() - 1));
		request.append("&");
		
		request.append(API.getInstance().getPreferredNewsPart2());
		
		JSONArray preferredNews = NewsFetcher.getInstance().fetchPreferredNews(request.toString());
		
		JSONObject response = new JSONObject();
		
		response.put("news", preferredNews);
		
		return response;
	}
	
	private static double round(double value, int places) {
	    if (places < 0) throw new IllegalArgumentException();
	 
	    BigDecimal bd = new BigDecimal(Double.toString(value));
	    bd = bd.setScale(places, RoundingMode.HALF_UP);
	    return bd.doubleValue();
	}
	
	public void updateNotifications1h() throws SQLException {
		List <String> users = UserDaoJDBC.getInstance().getAll().stream().map(user -> user.getUsername()).toList();
		
		for(String user : users) {
			List <Preference> userPreferences = PreferencesDaoJDBC.getInstance().getUserPreferences(user);
			
			for(Preference preference : userPreferences) {
				CryptoDetail cryptoPreference = TopCryptos.getInstance().getSupportedCryptoDetail(preference.getTicker());
				
				if(Math.abs(cryptoPreference.getChange_1h()) >= NOTIFICATION_1H_TRESHOLD) {
					String content = cryptoPreference.getName() + " (" + cryptoPreference.getTicker().toUpperCase() + ") ";
					content += cryptoPreference.getChange_1h()  >= 0 ? "is up " : "is down ";
					content += round(cryptoPreference.getChange_1h(), 2) + "% in the last hour";
					
					Notification notif = new Notification();
					notif.setContent(content);
					notif.setCriptoTicker(cryptoPreference.getTicker());
					notif.setUsername(user);
					
					NotificationDaoJDBC.getInstance().save(notif);
				}
			}
		}
	}
	
	public void updateNotifications24h() throws SQLException {
		List <String> users = UserDaoJDBC.getInstance().getAll().stream().map(user -> user.getUsername()).toList();
		
		for(String user : users) {
			List <Preference> userPreferences = PreferencesDaoJDBC.getInstance().getUserPreferences(user);
			
			for(Preference preference : userPreferences) {
				CryptoDetail cryptoPreference = TopCryptos.getInstance().getSupportedCryptoDetail(preference.getTicker());
				
				if(Math.abs(cryptoPreference.getChange_24h()) > NOTIFICATION_24H_TRESHOLD) {
					String content = cryptoPreference.getName() + " (" + cryptoPreference.getTicker().toUpperCase() + ") ";
					content += cryptoPreference.getChange_24h()  >= 0 ? "is up " : "is down ";
					content += round(cryptoPreference.getChange_24h(), 2) + "% in the last 24 hours";
					
					Notification notif = new Notification();
					notif.setContent(content);
					notif.setCriptoTicker(cryptoPreference.getTicker());
					notif.setUsername(user);
					
					NotificationDaoJDBC.getInstance().save(notif);
				}
			}
		}
	}
}
