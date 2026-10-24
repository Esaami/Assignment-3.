# Assignment 3 - Employee Management

## Setup
1. Install Node.js (LTS).
2. Open this `Casestudy2` folder in VS Code.
3. Run `npm install` in the VS Code terminal.
4. Copy `.env.example` to `.env` and replace the sample `MONGO_URI` with your MongoDB Atlas connection string.
5. In MongoDB Atlas, allow your current IP address and create a database user.
6. Run `npm start`.
7. Open http://localhost:3000

## API endpoints
- `GET /api/employeelist` — list employees
- `GET /api/employeelist/:id` — get one employee
- `POST /api/employeelist` — create employee; JSON body: `name`, `location`, `position`, `salary`
- `PUT /api/employeelist` — update employee; include `_id` (or `id`) plus fields to change
- `DELETE /api/employeelist/:id` — delete employee

The database connection string is intentionally not included; use your own MongoDB Atlas credentials and never commit `.env` to GitHub.
