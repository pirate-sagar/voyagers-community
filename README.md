# Voyagers Community Feedback

An open-source community feedback platform built with SvelteKit, Drizzle ORM, and Supabase. Allow your users to submit feature requests, report bugs, and vote on ideas.

## Features

- **Feature Requests** - Users can submit and upvote feature ideas
- **Bug Reports** - Track and manage bug reports from your community
- **Voting System** - Let the community prioritize what matters most
- **Admin Controls** - Update status of requests (Planned, In Progress, Released, etc.)
- **Authentication** - Built-in user registration and login

## Tech Stack

- [SvelteKit](https://kit.svelte.dev/) - Full-stack web framework
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Supabase](https://supabase.com/) - PostgreSQL database (or any Postgres provider)
- [TailwindCSS](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/) - Styling
- [Vercel](https://vercel.com/) - Recommended hosting

---

## Quick Start Guide

### 1. Fork the Repository

Click the "Fork" button on GitHub to create your own copy of this project.

```bash
# Clone your forked repository
git clone https://github.com/YOUR_USERNAME/voyagers-community.git
cd voyagers-community

# Install dependencies
pnpm install
```

### 2. Set Up Supabase Database

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Project Settings** → **Database** → **Connection string**
4. Copy the **URI** connection string (use "Transaction" mode for serverless)

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

> **Note:** Replace `[YOUR-PASSWORD]` and `[YOUR-PROJECT-REF]` with your actual Supabase credentials.

### 4. Push Database Schema

Run the following command to create the database tables:

```bash
pnpm db:push
```

This will create all necessary tables (users, sessions, feature_requests, bug_reports, etc.) in your Supabase database.

### 5. Run Locally

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) to see your app.

---

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add the `DATABASE_URL` environment variable in Vercel's project settings
4. Deploy!

### Deploy to VPS / Self-Hosted

```bash
# Build the application
pnpm build

# The output will be in the .vercel/output directory
# You can use any Node.js hosting or adapt with a different SvelteKit adapter
```

For VPS deployment, you may want to use `@sveltejs/adapter-node` instead of `@sveltejs/adapter-vercel`. Update `svelte.config.js`:

```js
import adapter from '@sveltejs/adapter-node';

export default {
  kit: {
    adapter: adapter()
  }
};
```

Then run with PM2 or similar:

```bash
pnpm build
node build
```

### Configure Custom Domain

1. In Vercel: Go to **Project Settings** → **Domains** → Add your domain
2. Update your DNS records as instructed by Vercel
3. SSL is automatically provisioned

---

## Configuration

### Admin Users

To give users admin privileges (ability to update request statuses), add their emails to the admin list in `src/routes/feedback/+page.server.ts`:

```ts
const adminEmails = ['admin@example.com', 'your-email@example.com'];
```

### Customization

- **Branding**: Update logo and colors in `src/routes/+layout.svelte`
- **Theme**: Modify the DaisyUI theme in the layout's `data-theme` attribute
- **Footer**: Customize footer links in `src/routes/+layout.svelte`

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm db:push` | Push schema to database |
| `pnpm db:studio` | Open Drizzle Studio (database GUI) |
| `pnpm db:generate` | Generate migrations |
| `pnpm db:migrate` | Run migrations |
| `pnpm check` | Type-check the project |
| `pnpm lint` | Lint and format check |
| `pnpm test` | Run all tests |

---

## Database Schema

The app uses the following main tables:

- `user` - User accounts
- `session` - Auth sessions
- `feature_request` - Feature request submissions
- `bug_report` - Bug report submissions

See `src/lib/server/db/schema.ts` for the full schema.

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## License

MIT License - feel free to use this for your own projects!
