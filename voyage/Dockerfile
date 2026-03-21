# Use Java 17
FROM eclipse-temurin:17-jdk-alpine

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Build the project
RUN ./mvnw clean package || mvn clean package

# Run the jar file
CMD ["java", "-jar", "target/voyage-0.0.1-SNAPSHOT.jar"]