package com.niranjan.lovecalculator.repo;

import com.niranjan.lovecalculator.domain.Crush;
import com.niranjan.lovecalculator.exception.DataAccessException;

public interface CrushRepository {
	public boolean saveLoveResult(Crush crush) throws DataAccessException;
}