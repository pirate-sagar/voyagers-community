<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data } = $props();
</script>

<svelte:head>
	<title>Profile - Voyagers Community</title>
</svelte:head>

<div class="mx-auto max-w-md px-4 py-16">
	<div class="rounded-2xl border border-base-200 bg-base-100 p-8 shadow-sm">
		<h1 class="text-2xl font-bold text-base-content">Hi, {data.user.username}!</h1>
		<p class="mt-2 text-base-content/70">Your user ID is {data.user.id}.</p>
		<form method="post" action="?/logout" use:enhance class="mt-6">
			<button
				type="submit"
				class="btn btn-error w-full"
			>
				Sign out
			</button>
		</form>
	</div>
</div>

