package com.niranjan.lovecalculator.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.google.gson.Gson;
import com.niranjan.lovecalculator.domain.Crush;
import com.niranjan.lovecalculator.exception.ServiceException;
import com.niranjan.lovecalculator.service.CrushService;

@Controller
@RequestMapping("/crush")
public class CrushController {
	
	@Autowired private CrushService crushService; 
	private static final Logger LOGGER = Logger.getLogger(StaticController.class);
	
	@RequestMapping(value = "/lovecalCulator", method = RequestMethod.GET)
	public ModelAndView lovecalCulator(HttpServletRequest request, 
			HttpServletResponse response){
		LOGGER.info("User selected love calculator");
		return new ModelAndView("calculate-love").addObject("crush", new Crush());
	}
	
	@RequestMapping(value = "/calculateLove", method = RequestMethod.POST)
	public ModelAndView calculateLove(HttpServletRequest request, 
			HttpServletResponse response, 
			@ModelAttribute("crush") Crush crush){
		LOGGER.info("crush : " + new Gson().toJson(crush));
		ModelAndView view = new ModelAndView("love-calculator-result");
		try {
			crush = crushService.calculateLove(crush);
			if(!crushService.saveLoveResult(crush) || !crushService.sendCrushResultMail(crush))
				view.addObject("meessage", "Error occured saving your data !");
		} catch (ServiceException exception) {
			view.addObject("meessage", exception.getMessage());
		}
		return view.addObject("crush", crush);
	}
}