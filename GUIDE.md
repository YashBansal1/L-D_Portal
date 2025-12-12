# L&D Portal - User Guide

This guide provides detailed instructions on how to set up, run, and troubleshoot the Learning & Development Portal application.

## Prerequisites

- **Node.js**: Version 18 or higher is required.
- **npm**: Node Package Manager (comes with Node.js).
- **Git**: For cloning the repository.

## 1. Initial Setup

The application consists of two parts: the **Server** (Backend) and the **Client** (Frontend). You need to install dependencies for both.

### Install Server Dependencies
```bash
cd server
npm install
```

### Install Client Dependencies
Open a new terminal window (or navigate back to the root if in server folder `cd ..`)
```bash
# Ensure you are in the root directory (L&D_Portal)
npm install
```

## 2. Running the Application

You need to run **both** the server and the client simultaneously for the app to work correctly. It is recommended to use two separate terminal windows.

### Step 1: Start the Backend Server
In your first terminal:
```bash
cd server
npm run start:dev
```
*   **Success Indicator**: You should see logs indicating the Nest application successfully started.
*   **URL**: The server runs on `http://localhost:3000` by default.

### Step 2: Start the Frontend Client
In your second terminal (from the root directory):
```bash
npm run dev
```
*   **Success Indicator**: You will see a message `VITE vX.X.X ready in X ms`.
*   **URL**: The application usually starts at `http://localhost:5173`.
    *   *Note: If port 5173 is in use, Vite will automatically select the next available port (e.g., 5174). Look at the terminal output to confirm the exact URL.*

## 3. Accessing the App

Open your browser and navigate to the URL shown in the Frontend terminal (e.g., `http://localhost:5173`).

## Troubleshooting

### "Port already in use"
*   **Frontend**: Vite handles this automatically. If 5173 is busy, it tries 5174, 5175, etc. Just check the terminal output for the correct link.
*   **Backend**: If port 3000 is busy, the server might fail to start. You can change the port by setting an environment variable:
    ```bash
    PORT=3001 npm run start:dev
    ```

### "Network Error" or Data not loading
*   Ensure the **Backend Server** is running and has not crashed.
*   Check the browser console (F12) for error messages.
*   If the frontend is trying to connect to the wrong backend URL, check your environment configuration.

## Development & Testing

*   **Run Tests**: `npm test` (Runs Vitest)
*   **Build for Production**: `npm run build` (Creates `dist` folder)
