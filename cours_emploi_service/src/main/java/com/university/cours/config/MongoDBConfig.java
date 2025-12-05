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
            // Support environment variable override for Docker
            String uri = System.getenv("MONGODB_URI");
            if (uri == null || uri.isEmpty()) {
                uri = properties.getProperty("mongodb.uri", "mongodb://localhost:27017");
            }

            String dbName = System.getenv("MONGODB_DB_NAME");
            if (dbName == null || dbName.isEmpty()) {
                dbName = properties.getProperty("mongodb.database", "courses_db");
            }

            mongoClient = MongoClients.create(uri);
            database = mongoClient.getDatabase(dbName);
            System.out.println("Connected to MongoDB: " + dbName + " at " + uri);
        }
        return database;
    }

    public static String getProperty(String key) {
        // Check environment variable first (uppercase with underscores)
        String envKey = key.replace(".", "_").toUpperCase();
        String envValue = System.getenv(envKey);
        if (envValue != null && !envValue.isEmpty()) {
            return envValue;
        }
        return properties.getProperty(key);
    }

    public static void close() {
        if (mongoClient != null) {
            mongoClient.close();
        }
    }
}
