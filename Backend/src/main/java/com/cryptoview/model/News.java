package com.cryptoview.model;

public class News {
	
	private String url;
	private String imageUrl;
	private String title;
	private String description;
	private String punlishedAt;
	private String content;

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
	
	public String getPublishedAt() {
		return punlishedAt;
	}
	
	public void setPublishedAt(String publishedAt) {
		this.punlishedAt = publishedAt;
	}
	
	public String getContent() {
		return content;
	}
	
	public void setContent(String content) {
		
		int posToRemove= content.indexOf("[");
		if(posToRemove != -1)
			this.content = content.substring(0, posToRemove-1);
		else
			this.content = content;
	}
}
