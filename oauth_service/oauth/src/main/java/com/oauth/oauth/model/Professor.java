package com.oauth.oauth.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Document(collection = "professors")
public class Professor extends User {

    private List<Course> courses = new ArrayList<>();
    private List<Grade> grades = new ArrayList<>();
    private List<String> studentIds = new ArrayList<>();
    private List<TimeTableEntry> timeTable = new ArrayList<>();
    private String professorId;
    private String department;
}
