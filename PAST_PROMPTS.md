# Past Prompts Collection

## 1. Backend Development Prompt

# Backend Development Prompt

**Context**: You are a Senior Backend Architect and Lead Developer. You are tasked with building the production-ready backend for an existing **Learning & Development (L&D) Portal** frontend (React/Vite).

## 1. Project Overview
The L&D Portal is an internal application for managing employee training, certifications, and progress.
**Key Roles:**
- **Employee**: Enrolls in training, takes quizzes, views progress/badges, generates certificates.
- **Manager**: Views team analytics, assigns mandatory training.
- **Admin**: CRUD operations for trainings, user management.

## 2. Technology Stack Requirements
Use the following strict technology stack to ensuring scalability and type safety:
- **Framework**: **Node.js** with **NestJS** (Strict TypeScript).
- **Database**: **PostgreSQL** (Relational data is critical here).
- **ORM**: **Prisma** (for type-safe database access).
- **Authentication**: **Passport.js** (JWT Strategy) + **RBAC** (Role-Based Access Control).
- **Documentation**: **Swagger/OpenAPI** (Auto-generated).
- **Testing**: **Jest** (Unit & Integration tests).
- **Containerization**: **Docker** & **Docker Compose**.

## 3. Database Schema Design
Design a schema that supports the following relations:

### Core Entities
- **User**: `id, email, passwordHash, role (ENUM: EMPLOYEE, MANAGER, ADMIN), department, managerId`.
- **Training**: `id, title, description, instructor, startDate, endDate, type (ENUM: TECHNICAL, SOFT_SKILL), isMandatory`.
- **Enrollment**: Links `User` and `Training`. Fields: `status (ENUM: ENROLLED, COMPLETED), progress (0-100), score, completedAt`.

### Gamification & Content
- **Quiz**: One-to-One relation with `Training`. Contains `questions` (JSONB or separate table).
- **Badge**: `id, name, criteria, iconUrl`.
- **UserBadge**: Many-to-Many link between `User` and `Badge` with `awardedAt`.

## 4. API Architecture & Features
Implement a **RESTful API** with the following modules:

1.  **Auth Module**:
    - `POST /auth/login`: Returns JWT access token.
    - `Guards`: Implement `JwtAuthGuard` and `RolesGuard` to protect routes.

2.  **Training Module**:
    - `GET /trainings`: Filterable by status, type (Public).
    - `POST /trainings`: Admin only.
    - `POST /trainings/:id/enroll`: Employee action.
    - `POST /trainings/:id/complete`: Handles completion logic. **CRITICAL**: If a quiz exists, verify passing score before marking complete.

3.  **Analytics Module** (Manager/Admin):
    - `GET /analytics/team`: Aggregated stats (completion rates, total hours) for the logged-in manager's direct reports.

4.  **Gamification Module**:
    - Service logic to automatically award badges when criteria are met (e.g., "First Course Completed", "50 Hours Learning").

## 5. Non-Functional Requirements
- **Validation**: Use `class-validator` DTOs for all inputs.
- **Error Handling**: Global exception filter for consistent JSON error responses.
- **Seeding**: Create a `seed.ts` script to populate the DB with the initial demo data (John Doe, Admin User, sample courses).

## 6. Deliverables
1.  Full source code structure.
2.  `schema.prisma` file.
3.  `docker-compose.yml` for DB setup.
4.  `README.md` with instructions to start the server.

**Action**: specific the full file structure first, then implement the core modules iteratively.

---

## 2. Registration Flow Prompt

# Registration Flow Development Prompt

**Context**: You are a Full-Stack Developer extending the L&D Portal (React + NestJS). Your task is to implement a secure and user-friendly **Registration Flow**.

## 1. Frontend Requirements (React)
Create a new **Registration Page** at `/register`.

### UI/UX Design
-   **Style**: Match the existing **Glassmorphism** design (use `GlassCard` component).
-   **Layout**: Centered card similar to the Login page.
-   **Fields**:
    -   Name (Text)
    -   Email (Email type)
    -   Password (Password type with visibility toggle)
    -   Role (Dropdown: EMPLOYEE, MANAGER) - *Admin role should be restricted or require an invite code*.
    -   Department (Dropdown: Engineering, HR, Sales, Design)
