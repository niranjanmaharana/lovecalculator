	var props = {
		'recorderPane' : "#recWrapper",
		'playerPane' : "#playerWrapper",
		'htmlContainer' : '.modulepalyerContent',
		'playerMask' : '.modulepalyerContentMask',
		'nextBtn' : '#nextBtn',
		'prevBtn' : '#prevBtn',
		'pencilId' : "#pencilMarker",
		'sketchId' : "#sketchMarker",
		'clearId' : "#clearMarker",
		'presentationWrapper' : '#wrapper',
		/*'host' : '192.168.1.188',
		'port' : '1935',
		'recorderApplicationName' : 'localrecorder'*/
		'host' : '192.168.1.49',
		'port' : '1935',
		'recorderApplicationName' : 'devrecorder'
	};

var metadata = {
	'dataFile' : '',
	'vdetailID' : 'videorecorder',
	'clientName' : ''
};
var startTime;
var endTime;
var presentationID;

$(document).ready(function(){	
	presentationID = qs["presentationID"];
	loadMetadata(function(data){
		metadata.dataFile = data.dataFile+"/data.xml";
		metadata.vdetailID = data.vdetailID;
		metadata.clientName = data.clientName;
		var vd = new VDetailBuilder(props);
		$('#vid').html(metadata.vdetailID);
		vd.buildComposer(null,function(composer){
			composer.setMediaID(metadata.vdetailID);
			composer.setVdetailID(metadata.vdetailID);
			composer.onPresentationLoad(function(presenter){
				$('#filterSlides').click(function(){
					composer.showFilter();
				});
				presenter.showSlide(1);
				presenter.initPrev();
				presenter.initNext();
				composer.recorder.connect();
			});
			composer.onSlideChange(function(slideNo){	
				console.log("onslide change fn ",slideNo);
				var qnaSlideId =$("[data-type=qna]").parent().attr("id");
				var containerId = $("[data-type=qna]").attr("id");
				console.log("qna slide id ",qnaSlideId,"container id ",containerId);
				var currentSlideId = "html_slide_"+slideNo;
				if(currentSlideId == qnaSlideId){
					var QNAHCPData = {"trackId":"","vdetailid":"","sessionid":"","ipaddress":"","presentationID":presentationID,"enableFeedback":""};
					var container = $("#"+containerId);
					new VdetailQnABuilder(container,QNAHCPData);
				}

			});
			composer.loadPresentationFromUrl(metadata.dataFile);
			$("#startRecord").on('click', function(){
				composer.presentationBuilder.slidePresenter.showSlide(1);						
				deleteRecord(metadata.vdetailID);
				$(VDetailBuilder.props.playerPane).css('z-index', '0');
				$(VDetailBuilder.props.recorderPane).css('z-index', '3');
				$(this).hide();
				$("#playRecord, #save, #filterSlides").hide();
				$("#stopRecord").show();
				composer.startRecording();
				startTime = (new Date()).getTime();
			});
			$("#stopRecord").on('click', function(){
				$("#stopRecord").hide();
				$("#pleaseWaitLabel").show();
				setTimeout(function(){
					composer.stopRecording();
					endTime = (new Date()).getTime();
					$("#playRecord, #startRecord, #save, #filterSlides").show();
					$("#pleaseWaitLabel").hide();
				}, 3000);
			}); 
			$("#save").on('click', function(){
				var isDraft = 0;
				if(!$('#name').val() || !$('#description').val() || ($("#endmsg").is(':checked') && !$('#endmessage').val())){
					$('#validateError').html("Enter all the fields");
					return false;
				}else{
					/*confirmSave(function(canSave){
						if(canSave){
							isDraft = 1;
							composer.saveRecording();
							save(metadata.vdetailID,isDraft);
						}else{
							isDraft = 0;
							composer.saveRecording();
							save(metadata.vdetailID,isDraft);
						}	
					});*/
					//instead of confirmation before save recorded file, directly save the recorded file to directory.
					isDraft = 1;
					composer.saveRecording();
					save(metadata.vdetailID,isDraft);
					$('#validateError').empty();
					$('.entrName').css('margin-top','0px');
				}
			});  
		});
		var sourceProps = {
			mediaName : metadata.vdetailID,
			mediaType : "0",
			source : "0"
		}
		vd.buildPlayer(sourceProps,function(vdetailPlayer){
			vdetailPlayer.setMediaID(metadata.vdetailID);
			vdetailPlayer.onSlideChange(function(slideNo){
				var qnaSlideId =$("[data-type=qna]").parent().attr("id");
				var containerId = $("[data-type=qna]").attr("id");
				var currentSlideId = "html_slide_"+slideNo;
				if(currentSlideId == qnaSlideId){
					var QNAHCPData = {"trackId":"","vdetailid":"","sessionid":"","ipaddress":"","presentationID":presentationID,"enableFeedback":""};
					var container = $("#"+containerId);
					var qna = new VdetailQnABuilder(container,QNAHCPData);
				}

			});
			vdetailPlayer.onEnd(function(){
				$("#stopPlayRecord").hide();
				$("#playRecord, #startRecord, #save, #filterSlides").show();
				vdetailPlayer.enablePresentation();
			});
			
			$("#playRecord").on('click', function(){ 
				$("#startRecord ,#filterSlides").hide();
				composer.presentationBuilder.slidePresenter.showSlide(1);	
				$(VDetailBuilder.props.recorderPane).css('z-index', '0');
				$(VDetailBuilder.props.playerPane).css('z-index', '3');
//				$('.__mask').css('z-index','4');
//				$('.__mask').css('position','absolute');
//				$('.__mask').css('top','295px');
//				$('.__mask').css('width','775px');
//				$('.__mask').css('height','670px');
				$('.__mask').css('z-index','4');
				$('.__mask').css('position','absolute');
				$('.__mask').css('top','20px');
				$('.__mask').css('left','0px');
				$('.__mask').css('width','768px');
				$('.__mask').css('height','576px');
				$("#stopPlayRecord").show();
				$("#playRecord").hide();
				vdetailPlayer.disablePresentation();
				vdetailPlayer.play();
			}); 
			
			$("#stopPlayRecord").on('click', function(){
				$("#stopPlayRecord").hide();
				$("#playRecord, #startRecord, #save, #filterSlides").show();
				vdetailPlayer.enablePresentation();
				vdetailPlayer.stop();
			});
		});  
		
		$('#Tools').click(function(){
			$('.ToolPopupWindow').slideToggle(400);
		});
	});
});
function loadMetadata(callback){
	$.ajax({
		url : contextPath+"/req/presentation/getPresentation",
		data : {id : presentationID},
		type : 'get',	
		async : false,
		success : function(data) {	
			callback && callback(data);
		},
		error : function() {
			console.log("failure");
		}
	});
}	

