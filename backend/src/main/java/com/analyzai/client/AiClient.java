package com.analyzai.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Component
public class AiClient {

    private final RestTemplate restTemplate;
    private final String aiServiceUrl;

    public AiClient(@Value("${ai.service.url:http://python-ai:8000/analyze}") String aiServiceUrl) {
        this.restTemplate = new RestTemplate();
        this.aiServiceUrl = aiServiceUrl;
    }

    public Map<String, Object> analyze(String text) {
        Map<String, String> request = Map.of("text", text);
        return restTemplate.postForObject(aiServiceUrl, request, Map.class);
    }
}

