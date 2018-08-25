function GeoCoader(trackId,isMobile,isLandscape,cPath){
	/*if(!trackId && !isMobile && !isLandscape && !cPath){*/
		this.trackId = trackId;
		this.isMobile = isMobile;
		this.isLandscape = isLandscape;
		this.cpath = cPath;
		this.init();
	/*}*/
}	

GeoCoader.prototype = {
	trackId : null,
	os : "",
	isMobile : "",
	action : "",
	cpath : "",
	address : "",
	ipAddress : "",
	isLandscape : "",
	init : function(){
			var _this = this;
			 $.getJSON("http://getcitydetails.geobytes.com/GetCityDetails?callback=?", function(data) {
			 _this.ipAddress =  data.geobytesipaddress;
			 _this.address = data.geobytescity+":"+data.geobytescountry;
			 if(data.geobytesipaddress && data.geobytescity && data.geobytescountry){
				 _this.storeData();
			 }
		});
	},
	storeData : function(){
		$.support.cors = true;
		var _this = this;
		var OS = navigator.platform;
		OS = navigator.userAgent.match(/android/i) ? "android" : navigator.platform;
		var action = this.isMobile && this.isLandscape ? "landScape" : "Normal"; 
		$.ajax({
			url :_this.cpath+"/req/hcp/storeHCPData",
			data : {address:_this.address,trackid:_this.trackId,os:OS,ismobile:_this.isMobile,action :action,ipaddress:_this.ipAddress},
			type : 'post',	
			async : false,
			success : function(data) {
			}
		});
	}
};
