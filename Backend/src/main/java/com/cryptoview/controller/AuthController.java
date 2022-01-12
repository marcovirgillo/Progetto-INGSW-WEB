package com.cryptoview.controller;

import java.sql.SQLException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.cryptoview.persistence.dao.UserDaoJDBC;
import com.cryptoview.persistence.model.User;
import com.cryptoview.persistence.model.domain.Email;
import com.cryptoview.persistence.model.domain.Password;
import com.cryptoview.persistence.model.domain.Username;
import com.cryptoview.utilities.SpringUtil;

@RestController
@CrossOrigin(origins = {"*"})
public class AuthController {
	
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
			response.setStatus(Protocol.WRONG_CREDENTIAL);
			resp.put("msg", "Invalid combination of username and password");
			
			return resp;
		}
		
		String token = SpringUtil.generateNewToken();
		
		try {
			UserDaoJDBC.getInstance().saveToken(credentials.username, token);
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
				User user = UserDaoJDBC.getInstance().findByToken(token);
				
				//se non trovo l'utente, rispondo con error 5000
				if(user == null) {
					response.setStatus(Protocol.INVALID_TOKEN);
					resp.put("msg", "The auth token is not valid");
					
					return resp;
				}
				
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
			e.printStackTrace();
			response.setStatus(Protocol.SERVER_ERROR);
			resp.put("msg", "Internal server error");
			
			return resp;
		} catch(IllegalArgumentException | NullPointerException e2) {
			e2.printStackTrace();
			response.setStatus(Protocol.INVALID_CREDENTIALS);
			resp.put("msg", "The provided credentials are not valid");
			
			return resp;
		}
	}
}
