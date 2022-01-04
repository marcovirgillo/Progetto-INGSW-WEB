package com.cryptoview.model;

public class News {
	
	private String url;
	private String imageUrl;
	private String title;
	private String description;
	
	private final int MAX_DESCRIPTION_LENGTH = 100;
	
	public News() {}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		if(description.length() > MAX_DESCRIPTION_LENGTH)
			this.description = description.substring(0, MAX_DESCRIPTION_LENGTH) + "...";
		else
			this.description = description;
	}
}
