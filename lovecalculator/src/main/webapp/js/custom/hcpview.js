$(document).ready(function() {
		var isiPhone = navigator.userAgent.toLowerCase().indexOf("iphone");
 		var isAndroid = /android/i.test(navigator.userAgent.toLowerCase());
 		var isBlackberry = navigator.userAgent.toLowerCase().indexOf("BlackBerry");
 		if(isiPhone > -1){
			isMobileDevice = true;
		}
		else if(isAndroid){
			isMobileDevice = true;
		}
		else if(isBlackberry > -1){
			isMobileDevice = true;
		}
		if(!isMobileDevice){
			$('head').append('<meta id="viewport" name="viewport" content="initial-scale=1.0; maximum-scale=1.0; user-scalable=no;">'); 
		}
		if(isMobileDevice){
			 $('.compose_container').css({'padding-left':'20px'}); 
		}
});