package com.example.aireformatter.controller;

import com.example.aireformatter.model.User;
import com.example.aireformatter.repository.UserRepository;
import com.example.aireformatter.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:4200", "https://code-reformatter.vercel.app"})
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    // Register new user
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String email    = body.get("email");
        String password = body.get("password");

        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Username already taken"));
        }
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Email already registered"));
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);

        String token = jwtService.generateToken(username);
        return ResponseEntity.ok(Map.of(
            "token", token,
            "username", username,
            "message", "Registration successful"
        ));
    }

    // Login existing user
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    body.get("username"),
                    body.get("password")
                )
            );
            String token = jwtService.generateToken(auth.getName());
            return ResponseEntity.ok(Map.of(
                "token", token,
                "username", auth.getName(),
                "message", "Login successful"
            ));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401)
                .body(Map.of("error", "Invalid username or password"));
        }
    }
}