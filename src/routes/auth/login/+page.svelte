<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { MessageCircle, Sparkles } from 'lucide-svelte';

	let { form } = $props();
</script>

<svelte:head>
	<title>Login - Voyagers Community</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
	<div class="w-full max-w-md space-y-8">
		<div class="text-center">
			<div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-content shadow-lg">
				<MessageCircle class="h-7 w-7" />
			</div>
			<h2 class="mt-6 text-3xl font-bold text-base-content">
				Welcome back
			</h2>
			<p class="mt-2 text-base-content/70">
				Sign in to your account or create a new one
			</p>
		</div>

		<div class="rounded-2xl border border-base-200 bg-base-100 p-8 shadow-sm">
			<form class="space-y-5" method="POST" action="?/login" use:enhance>
				<div class="space-y-2">
					<label for="username" class="block text-sm font-medium text-base-content">
						Username
					</label>
					<input
						id="username"
						name="username"
						type="text"
						autocomplete="username"
						required
						class="w-full rounded-xl border border-base-300 bg-base-100 px-4 py-3 text-base-content placeholder-base-content/50 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
						placeholder="Enter your username"
					/>
				</div>

				<div class="space-y-2">
					<label for="password" class="block text-sm font-medium text-base-content">
						Password
					</label>
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						class="w-full rounded-xl border border-base-300 bg-base-100 px-4 py-3 text-base-content placeholder-base-content/50 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
						placeholder="Enter your password"
					/>
				</div>

				{#if form?.message}
					<div class="rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-sm font-medium text-error">
						{form.message}
					</div>
				{/if}

				<div class="flex gap-3 pt-2">
					<button
						type="submit"
						class="btn btn-primary flex-1 shadow-md shadow-primary/20"
					>
						Sign In
					</button>
					<button
						formaction="?/register"
						class="btn btn-outline flex-1"
					>
						Register
					</button>
				</div>
			</form>
		</div>

		<p class="text-center text-sm text-base-content/60">
			By signing in, you agree to our terms of service and privacy policy.
		</p>
	</div>
</div>

