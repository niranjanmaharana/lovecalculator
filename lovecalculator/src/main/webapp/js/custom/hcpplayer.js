		var props = {
		'playerPane' : "#playerWrapper",
		'htmlContainer' : '.modulepalyerContent',
		'playerMask' : '.modulepalyerContentMask',
		'nextBtn' : '#nextBtn',
		'prevBtn' : '#prevBtn',
		'presentationWrapper' : '#wrapper',
		/*'host' : 'dev.rxprism.com',
		'port' : '1935',
		'recorderApplicationName' : 'videorecorder',*/
		/*'host' : 'v-detail.com',
		'port' : '1935',
		'recorderApplicationName' : 'liverecorderforv2',*/		
		/* 'host' : '192.168.1.188',
		'port' : '1935',
		'recorderApplicationName' : 'localrecorder', */
		'host' : '192.168.1.49',
		'port' : '1935',
		'recorderApplicationName' : 'devrecorder',
		'filePathPrefix' : ctxpath+'/contents/records/',
		'docBase' : ctxpath+'/'
	};
	var sourceConfig = {
		'mediaName' :null,
		'mediaType' : null,
		'source' : null
	};
	var userId;
	var sessionId;
	var vdetailId;
	var isRep = false; 
	var tracker;
	var isMobileDevice = false;
	var isIphoneMobile = false;
	var allowNavigation = false;
	var isLandscape = false;
	var isPortrait = false;
	var allowfirstslide = '';
	var endmsg = '',browserVersionError='';
	var tok = "";
	var accesstype;
	var videoName;
	$(document).ready(function(){
		$(".leftbgWrap").hide();
		$(".rightWraper").hide();
		$("#repMailTo").hide();
		$(".playvideo").hide();
		$(".mobileDesc").hide();
		window.addEventListener('offline', onOffline);
		if(fromRep == "true" ||(isvalidVideo == "true" && isvalidRecord == "true" && isvalidPresentation == "true")){
			sessionId = $("#sessionId").text().trim();
	 		if(isIphoneMobile && getIOSVersion() < 10){
				$(".vjs-fullscreen-control vjs-control").hide();
	 			$(".videoPlayerWrapper").hide();
	 			$(".rep_img").show();
	 			$(".iphonePlayerButton").show();
	 		}
	 		if(!isMobileDevice || isOnIOS){
				$('head').append('<meta id="viewport" name="viewport" content="initial-scale=1; maximum-scale=1;">');
			}
			$(window).bind('orientationchange', function(event){
				location.reload();
				$("#stopPlayRecord").trigger("click");
			});
			$('.preBtnContainerBtnMask').show();
			$('.nextBtnContainerBtnMask').show();
			$.get(ctxpath+'/req/hcp/hcpview',{token:qs["t"],vdetailID:vdID}, function(data){
				//console.log("total data",data);
				var vd = new VDetailBuilder(props);
				data.dataFile = ctxpath+"/"+data.dataFile+"/data.xml";			
				var allowFullPresentation = data.allowfullpresentation;
				userId = data.userID;
				sourceConfig.mediaName = data.mediaName.trim().length == 0 ? data.vdetailID : data.mediaName.trim().split(".")[0];
				sourceConfig.mediaType = data.mediaName.trim().length != 0 ? data.mediaName.split(".")[1] != "mp3" ? "0" : "1" : "0";
				sourceConfig.source = data.mediaName.trim().length == 0 ? "0" : "1";
				console.log("hcp player sourceConfig:"+JSON.stringify(sourceConfig));
				vdetailId = data.vdetailID;
				accesstype = data.accesstype;
				allowNavigation = data.allownavigation;
				allowfirstslide = data.allowfirstslide;
				endmsg = data.endmsg;
				tok = data.tok;
				if(data != null && (data.role  == 3)){
					isRep = true;
					if(fromRep == "true" && tok == ""){ 
						$(".backBtn").show();
					}
					$(".loader_mask").css('display','none');	//Remove loader mask for rep 			
					$(".log_nav").hide();
				}
				$(".replyBtn").on('click', function(){
					var res = confirm('do you want mail client to send reply to this mail id '+ data.Rep+' ?');
					if(res == true){
						$("#repMailTo").attr("href","mailto:"+ data.Rep +"?subject= Re: "+ data.description +"");					
					}
					else{
						return false;
					}
				});
				
				$('#vid').html(data.vdetailID);
				$('#name').html(data.name);  //presentation name or video name
				$('#mobilename').html(data.name); //presentation name on bottom of the page
				vdtitle = data.name;
				vddesc = data.description;
				vdApprovalId = data.approvalId;
				if(navigator.userAgent.indexOf("Safari") > -1){
					$('#description').html(vddesc);  //presentation desc
					$('#approvalTD').html(vdApprovalId);
				}else{
					$('#description').html(vddesc.replace(/(\r\n|\n|\r)/gm,"<br/>"));
					$('#mobileDesc').html(vddesc.replace(/(\r\n|\n|\r)/gm,"<br/>"));
					$('#approvalTD').html(vdApprovalId);
				}
					vd.buildPlayer(sourceConfig,function(vdetailPlayer){  //here we get all functionalities for vdetail player
						vdetailPlayer.setVdetailID(vdetailId);
						vdetailPlayer.setMediaID(sourceConfig.mediaName);
						var totalSlideIndex = "";
						vdetailPlayer.onSlideChange(function(slideNo){
							if(totalSlideIndex == ""){
								totalSlideIndex = vdetailPlayer.presentationBuilder.slidePresenter.totalSlides; //here we get the total slides
								console.log("slide total ",totalSlideIndex);
							}
							setTimeout(function(){
								$('#nextBtn').show();
								if(slideNo == (totalSlideIndex-1)){
									var finder = new QnaFinder();
									finder.fetch(function(data,noQuestionData){
										if(noQuestionData.length == 0 && slideNo == (totalSlideIndex-1)){ 
											$('#nextBtn').hide(); //for hide the next button
										}
									},data.presentationId);
								}
							},50);
							setTimeout(function(){
								var type = $("#html_slide_"+slideNo).children("div").attr("data-type");
								if(type && type == "qna"){
									var QNAHCPData = {"trackId":trackId,"vdetailId":vdetailId,"sessionId":sessionId,"ipAddress":tracker.ipAddress,"presentationID":data.presentationId,"enableFeedback":enableFeedback};
									var container = $("#html_slide_"+slideNo).children("div").attr("id");
									//console.log("qnabuilder in hcp player",QNAHCPData);
									new VdetailQnABuilder(("#"+container),QNAHCPData); 
								}
							},50);
				});
					vdetailPlayer.onMediaProgress(function(time,duration){	
						if($(".vjs-poster").is(":hidden")){
							if(sourceConfig.mediaType == "1"){
								$(".vjs-poster").show();
							}
						}
					});
					vdetailPlayer.onPresentationLoad(function(presenter){
						//console.log("presentation loading hcp player");
						vdetailPlayer.disablePresentation();
						presenter.initPrev();
						presenter.initNext();
						if(allowFullPresentation == "false"){
							presenter.filterSlides(vdetailPlayer.events['presented']);
						}else if(vdetailPlayer.events['filter']){
							presenter.filterSlides(vdetailPlayer.events['filter']);
						}
						$(".leftbgWrap").show();
						$(".rightWraper").show();
						$("#repMailTo").show();
						$(".playvideo").show();
						var isMobile = {
							    Android: function() {
							        return navigator.userAgent.match(/Android/i);
							    },
							    BlackBerry: function() {
							        return navigator.userAgent.match(/BlackBerry/i);
							    },
							    iOS: function() {
							        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
							    },
							    iPhone : function(){
							    	 return navigator.userAgent.match(/iPhone/i);
							    },
							    iPad : function(){
							    	navigator.userAgent.match(/iPad/i)
							    },
							    Opera: function() {
							        return navigator.userAgent.match(/Opera Mini/i);
							    },
							    Windows: function() {
							        return navigator.userAgent.match(/IEMobile/i);
							    },
							    any: function() {
							        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
							    }
						};
						//alert("is mobile android"+isMobile.iPhone());
						if((window.innerHeight > window.innerWidth) && (isMobile.Android() || isMobile.iPhone())){
							$(".mobileDesc").show(); // for showing presentation name in bottom of page
							$('#mobileDesc').html(vddesc.replace(/(\r\n|\n|\r)/gm,"<br/>"));
							//alert("Please use Landscape!");
						}else if(isMobile.iPhone() || isMobile.Android()){
							$(".mobileDesc").show(); // for showing presentation name in bottom of page
							$('#mobileDesc').html(vddesc.replace(/(\r\n|\n|\r)/gm,"<br/>"));
						}
					    
						presenter.showSlide(1);
						if(!isRep && isUrlViewed && allowNavigation == "true"){
							$("#videoPlay").hide();
							$("#playRecord").show();
							$('.preBtnContainerBtnMask').hide();
							$('.nextBtnContainerBtnMask').hide();
							$("#wrapper__mask").hide();
						}
						else{
							$("#videoPlay").show();
						}
						if(!isRep && isUrlViewed){
							$("#wrapper__mask").hide();
						}
						//console.log("loader_mask display1:"+$(".loader_mask").css('display'));
						$(".loader_mask").css('display','none');
						//alert("loader_mask display2:"+$(".loader_mask").css('display'));
					});
					vdetailPlayer.loadPresentationFromUrl(data.dataFile);
					tracker = new Tracker(userId,data.vdetailID,props.htmlContainer,sessionId,trackId,isUrlViewed);
					vdetailPlayer.onEnd(function(){
						if(typeof substageId != 'undefined' && substageId != '' && substageId != -1)
							updateSubstageViewedStatusBySubstageId(substageId, emailId);
						if((typeof isRep !== "undefined" && isRep != null) && (tok != "")){
							tracker.endWatching();
						}
						//$("#iphonePlayer").show();
						$("#stopPlayRecord").hide();
						$("#playRecord").show();
						if(allowNavigation == "true"){
							$('.preBtnContainerBtnMask').hide();
							$('.nextBtnContainerBtnMask').hide();
							vdetailPlayer.enablePresentation();
						}
						if(allowfirstslide == "true"){
							vdetailPlayer.presentationBuilder.slidePresenter.showSlide(1);
						}
						if(endmsg != '')
							getEndmsg(endmsg);
					});
					
					if(isIphoneMobile && getIOSVersion() < 10){
						vdetailPlayer.onEndTrigger(function(){
							$(".iphonePlayerButton").show();
							$("#__videoid").hide();
						//alert("ON END FOR IOS 9"+$("#__videoid").length);
							if((typeof isRep !== "undefined" && isRep != null) && (tok != "")){
								tracker.endWatching();
							}
							$("#iphonePlayer").show();
							$("#stopPlayRecord").hide();
							$("#playRecord").show();
							if(allowNavigation == "true"){
								$('.preBtnContainerBtnMask').hide();
								$('.nextBtnContainerBtnMask').hide();
								vdetailPlayer.enablePresentation();
							}
							if(allowfirstslide == "true"){
								vdetailPlayer.presentationBuilder.slidePresenter.showSlide(1);
							}
							if(endmsg != '')
								getEndmsg(endmsg);
						});
					} 
					
					$("#videoPlay").on('click', function(){
						$("#ahcp").dialog().dialog("close");
						$("#iphonePlayer").hide();
						$(".iphonePlayerButton").hide();
						$("#videoPlay").hide();
						$(".videoPlayerWrapper").show();
						$('.preBtnContainerBtnMask').show();
						$('.nextBtnContainerBtnMask').show();
						$("#stopPlayRecord").show();
						$("#playRecord").hide();
						vdetailPlayer.onVideoStart(function(){
							if((typeof isRep !== "undefined" && isRep != null) && (tok != "")){
								tracker.startWatching();
							}
						});
						vdetailPlayer.disablePresentation();
						vdetailPlayer.play();
					
					});
					
					$("#playRecord").on('click', function(){
						$(".presentationPanel input[type=radio]").each(function() {
					        $(this).prop('checked', false);
					    });    
						$(".presentationPanel input[type=text]").val("");
						$('#container1 .step5').removeAttr('style');// need confirm  fix
						$('#container1 .step6').removeAttr('style');
						$('#container1 .step7').removeAttr('style');
						$('#container1 .step8').removeAttr('style');
						//$("#hcp_name").val("");
						$(".popbg").hide();
						//$(".ui-dialog-titlebar").remove();
						//vdetailPlayer.loadPresentationFromUrl(data.dataFile);
						 if(!$("#playRecord").hasClass("replayvideo")){// initially (when play not yet became replay) 
							$("#ahcp").dialog().dialog("close");
							$("#iphonePlayer").hide();
							$(".iphonePlayerButton").hide();
							$("#videoPlay").hide();
							$(".videoPlayerWrapper").show();
							$('.preBtnContainerBtnMask').show();
							$('.nextBtnContainerBtnMask').show();
							if(isIphoneMobile && getIOSVersion() >= 10){	
									$("#playRecord").addClass('playvideo replayvideo');// button change from play to replay
							}else{
								$("#playRecord").hide();
								$("#stopPlayRecord").show();
							}
							//$("#stopPlayRecord").show();
							//$("#playRecord").hide();
							vdetailPlayer.onVideoStart(function(){
								if((typeof isRep !== "undefined" && isRep != null) && (tok != "")){
									tracker.startWatching();
								}
							});
							vdetailPlayer.disablePresentation();
							vdetailPlayer.play();
							if(isIphoneMobile && getIOSVersion() < 10){
							//	alert("ios < 10");
							
								$("#__audioid").show();
		
								setTimeout(function(){
								$("#__audioid .vjs-fullscreen-control").hide();
								},100);
							}
						}else{
							if((typeof isRep !== "undefined" && isRep != null) && (tok != "")){
								tracker.endWatching();
							}
							vdetailPlayer.stop();
							
							vdetailPlayer.onVideoStart(function(){
								if(tracker && (typeof isRep !== "undefined" && isRep != null) && (tok != "")) {
									tracker.startWatching();
								}
							});
							
							vdetailPlayer.disablePresentation();
							vdetailPlayer.play();
							if(isIphoneMobile && getIOSVersion() < 10){
							//	alert("ios < 10");
								$("#__audioid").show();
								setTimeout(function(){
								$("#__audioid .vjs-fullscreen-control").hide();
								},100);
							}
							
						}
					});
					
					
					var action=((navigator.userAgent.match(/iPad/i) == "iPad") ||(navigator.userAgent.match(/Android/i) == "Android")) ? "touchstart" : "click";
					$("#__videoid").on(action, function(){
					$(".slide").remove();
					$("#stopPlayRecord").trigger("click");
					$(VDetailBuilder.props.recorderPane).css('z-index', '0');
					$(VDetailBuilder.props.playerPane).css('z-index', '1');
					$("#stopPlayRecord").show();
					$("#playRecord").hide();
					$('.preBtnContainerBtnMask').show();
					$('.nextBtnContainerBtnMask').show();
					vdetailPlayer.disablePresentation();
					vdetailPlayer.play();
					});
			
					$("#stopPlayRecord").on('click', function(){
						if((typeof isRep !== "undefined" && isRep != null) && (tok != "")){
							tracker.endWatching();
						}
						if(isIphoneMobile && getIOSVersion() < 10){
							$("#__audioid").hide();
				 			$(".iphonePlayerButton").show();
						}
						
						if(allowNavigation == "true"){
							$('.preBtnContainerBtnMask').hide();
							$('.nextBtnContainerBtnMask').hide();
							vdetailPlayer.enablePresentation();
						}
						vdetailPlayer.stop();
						if(allowfirstslide=="true"){
							vdetailPlayer.presentationBuilder.slidePresenter.showSlide(1);
						}
						//if(endmsg != '')
							//getEndmsg(endmsg);
						if (($(window).width() > 1024) && !(isOnIOS) && !(isAndroid)){	// to controll play replay change on desktop only.
							//$("#stopPlayRecord").hide();
							//$("#playRecord").show();
							$("#playRecord").trigger("click");
						}else{
							$("#stopPlayRecord").hide();
							$("#playRecord").show();
						}
						
					});
					
				});
					
			});
			
			
			$("#playIphoneVideo").on("click",function(){
				$("#ahcp").dialog().dialog("close");
				$(".iphonePlayer").show();			
				$('#iphonePlayer').find('.vjs-big-play-button').trigger("click");
			});
			var geocorder = new GeoCoader(trackId,isMobileDevice,isLandscape,ctxpath);
			$('.backBtn').click(function(){
				window.location.href = ctxpath+"/req/vdetail/sendData";
			});
			var isOnIOS = navigator.userAgent.match(/iPad/i);
			var isAndroid = /android/i.test(navigator.userAgent.toLowerCase());
			var eventName = isOnIOS ? "pagehide" : "unload";
			$(window).on(eventName, function(){
				if(tracker){
					var endTime = (new Date()).getTime();
					var totalTimeSpent = endTime - tracker.startTime;
					if(tracker.startTime != 0){
					var data = {"userid":trackId,"vdetailid":vdetailId,"intime":tracker.startTime,"outtime":endTime,"timespent":totalTimeSpent,"sessionid":sessionId,"ipaddress":tracker.ipAddress};
							 $.ajax({
								 type: "POST",
							     url:ctxpath+"/req/analytics/addUserView?inputStr="+JSON.stringify(data),
							     	success: function(response){
							     	},
							     	error: function(e){
							     	}
							 });
						}
				}
			});
			
			$("#descpopup").on('click', function(){
				var desc = "<h3 id='vdtitle'>"+vdtitle+"</h3> <p id='vddesc'>"+vddesc+"</p><p id='vdApprovalId'>"+vdApprovalId+"</p>";
				$("#ahcp").dialog({ width:500, height : 300, title : "",autoOpen: false, modal: true  });
				$('.endmsg').html(desc);
				$(".ui-dialog-content").dialog().dialog("close");
				$("#ahcp").dialog("open");
				$("#ahcp").removeClass("ui-dialog-content ui-widget-content");
				$("#ahcp").css({height:"300px !important"});
			});
			
		}else{
			if(isvalidRecord != "true"){
				$("#compose_container").html("<div style='height:100%;margin-left:2%;margin-right:2%;'><p style ='background-color:#FFF;margin-top:10%; padding:20px;'>Record file is not existing for a vdetail </p></div>");
				$(".footer").addClass(" errorFooter");
			}else
			if(isvalidPresentation != "true"){
				$("#compose_container").html("<div style='height:100%;margin-left:2%;margin-right:2%;'><p style ='background-color:#FFF;margin-top:10%;padding:20px;'>Presentation is not existing for this vdetail</p></div>");
				$(".footer").addClass(" errorFooter");
			}else
				if(isvalidVideo != "true"){
					$("#compose_container").html("<div style='height:100%;margin-left:2%;margin-right:2%;'><p style ='background-color:#FFF;margin-top:10%;padding:20px;'>Video file is not existing for this vdetail</p></div>");
					$(".footer").addClass(" errorFooter");
				}
		}
		
	});
	
	
	function getEndmsg(msg){
		$(".sizeAlert").hide();// hide resize popup
		
		$("#ahcp").dialog({ width:500, height : 300, title : "Message",autoOpen: false, modal: true });
		$('.endmsg').html(msg);
		$(".ui-dialog-content").dialog().dialog("close");
		$("#ahcp").dialog("open");
		$("#ahcp").removeClass("ui-dialog-content ui-widget-content");
		$("#ahcp").css({height:"300px !important"});	
	}
	
	 function storetime(){
		 var time = VideoProps.timeObj != null ? VideoProps.timeObj : 0.0;
		 if(!isRep){
				$.get(ctxpath+'/req/vdetail/storeTime',{timetaken:time,trackid:trackId}, function(data){
				});
			    var message = 'leave this page!!.';
			    if (typeof event == 'undefined') {
			        event = window.event;
			    }
			    if (event) {
			        event.returnValue = message;
			    }
			    return message;
			}
	 }
	 function getIOSVersion(){
		    var match = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/),
		        version;
		    if (match !== undefined && match !== null) {
		        version = [
		            parseInt(match[1], 10),
		            parseInt(match[2], 10),
		            parseInt(match[3] || 0, 10)
		        ];
		        return parseFloat(version.join('.'));
		    }
		    return false;
		}
	function onOffline(){
		if(isErrorThrown == false){
			isErrorThrown = true;
			$("body").append("<div class='alertMask'></div>");
			$("#videoError").dialog({ width:500, height : 300,autoOpen: false, modal: true});
		
			$(".ui-dialog-content").dialog().dialog("close");
			$(".videoError").parent().addClass("netAlert");
			$("#videoError").dialog("open");
			$("#videoError").removeClass("ui-dialog-content ui-widget-content");
			$("#videoError").css({height:"300px !important"});
			
			
		}
	} 
	function getAndroidVersion(){
		var ua = navigator.userAgent;
		var androidversion;
		if( ua.indexOf("Android") >= 0 )
		  androidversion = parseFloat(ua.slice(ua.indexOf("Android")+8));
		else
			androidversion = 0;
		return androidversion;
	}
