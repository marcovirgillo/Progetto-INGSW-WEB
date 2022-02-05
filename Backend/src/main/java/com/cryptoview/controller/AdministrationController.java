package com.cryptoview.controller;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.cryptoview.persistence.dao.CryptoDaoJDBC;
import com.cryptoview.persistence.dao.UserDaoJDBC;
import com.cryptoview.persistence.model.Crypto;
import com.cryptoview.persistence.model.User;
import com.cryptoview.persistence.model.domain.Password;
import com.cryptoview.persistence.model.domain.Username;

@Controller
@CrossOrigin(origins = {"*"})
@RequestMapping("/admin")
public class AdministrationController {
	
	@GetMapping("/login")
	public String adminLogin() {
		return "login";
	}
	
	@PostMapping("/doLogin")
	public String doLogin(HttpServletRequest request, HttpServletResponse response, 
			              String username, String password) throws IOException {
		User utente = null;
		
		try {
			utente = UserDaoJDBC.getInstance().checkCredentials(new Username(username), new Password(password));
		} catch (SQLException e) {
			e.printStackTrace();
			response.setStatus(Protocol.SERVER_ERROR);
			
			request.setAttribute("error", "Server error, please retry!");
			
			return "login";
		} catch (IllegalArgumentException | NullPointerException e2) {
			e2.printStackTrace();
			response.setStatus(Protocol.INVALID_CREDENTIALS);	
			request.setAttribute("error", "Invalid credentials, please retry!");
			
			return "login";
		}
		
		if(utente == null) {
			response.setStatus(Protocol.WRONG_CREDENTIALS);	
			request.setAttribute("error", "Username/password doesn't match, please retry!");
			return "login";
		}
		
		if(!utente.isAdmin()) {
			request.setAttribute("error", "This user is not an admin, please retry!");
			
			return "login";
		}
		
		HttpSession session = request.getSession(true);
		session.setAttribute("username", username);
	
		response.sendRedirect("/admin/dashboard");
		return "dashboard";
	}
	
	@GetMapping("/dashboard")
	public String getDashboard(HttpServletRequest request, HttpServletResponse response) {
		HttpSession session = request.getSession(true);
		Object username = (Object) session.getAttribute("username");
		
		if(!(username instanceof String)) {
			request.setAttribute("text", "The username is not valid");
			return "errorPage";
		}
		
		String userStr = (String) username;
		
		try {
			if(!UserDaoJDBC.getInstance().isUserAdmin(new Username(userStr))) {
				request.setAttribute("text", "This user is not an admin");
				return "errorPage";
			}
		} catch (IllegalArgumentException | NullPointerException e) {
			request.setAttribute("text", "The username is not valid");
			return "errorPage";
		} catch (SQLException e) {
			request.setAttribute("text", "Server error, please retry!");
			return "errorPage";
		}
		
		List <Crypto> allCryptos = new ArrayList<>();
		List <User> allUsers = new ArrayList<>();
		
		try {
			allCryptos = CryptoDaoJDBC.getInstance().getAll();
			allUsers = UserDaoJDBC.getInstance().getAll();
			Collections.sort(allCryptos, (cripto1, cripto2) -> cripto1.getName().toLowerCase().compareTo(cripto2.getName().toLowerCase()));
			Collections.sort(allUsers, (user1, user2) -> user1.getUsername().compareTo(user2.getUsername()));
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		request.setAttribute("cryptos", allCryptos);
		request.setAttribute("users", allUsers);

		return "dashboard";
	}
	
	@GetMapping("/doLogout")
	public void doLogout(HttpServletRequest request, HttpServletResponse response) throws IOException {
		HttpSession session = request.getSession();
		if(session != null)
			session.invalidate();
		
		response.sendRedirect("/admin/login");
	}
}
