import { 
  users, 
  passwords, 
  familyMembers,
  sharedPasswords,
  type User, 
  type InsertUser,
  type Password,
  type InsertPassword,
  type UpdatePassword,
  type FamilyMember 
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, or } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Password methods
  getPasswordsByUser(userId: string): Promise<Password[]>;
  getPassword(id: string, userId: string): Promise<Password | undefined>;
  createPassword(password: InsertPassword & { userId: string }): Promise<Password>;
  updatePassword(id: string, userId: string, updates: UpdatePassword): Promise<Password | undefined>;
  deletePassword(id: string, userId: string): Promise<boolean>;
  
  // Family methods
  getFamilyMembers(familyId: string): Promise<(FamilyMember & { user: User })[]>;
  addFamilyMember(familyId: string, userId: string, role?: "owner" | "member"): Promise<FamilyMember>;
  
  // Shared password methods
  getSharedPasswords(familyId: string): Promise<Password[]>;
  sharePassword(passwordId: string, familyId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getPasswordsByUser(userId: string): Promise<Password[]> {
    return await db
      .select()
      .from(passwords)
      .where(eq(passwords.userId, userId))
      .orderBy(desc(passwords.lastUsed), desc(passwords.createdAt));
  }

  async getPassword(id: string, userId: string): Promise<Password | undefined> {
    const [password] = await db
      .select()
      .from(passwords)
      .where(and(eq(passwords.id, id), eq(passwords.userId, userId)));
    return password || undefined;
  }

  async createPassword(passwordData: InsertPassword & { userId: string }): Promise<Password> {
    const [password] = await db
      .insert(passwords)
      .values(passwordData)
      .returning();
    return password;
  }

  async updatePassword(id: string, userId: string, updates: UpdatePassword): Promise<Password | undefined> {
    const [password] = await db
      .update(passwords)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(passwords.id, id), eq(passwords.userId, userId)))
      .returning();
    return password || undefined;
  }

  async deletePassword(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(passwords)
      .where(and(eq(passwords.id, id), eq(passwords.userId, userId)));
    return (result.rowCount || 0) > 0;
  }

  async getFamilyMembers(familyId: string): Promise<(FamilyMember & { user: User })[]> {
    const results = await db
      .select()
      .from(familyMembers)
      .innerJoin(users, eq(familyMembers.userId, users.id))
      .where(eq(familyMembers.familyId, familyId));
    
    return results.map(result => ({
      ...result.family_members,
      user: result.users
    }));
  }

  async addFamilyMember(familyId: string, userId: string, role: "owner" | "member" = "member"): Promise<FamilyMember> {
    const [member] = await db
      .insert(familyMembers)
      .values({ familyId, userId, role })
      .returning();
    return member;
  }

  async getSharedPasswords(familyId: string): Promise<Password[]> {
    const results = await db
      .select()
      .from(passwords)
      .innerJoin(sharedPasswords, eq(passwords.id, sharedPasswords.passwordId))
      .where(eq(sharedPasswords.familyId, familyId));
    
    return results.map(result => result.passwords);
  }

  async sharePassword(passwordId: string, familyId: string): Promise<void> {
    await db
      .insert(sharedPasswords)
      .values({ passwordId, familyId });
  }
}

export const storage = new DatabaseStorage();
