package com.example.userservice.controller;

import com.example.userservice.model.User;
import com.example.userservice.model.SavedNews;
import com.example.userservice.repository.UserRepository;
import com.example.userservice.repository.SavedNewsRepository;
import com.example.userservice.service.UserService;
import com.example.userservice.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend requests
public class UserController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SavedNewsRepository savedNewsRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private JwtService jwtService;

    private boolean validateToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtService.isTokenValid(token);
        }
        return false;
    }

    private String extractUserId(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtService.extractUserId(token);
        }
        return null;
    }

    // User profile CRUD
    @GetMapping("/profile/{id}")
    public ResponseEntity<User> getProfile(@PathVariable String id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (!validateToken(authHeader)) {
            return ResponseEntity.status(401).build();
        }
        return userService.getUserById(id)
                .map(user -> {
                    user.setPassword(null);
                    return ResponseEntity.ok(user);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/profile")
    public ResponseEntity<?> createProfile(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            String token = jwtService.generateToken(createdUser.getId(), createdUser.getEmail());
            createdUser.setPassword(null);

            Map<String, Object> response = new HashMap<>();
            response.put("user", createdUser);
            response.put("token", token);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateProfile(
            @PathVariable String id,
            @RequestBody User user,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (!validateToken(authHeader)) {
            return ResponseEntity.status(401).build();
        }
        try {
            User updatedUser = userService.updateUser(id, user);
            updatedUser.setPassword(null);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/profile/{id}")
    public ResponseEntity<Void> deleteProfile(
            @PathVariable String id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (!validateToken(authHeader)) {
            return ResponseEntity.status(401).build();
        }
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Home page: fetch news from Node.js backend
    @GetMapping("/home")
    public ResponseEntity<?> getHomeNews(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (!validateToken(authHeader)) {
            return ResponseEntity.status(401).build();
        }
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://localhost:3000/news";
        return ResponseEntity.ok(restTemplate.getForObject(url, Object.class));
    }

    // Save news for user
    @PostMapping("/save/{userId}")
    public ResponseEntity<SavedNews> saveNews(
            @PathVariable String userId,
            @RequestBody SavedNews news,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (!validateToken(authHeader)) {
            return ResponseEntity.status(401).build();
        }
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty())
            return ResponseEntity.notFound().build();
        news.setUser(userOpt.get());
        return ResponseEntity.ok(savedNewsRepository.save(news));
    }

    // Get saved news for user
    @GetMapping("/save/{userId}")
    public ResponseEntity<?> getSavedNews(
            @PathVariable String userId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (!validateToken(authHeader)) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(userRepository.findById(userId)
                .map(savedNewsRepository::findByUser)
                .orElse(List.of()));
    }

    // Delete saved news for user
    @DeleteMapping("/save/{userId}/{newsId}")
    public ResponseEntity<Void> deleteSavedNews(
            @PathVariable String userId,
            @PathVariable String newsId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (!validateToken(authHeader)) {
            return ResponseEntity.status(401).build();
        }
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty())
            return ResponseEntity.notFound().build();
        savedNewsRepository.deleteByUserAndNewsId(userOpt.get(), newsId);
        return ResponseEntity.ok().build();
    }

    // Add login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");

            if (email == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
            }

            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent() && userService.verifyPassword(password, userOpt.get().getPassword())) {
                User user = userOpt.get();
                user.setPassword(null); // Remove password before sending

                // Generate JWT token
                String token = jwtService.generateToken(user.getId(), user.getEmail());

                Map<String, Object> response = new HashMap<>();
                response.put("user", user);
                response.put("token", token);

                return ResponseEntity.ok(response);
            }
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Login failed"));
        }
    }
}