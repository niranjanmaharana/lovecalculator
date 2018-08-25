var taskStyle = ['gtaskblue', 'gtaskred', 'gtaskpurple', 'gtaskgreen', 'gtaskpink'];
var element; // global variable
var getCanvas;
function populateGantChart(campaignList, g, campaignIds){
	if (g.getDivId() != null) {
		g.setCaptionType('Complete'); // Set to Show Caption (None,Caption,Resource,Duration,Complete)
		g.setQuarterColWidth(36);
		g.setDateTaskDisplayFormat('day dd month yyyy'); // Shown in tool tip box
		g.setDayMajorDateDisplayFormat('mon yyyy - Week ww') // Set format to display dates in the "Major" header of the "Day" view
		g.setWeekMinorDateDisplayFormat('dd mon') // Set format to display dates in the "Minor" header of the "Week" view
		g.setShowTaskInfoLink(1); // Show link in tool tip (0/1)
		g.setShowEndWeekDate(0); // Show/Hide the date for the last day of the week in header for daily view (1/0)
		g.setUseSingleCell(10000); // Set the threshold at which we will only use one cell per table row (0 disables).  Helps with rendering performance for large charts.
		g.setShowComp(0);
		g.setShowTaskInfoLink(0);
		g.setShowTaskInfoRes(0);
		g.setShowTaskInfoComp(0);
		g.setFormatArr('Day', 'Week', 'Month', 'Quarter'); // Even with setUseSingleCell using Hour format on such a large chart can cause issues in some browsers
		//(pID, pName, pStart, pEnd, pStyle, pLink, pMile, pRes, pComp, pGroup, pParent, pOpen, pDepend, pCaption, pNotes, pGantt)
		for (var i = 0; i < campaignList.length; i++) {
			var campaign = campaignList[i];
			if(campaignIds.length > 0){
				if((campaignIds.indexOf(campaign.id+"") == -1)) continue;
			}
			//populate campaigns
			var startDate = new Date(parseFloat(campaign.startDate));
			var startDateMM = startDate.getMonth() + 1;
			var startDateDD = startDate.getDate();
			var startDateString = startDate.getFullYear() + "-" + (startDateMM < 10 ? ("0" + startDateMM) : startDateMM) + "-" + (startDateDD < 10 ? ("0" + startDateDD) : startDateDD);
			var endDate = new Date(parseFloat(campaign.endDate));
			var endDateMM = endDate.getMonth() + 1;
			var endDateDD = endDate.getDate();
			var endDateString = endDate.getFullYear() + "-" + (endDateMM < 10 ? ("0" + endDateMM) : endDateMM) + "-" + (endDateDD < 10 ? ("0" + endDateDD) : endDateDD);
			var campaignId = campaign.id;
			g.AddTaskItem(new JSGantt.TaskItem(campaignId, 
					campaign.campaignName, startDateString, endDateString, 
					'ggroupblack', '#', 0, '-', 0, 1, 0, 0, '', '', '', g));
	
			//populate campaignStages
			for (var j = 0; j < campaign.campaignStagesSet.length; j++) {
				var campaignStage = campaign.campaignStagesSet[j];
				startDate = new Date(parseFloat(campaignStage.startDate));
				startDateMM = startDate.getMonth() + 1;
				startDateDD = startDate.getDate();
				startDateString = startDate.getFullYear() + "-" + (startDateMM < 10 ? ("0" + startDateMM) : startDateMM) + "-" + (startDateDD < 10 ? ("0" + startDateDD) : startDateDD);
				endDate = new Date(parseFloat(campaignStage.endDate));
				endDateMM = endDate.getMonth() + 1;
				endDateDD = endDate.getDate();
				endDateString = endDate.getFullYear() + "-" + (endDateMM < 10 ? ("0" + endDateMM) : endDateMM) + "-" + (endDateDD < 10 ? ("0" + endDateDD) : endDateDD);
				var stageId = "1111" + campaignStage.id;
				g.AddTaskItem(new JSGantt.TaskItem(stageId, 
						campaignStage.stageName, startDateString, endDateString, 
						'gtaskyellow', '#', 0, '-', 0, 1, campaignId, 0, '', '', '', g));
	
				//populate campaignSubstages
				for (var k = 0; k < campaignStage.campaignSubstagesSet.length; k++) {
					var table = "";
					var campaignSubstage = campaignStage.campaignSubstagesSet[k];
					startDate = new Date(parseFloat(campaignSubstage.startDate));
					startDateMM = startDate.getMonth() + 1;
					startDateDD = startDate.getDate();
					startDateString = startDate.getFullYear() + "-" + (startDateMM < 10 ? ("0" + startDateMM) : startDateMM) + "-" + (startDateDD < 10 ? ("0" + startDateDD) : startDateDD);
					endDate = new Date(parseFloat(campaignSubstage.endDate));
					endDateMM = endDate.getMonth() + 1;
					endDateDD = endDate.getDate();
					endDateString = endDate.getFullYear() + "-" + (endDateMM < 10 ? ("0" + endDateMM) : endDateMM) + "-" + (endDateDD < 10 ? ("0" + endDateDD) : endDateDD);
					var substageId = "9999" + campaignSubstage.id;
					var passDependency = "", failDependency = "";
					if((campaignSubstage.ssIdForPass != '-1') && (campaignSubstage.ssIdForPass != '0'))
						passDependency = "9999" + campaignSubstage.ssIdForPass + "SS";
					if((campaignSubstage.ssIdForFail != '-1') && (campaignSubstage.ssIdForFail != '0'))
						failDependency = "9999" + campaignSubstage.ssIdForFail + "FF";
					var dependency = passDependency + "," + failDependency;
					var substageStatusList = campaignSubstage.campaignSubstageStatusList;
					var onEnterCount = 0, sentCount = 0, viewedCount = 0, passCount = 0, failCount = 0, noShowCount = 0;
					for(var l = 0; l < substageStatusList.length; l++){
						var status = substageStatusList[l];
						if(status.onEnter == true) onEnterCount = onEnterCount + 1;
						if(status.sent == true) sentCount = sentCount + 1;
						if(status.pass == true) passCount = passCount + 1;
						if(status.fail == true) failCount = failCount + 1;
						if(status.viewed == true) viewedCount = viewedCount + 1;
						if(status.noShow == true) noShowCount = noShowCount + 1;
					}
					
					table += "<div class='gTILine gTIsd'><span class='gTaskLabel'>No. of Users:</span><span class='gTaskText'>" + onEnterCount + "</span></div>";
					table += "<div class='gTILine gTIsd'><span class='gTaskLabel'>Remainders:</span><span class='gTaskText'>" + campaignSubstage.remainders + "</span></div>";
					table += "<div class='gTILine gTIsd'><span class='gTaskLabel'>Pass Substage:</span><span class='gTaskText'>" + (((campaignSubstage.ssIdForPass == 0) || (campaignSubstage.ssIdForPass == -1)) ? "Not Assigned" : substageList[campaignSubstage.ssIdForPass]) + "</span></div>";
					table += "<div class='gTILine gTIsd'><span class='gTaskLabel'>Fail Substage:</span><span class='gTaskText'>" + (((campaignSubstage.ssIdForFail == 0) || (campaignSubstage.ssIdForFail == -1)) ? "Not Assigned" : substageList[campaignSubstage.ssIdForFail]) + "</span></div>";
					table += "<div class='gTILine gTIsd'><span class='gTaskLabel'>No-Show :</span><span class='gTaskText'>" + noShowList[campaignSubstage.noShow] + "</span></div>";
					
					table += "<div class='gTILine gTIsd'><span class='gTaskLabel'>Sent: </span><span class='gTaskText'>"+sentCount+"</span></div>";
					table += "<div class='gTILine gTIsd'><span class='gTaskLabel'>Viewed: </span><span class='gTaskText'>"+viewedCount+"</span></div>";
					table += "<div class='gTILine gTIsd'><span class='gTaskLabel'>No-Show: </span><span class='gTaskText'>"+noShowCount+"</span></div>";
					table += "<div class='gTILine gTIsd'><span class='gTaskLabel'>Pass: </span><span class='gTaskText'>"+passCount+"</span></div>";
					table += "<div class='gTILine gTIsd'><span class='gTaskLabel'>Fail: </span><span class='gTaskText'>"+failCount+"</span></div>";
					
					var taskStyleIndex = Math.floor(Math.random() * (taskStyle.length - 1)) + 0;
					var content = campaignSubstage.connectType == 0 ? campaignSubstage.contentId : campaignSubstage.connectUrl;
					g.AddTaskItem(new JSGantt.TaskItem(substageId, 
						campaignSubstage.campaignSubStageName, startDateString, endDateString,
						"gtaskpurple", '#', 0, content, 0, 0, stageId, 0, dependency, '', table, g));
				}
			}
		}
		g.Draw();
	} else {
		alert("Error, unable to create Gantt Chart");
	}
}

