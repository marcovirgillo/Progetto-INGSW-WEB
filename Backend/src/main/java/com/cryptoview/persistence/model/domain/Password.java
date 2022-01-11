package com.cryptoview.persistence.model.domain;

import static org.apache.commons.lang3.Validate.*;

public class Password {
	private final String value;
		
	private final String regex = "(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@\\.?#$%^&+=!])(?=\\S+$).*";
	private final int min_len = 4;
	private final int max_len = 20;
	
	public Password(String value) {
		notNull(value);
		inclusiveBetween(min_len, max_len, value.length());
		//matchesPattern(value, regex);
		
		this.value = value;
	}
	
	@Override
	public String toString() {
		return value;
	}
}
