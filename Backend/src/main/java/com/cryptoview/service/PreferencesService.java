package com.cryptoview.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;

import com.cryptoview.model.CryptoDetail;
import com.cryptoview.model.api.API;
import com.cryptoview.model.api.NewsFetcher;
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
}
