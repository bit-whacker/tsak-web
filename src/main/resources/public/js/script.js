//Jquery for Tsak
//Add Json Command Data
var commandJson = {
			"dumpFollowerIDs":[
				"-uname", "-limit","-o"
			],
			"dumpGeoDetails":[
				"-pid","-o"
			],
			"dumpHomeTimeLine":[
				"-o"
			]
		};
$(document).ready(function(){
	addSelectFields();
	showHide();
	//onclick function
	$('#submitform').click(function(){
		var is_validated = formValidate();
		if(is_validated){
			var optionSelected = $("#commands-select option:selected").text();
			var commandOptions = commandJson[optionSelected];

			for(var comm in commandOptions){
				var showfield = commandOptions[comm];
				var fieldValue = $("input[id='"+showfield+"']").val();
				fieldValue = fieldValue.trim();
				if(fieldValue === ""){
					var parent = $("#"+showfield).parent().get(0);
					var expectedLabel = $(parent).children().get(0);
					$(expectedLabel).removeClass("label-default");
					$(expectedLabel).addClass("label-danger");
					console.log(parent);
					console.log(expectedLabel);
					return;
				}
			}
			var jsonFormData = getJsonFormData();
			var responseData = sendAjaxRequest(jsonFormData);
		}
	});
});

//function to add items to select and add fields to form
function addSelectFields(){
	//make a json data
		
		for(var item in commandJson){

			$("#commands-select").append("<option value="+item+">"+item+"</option>");
		}
		$("#commands-select").change(function(){
			//console.log($(this).val());
			$(this).find("option:selected").each(function(){
				var v = $(this).attr("value");
				var fields = commandJson[v];
				$('.commands-selected').empty();
				for(var vi in fields){
					var fieldLabel = fields[vi];
					$('.commands-selected').append('<div class="form-group"><label class="label label-default dynamic-label">'+fieldLabel+'</label><input type="text" class="form-control inputcommand" name="'+fieldLabel+'" id="'+fieldLabel+'" required></div>');
				}
			});
		});
		//. fire dropDown onChange event
		$("#commands-select").trigger('change');
	}
//function to showhide application keys fields
function showHide(){
	//keys configuration
	$('#key-conf-id').click(function(){
		$(this).text('Show Keys Configuration');
	    if($('.applicationkeys').is(':visible')){
	          $(this).text('Show Keys Configuration');
	    }else{
	          $(this).text('Hide Keys Configuration');
	    }
	    $('.applicationkeys').slideToggle('medium');
	    return false;
	});
}
//form validation
function formValidate(){

	if($('#consumerKey').val() == ""){
        $(".consumerKey").removeClass('label-default');
        $(".consumerKey").addClass('label-danger');
        return false;
    } 
    else if($('#consumerSecret').val() == ""){
        $(".consumerSecret").removeClass('label-default');
        $(".consumerSecret").addClass('label-danger');
        return false;
    }
    else if($('#accessToken').val() == ""){
     	$(".accessToken").removeClass('label-default');
        $(".accessToken").addClass('label-danger');
        return false;
    } 
    else if($('#accessTokenSecret').val() == ""){
        $(".accessTokenSecret").removeClass('label-default');
        $(".accessTokenSecret").addClass('label-danger');
        return false;
    }
    else{
    	return true;
    }
}
//Get json form data 
function getJsonFormData(){
	var jsonCommand = new Array();
	$('.commands-selected input ').each(
	    function(index){  
	        var input = $(this);
	        var fieldname = input.attr('name');
	        var fieldvalue = input.val();
	        var col = {};
	        col[fieldname] = fieldvalue;
			jsonCommand.push(col);
	    }
	);
	//get applicationkey values and selected command value
	var comselect = $('#commands-select').val();
	var consumerKey = $('#consumerKey').val();
	var consumerSecret = $('#consumerSecret').val();
	var accessToken = $('#accessToken').val();
	var accessTokenSecret = $('#accessTokenSecret').val();
	
	//Json object is created here
		var commandJson = {
		command:comselect,
		//values:[],
		credentials:{
			"-consumerKey":consumerKey,
			"-consumerSecret":consumerSecret,
			"-accessToken":accessToken,
			"-accessTokenSecret":accessTokenSecret
		}
	};
	commandJson['values'] = jsonCommand;
	var jsonString = JSON.stringify(commandJson);
	//console.log(myString);
	$("#output-panel").css("display","block");
	$("#output-panel .output-div").empty();
	$("#output-panel .panel-body").append('<div class="output-div"><label class="label label-success">Output Json</label></br>'+jsonString+'</div>');
}