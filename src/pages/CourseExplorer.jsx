import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './CourseExplorer.css';
import coursesData from '../courses.json';

const ITEMS_PER_PAGE = 24;

export default function CourseExplorer() {
    const [searchTerm, setSearchTerm] = useState('');
    const [displayedCourses, setDisplayedCourses] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    // Memoize filtered courses to avoid re-calculation on every render
    const filteredCourses = useMemo(() => {
        if (!searchTerm) return coursesData;
        const lowerTerm = searchTerm.toLowerCase();
        return coursesData.filter(course =>
            course.courseCode.toLowerCase().includes(lowerTerm)
        );
    }, [searchTerm]);

    // Update displayed courses when filter or page changes
    useEffect(() => {
        const start = 0;
        const end = page * ITEMS_PER_PAGE;
        setDisplayedCourses(filteredCourses.slice(start, end));
        setLoading(false);
    }, [filteredCourses, page]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(1); // Reset to first page on search
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const loadMore = () => {
        setPage(prev => prev + 1);
    };

    const hasMore = displayedCourses.length < filteredCourses.length;

    return (
        <div className="course-explorer-container">
            <div className="course-explorer-header">
                <h1 className="course-explorer-title">Course Explorer</h1>
                <p className="course-explorer-subtitle">
                    Discover courses offered at IIT Delhi. Browse through our comprehensive catalog.
                </p>
            </div>

            <div className="search-container">
                <span className="search-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </span>
                <input
                    type="text"
                    placeholder="Search by course code (e.g. COL106)..."
                    className="search-input"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            {loading ? (
                <div className="loading-state">Loading courses...</div>
            ) : (
                <>
                    {displayedCourses.length === 0 ? (
                        <div className="empty-state">
                            <h3>No courses found</h3>
                            <p>Try adjusting your search criteria</p>
                        </div>
                    ) : (
                        <>
                            <div className="courses-grid">
                                {displayedCourses.map((course, index) => (
                                    <Link
                                        to={`/course/${course.courseCode}`}
                                        key={`${course.courseCode}-${index}`}
                                        className="course-card-link"
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                    >
                                        <div className="course-card">
                                            <div className="course-header">
                                                <div className="course-title-section">
                                                    <div className="course-title-row">
                                                        <span className="course-code">{course.courseCode}</span>
                                                        <span className="course-credits-badge">{course.totalCredits} Credits</span>
                                                    </div>
                                                    <div className="course-name">{course.courseName}</div>
                                                </div>
                                                <div className="course-instructor">
                                                    <span className="detail-label">Instructor:</span>
                                                    <span className="instructor-name">{course.instructor || 'N/A'}</span>
                                                </div>
                                            </div>

                                            <div className="course-info-grid">
                                                <div className="info-item">
                                                    <span className="detail-label">Slot</span>
                                                    <span className="detail-value">{course.slot?.name || 'N/A'}</span>
                                                </div>
                                                <div className="info-item">
                                                    <span className="detail-label">Schedule</span>
                                                    <span className="detail-value">{course.slot?.lectureTimingStr || 'N/A'}</span>
                                                </div>
                                                <div className="info-item">
                                                    <span className="detail-label">Venue</span>
                                                    <span className="detail-value">{course.lectureHall || 'N/A'}</span>
                                                </div>
                                                <div className="info-item">
                                                    <span className="detail-label">Strength</span>
                                                    <span className="detail-value">{course.currentStrength || '-'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {hasMore && (
                                <div className="load-more-container">
                                    <button onClick={loadMore} className="load-more-btn">
                                        Load More Courses
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}
