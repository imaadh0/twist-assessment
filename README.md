# TaskFlow

A full-stack task management app built for the Twist Digital Associate SE assessment.

The goal was to build something clean, secure, and structured properly rather than just making it "work".

---

## Tech Stack

- **Frontend**: Next.js (App Router) + TypeScript + Tailwind CSS
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (access + refresh token rotation)

---

## Why This Structure?

I kept the frontend and backend fully separated.

- The frontend handles UI, state management, and token handling.
- The backend focuses strictly on API logic and security.
- Prisma sits between the backend and PostgreSQL for type-safe database access.

This keeps responsibilities clear and makes deployment straightforward.

---

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/imaadh0/twist-assessment.git
cd twist-assessment
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env

npm install
npx prisma migrate dev
npm run dev
```

Backend runs on: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend
cp .env.example .env.local

npm install
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

## API Endpoints

### Auth

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /api/auth/register |
| POST   | /api/auth/login    |
| POST   | /api/auth/refresh  |
| POST   | /api/auth/logout   |

### Tasks (requires Bearer token)

| Method | Endpoint       |
| ------ | -------------- |
| GET    | /api/tasks     |
| GET    | /api/tasks/:id |
| POST   | /api/tasks     |
| PUT    | /api/tasks/:id |
| DELETE | /api/tasks/:id |

---

## Security Highlights

- bcrypt password hashing (12 rounds)
- Access tokens stored in memory only
- Refresh tokens stored as httpOnly cookies
- Refresh token hashing in database (SHA-256)
- Token rotation on refresh
- Rate limiting (general + auth-specific)
- Input validation and sanitization
- Proper CORS configuration
- Centralized error handling
- All task queries scoped by userId

---

## UI/UX Notes

I focused on making the UI clean and responsive:

- Dashboard analytics widget
- Clear status indicators (pending / completed / overdue)
- Custom confirmation modal for deletions
- Proper loading states
- Fully responsive layout (including mobile fixes)

---

Built by Imaadh for the Twist Digital assessment.
