package com.university.cours.security;

import com.university.cours.config.MongoDBConfig;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;

public class JWTValidator {
    private static final String SECRET = MongoDBConfig.getProperty("jwt.secret");

    public static Claims validateToken(String token) {
        try {
            SecretKey key = getSignKey();
            return Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Exception e) {
            throw new SecurityException("Invalid or expired token: " + e.getMessage());
        }
    }

    public static String extractRole(Claims claims) {
        return claims.get("role", String.class);
    }

    public static String extractUsername(Claims claims) {
        return claims.getSubject();
    }

    private static SecretKey getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public static boolean isAdmin(String role) {
        return "ROLE_ADMIN".equals(role);
    }

    public static boolean isAuthenticated(String role) {
        return role != null && (role.equals("ROLE_ADMIN") ||
                role.equals("ROLE_STUDENT") ||
                role.equals("ROLE_PROFESSOR"));
    }
}
