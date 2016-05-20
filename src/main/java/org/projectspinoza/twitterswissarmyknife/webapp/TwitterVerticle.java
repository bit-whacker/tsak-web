package org.projectspinoza.twitterswissarmyknife.webapp;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.buffer.Buffer;
import io.vertx.core.http.HttpMethod;
import io.vertx.core.http.HttpServer;
import io.vertx.core.http.HttpServerResponse;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.StaticHandler;

import java.io.PrintWriter;
import java.io.StringWriter;

import org.projectspinoza.twitterswissarmyknife.TwitterSwissArmyKnife;
import org.projectspinoza.twitterswissarmyknife.util.TsakResponse;

import com.fasterxml.jackson.databind.ObjectMapper;




public class TwitterVerticle extends AbstractVerticle {
	private HttpServer httpServer;
	private Router router;
	TwitterSwissArmyKnife tsak;

	@Override
	public void start(Future<Void> startFuture) throws Exception {
		super.start(startFuture);

		httpServer = vertx.createHttpServer();
		router = Router.router(vertx);
		tsak = new TwitterSwissArmyKnife();
		
		router.getWithRegex(".*/css/.*|.*/js/.*|.*/images/.*|.*/fonts/.*").handler(
		        StaticHandler.create("public").setCachingEnabled(false));
		
		//. show index page
		router.route(HttpMethod.GET, "/tsak").handler(routingContext -> {
			routingContext.response().sendFile("public/index.html");
		});
		
		//. serve api request
		router.route(HttpMethod.POST, "/tsak/api").consumes("application/json").produces("application/json").handler(routingContext -> {
			routingContext.request().bodyHandler(requestData -> {
				System.out.println("request recieved!!!");
				JsonObject jsonData = requestData.toJsonObject();
				
				JsonArray commandOptions = jsonData.getJsonArray("values");
				JsonObject twitterKeys = jsonData.getJsonObject("credentials");
				
				StringBuffer commandBuilder = new StringBuffer();
				commandBuilder.append("tsak").append(" ");
				
				for(String fieldName : twitterKeys.fieldNames()){
					commandBuilder.append(fieldName).append(" ");
					commandBuilder.append(twitterKeys.getString(fieldName)).append(" ");
				}
				
				commandBuilder.append(jsonData.getString("command")).append(" ");
				for(int i=0; i < commandOptions.size(); i++){
					JsonObject entry = commandOptions.getJsonObject(i);
					for(String fieldName : entry.fieldNames()){
						commandBuilder.append(fieldName).append(" ");
						commandBuilder.append(entry.getValue(fieldName)).append(" ");
					}
				}
				
				String strCommand = commandBuilder.toString().trim();
				System.out.println(strCommand);
				TsakResponse tsakResponse = null;
				try {
					tsakResponse = tsak.executeCommand(strCommand.split(" ")).getResult();
					tsak.write();
				} catch (Exception e){
					//. e.printStackTrace();
					StringWriter sw = new StringWriter();
					PrintWriter pw = new PrintWriter(sw);
					e.printStackTrace(pw);
					tsakResponse = new TsakResponse();
					tsakResponse.setError(sw.toString());
				}
				ObjectMapper objectMapper = new ObjectMapper();
				
				String commandResponse = null;
				
				try {
					commandResponse = objectMapper.writeValueAsString(tsakResponse);
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} 
				Buffer responseData = Buffer.buffer(commandResponse.getBytes());
						
				HttpServerResponse response = routingContext.response();
				response.setStatusCode(200);
				response.headers()
				.add("Content-Length", responseData.length()+"")
				.add("Content-Type", "application/json");
				response.end(responseData);
			});
		});
		
		httpServer.requestHandler(router::accept).listen(9191);
	}

	@Override
	public void stop(Future<Void> stopFuture) throws Exception {
		super.stop(stopFuture);
	}
	
	public static void testCommand(String[] args) throws Exception{
    	
    	String strCommand = "tsak -consumerKey pvZKxlY0XIndh1P602Be0u3S8 -consumerSecret fq9HrbK4hK8Ws7SWkPvsvqnxq1C4U8DbFehdztkoKpjNecEOmm -accessToken 2612030880-TkNE7z6FlZJkHEfbUpirnbynaxy75Rnt6WUUQOj -accessSecret M5RQSznWtiRHDv2Mveq80psqDImYbBBGJLIFnIWYPQSP7 dumpFollowerIDs -uname bit_whacker -limit 1 -o bit_followers.out";
    	String[] command = strCommand.split(" ");
    	
    	TwitterSwissArmyKnife tsak = new TwitterSwissArmyKnife();
        //. String[] command = getCommandLineArguments();
        TsakResponse response = tsak.executeCommand(command).getResult();
        System.out.println(response);
    }

}
