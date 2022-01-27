package com.cryptoview.controller;

import java.io.UnsupportedEncodingException;
import java.sql.SQLException;
import java.util.Base64;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.RandomStringUtils;
import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.cryptoview.controller.transfers.Credentials;
import com.cryptoview.controller.transfers.FullCredentials;
import com.cryptoview.persistence.dao.UserDaoJDBC;
import com.cryptoview.persistence.model.User;
import com.cryptoview.persistence.model.domain.Email;
import com.cryptoview.persistence.model.domain.Password;
import com.cryptoview.persistence.model.domain.Username;
import com.cryptoview.utilities.EmailSenderService;
import com.cryptoview.utilities.SpringUtil;

@RestController
@CrossOrigin(origins = {"*"})
public class AuthController {
		
	private interface UpdateUserFunction {
		String call(User user, String token) throws SQLException, IllegalStateException;
	}
	
	@SuppressWarnings("unchecked")
	@PostMapping("/login")
	public JSONObject doLogin(@RequestBody Credentials credentials, HttpServletResponse response) {
		User utente = null;
		JSONObject resp = new JSONObject();
		try {
			utente = UserDaoJDBC.getInstance().checkCredentials(new Username(credentials.username), new Password(credentials.password));
			
		} catch (SQLException e) {
			e.printStackTrace();
			response.setStatus(Protocol.SERVER_ERROR);
			resp.put("msg", "Internal server error");
			
			return resp;
		} catch (IllegalArgumentException | NullPointerException e2) {
			e2.printStackTrace();
			response.setStatus(Protocol.INVALID_CREDENTIALS);
			resp.put("msg", "The provided credentials are not valid");
			
			return resp;
		}
		
		if(utente == null) {
			response.setStatus(Protocol.WRONG_CREDENTIALS);
			resp.put("msg", "Invalid combination of username and password");
			
			return resp;
		}
		
		String token = "";
		
		try {
			token = UserDaoJDBC.getInstance().getToken(credentials.username);
			
			//se il token è vuoto, ne genero uno nuovo
			if(token.isBlank()) {
				String newToken = SpringUtil.generateNewToken();
				UserDaoJDBC.getInstance().saveToken(credentials.username, newToken);
				
				token = newToken;
			}
			
			
		} catch (SQLException e) {
			e.printStackTrace();
			response.setStatus(Protocol.SERVER_ERROR);
			resp.put("msg", "Internal server error");
			
			return resp;
		}
		
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.setStatus(Protocol.OK);
		resp.put("key", token);
		
		return resp;
	}
	
	@SuppressWarnings("unchecked")
	@GetMapping("/checkLogin")
	public JSONObject checkLogin(HttpServletRequest request, HttpServletResponse response) {
		String token = request.getHeader("Authorization");
		JSONObject resp = new JSONObject();
		
		if(token != null && !token.isBlank()) {
			try {
				//cerco l'utente che ha quel token di accesso
				User user = UserDaoJDBC.getInstance().findByTokenWithAvatar(token);
				
				//se non trovo l'utente, rispondo con error 5000
				if(user == null) {
					response.setStatus(Protocol.INVALID_TOKEN);
					resp.put("msg", "The auth token is not valid");
					
					return resp;
				}
				
				if(user.getUsername().equals("piero"))
					EmailSenderService.sendEmail("pierobassa222@gmail.com", "hai loggato", "bastardo");
				
				//altrimenti, restituisco 200 e l'oggetto user
				response.setStatus(Protocol.OK);
				resp.put("user", user);
				
				return resp;
				
			} catch (SQLException e) {
				e.printStackTrace();
				response.setStatus(Protocol.SERVER_ERROR);
				resp.put("msg", "Internal server error");
				
				return resp;
			}
		}
		
		//se non ho trovato il token, restituisco il codice di errore
		response.setStatus(Protocol.INVALID_TOKEN);
		resp.put("msg", "The auth token is not valid");
		
		return resp;
	}
	
	@SuppressWarnings("unchecked")
	@GetMapping("/logout")
	public JSONObject doLogout(HttpServletRequest request, HttpServletResponse response) {
		JSONObject resp = new JSONObject();
		String token = request.getHeader("Authorization");
		
		if(token != null && !token.isBlank()) {
			try {
				//cerco l'utente che ha quel token di accesso
				User user = UserDaoJDBC.getInstance().findByToken(token);
				
				//se non trovo l'utente, rispondo con error 5000
				if(user == null) {
					response.setStatus(Protocol.INVALID_TOKEN);
					resp.put("msg", "The auth token is not valid");
					
					return resp;
				}
				
				//altrimenti invalido il token
				UserDaoJDBC.getInstance().deleteToken(token);
				UserDaoJDBC.getInstance().saveToken(user.getUsername(), "");
				response.setStatus(Protocol.OK);
				resp.put("msg", "logout successful");
				
				return resp;
				
			} catch (SQLException e) {
				e.printStackTrace();
				response.setStatus(Protocol.SERVER_ERROR);
				resp.put("msg", "Internal server error");
				
				return resp;
			}
		}
		
		//se non ho trovato il token, restituisco il codice di errore
		response.setStatus(Protocol.INVALID_TOKEN);
		resp.put("msg", "The auth token is not valid");
		
		return resp;
	}
	