function refresh(){
	window.location.reload();
}
function cancel(){
	isErrorThrown = false;
	$(".alertMask").hide();
	$("#videoError").dialog().dialog("close");
}


function getSafariFullVersion(){	
	var nAgt = navigator.appVersion;	
	var verOffset = nAgt.substring(nAgt.indexOf("Version"),nAgt.length);
	var finalVersion = verOffset.substring(verOffset.indexOf("/")+1,verOffset.indexOf(" "));
	return finalVersion;
}
function handleResize(){
	$("#resizeError").dialog({ width:500, height : 300,title : "Note",autoOpen: false, modal: true });	
	$(".ui-dialog-content").dialog().dialog("close");
	$(".resizeError").parent().addClass("sizeAlert");
	$("#resizeError").dialog("open");
	$("#resizeError").removeClass("ui-dialog-content ui-widget-content");
	$("#resizeError").css({height:"auto !important"});
} 
function handleVideoError(msg) {
	$("#compose_container").html("<div style='height:100%;margin-left:2%;margin-right:2%;'><p style ='background-color:#FFF;margin-top:10%; padding:20px;'>Flash Error: "+msg+"</p></div>");
	$(".footer").addClass(" errorFooter");
	/*var alertClass = "padding: 5px;	margin-bottom: 20px;border: 1px solid transparent;border-radius: 4px;font-size: 14px;";
	 var alertdangerClass=" background-color: #f2dede;border-color: #ebccd1;color: #a94442;text-align: center;font-size: 17px;font-weight: normal;";
	if(!isRep)
		$("body").html("<strong>Welcome to V-Detail.</strong><br><br><B style='"+alertClass+alertdangerClass+"'>"+msg+"</B>");*/
}

