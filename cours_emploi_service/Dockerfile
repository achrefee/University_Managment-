# Course Service Dockerfile (JAX-WS SOAP)
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Copy Maven files
COPY pom.xml .

# Install Maven
RUN apk add --no-cache maven

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build with dependencies
RUN mvn clean package -DskipTests && \
    mvn dependency:copy-dependencies -DoutputDirectory=target/dependency

# Runtime stage
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy compiled classes and dependencies
COPY --from=builder /app/target/classes ./classes
COPY --from=builder /app/target/dependency ./lib

# Expose port
EXPOSE 8082

# Run application
ENTRYPOINT ["java", "-cp", "classes:lib/*", "com.university.cours.CourseServicePublisher"]
