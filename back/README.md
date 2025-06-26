# Backend Service

## Description
Backend service built with NestJS that provides the API endpoints for the application.

## Requirements
- Node.js
- pnpm

## Local Development Setup

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm start:dev
```
The server will be running on `http://localhost:8000`

## Available Scripts

- `pnpm start:dev` - Runs the server in development mode with hot-reload
- `pnpm start:prod` - Runs the server in production mode
- `pnpm test` - Runs unit tests
- `pnpm test:e2e` - Runs end-to-end tests
- `pnpm test:cov` - Generates test coverage report

## Project Structure
```
src/
├── controllers/    # Route controllers
├── services/      # Business logic
├── entities/      # Database models
├── dto/           # Data transfer objects
└── main.ts        # Application entry point
```
