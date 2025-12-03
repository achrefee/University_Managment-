package com.oauth.oauth.service;

import com.oauth.oauth.dto.AuthResponse;
import com.oauth.oauth.dto.LoginRequest;
import com.oauth.oauth.dto.RegisterRequest;
import com.oauth.oauth.model.Admin;
import com.oauth.oauth.model.Professor;
import com.oauth.oauth.model.Student;
import com.oauth.oauth.model.User;
import com.oauth.oauth.model.enums.UserRole;
import com.oauth.oauth.repository.AdminRepository;
import com.oauth.oauth.repository.ProfessorRepository;
import com.oauth.oauth.repository.StudentRepository;
import com.oauth.oauth.repository.UserRepository;
import com.oauth.oauth.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final ProfessorRepository professorRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(
            UserRepository userRepository,
            StudentRepository studentRepository,
            ProfessorRepository professorRepository,
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.professorRepository = professorRepository;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user;
        UserRole role = UserRole.valueOf(request.getRole().toUpperCase());

        switch (role) {
            case STUDENT -> {
                Student student = new Student();
                student.setFirstName(request.getFirstName());
                student.setLastName(request.getLastName());
                student.setEmail(request.getEmail());
                student.setPhoneNumber(request.getPhoneNumber());
                student.setPassword(passwordEncoder.encode(request.getPassword()));
                student.setRole(UserRole.STUDENT);
                student.setStudentId(request.getStudentId());
                user = studentRepository.save(student);
            }
            case PROFESSOR -> {
                Professor professor = new Professor();
                professor.setFirstName(request.getFirstName());
                professor.setLastName(request.getLastName());
                professor.setEmail(request.getEmail());
                professor.setPhoneNumber(request.getPhoneNumber());
                professor.setPassword(passwordEncoder.encode(request.getPassword()));
                professor.setRole(UserRole.PROFESSOR);
                professor.setProfessorId(request.getProfessorId());
                professor.setDepartment(request.getDepartment());
                user = professorRepository.save(professor);
            }
            case ADMIN -> {
                Admin admin = new Admin();
                admin.setFirstName(request.getFirstName());
                admin.setLastName(request.getLastName());
                admin.setEmail(request.getEmail());
                admin.setPhoneNumber(request.getPhoneNumber());
                admin.setPassword(passwordEncoder.encode(request.getPassword()));
                admin.setRole(UserRole.ADMIN);
                admin.setAdminId(request.getAdminId());
                admin.setDepartment(request.getDepartment());
                user = adminRepository.save(admin);
            }
            default -> throw new RuntimeException("Invalid role");
        }

        String token = jwtUtil.generateToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .userId(user.getId())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .userId(user.getId())
                .build();
    }

    public AuthResponse refreshToken(String refreshToken) {
        String userEmail = jwtUtil.extractUsername(refreshToken);
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (jwtUtil.validateToken(refreshToken, user)) {
            String newToken = jwtUtil.generateToken(user);
            String newRefreshToken = jwtUtil.generateRefreshToken(user);

            return AuthResponse.builder()
                    .token(newToken)
                    .refreshToken(newRefreshToken)
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .role(user.getRole())
                    .userId(user.getId())
                    .build();
        }

        throw new RuntimeException("Invalid refresh token");
    }

    public AuthResponse validateToken(String token) {
        String userEmail = jwtUtil.extractUsername(token);
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (jwtUtil.validateToken(token, user)) {
            return AuthResponse.builder()
                    .token(token)
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .role(user.getRole())
                    .userId(user.getId())
                    .build();
        }

        throw new RuntimeException("Invalid token");
    }
}
