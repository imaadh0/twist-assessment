# TaskFlow

A simple, fast task management app built for the Twist Digital Associate SE assessment.

I built this using **Next.js** for the frontend and **Express** for the backend to keep things clean and separated.

## Why this stack?

- **Frontend**: Next.js (App Router) + Tailwind CSS. Fast, modern, and I love the component model.
- **Backend**: Express.js + Prisma. Solid, reliable, and gives me full control over the API structure.
- **Database**: PostgreSQL. The standard for relational data.

## Quick Start

1.  **Clone the repo**
    ```bash
    git clone https://github.com/your-username/twist-assessment.git
    cd twist-assessment
    ```

2.  **Setup Backend**
    ```bash
    cd backend
    cp .env.example .env  # Update DB credentials!
    npm install
    npx prisma migrate dev
    npm run dev
    ```

3.  **Setup Frontend**
    ```bash
    cd ../frontend
    cp .env.example .env.local
    npm install
    npm run dev
    ```

4.  **Open it up**
    Go to `http://localhost:3000`.

## Cool Stuff & Polishes

I spent some extra time on the UI/UX polish because I believe small details matter.
- **Custom Modals**: Instead of ugly browser alerts, I built a custom animated modal for deletions.
- **Visual Feedback**: Hover states, focus rings, and proper loading spinners.
- **Dashboard Widget**: A quick stats overview at the top (completion rate, overdue count, etc.).
- **Mobile Friendly**: The layout adapts smoothly to smaller screens (fixed the filter bar overflow issue!).

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Login (returns access token + httpOnly cookie) |
| GET | `/tasks` | Get all tasks (with filters) |
| POST | `/tasks` | Create task |
| PUT | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |

---
*Built by Imaadh for the Twist Digital assessment.*