function previewChart(divName){
	element = $("#"+divName);
	/*$("#downloadChart").show();*/
	$("#chartPreviewContainer").show();
	$("#printChart").show();
	html2canvas(element, {
		onrendered: function (canvas) {
	       var imgsrc = canvas.toDataURL("image/png");
	       $("#chartPreviewImage").attr('src',imgsrc);
           getCanvas = canvas;
        }
    });
}

function showLoader(){
	$("#form-loader").css("display","inline-block");
	$(".wrapper").css("pointer-events", "none");
	$(".wrapper").css("opacity", "0.5");
}

function hideLoader(){
	$("#form-loader").css("display","none");
	$(".wrapper").css("pointer-events", "");
	$(".wrapper").css("opacity", "1");
}

function print(divId){
	var contents = $("#"+divId).html();
    var frame1 = $('<iframe />');
    frame1[0].name = "frame1";
    frame1.css({ "position": "absolute", "top": "-1000000px" });
    $("body").append(frame1);
    var frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
    frameDoc.document.open();
    //Create a new HTML document.
    var currDate = new Date();
    var title = "GanttChart-" + (currDate.getMonth() + 1) + "-" + currDate.getDate() + "-" + currDate.getFullYear();
    frameDoc.document.write('<html><head><title>'+title+'</title>');
    frameDoc.document.write('</head><body>');
    //Append the external CSS file.
    //frameDoc.document.write('<link href="style.css" rel="stylesheet" type="text/css" />');
    //Append the DIV contents.
    frameDoc.document.write(contents);
    frameDoc.document.write('</body></html>');
    frameDoc.document.close();
    setTimeout(function () {
        window.frames["frame1"].focus();
        window.frames["frame1"].print();
        frame1.remove();
    }, 500);
}

function expandAllFolders(){
	$(".gfoldercollapse").each(function( index ){
		var pID = $(this).attr("id").split("_")[1];
		console.log(index + ": " + $(this).text() + "\t id : " + pID);
		JSGantt.folder(pID, {"vTool":{"vToolCont":{},"moveInterval":20,"fadeInterval":23,"delayTimeout":22}});
	});
}

function printChart(divName){
	console.log("Loading");
	showLoader();
	previewChart(divName);
	setTimeout(function () {
		print("chartPreviewContainer");
		hideLoader();
	}, 3500);
	$("#chartPreviewContainer").hide();
}

/*function downloadChartAsImage(divName){
	console.log("getCanvas : " + getCanvas);
	var imgageData = getCanvas.toDataURL("image/png");
	console.log("imgageData : " + imgageData);
	// Now browser starts downloading it instead of just showing it
	var newData = imgageData.replace(/^data:image\/png/, "data:application/octet-stream");
	console.log("newData : " + newData);
	$("#btn-Convert-Html2Image").attr("download", "gant-chart.png").attr("href", newData);
}*/