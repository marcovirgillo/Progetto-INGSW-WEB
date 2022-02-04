package com.cryptoview.controller;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.cryptoview.persistence.dao.CryptoDaoJDBC;
import com.cryptoview.persistence.dao.UserDaoJDBC;
import com.cryptoview.persistence.model.Crypto;
import com.cryptoview.persistence.model.User;

@Controller
@CrossOrigin(origins = {"*"})
@RequestMapping("/admin")
public class AdministrationController {
	
	@GetMapping("/login")
	public String adminLogin() {
		return "login";
	}
	
	@GetMapping("/dashboard")
	public String getDashboard(HttpServletRequest request) {
		List <Crypto> allCryptos = new ArrayList<>();
		List <User> allUsers = new ArrayList<>();
		
		try {
			allCryptos = CryptoDaoJDBC.getInstance().getAll();
			allUsers = UserDaoJDBC.getInstance().getAll();
			Collections.sort(allCryptos, (cripto1, cripto2) -> cripto1.getName().compareTo(cripto2.getName()));
			Collections.sort(allUsers, (user1, user2) -> user1.getUsername().compareTo(user2.getUsername()));
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
		request.setAttribute("cryptos", allCryptos);
		request.setAttribute("users", allUsers);
		
		return "dashboard";
	}
}
