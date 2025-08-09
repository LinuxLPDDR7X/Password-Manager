import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  googleId: text("google_id").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  picture: text("picture"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const passwords = pgTable("passwords", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  username: text("username").notNull(),
  encryptedPassword: text("encrypted_password").notNull(),
  website: text("website"),
  icon: text("icon"),
  isFavorite: boolean("is_favorite").default(false),
  isShared: boolean("is_shared").default(false),
  strength: varchar("strength", { enum: ["weak", "medium", "strong"] }).default("medium"),
  lastUsed: timestamp("last_used"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const familyMembers = pgTable("family_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: varchar("role", { enum: ["owner", "member"] }).default("member"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sharedPasswords = pgTable("shared_passwords", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  passwordId: varchar("password_id").notNull().references(() => passwords.id, { onDelete: "cascade" }),
  familyId: varchar("family_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  passwords: many(passwords),
  familyMemberships: many(familyMembers),
}));

export const passwordsRelations = relations(passwords, ({ one, many }) => ({
  user: one(users, {
    fields: [passwords.userId],
    references: [users.id],
  }),
  sharedPasswords: many(sharedPasswords),
}));

export const familyMembersRelations = relations(familyMembers, ({ one }) => ({
  user: one(users, {
    fields: [familyMembers.userId],
    references: [users.id],
  }),
}));

export const sharedPasswordsRelations = relations(sharedPasswords, ({ one }) => ({
  password: one(passwords, {
    fields: [sharedPasswords.passwordId],
    references: [passwords.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertPasswordSchema = createInsertSchema(passwords).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  lastUsed: true,
});

export const updatePasswordSchema = insertPasswordSchema.partial();

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPassword = z.infer<typeof insertPasswordSchema>;
export type UpdatePassword = z.infer<typeof updatePasswordSchema>;
export type Password = typeof passwords.$inferSelect;
export type FamilyMember = typeof familyMembers.$inferSelect;
export type SharedPassword = typeof sharedPasswords.$inferSelect;
