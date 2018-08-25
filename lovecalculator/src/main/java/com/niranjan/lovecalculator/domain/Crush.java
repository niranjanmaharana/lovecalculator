package com.niranjan.lovecalculator.domain;

import java.io.Serializable;

public class Crush implements Serializable{
	private static final long serialVersionUID = -8198526258984309419L;
	private int serialNo;
	private String userName;
	private String crushName;
	private int percentage;
	private String result;
	private boolean sent;
	
	public Crush() {}
	
	public Crush(int serialNo, String userName, String crushName, int percentage, String result) {
		super();
		this.userName = userName;
		this.crushName = crushName;
		this.percentage = percentage;
		this.result = result;
	}

	public int getSerialNo() {
		return serialNo;
	}
	public void setSerialNo(int serialNo) {
		this.serialNo = serialNo;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getCrushName() {
		return crushName;
	}
	public void setCrushName(String crushName) {
		this.crushName = crushName;
	}
	public int getPercentage() {
		return percentage;
	}
	public void setPercentage(int percentage) {
		this.percentage = percentage;
	}
	public String getResult() {
		return result;
	}
	public void setResult(String result) {
		this.result = result;
	}
	public boolean isSent() {
		return sent;
	}
	public void setSent(boolean sent) {
		this.sent = sent;
	}
}