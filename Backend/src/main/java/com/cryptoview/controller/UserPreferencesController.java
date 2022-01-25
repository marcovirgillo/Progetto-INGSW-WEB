package com.cryptoview.controller;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.cryptoview.persistence.dao.NotificationDaoJDBC;
import com.cryptoview.persistence.dao.PreferencesDaoJDBC;
import com.cryptoview.persistence.dao.UserDaoJDBC;
import com.cryptoview.persistence.model.Alert;
import com.cryptoview.persistence.model.Notification;
import com.cryptoview.persistence.model.Preference;
import com.cryptoview.persistence.model.User;
import com.cryptoview.service.PreferencesService;


@RestController
@CrossOrigin(origins = {"*"})
public class UserPreferencesController {
	
	//Restituisce status e Array  delle preferenze se con successo
	@SuppressWarnings("unchecked")
	@GetMapping("/getPreferences")
	public JSONObject getPrefereces(HttpServletRequest request, HttpServletResponse response) {
		String token = request.getHeader("Authorization");
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
	public JSONObject getPreferecesDashboard(HttpServletRequest request, HttpServletResponse response) {
		String token = request.getHeader("Authorization");
	
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
				return PreferencesService.getInstance().dashboardPreferencesToJson(preferences);
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
	@GetMapping("/getPreferredNews")
	public JSONObject getPreferredNews(HttpServletRequest request, HttpServletResponse response) throws ParseException, IOException {
		String token = request.getHeader("Authorization");
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
				return PreferencesService.getInstance().getNewsPreferences(preferences);
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
	@GetMapping("/getUserNotifications")
	public JSONObject getNotifications(HttpServletRequest request, HttpServletResponse response) {
		String token = request.getHeader("Authorization");
		
		try {
			User user = UserDaoJDBC.getInstance().findByToken(token);
			
			if(user == null) {
				JSONObject resp = new JSONObject();
				response.setStatus(Protocol.INVALID_TOKEN);
				resp.put("msg", "The auth token is not valid");
				
				return resp;
			}

			List<Notification> notifications = NotificationDaoJDBC.getInstance().getUserNotification(user.getUsername());
			
			JSONObject resp = new JSONObject();
			resp.put("notifications", notifications);
			response.setStatus(Protocol.OK);
			
			return resp;
			
		} catch (SQLException e) {
			e.printStackTrace();
			JSONObject resp = new JSONObject();
			response.setStatus(Protocol.SERVER_ERROR);
			resp.put("msg", "Internal server error");
			
			return resp;
		}
	}
	
	@SuppressWarnings("unchecked")
	@DeleteMapping("/deleteUserNotifications")
	public JSONObject deleteNotifications(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
		String token = request.getHeader("Authorization");
		
		try {
			User user = UserDaoJDBC.getInstance().findByToken(token);
			
			if(user == null) {
				JSONObject resp = new JSONObject();
				response.setStatus(Protocol.INVALID_TOKEN);
				resp.put("msg", "The auth token is not valid");
				
				return resp;
			}
			
			int id = (int) obj.get("id");
			NotificationDaoJDBC.getInstance().remove(id, user.getUsername());
			
			JSONObject resp = new JSONObject();
			resp.put("msg", "Notification removed successfully");
			response.setStatus(Protocol.OK);
			
			return resp;
			
		} catch (SQLException e) {
			e.printStackTrace();
			JSONObject resp = new JSONObject();
			response.setStatus(Protocol.SERVER_ERROR);
			resp.put("msg", "Internal server error");
			
			return resp;
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
	
	@SuppressWarnings("unchecked")
	@GetMapping("/gainersSection")
	private JSONObject getGainersDashboard(HttpServletRequest request, HttpServletResponse response) {
		String token = request.getHeader("Authorization");
		
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
				return PreferencesService.getInstance().dashboardGainersToJson(preferences);
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
	@PutMapping("/saveAlert")
	private JSONObject saveAlert(@RequestBody Alert alert, HttpServletRequest request, HttpServletResponse response) {
		String token = request.getHeader("Authorization");
		
		try {
			User user = UserDaoJDBC.getInstance().findByToken(token);
			
			if(user == null) {
				JSONObject resp = new JSONObject();
				response.setStatus(Protocol.INVALID_TOKEN);
				resp.put("msg", "The auth token is not valid");
				
				return resp;
			}

			PreferencesDaoJDBC.getInstance().save(alert, user.getUsername());
			
			JSONObject resp = new JSONObject();
			resp.put("msg", "Alert successfuly added.");
			response.setStatus(Protocol.OK);
			return resp;	
		} catch (SQLException e) {
			JSONObject resp = new JSONObject();
			response.setStatus(Protocol.SERVER_ERROR);
			resp.put("msg", "Internal server error or Alert already exists");
			
			return resp;
		}
	}
	
	@SuppressWarnings("unchecked")
	@DeleteMapping("/removeAlert")
	private JSONObject removeAlert(@RequestBody Alert alert, HttpServletRequest request, HttpServletResponse response) {
		String token = request.getHeader("Authorization");
		
		try {
			User user = UserDaoJDBC.getInstance().findByToken(token);
			
			if(user == null) {
				JSONObject resp = new JSONObject();
				response.setStatus(Protocol.INVALID_TOKEN);
				resp.put("msg", "The auth token is not valid");
				
				return resp;
			}

			boolean result = PreferencesDaoJDBC.getInstance().remove(alert, user.getUsername());
			if(result) {
				JSONObject resp = new JSONObject();
				resp.put("msg", "Alert successfuly removed.");
				response.setStatus(Protocol.OK);
				return resp;	
			}
			else {
				JSONObject resp = new JSONObject();
				resp.put("msg", "Alert doesn't exist.");
				response.setStatus(Protocol.ALERT_NOT_EXISTENT);
				return resp;	
			}
		} catch (SQLException e) {
			JSONObject resp = new JSONObject();
			response.setStatus(Protocol.SERVER_ERROR);
			resp.put("msg", "Internal server error or Alert doesn't exist");
			
			return resp;
		}
	}
	
}
