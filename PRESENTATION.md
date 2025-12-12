````carousel
# 🚀 L&D Portal
## Revolutionizing Corporate Learning

### A Modern, AI-Accelerated Solution
**Presenter**: Antigravity (AI Assistant) & User
**Date**: December 2025

---

### Agenda
1.  **Project Overview**: What is it?
2.  **Core Capabilities**: Functions & Roles
3.  **Technical Architecture**: End-to-End Diagram
4.  **The AI Advantage**: Development Story

<!-- slide -->
# 🎯 Project Overview

The **Learning & Development (L&D) Portal** is a comprehensive web application designed to streamline corporate training.

### Key Value Props
*   **Centralized Hub**: A single source of truth for all training activities.
*   **Role-Based Workflows**: Tailored experiences for Employees, Managers, Admins, and Super Admins.
*   **Modern Aesthetics**: Built with a premium "Glassmorphism" UI for an engaging user experience.
*   **Gamified Learning**: Badges, Skills, and achievements to drive engagement.

<!-- slide -->
# 🛠️ Functional Capabilities

### 👨‍💼 For Employees
*   **Course Catalog**: Browse and enroll in available trainings.
*   **Smart Skills**: Automatically update profile skills upon training completion (`Node`, `React`, etc.).
*   **Gamification**: Earn "Course Champion" badges.

### 👩‍🏫 For Managers & Admins
*   **Team Dashboard**: View team compliance and training status.
*   **User Management**: CRUD operations for users and trainings.

### 🔐 Security & Access
*   **Role-Based Access Control (RBAC)**: Fine-grained permissions.
*   **Quick Login**: Frictionless password-less access for internal demos via secure "Quick Login" buttons.
*   **Standard Sign-In**: Strict bcrypt-enforced password validation for secure entry.

<!-- slide -->
# 🏗️ Technical Architecture

A robust, scalable full-stack solution utilizing the latest web technologies.

```mermaid
graph TD
    subgraph Client ["Frontend (Client Layer)"]
        UI[React 18 + Vite]
        State[Redux Toolkit]
        Style[Tailwind CSS (Glassmorphism)]
        Router[React Router]
    end

    subgraph Server ["Backend (API Layer)"]
        Nest[NestJS Framework]
        Auth[Auth Module (Bcrypt/JWT)]
        Controllers[Rest Controllers]
        Services[Business Logic Services]
    end

    subgraph Data ["Data Layer"]
        Prisma[Prisma ORM]
        DB[(SQLite Database)]
    end

    UI -->|HTTP Requests| Nest
    Nest -->|Auth Guard| Auth
    Nest -->|Route| Controllers
    Controllers -->|Logic| Services
    Services -->|Query| Prisma
    Prisma -->|SQL| DB
```

### Stack Details
*   **Frontend**: React 18, Vite, TailwindCSS, Framer Motion.
*   **Backend**: NestJS, TypeScript, Swagger (API Docs).
*   **Database**: SQLite, Prisma ORM.

<!-- slide -->
# 🤖 The AI Advantage: End-to-End Development

How we utilized AI to accelerate every phase of the SDLC.

### 1. Rapid Prototyping ⚡
*   **Concept to Code**: Transformed a simple prompt into a full generic UI foundation.
*   **Design System**: Generated detailed "Glassmorphism" CSS instantly.

### 2. Feature Implementation 🚀
*   **Skills Engine**: Built logic to parse training tags and auto-update user profiles.
*   **Security Hardening**: Identified and patched login vulnerabilities while enabling "Quick Login" for demos.

### 3. Debugging & Optimization 🐞
*   **Case Study**: Fixed "Broken Badge" issue by diagnosing missing transaction logic.
*   **Verification**: Automated testing scripts (`verify_skills.ts`, `verify_login_security.ts` vs live API).

<!-- slide -->
# 📈 Future Roadmap

The foundation is set for rapid expansion.

*   **Leaderboards**: Global rankings based on badges earned.
*   **Advanced Analytics**: AI-driven insights for Managers.
*   **Mobile App**: React Native port sharing the same backend.

---
### Thank You!
*Built with ❤️ and 🤖*
````
