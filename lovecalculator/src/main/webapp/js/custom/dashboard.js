var _arr = [],_arrmore = [], successdata = [],moresuccessdata = [] ;

var _array = [],_arraymore = [], sentdata=[],vieweddata=[], moresentdata=[],morevieweddata=[];

window.onload = function () {    	
	var totalvdetails = $("#totalvdetails").html();
	var draftvdetails = $("#draftvdetails").html();
	var sentvdetails = $("#sentvdetails").html();
	var outboxvdetails = $("#outboxvdetails").html();
	
	var availableSpace = $("#availableSpace").html();
    var remainingSpace = $("#remainingSpace").html();
	
    CanvasJS.addColorSet("SpaceColorset",
            [//colorSet Array
            "#00aa00",
            "#ec2028"              
            ]);
if(!(availableSpace==0.0 && remainingSpace==0)){
    var chart = new CanvasJS.Chart("chartContainer1",{
	    width : 520,
	    height : 250,
	    animationEnabled: false,
	    colorSet: "SpaceColorset",
	    
	    data: [
	    {
	    type: "pie",
	    indexLabel: "{label} {y}",
	    startAngle:90,
	    toolTipContent:"{legendText} {y}",
	    showInLegend: true,
	    dataPoints: [
	    {  y: availableSpace,legendText:"Available Space",label: "Available Space" },
	    {  y: remainingSpace, legendText:"Used Space!",label: "Used Space" }
	    ]
	    }
	    ],
 
	    legend:{
            fontSize: 20,
            horizontalAlign: "right", 
            verticalAlign: "center"
          }
    });    	 
	chart.render();// Chart1 Finish
}
else{
	$("#chartContainer1").html("<H4 style='color:red;'> No Data Found</H4>");
}

if(!(totalvdetails==0 &&draftvdetails==0&&sentvdetails==0&&outboxvdetails==0)){
	var chart = new CanvasJS.Chart("chartContainer2", {
		width : 520,
	    height : 250,  
		data: [              
		{
			type: "column",
			dataPoints: [
			  { label: "Composed",  y: parseInt(totalvdetails) },
              { label: "Draft", y: parseInt(draftvdetails)  },
              { label: "Sent", y: parseInt(sentvdetails)  },
              { label: "Outbox",  y: parseInt(outboxvdetails)  }
			]
		}
		]
	});
	chart.render();// Chart2 Finish
}else{
	$("#chartContainer2").html("<H4 style='color:red;'> No Data Found</H4>");
}
	
    var vDetailSuccessList = $("#vDetailSuccessList").html(); 
    var vDetailAllSuccessList = $("#vDetailAllSuccessList").html(); 
    _arr = $.parseJSON(vDetailSuccessList);
    _arrmore = $.parseJSON(vDetailAllSuccessList);
    var count = _arr.length >10 ? 10 :_arr.length;
    for(var k=0;k < count;k++){
    	var sobj = {};
     	sobj['label'] = _arr[k].vdetailname.length>15?_arr[k].vdetailname.substring(0,15)+"..":_arr[k].vdetailname;
     	
     	sobj['y'] = _arr[k].successrate <= 100 ? _arr[k].successrate : 100;
     		successdata.push(sobj);
     }
    for(var k=0;k<_arrmore.length;k++){
    	var sobj = {};
     	sobj['label'] = _arrmore[k].vdetailname.length>15?_arrmore[k].vdetailname.substring(0,15)+"..":_arrmore[k].vdetailname;
     	sobj['y'] = _arrmore[k].successrate;
     		moresuccessdata.push(sobj);
     }
   
    	loadSuccessChart(successdata,"chartContainer3");// load Chart 3 finish
    
    	
        var vDetailRatioList = $("#vDetailRatioList").html();
        var vDetailAllRatioList = $("#vDetailAllRatioList").html();
        _array = $.parseJSON(vDetailRatioList);
        _arraymore = $.parseJSON(vDetailAllRatioList);
        
        function getMonthNumber(monthname){
        	var monthNumber = ["january", "february", "march","april","may","june","july","august","september","october","november","december"].indexOf(monthname.toLowerCase()) + 1;
        	return monthNumber;
        }
        for(var i=0;i<_array.length;i++){
        	
        	var obj = {},obj2 = {};
        	if(!(((_array[i].year)==undefined) && ((_array[i].month) == undefined))){
        	if(_array[i].year == new Date().getFullYear()){
        		current = _array[i].year+"/"+getMonthNumber(_array[i].month)+"/01";
        		var d = new Date(current);        		
             	obj['x'] = d;
             	obj['y'] = _array[i].totalvdetailssent;
             	obj2['x'] = d;
             	obj2['y'] = _array[i].totalvdetailsviewed;
             	sentdata.push(obj);
             	vieweddata.push(obj2);
        	}
        	}
         }
        
        for(var i=0;i<_arraymore.length;i++){
        	var obj = {}, obj2 = {};
        	if((_arraymore[i].year)!=undefined && (_arraymore[i].month)!= undefined){
        	current = _arraymore[i].year+"/"+getMonthNumber(_arraymore[i].month)+"/01";
         	var d = new Date(current);        	
         	obj['x'] = d;
         	obj['y'] = _arraymore[i].totalvdetailssent;
         	obj2['x'] = d;
         	obj2['y'] = _arraymore[i].totalvdetailsviewed;
         	moresentdata.push(obj);
         	morevieweddata.push(obj2);
        	}
         }        
        loadratiochart(sentdata,vieweddata,"chartContainer4");
} 

