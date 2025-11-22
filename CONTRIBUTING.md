# Contributing to MelodyFetch

Thank you for your interest in contributing to MelodyFetch! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct
Be respectful, inclusive, and professional in all interactions. We're committed to providing a welcoming environment for all contributors.

## How to Contribute

### 1. Fork and Clone
```bash
git clone <your-fork-url>
cd New
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 3. Make Your Changes
- Follow the existing code style and conventions
- Keep commits atomic and well-documented
- Test your changes thoroughly

### 4. Commit Guidelines
- Use clear, concise commit messages
- Format: `type(scope): description`
  - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
  - Example: `feat(backend): add playlist caching mechanism`

### 5. Push and Create a Pull Request
```bash
git push origin feature/your-feature-name
```

## Development Setup

### Backend Development
```bash
cd backend
npm install
# Create .env with required variables
npm run dev
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

## Code Standards

### Backend (Node.js)
- Use ES6+ syntax
- Follow the existing project structure
- Add comments for complex logic
- Use meaningful variable names

### Frontend (React/Next.js)
- Use functional components and hooks
- Follow React best practices
- Use descriptive component names
- Keep components focused and reusable

## Testing
- Write tests for new features
- Ensure all tests pass before submitting PR
- Run linters before committing

## Reporting Issues
- Check existing issues before creating a new one
- Provide detailed description and steps to reproduce
- Include your environment details (OS, Node version, etc.)

## Questions?
Open an issue or reach out to the maintainers for guidance.

Thank you for contributing!
