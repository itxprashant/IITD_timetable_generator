import React, { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import coursesData from '../courses.json';
import courseStudentsData from '../courseStudents.json';
import './CourseDetails.css';

export default function CourseDetails() {
    const { courseCode } = useParams();

    const course = useMemo(() => {
        return coursesData.find(c => c.courseCode === courseCode);
    }, [courseCode]);

    const students = useMemo(() => {
        return courseStudentsData[courseCode] || [];
    }, [courseCode]);

    if (!course) {
        return <Navigate to="/course-explorer" replace />;
    }

    return (
        <div className="course-details-page">
            <Link to="/course-explorer" className="back-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back to Explorer
            </Link>

            <div className="course-header-card">
                <div className="cd-header-top">
                    <div className="cd-title-block">
                        <h1>{course.courseCode}</h1>
                        <p className="cd-course-name">{course.courseName}</p>
                    </div>
                    <span className="cd-credits-badge">{course.totalCredits} Credits</span>
                </div>

                <div className="cd-info-grid">
                    <div className="cd-info-item">
                        <h3>Instructor</h3>
                        <p>{course.instructor || 'N/A'}</p>
                    </div>
                    <div className="cd-info-item">
                        <h3>Slot</h3>
                        <p>{course.slot?.name || 'N/A'}</p>
                    </div>
                    <div className="cd-info-item">
                        <h3>Schedule</h3>
                        <p>{course.slot?.lectureTimingStr || 'N/A'}</p>
                    </div>
                    <div className="cd-info-item">
                        <h3>Venue</h3>
                        <p>{course.lectureHall || 'N/A'}</p>
                    </div>
                    <div className="cd-info-item">
                        <h3>Structure</h3>
                        <p>{course.creditStructure || 'N/A'}</p>
                    </div>
                </div>
            </div>

            <div className="students-section">
                <h2 className="section-title">
                    Registered Students
                    <span className="student-count">{students.length}</span>
                </h2>

                {students.length > 0 ? (
                    <div className="students-table-container">
                        <table className="students-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Student Name</th>
                                    <th>Kerberos ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, index) => (
                                    <tr key={student.id}>
                                        <td className="row-index">{index + 1}</td>
                                        <td className="student-name">{student.name}</td>
                                        <td className="student-id">{student.id}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="no-students">
                        No students found registered for this course.
                    </div>
                )}
            </div>
        </div>
    );
}