function confirmSave(callback){
	$.confirm({
		'title'		: 'Save Presentation',
		'message'	: 'Do you want to store permanently this vdetail in Drafts?',
		'buttons'	: {
			'Save'	: { 'class'	: 'blue',
				'action': function(){
					callback && callback(true);
				}
			},
			"Don't Save"	: { 'class'	: 'gray',
				'action': function(){
					callback && callback(false);
				}	
			}
		}
	});
}
	
function deleteRecord(vID){
	$.ajax({
		url : contextPath+"/req/vdetail/deleteRecord?vdetailID="+vID,
		type : 'post',							
		success : function(list) {				
			console.log("deleted vdetail!");
		},
		error : function() {
			console.log("failure to delete!");
		},
		dataType : "json"
	});	
}

function save(vdetailID, draft){
	var vdetailDuration = eval(endTime - startTime);
    $.ajax({
        url : contextPath+"/req/vdetail/recordAndSave",
        data : {
            videoname : $('#name').val(),
            description : $('#description').val(),
            endmessage : $('#endmessage').val(),
            allowfirstslide : $('#allowslide').val(),
            vdetailID : vdetailID,
            draft : draft,
            duration : vdetailDuration,
            presentationID : qs['presentationID']
        },
        type : 'post',
        success : function(isUpdated) {
	        if(!isUpdated){
	            alert("Allowed space is crossed.");
	            window.location.href = contextPath+"/req/vdetail/record?presentationID="+qs['presentationID'];
	        }else{
	            var videoname = $('#name').val(),
	            description = $('#description').val();
	            var td = $('#name').parent();
	            var desc = $('#description').parent();
	            $('#name,#description').remove();
				$(td).html('<div>'+videoname+'</div>');
				$(desc).html('<div>'+description+'</div>');
				$("#playRecord, #startRecord, #stopRecord, #save, #stopPlayRecord, #filterSlides").hide();
	            $("#next").show();
	            $("#next").click(function(){
	                window.location.href = contextPath+"/req/vdetail/playvdetail?vID="+metadata.vdetailID;
	            });
	        }
        },
        error : function() {
            console.log("failure");
        },
        dataType : "json"
    }); 
}

