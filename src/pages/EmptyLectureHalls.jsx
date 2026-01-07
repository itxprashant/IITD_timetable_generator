import React, { useState, useEffect } from 'react';
import courses from '../courses.json';
import extraOccupied from '../extra_occupied.json';
import './EmptyLectureHalls.css'; // Assuming we'll create a CSS file for styling

const EmptyLectureHalls = () => {
    const [emptyHalls, setEmptyHalls] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isCustomTime, setIsCustomTime] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            if (!isCustomTime) {
                setCurrentTime(new Date());
            }
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, [isCustomTime]);

    useEffect(() => {
        const calculateEmptyHalls = () => {
            const now = currentTime;
            const currentDay = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const currentTimeValue = currentHour * 100 + currentMinute;

            // 1. Extract all unique Lecture Halls
            const allHalls = new Set();
            courses.forEach(course => {
                if (course.lectureHall) {
                    // Handle comma-separated halls "LH 108, LH 114"
                    const halls = course.lectureHall.split(',').map(h => h.trim());
                    halls.forEach(hall => {
                        if (hall.startsWith('LH')) {
                            allHalls.add(hall);
                        }
                    });
                }
            });

            // 2. Determine occupied halls
            const occupiedHalls = new Set();

            // Check courses.json
            courses.forEach(course => {
                if (course.slot && course.slot.lectureTiming) {
                    const timings = course.slot.lectureTiming.split(',');
                    timings.forEach(timing => {
                        // Format: "DayStartTimeEndTime" e.g., "109301100" -> Day 1, 09:30 to 11:00
                        // "211001200" -> Day 2, 11:00 to 12:00

                        if (timing.length === 9) {
                            const day = parseInt(timing.substring(0, 1));
                            const start = parseInt(timing.substring(1, 5));
                            const end = parseInt(timing.substring(5, 9));

                            if (day === currentDay) {
                                if (currentTimeValue >= start && currentTimeValue < end) {
                                    if (course.lectureHall) {
                                        const halls = course.lectureHall.split(',').map(h => h.trim());
                                        halls.forEach(hall => {
                                            if (hall.startsWith('LH')) {
                                                occupiedHalls.add(hall);
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    });
                }
            });

            // Check extra_occupied.json
            extraOccupied.forEach(item => {
                if (item.day === currentDay) {
                    const start = parseInt(item.startTime);
                    const end = parseInt(item.endTime);
                    if (currentTimeValue >= start && currentTimeValue < end) {
                        if (item.lectureHall.startsWith('LH')) {
                            occupiedHalls.add(item.lectureHall);
                        }
                    }
                }
            });


            // 3. Filter out occupied halls
            const freeHalls = Array.from(allHalls).filter(hall => !occupiedHalls.has(hall));

            // Sort logically (alphanumeirc sort might be tricky with "LH 108" vs "LH 313.5")
            // For now simple string sort
            freeHalls.sort();

            setEmptyHalls(freeHalls);
        };

        calculateEmptyHalls();
    }, [currentTime]);

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const handleTimeClick = () => {
        setShowTimePicker(true);
    };

    const handleTimeChange = (e) => {
        const [hours, minutes] = e.target.value.split(':');
        const newTime = new Date(currentTime);
        newTime.setHours(parseInt(hours));
        newTime.setMinutes(parseInt(minutes));
        setCurrentTime(newTime);
        setIsCustomTime(true);
        setShowTimePicker(false);
    };

    const handleReset = () => {
        setIsCustomTime(false);
        setCurrentTime(new Date());
        setShowTimePicker(false);
    };

    return (
        <div className="empty-halls-container">
            <h2>Empty Lecture Halls</h2>
            <div className="time-info-container">
                {showTimePicker ? (
                    <input
                        type="time"
                        className="time-picker"
                        value={`${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`}
                        onChange={handleTimeChange}
                        onBlur={() => setShowTimePicker(false)}
                        autoFocus
                    />
                ) : (
                    <div onClick={handleTimeClick} style={{ cursor: 'pointer' }}>
                        <p className="current-time" style={{ textDecoration: 'underline' }}>
                            Current Time: {formatTime(currentTime)}
                        </p>
                        <p style={{ fontSize: '0.8rem', color: '#888', margin: '2px 0 0 0' }}>
                            (Click to change)
                        </p>
                    </div>
                )}
                <p className="day-info">{['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentTime.getDay()]}</p>
                {isCustomTime && (
                    <button className="reset-button" onClick={handleReset}>
                        Reset to Now
                    </button>
                )}
            </div>

            {emptyHalls.length > 0 ? (
                <div className="halls-grid">
                    {emptyHalls.map(hall => (
                        <div key={hall} className="hall-card">
                            {hall}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No empty lecture halls found at this time.</p>
            )}
        </div>
    );
};

export default EmptyLectureHalls;