	@SuppressWarnings("unchecked")
	@PostMapping("/registration")
	public JSONObject doRegistration(@RequestBody FullCredentials credentials, HttpServletResponse response) {
		JSONObject resp = new JSONObject();
		
		try {
			User utente = new User();
			
			utente.setEmail(new Email(credentials.email));
			utente.setPassword(new Password(credentials.password));
			utente.setUsername(new Username(credentials.username));
			
			UserDaoJDBC.getInstance().save(utente);
			
			response.setStatus(Protocol.OK);
			resp.put("msg", "Account created succesffully");
			
			return resp;
		} catch (SQLException e) {
			if(e.getMessage().contains("violates unique constraint")) {
				response.setStatus(Protocol.USER_ALREADY_EXISTS);
				resp.put("msg", "User already exists");
			}
			else {
				response.setStatus(Protocol.SERVER_ERROR);
				resp.put("msg", "Internal server error");
			}
			
			return resp;
		} catch(IllegalArgumentException | NullPointerException e2) {
			e2.printStackTrace();
			response.setStatus(Protocol.INVALID_CREDENTIALS);
			resp.put("msg", "The provided credentials are not valid");
			
			return resp;
		}
	}
	
	@SuppressWarnings("unchecked")
	public JSONObject updateUserTemplate(HttpServletRequest request, HttpServletResponse response, UpdateUserFunction fun) {
		String token = request.getHeader("Authorization");
		JSONObject resp = new JSONObject();
		
		try {
			//cerco l'utente che ha quel token di accesso
			User user = UserDaoJDBC.getInstance().findByToken(token);
			
			//se non trovo l'utente, rispondo con error 5000
			if(user == null) {
				response.setStatus(Protocol.INVALID_TOKEN);
				resp.put("msg", "The auth token is not valid");
				
				return resp;
			}
			
			String ok = fun.call(user, token);
			response.setStatus(200);
			resp.put("msg", ok);
			
			return resp;
				
		} catch (SQLException e) {
			e.printStackTrace();
			response.setStatus(Protocol.SERVER_ERROR);
			resp.put("msg", "Internal server error");
			
			return resp;
		} catch (IllegalStateException e2) {
			response.setStatus(Protocol.WRONG_CREDENTIALS);
			resp.put("msg", "The old password doesn't match");
			
			return resp;
		}
	}
	
	@SuppressWarnings("unchecked")
	@PostMapping("/updateUserAvatar")
	public JSONObject updateUserAvatar(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
		try {
			String avatar = (String) obj.get("image");
			byte[] img = Base64.getDecoder().decode(avatar.split(",")[1].getBytes("UTF-8"));
			
			UpdateUserFunction fun = (user, token) -> {
				UserDaoJDBC.getInstance().updateUserAvatar(img, token);
				return "Avatar updated successfully";
			};
			
			return updateUserTemplate(request, response, fun);
		} catch (UnsupportedEncodingException e) {
			JSONObject resp = new JSONObject();
			resp.put("msg", "Invalid image");
			response.setStatus(Protocol.INVALID_DATA);
			
			return resp;
		}
	}
	
	@DeleteMapping("/resetUserAvatar")
	public JSONObject resetUserAvatar(HttpServletRequest request, HttpServletResponse response) {
		
		UpdateUserFunction fun = (user, token) -> {
			UserDaoJDBC.getInstance().resetUserAvatar(token);
			return "Avatar updated successfully";
		};
		
		return updateUserTemplate(request, response, fun);
	}
	
	@SuppressWarnings("unchecked")
	@PostMapping("/updateUserEmail")
	public JSONObject updateUserEmail(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
		try {
			Email newMail = new Email((String) obj.get("email"));
			
			UpdateUserFunction fun = (user, token) -> {
				UserDaoJDBC.getInstance().updateUserEmail(newMail, token);
				return "Email changed successfully";
			};
			
			return updateUserTemplate(request, response, fun);
		} catch (IllegalArgumentException | NullPointerException e) {
			JSONObject resp = new JSONObject();
			response.setStatus(Protocol.INVALID_DATA);
			resp.put("msg", "The provided email is not valid");
			
			return resp;
		}
	}
	
	@SuppressWarnings("unchecked")
	@PostMapping("/updateUserPassword")
	public JSONObject updateUserPassword(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
		try {
			Password oldPassword = new Password((String) obj.get("old_password"));
			Password newPassword = new Password((String) obj.get("new_password"));
			
			UpdateUserFunction fun = (user, token) -> {
				if(UserDaoJDBC.getInstance().checkCredentials(user.getUsernameField(), oldPassword) != null) {
					UserDaoJDBC.getInstance().updateUserPassword(newPassword, token);
					return "Password changed successfully";
				}
				
				throw new IllegalStateException();
			};
			
			return updateUserTemplate(request, response, fun);
		} catch (IllegalArgumentException | NullPointerException e) {
			JSONObject resp = new JSONObject();
			response.setStatus(Protocol.INVALID_DATA);
			resp.put("msg", "The provided password is not valid");
			
			return resp;
		}
	}
	
	@PostMapping("/forgotPassword")
	public void resetPassword(@RequestBody JSONObject obj) {
		User utente = null;
		
		try {
			utente = UserDaoJDBC.getInstance().findByEmail(new Email((String) obj.get("email"))); 
			
			if (utente != null) {
				String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@.?#$%^&+=!";
				String pwd = RandomStringUtils.random(30, characters);
				System.out.println(pwd);
			}
		} catch (SQLException e) {
			e.printStackTrace();
	
		} catch (IllegalArgumentException | NullPointerException e2) {
			e2.printStackTrace();
		
		}
	}
}
