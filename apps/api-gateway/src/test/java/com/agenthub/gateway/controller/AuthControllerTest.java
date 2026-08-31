package com.agenthub.gateway.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.reactive.server.WebTestClient;

@SpringBootTest
@AutoConfigureWebTestClient
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired
    private WebTestClient webTestClient;

    @Test
    void loginShouldReturnJwtToken() {
        webTestClient.post()
            .uri("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue("{\"username\":\"admin\",\"password\":\"admin123\"}")
            .exchange()
            .expectStatus().isOk()
            .expectHeader().exists(HttpHeaders.AUTHORIZATION)
            .expectBody()
            .jsonPath("$.token").isNotEmpty();
    }

    @Test
    void protectedEndpointShouldRequireAuthorizationHeader() {
        webTestClient.get()
            .uri("/api/protected")
            .exchange()
            .expectStatus().isUnauthorized();
    }
}
