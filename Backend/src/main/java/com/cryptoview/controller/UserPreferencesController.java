package com.cryptoview.controller;

import java.lang.reflect.Array;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.cryptoview.model.CryptoDetail;
import com.cryptoview.persistence.dao.PreferencesDaoJDBC;
import com.cryptoview.persistence.dao.UserDaoJDBC;
import com.cryptoview.persistence.model.Preference;
import com.cryptoview.persistence.model.User;
import com.cryptoview.service.PreferencesService;
import com.cryptoview.service.TopCryptos;

@RestController
@CrossOrigin(origins = {"*"})



public class UserPreferencesController {
	
	
	//Restituisce status e Array  delle preferenze se con successo
	@SuppressWarnings("unchecked")
	@GetMapping("/getPreferences")
	public JSONObject getPrefereces(HttpServletRequest request, HttpServletResponse response) {
		String token = request.getHeader("Authorization");
		System.out.println(token);
		try {
			User user = UserDaoJDBC.getInstance().findByToken(token);
			
			if(user == null) {
				JSONObject resp = new JSONObject();
				response.setStatus(Protocol.INVALID_TOKEN);
				resp.put("msg", "The auth token is not valid");
				
				return resp;
			}

			List<Preference> preferences = PreferencesDaoJDBC.getInstance().getUserPreferences(user.getUsername());
			
			if(preferences != null) {
				response.setStatus(Protocol.OK);
				return PreferencesService.getInstance().preferencesToJSON(preferences);
			}
			else {
				JSONObject resp = new JSONObject();
				response.setStatus(Protocol.NO_PREFERENCES_FOUND);
				resp.put("msg", "No preferences found.");	
				
				return resp;
			}
			
		} catch (SQLException e) {
			JSONObject resp = new JSONObject();
			response.setStatus(Protocol.SERVER_ERROR);
			resp.put("msg", "Internal server error");
			
			return resp;
		}
	}
	
	@SuppressWarnings("unchecked")
	@GetMapping("/getPreferencesDashboard")
	public List<CryptoDetail> getPreferecesDashboard(HttpServletRequest request, HttpServletResponse response) {
		String token = request.getHeader("Authorization");
	
		try {
			User user = UserDaoJDBC.getInstance().findByToken(token);
			
			if(user == null) {
				
				return Arrays.asList(null);
			}

			List<Preference> preferences = PreferencesDaoJDBC.getInstance().getUserPreferences(user.getUsername());
			
			if(preferences != null) {
				response.setStatus(Protocol.OK);
				return PreferencesService.getInstance().dashboardPreferences(preferences);
			}
			else {
				return Arrays.asList(null);
			}
			
		} catch (SQLException e) {
			return Arrays.asList(null);
		}
	}
	
	@SuppressWarnings("unchecked")
	@DeleteMapping("/removePreference")
	public JSONObject removePreference(@RequestBody Preference preference, HttpServletRequest request, HttpServletResponse response) {
		String token = request.getHeader("Authorization");
		
		try {
			User user = UserDaoJDBC.getInstance().findByToken(token);
			
			if(user == null) {
				JSONObject resp = new JSONObject();
				response.setStatus(Protocol.INVALID_TOKEN);
				resp.put("msg", "The auth token is not valid");
				
				return resp;
			}

			boolean resultOfDeletion = PreferencesDaoJDBC.getInstance().remove(preference, user.getUsername());
			
			if(resultOfDeletion) {
				JSONObject resp = new JSONObject();
				resp.put("msg", "Deletion of preference successful");
				response.setStatus(Protocol.OK);
				return resp;
			}
			else {
				JSONObject resp = new JSONObject();
				response.setStatus(Protocol.NO_PREFERENCES_FOUND);
				resp.put("msg", "No preferences found.");	
				
				return resp;
			}
			
		} catch (SQLException e) {
			JSONObject resp = new JSONObject();
			response.setStatus(Protocol.SERVER_ERROR);
			resp.put("msg", "Internal server error");
			
			return resp;
		}
	}
	
	@SuppressWarnings("unchecked")
	@DeleteMapping("/removePreferences")
	public JSONObject removePreferences(@RequestBody List<Preference> preferences, HttpServletRequest request, HttpServletResponse response) {
		String token = request.getHeader("Authorization");
		
		try {
			User user = UserDaoJDBC.getInstance().findByToken(token);
			
			if(user == null) {
				JSONObject resp = new JSONObject();
				response.setStatus(Protocol.INVALID_TOKEN);
				resp.put("msg", "The auth token is not valid");
				
				return resp;
			}

			boolean resultOfDeletion = PreferencesDaoJDBC.getInstance().remove(preferences, user.getUsername());
			
			if(resultOfDeletion) {
				JSONObject resp = new JSONObject();
				resp.put("msg", "Deletion of preferences successful");
				response.setStatus(Protocol.OK);
				return resp;
			}
			else {
				JSONObject resp = new JSONObject();
				response.setStatus(Protocol.NO_PREFERENCES_FOUND);
				resp.put("msg", "No preferences found.");	
				
				return resp;
			}
			
		} catch (SQLException e) {
			JSONObject resp = new JSONObject();
			response.setStatus(Protocol.SERVER_ERROR);
			resp.put("msg", "Internal server error");
			
			return resp;
		}
	}
	
