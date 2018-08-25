var isUpdate = false;
var startDateValues = [];
var endDateValues = [];
var months = {jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12};
var tempSubstageNames = [];
var tempStageNames = [];
$(document).ready(function(){
	$("#addStageContainer").dialog({width:400, height:300, title:"Add Stage",autoOpen: false, modal: true,
		open : function(){$(".wrapper").addClass("transparent-overlay");startDateValues = [], endDateValues = [];},
		close : function(){$(".wrapper").removeClass("transparent-overlay");startDateValues = [], endDateValues = [];}
	});
	
	$("#addSubstageContainer").dialog({width:500, height:325, title:"Add Sub Stage",autoOpen: false, modal: true, 
		open : function(){$(".wrapper").addClass("transparent-overlay");},
		close : function(){$(".wrapper").removeClass("transparent-overlay");}
	});
	
	$("#configContainer").dialog({width:730, height:630, title:"Configuration",autoOpen: false, modal: true, 
		open : function(){$(".wrapper").addClass("transparent-overlay");},
		close : function(){$(".wrapper").removeClass("transparent-overlay");}
	});
	
	$("#vdetailLinkDialog").dialog({width:470, height:160, title:"Edit Vdetail Link",autoOpen: false, modal: true, 
		open : function(){$(".wrapper").addClass("transparent-overlay");},
		close : function(){$(".wrapper").removeClass("transparent-overlay");}
	});
	
	$("#addStage").click(function(){
		isUpdate = false;
		$(".ui-dialog-content").dialog().dialog("close");
		$("#stageId").val("");
		$("#stageName").val("");
		$("#startDate").val("");
		$("#endDate").val("");
		$("#addStageContainer").dialog({title : "Add Stage"});
		$("#addStageContainer").dialog("open");
	});
	
	$(".cancelDialog").click(function(){
		isUpdate = true;
		$(".ui-dialog-content").dialog().dialog("close");
	});
});

function editConnectUrl(substageid){
	$(".ui-dialog-content").dialog().dialog("close");
	$("#editConnectUrl").val($("#connectUrl"+substageid).val());
	$("#ssIdConnectUrl").val(substageid);
	$("#vdetailLinkDialog").dialog("open");
}

function updateConnectUrl(){
	$.ajax({
  		type: "POST",
		url: contextPath  + "/req/campaignstage/" + "updateConnectUrl",
  	  	data : {substageId: $("#ssIdConnectUrl").val(), connectUrl: $("#editConnectUrl").val()},
  	  	async:false,
  	  	success: function(response){
  	  		alert(response);
  	  		$("#connectUrl"+$("#ssIdConnectUrl").val()).val($("#editConnectUrl").val());
  	  		$(".ui-dialog-content").dialog().dialog("close");
  	  	},
  	  	error : function(response){
  	  		alert(response.responseText);
  	  	}
	});
}

function parseDate(dateToParse) {
	var splittedDate = dateToParse.split('-');
	return new Date(splittedDate[2] + "-" + months[splittedDate[1].toLowerCase()] + "-" + splittedDate[0]);
}

function isValidCampaignStageForm(){
	if($("#stageName").val() == ""){
		alert("Enter stage name !");
		return false;
	}
	if($("#startDate").val() == ""){
		alert("Enter start date !");
		return false;
	}
	if($("#endDate").val() == ""){
		alert("Enter end date !");
		return false;
	}
	var startDate = parseDate($("#startDate").val());
    var endDate = parseDate($("#endDate").val());
    //check start date and end date(end date should be after start date)
    if(endDate < startDate){
    	alert("End date should be after start date !");
    	return false;
    }
    //check campaign level start date and end date
    var campaignStartDate = parseDate($("#campaignStartDate").html().trim());
    var campaignEndDate = parseDate($("#campaignEndDate").html().trim());
    if(startDate < campaignStartDate){
    	alert("Stage should be started from campaign start date("+$("#campaignStartDate").html().trim()+") !");
    	return false;
    }
    if(endDate > campaignEndDate){
    	alert("Stage should be end before campaign end date("+$("#campaignEndDate").html().trim()+") !");
    	return false;
    }
    //validation for substage start date and end date
    for(var i = 0; i < startDateValues.length; i++){
		if(startDate > new Date(startDateValues[i])){
	    	alert("Selected start date violates internal substage start dates !");
	    	return false;
	    }
		if(endDate < new Date(endDateValues[i])){
			alert("Selected end date violates internal substage end dates !");
	    	return false;
		}
	}
    //check stage name duplication
    if(!isUpdate && (campaignStageNames.indexOf($("#stageName").val()) != -1)){
		alert("Another stage exist with the same name !");
		return false;
	}
	if(isUpdate && (tempStageNames.indexOf($("#stageName").val()) != -1)){
		alert("Another stage exist with the same name !");
		return false;
	}
	var apiUrl = contextPath  + "/req/campaignstage/" + (isUpdate ? "updateCampaignStage" : "insertCampaignStage");
	$.ajax({
  		type: "POST",
		url: apiUrl,
  	  	data : $("#addCampaignStageForm").serialize(),
  	  	async:false,
  	  	success: function(response){
  	  		isUpdate = false;
  			alert(response);
  			window.location.href = contextPath  + "/req/campaignstage/listCampaignStages?campaignId="+$("#campaignIdField").val();
  	  	},
  	  	error : function(response){
  	  		alert(response.responseText);
  	  		isUpdate = true;
  	  	}
	});
	return false;
}

