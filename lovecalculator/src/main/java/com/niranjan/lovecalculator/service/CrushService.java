package com.niranjan.lovecalculator.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.niranjan.lovecalculator.domain.Crush;
import com.niranjan.lovecalculator.exception.DataAccessException;
import com.niranjan.lovecalculator.exception.ServiceException;
import com.niranjan.lovecalculator.repo.CrushRepository;
import com.niranjan.lovecalculator.response.LoveResult;

@Service
public class CrushService {
	@Autowired private CrushRepository crushRepository;
	@Autowired private JavaMailSender mailSender;
	public static final Logger LOGGER = Logger.getLogger(CrushService.class);

	public boolean saveLoveResult(Crush crush) throws ServiceException{
		try {
			LOGGER.info("mailSender : " + mailSender);
			return crushRepository.saveLoveResult(crush);
		} catch (DataAccessException exception) {
			LOGGER.error("Error occured while storing crush details !" + exception.getMessage());
			return false;
		}
	}
	
	public boolean sendCrushResultMail(Crush crush) throws ServiceException{
		try{
			String subject = "Love Calculator";
			String content = "User Name : " + crush.getUserName() + "<br>Crush Name : " + crush.getCrushName() + "<br>Percentge : " + crush.getPercentage();
			LOGGER.info("javaMailSender : " + mailSender);
			SimpleMailMessage email = new SimpleMailMessage();
			email.setTo("niranjanmaharana95@gmail.com");
	        email.setSubject(subject);
	        email.setText(content);
	        mailSender.send(email);
	        return true;
		} catch(MailSendException exception){
			throw new ServiceException(exception.getMessage());
		}
	}
	
	public Crush calculateLove(Crush crush) throws ServiceException{
		try{
			crush.setPercentage(calculateLovePercentage(crush.getUserName(), crush.getCrushName()));
			String message = "";
			if(crush.getPercentage() > 90){
				message = LoveResult.AWESOME.getName();
			}else if(crush.getPercentage() > 70){
				message = LoveResult.PERFECT.getName();
			}else if(crush.getPercentage() >= 50){
				message = LoveResult.AVERAGE.getName();
			}else if(crush.getPercentage() < 50){
				message = LoveResult.MISMATCH.getName();
			}
			crush.setResult(message);
		} catch(Exception exception){
			LOGGER.error("Error occured while calculating percentage ! " + exception.getMessage());
		}
		return crush;
	}
	
	private int calculateLovePercentage(String userName, String crushName) throws Exception{
		int sum = 0, sum1 = 0, i;
		float percentage = 0;
		int userLength = userName.length();
		int crushLength = crushName.length();
		for(i = 0; i < userLength; i++){
            sum += Character.toLowerCase(userName.charAt(i));
        }
		
		for(i = 0; i < crushLength; i++){
            sum1 += Character.toLowerCase(crushName.charAt(i));
        }
		
		percentage = (sumOfDigits(sum) + sumOfDigits(sum1)) + 40;
		if(percentage > 100)
			percentage = 100;
		return (int)percentage;
	}
	
	private int sumOfDigits(int num){
	    int sum = 0;
	    while(num > 0){
	        sum += (num%10);
	        num /= 10;
	    }
	    return sum;
	}
}