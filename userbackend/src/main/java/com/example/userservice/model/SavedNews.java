package com.example.userservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "saved_news")
public class SavedNews {
    @Id
    private String id;
    private String newsId;
    private String title;
    private String description;
    private String link;
    private String imageUrl;
    private String sourceId;
    private String pubDate;
    private String genre;
    private String savedAt;

    @DBRef
    private User user;
}