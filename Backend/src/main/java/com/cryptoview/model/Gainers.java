package com.cryptoview.model;

public class Gainers implements Comparable <Gainers>{
	private Integer id;
	private String image;
	private Double change_24h;
	private String name;
	
	public Gainers() {
		// TODO Auto-generated constructor stub
	}
	
	public Gainers(Integer id, String image, Double change_24h, String name) {
		super();
		this.id = id;
		this.image = image;
		this.change_24h = change_24h;
		this.name = name;
	}

	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getImage() {
		return image;
	}
	public void setImage(String image) {
		this.image = image;
	}
	public Double getChange_24h() {
		return change_24h;
	}
	public void setChange_24h(Double change_24h) {
		this.change_24h = change_24h;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}

	@Override
	public int compareTo(Gainers gainerz) {
		if(this.change_24h < 0 && gainerz.change_24h < 0) {
			if(this.change_24h > gainerz.change_24h)
				return 1;
			
			if(this.change_24h == gainerz.change_24h)
				return 0;
			
			return -1;
		}
		else {
			if(this.change_24h > gainerz.change_24h)
				return -1;
			
			if(this.change_24h == gainerz.change_24h)
				return 0;
			
			return 1;
		}
	}
	
}
