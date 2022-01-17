package com.cryptoview.service;

import java.util.List;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.cryptoview.persistence.model.Preference;

public class PreferencesService {

	private static PreferencesService instance = null;
	
	private PreferencesService() {}
	
	public static PreferencesService getInstance() {
		if(instance == null)
			instance = new PreferencesService();
		return instance;
	}
	
	@SuppressWarnings("unchecked")
	public JSONObject preferencesToJSON(List<Preference> preferences) {
		JSONObject response = new JSONObject();
		
		JSONArray array = new JSONArray();
		
		for(var preference : preferences) {
			JSONObject obj = new JSONObject();
			obj.put("id", preference.getTicker());
			array.add(obj);
		}
		
		response.put("preferences", array);
		
		return response;
	}
}
