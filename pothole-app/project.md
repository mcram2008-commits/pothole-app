# MyRoad Pothole Management System - Project Overview

## 🚀 Project Summary
**MyRoad** is a high-performance community infrastructure platform designed to bridge the gap between citizens and city officials. It allows users to report road issues (like potholes) in real-time using GPS and photographic evidence, which are then assigned to officers for resolution.

---

## 🛠 Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons (Advanced UI level).
- **Backend**: Node.js & Express.
- **Database**: Local JSON-based storage (`database.json`) for portability and speed.
- **Authentication**: JWT (JSON Web Tokens) with Role-Based Access Control (RBAC).
- **Location Services**: Browser Geolocation API for precise GPS pinning.

---

## 👥 User Roles & Workflow

### 1. Citizen (The Reporter)
- **Registration**: Can self-register with a verified mobile number (Fixed `+91` prefix + 10 digits).
- **Dashboard**: A sleek, tabbed interface to track "Current Issues" and "Resolution Archive".
- **Reporting**: Directly submit new complaints within the dashboard. Requires:
    - Photo Evidence (Upload/Camera).
    - Precise GPS Location (Auto-detected).
    - Severity Level (Low, Medium, High).
    - Description.

### 2. Officer (The Resolver)
- **Account Creation**: Only Admins can create Officer accounts.
- **Dashboard**: Features a lightning-fast collapsible sidebar and task management portal.
- **Workflow**:
    - **Active Tasks**: View assigned pothole reports.
    - **Actions**: "Start Work" (sets status to In Progress) and "Mark Fixed" (sets status to Fixed).
    - **History**: Dedicated tab to view all previously resolved issues.
- **Security**: Quick Logout button located in the top navbar.

### 3. Admin (The Controller)
- **System Oversight**: Global view of every reported incident in the city.
- **Officer Management**:
    - Create new officer accounts.
    - Approve or Revoke officer access.
    - Delete accounts.
- **Global Feed**: Monitor the status of all potholes (Submitted, In Progress, Fixed).

---

## 🔄 Project Working Flow

1.  **Submission**: A Citizen encounters a road issue and submits a report via the "New Complaint" tab. The system captures the GPS coordinates and the image.
2.  **Notification**: The report is instantly added to the Global Incident Feed.
3.  **Assignment**: The report appears on the Officer Dashboard's "Active Tasks" list.
4.  **Resolution**: 
    - The Officer travels to the location using the GPS coordinates provided.
    - The Officer clicks "Start Work" to notify the system they are on-site.
    - Once the road is repaired, the Officer clicks "Mark Fixed".
5.  **Completion**: The report is moved to the "Fixed History" for the Officer and the "Resolution Archive" for the Citizen.
6.  **Audit**: The Admin monitors these transitions to ensure city-wide road safety.

---

## ✨ Key UI/UX Features
- **Advanced Aesthetics**: Radial gradients, glassmorphism cards, and smooth micro-animations.
- **Performance**: Instant sidebar toggles (75ms duration) and optimized card layouts.
- **Validation**: Strict front-end and back-end enforcement of the Indian phone number format (+91).
- **Responsiveness**: Fully functional on Mobile (for on-road reporting) and Desktop (for administration).

---

## 📂 File Structure
- `client/src/pages/`: Contains the three primary role-based dashboards and auth pages.
- `server/index.js`: Single-entry Express server handling JSON data manipulation and image uploads.
- `database.json`: The source of truth for all users and reports.
- `force_start.bat`: Master script to launch both Frontend and Backend concurrently.
