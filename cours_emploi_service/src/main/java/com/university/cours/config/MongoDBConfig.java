package com.university.cours.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class MongoDBConfig {
    private static MongoClient mongoClient;
    private static MongoDatabase database;
    private static final Properties properties = new Properties();

    static {
        try (InputStream input = MongoDBConfig.class.getClassLoader()
                .getResourceAsStream("application.properties")) {
            if (input == null) {
                throw new RuntimeException("Unable to find application.properties");
            }
            properties.load(input);
        } catch (IOException ex) {
            throw new RuntimeException("Failed to load application properties", ex);
        }
    }

    public static MongoDatabase getDatabase() {
        if (database == null) {
            String uri = properties.getProperty("mongodb.uri");
            String dbName = properties.getProperty("mongodb.database");
            mongoClient = MongoClients.create(uri);
            database = mongoClient.getDatabase(dbName);
            System.out.println("Connected to MongoDB: " + dbName);
        }
        return database;
    }

    public static String getProperty(String key) {
        return properties.getProperty(key);
    }

    public static void close() {
        if (mongoClient != null) {
            mongoClient.close();
        }
    }
}
