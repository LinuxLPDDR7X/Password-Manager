# FamilyVault - Secure Password Manager

A modern, secure password management application designed for families, featuring Google OAuth authentication and encrypted password storage.

## Features

### 🔐 Security
- **Google OAuth 2.0 Authentication**: Secure sign-in using your Google account
- **Client-side Encryption**: Passwords are encrypted before being stored
- **Session Management**: Secure session handling with PostgreSQL storage
- **Password Strength Analysis**: Real-time password strength evaluation

### 👨‍👩‍👧‍👦 Family Features
- **Family Sharing**: Share passwords securely with family members
- **Role-based Access**: Owner and member roles for family groups
- **Individual Vaults**: Personal password storage for each family member

### 💻 Modern Interface
- **Clean, Responsive Design**: Modern UI/UX with Tailwind CSS
- **Dark/Light Theme Support**: Seamless theme switching
- **Interactive Components**: Built with Radix UI primitives
- **Mobile-friendly**: Responsive design that works on all devices

### 🔧 Management Features
- **Password Generator**: Generate strong passwords automatically
- **Favorites**: Mark frequently used passwords
- **Search & Filter**: Quickly find passwords by name or category
- **Copy to Clipboard**: One-click password copying
- **Password Categories**: Organize passwords by strength and usage

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **TanStack Query** for state management
- **Wouter** for routing

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** with Neon serverless driver
- **Drizzle ORM** for database operations
- **Google OAuth 2.0** for authentication
- **Express Sessions** with PostgreSQL store

### Security
- **Client-side encryption** utilities
- **Secure session management**
- **CSRF protection**
- **Input validation** with Zod schemas

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database
- Google OAuth 2.0 credentials

### Environment Variables
You'll need to set up the following environment variables:

```bash
# Database (automatically configured in Replit)
DATABASE_URL=your_postgresql_connection_string

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_ID=your_google_client_id

# Session Security
SESSION_SECRET=your_session_secret_key
```

### Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   ```bash
   # Push schema to database
   npm run db:push
   ```

3. **Google OAuth Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add your domain to authorized origins
   - Set the client ID in environment variables

4. **Start Development Server**
   ```bash
   npm run dev
   ```

### Database Schema

The application uses the following main tables:

- **users**: Store user profiles from Google OAuth
- **passwords**: Encrypted password storage
- **family_members**: Family group management
- **shared_passwords**: Password sharing relationships

## Usage

1. **Sign In**: Use your Google account to sign in
2. **Add Passwords**: Click "Add Password" to store new credentials
3. **Manage Passwords**: View, edit, and organize your passwords
4. **Share with Family**: Enable sharing for specific passwords
5. **Generate Strong Passwords**: Use the built-in password generator

## Security Notes

- Passwords are encrypted client-side before storage
- Google OAuth ensures secure authentication
- Sessions are stored securely in PostgreSQL
- No plaintext passwords are stored in the database
- Regular security updates and monitoring

## Development

### Project Structure
```
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Application pages
│   │   ├── lib/         # Utilities and auth
│   │   └── hooks/       # Custom React hooks
├── server/              # Express backend
│   ├── db.ts           # Database connection
│   ├── routes.ts       # API routes
│   └── storage.ts      # Data access layer
└── shared/             # Shared types and schemas
    └── schema.ts       # Database schema
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npm run db:generate` - Generate migration files

## Contributing

This is a family password manager project. Contributions should focus on:

- Security improvements
- UI/UX enhancements
- Family sharing features
- Mobile responsiveness
- Performance optimizations

## License

Private family project - not for commercial use.

---

**Security First**: This application prioritizes security and privacy for family password management. Always keep your Google account secure and use strong, unique passwords.