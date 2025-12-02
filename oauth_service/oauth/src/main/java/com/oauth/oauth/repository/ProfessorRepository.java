package com.oauth.oauth.repository;

import com.oauth.oauth.model.Professor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfessorRepository extends MongoRepository<Professor, String> {
    Optional<Professor> findByEmail(String email);

    Optional<Professor> findByProfessorId(String professorId);
}
