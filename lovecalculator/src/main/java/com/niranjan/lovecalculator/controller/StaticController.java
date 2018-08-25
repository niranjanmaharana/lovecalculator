package com.niranjan.lovecalculator.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value = "/")
public class StaticController {
	
	private static final Logger logger = Logger.getLogger(StaticController.class);
	
	@RequestMapping(value = "/")
	public ModelAndView index(HttpServletRequest request, 
			HttpServletResponse response){
		logger.info("index()");
		return new ModelAndView("calculate-love");
	}
}