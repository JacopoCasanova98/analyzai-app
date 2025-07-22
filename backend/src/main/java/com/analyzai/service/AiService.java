package com.analyzai.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
public class AiService {

    private final WebClient aiWebClient;

    @Autowired
    public AiService(WebClient aiWebClient) {
        this.aiWebClient = aiWebClient;
    }

    public Mono<Map<String, Object>> analyzeText(String text) {
        return aiWebClient.post()
                .uri("/analyze")
                .bodyValue(Map.of("text", text))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {});
    }

}
