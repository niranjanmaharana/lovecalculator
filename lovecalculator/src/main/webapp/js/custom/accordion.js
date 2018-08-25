function toggleSubstages(panelId){
	if($("#content"+panelId).hasClass("active")){
		$("#content"+panelId).removeClass("active");
		$("#extender"+panelId).html("&#9658;");
		$("#stageName"+panelId).removeClass("activelink");
		$("#content"+panelId).hide();
	}else{
		$("#extender"+panelId).html("&#9660;");
		$("#content"+panelId).addClass("active");
		$("#stageName"+panelId).addClass("activelink");
		$("#content"+panelId).show();
	}
}
/*
 * &#9658; - > inactive
 * &#9660; - > active
 * 
 * 
 * 
 */