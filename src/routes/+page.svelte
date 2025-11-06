<script lang="ts">
	import { ArrowRight, Lightbulb, Bug, MessageCircle, CheckCircle2, TrendingUp } from 'lucide-svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Voyagers Community - Share Your Feedback</title>
</svelte:head>

<div class="flex flex-col gap-16 py-12 sm:py-20 lg:py-28">
	<!-- Hero Section -->
	<section class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="space-y-6 text-center">
			<div class="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 dark:from-blue-950 dark:to-purple-950">
				<span class="flex h-2 w-2 rounded-full bg-green-500"></span>
				<span class="text-sm font-medium text-slate-700 dark:text-slate-300">Community-Driven Development</span>
			</div>

			<h1 class="text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
				Shape the Future
				<span class="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
					Together
				</span>
			</h1>

			<p class="mx-auto max-w-2xl text-xl text-slate-600 dark:text-slate-400">
				Your voice matters. Report bugs, request features, and vote on what matters most to our community. Let's build something amazing together.
			</p>

			<div class="flex flex-col gap-4 sm:flex-row sm:justify-center">
				{#if data.user}
					<a
						href="/feedback"
						class="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-base font-medium text-white shadow-lg transition-all hover:shadow-xl hover:from-blue-600 hover:to-purple-700"
					>
						Go to Feedback
						<ArrowRight class="h-5 w-5" />
					</a>
				{:else}
					<a
						href="/demo/lucia/login"
						class="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-base font-medium text-white shadow-lg transition-all hover:shadow-xl hover:from-blue-600 hover:to-purple-700"
					>
						Get Started
						<ArrowRight class="h-5 w-5" />
					</a>
				{/if}
				<a
					href="#features"
					class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-8 py-4 text-base font-medium text-slate-900 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
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
				<h2 class="text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
					How It Works
				</h2>
				<p class="mt-4 text-lg text-slate-600 dark:text-slate-400">
					Easy, transparent, and community-focused
				</p>
			</div>

			<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
				<!-- Feature 1 -->
				<div class="group rounded-xl border border-slate-200 bg-white p-8 transition-all hover:border-slate-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-950 dark:to-blue-900">
						<Bug class="h-6 w-6 text-blue-600 dark:text-blue-400" />
					</div>
					<h3 class="mb-2 text-lg font-bold text-slate-900 dark:text-white">Report Bugs</h3>
					<p class="text-slate-600 dark:text-slate-400">
						Found an issue? Tell us about it with detailed descriptions and help us squash those bugs.
					</p>
				</div>

				<!-- Feature 2 -->
				<div class="group rounded-xl border border-slate-200 bg-white p-8 transition-all hover:border-slate-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-950 dark:to-purple-900">
						<Lightbulb class="h-6 w-6 text-purple-600 dark:text-purple-400" />
					</div>
					<h3 class="mb-2 text-lg font-bold text-slate-900 dark:text-white">Request Features</h3>
					<p class="text-slate-600 dark:text-slate-400">
						Got a brilliant idea? Share it with the community and watch it come to life.
					</p>
				</div>

				<!-- Feature 3 -->
				<div class="group rounded-xl border border-slate-200 bg-white p-8 transition-all hover:border-slate-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-950 dark:to-emerald-900">
						<TrendingUp class="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
					</div>
					<h3 class="mb-2 text-lg font-bold text-slate-900 dark:text-white">Vote & Support</h3>
					<p class="text-slate-600 dark:text-slate-400">
						Upvote features you love and show developers what the community wants most.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Stats Section -->
	<section class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white dark:from-slate-950 dark:to-slate-900 sm:p-12">
			<div class="grid gap-8 sm:grid-cols-3">
				<div class="text-center">
					<div class="text-4xl font-bold sm:text-5xl">2.5K+</div>
					<p class="mt-2 text-slate-300">Active Members</p>
				</div>
				<div class="text-center">
					<div class="text-4xl font-bold sm:text-5xl">1.2K+</div>
					<p class="mt-2 text-slate-300">Feedback Items</p>
				</div>
				<div class="text-center">
					<div class="text-4xl font-bold sm:text-5xl">85+</div>
					<p class="mt-2 text-slate-300">Features Shipped</p>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	{#if !data.user}
		<section class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center text-white sm:p-12">
				<h2 class="text-3xl font-bold sm:text-4xl">Ready to Make an Impact?</h2>
				<p class="mt-4 text-lg text-blue-100">
					Join thousands of community members shaping the future of our product
				</p>
				<a
					href="/demo/lucia/login"
					class="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 font-medium text-blue-600 shadow-lg transition-all hover:shadow-xl"
				>
					Sign In Now
					<ArrowRight class="h-5 w-5" />
				</a>
			</div>
		</section>
	{/if}
</div>
