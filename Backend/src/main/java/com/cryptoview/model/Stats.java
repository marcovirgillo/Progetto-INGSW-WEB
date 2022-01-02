package com.cryptoview.model;

public class Stats {
	private long total_market_cap;
	private long volume_24h;
	private Double bitcoin_dominance;
	
	public Stats() {}
	
	public long getTotal_market_cap() {
		return total_market_cap;
	}
	
	public void setTotal_market_cap(long total_market_cap) {
		this.total_market_cap = total_market_cap;
	}
	
	public long getVolume_24h() {
		return volume_24h;
	}
	
	public void setVolume_24h(long volume_24h) {
		this.volume_24h = volume_24h;
	}
	
	public Double getBitcoin_dominance() {
		return bitcoin_dominance;
	}
	
	public void setBitcoin_dominance(Double bitcoin_dominance) {
		this.bitcoin_dominance = bitcoin_dominance;
	}

	@Override
	public String toString() {
		return "Stats [total_market_cap=" + total_market_cap + ", volume_24h=" + volume_24h + ", bitcoin_dominance="
				+ bitcoin_dominance + "]";
	}
}
