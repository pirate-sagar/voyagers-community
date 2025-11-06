<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data } = $props();
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

<div class="container mx-auto p-4">
	<h1 class="text-2xl font-bold mb-4">Hi, {data.user.username}!</h1>
	<p class="mb-4">Your user ID is {data.user.id}.</p>
	<form method="post" action="?/logout" use:enhance>
		<button
			type="submit"
			class="rounded-md bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
			>Sign out</button
		>
	</form>
</div>
