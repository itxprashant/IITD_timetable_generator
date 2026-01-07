import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'

export default function Navbar() {
    return (
        <nav>
            <div className="navbar-logo">
                <h1>
                    <Link to="/" style={{ color: '#333', textDecoration: 'none' }}>
                        Timetable<span style={{ color: '#6366f1' }}>Gen</span>
                    </Link>
                </h1>
            </div>
            <div className="navbar-links">
                <Link to="/empty-halls" style={{ marginLeft: '20px', textDecoration: 'none', color: '#555', fontWeight: '500' }}>
                    Empty Halls
                </Link>
                <Link to="/course-explorer" style={{ marginLeft: '20px', textDecoration: 'none', color: '#555', fontWeight: '500' }}>
                    Course Explorer
                </Link>
            </div>
            {/* Removed DevClub branding */}
        </nav >
    )
}
