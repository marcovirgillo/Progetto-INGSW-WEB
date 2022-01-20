package com.cryptoview.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.cryptoview.model.CryptoDetail;
import com.cryptoview.persistence.model.Preference;

public class PreferencesService {

	private static PreferencesService instance = null;

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
		List<CryptoDetail> topCryptos = TopCryptos.getInstance().getAllSupportedCrypto();
		
		for (var preference : preferences) {
			for (var crypto : topCryptos) {
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
		Long cont = 1L;
		for (var elem : array) {
			elem.setRank(cont++);
		}
		JSONObject response = new JSONObject();
		response.put("preferences", array);
		
		return response;
	}
	
	@SuppressWarnings("unchecked")
	public JSONObject dashboardGainersToJson(List<Preference> preferences) {

		ArrayList<CryptoDetail> array = new ArrayList<CryptoDetail>();
		List<CryptoDetail> topCryptos = TopCryptos.getInstance().getAllSupportedCrypto();
		JSONObject response = new JSONObject();
		
		for (var preference : preferences) {
			for (var crypto : topCryptos) {
				if (preference.getTicker().equals(crypto.getTicker())) {
					array.add(crypto);
				}
			}
		}
		
		Collections.sort(array, new Comparator<CryptoDetail>() {
			  @Override
			  public int compare(CryptoDetail c1, CryptoDetail c2) {
			    return c2.getChange().compareTo(c1.getChange());
			  }
			});
		
		
		response.put("preferences_top_gainers", array.subList(0, Math.min(3, array.size())));
		
		List <CryptoDetail> tmp = new ArrayList<>();
		for(int i = array.size() - 1; i >= array.size() - Math.min(3, array.size()); --i)
			tmp.add(array.get(i));
		
		response.put("preferences_worst_performer", tmp);
		
		return response;
	}
	

}
