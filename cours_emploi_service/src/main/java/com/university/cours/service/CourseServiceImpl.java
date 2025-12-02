package com.university.cours.service;

import com.university.cours.dto.CourseDTO;
import com.university.cours.dto.TimeSlotDTO;
import com.university.cours.model.Course;
import com.university.cours.model.TimeSlot;
import com.university.cours.repository.CourseRepository;
import com.university.cours.security.JWTValidator;
import io.jsonwebtoken.Claims;
import jakarta.jws.WebService;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@WebService(endpointInterface = "com.university.cours.service.ICourseService")
public class CourseServiceImpl implements ICourseService {

    private final CourseRepository repository = new CourseRepository();

    @Override
    public List<CourseDTO> getAllCourses(String token) {
        validateAuthentication(token);
        return repository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CourseDTO> getActiveCourses(String token) {
        validateAuthentication(token);
        return repository.findActive().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CourseDTO getCourseById(String token, String id) {
        validateAuthentication(token);
        Course course = repository.findById(id);
        if (course == null) {
            throw new RuntimeException("Course not found with id: " + id);
        }
        return toDTO(course);
    }

    @Override
    public CourseDTO getCourseByCourseId(String token, String courseId) {
        validateAuthentication(token);
        Course course = repository.findByCourseId(courseId);
        if (course == null) {
            throw new RuntimeException("Course not found with courseId: " + courseId);
        }
        return toDTO(course);
    }

    @Override
    public CourseDTO createCourse(String token, CourseDTO courseDTO) {
        validateAdminAccess(token);

        // Check if course ID already exists
        if (repository.findByCourseId(courseDTO.getCourseId()) != null) {
            throw new RuntimeException("Course with courseId " + courseDTO.getCourseId() + " already exists");
        }

        Course course = toEntity(courseDTO);
        Course savedCourse = repository.save(course);
        return toDTO(savedCourse);
    }

    @Override
    public CourseDTO updateCourse(String token, String id, CourseDTO courseDTO) {
        validateAdminAccess(token);

        Course existingCourse = repository.findById(id);
        if (existingCourse == null) {
            throw new RuntimeException("Course not found with id: " + id);
        }

        Course course = toEntity(courseDTO);
        Course updatedCourse = repository.update(id, course);
        return toDTO(updatedCourse);
    }

    @Override
    public boolean deleteCourse(String token, String id) {
        validateAdminAccess(token);

        Course existingCourse = repository.findById(id);
        if (existingCourse == null) {
            throw new RuntimeException("Course not found with id: " + id);
        }

        return repository.delete(id);
    }

    @Override
    public CourseDTO deactivateCourse(String token, String id) {
        validateAdminAccess(token);

        Course course = repository.findById(id);
        if (course == null) {
            throw new RuntimeException("Course not found with id: " + id);
        }

        course.setActive(false);
        Course updatedCourse = repository.save(course);
        return toDTO(updatedCourse);
    }

    // Security validation methods
    private void validateAuthentication(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new SecurityException("Authentication token is required");
        }

        try {
            Claims claims = JWTValidator.validateToken(token);
            String role = JWTValidator.extractRole(claims);

            if (!JWTValidator.isAuthenticated(role)) {
                throw new SecurityException("Invalid user role");
            }
        } catch (Exception e) {
            throw new SecurityException("Authentication failed: " + e.getMessage());
        }
    }

    private void validateAdminAccess(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new SecurityException("Authentication token is required");
        }

        try {
            Claims claims = JWTValidator.validateToken(token);
            String role = JWTValidator.extractRole(claims);

            if (!JWTValidator.isAdmin(role)) {
                throw new SecurityException("Access denied. Admin privileges required.");
            }
        } catch (SecurityException e) {
            throw e;
        } catch (Exception e) {
            throw new SecurityException("Authentication failed: " + e.getMessage());
        }
    }

    // Conversion methods
    private CourseDTO toDTO(Course course) {
        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId() != null ? course.getId().toString() : null);
        dto.setCourseId(course.getCourseId());
        dto.setCourseName(course.getCourseName());
        dto.setCourseCode(course.getCourseCode());
        dto.setCredits(course.getCredits());
        dto.setDescription(course.getDescription());
        dto.setProfessorId(course.getProfessorId());
        dto.setProfessorName(course.getProfessorName());
        dto.setMaxStudents(course.getMaxStudents());
        dto.setEnrolledStudents(course.getEnrolledStudents());
        dto.setSemester(course.getSemester());
        dto.setActive(course.isActive());

        List<TimeSlotDTO> timeSlotDTOs = course.getTimeSlots().stream()
                .map(this::timeSlotToDTO)
                .collect(Collectors.toList());
        dto.setTimeSlots(timeSlotDTOs);

        return dto;
    }

    private Course toEntity(CourseDTO dto) {
        Course course = new Course();
        course.setCourseId(dto.getCourseId());
        course.setCourseName(dto.getCourseName());
        course.setCourseCode(dto.getCourseCode());
        course.setCredits(dto.getCredits());
        course.setDescription(dto.getDescription());
        course.setProfessorId(dto.getProfessorId());
        course.setProfessorName(dto.getProfessorName());
        course.setMaxStudents(dto.getMaxStudents());
        course.setEnrolledStudents(dto.getEnrolledStudents());
        course.setSemester(dto.getSemester());
        course.setActive(dto.isActive());

        List<TimeSlot> timeSlots = dto.getTimeSlots().stream()
                .map(this::dtoToTimeSlot)
                .collect(Collectors.toList());
        course.setTimeSlots(timeSlots);

        return course;
    }

    private TimeSlotDTO timeSlotToDTO(TimeSlot timeSlot) {
        TimeSlotDTO dto = new TimeSlotDTO();
        dto.setDayOfWeek(timeSlot.getDayOfWeek());
        dto.setStartTime(timeSlot.getStartTime());
        dto.setEndTime(timeSlot.getEndTime());
        dto.setRoom(timeSlot.getRoom());
        return dto;
    }

    private TimeSlot dtoToTimeSlot(TimeSlotDTO dto) {
        TimeSlot timeSlot = new TimeSlot();
        timeSlot.setDayOfWeek(dto.getDayOfWeek());
        timeSlot.setStartTime(dto.getStartTime());
        timeSlot.setEndTime(dto.getEndTime());
        timeSlot.setRoom(dto.getRoom());
        return timeSlot;
    }
}
