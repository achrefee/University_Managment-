package com.oauth.oauth.controller;

import com.oauth.oauth.model.Professor;
import com.oauth.oauth.repository.ProfessorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professor")
public class ProfessorController {

    private final ProfessorRepository professorRepository;

    public ProfessorController(ProfessorRepository professorRepository) {
        this.professorRepository = professorRepository;
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<Professor> getProfessorProfile(@RequestParam String email) {
        Professor professor = professorRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Professor not found"));
        return ResponseEntity.ok(professor);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Professor>> getAllProfessors() {
        List<Professor> professors = professorRepository.findAll();
        return ResponseEntity.ok(professors);
    }

    @GetMapping("/{professorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public ResponseEntity<Professor> getProfessorByProfessorId(@PathVariable String professorId) {
        Professor professor = professorRepository.findByProfessorId(professorId)
                .orElseThrow(() -> new RuntimeException("Professor not found"));
        return ResponseEntity.ok(professor);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR')")
    public ResponseEntity<Professor> updateProfessor(@PathVariable String id, @RequestBody Professor professor) {
        Professor existingProfessor = professorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Professor not found"));

        existingProfessor.setCourses(professor.getCourses());
        existingProfessor.setGrades(professor.getGrades());
        existingProfessor.setStudentIds(professor.getStudentIds());
        existingProfessor.setTimeTable(professor.getTimeTable());
        existingProfessor.setDepartment(professor.getDepartment());

        Professor updatedProfessor = professorRepository.save(existingProfessor);
        return ResponseEntity.ok(updatedProfessor);
    }
}
