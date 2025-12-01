<script lang="ts">
	import { ArrowRight, Lightbulb, Bug, TrendingUp, Github, Sparkles } from 'lucide-svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Voyagers Community - Share Your Feedback</title>
</svelte:head>

<div class="flex flex-col gap-20 py-16 sm:py-24">
	<!-- Hero Section -->
	<section class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="space-y-8 text-center">
			<div class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
				<Github class="h-4 w-4 text-primary" />
				<span class="text-sm font-medium text-base-content/80">Open Source Project</span>
			</div>

			<h1 class="text-5xl font-bold tracking-tight text-base-content sm:text-6xl lg:text-7xl">
				Shape the Future
				<span class="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
					Together
				</span>
			</h1>

			<p class="mx-auto max-w-2xl text-xl text-base-content/70">
				Your voice matters. Report bugs, request features, and vote on what matters most. A simple, open-source feedback platform for communities.
			</p>

			<div class="flex flex-col gap-4 sm:flex-row sm:justify-center">
				{#if data.user}
					<a
						href="/feedback"
						class="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-8 py-4 text-base font-semibold text-primary-content shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
					>
						Go to Feedback
						<ArrowRight class="h-5 w-5" />
					</a>
				{:else}
					<a
						href="/auth/login"
						class="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-8 py-4 text-base font-semibold text-primary-content shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
					>
						Get Started
						<ArrowRight class="h-5 w-5" />
					</a>
				{/if}
				<a
					href="#features"
					class="inline-flex items-center justify-center gap-2 rounded-full border border-base-300 bg-base-100 px-8 py-4 text-base font-semibold text-base-content transition-all hover:border-base-400 hover:bg-base-200"
				>
					Learn More
				</a>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section id="features" class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="space-y-12">
			<div class="text-center">
				<span class="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/5 px-4 py-1.5 text-sm font-medium text-secondary">
					<Sparkles class="h-4 w-4" />
					Features
				</span>
				<h2 class="mt-4 text-4xl font-bold text-base-content sm:text-5xl">
					How It Works
				</h2>
				<p class="mt-4 text-lg text-base-content/70">
					Simple, transparent, and community-focused
				</p>
			</div>

			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				<!-- Feature 1 -->
				<div class="group rounded-2xl border border-base-200 bg-base-100 p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-base-300 hover:shadow-lg">
					<div class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-info/10">
						<Bug class="h-7 w-7 text-info" />
					</div>
					<h3 class="mb-3 text-xl font-bold text-base-content">Report Bugs</h3>
					<p class="text-base-content/70">
						Found an issue? Tell us about it with detailed descriptions and help us squash those bugs quickly.
					</p>
				</div>

				<!-- Feature 2 -->
				<div class="group rounded-2xl border border-base-200 bg-base-100 p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-base-300 hover:shadow-lg">
					<div class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10">
						<Lightbulb class="h-7 w-7 text-secondary" />
					</div>
					<h3 class="mb-3 text-xl font-bold text-base-content">Request Features</h3>
					<p class="text-base-content/70">
						Got a brilliant idea? Share it with the community and watch it come to life through collaboration.
					</p>
				</div>

				<!-- Feature 3 -->
				<div class="group rounded-2xl border border-base-200 bg-base-100 p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-base-300 hover:shadow-lg">
					<div class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10">
						<TrendingUp class="h-7 w-7 text-success" />
					</div>
					<h3 class="mb-3 text-xl font-bold text-base-content">Vote & Prioritize</h3>
					<p class="text-base-content/70">
						Upvote features you love and help developers understand what the community wants most.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Open Source Banner -->
	<section class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="rounded-3xl border border-base-200 bg-gradient-to-br from-base-100 via-base-100 to-primary/5 p-10 text-center shadow-sm sm:p-14">
			<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-base-content/5">
				<Github class="h-8 w-8 text-base-content" />
			</div>
			<h2 class="mt-6 text-3xl font-bold text-base-content sm:text-4xl">Open Source</h2>
			<p class="mx-auto mt-4 max-w-xl text-lg text-base-content/70">
				This project is fully open source. Contribute, fork, or self-host it for your own community. Built with SvelteKit and designed for simplicity.
			</p>
			<div class="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
				<a
					href="https://github.com"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center justify-center gap-2 rounded-full border border-base-300 bg-base-100 px-6 py-3 text-sm font-semibold text-base-content transition-all hover:border-base-400 hover:bg-base-200"
				>
					<Github class="h-5 w-5" />
					View on GitHub
				</a>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	{#if !data.user}
		<section class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="rounded-3xl bg-gradient-to-r from-primary to-secondary p-10 text-center text-primary-content shadow-xl shadow-primary/20 sm:p-14">
				<h2 class="text-3xl font-bold sm:text-4xl">Ready to Get Started?</h2>
				<p class="mt-4 text-lg text-primary-content/80">
					Join the community and start sharing your feedback today
				</p>
				<a
					href="/auth/login"
					class="mt-8 inline-flex items-center gap-2 rounded-full bg-base-100 px-8 py-3 font-semibold text-primary shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
				>
					Sign In Now
					<ArrowRight class="h-5 w-5" />
				</a>
			</div>
		</section>
	{/if}
</div>
