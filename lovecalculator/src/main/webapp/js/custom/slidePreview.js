/**
 * 
 */

function SlidePreview(prop, onReady){
	var parser = new DataParser(new DataReader(prop.dataFile)); 
	var _this = this;
	this.onReady = onReady;
	console.log("slider init fn");
	SlidePreview.props = { 
			animtype      : 'slide',
            height      : 320,
            width       : 620,
            responsive  : true
    };
	parser.ready(function(obj){
		_this.slideInfo = obj.getData();
		_this.init();
	});
	this.extend(prop);
	this.container = prop.container;
}
SlidePreview.prototype = {
	container : '',
	slideInfo : {},
	totalSlides : 0,
	thumbnailArray : [],
	init : function(){
		console.log("slider init fn");
		this.totalSlides = this.slideInfo.contents.length;
		this.thumbnailArray = this.slideInfo['thumbnail'];
		this.createSlidePreview();
	},
	createSlidePreview : function(){
		var html = '<ul class="bjqs">';
		for(var i = 0; i < this.thumbnailArray.length; i++){
			html += '<li><img src="'+this.thumbnailArray[i]+'" title=""></li>';
		}
		html +='</ul>';
		$(this.container).html(html);
		this.initSlider();
	},
	initSlider : function(){
		$(this.container).bjqs(SlidePreview.props);
	},
	extend : function(userProps){
		for(var key in userProps){
			if(SlidePreview.props.hasOwnProperty(key)){
				SlidePreview.props[key] = userProps[key];
			}
		}
	}
		
}