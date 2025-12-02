package com.university.cours;

import com.university.cours.config.MongoDBConfig;
import com.university.cours.service.CourseServiceImpl;
import jakarta.xml.ws.Endpoint;

public class CourseServicePublisher {
    public static void main(String[] args) {
        String host = MongoDBConfig.getProperty("service.host");
        String port = MongoDBConfig.getProperty("service.port");
        String path = MongoDBConfig.getProperty("service.path");

        String url = "http://" + host + ":" + port + path;

        System.out.println("Starting Course Service...");
        System.out.println("Service URL: " + url);
        System.out.println("WSDL URL: " + url + "?wsdl");

        Endpoint endpoint = Endpoint.publish(url, new CourseServiceImpl());

        System.out.println("Course Service is running!");
        System.out.println("Press Ctrl+C to stop the service.");

        // Keep the service running
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("\nShutting down Course Service...");
            endpoint.stop();
            MongoDBConfig.close();
            System.out.println("Course Service stopped.");
        }));
    }
}
