package com.cryptoview.controller;

import java.io.IOException;
import java.sql.SQLException;
import java.util.Collections;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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
			Collections.sort(notifications, (not1, not2) -> {
				return -1 * not1.getNotification_datestamp().compareTo(not2.getNotification_datestamp());
			});
			
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
			
			char type = ((String) obj.get("type")).charAt(0);
			int id = (int) obj.get("id");
			
			if(type == Notification.ALERT)
				NotificationDaoJDBC.getInstance().removeAlertNotification(id, user.getUsername());
			else if(type == Notification.PRICE)
				NotificationDaoJDBC.getInstance().removePriceNotification(id, user.getUsername());
			
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
	@PostMapping("/saveAlert")
	private JSONObject saveAlert(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
		String token = request.getHeader("Authorization");
		JSONObject resp = new JSONObject();
		
		try {
			User user = UserDaoJDBC.getInstance().findByToken(token);
			
			if(user == null) {
				response.setStatus(Protocol.INVALID_TOKEN);
				resp.put("msg", "The auth token is not valid");
				
				return resp;
			}
			
			Alert alert = new Alert();
			alert.setCriptoTicker((String) obj.get("ticker"));
			
			Object price = obj.get("price");
			if(price instanceof Double)
				alert.setTargetPrice((Double) obj.get("price"));
			else if(price instanceof Integer) {
				double num = (int) price; 
				alert.setTargetPrice(num);
			}
			else if(price instanceof String) {
				try {
					alert.setTargetPrice(Double.valueOf((String) obj.get("price")));
				} catch (ClassCastException e3) {
					double num = Integer.valueOf((String) obj.get("price"));
					alert.setTargetPrice(num);
				}
			}
			
			alert.setAbove((boolean) obj.get("is_above"));
			PreferencesDaoJDBC.getInstance().save(alert, user.getUsername());
			
			resp.put("msg", "Alert successfuly added.");
			response.setStatus(Protocol.OK);
			
			return resp;	
		} catch (SQLException e) {
			e.printStackTrace();
			response.setStatus(Protocol.SERVER_ERROR);
			resp.put("msg", "Internal server error");
			
			return resp;
		} catch (NumberFormatException e2) {
			response.setStatus(Protocol.INVALID_DATA);
			resp.put("msg", "Invalid price");
			
			return resp;
		}
	}
	
	@SuppressWarnings("unchecked")
	@DeleteMapping("/removeAlert")
	private JSONObject removeAlert(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
		String token = request.getHeader("Authorization");
		JSONObject resp = new JSONObject();
		
		try {
			User user = UserDaoJDBC.getInstance().findByToken(token);
			
			if(user == null) {
				response.setStatus(Protocol.INVALID_TOKEN);
				resp.put("msg", "The auth token is not valid");
				
				return resp;
			}
			
			Integer id = (Integer) obj.get("id");
			boolean result = PreferencesDaoJDBC.getInstance().removeAlert(id, user.getUsername());
			
			if(result) {
				resp.put("msg", "Alert successfuly removed.");
				response.setStatus(Protocol.OK);
				return resp;	
			}
			else {
				resp.put("msg", "Alert doesn't exist.");
				response.setStatus(Protocol.ALERT_NOT_EXISTENT);
				return resp;	
			}
		} catch (SQLException e) {
			response.setStatus(Protocol.SERVER_ERROR);
			resp.put("msg", "Internal server error or Alert does not exist");
			
			return resp;
		}
	}
	
	@SuppressWarnings("unchecked")
	@GetMapping("/getAlerts")
	public JSONObject getAlerts(HttpServletRequest request, HttpServletResponse response) {
		String token = request.getHeader("Authorization");
		try {
			User user = UserDaoJDBC.getInstance().findByToken(token);
			
			if(user == null) {
				JSONObject resp = new JSONObject();
				response.setStatus(Protocol.INVALID_TOKEN);
				resp.put("msg", "The auth token is not valid");
				
				return resp;
			}

			List<Alert> alerts = PreferencesDaoJDBC.getInstance().getUserAlerts(user.getUsername());
			Collections.sort(alerts, (a1, a2) -> { //Ordino per ticker in modo tale da mostrare insieme alert della stessa cripto
				return -1 * a1.getCriptoTicker().compareTo(a2.getCriptoTicker());
			});
			
			if(alerts != null) {
				response.setStatus(Protocol.OK);
				return PreferencesService.getInstance().alertsToJSON(alerts);
			}
			else {
				JSONObject resp = new JSONObject();
				response.setStatus(Protocol.NO_ALERTS_FOUND);
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
	
}
