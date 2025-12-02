package com.university.cours.repository;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;
import com.university.cours.config.MongoDBConfig;
import com.university.cours.model.Course;
import com.university.cours.model.TimeSlot;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.List;

public class CourseRepository {
    private final MongoCollection<Document> collection;

    public CourseRepository() {
        MongoDatabase database = MongoDBConfig.getDatabase();
        this.collection = database.getCollection("courses");
    }

    public List<Course> findAll() {
        List<Course> courses = new ArrayList<>();
        collection.find().forEach(doc -> courses.add(documentToCourse(doc)));
        return courses;
    }

    public List<Course> findActive() {
        List<Course> courses = new ArrayList<>();
        collection.find(Filters.eq("active", true))
                .forEach(doc -> courses.add(documentToCourse(doc)));
        return courses;
    }

    public Course findById(String id) {
        Document doc = collection.find(Filters.eq("_id", new ObjectId(id))).first();
        return doc != null ? documentToCourse(doc) : null;
    }

    public Course findByCourseId(String courseId) {
        Document doc = collection.find(Filters.eq("courseId", courseId)).first();
        return doc != null ? documentToCourse(doc) : null;
    }

    public Course save(Course course) {
        Document doc = courseToDocument(course);
        if (course.getId() == null) {
            collection.insertOne(doc);
            course.setId(doc.getObjectId("_id"));
        } else {
            collection.replaceOne(Filters.eq("_id", course.getId()), doc);
        }
        return course;
    }

    public boolean delete(String id) {
        return collection.deleteOne(Filters.eq("_id", new ObjectId(id))).getDeletedCount() > 0;
    }

    public Course update(String id, Course course) {
        Document doc = courseToDocument(course);
        collection.replaceOne(Filters.eq("_id", new ObjectId(id)), doc);
        course.setId(new ObjectId(id));
        return course;
    }

    private Document courseToDocument(Course course) {
        Document doc = new Document();
        if (course.getId() != null) {
            doc.append("_id", course.getId());
        }
        doc.append("courseId", course.getCourseId())
                .append("courseName", course.getCourseName())
                .append("courseCode", course.getCourseCode())
                .append("credits", course.getCredits())
                .append("description", course.getDescription())
                .append("professorId", course.getProfessorId())
                .append("professorName", course.getProfessorName())
                .append("maxStudents", course.getMaxStudents())
                .append("enrolledStudents", course.getEnrolledStudents())
                .append("semester", course.getSemester())
                .append("active", course.isActive());

        List<Document> timeSlotDocs = new ArrayList<>();
        for (TimeSlot ts : course.getTimeSlots()) {
            Document tsDoc = new Document()
                    .append("dayOfWeek", ts.getDayOfWeek())
                    .append("startTime", ts.getStartTime())
                    .append("endTime", ts.getEndTime())
                    .append("room", ts.getRoom());
            timeSlotDocs.add(tsDoc);
        }
        doc.append("timeSlots", timeSlotDocs);

        return doc;
    }

    private Course documentToCourse(Document doc) {
        Course course = new Course();
        course.setId(doc.getObjectId("_id"));
        course.setCourseId(doc.getString("courseId"));
        course.setCourseName(doc.getString("courseName"));
        course.setCourseCode(doc.getString("courseCode"));
        course.setCredits(doc.getInteger("credits", 0));
        course.setDescription(doc.getString("description"));
        course.setProfessorId(doc.getString("professorId"));
        course.setProfessorName(doc.getString("professorName"));
        course.setMaxStudents(doc.getInteger("maxStudents", 0));
        course.setEnrolledStudents(doc.getInteger("enrolledStudents", 0));
        course.setSemester(doc.getString("semester"));
        course.setActive(doc.getBoolean("active", true));

        List<Document> timeSlotDocs = doc.getList("timeSlots", Document.class, new ArrayList<>());
        List<TimeSlot> timeSlots = new ArrayList<>();
        for (Document tsDoc : timeSlotDocs) {
            TimeSlot ts = new TimeSlot();
            ts.setDayOfWeek(tsDoc.getString("dayOfWeek"));
            ts.setStartTime(tsDoc.getString("startTime"));
            ts.setEndTime(tsDoc.getString("endTime"));
            ts.setRoom(tsDoc.getString("room"));
            timeSlots.add(ts);
        }
        course.setTimeSlots(timeSlots);

        return course;
    }
}
