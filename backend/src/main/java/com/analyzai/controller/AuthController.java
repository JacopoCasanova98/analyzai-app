package com.analyzai.controller;

import com.analyzai.dto.LoginRequestDTO;
import com.analyzai.dto.UserRegistrationDTO;
import com.analyzai.model.User;
import com.analyzai.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody UserRegistrationDTO dto) {
        User user = User.builder()
                .email(dto.getEmail())
                .password(dto.getPassword())
                .build();
        userService.register(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequestDTO dto) {
        String token = userService.login(dto.email(), dto.password());
        return ResponseEntity.ok(Map.of("token", token));
    }
}
