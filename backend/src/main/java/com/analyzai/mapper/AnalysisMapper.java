package com.analyzai.mapper;

import com.analyzai.dto.AnalysisDTO;
import com.analyzai.model.Analysis;
import com.analyzai.model.User;

public class AnalysisMapper {

    public static Analysis fromDTO(AnalysisDTO dto, User user) {
        return Analysis.builder()
                .id(dto.id())
                .text(dto.text())
                .emotion(dto.emotion())
                .confidence(dto.confidence())
                .createdAt(dto.createdAt())
                .user(user)
                .build();
    }


    public static AnalysisDTO toDTO(Analysis analysis) {
        return new AnalysisDTO(
                analysis.getId(),
                analysis.getText(),
                analysis.getEmotion(),
                analysis.getConfidence(),
                analysis.getCreatedAt(),
                analysis.getUser() != null ? analysis.getUser().getId() : null
        );
    }
}

