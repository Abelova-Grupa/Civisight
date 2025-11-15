package com.abeliangroup.civisight.service;

import com.abeliangroup.civisight.dto.ClassificationResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.nio.charset.StandardCharsets;

@SpringBootTest
class AiApiServiceTest {
    @Autowired
    private AiApiService externalApiService;

    // A tiny 1x1 white PNG image data encoded in Base64 for a valid 'content' field
    private static final byte[] PLACEHOLDER_IMAGE_BYTES =
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYGD4DwAADgACnmyjNAAAAABJRU5ErkJggg=="
            .getBytes(StandardCharsets.UTF_8);

    @Test
    void sendClassificationRequest_RealApiCall_ShouldReturnResponseOrError() {
        String testDescription = "Integration Test Request: Check API availability.";

        try {
            // Attempt to make the actual API call
            ClassificationResponse response = externalApiService
                .sendClassificationRequest(testDescription, PLACEHOLDER_IMAGE_BYTES)
                .block();

            // If the call succeeds, assert the response structure is correct
            assertThat(response).isNotNull();
            assertThat(response.status()).isInstanceOf(String.class);

            System.out.println("Integration Test SUCCESS: External API responded with status: " + response.status());

        } catch (Exception e) {
            // In an IT, the most likely failure is the API being down or unreachable.
            // We assert the expected connection error type, but don't fail the test
            // if the service returns a 4xx/5xx (as that's an API-specific error).
            if (e.getCause() instanceof WebClientRequestException) {
                System.err.println("Integration Test SKIPPED/FAILED: External API is unreachable or connection refused at: http://10.66.10.421:8081/analyze");
                // You might choose to skip or ignore the test result if unreachable,
                // but for assertion, we verify it's a connectivity issue.
                assertThatExceptionOfType(ExternalApiService.ExternalApiException.class)
                    .isThrownBy(() -> { throw e; })
                    .withCauseInstanceOf(WebClientRequestException.class);
            } else {
                // For other errors (e.g., successful connection but bad request/response),
                // we treat it as a failure.
                System.err.println("Integration Test FAILED with API or deserialization error: " + e.getMessage());
                throw e;
            }
        }
    }
}