package com.university.cours.security;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class JWTValidator {
    private static final String OAUTH_SERVICE_URL = "http://localhost:8081";

    public static class UserInfo {
        public String token;
        public String email;
        public String firstName;
        public String lastName;
        public String role;
        public String userId;
    }

    public static UserInfo validateToken(String token) {
        try {
            String encodedToken = URLEncoder.encode(token, StandardCharsets.UTF_8.toString());
            URL url = new URL(OAUTH_SERVICE_URL + "/api/auth/validate?token=" + encodedToken);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(10000);
            conn.setReadTimeout(10000);

            int responseCode = conn.getResponseCode();
            if (responseCode == 200) {
                BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                StringBuilder response = new StringBuilder();
                String inputLine;
                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                in.close();

                return parseJson(response.toString());
            } else {
                throw new SecurityException("Invalid or expired token");
            }
        } catch (Exception e) {
            throw new SecurityException("Token validation failed: " + e.getMessage());
        }
    }

    private static UserInfo parseJson(String json) {
        UserInfo userInfo = new UserInfo();
        userInfo.token = extractJsonValue(json, "token");
        userInfo.email = extractJsonValue(json, "email");
        userInfo.firstName = extractJsonValue(json, "firstName");
        userInfo.lastName = extractJsonValue(json, "lastName");
        userInfo.role = extractJsonValue(json, "role");
        userInfo.userId = extractJsonValue(json, "userId");
        return userInfo;
    }

    private static String extractJsonValue(String json, String key) {
        // Pattern to match "key":"value" or "key":null
        Pattern pattern = Pattern.compile("\"" + key + "\"\\s*:\\s*(?:\"([^\"]*)\"|null)");
        Matcher matcher = pattern.matcher(json);
        if (matcher.find()) {
            return matcher.group(1); // Returns null if the match was for null
        }
        return null;
    }

    public static String extractRole(UserInfo userInfo) {
        return userInfo.role;
    }

    public static String extractUsername(UserInfo userInfo) {
        return userInfo.email;
    }

    public static boolean isAdmin(String role) {
        return "ROLE_ADMIN".equals(role) || "ADMIN".equals(role);
    }

    public static boolean isAuthenticated(String role) {
        return role != null && (role.equals("ROLE_ADMIN") || role.equals("ADMIN") ||
                role.equals("ROLE_STUDENT") || role.equals("STUDENT") ||
                role.equals("ROLE_PROFESSOR") || role.equals("PROFESSOR"));
    }
}
