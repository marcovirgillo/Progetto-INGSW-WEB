package com.cryptoview.persistence.model.domain;

import static org.apache.commons.lang3.Validate.inclusiveBetween;
import static org.apache.commons.lang3.Validate.matchesPattern;
import static org.apache.commons.lang3.Validate.notNull;

public class PortfolioName {	
	private final String value;
	
	private final String regex = "[a-zA-Z _]+";
	private final int min_len = 2;
	private final int max_len = 25;
	
	public PortfolioName(String value) {
		notNull(value);
		inclusiveBetween(min_len, max_len, value.length());
		matchesPattern(value, regex);
		
		this.value = value;
	}
	
	@Override
	public String toString() {
		return value;
	}

}