	@SuppressWarnings("unchecked")
	@PutMapping("/addPreference")
	public JSONObject addPreference(@RequestBody Preference preference, HttpServletRequest request, HttpServletResponse response) {
		String token = request.getHeader("Authorization");
		
		try {
			User user = UserDaoJDBC.getInstance().findByToken(token);
			
			if(user == null) {
				JSONObject resp = new JSONObject();
				response.setStatus(Protocol.INVALID_TOKEN);
				resp.put("msg", "The auth token is not valid");
				
				return resp;
			}

			boolean resultOfInsertion = PreferencesDaoJDBC.getInstance().save(preference, user.getUsername());
			
			if(resultOfInsertion) {
				JSONObject resp = new JSONObject();
				resp.put("msg", "Preference successfully added");
				response.setStatus(Protocol.OK);
				return resp;
			}
			else {
				JSONObject resp = new JSONObject();
				response.setStatus(Protocol.NO_PREFERENCES_FOUND);
				resp.put("msg", "Preference already exists");	
				
				return resp;
			}
			
		} catch (SQLException e) {
			JSONObject resp = new JSONObject();
			response.setStatus(Protocol.SERVER_ERROR);
			resp.put("msg", "Internal server error");
			
			return resp;
		}
	}
	
	@SuppressWarnings("unchecked")
	@PutMapping("/addPreferences")
	public JSONObject addPreferences(@RequestBody List<Preference> preferences, HttpServletRequest request, HttpServletResponse response) {
		String token = request.getHeader("Authorization");
		
		try {
			User user = UserDaoJDBC.getInstance().findByToken(token);
			
			if(user == null) {
				JSONObject resp = new JSONObject();
				response.setStatus(Protocol.INVALID_TOKEN);
				resp.put("msg", "The auth token is not valid");
				
				return resp;
			}

			boolean resultOfInsertions = PreferencesDaoJDBC.getInstance().save(preferences, user.getUsername());
			
			if(resultOfInsertions) {
				JSONObject resp = new JSONObject();
				resp.put("msg", "Preferences successfuly added.");
				response.setStatus(Protocol.OK);
				return resp;
			}
			else {
				JSONObject resp = new JSONObject();
				response.setStatus(Protocol.NO_PREFERENCES_FOUND);
				resp.put("msg", "Preferences already exist.");	
				
				return resp;
			}
			
		} catch (SQLException e) {
			JSONObject resp = new JSONObject();
			response.setStatus(Protocol.SERVER_ERROR);
			resp.put("msg", "Internal server error");
			
			return resp;
		}
	}
	
	@GetMapping("/topGainersDashboard")
	private List<CryptoDetail> getTopGainersDashboard(HttpServletRequest request, HttpServletResponse response) {
		String token = request.getHeader("Authorization");
		
		try {
			User user = UserDaoJDBC.getInstance().findByToken(token);
			
			if(user == null) {
				
				return Arrays.asList(null);
			}

			List<Preference> preferences = PreferencesDaoJDBC.getInstance().getUserPreferences(user.getUsername());
			
			if(preferences != null) {
				response.setStatus(Protocol.OK);
				return PreferencesService.getInstance().dashboardGainers(preferences);
			}
			else {
				return Arrays.asList(null);
			}
			
		} catch (SQLException e) {
			return Arrays.asList(null);
		}
	}
	
	@GetMapping("/worstGainersDashboard")
	private List<CryptoDetail> getWorstGainerDashboard(HttpServletRequest request, HttpServletResponse response) {
		String token = request.getHeader("Authorization");
		
		try {
			User user = UserDaoJDBC.getInstance().findByToken(token);
			
			if(user == null) {
				
				return Arrays.asList(null);
			}

			List<Preference> preferences = PreferencesDaoJDBC.getInstance().getUserPreferences(user.getUsername());
			
			if(preferences != null) {
				response.setStatus(Protocol.OK);
				return PreferencesService.getInstance().dashboardWorstPerformer(preferences);
			}
			else {
				return Arrays.asList(null);
			}
			
		} catch (SQLException e) {
			return Arrays.asList(null);
		}
	}
}
