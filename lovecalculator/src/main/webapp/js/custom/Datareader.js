function DataReader(path,handler){
    if(typeof(jQuery) == 'undefined'){
        alert("Jquery implementation not found!");
        return;
    }
	if(path){
		this.path = path;
		this.onReady = handler;
	}
	this.read();
}

DataReader.prototype = {
	path : "",
	handlers : [],
	data : null,
	onReady : null,
	setData : function(o){
		if(this.onReady) this.onReady(o);
		this.data = o;
		for(var i = 0; i < this.handlers.length; i++){
			this.handlers[i](this.data);
		}
	},
	read : function(){		
		var _this = this;
		$.get(this.path, function(o){ 
			_this.setData(o);
		});	
	},
	getData : function(handler){ 
		if(this.data == null){
			this.handlers.push(handler);
		}else{
			this.handlers = [];
			handler(this.data);
		}
	}
};


