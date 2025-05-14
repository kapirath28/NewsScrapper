package com.example.userservice.controller;

import com.example.userservice.model.User;
import com.example.userservice.model.SavedNews;
import com.example.userservice.repository.UserRepository;
import com.example.userservice.repository.SavedNewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend requests
public class UserController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SavedNewsRepository savedNewsRepository;

    // User profile CRUD
    @GetMapping("/profile/{id}")
    public ResponseEntity<User> getProfile(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/profile")
    public User createProfile(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<User> updateProfile(@PathVariable Long id, @RequestBody User user) {
        return userRepository.findById(id).map(existing -> {
            existing.setUsername(user.getUsername());
            existing.setEmail(user.getEmail());
            existing.setPassword(user.getPassword());
            return ResponseEntity.ok(userRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/profile/{id}")
    public ResponseEntity<Void> deleteProfile(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Home page: fetch news from Node.js backend
    @GetMapping("/home")
    public Object getHomeNews() {
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://localhost:3000/news";
        return restTemplate.getForObject(url, Object.class);
    }

    // Save news for user
    @PostMapping("/save/{userId}")
    public ResponseEntity<SavedNews> saveNews(@PathVariable Long userId, @RequestBody SavedNews news) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty())
            return ResponseEntity.notFound().build();
        news.setUser(userOpt.get());
        return ResponseEntity.ok(savedNewsRepository.save(news));
    }

    // Get saved news for user
    @GetMapping("/save/{userId}")
    public List<SavedNews> getSavedNews(@PathVariable Long userId) {
        return userRepository.findById(userId)
                .map(savedNewsRepository::findByUser)
                .orElse(List.of());
    }

    // Delete saved news for user
    @DeleteMapping("/save/{userId}/{newsId}")
    public ResponseEntity<Void> deleteSavedNews(@PathVariable Long userId, @PathVariable String newsId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty())
            return ResponseEntity.notFound().build();
        savedNewsRepository.deleteByUserAndNewsId(userOpt.get(), newsId);
        return ResponseEntity.ok().build();
    }
}