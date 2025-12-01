<script lang="ts">
	import { enhance } from '$app/forms';
	import { BugReportStatus, FeatureRequestStatus } from '$lib/types';
	import type { ActionData, PageData } from './$types';
	import {
		ArrowUp,
		Bug,
		Lightbulb,
		CheckCircle2,
		MessageCircle,
		Search,
		Sparkles,
		TrendingUp,
		Users,
		Loader2
	} from 'lucide-svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let currentTab = $state<'bugs' | 'features'>('features');
	let searchQuery = $state('');
	let sortBy = $state<'newest' | 'popular'>('newest');

	// Loading states
	let isSubmittingBug = $state(false);
	let isSubmittingFeature = $state(false);
	let upvotingIds = $state<Set<number>>(new Set());
	let updatingStatusIds = $state<Set<number>>(new Set());

	const isAdmin = $derived(data.user && data.adminEmails.includes(data.user.email));

	const successStatuses = ['Resolved', 'Released', 'Implemented'];
	const inProgressStatuses = ['Investigating', 'In Progress', 'Planned'];

	let filteredBugs = $derived(
		data.bugReports.filter(
			(bug) =>
				bug.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				bug.description.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	let filteredFeatures = $derived(
		data.featureRequests.filter(
			(feature) =>
				feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				feature.description.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	let sortedFeatures = $derived(
		sortBy === 'popular' ? [...filteredFeatures].sort((a, b) => b.upvotes - a.upvotes) : filteredFeatures
	);

	let totalUpvotes = $derived(data.featureRequests.reduce((sum, request) => sum + Number(request.upvotes), 0));
	let plannedFeatures = $derived(
		data.featureRequests.filter((request) => inProgressStatuses.includes(request.status)).length
	);
	let shippedFeatures = $derived(
		data.featureRequests.filter((request) => successStatuses.includes(request.status)).length
	);
	let activeBugs = $derived(data.bugReports.filter((bug) => !successStatuses.includes(bug.status)).length);

	function getStatusColor(status: string) {
		if (successStatuses.includes(status)) {
			return 'badge-success';
		}
		if (inProgressStatuses.includes(status)) {
			return 'badge-info';
		}
		if (status === 'Under Review' || status === 'Exploring Alternatives') {
			return 'badge-warning';
		}
		return 'badge-error';
	}

	function handleBugSubmit() {
		isSubmittingBug = true;
		return async ({ update }: { update: () => Promise<void> }) => {
			await update();
			isSubmittingBug = false;
		};
	}

	function handleFeatureSubmit() {
		isSubmittingFeature = true;
		return async ({ update }: { update: () => Promise<void> }) => {
			await update();
			isSubmittingFeature = false;
		};
	}

	function handleUpvote(id: number) {
		upvotingIds = new Set([...upvotingIds, id]);
		return async ({ update }: { update: () => Promise<void> }) => {
			await update();
			upvotingIds = new Set([...upvotingIds].filter(x => x !== id));
		};
	}

	function handleStatusUpdate(id: number) {
		updatingStatusIds = new Set([...updatingStatusIds, id]);
		return async ({ update }: { update: () => Promise<void> }) => {
			await update();
			updatingStatusIds = new Set([...updatingStatusIds].filter(x => x !== id));
		};
	}
</script>

<svelte:head>
	<title>Feedback - Voyagers Community</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-base-200 via-base-100 to-white py-10 sm:py-14">
	<div class="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
		<!-- Hero Section -->
		<section class="rounded-3xl border border-base-200 bg-white p-8 shadow-xl">
			<div class="flex flex-col gap-8 lg:flex-row lg:items-center">
				<div class="flex-1 space-y-5">
					<span class="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-primary">
						<Sparkles class="h-4 w-4" />
						Community Pulse
					</span>
					<h1 class="text-4xl font-bold text-base-content md:text-5xl">Feedback Hub</h1>
					<p class="text-lg text-base-content/70">
						Help shape our product by sharing new ideas, reporting bugs, and supporting the features that matter most to you.
					</p>
					{#if data.user}
						<div class="inline-flex items-center gap-3 rounded-2xl border border-base-200 bg-base-100 px-4 py-2.5 text-sm font-semibold text-base-content shadow-sm">
							<span class="flex h-2 w-2 rounded-full bg-success animate-pulse"></span>
							<Users class="h-4 w-4 text-primary" />
							Logged in as <span class="text-primary">{data.user.username}</span>
						</div>
					{:else}
						<div class="flex flex-wrap gap-3">
							<a href="/auth/login" class="btn btn-primary shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-transform">
								Sign in to contribute
							</a>
						</div>
					{/if}
				</div>
				<div class="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2">
					<div class="rounded-2xl border border-base-200 bg-gradient-to-br from-base-100 to-primary/5 p-5 shadow-sm transition hover:shadow-md">
						<TrendingUp class="h-5 w-5 text-primary" />
						<p class="mt-3 text-xs font-semibold uppercase tracking-wide text-base-content/50">Total Upvotes</p>
						<p class="text-3xl font-bold text-base-content">{totalUpvotes}</p>
					</div>
					<div class="rounded-2xl border border-base-200 bg-gradient-to-br from-base-100 to-secondary/5 p-5 shadow-sm transition hover:shadow-md">
						<Lightbulb class="h-5 w-5 text-secondary" />
						<p class="mt-3 text-xs font-semibold uppercase tracking-wide text-base-content/50">Ideas in Motion</p>
						<p class="text-3xl font-bold text-base-content">{plannedFeatures}</p>
					</div>
					<div class="rounded-2xl border border-base-200 bg-gradient-to-br from-base-100 to-success/5 p-5 shadow-sm transition hover:shadow-md">
						<CheckCircle2 class="h-5 w-5 text-success" />
						<p class="mt-3 text-xs font-semibold uppercase tracking-wide text-base-content/50">Shipped Wins</p>
						<p class="text-3xl font-bold text-base-content">{shippedFeatures}</p>
					</div>
					<div class="rounded-2xl border border-base-200 bg-gradient-to-br from-base-100 to-error/5 p-5 shadow-sm transition hover:shadow-md">
						<Bug class="h-5 w-5 text-error" />
						<p class="mt-3 text-xs font-semibold uppercase tracking-wide text-base-content/50">Active Bugs</p>
						<p class="text-3xl font-bold text-base-content">{activeBugs}</p>
					</div>
				</div>
			</div>
		</section>

		{#if data.user}
			<section class="space-y-8">
				<!-- Tab Navigation -->
				<div class="rounded-full border border-base-200 bg-white p-1.5 shadow-sm">
					<div class="flex flex-wrap gap-2">
						<button
							onclick={() => (currentTab = 'features')}
							class={`flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all sm:flex-none ${
								currentTab === 'features'
									? 'bg-primary text-primary-content shadow-lg shadow-primary/30'
									: 'text-base-content/60 hover:bg-base-100 hover:text-base-content'
							}`}
							aria-pressed={currentTab === 'features'}
						>
							<Lightbulb class="h-4 w-4" />
							Feature Requests
							<span class={`rounded-full px-2.5 py-0.5 text-xs font-bold ${currentTab === 'features' ? 'bg-white/20 text-white' : 'bg-base-200 text-base-content/70'}`}>
								{data.featureRequests.length}
							</span>
						</button>
						<button
							onclick={() => (currentTab = 'bugs')}
							class={`flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all sm:flex-none ${
								currentTab === 'bugs'
									? 'bg-error text-black shadow-lg shadow-error/30'
									: 'text-base-content/60 hover:bg-base-100 hover:text-base-content'
							}`}
							aria-pressed={currentTab === 'bugs'}
						>
							<Bug class="h-4 w-4" />
							Bug Reports
							<span class={`rounded-full px-2.5 py-0.5 text-xs font-bold ${currentTab === 'bugs' ? 'bg-error-content text-error' : 'bg-base-200 text-base-content/70'}`}>
								{data.bugReports.length}
							</span>
						</button>
					</div>
				</div>

				<div class="grid gap-8 lg:grid-cols-3">
					<!-- Left Column - Forms -->
					<div class="space-y-6 lg:col-span-1">
						{#if currentTab === 'bugs'}
							<div class="rounded-2xl border border-base-200 bg-white p-6 shadow-lg">
								<div class="mb-5 flex items-center gap-3">
									<div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-error/10 text-error">
										<Bug class="h-6 w-6" />
									</div>
									<div>
										<p class="text-xs font-semibold uppercase tracking-wide text-base-content/50">Quality Watch</p>
										<h2 class="text-xl font-bold text-base-content">Report a Bug</h2>
									</div>
								</div>
								<form method="POST" action="?/createBugReport" use:enhance={handleBugSubmit} class="space-y-4">
									<div class="space-y-2">
										<label for="bug-title" class="block text-sm font-semibold text-base-content">Title</label>
										<input
											id="bug-title"
											name="title"
											type="text"
											placeholder="Describe the bug in one line"
											class="w-full rounded-xl border border-base-300 bg-base-50 px-4 py-3 text-base text-base-content placeholder-base-content/40 transition focus:border-error focus:bg-white focus:ring-2 focus:ring-error/20"
											required
											disabled={isSubmittingBug}
										/>
									</div>
									<div class="space-y-2">
										<label for="bug-description" class="block text-sm font-semibold text-base-content">Description</label>
										<textarea
											id="bug-description"
											name="description"
											placeholder="Provide detailed information about the bug..."
											class="h-32 w-full resize-none rounded-xl border border-base-300 bg-base-50 px-4 py-3 text-base text-base-content placeholder-base-content/40 transition focus:border-error focus:bg-white focus:ring-2 focus:ring-error/20"
											required
											disabled={isSubmittingBug}
										></textarea>
									</div>
									<button
										type="submit"
										disabled={isSubmittingBug}
										class="w-full rounded-xl bg-gradient-to-r from-rose-500 to-red-500 py-3.5 font-semibold text-white shadow-lg shadow-rose-200/50 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
									>
										{#if isSubmittingBug}
											<span class="inline-flex items-center gap-2">
												<Loader2 class="h-4 w-4 animate-spin" />
												Submitting...
											</span>
										{:else}
											Submit Bug Report
										{/if}
									</button>
									{#if form?.createBugReport && 'error' in form.createBugReport}
										<div class="rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-sm font-medium text-error">
											{form.createBugReport.error}
										</div>
									{/if}
									{#if form?.createBugReport && 'success' in form.createBugReport}
										<div class="rounded-xl border border-green-700 bg-green-900 px-4 py-3 text-sm font-medium text-white">
											Bug report submitted successfully!
										</div>
									{/if}
								</form>
							</div>
						{/if}

						{#if currentTab === 'features'}
							<div class="rounded-2xl border border-base-200 bg-white p-6 shadow-lg">
								<div class="mb-5 flex items-center gap-3">
									<div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
										<Lightbulb class="h-6 w-6" />
									</div>
									<div>
										<p class="text-xs font-semibold uppercase tracking-wide text-base-content/50">Inspire Us</p>
										<h2 class="text-xl font-bold text-base-content">Request a Feature</h2>
									</div>
								</div>
								<form method="POST" action="?/createFeatureRequest" use:enhance={handleFeatureSubmit} class="space-y-4">
									<div class="space-y-2">
										<label for="feature-title" class="block text-sm font-semibold text-base-content">Title</label>
										<input
											id="feature-title"
											name="title"
											type="text"
											placeholder="What feature would you like?"
											class="w-full rounded-xl border border-base-300 bg-base-50 px-4 py-3 text-base text-base-content placeholder-base-content/40 transition focus:border-secondary focus:bg-white focus:ring-2 focus:ring-secondary/20"
											required
											disabled={isSubmittingFeature}
										/>
									</div>
									<div class="space-y-2">
										<label for="feature-description" class="block text-sm font-semibold text-base-content">Description</label>
										<textarea
											id="feature-description"
											name="description"
											placeholder="Explain why this feature would be useful..."
											class="h-32 w-full resize-none rounded-xl border border-base-300 bg-base-50 px-4 py-3 text-base text-base-content placeholder-base-content/40 transition focus:border-secondary focus:bg-white focus:ring-2 focus:ring-secondary/20"
											required
											disabled={isSubmittingFeature}
										></textarea>
									</div>
									<button
										type="submit"
										disabled={isSubmittingFeature}
										class="w-full rounded-xl bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 py-3.5 font-semibold text-white shadow-lg shadow-purple-200/50 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
									>
										{#if isSubmittingFeature}
											<span class="inline-flex items-center gap-2">
												<Loader2 class="h-4 w-4 animate-spin" />
												Submitting...
											</span>
										{:else}
											Submit Feature Request
										{/if}
									</button>
									{#if form?.createFeatureRequest && 'error' in form.createFeatureRequest}
										<div class="rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-sm font-medium text-error">
											{form.createFeatureRequest.error}
										</div>
									{/if}
									{#if form?.createFeatureRequest && 'success' in form.createFeatureRequest}
										<div class="rounded-xl border border-green-700 bg-green-900 px-4 py-3 text-sm font-medium text-white">
											Feature request submitted successfully!
										</div>
									{/if}
								</form>
							</div>
						{/if}
					</div>

					<!-- Right Column - List -->
					<div class="space-y-6 lg:col-span-2">
						<!-- Search and Filter Bar -->
						<div class="rounded-2xl border border-base-200 bg-white p-4 shadow-sm">
							<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
								<div class="relative flex-1">
									<Search class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/40" />
									<input
										type="text"
										placeholder="Search feedback..."
										bind:value={searchQuery}
										class="w-full rounded-xl border border-base-200 bg-base-50 px-12 py-3 text-base text-base-content placeholder-base-content/40 transition focus:border-primary/40 focus:bg-white focus:ring-2 focus:ring-primary/10"
									/>
								</div>

								{#if currentTab === 'features'}
									<select
										bind:value={sortBy}
										class="rounded-xl border border-base-200 bg-base-50 px-4 py-3 text-sm font-semibold text-base-content transition focus:border-primary/40 focus:bg-white focus:outline-none"
									>
										<option value="newest">Newest first</option>
										<option value="popular">Most upvotes</option>
									</select>
								{/if}
							</div>
						</div>

						<!-- Items List -->
						<div class="space-y-4">
							{#if currentTab === 'bugs'}
								{#if filteredBugs.length === 0}
									<div class="rounded-2xl border-2 border-dashed border-base-300 bg-base-100 p-12 text-center">
										<Bug class="mx-auto h-14 w-14 text-base-content/30" />
										<p class="mt-4 text-lg font-semibold text-base-content">
											{searchQuery ? 'No bugs match your search' : 'No bugs reported yet'}
										</p>
										<p class="mt-1 text-sm text-base-content/60">
											{searchQuery ? 'Try different keywords' : 'Be the first to report an issue!'}
										</p>
									</div>
								{:else}
									{#each filteredBugs as bug (bug.id)}
										<div class="group rounded-2xl border border-base-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-base-300">
											<div class="flex items-start justify-between gap-4">
												<div class="flex-1">
													<div class="flex items-start gap-4">
														<div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-error/10 text-error transition group-hover:bg-error/15">
															<Bug class="h-5 w-5" />
														</div>
														<div class="min-w-0 flex-1">
															<h3 class="text-lg font-semibold text-base-content">{bug.title}</h3>
															<p class="mt-1.5 text-sm text-base-content/60 line-clamp-2">{bug.description}</p>
															<div class="mt-3 flex flex-wrap items-center gap-2">
																<span class={`badge badge-sm border-none text-[0.65rem] font-bold uppercase tracking-wide ${getStatusColor(bug.status)}`}>
																	{bug.status}
																</span>
																<span class="text-xs text-base-content/50">by <span class="font-medium text-base-content/70">{bug.user?.username ?? 'Unknown'}</span></span>
															</div>
														</div>
													</div>
												</div>

												{#if isAdmin}
													<form method="POST" action="?/updateBugStatus" use:enhance={() => handleStatusUpdate(bug.id)} class="shrink-0">
														<input type="hidden" name="id" value={bug.id} />
														<select
															name="status"
															disabled={updatingStatusIds.has(bug.id)}
															class="rounded-xl border border-base-200 bg-base-50 px-3 py-1.5 text-xs font-semibold text-base-content transition focus:border-primary/50 focus:bg-white focus:outline-none disabled:opacity-50"
															onchange={(e) => e.currentTarget.form?.requestSubmit()}
														>
															{#each Object.values(BugReportStatus) as status}
																<option value={status} selected={bug.status === status}>
																	{status}
																</option>
															{/each}
														</select>
													</form>
												{/if}
											</div>
										</div>
									{/each}
								{/if}
							{/if}

							{#if currentTab === 'features'}
								{#if sortedFeatures.length === 0}
									<div class="rounded-2xl border-2 border-dashed border-base-300 bg-base-100 p-12 text-center">
										<Lightbulb class="mx-auto h-14 w-14 text-base-content/30" />
										<p class="mt-4 text-lg font-semibold text-base-content">
											{searchQuery ? 'No features match your search' : 'No feature requests yet'}
										</p>
										<p class="mt-1 text-sm text-base-content/60">
											{searchQuery ? 'Try different keywords' : 'Be the first to request a feature!'}
										</p>
									</div>
								{:else}
									{#each sortedFeatures as request (request.id)}
										<div class="group rounded-2xl border border-base-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-base-300">
											<div class="flex items-start justify-between gap-4">
												<div class="flex-1">
													<div class="flex items-start gap-4">
														<div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary transition group-hover:bg-secondary/15">
															<Lightbulb class="h-5 w-5" />
														</div>
														<div class="min-w-0 flex-1">
															<h3 class="text-lg font-semibold text-base-content">{request.title}</h3>
															<p class="mt-1.5 text-sm text-base-content/60 line-clamp-2">{request.description}</p>
															<div class="mt-3 flex flex-wrap items-center gap-2">
																<span class={`badge badge-sm border-none text-[0.65rem] font-bold uppercase tracking-wide ${getStatusColor(request.status)}`}>
																	{request.status}
																</span>
																<span class="text-xs text-base-content/50">by <span class="font-medium text-base-content/70">{request.user?.username ?? 'Unknown'}</span></span>
															</div>
														</div>
													</div>
												</div>

												<div class="shrink-0 flex flex-col items-end gap-2">
													<form method="POST" action="?/upvoteFeatureRequest" use:enhance={() => handleUpvote(request.id)} class="contents">
														<input type="hidden" name="id" value={request.id} />
														<button
															type="submit"
															disabled={upvotingIds.has(request.id)}
															class="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-bold text-primary transition-all hover:border-primary/40 hover:bg-primary/10 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
														>
															{#if upvotingIds.has(request.id)}
																<Loader2 class="h-4 w-4 animate-spin" />
															{:else}
																<ArrowUp class="h-4 w-4" />
															{/if}
															<span>{request.upvotes}</span>
														</button>
													</form>

													{#if isAdmin}
														<form method="POST" action="?/updateFeatureStatus" use:enhance={() => handleStatusUpdate(request.id)} class="contents">
															<input type="hidden" name="id" value={request.id} />
															<select
																name="status"
																disabled={updatingStatusIds.has(request.id)}
																class="rounded-xl border border-base-200 bg-base-50 px-3 py-1.5 text-xs font-semibold text-base-content transition focus:border-primary/50 focus:bg-white focus:outline-none disabled:opacity-50"
																onchange={(e) => e.currentTarget.form?.requestSubmit()}
															>
																{#each Object.values(FeatureRequestStatus) as status}
																	<option value={status} selected={request.status === status}>
																		{status}
																	</option>
																{/each}
															</select>
														</form>
													{/if}
												</div>
											</div>
										</div>
									{/each}
								{/if}
							{/if}
						</div>
					</div>
				</div>
			</section>
		{:else}
			<!-- Not logged in state -->
			<div class="rounded-3xl border-2 border-dashed border-primary/20 bg-white p-14 text-center shadow-lg">
				<div class="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
					<MessageCircle class="h-10 w-10 text-primary" />
				</div>
				<h2 class="mt-8 text-3xl font-bold text-base-content">Sign in to join the conversation</h2>
				<p class="mx-auto mt-4 max-w-md text-lg text-base-content/60">
					Start sharing feedback, reporting bugs, and voting on features to guide the Voyager roadmap.
				</p>
				<a
					href="/auth/login"
					class="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-10 py-4 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl"
				>
					Sign in to get started
				</a>
			</div>
		{/if}
	</div>
</div>
