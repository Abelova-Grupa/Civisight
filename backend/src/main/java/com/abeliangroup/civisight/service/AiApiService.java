package com.abeliangroup.civisight.service;

import com.abeliangroup.civisight.dto.ClassificationRequest;
import com.abeliangroup.civisight.dto.ClassificationResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.beans.factory.annotation.Value;
import reactor.core.publisher.Mono;
import java.util.Base64;

/**
 * Service responsible for communicating with the external API.
 */
@Service
public class AiApiService {

    private final WebClient webClient;

    // The base URL for the external API, injected from application properties
    @Value("${external.api.url:http://10.0.10.126:8000/classify_report}")
    private String apiUrl;

    /**
     * Constructor for Dependency Injection.
     * @param webClient A WebClient instance, typically configured by Spring Boot.
     */
    public AiApiService(WebClient webClient) {
        this.webClient = webClient;
    }

    /**
     * Processes the input (description and image bytes) and sends the request
     * to the external classification API.
     * * @param description The text description to send.
     * @param imageBytes The raw bytes of the image file.
     * @return A Mono emitting the ExternalResponse DTO upon successful processing.
     */
    public Mono<ClassificationResponse> sendClassificationRequest(String description, byte[] imageBytes) {

        // 1. Convert image bytes to Base64 String as required by the DTO contract
        String base64Content = Base64.getEncoder().encodeToString(imageBytes);

        // 2. Create the request body DTO
        ClassificationRequest requestBody = new ClassificationRequest(description, base64Content);

        // 3. Make the non-blocking HTTP POST request using WebClient
        return webClient.post()
            .uri(apiUrl)
            .bodyValue(requestBody)
            .retrieve()

            // Handle success (2xx response)
            .bodyToMono(ClassificationResponse.class)

            // Handle API-specific errors (e.g., 4xx, 5xx)
            .onErrorMap(e -> new ExternalApiException("Failed to communicate with external API: " + e.getMessage(), e));
    }

    // --- Helper classes for clean exception handling and WebClient configuration ---

    /**
     * A custom unchecked exception for API communication failures.
     */
    public static class ExternalApiException extends RuntimeException {
        public ExternalApiException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}