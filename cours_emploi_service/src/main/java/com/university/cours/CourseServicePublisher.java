package com.university.cours;

import com.university.cours.config.MongoDBConfig;
import com.university.cours.service.CourseServiceImpl;
import jakarta.xml.ws.Endpoint;

public class CourseServicePublisher {
    public static void main(String[] args) {
        // Support environment variables for Docker
        String host = System.getenv("SERVICE_HOST");
        if (host == null || host.isEmpty()) {
            host = MongoDBConfig.getProperty("service.host");
        }

        String port = System.getenv("SERVICE_PORT");
        if (port == null || port.isEmpty()) {
            port = MongoDBConfig.getProperty("service.port");
        }

        String path = System.getenv("SERVICE_PATH");
        if (path == null || path.isEmpty()) {
            path = MongoDBConfig.getProperty("service.path");
        }

        String url = "http://" + host + ":" + port + path;

        System.out.println("Starting Course Service...");
        System.out.println("Service URL: " + url);
        System.out.println("WSDL URL: " + url + "?wsdl");

        try {
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
        } catch (Exception e) {
            System.err.println("Failed to start service: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }
}
