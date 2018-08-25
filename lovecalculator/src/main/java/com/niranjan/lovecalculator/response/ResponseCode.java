package com.niranjan.lovecalculator.response;

public enum ResponseCode {
	INVALID_INPUT(0, "Invalid inputs !"),
	FAILED(1, "Failed"),
	SUCCESS(2, "Success");
	
	private int id;
	private String name;
	
	private ResponseCode() {}
	private ResponseCode(int id, String name){
		this.id = id;
		this.name = name;
	}
	public static ResponseCode getById(int id){
		return ResponseCode.values()[id];
	}
	
	public int getId(){
		return this.id;
	}
	
	public String getName(){
		return this.name;
	}
}