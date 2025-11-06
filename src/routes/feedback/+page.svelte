<script lang="ts">
	import { enhance } from '$app/forms';
	import { BugReportStatus, FeatureRequestStatus } from '$lib/types';
	import type { ActionData, PageData } from './$types';
	import { ArrowUp, Bug, Lightbulb, CheckCircle2, Clock, AlertCircle, Search, X } from 'lucide-svelte';

	let { data, form } = $props();

	let currentTab = $state<'bugs' | 'features'>('features');
	let searchQuery = $state('');
	let sortBy = $state<'newest' | 'popular'>('newest');

	const isAdmin = $derived(data.user && data.adminEmails.includes(data.user.email));

	let filteredBugs = $derived(data.bugReports.filter(
		(bug) =>
			bug.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			bug.description.toLowerCase().includes(searchQuery.toLowerCase())
	));

	let filteredFeatures = $derived(data.featureRequests.filter(
		(feature) =>
			feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			feature.description.toLowerCase().includes(searchQuery.toLowerCase())
	));

	let sortedFeatures = $derived(sortBy === 'popular'
		? [...filteredFeatures].sort((a, b) => b.upvotes - a.upvotes)
		: filteredFeatures);

	function getStatusColor(status: string) {
		if (status === 'Resolved' || status === 'Released' || status === 'Implemented') {
			return 'badge-success';
		}
		if (status === 'Investigating' || status === 'In Progress' || status === 'Planned') {
			return 'badge-info';
		}
		if (status === 'Under Review' || status === 'Exploring Alternatives') {
			return 'badge-warning';
		}
		return 'badge-error';
	}

	function getStatusIcon(status: string) {
		if (status === 'Resolved' || status === 'Released' || status === 'Implemented') {
			return CheckCircle2;
		}
		if (status === 'Investigating' || status === 'In Progress' || status === 'Planned') {
			return Clock;
		}
		return AlertCircle;
	}
</script>

<svelte:head>
	<title>Feedback - Voyagers Community</title>
</svelte:head>

