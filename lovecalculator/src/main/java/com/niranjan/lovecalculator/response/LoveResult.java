package com.niranjan.lovecalculator.response;

public enum LoveResult {
	AWESOME(0, "Awesome"),
	PERFECT(1, "Perfect"),
	AVERAGE(2, "Average"),
	MISMATCH(3, "Does not match");
	
	private int id;
	private String name;
	
	private LoveResult() {}
	private LoveResult(int id, String name){
		this.id = id;
		this.name = name;
	}
	public static LoveResult getById(int id){
		return LoveResult.values()[id];
	}
	
	public int getId(){
		return this.id;
	}
	
	public String getName(){
		return this.name;
	}
}