function isValidCampaignSubstageForm(){
	var stageId = $("#sstageId").val();
	if(stageId == ""){
		alert("Internal error occured please try again !");
		window.location.href = contextPath  + "/req/campaignstage/listCampaignStages?campaignId="+$("#campaignIdField").val();
		return false;
	}
	if($("#campaignSubStageName").val() == ""){
		alert("Enter substage name !");
		$("#campaignSubStageName").focus();
		return false;
	}
	if($("#sStartDate").val() == ""){
		alert("Enter start date !");
		return false;
	}
	if($("#sEndDate").val() == ""){
		alert("Enter end date !");
		return false;
	}
	if($("#connectType").val() == "-1"){
		alert("Select connect type !");
		$("#connectType").focus();
		return false;
	}
	var stageStartDate = parseDate($("#stageStartDate"+stageId).html().trim());
	var stageEndDate = parseDate($("#stageEndDate"+stageId).html().trim());
	var startDate = parseDate($("#sStartDate").val());
    var endDate = parseDate($("#sEndDate").val());
	//check start date and end date(end date should be after start date)
    if(endDate < startDate){
    	alert("End date should be after start date !");
    	return false;
    }
    //check whether substage lies between stage start date and end date
    if(stageStartDate > startDate){
    	alert("Substage start date should be from stage start date("+($("#stageStartDate"+stageId).html().trim())+") !");
    	return false;
    }if(stageEndDate < endDate){
    	alert("Substage end date should be before stage end date("+($("#stageEndDate"+stageId).html().trim())+") !");
    	return false;
    }
    //check substage name duplication
	if(!isUpdate && (campaignSubstageNames.indexOf($("#campaignSubStageName").val()) != -1)){
		alert("Another substage exist with the same name !");
		return false;
	}
	if(isUpdate && (tempSubstageNames.indexOf($("#campaignSubStageName").val()) != -1)){
		alert("Another substage exist with the same name !");
		return false;
	}
	var apiUrl = "";
	apiUrl = contextPath  + "/req/campaignstage/" + (isUpdate ? "updateCampaignSubstage" : "insertCampaignSubstage");
	$.ajax({
  		type: "POST",
  		beforeSend: function(){
  			$("#form-loader").css("display","inline-block");
			$(".wrapper").css("pointer-events", "none");
			$(".wrapper").css("opacity", "0.5");
			$("#addSubstageContainer").css("pointer-events", "none");
			$("#addSubstageContainer").css("opacity", "0.5");
  		},
		url: apiUrl,
  	  	data : $("#addCampaignSubstageForm").serialize(),
  	  	async:false,
  	  	success: function(response){
  			//alert(response);
  			window.location.href = contextPath  + "/req/campaignstage/listCampaignStages?campaignId="+$("#campaignIdField").val();
  	  	},
  	  	error : function(response){
	  	  	$("#form-loader").css("display","none");
			$(".wrapper").css("pointer-events", "");
			$(".wrapper").css("opacity", "1");
			$("#addSubstageContainer").css("pointer-events", "");
			$("#addSubstageContainer").css("opacity", "1");
		  	alert(response.responseText);
  	  	}
	});
	return false;
}

function fadeOutMessage() {
	$("#msg").fadeOut().empty();
}

