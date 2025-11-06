import { pgTable, serial, integer, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	email: text('email').notNull().unique(),
	organizationId: text('organization_id'), //active organization
	projectId: text('project_id'), //active project
	emailVerified: boolean('email_verified').notNull().default(false),
	country: text('country'),
	passwordHash: text('password_hash').notNull()
});


export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});


export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
