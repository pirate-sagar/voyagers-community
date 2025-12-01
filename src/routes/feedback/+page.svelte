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
		Users
	} from 'lucide-svelte';

	let { data, form }: { data: PageData; form: ActionData | null } = $props();

	let currentTab = $state<'bugs' | 'features'>('features');
	let searchQuery = $state('');
	let sortBy = $state<'newest' | 'popular'>('newest');

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

	let totalUpvotes = $derived(data.featureRequests.reduce((sum, request) => sum + request.upvotes, 0));
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
</script>

<svelte:head>
	<title>Feedback - Voyagers Community</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-base-200 via-base-100 to-white py-10 sm:py-14">
	<div class="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
		<section class="rounded-3xl border border-base-200 bg-white/90 p-8 shadow-2xl shadow-base-300/60 backdrop-blur">
			<div class="flex flex-col gap-8 lg:flex-row lg:items-center">
				<div class="flex-1 space-y-5">
					<span class="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-primary">
						<Sparkles class="h-4 w-4" />
						Community Pulse
					</span>
					<h1 class="text-4xl font-bold text-base-content md:text-5xl">Feedback Hub</h1>
					<p class="text-lg text-base-content/70">
						Help shape our product by sharing new ideas, reporting bugs, and supporting the features that matter most to you.
					</p>
					{#if data.user}
						<div class="inline-flex items-center gap-3 rounded-2xl border border-base-200/80 bg-base-100/80 px-4 py-2 text-sm font-semibold text-base-content">
							<Users class="h-4 w-4 text-primary" />
							Logged in as {data.user.username}
						</div>
					{:else}
						<div class="flex flex-wrap gap-3">
							<a href="/auth/login" class="btn btn-primary btn-md shadow-lg shadow-primary/30">
								Sign in to contribute
							</a>
							<a href="/feedback" class="btn btn-ghost border border-base-200 bg-transparent text-base-content hover:border-base-300">
								Browse ideas
							</a>
						</div>
					{/if}
				</div>
				<div class="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2">
					<div class="rounded-2xl border border-base-200 bg-base-100/70 p-4 shadow-sm">
						<TrendingUp class="h-5 w-5 text-primary" />
						<p class="mt-3 text-xs font-semibold uppercase tracking-wide text-base-content/60">Total Upvotes</p>
						<p class="text-2xl font-bold text-base-content">{totalUpvotes}</p>
					</div>
					<div class="rounded-2xl border border-base-200 bg-base-100/70 p-4 shadow-sm">
						<Lightbulb class="h-5 w-5 text-secondary" />
						<p class="mt-3 text-xs font-semibold uppercase tracking-wide text-base-content/60">Ideas in Motion</p>
						<p class="text-2xl font-bold text-base-content">{plannedFeatures}</p>
					</div>
					<div class="rounded-2xl border border-base-200 bg-base-100/70 p-4 shadow-sm">
						<CheckCircle2 class="h-5 w-5 text-success" />
						<p class="mt-3 text-xs font-semibold uppercase tracking-wide text-base-content/60">Shipped wins</p>
						<p class="text-2xl font-bold text-base-content">{shippedFeatures}</p>
					</div>
					<div class="rounded-2xl border border-base-200 bg-base-100/70 p-4 shadow-sm">
						<Bug class="h-5 w-5 text-error" />
						<p class="mt-3 text-xs font-semibold uppercase tracking-wide text-base-content/60">Active bugs</p>
						<p class="text-2xl font-bold text-base-content">{activeBugs}</p>
					</div>
				</div>
			</div>
		</section>

		{#if data.user}
			<section class="space-y-8">
				<div class="rounded-full border border-base-200 bg-white/90 p-1.5 shadow-inner shadow-base-200/80">
					<div class="flex flex-wrap gap-2">
						<button
							on:click={() => (currentTab = 'features')}
							class={`flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition sm:flex-none ${
								currentTab === 'features'
									? 'bg-primary text-primary-content shadow-lg shadow-primary/40'
									: 'text-base-content/60 hover:text-base-content'
							}`}
							aria-pressed={currentTab === 'features'}
						>
							<Lightbulb class="h-4 w-4" />
							Feature Requests
							<span class={`rounded-full px-2 text-xs ${currentTab === 'features' ? 'bg-white/30 text-white' : 'bg-base-200 text-base-content/70'}`}>
								{data.featureRequests.length}
							</span>
						</button>
						<button
							on:click={() => (currentTab = 'bugs')}
							class={`flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition sm:flex-none ${
								currentTab === 'bugs'
									? 'bg-error text-white shadow-lg shadow-error/40'
									: 'text-base-content/60 hover:text-base-content'
							}`}
							aria-pressed={currentTab === 'bugs'}
						>
							<Bug class="h-4 w-4" />
							Bug Reports
							<span class={`rounded-full px-2 text-xs ${currentTab === 'bugs' ? 'bg-white/30 text-white' : 'bg-base-200 text-base-content/70'}`}>
								{data.bugReports.length}
							</span>
						</button>
					</div>
				</div>

				<div class="grid gap-8 lg:grid-cols-3">
					<div class="space-y-6 lg:col-span-1">
						{#if currentTab === 'bugs'}
							<div class="rounded-2xl border border-base-200 bg-white/95 p-6 shadow-xl shadow-base-200/70">
								<div class="mb-4 flex items-center gap-3">
									<div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-error/10 text-error">
										<Bug class="h-5 w-5" />
									</div>
									<div>
										<p class="text-sm font-semibold uppercase tracking-wide text-base-content/50">Quality watch</p>
										<h2 class="text-xl font-bold text-base-content">Report a Bug</h2>
									</div>
								</div>
								<form method="POST" action="?/createBugReport" use:enhance class="space-y-4">
									<div class="space-y-2">
										<label for="bug-title" class="block text-sm font-semibold text-base-content">Title</label>
										<input
											id="bug-title"
											name="title"
											type="text"
											placeholder="Describe the bug in one line"
											class="w-full rounded-xl border border-base-300/80 bg-white px-4 py-2.5 text-base text-base-content placeholder-base-content/50 transition focus:border-error focus:ring-2 focus:ring-error/15"
											required
										/>
									</div>
									<div class="space-y-2">
										<label for="bug-description" class="block text-sm font-semibold text-base-content">Description</label>
										<textarea
											id="bug-description"
											name="description"
											placeholder="Provide detailed information about the bug..."
											class="h-32 w-full rounded-xl border border-base-300/80 bg-white px-4 py-2.5 text-base text-base-content placeholder-base-content/50 transition focus:border-error focus:ring-2 focus:ring-error/15"
											required
										></textarea>
									</div>
									<button
										type="submit"
										class="w-full rounded-xl bg-gradient-to-r from-rose-500 to-red-500 py-3 font-semibold text-white shadow-lg shadow-rose-200/70 transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
									>
										Submit Bug Report
									</button>
									{#if form?.createBugReport?.error}
										<div class="rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-sm font-medium text-error">
											{form.createBugReport.error}
										</div>
									{/if}
									{#if form?.createBugReport?.success}
										<div class="rounded-xl border border-success/20 bg-success/5 px-4 py-3 text-sm font-medium text-success">
											Bug report submitted successfully!
										</div>
									{/if}
								</form>
							</div>
						{/if}

						{#if currentTab === 'features'}
							<div class="rounded-2xl border border-base-200 bg-white/95 p-6 shadow-xl shadow-base-200/70">
								<div class="mb-4 flex items-center gap-3">
									<div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
										<Lightbulb class="h-5 w-5" />
									</div>
									<div>
										<p class="text-sm font-semibold uppercase tracking-wide text-base-content/50">Inspire us</p>
										<h2 class="text-xl font-bold text-base-content">Request a Feature</h2>
									</div>
								</div>
								<form method="POST" action="?/createFeatureRequest" use:enhance class="space-y-4">
									<div class="space-y-2">
										<label for="feature-title" class="block text-sm font-semibold text-base-content">Title</label>
										<input
											id="feature-title"
											name="title"
											type="text"
											placeholder="What feature would you like?"
											class="w-full rounded-xl border border-base-300/80 bg-white px-4 py-2.5 text-base text-base-content placeholder-base-content/50 transition focus:border-secondary focus:ring-2 focus:ring-secondary/15"
											required
										/>
									</div>
									<div class="space-y-2">
										<label for="feature-description" class="block text-sm font-semibold text-base-content">Description</label>
										<textarea
											id="feature-description"
											name="description"
											placeholder="Explain why this feature would be useful..."
											class="h-32 w-full rounded-xl border border-base-300/80 bg-white px-4 py-2.5 text-base text-base-content placeholder-base-content/50 transition focus:border-secondary focus:ring-2 focus:ring-secondary/15"
											required
										></textarea>
									</div>
									<button
										type="submit"
										class="w-full rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 py-3 font-semibold text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
									>
										Submit Feature Request
									</button>
									{#if form?.createFeatureRequest?.error}
										<div class="rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-sm font-medium text-error">
											{form.createFeatureRequest.error}
										</div>
									{/if}
									{#if form?.createFeatureRequest?.success}
										<div class="rounded-xl border border-success/20 bg-success/5 px-4 py-3 text-sm font-medium text-success">
											Feature request submitted successfully!
										</div>
									{/if}
								</form>
							</div>
						{/if}
					</div>

					<div class="space-y-6 lg:col-span-2">
						<div class="rounded-2xl border border-base-200 bg-white/90 p-4 shadow-sm shadow-base-200/60">
							<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
								<div class="relative flex-1">
									<Search class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/40" />
									<input
										type="text"
										placeholder="Search feedback..."
										bind:value={searchQuery}
										class="w-full rounded-2xl border border-transparent bg-base-100/80 px-12 py-3 text-base text-base-content placeholder-base-content/50 shadow-inner focus:border-primary/30 focus:ring-2 focus:ring-primary/15"
									/>
								</div>

								{#if currentTab === 'features'}
									<div class="relative">
										<select
											bind:value={sortBy}
											class="rounded-2xl border border-base-200 bg-base-100/80 px-4 py-2.5 text-sm font-semibold text-base-content focus:border-primary/40 focus:outline-none"
										>
											<option value="newest">Newest first</option>
											<option value="popular">Most upvotes</option>
										</select>
									</div>
								{/if}
							</div>
						</div>

						<div class="space-y-4">
							{#if currentTab === 'bugs'}
								{#if filteredBugs.length === 0}
									<div class="rounded-2xl border border-dashed border-base-300 bg-base-100/80 p-10 text-center">
										<Bug class="mx-auto h-12 w-12 text-base-content/40" />
										<p class="mt-4 text-lg font-semibold text-base-content">
											{searchQuery ? 'No bugs match your search' : 'No bugs reported yet'}
										</p>
										<p class="text-sm text-base-content/60">
											{searchQuery ? 'Try different keywords' : 'Be the first to report an issue!'}
										</p>
									</div>
								{:else}
									{#each filteredBugs as bug (bug.id)}
										<div class="rounded-2xl border border-base-200 bg-white/95 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
											<div class="flex items-start justify-between gap-4">
												<div class="flex-1">
													<div class="flex items-start gap-3">
														<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-error/10 text-error">
															<Bug class="h-4 w-4" />
														</div>
														<div class="min-w-0 flex-1">
															<h3 class="text-lg font-semibold text-base-content">{bug.title}</h3>
															<p class="mt-1 text-sm text-base-content/70 line-clamp-2">{bug.description}</p>
															<div class="mt-3 flex flex-wrap items-center gap-2">
																<span class={`badge badge-sm border-none text-[0.65rem] font-semibold uppercase tracking-wide text-white ${getStatusColor(bug.status)}`}>
																	{bug.status}
																</span>
																<span class="text-xs text-base-content/60">Reported by {bug.user.username}</span>
															</div>
														</div>
													</div>
												</div>

												{#if isAdmin}
													<form method="POST" action="?/updateBugStatus" use:enhance class="flex-shrink-0">
														<input type="hidden" name="id" value={bug.id} />
														<select
															name="status"
															class="rounded-xl border border-base-200 bg-base-100 px-3 py-1 text-xs font-semibold text-base-content focus:border-primary/50 focus:outline-none"
															on:change={(e) => e.target.form?.requestSubmit()}
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
									<div class="rounded-2xl border border-dashed border-base-300 bg-base-100/80 p-10 text-center">
										<Lightbulb class="mx-auto h-12 w-12 text-base-content/40" />
										<p class="mt-4 text-lg font-semibold text-base-content">
											{searchQuery ? 'No features match your search' : 'No feature requests yet'}
										</p>
										<p class="text-sm text-base-content/60">
											{searchQuery ? 'Try different keywords' : 'Be the first to request a feature!'}
										</p>
									</div>
								{:else}
									{#each sortedFeatures as request (request.id)}
										<div class="rounded-2xl border border-base-200 bg-white/95 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
											<div class="flex items-start justify-between gap-4">
												<div class="flex-1">
													<div class="flex items-start gap-3">
														<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
															<Lightbulb class="h-4 w-4" />
														</div>
														<div class="min-w-0 flex-1">
															<h3 class="text-lg font-semibold text-base-content">{request.title}</h3>
															<p class="mt-1 text-sm text-base-content/70 line-clamp-2">{request.description}</p>
															<div class="mt-3 flex flex-wrap items-center gap-2">
																<span class={`badge badge-sm border-none text-[0.65rem] font-semibold uppercase tracking-wide text-white ${getStatusColor(request.status)}`}>
																	{request.status}
																</span>
																<span class="text-xs text-base-content/60">Requested by {request.user.username}</span>
															</div>
														</div>
													</div>
												</div>

												<div class="flex flex-shrink-0 flex-col items-end gap-2">
													<form method="POST" action="?/upvoteFeatureRequest" use:enhance class="contents">
														<input type="hidden" name="id" value={request.id} />
														<button
															type="submit"
															class="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/15 active:scale-95"
														>
															<ArrowUp class="h-4 w-4" />
															<span>{request.upvotes}</span>
														</button>
													</form>

													{#if isAdmin}
														<form method="POST" action="?/updateFeatureStatus" use:enhance class="contents">
															<input type="hidden" name="id" value={request.id} />
															<select
																name="status"
																class="rounded-xl border border-base-200 bg-base-100 px-3 py-1 text-xs font-semibold text-base-content focus:border-primary/50 focus:outline-none"
																on:change={(e) => e.target.form?.requestSubmit()}
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
			<div class="rounded-3xl border border-dashed border-primary/30 bg-white/90 p-12 text-center shadow-xl shadow-primary/10">
				<MessageCircle class="mx-auto h-16 w-16 text-primary" />
				<h2 class="mt-6 text-3xl font-bold text-base-content">Sign in to join the conversation</h2>
				<p class="mt-4 text-lg text-base-content/70">
					Start sharing feedback, reporting bugs, and voting on features to guide the Voyager roadmap.
				</p>
				<a
					href="/auth/login"
					class="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-8 py-3 text-base font-semibold text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
				>
					Sign in
				</a>
			</div>
		{/if}
	</div>
</div>
