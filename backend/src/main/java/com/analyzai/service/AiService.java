package com.analyzai.service;

import com.analyzai.client.AiClient;
import com.analyzai.dto.AnalysisDTO;
import com.analyzai.mapper.AnalysisMapper;
import com.analyzai.model.Analysis;
import com.analyzai.model.User;
import com.analyzai.repository.AnalysisRepository;
import com.analyzai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiService {

    private final AnalysisRepository analysisRepository;
    private final UserRepository userRepository;
    private final AiClient aiClient;

    public Map<String, Object> analyzeText(String text) {
        Map<String, Object> response = aiClient.analyze(text);
        saveAnalysis(text, response);
        return response;
    }

    private void saveAnalysis(String text, Map<String, Object> aiResponse) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User user = null;
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            String email = auth.getName();
            user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
        }

        AnalysisDTO dto = new AnalysisDTO(
                null,
                text,
                (String) aiResponse.get("emotion"),
                Double.parseDouble(aiResponse.get("confidence").toString()),
                LocalDateTime.now(),
                user != null ? user.getId() : null
        );

        Analysis analysis = AnalysisMapper.fromDTO(dto, user);
        analysisRepository.save(analysis);
    }
}
