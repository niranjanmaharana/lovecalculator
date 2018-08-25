package com.niranjan.lovecalculator.repo;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.niranjan.lovecalculator.domain.Crush;
import com.niranjan.lovecalculator.exception.DataAccessException;

@Repository
public class CrushRepositoryImpl implements CrushRepository{
	@Autowired private JdbcTemplate jdbcTemplate;
	public static final Logger LOGGER = Logger.getLogger(CrushRepositoryImpl.class);
	
	@Override
	public boolean saveLoveResult(Crush crush) throws DataAccessException {
		LOGGER.info("jdbcTemplate : " + jdbcTemplate);
		try{
			String sqlQuery = "INSERT INTO " + TableConstants.TABLE_CRUSH + "(userName, crushName, percentage, result) "
					+ "VALUES(?, ?, ?, ?)";
			return jdbcTemplate.update(sqlQuery, 
					new Object[]{
							crush.getUserName(), 
							crush.getCrushName(), 
							crush.getPercentage(), 
							crush.getResult()
					}
			) > 0;
		} catch(CannotGetJdbcConnectionException exception){
			exception.printStackTrace();
			throw new DataAccessException(exception.getMessage());
		} catch(DuplicateKeyException exception){
			throw new DataAccessException("Duplicate entry found ! Try again.");
		}
	}
}