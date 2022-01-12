package com.cryptoview.controller;

import java.sql.SQLException;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cryptoview.persistence.dao.UserDaoJDBC;
import com.cryptoview.persistence.model.User;
import com.cryptoview.utilities.SpringUtil;

@RestController
public class AuthController {
	
	@PostMapping("/login")
	public User doLogin(@RequestBody Test test, HttpServletResponse response) {
		User utente;
		
		try {
			utente = UserDaoJDBC.getInstance().checkCredentials(test.getUsername(), test.getPassword());
		} catch (SQLException e) {
			e.printStackTrace();
			response.setStatus(500);
			response.setHeader("msg", "Internal server error");
			
			return new User();
		}
		
		if(utente == null) {
			response.setStatus(401);
			response.setHeader("msg", "Invalid username or password");
			
			return new User();
		}
		
		String token = SpringUtil.generateNewToken();
		
		Cookie cookie = new Cookie("key", token);
		cookie.setMaxAge(60);
		cookie.setHttpOnly(true);
		
		response.addCookie(cookie);
		
		return utente;
	}

}
