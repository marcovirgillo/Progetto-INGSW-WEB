package com.cryptoview.controller;

import java.sql.SQLException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cryptoview.persistence.dao.CryptoDaoJDBC;
import com.cryptoview.persistence.dao.UserDaoJDBC;
import com.cryptoview.persistence.model.Crypto;
import com.cryptoview.persistence.model.User;
import com.cryptoview.persistence.model.domain.Email;
import com.cryptoview.persistence.model.domain.Password;
import com.cryptoview.persistence.model.domain.Username;
import com.cryptoview.utilities.EmailSenderService;

@RestController
@CrossOrigin(origins = {"*"})
@RequestMapping("/adminRest")
public class AdminRestController {
	
	@SuppressWarnings("unchecked")
	private JSONObject checkAdminUser(HttpServletRequest request, HttpServletResponse response) {
		HttpSession session = request.getSession(true);
		JSONObject resp = new JSONObject();
		Object username = (Object) session.getAttribute("username");
		
		if(!(username instanceof String)) {
			response.setStatus(403);
			resp.put("msg", "Forbidden");
			return resp;
		}
		
		String userStr = (String) username;
		
		try {
			if(!UserDaoJDBC.getInstance().isUserAdmin(new Username(userStr))) {
				response.setStatus(403);
				resp.put("msg", "User is not admin");
				
				return resp;
			}
			
			resp.put("msg", "OK");
			return resp;
		} catch (IllegalArgumentException | NullPointerException e) {
			response.setStatus(Protocol.INVALID_DATA);
			resp.put("msg", "Invalid Data");
			
			return resp;
		} catch (SQLException e) {
			response.setStatus(403);
			resp.put("msg", "Internal server error");
			
			return resp;
		}	
	}
	
	@SuppressWarnings("unchecked")
	@PostMapping("/addSupportedCripto")
	public JSONObject addSuportedCripto(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
		JSONObject resp = checkAdminUser(request, response);
		if(!((String)resp.get("msg")).equals("OK"))
			return resp;
		
		try {
			Crypto crypto = new Crypto();
			crypto.setTicker((String) obj.get("ticker"));
			crypto.setName((String) obj.get("name"));
			crypto.setIdApi((String) obj.get("api_id"));
			crypto.setIdGraphic(Integer.parseInt((String) obj.get("graphic_id")));
			CryptoDaoJDBC.getInstance().save(crypto);
			
			response.setStatus(Protocol.OK);
			resp.put("msg", "Crypto addedd successfully");
			
			return resp;
		} catch(SQLException e) {
			response.setStatus(Protocol.SERVER_ERROR);
			resp.put("msg", e.getMessage());
			
			return resp;
		} catch(ClassCastException | NumberFormatException e2) {
			response.setStatus(Protocol.INVALID_DATA);
			resp.put("msg", "Invalid data");
			
			return resp;
		}
	}
	
	@SuppressWarnings("unchecked")
	@DeleteMapping("/removeSupportedCripto")
	public JSONObject removeSuportedCripto(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
		JSONObject resp = checkAdminUser(request, response);
		if(!((String)resp.get("msg")).equals("OK"))
			return resp;
		
		try {
			CryptoDaoJDBC.getInstance().removeCrypto((String) obj.get("ticker"));
			
			response.setStatus(Protocol.OK);
			resp.put("msg", "Crypto removed successfully");
			
			return resp;
		} catch(SQLException e) {
			response.setStatus(Protocol.SERVER_ERROR);
			resp.put("msg", e.getMessage());
			
			return resp;
		} catch(ClassCastException e2) {
			response.setStatus(Protocol.INVALID_DATA);
			resp.put("msg", "Invalid data");
			
			return resp;
		}
	}
	
	@SuppressWarnings("unchecked")
	@PostMapping("/addNewUser")
	public JSONObject addNewUser(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
		JSONObject resp = checkAdminUser(request, response);
		if(!((String)resp.get("msg")).equals("OK"))
			return resp;
		
		try {
			User user = new User();
			user.setAdmin(false);
			user.setPassword(new Password((String) obj.get("password")));
			user.setEmail(new Email((String) obj.get("email")));
			user.setUsername(new Username((String) obj.get("username")));
			UserDaoJDBC.getInstance().save(user);
			
			response.setStatus(Protocol.OK);
			resp.put("msg", "User addedd successfully");
			
			return resp;
		} catch(SQLException e) {
			response.setStatus(Protocol.SERVER_ERROR);
			resp.put("msg", e.getMessage());
			
			return resp;
		} catch(IllegalArgumentException | NullPointerException e2) {
			response.setStatus(Protocol.INVALID_DATA);
			resp.put("msg", "Invalid data");
			e2.printStackTrace();
			
			return resp;
		}
	}
	
	@SuppressWarnings("unchecked")
	@DeleteMapping("/removeUser")
	public JSONObject removeUser(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
		JSONObject resp = checkAdminUser(request, response);
		if(!((String)resp.get("msg")).equals("OK"))
			return resp;
		
		try {
			Username user = new Username((String) obj.get("username"));
			Email mail = UserDaoJDBC.getInstance().getUserEmail(user);
			
			if(mail == null) {
				response.setStatus(Protocol.INVALID_CREDENTIALS);
				resp.put("msg", "user doesn't exists");
				
				return resp;
			}
			
			UserDaoJDBC.getInstance().removeUser(user);
			EmailSenderService.sendAccountDeletedEmail(mail.toString());
			
			response.setStatus(Protocol.OK);
			resp.put("msg", "user removed successfully");
			
			return resp;
		} catch(SQLException e) {
			response.setStatus(Protocol.SERVER_ERROR);
			resp.put("msg", e.getMessage());
			
			return resp;
		} catch(IllegalArgumentException | NullPointerException e2) {
			response.setStatus(Protocol.INVALID_DATA);
			resp.put("msg", "Invalid data");
			
			return resp;
		}
	}
}
