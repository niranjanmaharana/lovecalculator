function MenuController(){
}

MenuController.prototype = {
	navData : '',
	activeElements : [],
	highlightClasses: new Object(),
	collectElements : function(elements){
		this.activeElements = elements;
	},
	hasHLClasses : function(){
		return jQuery.isEmptyObject(this.highlightClasses);
	},	
	isNavIdExists : function(){
		return $('nav').length > 0;
	},
	getNavData : function(){
		return $(document).find('nav').attr('data-value');
	},
	findMenuElements : function(){
		//var _tempAttrs = this.getElementsByAttr("data-seq");
		var _tempAttrs = document.querySelectorAll("[data-seq]");
		if(_tempAttrs.length > 0){
			this.collectElements(_tempAttrs);	
		}
		return _tempAttrs.length > 0;
	},
	addHighlighClass : function(className){
		this.highlightClasses = className;
	},
	onProcessCallback : null,
	onProcess : function(callback){
		this.onProcessCallback = callback;
	},
	process : function(){
		if(this.isNavIdExists()){
			this.navData = this.getNavData();
			var attrLength = this.navData.length;
			var foundMenuElms = this.findMenuElements();
			if(foundMenuElms && !this.hasHLClasses()){
				for(var i=0;i<this.activeElements.length;i++){
					for(var j=0;j < attrLength;j++){
						var attrValue = this.navData.substring(0,k=j+1);
						if($(this.activeElements[i]).attr('data-seq') == attrValue){
							$(this.activeElements[i]).addClass("active");//(this.highlightClasses['level'+j]);
							if(this.onProcessCallback) this.onProcessCallback(j,$(this.activeElements[i]));
						}
					}
				}
			}
		}
	}
};