<div class="min-h-screen py-8 sm:py-12 lg:py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-12 space-y-4">
			<div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h1 class="text-4xl font-bold text-slate-900 dark:text-white">Feedback Hub</h1>
					<p class="mt-2 text-lg text-slate-600 dark:text-slate-400">
						Help shape our product by sharing your thoughts and voting on ideas
					</p>
				</div>
				{#if data.user}
					<div class="flex gap-2">
						<div class="hidden gap-2 sm:flex">
							<span class="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700 dark:bg-blue-950 dark:text-blue-400">
								<span class="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
								Logged in as
								<strong>{data.user.username}</strong>
							</span>
						</div>
					</div>
				{/if}
			</div>

			{#if !data.user}
				<div class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900 dark:bg-amber-950">
					<p class="text-sm text-amber-900 dark:text-amber-200">
						<a href="/demo/lucia/login" class="font-semibold underline hover:no-underline">
							Sign in
						</a>
						to submit feedback and vote on features
					</p>
				</div>
			{/if}
		</div>

		{#if data.user}
			<!-- Tab Navigation -->
			<div class="mb-8 flex gap-2 border-b border-slate-200 dark:border-slate-800">
				<button
					on:click={() => (currentTab = 'features')}
					class="flex items-center gap-2 border-b-2 px-4 py-3 font-medium transition-colors {currentTab === 'features'
						? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
						: 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300'}"
				>
					<Lightbulb class="h-5 w-5" />
					Feature Requests
					<span class="rounded-full bg-purple-100 px-2.5 py-0.5 text-sm font-medium text-purple-700 dark:bg-purple-950 dark:text-purple-300">
						{data.featureRequests.length}
					</span>
				</button>
				<button
					on:click={() => (currentTab = 'bugs')}
					class="flex items-center gap-2 border-b-2 px-4 py-3 font-medium transition-colors {currentTab === 'bugs'
						? 'border-red-600 text-red-600 dark:border-red-400 dark:text-red-400'
						: 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300'}"
				>
					<Bug class="h-5 w-5" />
					Bug Reports
					<span class="rounded-full bg-red-100 px-2.5 py-0.5 text-sm font-medium text-red-700 dark:bg-red-950 dark:text-red-300">
						{data.bugReports.length}
					</span>
				</button>
			</div>

			<div class="grid gap-8 lg:grid-cols-3">
				<!-- Left Column - Forms -->
				<div class="space-y-6 lg:col-span-1">
					{#if currentTab === 'bugs'}
						<div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
							<div class="mb-4 flex items-center gap-2">
								<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-950">
									<Bug class="h-6 w-6 text-red-600 dark:text-red-400" />
								</div>
								<h2 class="text-xl font-bold text-slate-900 dark:text-white">Report a Bug</h2>
							</div>
							<p class="mb-6 text-sm text-slate-600 dark:text-slate-400">
								Help us fix issues by reporting bugs you find
							</p>
							<form method="POST" action="?/createBugReport" use:enhance class="space-y-4">
								<div class="space-y-2">
									<label for="bug-title" class="block text-sm font-medium text-slate-900 dark:text-white">
										Title
									</label>
									<input
										id="bug-title"
										name="title"
										type="text"
										placeholder="Describe the bug in one line"
										class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 transition-colors focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
										required
									/>
								</div>
								<div class="space-y-2">
									<label for="bug-description" class="block text-sm font-medium text-slate-900 dark:text-white">
										Description
									</label>
									<textarea
										id="bug-description"
										name="description"
										placeholder="Provide detailed information about the bug..."
										class="h-32 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 transition-colors focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
										required
									></textarea>
								</div>
								<button
									type="submit"
									class="w-full rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition-all hover:bg-red-700 active:scale-95 dark:bg-red-700 dark:hover:bg-red-800"
								>
									Submit Bug Report
								</button>
								{#if form?.createBugReport?.error}
									<div class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
										{form.createBugReport.error}
									</div>
								{/if}
								{#if form?.createBugReport?.success}
									<div class="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
										Bug report submitted successfully!
									</div>
								{/if}
							</form>
						</div>
					{/if}

					{#if currentTab === 'features'}
						<div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
							<div class="mb-4 flex items-center gap-2">
								<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-950">
									<Lightbulb class="h-6 w-6 text-purple-600 dark:text-purple-400" />
								</div>
								<h2 class="text-xl font-bold text-slate-900 dark:text-white">Request a Feature</h2>
							</div>
							<p class="mb-6 text-sm text-slate-600 dark:text-slate-400">
								Share your brilliant ideas with the community
							</p>
							<form method="POST" action="?/createFeatureRequest" use:enhance class="space-y-4">
								<div class="space-y-2">
									<label for="feature-title" class="block text-sm font-medium text-slate-900 dark:text-white">
										Title
									</label>
									<input
										id="feature-title"
										name="title"
										type="text"
										placeholder="What feature would you like?"
										class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 transition-colors focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
										required
									/>
								</div>
								<div class="space-y-2">
									<label for="feature-description" class="block text-sm font-medium text-slate-900 dark:text-white">
										Description
									</label>
									<textarea
										id="feature-description"
										name="description"
										placeholder="Explain why this feature would be useful..."
										class="h-32 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 transition-colors focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
										required
									></textarea>
								</div>
								<button
									type="submit"
									class="w-full rounded-lg bg-purple-600 px-4 py-2.5 font-medium text-white transition-all hover:bg-purple-700 active:scale-95 dark:bg-purple-700 dark:hover:bg-purple-800"
								>
									Submit Feature Request
								</button>
								{#if form?.createFeatureRequest?.error}
									<div class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
										{form.createFeatureRequest.error}
									</div>
								{/if}
								{#if form?.createFeatureRequest?.success}
									<div class="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
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
					<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div class="relative flex-1">
							<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
							<input
								type="text"
								placeholder="Search feedback..."
								bind:value={searchQuery}
								class="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 py-2 text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
							/>
						</div>

						{#if currentTab === 'features'}
							<select
								bind:value={sortBy}
								class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 transition-colors focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
							>
								<option value="newest">Newest First</option>
								<option value="popular">Most Upvotes</option>
							</select>
						{/if}
					</div>

					<!-- Items List -->
					<div class="space-y-4">
						{#if currentTab === 'bugs'}
							{#if filteredBugs.length === 0}
								<div class="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800/50">
									<Bug class="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600" />
									<p class="mt-4 font-medium text-slate-600 dark:text-slate-400">
										{searchQuery ? 'No bugs match your search' : 'No bugs reported yet'}
									</p>
									<p class="mt-2 text-sm text-slate-500 dark:text-slate-500">
										{searchQuery
											? 'Try adjusting your search terms'
											: 'Be the first to report an issue!'}
									</p>
								</div>
							{:else}
								{#each filteredBugs as bug (bug.id)}
									<div class="group rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
										<div class="flex items-start justify-between gap-4">
											<div class="flex-1">
												<div class="flex items-start gap-3">
													<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 dark:bg-red-950">
														<Bug class="h-4 w-4 text-red-600 dark:text-red-400" />
													</div>
													<div class="flex-1 min-w-0">
														<h3 class="font-semibold text-slate-900 dark:text-white">{bug.title}</h3>
														<p class="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
															{bug.description}
														</p>
														<div class="mt-3 flex flex-wrap items-center gap-2">
															<span class="badge text-white {getStatusColor(bug.status)} text-xs">
																{bug.status}
															</span>
															<span class="text-xs text-slate-500 dark:text-slate-500">
																Reported by {bug.user.username}
															</span>
														</div>
													</div>
												</div>
											</div>
											{#if isAdmin}
												<form method="POST" action="?/updateBugStatus" use:enhance class="flex-shrink-0">
													<input type="hidden" name="id" value={bug.id} />
													<select
														name="status"
														class="rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs text-slate-900 transition-colors focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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
								<div class="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800/50">
									<Lightbulb class="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600" />
									<p class="mt-4 font-medium text-slate-600 dark:text-slate-400">
										{searchQuery ? 'No features match your search' : 'No feature requests yet'}
									</p>
									<p class="mt-2 text-sm text-slate-500 dark:text-slate-500">
										{searchQuery
											? 'Try adjusting your search terms'
											: 'Be the first to request a feature!'}
									</p>
								</div>
							{:else}
								{#each sortedFeatures as request (request.id)}
									<div class="group rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
										<div class="flex items-start justify-between gap-4">
											<div class="flex-1">
												<div class="flex items-start gap-3">
													<div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-950">
														<Lightbulb class="h-4 w-4 text-purple-600 dark:text-purple-400" />
													</div>
													<div class="flex-1 min-w-0">
														<h3 class="font-semibold text-slate-900 dark:text-white">{request.title}</h3>
														<p class="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
															{request.description}
														</p>
														<div class="mt-3 flex flex-wrap items-center gap-2">
															<span class="badge text-white {getStatusColor(request.status)} text-xs">
																{request.status}
															</span>
															<span class="text-xs text-slate-500 dark:text-slate-500">
																Requested by {request.user.username}
															</span>
														</div>
													</div>
												</div>
											</div>

											<div class="flex flex-shrink-0 flex-col items-end gap-2">
												<form method="POST" action="?/upvoteFeatureRequest" use:enhance class="contents">
													<input type="hidden" name="id" value={request.id} />
													<button
														type="submit"
														class="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 px-3 py-1.5 font-semibold text-purple-700 transition-all hover:from-purple-100 hover:to-purple-200 dark:from-purple-950 dark:to-purple-900 dark:text-purple-300 dark:hover:from-purple-900 dark:hover:to-purple-800"
													>
														<ArrowUp class="h-4 w-4" />
														<span class="text-sm">{request.upvotes}</span>
													</button>
												</form>

												{#if isAdmin}
													<form method="POST" action="?/updateFeatureStatus" use:enhance class="contents">
														<input type="hidden" name="id" value={request.id} />
														<select
															name="status"
															class="rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs text-slate-900 transition-colors focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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
		{:else}
			<!-- Not logged in state -->
			<div class="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-12 text-center dark:from-slate-900 dark:to-slate-800">
				<MessageCircle class="mx-auto h-16 w-16 text-slate-400 dark:text-slate-600" />
				<h2 class="mt-6 text-3xl font-bold text-slate-900 dark:text-white">Sign in to Join the Conversation</h2>
				<p class="mt-4 text-lg text-slate-600 dark:text-slate-400">
					Start sharing feedback, reporting bugs, and voting on features
				</p>
				<a
					href="/demo/lucia/login"
					class="mt-8 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 font-medium text-white shadow-lg transition-all hover:shadow-xl hover:from-blue-600 hover:to-purple-700"
				>
					Sign In
				</a>
			</div>
		{/if}
	</div>
</div>
