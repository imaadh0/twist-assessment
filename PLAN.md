# PLAN.md – Task Management System

## Backend Choice

I chose Express.js for the backend because it gives me full control over how middleware and authentication are handled without adding unnecessary abstraction.

NestJS felt a bit heavy for the scope of this assessment, and using Next.js API routes would mix frontend and backend concerns. Keeping the API as a separate Express service makes the architecture cleaner and easier to deploy independently.

## Architecture Overview

Client (Next.js) → Express API → PostgreSQL (via Prisma)

- **Frontend**: Next.js (App Router) with TypeScript and Tailwind CSS.  
  The access token is stored in memory, while the refresh token is stored in an httpOnly cookie.

- **Backend**: Structured into routes → controllers → services → Prisma layer.  
  Controllers handle request/response logic, while services contain business logic. This separation keeps the code easier to reason about and extend.

- **Database**: PostgreSQL with Prisma ORM.  
  Main models: `User`, `Task`, and `RefreshToken`.

## Authentication Flow

- Access token (15 minutes) returned in the response body
- Refresh token (7 days) stored in an httpOnly cookie
- Refresh tokens are hashed in the database using SHA-256
- Refresh tokens are rotated on every refresh request

This allows short-lived access tokens while keeping sessions secure.

## Security Considerations

I tried to approach security in layers rather than relying on a single mechanism.

- **Passwords**: Hashed using bcrypt (12 salt rounds).
- **Access Token Storage**: Stored in memory only (never localStorage) to reduce XSS exposure.
- **Refresh Tokens**: Stored as httpOnly cookies (`secure`, `sameSite: strict`, path-scoped). The token value is hashed before being stored in the database.
- **Authorization**: All task queries are scoped by `userId` to prevent horizontal privilege escalation.
- **Input Validation**: express-validator is used to validate and sanitize requests.
- **Rate Limiting**:
  - 100 requests / 15 min (general)
  - 10 requests / 15 min (auth routes)
- **Headers**: helmet for secure headers, hpp to prevent HTTP parameter pollution.
- **Error Handling**: Centralized error handler that hides stack traces in production.
- **CORS**: Explicit allowed origin with `credentials: true`.

## Extra Feature

I added a task analytics widget on the dashboard that shows:

- Total tasks
- Completion percentage
- Pending count
- Overdue count
- Priority breakdown

The goal was to give users a quick overview of their workload without needing extra navigation.
