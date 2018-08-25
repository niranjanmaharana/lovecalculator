package com.niranjan.lovecalculator.exception;

public class ServiceException extends Exception{
	private static final long serialVersionUID = 859137189295772837L;
	private String message;
	
	public ServiceException() {
		super();
	}
	
	public ServiceException(String message) {
		super(message);
	}
	
	public String getMessage() {
		return message;
	}
	
	public void setMessage(String message) {
		this.message = message;
	}
}