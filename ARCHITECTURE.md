# 🏗️ L&D Portal Architecture

## High-Level System Architecture

The L&D Portal follows a modern **Client-Server** architecture.

```mermaid
graph TD
    User((User))
    Browser[Web Browser]
    
    subgraph "L&D Portal System"
        Frontend[Frontend Application\n(React + Vite)]
        Backend[Backend API\n(NestJS)]
        DB[(Database\nSQLite)]
    end

    User -->|Interacts with| Browser
    Browser -->|Serves| Frontend
    Frontend -->|JSON/REST API| Backend
    Backend -->|read/write| DB
```

---

## Detailed Component Architecture

### 1. Frontend Layer (Client)
*   **Framework**: React 18 built with Vite.
*   **State Management**: Redux Toolkit (Slices for Auth, Users, Trainings).
*   **Styling**: Tailwind CSS with custom "Glassmorphism" utilities.
*   **Routing**: React Router DOM (Protected Routes via `RequireAuth`).

### 2. Backend Layer (Server)
*   **Framework**: NestJS (Modular, Dependency Injection).
*   **Authentication**:
    *   **Custom Guard**: `AuthGuard` (Mock/JWT hybrid).
    *   **Login Logic**: Supports standard (Bcrypt) and Quick Login (Flag-based).
*   **ORM**: Prisma (Type-safe database client).

```mermaid
graph TD
    subgraph Frontend
        Page[React Page\ne.g., Login.tsx]
        Slice[Redux Slice\ne.g., authSlice]
        Service[API Service\nhandles fetch]
    end

    subgraph Backend
        Controller[Controller\ne.g., AuthController]
        ServiceLayer[Service Layer\ne.g., UsersService]
        Prisma[Prisma Service]
    end

    subgraph Database
        SQLite[(SQLite DB)]
    end

    Page -->|Dispatch Action| Slice
    Slice -->|Call Method| Service
    Service -->|HTTP POST /login| Controller
    Controller -->|Validate| ServiceLayer
    ServiceLayer -->|Query| Prisma
    Prisma -->|SQL| SQLite
```

---

## Database Schema (ER Diagram)

The data model centers around the `User` who has a `Profile` and `Enrollments` in `Trainings`.

```mermaid
erDiagram
    User ||--|| Profile : has
    User ||--o{ Enrollment : has
    User ||--o{ Badge : earns
    Training ||--o{ Enrollment : includes
    
    User {
        string id PK
        string email UK
        string password
        string role "EMPLOYEE, ADMIN, MANAGER"
        boolean isActive
    }

    Profile {
        string id PK
        string bio
        string avatar
        string skills "CSV String"
        int totalLearningHours
    }

    Training {
        string id PK
        string title
        string tags "React, Node"
        string status
    }

    Enrollment {
        string userId FK
        string trainingId FK
        string status "completed, in-progress"
    }

    Badge {
        string id PK
        string name
        string userId FK
    }
```
