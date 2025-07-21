package com.analyzai.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AnalyzeController {

    @PostMapping("/analyze")
    public String analyzeText(@RequestBody String text) {
        return "{\"emotion\": \"neutral\"}";
    }
}
