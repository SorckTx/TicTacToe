# Frontend Application

## Description
Frontend application built with Next.js that provides the user interface for the application.

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
pnpm dev
```
The application will be running on `http://localhost:3000`

## Available Scripts

- `pnpm dev` - Runs the app in development mode
- `pnpm build` - Builds the app for production
- `pnpm start` - Runs the built app in production mode
- `pnpm lint` - Runs the linter
- `pnpm test` - Runs the test suite

## Project Structure
```
src/
├── common/       # Reusable React components
├── sections/     # Pages sections (Home, About, Contact, etc.)
├── pages/        # Application routes
├── styles/       # Global styles
├── utils/        # Utility functions
└── api/          # API integration
```
