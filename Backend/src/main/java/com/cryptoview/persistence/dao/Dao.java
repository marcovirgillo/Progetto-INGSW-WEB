package com.cryptoview.persistence.dao;

import java.sql.SQLException;
import java.util.List;

public interface Dao <T> {

	List<T> getAll() throws SQLException;
	void save(T obj) throws SQLException;
	
}