function loadSuccessChart(data,id){
	var h;
	var w;
	if(id=="chartContainer3"){
		w=520;h=250;
	}else{
		w=800;h=500;
	}
if(data.length!=0){
    var chart = new CanvasJS.Chart(id, {
    	width : w,
	    height : h,
	    zoomEnabled: true,
	    animationEnabled: false,
	    legend: {
	    	fontSize: 20
	    },
	    axisY: {
	    	title: "",
		maximum: 100,		
		suffix: "%",
    	labelFontSize:10
	    },
	    axisX: {	    	
	    	labelFontColor: "red",
	    	labelFontFamily: "tahoma",
	    	labelFontSize:10,	    	
	    	interval:1
	    },
	   
	    toolTip: {
	        shared: true,  
	        content: function(e){
	          var str = '';
	          var total = 0 ;
	          var str3;
	          var str2 ;
	          for (var i = 0; i < e.entries.length; i++){
	            var  str1 = "<span style= 'color:"+e.entries[i].dataSeries.color + "'> " + e.entries[i].dataSeries.name + "</span>: <strong>"+  e.entries[i].dataPoint.y + " %</strong> <br/>" ; 
	            total = e.entries[i].dataPoint.y + total;
	            str = str.concat(str1);
	          }
	          str2 = "<span style = 'color:DodgerBlue; '><strong>"+e.entries[0].dataPoint.label + " </strong></span><br/>";
	          str3 = "<span style = 'color:Tomato '>Total: </span><strong>" + total + " </strong><br/>";
	          
	          return (str2.concat(str));
	        }
	    },
	    data: [
	           {        
	        	   type: "bar",
	        	   showInLegend: true,
	        	   name: "Success(%)",
	        	   color: "gold",
	        	   dataPoints: data
	           }
	           ]
   	    });
    	chart.render();
}else{
	$("#chartContainer3").html("<H4 style='color:red;'> No Data Found</H4>");
	$("#moreSuccess").hide();
}
}

function loadChart(){
	loadSuccessChart(successdata,"chartContainer3");
}
function loadFullChart(){
	loadSuccessChart(moresuccessdata,"chartContainerfull");
}
   

function loadratiochart(sentdata,vieweddata,id){
   
if(!(sentdata.length==0 && vieweddata.length==0)){
	var chart = new CanvasJS.Chart(id,{
    	width : 520,
		    height : 250,
		animationEnabled: false,
		axisX:{
			gridColor: "Silver",
			tickColor: "silver",
			valueFormatString: "MMM/YYYY",
			interval:1,
			intervalType: "month"//,
			//minimum: new Date(2016, 01, 01),
     		//maximum: new Date(2016, 12, 31)

		},                        
        toolTip:{
          shared:true
        },
		theme: "theme2",
		axisY: {
			gridColor: "Silver",
			tickColor: "silver"
		},
		legend:{
			
			verticalAlign: "center",
			horizontalAlign: "right"
		},
		data: [
		{        
			type: "line",
			showInLegend: true,
			lineThickness: 2,
			name: "Sent",
			markerType: "square",
			color: "#F08080",
			dataPoints: sentdata
		},
		{        
			type: "line",
			showInLegend: true,
			name: "Viewed",
			color: "#20B2AA",
			lineThickness: 2,
			dataPoints: vieweddata 
		}
		],
      legend:{
        fontSize: 20
      }
});
chart.render(); 
}else{
	$("#chartContainer4").html("<H4 style='color:red;'> No Data Found</H4>");	
	$("#moreRatio").hide();
}// Chart4 Finish   
}
    
function loadRatioChart(){
	loadratiochart(sentdata,vieweddata,"chartContainer4");
}
function loadFullRatioChart(){
	loadratiochart(moresentdata,morevieweddata,"ratiochartContainerfull");
}
  
    
   
    
    
    
