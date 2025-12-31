import React from 'react'
import './Timetable.css'
import TimetableElement from './TimetableElement'

export default function TimetableGrid(props) {

    const timeList = ['6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM']

    const timetable = props.timetable;
    const data = props.timetableData;

    return (
        <div className="timetable-grid">
            <table className="time-headers">
                <thead>
                    <tr>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {timeList.map((time, index) => {
                        // Skip the first time to align with grid cells if they skip index 0
                        // OR: if grid cells skip index 0 (6 AM), then the first content row is 7 AM.
                        // We want labels to align with lines.
                        // The line ABOVE the first row is the start time of that row.

                        // Let's render ALL times, but ensuring we match the grid rows.
                        // If grid body skips index 0 (6 AM slot), it starts with 7 AM slot.
                        // The top line of the first row is 7 AM.

                        // We need the labels to match the lines.
                        // Row 0 of body = 7 AM - 8 AM. Top line = 7 AM.
                        // So Row 0 of time headers should be "7 AM".

                        // If we skip index 0 in headers too:
                        if (index === 0) return null;

                        return (
                            <tr key={index}>
                                <td><span>{time}</span></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div className="timetable-content">
                <table className="timetable-grid-cells">
                    <thead>
                        <tr>
                            <th>Monday</th>
                            <th>Tuesday</th>
                            <th>Wednesday</th>
                            <th>Thursday</th>
                            <th>Friday</th>
                        </tr>
                    </thead>
                    <tbody>
                        {timeList.map((time, index) => {
                            if (index === 0) return null
                            return (
                                <tr key={index}>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {timetable.map(course => {
                    return (
                        <React.Fragment key={course.courseCode}>
                            {data[course.courseCode].lab ? data[course.courseCode].lab.map((lab, i) => {
                                return <TimetableElement key={`lab-${i}`} data={lab} course={course.courseCode} lectureHall={lab.location} type="Lab" />;
                            }) : null}
                            {data[course.courseCode].lecture ? data[course.courseCode].lecture.map((lecture, i) => {
                                return <TimetableElement key={`lec-${i}`} data={lecture} course={course.courseCode} lectureHall={course.lectureHall} type="Lecture" />;
                            }) : null}
                            {data[course.courseCode].tutorial ? data[course.courseCode].tutorial.map((tutorial, i) => {
                                return <TimetableElement key={`tut-${i}`} data={tutorial} course={course.courseCode} lectureHall={tutorial.location} type="Tutorial" />;
                            }) : null}
                        </React.Fragment>
                    )
                })}
            </div>
        </div>
    )
}
