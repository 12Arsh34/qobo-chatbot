# Qobo AI Knowledge Assistant

A full-stack Qobo-branded AI chatbot for answering questions about Qobo websites, mobile apps, AI agents, and business automation.

The app includes a premium React chat interface, JWT authentication, MongoDB-backed chat history, and an Express API that calls OpenRouter with a small Qobo knowledge base.

## Features

- Qobo-style AI assistant UI with responsive sidebar and chat area
- Login and signup with JWT authentication
- Protected chat routes
- Quick question prompts for common Qobo topics
- Persistent chat history grouped by date
- OpenRouter AI integration with fallback model support
- MongoDB storage for users and chats
- Rate limiting and centralized API error handling

## Tech Stack

Frontend:
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- Axios
- React Router

Backend:
- Node.js
- Express
- MongoDB with Mongoose
- JWT
- bcryptjs
- Axios
- OpenRouter API

## Project Structure

```text
qobo-chatbot/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      services/
      app.js
      server.js
    .env.example
    package.json

  frontend/
    src/
      components/
      context/
      hooks/
      pages/
      routes/
      services/
      main.jsx
    .env.example
    package.json
```

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB running locally or a MongoDB Atlas connection string
- OpenRouter API key

## Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/qobo-chatbot
JWT_SECRET=replace_with_a_strong_secret
OPENROUTER_API_KEY=your_openrouter_api_key
APP_URL=http://localhost:5173
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Note: the current frontend API client uses `http://localhost:5000/api` directly in `frontend/src/services/api.js`. If you deploy or change ports, update that file or wire it to `VITE_API_URL`.

## Installation

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## Running Locally

Start MongoDB first.

Start the backend:

```bash
cd backend
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

On Windows PowerShell, if `npm` is blocked by execution policy, use:

```bash
npm.cmd run dev
```

## Available Scripts

Backend:

```bash
npm run dev
npm start
```

Frontend:

```bash
npm run dev
npm run build
npm run preview
```

## API Overview

Health:

```text
GET /health
```

Auth:

```text
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me
```

Chat:

```text
POST   /api/chat/ask
GET    /api/chat/history
DELETE /api/chat/:id
```

Chat endpoints require a bearer token:

```text
Authorization: Bearer <token>
```

## AI Behavior

The assistant answers from the local Qobo knowledge base in `backend/src/services/knowledgeBase.js`.

The OpenRouter integration lives in `backend/src/services/openRouterService.js` and currently uses:

- Primary model: `google/gemini-2.5-flash`
- Fallback model: `openai/gpt-4o-mini`

If the requested information is not in the Qobo knowledge base, the assistant is instructed to avoid inventing details.

## Production Notes

- Replace `origin: '*'` in `backend/src/app.js` with your deployed frontend domain.
- Use a strong `JWT_SECRET`.
- Store secrets in your deployment provider, not in source control.
- Point the frontend API base URL to the deployed backend.
- Make sure MongoDB is reachable from the backend runtime.

## Troubleshooting

PowerShell blocks npm:

```bash
npm.cmd run dev
```

Backend says OpenRouter key is missing:

```text
Set OPENROUTER_API_KEY in backend/.env
```

Frontend cannot reach API:

```text
Confirm backend is running on port 5000 and frontend points to http://localhost:5000/api
```

MongoDB connection fails:

```text
Check MONGODB_URI and confirm MongoDB is running.
```

## License

Private project for Qobo Knowledge Assistant development.
