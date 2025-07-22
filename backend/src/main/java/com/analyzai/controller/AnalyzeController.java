package com.analyzai.controller;

import com.analyzai.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import java.util.Map;

@RestController
@RequestMapping("/api/analyze")
public class AnalyzeController {

    private final AiService aiService;

    @Autowired
    public AnalyzeController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping
    public Mono<Map<String, Object>> analyzeText(@RequestBody Map<String, String> request) {
        String text = request.get("text");
        return aiService.analyzeText(text);
    }
}
