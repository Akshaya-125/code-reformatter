package com.example.aireformatter.controller;

import com.example.aireformatter.dto.ReformatRequest;
import com.example.aireformatter.dto.ReformatResponse;
import com.example.aireformatter.model.ReformatHistory;
import com.example.aireformatter.model.User;
import com.example.aireformatter.repository.HistoryRepository;
import com.example.aireformatter.repository.UserRepository;
import com.example.aireformatter.service.ReformatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:4200", "https://code-reformatter.vercel.app"})
public class ReformatController {

    @Autowired
    private ReformatService reformatService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HistoryRepository historyRepository;

    // Main reformat endpoint — Angular calls this
    @PostMapping("/reformat")
    public ResponseEntity<?> reformat(
            @RequestBody ReformatRequest request,
            Authentication authentication) {
        try {
            // Call Django AI service
            ReformatResponse response = reformatService.reformat(request);

            // Save to history if user is logged in
            if (authentication != null) {
                userRepository.findByUsername(authentication.getName())
                    .ifPresent(user -> saveHistory(user, request, response));
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // Get history for logged in user
    @GetMapping("/history")
    public ResponseEntity<?> getHistory(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("{\"error\": \"Not logged in\"}");
        }
        return userRepository.findByUsername(authentication.getName())
            .map(user -> ResponseEntity.ok(historyRepository.findByUserOrderByCreatedAtDesc(user)))
            .orElse(ResponseEntity.notFound().build());
    }

    // Health check
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok("{\"status\": \"Spring Boot running\"}");
    }

    private void saveHistory(User user, ReformatRequest req, ReformatResponse res) {
        ReformatHistory history = new ReformatHistory();
        history.setUser(user);
        history.setInputCode(req.getCode());
        history.setOutputCode(res.getReformattedCode());
        history.setLanguage(req.getLanguage());
        history.setMode(req.getMode());
        history.setReductionPercent(res.getReductionPercent());
        historyRepository.save(history);
    }
}