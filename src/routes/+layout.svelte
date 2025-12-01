<script lang="ts">
    import '../app.css';
    import favicon from '$lib/assets/favicon.svg';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { Home, LogOut, Menu, MessageCircle, Sparkles } from 'lucide-svelte';

    type NavLink = {
        href: string;
        label: string;
        icon: typeof Home;
    };

    let { children } = $props();

    const navLinks: NavLink[] = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/feedback', label: 'Feedback', icon: MessageCircle }
    ];

    let user = $derived($page.data.user);
    let currentPath = $derived($page.url.pathname);
    let isLandingPage = $derived(currentPath === '/');

    let mobileMenuOpen = $state(false);
    let mobileMenuContainer: HTMLDivElement | null = null;

    function isActiveRoute(href: string) {
        if (href === '/') {
            return currentPath === '/';
        }
        return currentPath.startsWith(href);
    }

    function desktopLinkClasses(href: string) {
        const active = isActiveRoute(href);
        return `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
            active
                ? 'bg-primary text-primary-content shadow-md'
                : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'
        }`;
    }

    function mobileLinkClasses(href: string) {
        return `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${
            isActiveRoute(href)
                ? 'bg-base-200 text-primary'
                : 'text-base-content/80 hover:bg-base-200 hover:text-base-content'
        }`;
    }

    function closeMobileMenu() {
        mobileMenuOpen = false;
    }

    onMount(() => {
        function handleDocumentClick(event: MouseEvent) {
            if (!mobileMenuOpen || !mobileMenuContainer) {
                return;
            }

            const target = event.target as Node | null;
            if (target && mobileMenuContainer.contains(target)) {
                return;
            }

            mobileMenuOpen = false;
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                mobileMenuOpen = false;
            }
        }

        document.addEventListener('click', handleDocumentClick);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('click', handleDocumentClick);
            document.removeEventListener('keydown', handleEscape);
        };
    });
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div data-theme="corporate" class="flex min-h-screen flex-col bg-gradient-to-b from-base-100 via-base-100 to-base-200">
    <!-- Global Navbar -->
    <nav class="sticky top-0 z-50 border-b border-base-200/80 bg-base-100/95 shadow-sm backdrop-blur-md">
        <div class="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <!-- Left: Logo -->
            <a href="/" class="group flex items-center gap-3 rounded-xl px-2 py-1 transition hover:bg-base-200/60">
                <span class="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-content shadow-lg transition duration-200 group-hover:scale-105">
                    <MessageCircle class="h-5 w-5" />
                    <Sparkles class="absolute -top-1 -right-1 h-4 w-4 text-secondary-content" />
                </span>
                <div class="hidden flex-col leading-tight sm:flex">
                    <span class="text-lg font-bold text-base-content">Voyagers</span>
                    <span class="text-xs font-medium text-base-content/60">Community Feedback</span>
                </div>
            </a>

            <!-- Center: Navigation (desktop) -->
            <div class="hidden items-center gap-1 rounded-full border border-base-200 bg-base-100/80 p-1 shadow-inner lg:flex">
                {#each navLinks as link (link.href)}
                    {@const Icon = link.icon}
                    <a href={link.href} class={desktopLinkClasses(link.href)}>
                        <Icon class="h-4 w-4" />
                        {link.label}
                    </a>
                {/each}
            </div>

            <!-- Right: User actions -->
            <div class="flex items-center gap-3">
                <!-- Mobile menu -->
                <div class="relative lg:hidden" bind:this={mobileMenuContainer}>
                    <button
                        type="button"
                        class="btn btn-ghost btn-square btn-sm"
                        aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        aria-expanded={mobileMenuOpen}
                        onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
                    >
                        <Menu class="h-5 w-5" />
                    </button>
                    {#if mobileMenuOpen}
                        <ul class="menu menu-sm absolute right-0 z-50 mt-3 w-56 rounded-2xl border border-base-200 bg-base-100 p-3 shadow-xl">
                            {#each navLinks as link (link.href)}
                                {@const Icon = link.icon}
                                <li>
                                    <a href={link.href} class={mobileLinkClasses(link.href)} onclick={closeMobileMenu}>
                                        <Icon class="h-4 w-4" />
                                        {link.label}
                                    </a>
                                </li>
                            {/each}
                        </ul>
                    {/if}
                </div>

                {#if user}
                    <div class="hidden flex-col text-right sm:flex">
                        <span class="text-xs font-medium text-base-content/60">Welcome back</span>
                        <span class="text-sm font-semibold text-base-content">{user.username}</span>
                    </div>
                    <form method="POST" action="/auth?/logout" class="contents">
                        <button type="submit" class="btn btn-outline btn-error btn-sm">
                            <LogOut class="h-4 w-4" />
                            <span class="hidden sm:inline">Logout</span>
                        </button>
                    </form>
                {:else}
                    <a href="/auth/login" class="btn btn-primary btn-sm shadow-md shadow-primary/20">
                        Login
                    </a>
                {/if}
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1">
        {@render children()}
    </main>

    <!-- Footer (only on landing page) -->
    {#if isLandingPage}
        <footer class="border-t border-base-200 bg-base-100">
            <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    <div class="sm:col-span-2 lg:col-span-1">
                        <div class="flex items-center gap-3">
                            <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-content shadow-lg">
                                <MessageCircle class="h-5 w-5" />
                            </div>
                            <div>
                                <p class="text-lg font-bold text-base-content">Voyagers</p>
                                <p class="text-sm text-base-content/60">Community Feedback</p>
                            </div>
                        </div>
                        <p class="mt-4 max-w-xs text-sm text-base-content/70">
                            An open-source platform for collecting and managing community feedback. Share ideas, report bugs, and vote on features.
                        </p>
                    </div>
                    <nav class="space-y-3">
                        <h3 class="text-sm font-semibold uppercase tracking-wide text-base-content/50">Explore</h3>
                        <ul class="space-y-2 text-sm">
                            <li><a class="text-base-content/70 transition hover:text-primary" href="/">Home</a></li>
                            <li><a class="text-base-content/70 transition hover:text-primary" href="/feedback">Feedback</a></li>
                        </ul>
                    </nav>
                    <nav class="space-y-3">
                        <h3 class="text-sm font-semibold uppercase tracking-wide text-base-content/50">Project</h3>
                        <ul class="space-y-2 text-sm">
                            <li><a class="text-base-content/70 transition hover:text-primary" href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                        </ul>
                    </nav>
                </div>
                <div class="mt-10 flex flex-col items-center justify-between gap-4 border-t border-base-200 pt-8 text-sm text-base-content/60 sm:flex-row">
                    <p>&copy; 2025 Voyagers Community. Open source under MIT License.</p>
                    <p class="flex items-center gap-2">
                        <Sparkles class="h-4 w-4 text-primary" />
                        Built with SvelteKit
                    </p>
                </div>
            </div>
        </footer>
    {/if}
</div>
