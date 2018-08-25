function Http(){}

Http.prototype = {
        defaultIntervalMS : 100,
        currentQueue : 0,
        queue : [],
        put : function (url, data){
            this.METHOD = "POST";
			this.pushToQueue(url,data);
        },
        pushToQueue : function(url,data){
			this.queue.push({"url":url,"data":data});
			this.post();
		},
		post : function(){
			var _this = this;
			setTimeout(function(){
				if(_this.queue[_this.currentQueue]){
					$.post(encodeURI(_this.queue[_this.currentQueue].url+JSON.stringify(_this.queue[_this.currentQueue].data)), function(data){
					});
					_this.queue.shift();
				}
				_this.post();
			 },_this.defaultIntervalMS);
		}
};

function Tracker(user, documentID,container,sessionId,trackId,isUrlViewed){
	if(!(user && documentID && container && sessionId && trackId)){
		return;
	}
    this.user = user;
    this.documentID = documentID;
	this.container = container;
	this.sessionId = sessionId;
	this.trackId = trackId;
	this.isUrlViewed = isUrlViewed;
    this.ACTIONS = {'VIEWED' : 0, 'CLICKED' : 1, 'ENTERED' : 2, 'SELECTED' : 3};
    this.URL = {'URL_USERVIEW' :'req/analytics/addUserView?inputStr=', 'URL_USERACTION' : 'req/analytics/addUserAction?inputStr='};
	this.init();
}

Tracker.prototype = {
        user: "",
        documentID : "",
		sessionId : "",
		trackId : "",
        startTime: 0,
		slideStartTime : "",
        container : "",
        data :{},
        http : null,
		ipAddress : "",
		slideNo : "",
		isUrlViewed : false,
		isWatching : false,
		isStarted : false,
        init : function(){
            this.http = new Http();
			this.getIpAddress();
        },
    	bindActions : function(){
    		var _this = this;
    		if($(this.container).children().find("[click-TrackerId]").length > 0){
				$("[click-TrackerId]").on("click", function(){
					_this.clicked($(this).attr("click-TrackerId"));
				});
    		}
			if($(this.container).children().find("[enter-TrackerId]").length > 0){
				$("[enter-TrackerId]").on("change", function(){
					var question = $(this).attr("enter-TrackerId");
					var value = $(this).val();
					_this.entered(question + ":"+value);
				});
			}
			if($(this.container).children().find("[select-TrackerId]").length > 0){
				$("[select-TrackerId]").on("change", function(){
					var question = $(this).attr("select-TrackerId");
					var value = $(this).val();
					_this.selected(question + ":"+value);
				});
			}
    	},
    	unbindActions : function(){
    		$("[click-TrackerId]").off("click");
    		$("[enter-TrackerId]").off("change");
    		$("[select-TrackerId]").off("change");
    	},
        viewed : function(){
        	if((this.isStarted || this.isUrlViewed) && !this.isWatching){
				var endTime = (new Date()).getTime();
				var spendTime = endTime - this.slideStartTime;
	            data = {"userid":this.trackId,"vdetailid":this.documentID,"action":this.ACTIONS['VIEWED'],"target":this.slideNo,"data":spendTime,"sessionid":this.sessionId,"ipaddress":this.ipAddress};
	            this.http.put(this.URL['URL_USERACTION'], data);
        	}
        },
		resetTime : function(){
			this.slideStartTime = (new Date()).getTime();
		},
		startSlideTracking : function(slideNo){
			this.slideNo = slideNo;
			this.slideStartTime = (new Date()).getTime();
		},
        clicked : function(elemID){
        	if((this.isStarted || this.isUrlViewed) && !this.isWatching){
				var clickedTime = (new Date()).getTime();
				var data = {"userid":this.trackId,"vdetailid":this.documentID,"action":this.ACTIONS['CLICKED'],"target":this.slideNo,"data":clickedTime,"sessionid":this.sessionId,"ipaddress":this.ipAddress};
				this.http.put(this.URL['URL_USERACTION'], data);
        	}
        },
        entered : function(value){
        	if((this.isStarted || this.isUrlViewed) && !this.isWatching){
				var data = {"userid":this.trackId,"vdetailid":this.documentID,"action":this.ACTIONS['ENTERED'],"target":this.slideNo,"data":value,"sessionid":this.sessionId,"ipaddress":this.ipAddress  };
				this.http.put(this.URL['URL_USERACTION'], data);
        	}
        },
        selected : function(value){
        	if((this.isStarted || this.isUrlViewed) && !this.isWatching){
				var data = {"userid":this.trackId,"vdetailid":this.documentID,"action":this.ACTIONS['SELECTED'],"target":this.slideNo,"data":value,"sessionid":this.sessionId,"ipaddress":this.ipAddress  };
				this.http.put(this.URL['URL_USERACTION'], data);
        	}
        },
        startWatching : function(){ //started video play
        	this.isWatching = true;
        	this.isStarted = true;
            this.startTime = (new Date()).getTime();
        },
        endWatching : function(){ // end video
        	this.isWatching = false;
			var endTime = (new Date()).getTime();
			var totalTimeSpent = endTime - this.startTime;
			var data = {"userid":this.trackId,"vdetailid":this.documentID,"intime":this.startTime,"outtime":endTime,"timespent":totalTimeSpent,"sessionid":this.sessionId,"ipaddress":this.ipAddress};
			if(this.startTime != 0){
				this.http.put(this.URL['URL_USERVIEW'],data);
			}
        },
		getIpAddress : function(){
			var _this = this;
			 $.getJSON("http://getcitydetails.geobytes.com/GetCityDetails?callback=?", function(data) {
			 _this.ipAddress =  data.geobytesremoteip;
			 });
		}
			 
};