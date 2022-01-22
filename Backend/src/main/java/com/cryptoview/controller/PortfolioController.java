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
import com.cryptoview.controller.transfers.TransactionUpdate;
import com.cryptoview.persistence.dao.PortfolioDaoJDBC;
import com.cryptoview.persistence.dao.TransactionDaoJDBC;
import com.cryptoview.persistence.dao.UserDaoJDBC;
import com.cryptoview.persistence.model.Portfolio;
import com.cryptoview.persistence.model.Transaction;
import com.cryptoview.persistence.model.User;
import com.cryptoview.persistence.model.domain.PortfolioName;
import com.cryptoview.service.PortfolioService;

interface TransactionFunction {
	void call(String username) throws SQLException;
}

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
			if(portfolio != null) {
				response.setStatus(Protocol.OK);
				JSONObject obj = PortfolioService.getInstance().getPortfolioValueTime(portfolio, timeStamp);
				
				return obj;
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
	@GetMapping("/assetTransactions")
	public JSONObject getAssetTransactions(HttpServletRequest request, HttpServletResponse response) {
		String token = request.getHeader("Authorization");
		String cripto_ticker = request.getHeader("Cripto-Ticker");
		JSONObject resp = new JSONObject();
		
		try {
			User user = UserDaoJDBC.getInstance().findByToken(token);
			
			if(user == null) {
				response.setStatus(Protocol.INVALID_TOKEN);
				resp.put("msg", "The auth token is not valid");
				
				return resp;
			}
			
			if(cripto_ticker == null || cripto_ticker.isBlank()) {
				response.setStatus(Protocol.INVALID_DATA);
				resp.put("msg", "The cripto ticker is not valid");
				
				return resp;
			}
			
			Portfolio portfolio = PortfolioDaoJDBC.getInstance().get(user.getUsername());
			
			if(portfolio != null) {
				response.setStatus(Protocol.OK);
				resp.put("transactions", PortfolioService.getInstance().getCriptoTransactionOfUser(portfolio, cripto_ticker));
				
				return resp;
			}
			else {
				response.setStatus(portfolioDoesnExist(resp));
				return resp;
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
			response.setStatus(Protocol.SERVER_ERROR);
			resp.put("msg", "Internal server error");
			
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
	public JSONObject addTransactionTemplate(HttpServletRequest request, HttpServletResponse response, TransactionFunction function) {
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
				function.call(user.getUsername());
				
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
			resp.put("msg", "Insufficient cripto amount");
			
			return resp;
		}
	}
	
	@SuppressWarnings("unchecked")
	@PostMapping("/addTransaction")
	public JSONObject addTransactionPortfolio(@RequestBody TransactionData transaction, HttpServletRequest request, HttpServletResponse response) throws SQLException {
		TransactionFunction fun;
		try {
			Transaction transfer = Transaction.parseFromdata(transaction);
			fun = (String username) -> {
				transfer.setPortfolioOwner(username);
				TransactionDaoJDBC.getInstance().save(transfer);
			};
		} catch (IllegalArgumentException e) {
			response.setStatus(Protocol.INVALID_DATA);
			JSONObject resp = new JSONObject();
			resp.put("msg", "The data provided are not valid");
			
			return resp;
		}
		
		return addTransactionTemplate(request, response, fun);
	}
	
	@SuppressWarnings("unchecked")
	@PostMapping("/updateTransaction")
	public JSONObject updateTransactionOfPortfolio(@RequestBody TransactionUpdate transactionData, HttpServletRequest request, HttpServletResponse response) throws SQLException {
		TransactionFunction fun;
		try {
			Transaction transfer = Transaction.parseFromdata(transactionData.data);
			fun = (String username) -> {
				transfer.setPortfolioOwner(username);
				TransactionDaoJDBC.getInstance().updateTransaction(transactionData.id, transfer);
			};
		} catch (IllegalArgumentException e) {
			response.setStatus(Protocol.INVALID_DATA);
			JSONObject resp = new JSONObject();
			resp.put("msg", "The data provided are not valid");
			
			return resp;
		}
		
		return addTransactionTemplate(request, response, fun);
	}
	
	@SuppressWarnings("unchecked")
	@DeleteMapping("/removeTransaction")
	public JSONObject addTransactionTemplate(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
		String token = request.getHeader("Authorization");
		JSONObject resp = new JSONObject();
		
		try {
			int transaction_id = (int) obj.get("transaction_id");
			User user = UserDaoJDBC.getInstance().findByToken(token);
			
			if(user == null) {
				response.setStatus(Protocol.INVALID_TOKEN);
				resp.put("msg", "The auth token is not valid");
				
				return resp;
			}
			
			Portfolio portfolio = PortfolioDaoJDBC.getInstance().get(user.getUsername());
			
			if(portfolio != null) {
				TransactionDaoJDBC.getInstance().removeTransaction(transaction_id, user.getUsername());
				
				response.setStatus(Protocol.OK);
				resp.put("msg", "Transaction removed succesfully");
				return resp;
				
			}
			else {
				response.setStatus(portfolioDoesnExist(resp));
				return resp;
			}
			
		} catch (Exception e) {
			response.setStatus(Protocol.SERVER_ERROR);
			resp.put("msg", "Internal server error");
			
			return resp;
		}
	}
	
	@SuppressWarnings("unchecked")
	private int portfolioDoesnExist(JSONObject resp) {
		resp.put("msg", "The user doesn't have a portfolio");
		return Protocol.PORTFOLIO_DOESNT_EXISTS;
	}
}
