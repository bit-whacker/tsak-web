package org.projectspinoza.twitterswissarmyknife.webapp;

import io.vertx.core.Vertx;

public class HttpServerWebMain {

	public static void main(String[] args) {
		Vertx vertx = Vertx.vertx();
		vertx.deployVerticle(new TwitterVerticle(), stringAsyncResult -> {
			System.err.println("Twitter verticle has deployed successfully!");
		});
	}
}
