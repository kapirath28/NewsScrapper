package com.example.userservice.repository;

import com.example.userservice.model.SavedNews;
import com.example.userservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SavedNewsRepository extends JpaRepository<SavedNews, Long> {
    List<SavedNews> findByUser(User user);

    void deleteByUserAndNewsId(User user, String newsId);
}