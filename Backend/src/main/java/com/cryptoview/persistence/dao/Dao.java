package com.cryptoview.persistence.dao;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

public interface Dao <T> {

	List<T> getAll() throws SQLException;
}
