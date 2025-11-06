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
    let userInitials = $derived(user?.username ? user.username.slice(0, 2).toUpperCase() : '');
    let currentPath = $derived($page.url.pathname);

    let mobileMenuOpen = $state(false);
    let mobileMenuContainer: HTMLDivElement | null = null;

    function isActiveRoute(href: string) {
        if (href === '/') {
            return currentPath === '/';
        }
        return currentPath.startsWith(href);
    }

    function desktopLinkClasses(href: string) {
        return `btn btn-ghost btn-sm gap-2 normal-case text-sm font-semibold transition-colors duration-150 ${
            isActiveRoute(href)
                ? 'bg-primary/10 text-primary shadow-inner'
                : 'text-base-content/70 hover:bg-base-200/80 hover:text-base-content'
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

<div data-theme="corporate" class="flex min-h-screen flex-col bg-base-200">
    <!-- Global Navbar -->
    <nav class="sticky top-0 z-50 border-b border-base-200 bg-base-100/90 shadow-sm backdrop-blur">
        <div class="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <div class="flex flex-1 items-center gap-3">
                <div class="relative lg:hidden" bind:this={mobileMenuContainer}>
                    <button
                        type="button"
                        class="btn btn-ghost btn-square"
                        aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        aria-expanded={mobileMenuOpen}
                        onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
                    >
                        <Menu class="h-5 w-5" />
                    </button>
                    {#if mobileMenuOpen}
                        <ul class="menu menu-sm absolute left-0 z-50 mt-3 w-56 rounded-2xl border border-base-200 bg-base-100 p-3 shadow-xl">
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

                <a href="/" class="group flex items-center gap-3 rounded-xl px-2 py-1 transition hover:bg-base-200/60">
                    <span class="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-content shadow-lg transition duration-200 group-hover:scale-105">
                        <MessageCircle class="h-5 w-5" />
                        <Sparkles class="absolute -top-1 -right-1 h-4 w-4 text-secondary-content" />
                    </span>
                    <div class="hidden flex-col leading-tight sm:flex">
                        <span class="text-lg font-bold">Voyagers</span>
                        <span class="text-xs font-medium text-base-content/70">Community Feedback</span>
                    </div>
                </a>
            </div>

            <div class="hidden flex-none items-center gap-1 lg:flex">
                {#each navLinks as link (link.href)}
                    {@const Icon = link.icon}
                    <a href={link.href} class={desktopLinkClasses(link.href)}>
                        <Icon class="h-4 w-4" />
                        {link.label}
                    </a>
                {/each}
            </div>

            <div class="flex flex-1 items-center justify-end gap-3">
                {#if user}
                    <div class="hidden flex-col text-right sm:flex">
                        <span class="text-xs font-medium text-base-content/60">Welcome back</span>
                        <span class="text-sm font-semibold text-base-content">{user.username}</span>
                    </div>
                    <form method="POST" action="/demo/lucia/logout" class="contents">
                        <button type="submit" class="btn btn-outline btn-error btn-sm">
                            <LogOut class="h-4 w-4" />
                            <span class="hidden sm:inline">Logout</span>
                        </button>
                    </form>
                {:else}
                    <a href="/demo/lucia/login" class="btn btn-primary btn-sm md:btn-md">
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

    <!-- Footer -->
    <footer class="border-t border-base-200 bg-base-100/95">
        <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
            <div class="footer text-base-content">
                <aside>
                    <div class="flex items-center gap-3">
                        <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-content shadow-lg">
                            <MessageCircle class="h-5 w-5" />
                        </div>
                        <div>
                            <p class="text-lg font-bold">Voyagers</p>
                            <p class="text-sm opacity-70">Community Feedback Hub</p>
                        </div>
                    </div>
                    <p class="max-w-xs text-sm opacity-70">
                        Share your ideas, vote on improvements, and help us craft an unforgettable experience for every Voyager.
                    </p>
                </aside>
                <nav>
                    <h2 class="footer-title">Explore</h2>
                    <a class="link-hover link" href="/">Home</a>
                    <a class="link-hover link" href="/feedback">Feedback</a>
                </nav>
                <nav>
                    <h2 class="footer-title">Support</h2>
                    <a class="link-hover link" href="/docs">Documentation</a>
                    <a class="link-hover link" href="/contact">Contact</a>
                </nav>
                <nav>
                    <h2 class="footer-title">Legal</h2>
                    <a class="link-hover link" href="/privacy">Privacy Policy</a>
                    <a class="link-hover link" href="/terms">Terms of Service</a>
                </nav>
            </div>
            <div class="mt-10 flex flex-col items-center justify-between gap-3 border-t border-base-200 pt-6 text-sm text-base-content/70 sm:flex-row">
                <p>&copy; 2025 Voyagers Community. All rights reserved.</p>
                <p class="flex items-center gap-2">
                    <Sparkles class="h-4 w-4 text-primary" /> Crafted with care by the Voyagers team
                </p>
            </div>
        </div>
    </footer>
</div>
