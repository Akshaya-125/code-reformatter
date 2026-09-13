# Stage 1 — Build the JAR using Maven
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copy Maven files
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies first (faster rebuilds)
RUN ./mvnw dependency:resolve -q

# Copy source code
COPY src src

# Build the JAR
RUN ./mvnw clean package -DskipTests

# Stage 2 — Run the JAR
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]