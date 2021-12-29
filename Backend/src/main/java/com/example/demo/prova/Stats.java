package com.example.demo.prova;

public class Stats {
	
	private String name;
	private String value;
	
	public Stats() { }
	
	public Stats(String name, String value) {
		this.name = name;
		this.value = value;
	}
	
	public String getName() {
		return name;
	}
	
	public String getValue() {
		return value;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public void setValue(String value) {
		this.value = value;
	}
	
}
