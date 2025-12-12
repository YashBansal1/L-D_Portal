# Learning & Development Portal

A comprehensive L&D management system built with React, TypeScript, and Tailwind CSS. This portal serves Employees, Managers, Admins, and Super Admins with specific role-based workflows for training management and enrollment.

## Features

### Core Features
- **Role-Based Access Control (RBAC)**: Secure access for Employee, Manager, Admin, and Super Admin.
- **Training Management**: Create, edit, and assign trainings (Admin).
- **Enrollment System**: Employees can browse and enroll in courses.
- **Dashboard**: Role-specific dashboards with relevant metrics and action items.

### Advanced Features
- **Gamification**:
  - **Badges**: Earn badges for completion (Bronze, Silver, Gold).
  - **Quizzes**: Interactive quizzes required for training completion.
  - **Leaderboards**: (Planned)
- **Manager Dashboard**: Track team progress and compliance.
- **Certificates**: Generate and print certificates for completed courses.

### UI/UX
- **Glassmorphism Design**: Modern, translucent UI components.
- **Animations**: Smooth transitions using Framer Motion.
- **Responsive**: Fully optimized for desktop and tablet.

## Tech Stack
- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, clsx
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **Testing**: Vitest, React Testing Library

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

### 1. Start the Backend Server
The backend must be running for the application to function.
```bash
cd server
npm install
npm run start:dev
```
The server will run on `http://localhost:3000`.

### 2. Start the Frontend
In a new terminal:
```bash
npm install
npm run dev
```
The application will open at `http://localhost:5174`.

### Building for Production
Create an optimized production build:
```bash
npm run build
```

### Running Tests
Execute unit and component tests:
```bash
npm test
```

## Project Structure
```
src/
├── components/     # Reusable UI components
│   ├── common/     # Generic (Button, Card, Modal)
│   ├── dashboard/  # Dashboard widgets
│   ├── layout/     # Layout wrappers
│   └── ...
├── pages/          # Page components (Login, Dashboard)
├── services/       # Mock API services
├── store/          # Redux slices and store config
├── types/          # TypeScript interfaces
└── ...
```

## Mock Data
The application currently uses mock services (`src/services/*.ts`) to simulate backend interactions. No real database is required for the demo.

## License
MIT
