var weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var isUpdate = false;
var substageStatus = ["On Enter", "Sent", "Viewed", "Pass", "Fail", "No-Show"];
var substageScheduleTime = "";
var startDateValues = [];
var endDateValues = [];
var tempSubstageNames = [];
var tempStageNames = [];
var months = {jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12};
$(document).ready(function(){
	$("#addStageContainer").dialog({width:400, height:300, title:"Add Stage",autoOpen: false, modal: true,
		open : function(){$(".outer_wraper").addClass("transparent-overlay"); startDateValues = [], endDateValues = [];},
		close : function(){$(".outer_wraper").removeClass("transparent-overlay"); startDateValues = [], endDateValues = [];}
	});
	
	$("#addSubstageContainer").dialog({width:500, height:325, title:"Add Sub Stage",autoOpen: false, modal: true,
		open : function(){$(".outer_wraper").addClass("transparent-overlay");},
		close : function(){$(".outer_wraper").removeClass("transparent-overlay");}
	});
	
	$("#configContainer").dialog({width:730, height:630, title:"Configuration",autoOpen: false, modal: true,
		open : function(){$(".outer_wraper").addClass("transparent-overlay");},
		close : function(){$(".outer_wraper").removeClass("transparent-overlay");}
	});
	
	$("#userList").dialog({width:500, height:400, title:"HCP List ",autoOpen: false, modal: true,
		open : function(){$(".outer_wraper").addClass("transparent-overlay");},
		close : function(){$(".outer_wraper").removeClass("transparent-overlay");}
	});
	
	$("#vdetailLinkDialog").dialog({width:470, height:160, title:"Edit Vdetail Link",autoOpen: false, modal: true,
		open : function(){$(".outer_wraper").addClass("transparent-overlay");},
		close : function(){$(".outer_wraper").removeClass("transparent-overlay");}
	});
	
	$("#scheduleDialog").dialog({width:330, height:220, title:"SCHEDULE SUBSTAGE",autoOpen: false, modal: true,
		open : function(){$(".outer_wraper").addClass("transparent-overlay");},
		close : function(){$(".outer_wraper").removeClass("transparent-overlay");$("#timeContainer").remove();}
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
		$(".ui-dialog-content").dialog().dialog("close");
	});
	
	$("#retireUsers").click(function(){
		retireUsers();
	});
	$("#flushUsers").click(function(){
		flushUsers();
	});
});

function parseDate(dateToParse) {
	var splittedDate = dateToParse.split('-');
	return new Date(splittedDate[2] + "-" + months[splittedDate[1].toLowerCase()] + "-" + splittedDate[0]);
}

function editConnectUrl(substageid){
	$(".ui-dialog-content").dialog().dialog("close");
	$("#editConnectUrl").val($("#connectUrl"+substageid).val());
	$("#ssIdConnectUrl").val(substageid);
	$("#vdetailLinkDialog").dialog("open");
}

function updateConnectUrl(){
	$.ajax({
  		type: "POST",
		url: contextPath + "/req/rep/updateConnectUrl",
  	  	data : {substageId: $("#ssIdConnectUrl").val(), connectUrl: $("#editConnectUrl").val()},
  	  	async:false,
  	  	success: function(response){
  	  		alert(response);
  	  		$("#connectUrl"+$("#ssIdConnectUrl").val()).val($("#editConnectUrl").val());
  	  		$(".ui-dialog-content").dialog().dialog("close");
  	  	},error: function (xhr, ajaxOptions, thrownError) {
  	  		alert(xhr.responseText);
        }
	});
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
	var apiUrl = "";
	apiUrl = isUpdate ? "updateCampaignStage" : "insertCampaignStage";
	$.ajax({
  		type: "POST",
		url: contextPath + "/req/rep/" +apiUrl,
  	  	data : $("#addCampaignStageForm").serialize(),
  	  	async:false,
  	  	success: function(response){
  			alert(response);
  			isUpdate = false;
  			window.location.href = contextPath + "/req/rep/listCampaignStages?campaignId="+$("#campaignIdField").val();
  	  	},error: function (xhr, ajaxOptions, thrownError) {
  	  		alert(xhr.responseText);
  	  		isUpdate = true;
  	  		//$(".ui-dialog-content").dialog().dialog("close");
        }
	});
	return false;
}

