package com.abeliangroup.civisight.service;

import com.abeliangroup.civisight.dto.*;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.util.UriBuilder;
import reactor.core.publisher.Mono;

import java.net.URI;
import java.util.Base64;
import java.util.function.Function;

/**
 * Service responsible for communicating with the external API.
 */
@Service
public class AiApiService {
    private static final String SOLIDITY_PATH = "/solidity/report";
    private final WebClient webClient;

    // Use a constant for the property key and default URL
    private static final String API_BASE_URL_PROPERTY = "${external.api.url:http://10.0.10.126:8000}";

    // Updated paths based on user's snippet
    private static final String CLASSIFICATION_PATH = "/classify_report";
    private static final String REPORT_PATH = "/solana/report";
    private static final String VOTE_PATH = "/solana/vote";
    private static final String STATUS_PATH = "/status";

    /**
     * Constructor for Dependency Injection.
     * FIX: Injects the URL property directly and uses WebClient.create(apiUrl) 
     * to guarantee the base URL is set correctly, preventing configuration issues.
     */
    public AiApiService(@Value(API_BASE_URL_PROPERTY) String apiUrl) {
        this.webClient = WebClient.create(apiUrl);
    }

    // --- 1. CLASSIFICATION POST METHOD ---

    public Mono<ClassificationResponse> sendClassificationRequest(String description, byte[] imageBytes) {
        String base64Content = Base64.getEncoder().encodeToString(imageBytes);
        ClassificationRequest requestBody = new ClassificationRequest(description, base64Content);

        return webClient.post()
            .uri(CLASSIFICATION_PATH)
            .bodyValue(requestBody)
            .retrieve()
            .bodyToMono(ClassificationResponse.class)
            .onErrorMap(e -> new ExternalApiException("Failed to communicate with classification API: " + e.getMessage(), e));
    }

    // --- 2. BLOCKCHAIN REPORT POST METHOD ---

    public Mono<BlockchainReportResponse> sendReportToBlockchain(BlockchainReportRequest request) {
        return webClient.post()
            .uri(REPORT_PATH)
            .bodyValue(request)
            .retrieve()
            .bodyToMono(BlockchainReportResponse.class)
            .onErrorMap(e -> new ExternalApiException("Failed to send report to blockchain API: " + e.getMessage(), e));
    }

    // --- 3. BLOCKCHAIN VOTE POST METHOD ---

    public Mono<BlockchainVoteResponse> sendVoteToBlockchain(BlockchainVoteRequest request) {
        return webClient.post()
            .uri(VOTE_PATH)
            .bodyValue(request)
            .retrieve()
            .bodyToMono(BlockchainVoteResponse.class)
            .onErrorMap(e -> new ExternalApiException("Failed to send vote to blockchain API: " + e.getMessage(), e));
    }

    // --- 4. SIMPLE GET METHOD ---

    public Mono<String> getExternalStatus(String identifier) {
        return webClient.get()
            // FIX: Correctly using STATUS_PATH instead of REPORT_PATH
            .uri(uriBuilder -> uriBuilder.path(STATUS_PATH).path("/{identifier}").build(identifier))
            .retrieve()
            .bodyToMono(String.class)
            .onErrorMap(e -> new ExternalApiException("Failed to retrieve external status: " + e.getMessage(), e));
    }

    // --- 5. ANOTHER BLOCKCHAIN POST METHOD
    public Mono<BlockchainSolidityReport> sendSolidity(BlockchainSolidityReport request) {
        return webClient.post()
            .uri(SOLIDITY_PATH)
            .bodyValue(request)
            .retrieve()
            .bodyToMono(BlockchainSolidityReport.class)
            .onErrorMap(e -> new ExternalApiException("Failed to send report to solidity API: " + e.getMessage(), e));
    }

    // --- EXCEPTION CLASS ---

    public static class ExternalApiException extends RuntimeException {
        public ExternalApiException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}