-   **Navigation**: specific "Already have an account? Login" link.

### Logic & State
-   **Form Handling**: Use local state or a library like `react-hook-form`.
-   **Validation**:
    -   Email must be valid format.
    -   Password must be at least 8 characters.
    -   All fields required.
-   **Integration**:
    -   Call `AuthService.register(userData)`.
    -   On success: Redirect to Login page with a success toast/message.
    -   On error: Display clear error message (e.g., "Email already exists").

## 2. Backend Requirements (NestJS)
Extend the existing `AuthModule` in the `server/` directory.

### API Endpoint
-   **Route**: `POST /auth/register`
-   **DTO** (`CreateUserDto`):
    -   `email`: string, email, required.
    -   `password`: string, minLength(8), required.
    -   `name`: string, required.
    -   `role`: enum, required.
    -   `department`: string, required.

### Service Logic
1.  **Check Existence**: Query DB to ensure `email` is not already taken. Throw `ConflictException` if exists.
2.  **Security**: **Hash the password** using `bcrypt` before saving (do not store plain text!).
3.  **Save**: Create new User record in `JsonDbService`.
4.  **Response**: Return the created user profile (excluding password) or a success message.

## 3. Deliverables
1.  `Register.tsx` component.
2.  Updated `App.tsx` with `/register` route.
3.  Updated `AuthService` (frontend) with `register` method.
4.  Updated `AuthController` and `AuthService` (backend) with registration logic.
5.  Verification that a new user can register and then immediately login.

---

## 3. Database Migration Prompt

# Database Migration Prompt

**Context**: You are a Full-Stack Developer working on the L&D Portal. The current backend uses a local JSON file (`db.json`) for persistence. Your task is to migrate this to a **Relational Database** using **Prisma ORM**.

## 1. Technology Stack
-   **Database**: **SQLite** (for easy local development/testing without Docker) OR **PostgreSQL** (if you prefer a production-ready setup). *Start with SQLite for simplicity.*
-   **ORM**: **Prisma** (Excellent TypeScript support and ease of use).

## 2. Migration Steps

### Step 1: Initialization
1.  Install Prisma dependencies in `server/`:
    ```bash
    npm install prisma --save-dev
    npm install @prisma/client
    ```
2.  Initialize Prisma:
    ```bash
    npx prisma init --datasource-provider sqlite
    ```

### Step 2: Schema Definition
Update `server/prisma/schema.prisma` to model our data structure.
-   **User**: `id` (UUID), `email` (unique), `password`, `name`, `role`, `department`.
-   **Profile** (One-to-One with User): `bio`, `avatar`, `totalLearningHours`.
-   **Training**: `id` (UUID), `title`, `description`, `instructor`, `startDate`, `endDate`, `durationHours`, `type`, `format`, `maxSeats`, `enrolled` count, `isMandatory`, `tags` (check if scalar lists are supported in SQLite, otherwise simple string or separate table).
-   **Enrollment** (Many-to-Many / Explicit Relation): Link `User` and `Training`. Fields: `status`, `progress`, `attendance`, `enrolledAt`, `completedAt`.

### Step 3: Database & Client
1.  Run the migration to create the database:
    ```bash
    npx prisma migrate dev --name init
    ```
2.  Generate the Prisma Client:
    ```bash
    npx prisma generate
    ```
3.  Create a `PrismaService` (standard NestJS Prisma provider) in `server/src/prisma/prisma.service.ts`.

### Step 4: Refactoring Backend Services
Replace usages of `JsonDbService` in `AuthController` and `TrainingController` (or move logic to Services).
-   **AuthController**:
    -   `register`: Use `prisma.user.create`.
    -   `login`: Use `prisma.user.findUnique`.
-   **TrainingController**:
    -   `getTrainings`: Use `prisma.training.findMany`.
    -   `enroll`: Use `prisma.enrollment.create`.
    -   `complete`: Update `enrollment` status.

