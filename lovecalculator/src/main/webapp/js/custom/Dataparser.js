function DataParser(reader){
	var _this=this;	
	reader.getData(function(o){ 
		var data = o;
		try{
			data = eval(o); 
			if (!data && window.ActiveXObject) {
				data = fallBackAction(); 
			}
			_this.loadData(data);
			_this.isLoaded = true;
			if(_this.initHandler) _this.initHandler(_this);
		}catch(e){
			console.log("Error occured while parsing data  "+e.message);
			return;
		}
	});
	
}

DataParser.prototype={
	presentations : {},
	noOfPresentations : 0,
	isLoaded : false,
	initHandler : null,
	ready: function(handler){
		if(this.isLoaded){
				handler(this);
			}else{
				this.initHandler = handler;
			}
	},
	loadData: function(xml){
		var _this = this;
		this.presentations['contents'] = [];
		this.presentations['thumbnail'] = [];
		$(xml).find('slide').each(function(){
			_this.presentations['contents'].push($(this).attr('src'));
			var thumbnail = $(this).attr('thumbnail') ? $(this).attr('thumbnail') : '';
			_this.presentations['thumbnail'].push(thumbnail);
			/*var presentationNo = $(this).attr('index');
			_this.presentations[presentationNo] = {};
			_this.presentations[presentationNo]['contents'] = [];
			$(this).find('contents').children().each(function(){
				_this.presentations[presentationNo]['contents'].push($(this).attr('src'));
			});*/
			
		});
		//alert(JSON.stringify(this.presentations));
	},
	getData: function(){
		return this.presentations;
	}
};

