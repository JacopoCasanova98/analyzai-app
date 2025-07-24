package com.analyzai.dto;

import java.time.LocalDateTime;

public record AnalysisDTO(
        Long id,
        String text,
        String emotion,
        double confidence,
        LocalDateTime createdAt,
        Long userId
) {}
