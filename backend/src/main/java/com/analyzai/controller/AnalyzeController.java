package com.analyzai.controller;

import com.analyzai.dto.AnalysisDTO;
import com.analyzai.mapper.AnalysisMapper;
import com.analyzai.model.User;
import com.analyzai.repository.UserRepository;
import com.analyzai.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analyze")
@RequiredArgsConstructor
public class AnalyzeController {

    private final AiService aiService;
    private final UserRepository userRepository;

    @PostMapping
    public Map<String, Object> analyzeText(@RequestBody Map<String, String> request) {
        String text = request.get("text");
        return aiService.analyzeText(text);
    }

    @GetMapping("/history")
    public List<AnalysisDTO> getHistory(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        return user.getAnalyses().stream()
                .map(AnalysisMapper::toDTO)
                .toList();
    }
}
