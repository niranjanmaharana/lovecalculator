var weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
var sendDaysInCampaign = [];
var id = -1;
$(document).ready(function(){
	var options = {title: 'Schedule Time'};
	$('#timepicker').wickedpicker(options);
	$("#sendDayConfigContainer").dialog({width:600, height:530, title:"Configure Campaign Send Day",autoOpen: false, modal: true,
		open : function(){
			$(".outer_wraper").addClass("transparent-overlay");
			$(".scheduleTime").css("background-color", "white");
			$(".scheduleTime").css("color", "black");
			$("#sendDaySelectBox").val("-1");
		},
		close : function(){$(".outer_wraper").removeClass("transparent-overlay");}
	});
	
	$("#saveScheduleTime").click(function(){
		saveScheduleTime();
	});
	
	$("#sendDaySelectBox").change(function(){
		$(".scheduleTime").css("background-color", "white");
		$(".scheduleTime").css("color", "black");
		$("#scheduleTimes"+$("#sendDaySelectBox").val()).css("background-color", "rgb(33, 116, 209)");
		$("#scheduleTimes"+$("#sendDaySelectBox").val()).css("color", "white");
	});
});

function getSelectedDayTimes(sendDay){
	var sendDayName = weekDays[sendDay].toUpperCase();
	if($("#scheduleTimes"+sendDay).length > 0){
		return false;
	}
}

function removeAllScheduleTimeById(dayId){
	$("#scheduleTimes"+dayId).val("");
}

function getScheduleTime(){
	var scheduleTime = $("#timepicker").val();
	scheduleTime = (scheduleTime.split(":")[0].trim()) + ":" + ((scheduleTime.split(":")[1].trim()).split(" ")[0].trim()) + " " + ((scheduleTime.split(":")[1].trim()).split(" ")[1].trim());
	return scheduleTime;
}

function addToScheduleTimeById(){
	var dayId = $("#sendDaySelectBox").val();
	if(dayId == "-1"){
		alert("Select day of schedule !");
		$("#sendDaySelectBox").focus();
		return false;
	}
	var availableTimes = $("#scheduleTimes"+dayId).val();
	var timesArray = (availableTimes != "") ? availableTimes.split(",") : [];
	var scheduleTime = getScheduleTime();
	var indexOfScheduleTime = timesArray.indexOf(scheduleTime);
	if(indexOfScheduleTime == -1){
		if(timesArray.length != 0){
			scheduleTime = "," + scheduleTime;
		}
		$("#scheduleTimes"+dayId).val(availableTimes + scheduleTime);
	}
}

function scheduleTime(campaignId){
	id = campaignId;
	$(".ui-dialog-content").dialog().dialog("close");
	$("#campaignId").val(campaignId);
	$.ajax({
  		type: "POST",
		url: contextPath + "/req/campaign/getScheduleTimeByCampaignId",
  	  	data : {campaignId: campaignId},
  	  	async:false,
  	  	success: function(response){
  	  		populateScheduleTime(response);
  	  	},
  	  	error : function(response){
  	  		alert(response);
  	  	}
	});
	$("#sendDayConfigContainer").dialog("open");
}

function populateScheduleTime(scheduleTimes){
	$(".sendDay").removeAttr("dataid");
	$(".sendDay").prop('checked', false);
	$(".scheduleTime").val("");
	for(var i=0; i < scheduleTimes.length; i++){
		var scheduleTime = scheduleTimes[i];
		$("#sendDay"+scheduleTime.sendDay).attr("dataid", scheduleTime.id);
		$("#sendDay"+scheduleTime.sendDay).prop('checked', true);
		$("#scheduleTimes"+scheduleTime.sendDay).val(scheduleTime.scheduleTime);
	}
}

function saveScheduleTime(){
	sendDaysInCampaign = [];
	var scheduledDays = $.map($('input[name="sendDay"]:checked'), function(c){return c.value;});
	if(scheduledDays.length < 1){
		alert("Select at least one day for schedule !");
		return false;
	}
	for(var i = 0; i < scheduledDays.length; i++){
		var dayId = parseInt(scheduledDays[i]);
		var scheduleId = $("#sendDay"+dayId).attr("dataid");
		if(scheduleId != "") scheduleId = parseInt(scheduleId);
		if($("#scheduleTimes"+dayId).val() == ""){
			alert("Enter schedule time for " + weekDays[dayId]);
			return false;
		}else{
			var sendDayInCampaign = {id: scheduleId,sendDay:dayId, scheduleTime: $("#scheduleTimes"+dayId).val(), campaignId: id};
			sendDaysInCampaign.push(sendDayInCampaign);
		}
	}
	$.ajax({
  		type: "POST",
		url: getRxPlannerUrl() + "/CampaignController/saveCampaignScheduleTime/?access_token="+getAccessToken(),
  	  	data : {scheduleTimes: JSON.stringify(sendDaysInCampaign), campaignId: id},
  	  	async:false,
  	  	success: function(response){
  	  		$("#scheduleIcon_" + id).attr("src", contextPath + "/images/scheduled.png");
  	  		$("#scheduleIcon_" + id).attr("title", "Edit schedule time");
  	  		alert(response);
  	  		$(".ui-dialog-content").dialog().dialog("close");
  	  	},
  	  	error: function (xhr, ajaxOptions, thrownError) {
  	  		alert(xhr.responseText);
        }
	});
}