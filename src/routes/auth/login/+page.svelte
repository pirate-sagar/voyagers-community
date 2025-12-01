<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { MessageCircle, Loader2, ArrowRight } from 'lucide-svelte';

	let { form } = $props();

	let isLoggingIn = $state(false);
	let isRegistering = $state(false);

	function handleLogin() {
		isLoggingIn = true;
		return async ({ update }: { update: () => Promise<void> }) => {
			await update();
			isLoggingIn = false;
		};
	}

	function handleRegister() {
		isRegistering = true;
		return async ({ update }: { update: () => Promise<void> }) => {
			await update();
			isRegistering = false;
		};
	}

	let isSubmitting = $derived(isLoggingIn || isRegistering);
</script>

<svelte:head>
	<title>Login - Voyagers Community</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
	<div class="w-full max-w-md space-y-8">
		<div class="text-center">
			<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-content shadow-xl shadow-primary/25">
				<MessageCircle class="h-8 w-8" />
			</div>
			<h1 class="mt-6 text-3xl font-bold text-base-content">
				Welcome back
			</h1>
			<p class="mt-2 text-base-content/60">
				Sign in to your account or create a new one
			</p>
		</div>

		<div class="rounded-2xl border border-base-200 bg-white p-8 shadow-xl">
			<form class="space-y-5" method="POST" action="?/login" use:enhance={handleLogin}>
				<div class="space-y-2">
					<label for="username" class="block text-sm font-semibold text-base-content">
						Username
					</label>
					<input
						id="username"
						name="username"
						type="text"
						autocomplete="username"
						required
						disabled={isSubmitting}
						class="w-full rounded-xl border border-base-300 bg-base-50 px-4 py-3.5 text-base-content placeholder-base-content/40 transition focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
						placeholder="Enter your username"
					/>
				</div>

				<div class="space-y-2">
					<label for="password" class="block text-sm font-semibold text-base-content">
						Password
					</label>
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						disabled={isSubmitting}
						class="w-full rounded-xl border border-base-300 bg-base-50 px-4 py-3.5 text-base-content placeholder-base-content/40 transition focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
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
						disabled={isSubmitting}
						class="btn btn-primary flex-1 gap-2 shadow-lg shadow-primary/20 disabled:opacity-70"
					>
						{#if isLoggingIn}
							<Loader2 class="h-4 w-4 animate-spin" />
							Signing in...
						{:else}
							Sign In
							<ArrowRight class="h-4 w-4" />
						{/if}
					</button>
					<button
						type="submit"
						formaction="?/register"
						disabled={isSubmitting}
						onclick={() => { isRegistering = true; isLoggingIn = false; }}
						class="btn btn-outline flex-1 gap-2 disabled:opacity-70"
					>
						{#if isRegistering}
							<Loader2 class="h-4 w-4 animate-spin" />
							Creating...
						{:else}
							Register
						{/if}
					</button>
				</div>
			</form>
		</div>

		<p class="text-center text-sm text-base-content/50">
			By signing in, you agree to our terms of service and privacy policy.
		</p>
	</div>
</div>
