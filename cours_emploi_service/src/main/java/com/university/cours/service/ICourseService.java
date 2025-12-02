package com.university.cours.service;

import com.university.cours.dto.CourseDTO;
import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebService;

import java.util.List;

@WebService
public interface ICourseService {

    /**
     * Get all courses (accessible by all authenticated users)
     */
    @WebMethod
    List<CourseDTO> getAllCourses(@WebParam(name = "token") String token);

    /**
     * Get active courses only (accessible by all authenticated users)
     */
    @WebMethod
    List<CourseDTO> getActiveCourses(@WebParam(name = "token") String token);

    /**
     * Get course by ID (accessible by all authenticated users)
     */
    @WebMethod
    CourseDTO getCourseById(
            @WebParam(name = "token") String token,
            @WebParam(name = "id") String id);

    /**
     * Get course by course ID (accessible by all authenticated users)
     */
    @WebMethod
    CourseDTO getCourseByCourseId(
            @WebParam(name = "token") String token,
            @WebParam(name = "courseId") String courseId);

    /**
     * Create a new course (admin only)
     */
    @WebMethod
    CourseDTO createCourse(
            @WebParam(name = "token") String token,
            @WebParam(name = "course") CourseDTO courseDTO);

    /**
     * Update an existing course (admin only)
     */
    @WebMethod
    CourseDTO updateCourse(
            @WebParam(name = "token") String token,
            @WebParam(name = "id") String id,
            @WebParam(name = "course") CourseDTO courseDTO);

    /**
     * Delete a course (admin only)
     */
    @WebMethod
    boolean deleteCourse(
            @WebParam(name = "token") String token,
            @WebParam(name = "id") String id);

    /**
     * Deactivate a course (admin only)
     */
    @WebMethod
    CourseDTO deactivateCourse(
            @WebParam(name = "token") String token,
            @WebParam(name = "id") String id);
}
