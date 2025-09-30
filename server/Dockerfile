# ---- Stage 1: Build the application ----
    FROM eclipse-temurin:21-jdk AS build

    WORKDIR /app
    
    # Copy only Maven wrapper + pom.xml first (for caching deps)
    COPY mvnw pom.xml ./
    COPY .mvn .mvn
    
    # Download dependencies (layer will be cached until pom.xml changes)
    RUN ./mvnw dependency:go-offline
    
    # Now copy source code
    COPY src src
    
    # Build app (skip tests for speed in CI)
    RUN ./mvnw clean package -DskipTests
    
    
    # ---- Stage 2: Create minimal runtime image ----
    FROM eclipse-temurin:21-jre
    
    WORKDIR /app
    
    # Copy only the fat JAR from the build stage
    COPY --from=build /app/target/*.jar app.jar
    
    # Expose Spring Boot default port
    EXPOSE 8080
    
    # Run the app
    ENTRYPOINT ["java", "-jar", "app.jar"]
    