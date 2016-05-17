//Jquery for Tsak
//Add Json Command Data

if (!library)
   var library = {};

library.json = {
   replacer: function(match, pIndent, pKey, pVal, pEnd) {
      var key = '<span class=json-key>';
      var val = '<span class=json-value>';
      var str = '<span class=json-string>';
      var r = pIndent || '';
      if (pKey)
         r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
      if (pVal)
         r = r + (pVal[0] == '"' ? str : val) + pVal + '</span>';
      return r + (pEnd || '');
      },
   prettyPrint: function(obj) {
      var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
      return JSON.stringify(obj, null, 3)
         .replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
         .replace(/</g, '&lt;').replace(/>/g, '&gt;')
         .replace(jsonLine, library.json.replacer);
      }
};

var commandJson = {
			"dumpFollowerIDs":[
				{"field_name":"-uname","desc":"Enter twitter screen name"},
				{"field_name":"-limit","desc":"Enter twitter API limit Max = 15"},
				{"field_name":"-o","desc":"Enter output file name with extension"}
			],
			"dumpFriendIDs":[
				{"field_name":"-uname","desc":"Enter twitter screen name"},
				{"field_name":"-limit","desc":"Enter twitter API limit Max = 15"},
				{"field_name":"-o","desc":"Enter output file name with extension"}
			],
			"dumpTweets":[
				{"field_name":"-keywords","desc":"Comma separated keywords"},
				{"field_name":"-limit","desc":"Enter twitter API limit Max = 180"},
				{"field_name":"-o","desc":"Enter output file name with extension"}
			],
			"dumpStatus":[
				{"field_name":"-sid","desc":"Enter Status ID of the desired status"},
				{"field_name":"-o","desc":"Enter output file name with extension"}
			],
			"dumpGeoDetails":[
				{"field_name":"-pid","desc":"Place ID, for which the geo details will be returned"},
				{"field_name":"-o","desc":"Enter output file name with extension"}
			],
			"dumpHomeTimeLine":[
				{"field_name":"-o","desc":"Enter output file name with extension"}
			]
		};
$(document).ready(function(){

	addSelectFields();
	showHide();
	//onclick function
	$('#submitform').click(function(){
		$("#missing_key_error").css('display','none');
		var is_validated = formValidate();
		if(is_validated){
			var optionSelected = $("#commands-select option:selected").text();
			var commandOptions = commandJson[optionSelected];

			for(var comm in commandOptions){
				var showfield = commandOptions[comm];
				var showfieldname = showfield.field_name;
				var fieldValue = $("input[id='"+showfieldname+"']").val();

				fieldValue = fieldValue.trim();
				if(fieldValue === ""){
					var parent = $("#"+showfieldname).parent().get(0);
					var expectedLabel = $(parent).children().get(0);
					$(expectedLabel).removeClass("label-default");
					$(expectedLabel).addClass("label-danger");
					$( "#"+showfieldname).keypress(function() {
					  $(expectedLabel).removeClass("label-danger");
					  $(expectedLabel).addClass("label-default");
					});
					return;
				}
			}
			var jsonFormData = getJsonFormData();
			var responseData = sendAjaxRequest(jsonFormData);
			
			//var iframe = document.getElementById("downloadFrame");
			//iframe .src = "file:///F://books//fynder_clean//twitter-swiss-army-knife//bit_out.out";
			//window.location.href = "file:///F://books//fynder_clean//twitter-swiss-army-knife//bit_out.out";
		}else{
			$("#missing_key_error").css('display','block');
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
					var fieldobj = fields[vi];
					var field_name = fieldobj.field_name;
					var field_desc = fieldobj.desc;
					$('.commands-selected').append('<div class="form-group"><label class="label label-default dynamic-label">'+field_name+'</label><input type="text" class="form-control inputcommand"  placeholder="'+field_desc+'" name="'+field_name+'" id="'+field_name+'" required></div>');
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
		$(this).text('Show twitter key config');
	    if($('.applicationkeys').is(':visible')){
	          $(this).text('Show twitter key config');
	    }else{
	          $(this).text('Hide twitter key config');
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
        $( "#consumerKey").keypress(function() {
			$(".consumerKey").addClass('label-default');
			$(".consumerKey").removeClass('label-danger');
		});
        return false;
    } 
    else if($('#consumerSecret').val() == ""){
        $(".consumerSecret").removeClass('label-default');
        $(".consumerSecret").addClass('label-danger');
        $( "#consumerSecret").keypress(function() {
			$(".consumerSecret").addClass('label-default');
			$(".consumerSecret").removeClass('label-danger');
		});
        return false;
    }
    else if($('#accessToken').val() == ""){
     	$(".accessToken").removeClass('label-default');
        $(".accessToken").addClass('label-danger');

        $( "#accessToken").keypress(function() {
			$(".accessToken").addClass('label-default');
			$(".accessToken").removeClass('label-danger');
		});
        return false;
    } 
    else if($('#accessTokenSecret').val() == ""){
        $(".accessTokenSecret").removeClass('label-default');
        $(".accessTokenSecret").addClass('label-danger');
        $( "#accessTokenSecret").keypress(function() {
			$(".accessTokenSecret").addClass('label-default');
			$(".accessTokenSecret").removeClass('label-danger');
		});
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
			
			if(fieldname == "-o"){
				fieldvalue = fieldvalue.replace(/\\/g, '');
				fieldvalue = fieldvalue.replace(/\//g, '');
			}
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
			"-accessSecret":accessTokenSecret
		}
	};
	commandJson['values'] = jsonCommand;
	//. var jsonString = JSON.stringify(commandJson);
	return commandJson;
}

function sendAjaxRequest(formData){
	$.ajax({
		type: 'POST',
		async: true,
		//. url: 'request.php',
		contentType: "application/json",
		url: 'http://localhost:9191/tsak/api',
		data: /*formData,*/ JSON.stringify(formData),
		dataType: "json",
		beforeSend: function (request){
		  console.log(JSON.stringify(formData));
		},
		success: function(response){
			var jsonPrettyPrint = JSON.stringify(response); //. syntaxHighlight(response);
			console.log(response);

			$("#output-panel").css("display","block");
			$("#json").empty();
			$('#json').html(library.json.prettyPrint(response));
			if(response['error'] == null){
				$("#data_downloader").css("display", "inline-block");
				$("#data_downloader").attr("href", "data_downloader.php?filename="+response.absolutePath);
			}else{
				$("#data_downloader").css("display", "none");
			}
			return response;
		},
		error: function(jqXHR, textStatus, ex){
			$("#data_downloader").css("display", "none");
			console.log(jqXHR);
			console.log(textStatus);
			console.log(ex);
			return null;
		}
	});
}