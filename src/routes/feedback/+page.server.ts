import { db } from '$lib/server/db';
import {
	bugReport,
	featureRequest,
	featureRequestUpvote,
	user as userSchema
} from '$lib/server/db/schema';
import { BugReportStatus, FeatureRequestStatus } from '$lib/types';
import { fail } from '@sveltejs/kit';
import { and, eq, sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

const adminEmails = ['admin@example.com']; // Add admin emails here

export const load: PageServerLoad = async ({ locals }) => {
	const bugReports = await db
		.select({
			id: bugReport.id,
			title: bugReport.title,
			description: bugReport.description,
			status: bugReport.status,
			user: {
				username: userSchema.username
			}
		})
		.from(bugReport)
		.leftJoin(userSchema, eq(bugReport.userId, userSchema.id));

	const featureRequests = await db
		.select({
			id: featureRequest.id,
			title: featureRequest.title,
			description: featureRequest.description,
			status: featureRequest.status,
			user: {
				username: userSchema.username
			},
			upvotes: sql<number>`count(${featureRequestUpvote.id})`
		})
		.from(featureRequest)
		.leftJoin(userSchema, eq(featureRequest.userId, userSchema.id))
		.leftJoin(featureRequestUpvote, eq(featureRequest.id, featureRequestUpvote.featureRequestId))
		.groupBy(featureRequest.id, userSchema.username);

	return {
		user: locals.user,
		bugReports,
		featureRequests,
		adminEmails
	};
};

export const actions: Actions = {
	createBugReport: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { createBugReport: { error: 'Unauthorized' } });
		}
		const formData = await request.formData();
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;

		if (!title || !description) {
			return fail(400, { createBugReport: { error: 'Title and description are required' } });
		}

		await db.insert(bugReport).values({
			title,
			description,
			userId: locals.user.id
		});

		return { createBugReport: { success: true } };
	},

	createFeatureRequest: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { createFeatureRequest: { error: 'Unauthorized' } });
		}
		const formData = await request.formData();
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;

		if (!title || !description) {
			return fail(400, { createFeatureRequest: { error: 'Title and description are required' } });
		}

		await db.insert(featureRequest).values({
			title,
			description,
			userId: locals.user.id
		});

		return { createFeatureRequest: { success: true } };
	},

	upvoteFeatureRequest: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { upvoteFeatureRequest: { error: 'Unauthorized' } });
		}
		const formData = await request.formData();
		const id = parseInt(formData.get('id') as string, 10);

		const [existingUpvote] = await db
			.select()
			.from(featureRequestUpvote)
			.where(
				and(
					eq(featureRequestUpvote.featureRequestId, id),
					eq(featureRequestUpvote.userId, locals.user.id)
				)
			);

		if (existingUpvote) {
			return fail(400, { upvoteFeatureRequest: { error: 'Already upvoted' } });
		}

		await db.insert(featureRequestUpvote).values({
			featureRequestId: id,
			userId: locals.user.id
		});

		return { upvoteFeatureRequest: { success: true } };
	},

	updateBugStatus: async ({ request, locals }) => {
		if (!locals.user || !adminEmails.includes(locals.user.email)) {
			return fail(403, { updateBugStatus: { error: 'Forbidden' } });
		}
		const formData = await request.formData();
		const id = parseInt(formData.get('id') as string, 10);
		const status = formData.get('status') as (typeof BugReportStatus)[keyof typeof BugReportStatus];

		if (!Object.values(BugReportStatus).includes(status)) {
			return fail(400, { updateBugStatus: { error: 'Invalid status' } });
		}

		await db.update(bugReport).set({ status }).where(eq(bugReport.id, id));

		return { updateBugStatus: { success: true } };
	},

	updateFeatureStatus: async ({ request, locals }) => {
		if (!locals.user || !adminEmails.includes(locals.user.email)) {
			return fail(403, { updateFeatureStatus: { error: 'Forbidden' } });
		}
		const formData = await request.formData();
		const id = parseInt(formData.get('id') as string, 10);
		const status = formData.get('status') as (typeof FeatureRequestStatus)[keyof typeof FeatureRequestStatus];

		if (!Object.values(FeatureRequestStatus).includes(status)) {
			return fail(400, { updateFeatureStatus: { error: 'Invalid status' } });
		}

		await db.update(featureRequest).set({ status }).where(eq(featureRequest.id, id));

		return { updateFeatureStatus: { success: true } };
	}
};
