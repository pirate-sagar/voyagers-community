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

export const bugReport = pgTable('bug_report', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description').notNull(),
	status: text('status', {
		enum: [
			'Investigating',
			'Confirmed',
			'Fix in Progress',
			'Resolved',
			'Cannot Reproduce',
			'Expected Behavior',
			'Deferred'
		]
	})
		.notNull()
		.default('Investigating'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
});

export const featureRequest = pgTable('feature_request', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description').notNull(),
	status: text('status', {
		enum: [
			'Planned',
			'In Progress',
			'Under Review',
			'Exploring Alternatives',
			'Not Planned',
			'Duplicate',
			'Released'
		]
	})
		.notNull()
		.default('Planned'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
});

export const featureRequestUpvote = pgTable('feature_request_upvote', {
	id: serial('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	featureRequestId: integer('feature_request_id')
		.notNull()
		.references(() => featureRequest.id),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type BugReport = typeof bugReport.$inferSelect;
export type FeatureRequest = typeof featureRequest.$inferSelect;
export type FeatureRequestUpvote = typeof featureRequestUpvote.$inferSelect;
