package com.niranjan.lovecalculator.exception;

public class DataAccessException extends Exception{
	private static final long serialVersionUID = 859137189295772837L;
	private String message;
	
	public DataAccessException() {
		super();
	}
	
	public DataAccessException(String message) {
		super(message);
	}
	
	public String getMessage() {
		return message;
	}
	
	public void setMessage(String message) {
		this.message = message;
	}
}