function isValidCampaignSubstageForm(){
	var stageId = $("#sstageId").val();
	if(stageId == ""){
		alert("Internal error occured please try again !");
		window.location.href = contextPath + "/req/rep/listCampaignStages?campaignId="+$("#campaignIdField").val();
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
    //check stage name duplication
	if(!isUpdate && (campaignSubstageNames.indexOf($("#campaignSubStageName").val()) != -1)){
		//console.log("campaignSubstageNames : " + campaignSubstageNames);
		alert("Another substage exist with the same name !");
		return false;
	}
	if(isUpdate && (tempSubstageNames.indexOf($("#campaignSubStageName").val()) != -1)){
		//console.log("tempSubstageNames : " + tempSubstageNames);
		alert("Another substage exist with the same name !");
		return false;
	}
	var apiUrl = "";
	apiUrl = isUpdate ? "updateCampaignSubstage" : "insertCampaignSubstage";
	$.ajax({
  		type: "POST",
  		beforeSend: function(){
  			$("#form-loader").css("display","inline-block");
			$("#outer_wraper").css("pointer-events", "none");
			$("#outer_wraper").css("opacity", "0.5");
			$("#addSubstageContainer").css("pointer-events", "none");
			$("#addSubstageContainer").css("opacity", "0.5");
  		},
		url: contextPath + "/req/rep/" + apiUrl,
  	  	data : $("#addCampaignSubstageForm").serialize(),
  	  	async:false,
  	  	success: function(response){
  			//alert(response);
  			window.location.href = contextPath + "/req/rep/listCampaignStages?campaignId="+$("#campaignIdField").val();
  	  	},error: function (xhr, ajaxOptions, thrownError) {
	  	  	$("#form-loader").css("display","none");
			$("#outer_wraper").css("pointer-events", "");
			$("#outer_wraper").css("opacity", "1");
			$("#addSubstageContainer").css("pointer-events", "");
			$("#addSubstageContainer").css("opacity", "1");
			alert(xhr.responseText);
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
	//console.log("tempStageNames : " + tempStageNames);
	$("#stageId").val(stageId);
	$("#stageName").val(stageName);
	$("#startDate").val(startDate);
	$("#endDate").val(endDate);
	$("#addStageContainer").dialog({title : "Update Stage"});
	$("#addStageContainer").dialog("open");
	//get all sub stage start dates and end dates
	$.ajax({
  		type: "POST",
		url: contextPath + "/req/rep/editCampaignStage",
  	  	data : {campaignStageId : stageId},
  	  	async:false,
  	  	success: function(response){
  	  		if(response != ""){
  	  			startDateValues = JSON.parse(JSON.parse(response).startDates);
  	  			endDateValues =  JSON.parse(JSON.parse(response).endDates);
  	  		}
  	  	},
  	  	error : function(response){
  	  		//console.log(response.responseText);
  	  	}
	});
}
function deleteStage(stageId){
	var substageIds = [];
	//check whether any of the substage is fired, If yes, then stop deleting.
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
	//check whether any of the substages of other stages are dependent on these substages of same substage. If yes, then stop deleting.
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
			url: contextPath + "/req/rep/deleteCampaignStageByCampaignStageId",
	  	  	data : {campaignStageId : stageId},
	  	  	async:false,
	  	  	success: function(response){
	  			alert(response);
	  			window.location.href = contextPath + "/req/rep/listCampaignStages?campaignId="+$("#campaignIdField").val();
	  	  	},error: function (xhr, ajaxOptions, thrownError) {
	  	  		alert(xhr.responseText);
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
	$("#sscontentId").val("-1");
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
	if((optionLenghtForPass > 1) && (ssIdForPass == "-1" || ssIdForPass == "")){
		alert("Select substage for pass !");
		$("#ssIdForPass"+substageId).focus();
		return false;
	}
	if((optionLenghtForFail > 1) && (ssIdForFail == "-1" || ssIdForFail == "")){
		alert("Select substage for fail !");
		$("#ssIdForFail"+substageId).focus();
		return false;
	}
	if((remainders == "") || (isNaN(remainders))){
		alert("Enter valid number for remainders !");
		$("#remainders"+substageId).val("");
		$("#remainders"+substageId).focus();
		return false;
	}
	var noShow = $("#noShow"+substageId).val().trim();
	var content = {campaignId : $("#campaignIdField").val(), substageId : substageId, connectType : connectType, ssIdForPass : ssIdForPass, ssIdForFail: ssIdForFail, remainders : remainders, noShow : noShow};
	$.ajax({
  		type: "POST",
  		beforeSend: function(){
  			$("#form-loader").css("display","inline-block");
			$("#outer_wraper").css("pointer-events", "none");
			$("#outer_wraper").css("opacity", "0.5");
  		},
  		complete: function(){
  			$("#form-loader").css("display","none");
  			$("#outer_wraper").css("pointer-events", "");
  			$("#outer_wraper").css("opacity", "1");
  		},
		url: contextPath + "/req/rep/updateCampaignSubstageWithOutForm",
  	  	data : content,
  	  	async:false,
  	  	success: function(response){
  	  		campaignStageList = JSON.parse(response);
  			//alert(response);
  			//window.location.href = "listCampaignStages?campaignId="+$("#campaignIdField").val();
  	  	},error: function (xhr, ajaxOptions, thrownError) {
  	  		alert(xhr.responseText);
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
			url: contextPath + "/req/rep/deleteCampaignSubstageBySubstageId",
	  	  	data : {substageId : substageId},
	  	  	async:false,
	  	  	success: function(response){
	  			alert(response);
	  			window.location.href = contextPath + "/req/rep/listCampaignStages?campaignId="+$("#campaignIdField").val();
	  	  	},error: function (xhr, ajaxOptions, thrownError) {
	  	  		alert(xhr.responseText);
	        }
		});
	}
}
function configureContent(substageId, contentId, campaignId){
	var connectType = $("input[name='connectType"+substageId+"']:checked").val();
	if(connectType == 0 && (contentId == "" || contentId == null || contentId == "-1")){
		alert("Unable to find content ! Make sure content is mapped to this substage, else change connect type to link !");
		return false;
	}
	window.location.href = contextPath + "/req/rep/configureContent?substageId="+substageId+"&contentId="+contentId+"&campaignId="+campaignId;
}

function mapUsersToSubstage(substageId, contentId, campaignId){
	/*if((contentId == null) || (contentId == "") || (contentId == "-1")){
		alert("Substage should be mapped to a content before mapping users !");
		return false;
	}*/
	window.location.href = contextPath + "/req/rep/mapUsersToSubstage?substageId="+substageId+"&contentId="+contentId+"&campaignId="+campaignId;
}
function getList(substageId, statusType){
	var content = {"substageId" : substageId, "statusType" : statusType};
	var rxPlannerUrl = getPlannerUrl() + "/CampaignStageController/getUserListByStatusType?access_token=" + getAccessToken();
	var userList;
	$.ajax({
  		type: "POST",
		url: rxPlannerUrl,
  	  	data : content,
  	  	async:false,
  	  	success: function(response){
  	  		if(response != ""){
  	  			userList = JSON.parse(response);
  	  			loadData(userList, statusType);
  	  		}else{
  	  			alert("No users with this status available");
  	  		}
  	  	},error: function (xhr, ajaxOptions, thrownError) {
  	  		if(xhr.status == 0){
  	  			alert("Due to some technical problem, unable to process the request !");
  	  			return false;
  	  		}
  	  		alert(xhr.responseText);
        }
	});
}

function loadData(userList, statusType){
	var containerid = $("#userListContatiner");
	var htmlTag = "<div class='paginatedTable'>";
	htmlTag += "<table border='1' id='userListWithPagination'>";
	htmlTag += "<thead><tr>";
	htmlTag += "<th class='table-heading checkbox'><input type='checkbox'  class='sent' id='allcheckboxselected' checked='checked'/><label for='allcheckboxselected' class='sent'></label></td></th>";
	htmlTag += "<th class='table-heading userid'>USER ID</th>";
	htmlTag += "<th class='table-heading username'>USER NAME</th>";
	htmlTag += "<th class='table-heading retired'>FLUSHED</th>";
	htmlTag += "<th class='table-heading retired'>RETIRED</th>";
	htmlTag += "</tr></thead>";
	htmlTag += "<tbody class='paginationBody'>";
	if(userList.length == 0){
		alert("No users available with this status !");
		return false;
	}
	for(var i = 0; i < userList.length; i++){
		htmlTag += "<tr>";
		htmlTag += "<td>";
		htmlTag += "<input userid='"+userList[i].id+"' flushed='"+userList[i].flushed+"' retired='"+userList[i].retired+"' name='substageStatusId' value='"+userList[i].substageStatusId+"' type='checkbox' checked='chekced' class='authUsers' id='userId_"+userList[i].id+"'>";
		htmlTag += "<label for='userId_"+userList[i].id+"'>";
		htmlTag += "</td>";
		htmlTag += "<td> " + userList[i].id + " </td>";
		htmlTag += "<td id='userName_"+userList[i].id+"'> " + userList[i].firstName + " " + userList[i].middleName + " " + userList[i].lastName + " </td>";
		htmlTag += "<td class='"+(userList[i].flushed ? 'retired' : 'notretired')+"'> " + (userList[i].flushed ? 'YES' : 'NO') + " </td>";
		htmlTag += "<td class='"+(userList[i].retired ? 'retired' : 'notretired')+"'> " + (userList[i].retired ? 'YES' : 'NO') + " </td>";
		htmlTag += "</tr>";
	}
	htmlTag += "</tbody></table></div>";
	$(containerid).html(htmlTag);
	$(".ui-dialog-content").dialog().dialog("close");
	$("#userList").dialog({title:"HCP List (" + substageStatus[statusType] + ")"});
	$("#userList").dialog("open");
	//paginate the table
	$("#userListWithPagination .paginationBody").paginathing({
	    perPage: 3,
	    insertAfter: '.paginatedTable'
	});
	$("#allcheckboxselected").click(function(){
		 $(".authUsers").prop('checked', $(this).prop('checked'));
	});
}

function retireUsers(){
	var retiredCount = 0;
	var substageStatusIds = $("input:checkbox[name=substageStatusId]:checked").map(function () {
		if($(this).attr("retired") == "true"){
			retiredCount = retiredCount + 1;
		}
        return this.value;
    }).get();
	if(retiredCount > 0){
		alert("Select only users that are not yet retired !");
		return false;
	}
	substageStatusIds = substageStatusIds + "";
	//console.log("substageStatusIds : " + substageStatusIds);
	if(substageStatusIds == ""){
		alert("Select at least one user to retire !");
		return false;
	}
	var content = {"substageStatusIds" : substageStatusIds};
	var rxPlannerUrl = getPlannerUrl() + "/CampaignStageController/retireUsersBySubstageStatusId?access_token=" + getAccessToken();
	$.ajax({
  		type: "POST",
		url: rxPlannerUrl,
  	  	data : content,
  	  	async:false,
  	  	success: function(response){
  	  		alert(response);
  	  		$(".ui-dialog-content").dialog().dialog("close");
  	  	},error: function (xhr, ajaxOptions, thrownError) {
  	  		if(xhr.status == 0){
	  			alert("Due to some technical problem, unable to process the request !");
	  			return false;
	  		}
	  		alert(xhr.responseText);
        }
	});
}

function flushUsers(){
	var flushedCount = 0, retiredCount = 0;
	var substageStatusIds = $("input:checkbox[name=substageStatusId]:checked").map(function () {
		if($(this).attr("retired") == "true") retiredCount = retiredCount + 1;
		if($(this).attr("flushed") == "true") flushedCount = flushedCount + 1;
        return this.value;
    }).get();
	if((flushedCount > 0) || (retiredCount > 0)){
		alert("Retired or already flushed users are not allowed to be flushed !");
		return false;
	}
	substageStatusIds = substageStatusIds + "";
	//console.log("substageStatusIds : " + substageStatusIds);
	if(substageStatusIds == ""){
		alert("Select at least one user to flush !");
		return false;
	}
	var content = {"substageStatusIds" : substageStatusIds};
	var rxPlannerUrl = getPlannerUrl() + "/CampaignStageController/flushUsersBySubstageStatusId?access_token=" + getAccessToken();
	$.ajax({
  		type: "POST",
		url: rxPlannerUrl,
  	  	data : content,
  	  	async:false,
  	  	success: function(response){
  	  		alert(response);
  	  		$(".ui-dialog-content").dialog().dialog("close");
  	  	},error: function (xhr, ajaxOptions, thrownError) {
  	  		if(xhr.status == 0){
	  			alert("Due to some technical problem, unable to process the request !");
	  			return false;
	  		}
	  		alert(xhr.responseText);
        }
	});
}

function openScheduleDialog(substageId){
	var startTime = $("#startTime"+substageId).val(), endTime = $("#endTime"+substageId).val();
	$("#substageIdForSchedule").val(substageId);
	var html = "<div id='timeContainer'><table>";
	html += "<tr><th>Start Time</th><td><input type='text' id='startTime' name='startTime' readonly='readonly' class='startTime'></td></tr>";
	html += "<tr><th>End Time</th><td><input type='text' id='endTime' name='endTime' readonly='readonly' class='endTime'></td></tr>";
	html += "<tr><td colspan='2'><input name='scheduleSubstage' class='backListBtn' id='scheduleSubstage' onclick='scheduleSubstage()' value='Save' style='margin: 10px;' type='button'></td></tr>";
	html += "</table></div>";
	$("#scheduleDialog").append(html);
	$('#startTime').wickedpicker({now: getFormattedTimeForDatePicker(startTime), title: 'Schedule Time',}, 0);
	$('#endTime').wickedpicker({now: getFormattedTimeForDatePicker(endTime), title: 'Schedule Time'}, 1);
	$(".ui-dialog-content").dialog().dialog("close");
	$("#scheduleDialog").dialog("open");
}

function getFormattedTimeForDatePickerValue(unformattedTime){
	if((unformattedTime == "") || (unformattedTime == "null")){
		return "01 : 00";
	}
	var userTime = unformattedTime;
	var values = userTime.split(":");
	var hour = parseInt(values[0]);
	scheduleTime = hour + " : " + values[1];
	return scheduleTime;
}

function getFormattedTimeForDatePicker(unformattedTime){
	if((unformattedTime == "") || (unformattedTime == "null")){
		return "01 : 00";
	}
	var userTime = unformattedTime;
	var values = userTime.split(":");
	var hour = parseInt(values[0]);
	if(hour > 12){
		alert("Invalid time !");
		return false;
	}
	if(values[1].endsWith("PM") && (hour < 12)){
		hour += 12;
		hour = (hour == 24) ? 0 : hour;
	}
	if(values[1].endsWith("AM") && (hour == 12)){
		hour = 0;
	}
	scheduleTime = hour + ":" + values[1].split(" ")[0];
	return scheduleTime;
}

function getFormattedTimeForDB(unformattedTime){
	var scheduleTime = unformattedTime;
	scheduleTime = (scheduleTime.split(":")[0].trim()) + ":" + ((scheduleTime.split(":")[1].trim()).split(" ")[0].trim()) + " " + ((scheduleTime.split(":")[1].trim()).split(" ")[1].trim());
	return scheduleTime;
}

function getSubstageById(substageId){
	var rxPlannerUrl = getPlannerUrl() + "/CampaignStageController/getCampaignSubstageBySubstageId?access_token=" + getAccessToken();
	var scheduleTimes;
	$.ajax({
  		type: "GET",
		url: rxPlannerUrl,
  	  	data : {"substageId" : substageId},
  	  	async:false,
  	  	success: function(response){
  	  		scheduleTimes = JSON.parse(response);
  	  	},error: function (xhr, ajaxOptions, thrownError) {
	  	  	scheduleTimes = [];
  	  		if(xhr.status == 0){
	  			alert("Due to some technical problem, unable to process the request !");
	  			return false;
	  		}
	  		alert(xhr.responseText);
        }
	});
	return scheduleTimes;
}

function validateTime(startTime, endTime){
	var formattedStartTime = Date.parse('20 Aug 2000 '+startTime);
	var formattedEndTime = Date.parse('20 Aug 2000 '+endTime);
  	if (formattedStartTime < formattedEndTime){
		return true;
	}else{
		return false;
	}
}

function scheduleSubstage(substageId, startTime, endTime){
	var substageId = $("#substageIdForSchedule").val();
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();
	startTime = getFormattedTimeForDB(startTime);
	endTime = getFormattedTimeForDB(endTime);
	if(!validateTime(startTime, endTime)){
		alert("Start time should be less than end time !");
		return false;
	}
	var rxPlannerUrl = getPlannerUrl() + "/CampaignStageController/updateSubstageScheduleTime?access_token=" + getAccessToken();
	$.ajax({
  		type: "POST",
		url: rxPlannerUrl,
  	  	data : {"substageId": substageId, "startTime": startTime, "endTime": endTime},
  	  	async:false,
  	  	success: function(response){
  	  		$("#startTime"+substageId).val(startTime);
	  		$("#endTime"+substageId).val(endTime);
  	  		$("#timeContainer").remove();
  	  		$(".ui-dialog-content").dialog().dialog("close");
  	  		alert(response);
  	  	},error: function (xhr, ajaxOptions, thrownError) {
	  	  	if(xhr.status == 0){
	  			alert("Due to some technical problem, unable to process the request !");
	  			return false;
	  		}
	  		alert(xhr.responseText);
        }
	});
}

function getScheduleTime(substageId){
	if(($("#startTime"+substageId).val() == "null") || ($("#endTime"+substageId).val() == "null")){
		$("#scheduleTime"+substageId).attr("title", "Not scheduled");
	}else{
		$("#scheduleTime"+substageId).attr("title", ($("#startTime"+substageId).val() + " - " + $("#endTime"+substageId).val()));
	}
}