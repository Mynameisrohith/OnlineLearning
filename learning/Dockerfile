FROM eclipse-temurin:25-jdk

WORKDIR /app

COPY target/learning-0.0.1-SNAPSHOT.war app.war

EXPOSE 8040

CMD ["java", "-jar", "app.war"]