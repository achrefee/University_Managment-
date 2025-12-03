package com.oauth.oauth.model;

import com.oauth.oauth.model.enums.PaymentStatus;
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
public class Student extends User {

    private List<Course> courses = new ArrayList<>();
    private List<Grade> grades = new ArrayList<>();
    private List<TimeTableEntry> timeTable = new ArrayList<>();
    private PaymentStatus inscriptionFeeStatus = PaymentStatus.NOT_PAID;
    private String studentId;
}
