# FamilyVault - Secure Password Manager

## Overview

FamilyVault is a secure password management application designed for families, featuring Google OAuth authentication and encrypted password storage. The application allows families to securely store, manage, and share passwords with role-based access controls. It provides a clean, modern interface for password management with features like password strength analysis, favorites, and family sharing capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Authentication**: Google OAuth 2.0 integration with express-session
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **API Design**: RESTful API endpoints with middleware for authentication
- **Development**: Hot module replacement with Vite in development mode

### Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Session Store**: PostgreSQL table for session persistence

### Authentication and Authorization
- **OAuth Provider**: Google Sign-In integration with client-side and server-side verification
- **Session Management**: Express sessions with secure cookie configuration
- **Authorization**: Middleware-based route protection requiring authenticated sessions
- **User Management**: Google ID-based user identification with email and profile data storage

### External Dependencies
- **Google APIs**: Google OAuth 2.0 client library for authentication
- **Database**: Neon PostgreSQL serverless database
- **UI Libraries**: Extensive Radix UI component library for accessible primitives
- **Encryption**: Client-side password encryption utilities (basic implementation)
- **Icons**: Font Awesome for iconography
- **Fonts**: Google Fonts (Inter) for typography

### Security Features
- **Password Encryption**: Client-side encryption before storage
- **Session Security**: HTTP-only cookies with secure flags in production
- **CSRF Protection**: Session-based authentication with proper cookie configuration
- **Input Validation**: Zod schemas for both client and server-side validation
- **Password Strength Analysis**: Built-in password strength evaluation

### Development and Deployment
- **Development**: Hot reload with Vite and TypeScript compilation
- **Build Process**: Vite for frontend bundling, esbuild for backend compilation
- **Environment**: Separate development and production configurations
- **Code Quality**: TypeScript strict mode with comprehensive type checking