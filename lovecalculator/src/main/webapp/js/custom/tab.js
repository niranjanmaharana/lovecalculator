  var menuLength = 0;
     $(document).ready(function(){
         menuLength = $(".tabmenu li").siblings().length;
         $(".tabmenu li:eq(0)").addClass("active");
         $(".tabcontent:eq(0)").show();
         $(".tabmenu li").click(function(){

        	
             var index = $(this).index();
             update(index);
         });
         $(".tabnext").click(function(){
             gonext();
         });
         $(".tabprev").click(function(){
             goprev();
         });
     });
     function gonext(){
         var index = $(".tabmenu").find(".active").index();
         if(index < menuLength){
             index = index + 1;
             update(index);
         }
     }
     function goprev(){
         var index = $(".tabmenu").find(".active").index();
         if(index > 0){
             index = index - 1;
             update(index);
         }
     }
     function update(index){
         $(".tabmenu li").removeClass("active");
         $(".tabcontent").hide();
         $(".tabmenu li:eq("+index+")").addClass("active");
         $(".tabcontent:eq("+index+")").show();
         index==0 ? $(".todays").hide() : $(".todays").show() ;
       
     }