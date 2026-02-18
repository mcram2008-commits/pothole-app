# RoadWatch - Pothole Reporting App

**Hackathon Ready Edition (Zero-Config DB)**

This version uses a **local JSON database** (`server/database.json`), so you do NOT need to install MongoDB. It works out of the box!

## 🚀 Quick Start (Windows)

1.  **Double-click** `magic_fix.bat` in this folder.
2.  Wait for two black windows to open (Server & Client).
3.  Open your browser to: **http://localhost:5173**

## 🔑 Login Credentials

The app auto-creates a Super Admin account for you:

*   **Email:** `admin@pothole.com`
*   **Password:** `admin123`

To test the **Citizen** flow:
1.  Go to the Register page.
2.  Create a new account (e.g., `test@user.com`, `123456`).
3.  Login and submit a report.

## 📱 Features

*   **Role-Based Access**:
    *   **Citizens**: Report issues, view their history.
    *   **Officers**: View assigned tasks, update status (Pending -> Fixed).
    *   **Admins**: Manage users, approve officers.
*   **Zero-DB**: All data is saved to `server/database.json`.
*   **Map Integration**: Visualizes pothole locations.

## 🛠 Troubleshooting

*   **"Vite not found"**: Run `magic_fix.bat` again to install dependencies.
*   **"Port in use"**: Close all black command windows and run `magic_fix.bat` again.
