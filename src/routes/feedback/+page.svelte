<script lang="ts">
	import { enhance } from '$app/forms';
	import { BugReportStatus, FeatureRequestStatus } from '$lib/types';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let currentTab: 'bugs' | 'features' = 'bugs';

	const isAdmin = data.user && data.adminEmails.includes(data.user.email);
</script>

<svelte:head>
	<title>Feedback</title>
</svelte:head>

<div class="container mx-auto p-4">
	<h1 class="text-2xl font-bold mb-4">Feedback</h1>

	{#if data.user}
		<div class="tabs mb-4">
			<button
				class="tab tab-bordered"
				class:tab-active={currentTab === 'bugs'}
				on:click={() => (currentTab = 'bugs')}>Bugs</button
			>
			<button
				class="tab tab-bordered"
				class:tab-active={currentTab === 'features'}
				on:click={() => (currentTab = 'features')}>Features</button
			>
		</div>

		{#if currentTab === 'bugs'}
			<div>
				<h2 class="text-xl font-bold mb-2">Report a Bug</h2>
				<form method="POST" action="?/createBugReport" use:enhance>
					<div class="form-control mb-2">
						<label for="bug-title" class="label">Title</label>
						<input id="bug-title" name="title" type="text" class="input input-bordered" required />
					</div>
					<div class="form-control mb-4">
						<label for="bug-description" class="label">Description</label>
						<textarea
							id="bug-description"
							name="description"
							class="textarea textarea-bordered"
							required
						></textarea>
					</div>
					<button type="submit" class="btn btn-primary">Submit Bug</button>
				</form>
				{#if form?.createBugReport?.error}
					<p class="text-red-500 mt-2">{form.createBugReport.error}</p>
				{/if}

				<h2 class="text-xl font-bold mt-8 mb-2">Bug Reports</h2>
				{#each data.bugReports as report}
					<div class="card bg-base-100 shadow-xl mb-4">
						<div class="card-body">
							<h3 class="card-title">{report.title}</h3>
							<p>{report.description}</p>
							<p>Reported by: {report.user.username}</p>
							<div class="flex items-center">
								<p class="mr-2">Status:</p>
								{#if isAdmin}
									<form method="POST" action="?/updateBugStatus" use:enhance>
										<input type="hidden" name="id" value={report.id} />
										<select name="status" class="select select-bordered" on:change={(e) => e.target.form.requestSubmit()}>
											{#each Object.values(BugReportStatus) as status}
												<option value={status} selected={report.status === status}>{status}</option>
											{/each}
										</select>
									</form>
								{:else}
									<p>{report.status}</p>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		{#if currentTab === 'features'}
			<div>
				<h2 class="text-xl font-bold mb-2">Request a Feature</h2>
				<form method="POST" action="?/createFeatureRequest" use:enhance>
					<div class="form-control mb-2">
						<label for="feature-title" class="label">Title</label>
						<input id="feature-title" name="title" type="text" class="input input-bordered" required />
					</div>
					<div class="form-control mb-4">
						<label for="feature-description" class="label">Description</label>
						<textarea
							id="feature-description"
							name="description"
							class="textarea textarea-bordered"
							required
						></textarea>
					</div>
					<button type="submit" class="btn btn-primary">Submit Feature Request</button>
				</form>
				{#if form?.createFeatureRequest?.error}
					<p class="text-red-500 mt-2">{form.createFeatureRequest.error}</p>
				{/if}

				<h2 class="text-xl font-bold mt-8 mb-2">Feature Requests</h2>
				{#each data.featureRequests as request}
					<div class="card bg-base-100 shadow-xl mb-4">
						<div class="card-body">
							<h3 class="card-title">{request.title}</h3>
							<p>{request.description}</p>
							<p>Requested by: {request.user.username}</p>
							<div class="flex items-center">
								<form method="POST" action="?/upvoteFeatureRequest" use:enhance>
									<input type="hidden" name="id" value={request.id} />
									<button type="submit" class="btn btn-sm">
										Upvote ({request.upvotes})
									</button>
								</form>
							</div>
							<div class="flex items-center">
								<p class="mr-2">Status:</p>
								{#if isAdmin}
									<form method="POST" action="?/updateFeatureStatus" use:enhance>
										<input type="hidden" name="id" value={request.id} />
										<select name="status" class="select select-bordered" on:change={(e) => e.target.form.requestSubmit()}>
											{#each Object.values(FeatureRequestStatus) as status}
												<option value={status} selected={request.status === status}>{status}</option>
											{/each}
										</select>
									</form>
								{:else}
									<p>{request.status}</p>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{:else}
		<p>Please <a href="/demo/lucia/login" class="link">login</a> to view and submit feedback.</p>
	{/if}
</div>
