package com.cryptoview.service;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;

import com.cryptoview.model.CryptoDetail;
import com.cryptoview.model.api.API;
import com.cryptoview.model.api.NewsFetcher;
import com.cryptoview.persistence.dao.NotificationDaoJDBC;
import com.cryptoview.persistence.dao.PreferencesDaoJDBC;
import com.cryptoview.persistence.dao.UserDaoJDBC;
import com.cryptoview.persistence.model.Alert;
import com.cryptoview.persistence.model.AlertNotification;
import com.cryptoview.persistence.model.Preference;
import com.cryptoview.persistence.model.PriceNotification;

public class PreferencesService {

	private static PreferencesService instance = null;
	
	private final Double NOTIFICATION_1H_TRESHOLD = 5.0;
	private final Double NOTIFICATION_24H_TRESHOLD = 7.0;

	private PreferencesService() {}

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
		
		for (var preference : preferences) {
			for (var crypto : allCrypto) {
				if (preference.getTicker().equals(crypto.getTicker())) {
					array.add(crypto);
				}
			}
		}
		
		Collections.sort(array, (c1,c2) -> {
			 return c2.getMarket_cap().compareTo(c1.getMarket_cap());
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
		
		Collections.sort(array, (c1,c2) -> {
			 return c2.getChange_24h().compareTo(c1.getChange_24h());
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
		
		request.append("q=");
		for(int i=0; i<preferredCryptos.size() - 1; i++) {
			request.append(preferredCryptos.get(i));
			request.append("+OR+");
		}
		request.append(preferredCryptos.get(preferredCryptos.size() - 1));
		request.append("&");
		
		//request.append(API.getInstance().getPreferredNewsPart2());
		JSONArray preferredNews = null;
		while(preferredNews == null) {
			int first = request.length();
			request.append(API.getInstance().getPreferredNewsPart2());
			preferredNews = NewsFetcher.getInstance().fetchPreferredNews(request.toString());
			request.delete(first, request.length());
			System.out.println("Fetching preferred News...");
			
		}
		
		JSONObject response = new JSONObject();
		
		response.put("news", preferredNews);
		
		return response;
	}
	
	public void updateNotifications1h() throws SQLException {
		List <String> users = UserDaoJDBC.getInstance().getAll().stream().map(user -> user.getUsername()).collect(Collectors.toList());
		
		for(String user : users) {
			List <Preference> userPreferences = PreferencesDaoJDBC.getInstance().getUserPreferences(user);
			
			for(Preference preference : userPreferences) {
				CryptoDetail cryptoPreference = TopCryptos.getInstance().getSupportedCryptoDetail(preference.getTicker());
				
				if(Math.abs(cryptoPreference.getChange_1h()) >= NOTIFICATION_1H_TRESHOLD) {
					PriceNotification notif = new PriceNotification();
					notif.setPriceChange(cryptoPreference.getChange_1h());
					notif.setPriceChangeInterval(1);
					notif.setCriptoTicker(cryptoPreference.getTicker());
					notif.setUsername(user);
					
					NotificationDaoJDBC.getInstance().save(notif);
				}
			}
		}
	}
	
	public void updateNotifications24h() throws SQLException {
		List <String> users = UserDaoJDBC.getInstance().getAll().stream().map(user -> user.getUsername()).collect(Collectors.toList());
		
		for(String user : users) {
			List <Preference> userPreferences = PreferencesDaoJDBC.getInstance().getUserPreferences(user);
			
			for(Preference preference : userPreferences) {
				CryptoDetail cryptoPreference = TopCryptos.getInstance().getSupportedCryptoDetail(preference.getTicker());
				
				if(Math.abs(cryptoPreference.getChange_24h()) > NOTIFICATION_24H_TRESHOLD) {
					PriceNotification notif = new PriceNotification();
					notif.setPriceChangeInterval(24);
					notif.setPriceChange(cryptoPreference.getChange_24h());
					notif.setCriptoTicker(cryptoPreference.getTicker());
					notif.setUsername(user);
					
					NotificationDaoJDBC.getInstance().save(notif);
				}
			}
		}
	}
	
	@SuppressWarnings("unchecked")
	public JSONObject alertsToJSON(List<Alert> alerts) {
		JSONObject response = new JSONObject();
		JSONArray array = new JSONArray();

		for (var alert : alerts) {
			JSONObject obj = new JSONObject();
			CryptoDetail crypto = TopCryptos.getInstance().getSupportedCryptoDetail(alert.getCriptoTicker());
			obj.put("id", alert.getId());
			obj.put("ticker", alert.getCriptoTicker());
			obj.put("price", alert.getTargetPrice());
			obj.put("above", alert.isAbove());
			obj.put("name", crypto.getName());
			obj.put("image_url", crypto.getLogo());
			array.add(obj);
		}

		response.put("alerts", array);

		return response;
	}
	
	public void checkAlerts(Map<String, CryptoDetail> supportedCryptoDetail) throws SQLException {
		System.out.println("CHECKING Alerts");
		for(CryptoDetail crypto : supportedCryptoDetail.values()) {
			for(Alert alert : PreferencesDaoJDBC.getInstance().getCryptoAlerts(crypto.getTicker())) {
				if((alert.isAbove() && crypto.getPrice() >= alert.getTargetPrice()) ||
				  (!alert.isAbove() && crypto.getPrice() <= alert.getTargetPrice())) {
					AlertNotification notif = createAlertNotification(alert);
					NotificationDaoJDBC.getInstance().save(notif);
					PreferencesDaoJDBC.getInstance().removeAlert(alert.getId(), alert.getUsername());
				}
			}
		}
		System.out.println("CHECKED Alerts");
	}

	private AlertNotification createAlertNotification(Alert alert) {
		AlertNotification notif = new AlertNotification();
		notif.setCriptoTicker(alert.getCriptoTicker());
		notif.setUsername(alert.getUsername());
		notif.setAbove(alert.isAbove());
		notif.setTargetPrice(alert.getTargetPrice());
		
		return notif;
	}
}