### Step 5: Data Seeding (Optional but Recommended)
Create a seed script `server/prisma/seed.ts` to populate the DB with the initial data currently in `db.json` so we don't start empty.

## 3. Deliverables
1.  `schema.prisma` file.
2.  `PrismaService` module.
3.  Refactored Controllers utilizing Prisma.
4.  Removal of `JsonDbService` and `db.json`.
5.  Verification that the frontend works unchanged (API contract must remain identical).

---

## 4. Swagger Integration Prompt

# Swagger Integration Prompt

## Objective
Integrate **Swagger (OpenAPI)** into the L&D Portal NestJS backend to provide interactive API documentation.

## Goals
1.  **Install Dependencies**: Add `@nestjs/swagger` and `swagger-ui-express`.
2.  **Configure Swagger**: Setup `SwaggerModule` in `main.ts` to expose documentation at `/api/docs`.
3.  **Document API**:
    *   Use `ApiTags` to group endpoints (e.g., `Auth`, `Trainings`).
    *   Use `ApiOperation` to describe endpoints.
    *   Use `ApiResponse` to document success and error responses.
    *   Use `ApiProperty` on DTOs (Data Transfer Objects) to define request/response schemas.

## Implementation Steps

### 1. Installation
```bash
npm install --save @nestjs/swagger swagger-ui-express
```

### 2. Configuration (`main.ts`)
Update `bootstrap` function to initialize Swagger:
```typescript
const config = new DocumentBuilder()
  .setTitle('L&D Portal API')
  .setDescription('The Learning & Development Portal API description')
  .setVersion('1.0')
  .addBearerAuth() // If we have JWT auth later
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

### 3. Verification
*   Start server: `npm run start:dev`
*   Open browser: `http://localhost:3000/api/docs`

---

## 5. Frontend Integration Prompt

# Frontend-Backend Integration & Mock Removal

## Objective
Finalize the connection between the React Frontend and NestJS Backend for **ALL** MVP features. Remove all client-side mock data and reliance on hardcoded accounts. Ensure the backend supports all required operations.

## Scope
1.  **Admin Features**:
    *   **Backend**: Add `DELETE /api/trainings/:id` and `PUT /api/trainings/:id`.
    *   **Frontend**: Update `TrainingService.deleteTraining` and `updateTraining`.
    *   **Backend**: Add `POST /api/trainings/:id/assign` (assign to specific users).
    *   **Frontend**: Update `TrainingService.assignTraining`.

2.  **User Features**:
    *   **Backend**: Create `UsersController` with:
        *   `GET /api/users/profile/:id`: Return extended profile (skills, badges).
        *   `GET /api/users`: Return list of users (for Admin assignment/view).
        *   `GET /api/users/team/:managerId`: Return direct reports (for Manager Dashboard).
    *   **Frontend**: Update `UserService` to consume these endpoints.

3.  **Cleanup**:
    *   **Remove Mocks**: Delete `MOCK_USERS` (authService), `MOCK_PROFILES` (userService), `MOCK_TRAININGS/PROGRESS` (trainingService).
    *   **Default Accounts**: Ensure no hardcoded credentials exist in frontend code.

## Implementation Steps

### Phase 1: Backend Expansion
1.  **Update `TrainingController`**: Add `delete`, `update`, `assign` methods.
2.  **Create `UsersController`**: Implement user retrieval logic using `PrismaService`.
3.  **Update `Privileges`**: Ensure proper RBAC in controllers (e.g., only Admin can delete).

### Phase 2: Frontend Service Integration
1.  **Refactor `UserService.ts`**: Replace `setTimeout` mocks with `fetch` calls.
2.  **Refactor `TrainingService.ts`**: Implement the missing admin methods.
3.  **Refactor `AuthService.ts`**: Verify `login` persists user correctly without MOCK_USERS.

## Verification
1.  **Login**: Test login with a seeded account (from `seed.ts`).
2.  **Admin Flow**: Create, Edit, and Delete a training via UI.
3.  **Manager Flow**: Login as Manager, verify "My Team" loads from DB.
4.  **Profile**: Verify user skills/badges load from DB.
