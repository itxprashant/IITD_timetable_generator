import React, { useState, useEffect } from 'react'
import './FullTimetable.css'

export default function EditTiming(props) {

    const data = props.data;
    const timetableData = props.timetableData;
    const setTimetableData = props.setTimetableData;

    // Initialize state from props
    // We expect timetableData[courseCode].tutorial (array) and .lab (array)
    // If null/undefined, initialize with one empty slot if the course has that component
    const [tutorials, setTutorials] = useState([]);
    const [labs, setLabs] = useState([]);

    useEffect(() => {
        const courseData = timetableData[data.courseCode] || {};

        if (data.tutorial) {
            if (courseData.tutorial && courseData.tutorial.length > 0) {
                setTutorials(courseData.tutorial);
            } else {
                setTutorials([]); // Start empty, user can add
            }
        }

        if (data.lab) {
            if (courseData.lab && courseData.lab.length > 0) {
                setLabs(courseData.lab);
            } else {
                setLabs([]); // Start empty, user can add
            }
        }
    }, [data.courseCode, timetableData, data.tutorial, data.lab]);

    // Generate time options: 08:00 to 21:00 in 30 min intervals
    const generateTimeOptions = () => {
        const options = [];
        for (let h = 8; h <= 21; h++) {
            ['00', '30'].forEach(m => {
                const hh = h.toString().padStart(2, '0');
                const timeCode = `${hh}${m}`; // HHM
                const display = `${hh}:${m}`;
                // Only add if reasonable timing (skip 21:30 maybe?)
                if (h === 21 && m === '30') return;
                options.push({ value: timeCode, label: display });
            });
        }
        return options;
    };
    const timeOptions = generateTimeOptions();


    // Handlers for Tutorial
    const addTutorial = () => {
        setTutorials([...tutorials, { day: "0", start: "0800", end: "0900", location: "" }]);
    };

    const updateTutorial = (index, field, value) => {
        const newTuts = [...tutorials];
        newTuts[index] = { ...newTuts[index], [field]: value };
        setTutorials(newTuts);
    };

    const removeTutorial = (index) => {
        setTutorials(tutorials.filter((_, i) => i !== index));
    };

    // Handlers for Lab
    const addLab = () => {
        setLabs([...labs, { day: "0", start: "1400", end: "1600", location: "" }]);
    };

    const updateLab = (index, field, value) => {
        const newLabs = [...labs];
        newLabs[index] = { ...newLabs[index], [field]: value };
        setLabs(newLabs);
    };

    const removeLab = (index) => {
        setLabs(labs.filter((_, i) => i !== index));
    };


    function saveData() {
        let courseCode = data.courseCode;
        let temp = { ...timetableData[courseCode] };

        // Process Tutorials
        let validTutorials = [];
        if (data.tutorial) {
            validTutorials = tutorials.filter(t => t.day !== "0" && t.start && t.end && Number(t.start) < Number(t.end)).map(t => ({
                day: t.day,
                start: t.start, // Already in HHMM format from select
                end: t.end,
                location: t.location || ""
            }));
            temp.tutorial = validTutorials.length > 0 ? validTutorials : null;
        }

        // Process Labs
        let validLabs = [];
        if (data.lab) {
            validLabs = labs.filter(l => l.day !== "0" && l.start && l.end && Number(l.start) < Number(l.end)).map(l => ({
                day: l.day,
                start: l.start,
                end: l.end,
                location: l.location || ""
            }));
            temp.lab = validLabs.length > 0 ? validLabs : null;
        }

        setTimetableData(prevState => ({
            ...prevState,
            [courseCode]: temp
        }));

        alert("Saved!");
    }

    return (
        <div id={props.div_id} style={{ padding: '10px 0' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '10px', color: '#555' }}>Edit Timings</h4>

            {data.tutorial ? <div className="edit-timing-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h5 style={{ margin: 0 }}>Tutorials</h5>
                    <button onClick={addTutorial} style={{ padding: '4px 8px', fontSize: '0.8rem', background: '#e0e7ff', color: '#6366f1', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>+ Add Session</button>
                </div>

                {tutorials.map((tut, index) => (
                    <div key={index} style={{ marginBottom: '15px', padding: '10px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '5px' }}>
                            <button onClick={() => removeTutorial(index)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.9rem' }}>Remove</button>
                        </div>
                        <select
                            value={tut.day}
                            onChange={(e) => updateTutorial(index, 'day', e.target.value)}
                            style={{ width: '100%', padding: '5px', marginBottom: '8px' }}
                        >
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
                                <select
                                    value={tut.start}
                                    onChange={(e) => updateTutorial(index, 'start', e.target.value)}
                                    style={{ padding: '5px' }}
                                >
                                    {timeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            </div>
                            <div className="select-lab-time-comp">
                                <p>End Time</p>
                                <select
                                    value={tut.end}
                                    onChange={(e) => updateTutorial(index, 'end', e.target.value)}
                                    style={{ padding: '5px' }}
                                >
                                    {timeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="select-lab-time-comp" style={{ marginTop: '10px' }}>
                            <p>Venue</p>
                            <input type="text" placeholder="e.g. IIA 201" value={tut.location || ""} onChange={(e) => updateTutorial(index, 'location', e.target.value)} style={{ width: '100%', padding: '5px' }} />
                        </div>
                    </div>
                ))}
                {tutorials.length === 0 && <p style={{ fontSize: '0.85rem', color: '#9ca3af', fontStyle: 'italic' }}>No tutorial sessions added.</p>}
            </div> : null}

            {data.lab ? <div className="edit-timing-section" style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h5 style={{ margin: 0 }}>Labs</h5>
                    <button onClick={addLab} style={{ padding: '4px 8px', fontSize: '0.8rem', background: '#e0e7ff', color: '#6366f1', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>+ Add Session</button>
                </div>

                {labs.map((lab, index) => (
                    <div key={index} style={{ marginBottom: '15px', padding: '10px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '5px' }}>
                            <button onClick={() => removeLab(index)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.9rem' }}>Remove</button>
                        </div>
                        <select
                            value={lab.day}
                            onChange={(e) => updateLab(index, 'day', e.target.value)}
                            style={{ width: '100%', padding: '5px', marginBottom: '8px' }}
                        >
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
                                <select
                                    value={lab.start}
                                    onChange={(e) => updateLab(index, 'start', e.target.value)}
                                    style={{ padding: '5px' }}
                                >
                                    {timeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            </div>
                            <div className="select-lab-time-comp">
                                <p>End Time</p>
                                <select
                                    value={lab.end}
                                    onChange={(e) => updateLab(index, 'end', e.target.value)}
                                    style={{ padding: '5px' }}
                                >
                                    {timeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="select-lab-time-comp" style={{ marginTop: '10px' }}>
                            <p>Venue</p>
                            <input type="text" placeholder="e.g. LH 111" value={lab.location || ""} onChange={(e) => updateLab(index, 'location', e.target.value)} style={{ width: '100%', padding: '5px' }} />
                        </div>
                    </div>
                ))}
                {labs.length === 0 && <p style={{ fontSize: '0.85rem', color: '#9ca3af', fontStyle: 'italic' }}>No lab sessions added.</p>}
            </div> : null}

            <button onClick={saveData} className="btn-primary btn-small" style={{ marginTop: '10px' }}>Save</button>
        </div>
    )
}
