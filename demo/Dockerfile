# Stage 1 — Build using Maven wrapper
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Install Maven directly — no need for mvnw
RUN apk add --no-cache maven

# Copy pom.xml first for dependency caching
COPY pom.xml .
RUN mvn dependency:resolve -q

# Copy source code and build
COPY src src
RUN mvn clean package -DskipTests

# Stage 2 — Run the JAR
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]