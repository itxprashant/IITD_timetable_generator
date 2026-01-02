# IITD Timetable Generator

A comprehensive timetable management tool designed for IIT Delhi students. This application streamlines the process of creating, visualizing, and managing academic schedules.

### Key Features

*   **Automatic Course Fetching:** Fetches registered courses directly using your Kerberos ID.
*   **Interactive Timetable Grid:** Visualizes your weekly schedule with a clear, color-coded grid.
*   **Venue Synchronization:** Automatically updates lecture halls and venues based on the latest semester data.
*   **Manual Customization:** Allows manual addition of courses and editing of slot timings.
*   **Clash Detection:** Highlights conflicting slots to help you plan your schedule effectively.
*   **Export Options:** Download your timetable as a PDF or image for offline access.

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## AWS Deployment

For instructions on deploying this application to AWS using Nginx and Certbot (Docker or Manual), please refer to the [Deployment Guide](deploy/README.md).

## Updating for a New Semester

To update the application for a new semester, follow these steps:

1.  **Update Course List:**
    -   Download the `Courses_Offered.csv` file for the new semester.
    -   Place it in the root directory of the project, replacing the existing one.
    -   Run the `csv_to_json.py` script to generate the `courses.json` file.
        ```bash
        python3 scripts/csv_to_json.py
        ```

2.  **Update Venue Allotment:**
    -   Find the URL for the "Room Allotment Chart" PDF for the new semester (usually on the IITD Timetable website).
    -   Open `scripts/sync_venues.py`.
    -   Update the `PDF_URL` variable with the new link.
    -   Run the script to sync venues.
        ```bash
        python3 scripts/sync_venues.py
        ```

3.  **Update Student Courses:**
    -   Open `scripts/fetch_student_courses.js`.
    -   Update the `SEMESTER_PREFIX` variable with the new semester code (e.g., '2502-' for 2nd Sem 2024-25).
    -   Run the script to fetch student course registrations.
        ```bash
        node scripts/fetch_student_courses.js
        ```
