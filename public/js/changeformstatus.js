$("button[name='unlockform']").click(function(){
	var active = $(this);

	$.ajax({
		context: active,
		type: "POST",
		url: "/unlockform", 
		data: JSON.stringify({ formstatus: true }),
	    contentType: "application/json; charset=utf-8",
	    dataType: "json",
		success: function(result){	
			setTimeout(location.reload.bind(location), 800);
  		}
  	});

});

$("button[name='lockform']").click(function(){
	var active = $(this);

	$.ajax({
		context: active,
		type: "POST",
		url: "/lockform", 
		data: JSON.stringify({ formstatus: false }),
	    contentType: "application/json; charset=utf-8",
	    dataType: "json",
		success: function(result){	
			setTimeout(location.reload.bind(location), 800);
  		}
  	});

});

$("button[name='editflavour']").click(function(){

var flavourId = $(this).attr("id"); 
var editFlavour = $(this).siblings("input[name='editflavour']").val();
var active = $(this);

	$.ajax({
		context: active,
		type: "POST",
		url: "/editflavour", 
		data: JSON.stringify({ flavourId: flavourId, newFlavour: editFlavour }),
	    contentType: "application/json; charset=utf-8",
	    dataType: "json",
		success: function(result){
    		active.parent().html('Changes saved!');
    		setTimeout(location.reload.bind(location), 800);
  		}
  	});


});