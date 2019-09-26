$("button[name='slack']").click(function(){
	var userEmail = $(this).parent('td').siblings('.useremail').text().trim(); 
	var userId = $(this).attr("id");
	console.log(userEmail);
	var active = $(this);

	$.ajax({
		context: active,
		type: "POST",
		url: "/slack10", 
		data: JSON.stringify({ email: userEmail, userid: userId }),
	    contentType: "application/json; charset=utf-8",
	    dataType: "json",
		success: function(result){
    		active.parents("tr").css({"background-color": "#eef7ed"});
  		}
  	});

});

$("input[name='collected']").click(function(){
	var userId = $(this).attr("id"); 
	var active = $(this);

	$.ajax({
		context: active,
		type: "POST",
		url: "/collected", 
		data: JSON.stringify({ userid: userId }),
	    contentType: "application/json; charset=utf-8",
	    dataType: "json",
		success: function(result){
    		active.css({"background-color": "darkorange"});
  		}
  	});

});

$("button[name='edit']").click(function(){

var userId = $(this).attr("id"); 
var editName = $(this).siblings("input[name='editname']").val();
var editEmail = $(this).siblings("input[name='editemail']").val();
var active = $(this);

	$.ajax({
		context: active,
		type: "POST",
		url: "/edit", 
		data: JSON.stringify({ userid: userId, newEmail: editEmail, newName: editName }),
	    contentType: "application/json; charset=utf-8",
	    dataType: "json",
		success: function(result){
    		active.parent().html('Changes saved!');
    		setTimeout(location.reload.bind(location), 800);
  		}
  	});


});