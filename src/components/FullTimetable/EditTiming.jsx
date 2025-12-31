import React from 'react'
import './FullTimetable.css'

export default function EditTiming(props) {

    const data = props.data;
    const timetableData = props.timetableData;
    const setTimetableData = props.setTimetableData;

    function saveData() {
        let courseCode = data.courseCode;
        let temp = timetableData[courseCode];
        // We need to use refs or controlled inputs ideally, but reusing ID selector for now
        // Be careful with IDs in loops - props.div_id helps uniqueness
        let master_div = document.getElementById(props.div_id);

        if (data.tutorial) {
            let tutDay = master_div.querySelector(`#select-tut-day-${courseCode}`).value;
            let tutStart = master_div.querySelector(`#tut-start-${courseCode}`).value;
            let tutEnd = master_div.querySelector(`#tut-end-${courseCode}`).value;
            let tutVenue = master_div.querySelector(`#tut-venue-${courseCode}`).value;

            if (tutDay !== "0") {
                temp.tutorial = [{
                    day: tutDay,
                    start: tutStart.replace(":", ""),
                    end: tutEnd.replace(":", ""),
                    location: tutVenue // Save custom venue
                }]
                if (temp.tutorial[0].start >= temp.tutorial[0].end) {
                    // Simple validation
                    temp.tutorial = null;
                }
            } else {
                temp.tutorial = null;
            }
        }

        if (data.lab) {
            let labDay = master_div.querySelector(`#select-lab-day-${courseCode}`).value;
            let labStart = master_div.querySelector(`#lab-start-${courseCode}`).value;
            let labEnd = master_div.querySelector(`#lab-end-${courseCode}`).value;
            let labVenue = master_div.querySelector(`#lab-venue-${courseCode}`).value;

            if (labDay !== "0") {
                temp.lab = [{
                    day: labDay,
                    start: labStart.replace(":", ""),
                    end: labEnd.replace(":", ""),
                    location: labVenue // Save custom venue
                }]
                if (temp.lab[0].start >= temp.lab[0].end) {
                    temp.lab = null;
                }
            } else {
                temp.lab = null;
            }
        }

        setTimetableData(prevState => ({
            ...prevState,
            [courseCode]: temp
        }));

        // No need to hide modal, just save. Maybe alert or visual feedback?
        alert("Saved!");
    }

    return (
        <div id={props.div_id} style={{ padding: '10px 0' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '10px', color: '#555' }}>Edit Timings</h4>

            {data.tutorial ? <div className="edit-timing-section">
                <h5>Tutorial</h5>
                <select name="tutorial" id={`select-tut-day-${data.courseCode}`} defaultValue="0" style={{ width: '100%', padding: '5px' }}>
                    <option value="0" disabled>Select Day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                </select>
                <div className="select-lab-time">
                    <div className="select-lab-time-comp">
                        <p>Start Time</p>
                        <input type="time" name="tut-start" id={`tut-start-${data.courseCode}`} />
                    </div>
                    <div className="select-lab-time-comp">
                        <p>End Time</p>
                        <input type="time" name="tut-end" id={`tut-end-${data.courseCode}`} />
                    </div>
                </div>
                <div className="select-lab-time-comp" style={{ marginTop: '10px' }}>
                    <p>Venue</p>
                    <input type="text" placeholder="e.g. IIA 201" id={`tut-venue-${data.courseCode}`} style={{ width: '100%', padding: '5px' }} />
                </div>
            </div> : null}

            {data.lab ? <div className="edit-timing-section">
                <h5>Lab</h5>
                <select name="lab" id={`select-lab-day-${data.courseCode}`} defaultValue="0" style={{ width: '100%', padding: '5px' }}>
                    <option value="0" disabled>Select Day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                </select>
                <div className="select-lab-time">
                    <div className="select-lab-time-comp">
                        <p>Start Time</p>
                        <input type="time" name="lab-start" id={`lab-start-${data.courseCode}`} />
                    </div>
                    <div className="select-lab-time-comp">
                        <p>End Time</p>
                        <input type="time" name="lab-end" id={`lab-end-${data.courseCode}`} />
                    </div>
                </div>
                <div className="select-lab-time-comp" style={{ marginTop: '10px' }}>
                    <p>Venue</p>
                    <input type="text" placeholder="e.g. LH 111" id={`lab-venue-${data.courseCode}`} style={{ width: '100%', padding: '5px' }} />
                </div>
            </div> : null}

            <button onClick={saveData} className="btn-primary btn-small" style={{ marginTop: '10px' }}>Save</button>
        </div>
    )
}
