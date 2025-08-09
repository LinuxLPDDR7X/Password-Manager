import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPasswordSchema, updatePasswordSchema } from "@shared/schema";
import { OAuth2Client } from "google-auth-library";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";

const PgSession = connectPgSimple(session);

// Initialize Google OAuth client
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID
);

declare module "express-session" {
  interface SessionData {
    userId?: string;
    user?: {
      id: string;
      email: string;
      name: string;
      picture?: string;
    };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  app.use(session({
    store: new PgSession({
      pool: pool,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }));

  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // Google OAuth verification
  app.post("/api/auth/google", async (req, res) => {
    try {
      const { credential } = req.body;
      
      if (!credential) {
        return res.status(400).json({ message: "Google credential required" });
      }

      // Verify the Google token
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        return res.status(400).json({ message: "Invalid Google token" });
      }

      const { sub: googleId, email, name, picture } = payload;

      if (!email || !name) {
        return res.status(400).json({ message: "Email and name required from Google" });
      }

      // Check if user exists
      let user = await storage.getUserByGoogleId(googleId);
      
      if (!user) {
        // Create new user
        user = await storage.createUser({
          googleId,
          email,
          name,
          picture: picture || undefined,
        });
      }

      // Set session
      req.session.userId = user.id;
      req.session.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture || undefined,
      };

      res.json({ user: req.session.user });
    } catch (error) {
      console.error("Google auth error:", error);
      res.status(500).json({ message: "Authentication failed" });
    }
  });

  // Get current user
  app.get("/api/auth/me", requireAuth, async (req, res) => {
    res.json({ user: req.session.user });
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get user's passwords
  app.get("/api/passwords", requireAuth, async (req, res) => {
    try {
      const passwords = await storage.getPasswordsByUser(req.session.userId!);
      res.json(passwords);
    } catch (error) {
      console.error("Get passwords error:", error);
      res.status(500).json({ message: "Failed to fetch passwords" });
    }
  });

  // Create new password
  app.post("/api/passwords", requireAuth, async (req, res) => {
    try {
      const validatedData = insertPasswordSchema.parse(req.body);
      const password = await storage.createPassword({
        ...validatedData,
        userId: req.session.userId!,
      });
      res.json(password);
    } catch (error) {
      console.error("Create password error:", error);
      res.status(500).json({ message: "Failed to create password" });
    }
  });

  // Update password
  app.patch("/api/passwords/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = updatePasswordSchema.parse(req.body);
      
      const password = await storage.updatePassword(id, req.session.userId!, validatedData);
      if (!password) {
        return res.status(404).json({ message: "Password not found" });
      }
      
      res.json(password);
    } catch (error) {
      console.error("Update password error:", error);
      res.status(500).json({ message: "Failed to update password" });
    }
  });

  // Delete password
  app.delete("/api/passwords/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deletePassword(id, req.session.userId!);
      
      if (!success) {
        return res.status(404).json({ message: "Password not found" });
      }
      
      res.json({ message: "Password deleted successfully" });
    } catch (error) {
      console.error("Delete password error:", error);
      res.status(500).json({ message: "Failed to delete password" });
    }
  });

  // Get password by ID
  app.get("/api/passwords/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const password = await storage.getPassword(id, req.session.userId!);
      
      if (!password) {
        return res.status(404).json({ message: "Password not found" });
      }
      
      res.json(password);
    } catch (error) {
      console.error("Get password error:", error);
      res.status(500).json({ message: "Failed to fetch password" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
