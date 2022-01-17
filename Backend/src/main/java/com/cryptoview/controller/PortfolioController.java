package com.cryptoview.controller;

import java.sql.SQLException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.cryptoview.controller.transfers.TransactionData;
import com.cryptoview.persistence.dao.PortfolioDaoJDBC;
import com.cryptoview.persistence.dao.TransactionDaoJDBC;
import com.cryptoview.persistence.dao.UserDaoJDBC;
import com.cryptoview.persistence.model.Portfolio;
import com.cryptoview.persistence.model.Transaction;
import com.cryptoview.persistence.model.User;
import com.cryptoview.persistence.model.domain.PortfolioName;
import com.cryptoview.persistence.model.domain.Username;
import com.cryptoview.service.PortfolioService;

@RestController
@CrossOrigin(origins = {"*"})
public class PortfolioController {
	
	@SuppressWarnings("unchecked")
	@GetMapping("/portfolioValue")
	private JSONObject getPrices(HttpServletRequest request, HttpServletResponse response) {
		String timeStamp = request.getHeader("timeStamp");
		String token = request.getHeader("Authorization");
		
		try {
			User user = UserDaoJDBC.getInstance().findByToken(token);
			
			if(user == null) {
				JSONObject resp = new JSONObject();
				response.setStatus(Protocol.INVALID_TOKEN);
				resp.put("msg", "The auth token is not valid");
				
				return resp;
			}
			
			response.setStatus(Protocol.OK);
			Portfolio portfolio = PortfolioDaoJDBC.getInstance().get(user.getUsername());
			if(portfolio != null)
				return PortfolioService.getInstance().getPortfolioValueTime(portfolio, timeStamp);
			else {
				JSONObject resp = new JSONObject();
				response.setStatus(portfolioDoesnExist(resp));
				
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
	@GetMapping("/portfolioInfo")
	private JSONObject getPortfolio(HttpServletRequest request, HttpServletResponse response) {
		String token = request.getHeader("Authorization");
		
		try {
			User user = UserDaoJDBC.getInstance().findByToken(token);
			
			if(user == null) {
				JSONObject resp = new JSONObject();
				response.setStatus(Protocol.INVALID_TOKEN);
				resp.put("msg", "The auth token is not valid");
				
				return resp;
			}
			
			Portfolio portfolio = PortfolioDaoJDBC.getInstance().get(user.getUsername());
			
			if(portfolio != null) {
				response.setStatus(Protocol.OK);
				return PortfolioService.getInstance().getPortfolioInfo(portfolio);
			}
			else {
				JSONObject resp = new JSONObject();
				response.setStatus(portfolioDoesnExist(resp));
				
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
	@PostMapping("/addTransaction")
	public JSONObject addTransactionPortfolio(@RequestBody TransactionData transaction, HttpServletRequest request, HttpServletResponse response) {
		String token = request.getHeader("Authorization");
		JSONObject resp = new JSONObject();
		
		try {
			User user = UserDaoJDBC.getInstance().findByToken(token);
			
			if(user == null) {
				response.setStatus(Protocol.INVALID_TOKEN);
				resp.put("msg", "The auth token is not valid");
				
				return resp;
			}
			
			Portfolio portfolio = PortfolioDaoJDBC.getInstance().get(user.getUsername());
			
			if(portfolio != null) {
				Transaction transfer = Transaction.parseFromdata(transaction);	
				transfer.setPortfolioOwner(user.getUsername());
				TransactionDaoJDBC.getInstance().save(transfer);
				
				response.setStatus(Protocol.OK);
				resp.put("msg", "Transaction added succesfully");
				return resp;
				
			}
			else {
				response.setStatus(portfolioDoesnExist(resp));
				return resp;
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
			response.setStatus(Protocol.TRANSACTION_ERROR);
			resp.put("msg", "Cannot add this transaction");
			
			return resp;
		} catch (IllegalArgumentException e2) {
			response.setStatus(Protocol.INVALID_DATA);
			resp.put("msg", "The data provided are not valid");
			
			return resp;
		}
	}
	
	@SuppressWarnings("unchecked")
	@DeleteMapping("/removeCripto")
	public JSONObject removeCriptoFromPortfolio(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
		String token = request.getHeader("Authorization");
		JSONObject resp = new JSONObject();
		
		try {
			User user = UserDaoJDBC.getInstance().findByToken(token);
			
			if(user == null) {
				response.setStatus(Protocol.INVALID_TOKEN);
				resp.put("msg", "The auth token is not valid");
				
				return resp;
			}
			
			Portfolio portfolio = PortfolioDaoJDBC.getInstance().get(user.getUsername());
			
			if(portfolio != null) {
				String cripto_ticker = (String) obj.get("cripto_ticker");
				PortfolioDaoJDBC.getInstance().removeCrypto(cripto_ticker, portfolio.getUsernameOwner());
				
				response.setStatus(Protocol.OK);
				resp.put("msg", "Cripto removed successfully");
				return resp;
				
			}
			else {
				response.setStatus(portfolioDoesnExist(resp));
				return resp;
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
			response.setStatus(Protocol.REMOVE_CRIPTO_ERROR);
			resp.put("msg", "Cannot remove this asset");
			
			return resp;
		}
	}
	
	@SuppressWarnings("unchecked")
	@PostMapping("/createPortfolio")
	public JSONObject createNewPortfolio(@RequestBody JSONObject body, HttpServletRequest request, HttpServletResponse response) {
		String token = request.getHeader("Authorization");
		JSONObject resp = new JSONObject();
		
		try {
			User user = UserDaoJDBC.getInstance().findByToken(token);
			
			if(user == null) {
				response.setStatus(Protocol.INVALID_TOKEN);
				resp.put("msg", "The auth token is not valid");
				
				return resp;
			}
			
			Portfolio portfolio = PortfolioDaoJDBC.getInstance().get(user.getUsername());
			
			if(portfolio != null) {
				response.setStatus(Protocol.PORTFOLIO_ALREADY_EXISTS);
				resp.put("msg", "Portfolio already exists");
				return resp;
			}
			else {
				Portfolio newPortfolio = new Portfolio();
				newPortfolio.setUsernameOwner(user.getUsername());
				newPortfolio.setPortfolioName(new PortfolioName((String) body.get("name")));
				
				PortfolioDaoJDBC.getInstance().save(newPortfolio);
				
				response.setStatus(Protocol.OK);
				resp.put("msg", "Portfolio created successfully");
				
				return resp;
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
			response.setStatus(Protocol.SERVER_ERROR);
			resp.put("msg", "Internal server error");
			
			return resp;
		} catch (IllegalArgumentException | NullPointerException e2) {
			e2.printStackTrace();
			response.setStatus(Protocol.INVALID_DATA);
			resp.put("msg", "the portfolio name is not valid");
			
			return resp;
		}
	}
	
	@SuppressWarnings("unchecked")
	private int portfolioDoesnExist(JSONObject resp) {
		resp.put("msg", "The user doesn't have a portfolio");
		return Protocol.PORTFOLIO_DOESNT_EXISTS;
	}
}
