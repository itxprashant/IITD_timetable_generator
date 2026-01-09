import React, { useMemo, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import coursesData from '../courses.json';
import courseStudentsData from '../courseStudents.json';
import './CourseDetails.css';


const COLORS = [
    '#4f46e5', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
    '#6366f1', '#14b8a6'
];

function BranchPieChart({ students }) {
    const data = useMemo(() => {
        const counts = students.reduce((acc, student) => {
            const match = student.id.match(/^([a-z0-9]{3})/i);
            const branch = match ? match[1].toUpperCase() : 'Others';
            acc[branch] = (acc[branch] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .map(([name, value], index) => ({
                name,
                value,
                color: COLORS[index % COLORS.length]
            }));
    }, [students]);

    const total = students.length;
    let accumulatedAngle = 0;

    return (
        <div className="pie-chart-container">
            <svg viewBox="0 0 100 100" className="pie-chart-svg">
                {data.map((slice, i) => {
                    // Calculate pie slice path
                    const percentage = slice.value / total;
                    const angle = percentage * 360;

                    // Convert polar to cartesian
                    const x1 = 50 + 50 * Math.cos(Math.PI * accumulatedAngle / 180);
                    const y1 = 50 + 50 * Math.sin(Math.PI * accumulatedAngle / 180);

                    const endAngle = accumulatedAngle + angle;
                    const x2 = 50 + 50 * Math.cos(Math.PI * endAngle / 180);
                    const y2 = 50 + 50 * Math.sin(Math.PI * endAngle / 180);

                    const largeArcFlag = angle > 180 ? 1 : 0;

                    const pathData = total === slice.value
                        ? `M 50 50 m -50 0 a 50 50 0 1 0 100 0 a 50 50 0 1 0 -100 0` // Full circle
                        : `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

                    accumulatedAngle += angle;

                    return (
                        <path
                            key={slice.name}
                            d={pathData}
                            fill={slice.color}
                            stroke="white"
                            strokeWidth="1"
                        >
                            <title>{`${slice.name}: ${slice.value} (${(percentage * 100).toFixed(1)}%)`}</title>
                        </path>
                    );
                })}
                {/* Center Hole for Donut Effect */}
                <circle cx="50" cy="50" r="30" fill="white" />
            </svg>
            <div className="chart-legend">
                {data.map((item) => (
                    <div key={item.name} className="legend-item">
                        <span className="legend-color" style={{ backgroundColor: item.color }}></span>
                        <span className="legend-label">{item.name}</span>
                        <span className="legend-value">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function BranchYearPivotTable({ students }) {
    const { years, branches, matrix, totals } = useMemo(() => {
        const yearsSet = new Set();
        const branchesSet = new Set();
        const matrix = {}; // { branch: { year: count } }

        // 1. Collect Data
        students.forEach(student => {
            const match = student.id.match(/^([a-z0-9]{3})(\d{2})/i);
            const branch = match ? match[1].toUpperCase() : 'Unknown';
            const yearStr = match ? `20${match[2]}` : 'Unknown';

            yearsSet.add(yearStr);
            branchesSet.add(branch);

            if (!matrix[branch]) matrix[branch] = {};
            matrix[branch][yearStr] = (matrix[branch][yearStr] || 0) + 1;
        });

        const years = Array.from(yearsSet).sort();
        const branches = Array.from(branchesSet).sort();

        // 2. Calculate Row Totals
        const totals = {};
        branches.forEach(branch => {
            totals[branch] = years.reduce((sum, y) => sum + (matrix[branch][y] || 0), 0);
        });

        return { years, branches, matrix, totals };
    }, [students]);

    return (
        <div className="pivot-table-wrapper">
            <table className="pivot-table">
                <thead>
                    <tr>
                        <th className="pivot-header-corner">Department</th>
                        {years.map(year => (
                            <th key={year} className="pivot-header-year">{year}</th>
                        ))}
                        <th className="pivot-header-total">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {branches.map(branch => (
                        <tr key={branch}>
                            <td className="pivot-branch-cell">{branch}</td>
                            {years.map(year => (
                                <td key={year} className="pivot-data-cell">
                                    {matrix[branch][year] || '-'}
                                </td>
                            ))}
                            <td className="pivot-total-cell">{totals[branch]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default function CourseDetails() {
    const { courseCode } = useParams();
    const [showAnalytics, setShowAnalytics] = useState(false);

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
                {/* Program Distribution Section */}
                {/* Program Distribution Section */}
                {students.length > 0 && (
                    <div className="distribution-section">
                        <div className="section-header-row">
                            <h3 className="section-title" style={{ marginBottom: 0 }}>Program Analytics</h3>
                            <button
                                className="show-analytics-btn"
                                onClick={() => setShowAnalytics(true)}
                            >
                                Show Details
                            </button>
                        </div>

                        <div className="analytics-preview">
                            <div className="chart-preview">
                                <h4>Branch Distribution</h4>
                                <div className="pie-chart-wrapper">
                                    <BranchPieChart students={students} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Analytics Modal Overlay */}
                {showAnalytics && (
                    <div className="analytics-modal-overlay" onClick={() => setShowAnalytics(false)}>
                        <div className="analytics-modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Program Analytics</h2>
                                <button className="modal-close-btn" onClick={() => setShowAnalytics(false)}>
                                    &times;
                                </button>
                            </div>

                            <div className="modal-body">
                                <div className="analytics-container full-view">
                                    {/* Left: Pie Chart */}
                                    <div className="chart-container">
                                        <h4>Branch Distribution</h4>
                                        <div className="pie-chart-wrapper">
                                            <BranchPieChart students={students} />
                                        </div>
                                    </div>

                                    {/* Right: Detailed Table */}
                                    <div className="stats-table-container">
                                        <h4>Year of Entry by Department</h4>
                                        <BranchYearPivotTable students={students} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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
