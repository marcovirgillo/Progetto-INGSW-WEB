package com.cryptoview.model;

public class Exchanges {
	private String logo;
	private Long rank;
	private String name;
	private Long trust_score;
	private Double volume;
	private String country;
	private Long year_established;
	private String chart_7d;
	
	public Exchanges() {}
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Long getTrust_score() {
		return trust_score;
	}
	public void setTrust_score(Long trust_score) {
		this.trust_score = trust_score;
	}
	public Double getVolume() {
		return volume;
	}
	public void setVolume(Double volume) {
		this.volume = volume;
	}
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	public Long getYearEstabilished() {
		return year_established;
	}
	public void setYearEstabilished(Long year_estabilished) {
		this.year_established = year_estabilished;
	}
	public Long getRank() {
		return rank;
	}
	public void setRank(Long rank) {
		this.rank = rank;
	}
	public String getLogo() {
		return logo;
	}
	public void setLogo(String logo) {
		this.logo = logo;
	}
	public String getChart_7d() {
		return chart_7d;
	}
	public void setChart_7d(String chart_7d) {
		this.chart_7d = chart_7d;
	}
	
}
