import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Tabela de cálculos salvos
export const calculations = mysqlTable("calculations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  country: varchar("country", { length: 100 }).notNull(),
  volume: int("volume").notNull(),
  messageType: mysqlEnum("messageType", ["marketing", "utility", "authentication"]).notNull(),
  currency: mysqlEnum("currency", ["USD", "BRL"]).notNull(),
  totalCost: varchar("totalCost", { length: 50 }).notNull(),
  costPerMessage: varchar("costPerMessage", { length: 50 }).notNull(),
  exchangeRate: varchar("exchangeRate", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Calculation = typeof calculations.$inferSelect;
export type InsertCalculation = typeof calculations.$inferInsert;

// Tabela de leads/contatos
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  surname: varchar("surname", { length: 255 }),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  country: varchar("country", { length: 100 }),
  volume: int("volume"),
  messageType: varchar("messageType", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

// Tabela de taxas por país
export const countryRates = mysqlTable("countryRates", {
  id: int("id").autoincrement().primaryKey(),
  country: varchar("country", { length: 100 }).notNull().unique(),
  marketingRate: varchar("marketingRate", { length: 20 }).notNull(),
  utilityRate: varchar("utilityRate", { length: 20 }).notNull(),
  authenticationRate: varchar("authenticationRate", { length: 20 }).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CountryRate = typeof countryRates.$inferSelect;
export type InsertCountryRate = typeof countryRates.$inferInsert;