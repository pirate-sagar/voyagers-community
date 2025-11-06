export const BugReportStatus = {
	Investigating: 'Investigating',
	Confirmed: 'Confirmed',
	FixInProgress: 'Fix in Progress',
	Resolved: 'Resolved',
	CannotReproduce: 'Cannot Reproduce',
	ExpectedBehavior: 'Expected Behavior',
	Deferred: 'Deferred'
} as const;

export const FeatureRequestStatus = {
	Planned: 'Planned',
	InProgress: 'In Progress',
	UnderReview: 'Under Review',
	ExploringAlternatives: 'Exploring Alternatives',
	NotPlanned: 'Not Planned',
	Duplicate: 'Duplicate',
	Released: 'Released'
} as const;
