package com.cryptoview.controller;

public class Protocol {
	public static final int OK = 200;
	public static final int SERVER_ERROR = 500;
	public static final int INVALID_TOKEN = 5000;
	//è per quendo le credenziali non rispettano regex, min length ecc..
	public static final int INVALID_CREDENTIALS = 403;
	//la combinazione user/pass è sbagliata
	public static final int WRONG_CREDENTIALS = 401;
	public static final int PORTFOLIO_DOESNT_EXISTS = 5010;
	public static final int INVALID_DATA = 5020;
	public static final int TRANSACTION_ERROR = 5030;
	public static final int REMOVE_CRIPTO_ERROR = 5040;
	public static final int PORTFOLIO_ALREADY_EXISTS = 5050;
}
