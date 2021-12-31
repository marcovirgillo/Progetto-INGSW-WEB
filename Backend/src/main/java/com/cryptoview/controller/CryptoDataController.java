package com.cryptoview.controller;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cryptoview.model.api.Top100Fetch;

@RestController
@CrossOrigin(origins = {"localhost:3000", "localhost:8080"})
public class CryptoDataController {
	
	@GetMapping("/get100")
	//restituisce il primo object della lista, quindi la prima cripto, è solo per dimostrare che funfa e che
	//marco è frocio
	private JSONObject getTop100() {
		JSONArray top100 = Top100Fetch.getInstance().fetch();
		JSONObject obj = (JSONObject) top100.get(0);
		System.out.println(obj);
		return obj;
	}
	

}