function callFeedback(alertMsg){
	$(".presentationPanel").append("<div class='a_h endMsgbox feedbackPopup' id='feedbackPopup' style='overflow: hidden;'><div class='msgPanel' style='max-width:500px;position:relative'><div class= 'videoErrorMsg'><p>"+alertMsg+"<br/></p><div class='btnGrp'></div></div></div></div>");
	$("#feedbackPopup").dialog({ width:300, height : 100,title : "Note", autoOpen: true, modal: true });
}

function canPlayHtml5Video(){
	return !!document.createElement('video').canPlayType;
}
function handleFirewallError(){
	if(isErrorThrown == false){
		isErrorThrown = true;
		$("body").append("<div class='alertMask'></div>");
		$("#videoError").dialog({ width:500, height : 300,title : "Note",autoOpen: false, modal: true });
	
		$(".ui-dialog-content").dialog().dialog("close");
		$(".videoError").parent().addClass("netAlert");
		$("#firewallError").dialog("open");
		$("#firewallError").removeClass("ui-dialog-content ui-widget-content");
		$("#firewallError").css({height:"300px !important"});
		
		
	}
}
function updateSubstageViewedStatusBySubstageId(substageId, emailId){
	var access_token = getAccessToken();
	var rxPlannerURL = getRxPlannerUrl();
	if((substageId != -1) && (emailId != "") && (access_token != "" && access_token != "null") && (rxPlannerURL != "" && rxPlannerURL != "null")){
		var data = {"substageId":substageId,"emailId":emailId};
		$.ajax({
			type: "POST",
			data: data, 
			async: false,
			url: rxPlannerURL + "/CampaignStageController/updateSubstageViewedStatusBySubstageId?access_token="+access_token,
			success: function(response){
				console.log(response);
			},
			error: function(e){
				console.log(e.responseText);
			}
		});
	}
}