function editStage(stageId){
	isUpdate = true;
	$(".ui-dialog-content").dialog().dialog("close");
	var stageName = $("#stageName"+stageId).html().trim();
	var startDate = $("#stageStartDate"+stageId).html().trim();
	var endDate = $("#stageEndDate"+stageId).html().trim();
	tempStageNames = [];
	for(var i = 0; i < campaignStageNames.length; i++){
		if(campaignStageNames[i] != stageName)
			tempStageNames[i] = campaignStageNames[i];
	}
	$("#stageId").val(stageId);
	$("#stageName").val(stageName);
	$("#startDate").val(startDate);
	$("#endDate").val(endDate);
	$("#addStageContainer").dialog({title : "Update Stage"});
	$("#addStageContainer").dialog("open");
	//get all sub stage start dates and end dates
	$.ajax({
  		type: "POST",
		url: contextPath  + "/req/campaignstage/editCampaignStage",
  	  	data : {campaignStageId : stageId},
  	  	async:false,
  	  	success: function(response){
  	  		if(response != ""){
	  			startDateValues = JSON.parse(JSON.parse(response).startDates);
	  			endDateValues =  JSON.parse(JSON.parse(response).endDates);
	  		}
  	  	},
  	  	error : function(response){
  	  		console.log(response.responseText);
  	  	}
	});
}
function deleteStage(stageId){
	var substageIds = [];
	for(var i = 0; i < campaignStageList.length; i++){
		if(stageId == campaignStageList[i].id){
			var substageList = campaignStageList[i].campaignSubstagesSet;
			for(var j = 0; j < substageList.length; j++){
				if(substageList[j].jobExecutionStatus == true){
					alert("Can not delete stage ! One or more substage(s) are already exceuted !");
					return false;
				}
				substageIds[j] = substageList[j].id;
			}
			break;
		}
	}
	for(var i = 0; i < campaignStageList.length; i++){
		if(stageId != campaignStageList[i].id){
			var substageList = campaignStageList[i].campaignSubstagesSet;
			for(var j = 0; j < substageList.length; j++){
				if((substageIds.indexOf(substageList[j].ssIdForPass) != -1) || (substageIds.indexOf(substageList[j].ssIdForFail) != -1)){
					alert("Can not be deleted ! It is being used by other substage(s) !");
					return false;
				}
			}
		}
	}
	if(confirm("Do you want to delete " + $("#stageName"+stageId).html().trim() + " ?")){
		$.ajax({
	  		type: "POST",
			url: contextPath  + "/req/campaignstage/deleteCampaignStageByCampaignStageId",
	  	  	data : {campaignStageId : stageId},
	  	  	async:false,
	  	  	success: function(response){
	  			alert(response);
	  			window.location.href = contextPath  + "/req/campaignstage/listCampaignStages?campaignId="+$("#campaignIdField").val();
	  	  	},
	  	  	error : function(response){
	  	  		alert(response.responseText);
	  	  	}
		});
	}
}
function addSubstage(stageId){
	isUpdate = false;
	$(".ui-dialog-content").dialog().dialog("close");
	$("#sstageId").val(stageId);
	$("#ssubstageId").val("");
	$("#campaignSubStageName").val("");
	$("#connectUrl").val("");
	$("#sStartDate").val("");
	$("#sEndDate").val("");
	//set start date and end date of substage as per stage
	var stageStartDate = parseDate($("#stageStartDate"+stageId).html().trim());
	var stageEndDate = parseDate($("#stageEndDate"+stageId).html().trim());
	$("#sStartDate").datepicker({
        dateFormat: "dd-M-yy",
        minDate : stageStartDate,
        maxDate : stageEndDate,
        onSelect: function (date) {}
    });
    $('#sEndDate').datepicker({
        dateFormat: "dd-M-yy",
        minDate : stageStartDate,
        maxDate : stageEndDate,
        onSelect: function(date){
        	var $from = $("#sStartDate").val();
        	var $to = $(this).val();
        	if($from > $to){
        		alert("Start date should be before end date !");
        	}
        } 
    });
	$("#addSubstageContainer").dialog("open");
}
function editSubstage(stageId, substageId){
	//set start date and end date of substage as per stage
	var stageStartDate = parseDate($("#stageStartDate"+stageId).html().trim());
	var stageEndDate = parseDate($("#stageEndDate"+stageId).html().trim());
	$("#sStartDate").datepicker({
        dateFormat: "dd-M-yy",
        minDate : stageStartDate,
        maxDate : stageEndDate,
        onSelect: function (date) {}
    });
    $('#sEndDate').datepicker({
        dateFormat: "dd-M-yy",
        minDate : stageStartDate,
        maxDate : stageEndDate,
        onSelect: function(date){
        	var $from = $("#sStartDate").val();
        	var $to = $(this).val();
        	if($from > $to){
        		alert("Start date should be before end date !");
        	}
        } 
    });
	//open dialog
	isUpdate = true;
	$(".ui-dialog-content").dialog().dialog("close");
	var subStageName = $("#substageTitle"+substageId).html().trim();
	var connectUrl = $("#connectUrl"+substageId).val().trim();
	var startDate = $("#ssStartDate"+substageId).val();
	var endDate = $("#ssEndDate"+substageId).val();
	var contentId = $("#contentId"+substageId).val();
	tempSubstageNames = [];
	for(var i = 0; i < campaignSubstageNames.length; i++){
		if(campaignSubstageNames[i] != subStageName)
			tempSubstageNames[i] = campaignSubstageNames[i];
	}
	$("#sscontentId").val(contentId);
	$("#sstageId").val(stageId);
	$("#substageId").val(substageId);
	$("#campaignSubStageName").val(subStageName);
	$("#connectUrl").val(connectUrl);
	$("#sStartDate").val(startDate);
	$("#sEndDate").val(endDate);
	$("#addSubstageContainer").dialog({title : "Update Sub Stage"});
	$("#addSubstageContainer").dialog("open");
}
function updateAll(stageId, substageId){
	var connectTypeName = "connectType"+substageId;
	var connectType = $("input[name='"+connectTypeName+"']:checked").val().trim();
	var ssIdForPass = $("#ssIdForPass"+substageId).val().trim();
	var ssIdForFail = $("#ssIdForFail"+substageId).val().trim();
	var remainders = $("#remainders"+substageId).val().trim();
	var optionLenghtForPass = $('select#ssIdForPass'+substageId+' option').length;
	var optionLenghtForFail = $('select#ssIdForFail'+substageId+' option').length;
	/*if((optionLenghtForPass > 1) && (ssIdForPass == "-1" || ssIdForPass == "")){
		alert("Select substage for pass !");
		$("#ssIdForPass"+substageId).focus();
		return false;
	}
	if((optionLenghtForFail > 1) && (ssIdForFail == "-1" || ssIdForFail == "")){
		alert("Select substage for fail !");
		$("#ssIdForFail"+substageId).focus();
		return false;
	}*/
	if((remainders == "") || (isNaN(remainders))){
		alert("Enter valid number for remainders !");
		$("#remainders"+substageId).val("");
		$("#remainders"+substageId).focus();
		return false;
	}
	var noShow = $("#noShow"+substageId).val().trim();
	var content = {substageId : substageId, connectType : connectType, ssIdForPass : ssIdForPass, ssIdForFail: ssIdForFail, remainders : remainders, noShow : noShow};
	$.ajax({
  		type: "POST",
  		beforeSend: function(){
  			$("#form-loader").css("display","inline-block");
			$(".wrapper").css("pointer-events", "none");
			$(".wrapper").css("opacity", "0.5");
  		},
  		complete: function(){
  			$("#form-loader").css("display","none");
			$(".wrapper").css("pointer-events", "");
			$(".wrapper").css("opacity", "1");
  		},
		url: contextPath + "/req/campaignstage/updateCampaignSubstageWithOutForm",
  	  	data : content,
  	  	async:false,
  	  	success: function(response){
  	  		campaignStageList = JSON.parse(response);
  	  		//alert(response);
  			//window.location.href = "listCampaignStages?campaignId="+$("#campaignIdField").val();
  	  	},
  	  	error : function(response){
  	  		alert(response.responseText);
  	  	}
	});
}
function deleteSubstage(substageId){
	for(var i = 0; i < campaignStageList.length; i++){
		var substageList = campaignStageList[i].campaignSubstagesSet;
		for(var j = 0; j < substageList.length; j++){
			if((substageId == substageList[j].ssIdForPass) || (substageId == substageList[j].ssIdForFail)){
				alert("Selected substage can not be deleted ! It is being used by other substage(s) !");
				return false;
			}
		}
	}
	
	if(confirm("Do you want to delete " + $("#substageTitle"+substageId).html().trim() + " ?")){
		$.ajax({
	  		type: "POST",
			url: contextPath + "/req/campaignstage/deleteCampaignSubstageBySubstageId",
	  	  	data : {substageId : substageId},
	  	  	async:false,
	  	  	success: function(response){
	  			alert(response);
	  			window.location.href = contextPath  + "/req/campaignstage/listCampaignStages?campaignId="+$("#campaignIdField").val();
	  	  	},
	  	  	error : function(response){
	  	  		alert(response.responseText);
	  	  	}
		});
	}
}
function editConfiguration(substageId){
	$(".ui-dialog-content").dialog().dialog("close");
	$("#configContainer").dialog("open");
}