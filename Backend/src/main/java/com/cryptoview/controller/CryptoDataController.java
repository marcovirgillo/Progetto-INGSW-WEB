package com.cryptoview.controller;

import java.util.ArrayList;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cryptoview.model.CryptoStats;
import com.cryptoview.model.api.Top100Fetch;

@RestController
@CrossOrigin(origins = {"localhost:3000", "localhost:8080"})
public class CryptoDataController {
	
	@GetMapping("/get100")
	private String getTop100() {
		String top100 = Top100Fetch.getInstance().fetch();
		
		return top100;
	}
	

}
