package com.cryptoview;

import com.cryptoview.model.api.Top100Fetch;

public class Main {

	public static void main(String[] args) {
		System.out.println("a");
		Top100Fetch.getInstance().fetch();
	}
}
