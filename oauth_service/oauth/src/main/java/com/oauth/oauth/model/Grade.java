package com.oauth.oauth.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Grade {
    private String courseId;
    private String courseName;
    private Double grade;
    private String semester;
}
