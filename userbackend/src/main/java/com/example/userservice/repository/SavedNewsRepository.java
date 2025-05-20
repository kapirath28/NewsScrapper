package com.example.userservice.repository;

import com.example.userservice.model.SavedNews;
import com.example.userservice.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SavedNewsRepository extends MongoRepository<SavedNews, String> {
    List<SavedNews> findByUser(User user);

    void deleteByUserAndNewsId(User user, String newsId);
}