# PLAN.md – Task Management System

## Backend Choice: Express.js

I chose Express.js for the backend because it gives me full control over the middleware and authentication flow without adding extra abstraction. 

NestJS felt slightly heavy for the scope of this assessment, and using Next.js API routes would mix frontend and backend concerns. Keeping Express as a separate service makes deployment and scaling clearer and keeps responsibilities separated.

## Architecture Overview

```mermaid
Client (Next.js) → Express API → PostgreSQL (via Prisma)
```

- **Frontend**: Next.js (App Router) with TypeScript and Tailwind. Access token stored in memory, refresh token handled via httpOnly cookie.
- **Backend**: Express structured into routes → controllers → services → Prisma layer. This keeps business logic out of controllers and makes it easier to extend.
- **Database**: PostgreSQL with Prisma ORM. Core models: User, Task, RefreshToken.
- **Authentication Flow**:
  - Access token (15 minutes) returned in response body
  - Refresh token (7 days) stored in httpOnly cookie
  - Refresh token hashed in DB using SHA-256
  - Refresh token rotation on every refresh call

## Security Considerations

I focused on handling security at multiple layers:

- **Passwords**: Hashed using bcrypt (12 salt rounds).
- **Access Token Storage**: Stored in memory only (never localStorage) to reduce XSS risk.
- **Refresh Tokens**: Stored as httpOnly cookies (`secure`, `sameSite: strict`, path scoped). Token value is hashed before saving in the database.
- **Authorization**: All task queries are scoped by `userId` to prevent horizontal privilege escalation.
- **Input Validation**: express-validator used for request validation and sanitization.
- **Rate Limiting**: 
  - 100 requests / 15 min (general)
  - 10 requests / 15 min (auth routes)
- **Headers**: helmet for secure headers, hpp to prevent HTTP parameter pollution.
- **Error Handling**: Centralized error handler that hides stack traces in production.
- **CORS**: Explicit allowed origin and `credentials: true`.

## Novelty Feature

I added a task analytics widget on the dashboard that shows:
- Total tasks
- Completion percentage
- Pending count
- Overdue count
- Priority breakdown

This gives users a quick overview of their workload without needing additional pages.
