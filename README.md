# tvalenzano.it

Personal portfolio of **Tommaso Valenzano** — full-stack developer & Computer Science MSc student (AI track).

**Live** → [tvalenzano.it](https://tvalenzano.it)

## Stack

- **Nuxt 3** — SSG, compatibility mode 4, dark-first design
- **Tailwind CSS v4** — design tokens, no plugin overhead
- **`@nuxt/content` v3** — case studies as Markdown with typed collections (`content.config.ts`)
- **`@nuxtjs/i18n`** — bilingual **IT / EN**, `prefix_except_default` strategy
- **`@nuxt/fonts`** — Geist / Geist Mono, self-hosted at build
- **`@tailwindcss/typography`** — MDC prose styling

Deployed on **Cloudflare Pages**, rebuild on every push to `main`.

## Project layout

```
app/
├── pages/            home, work, studies, about + dynamic [slug] case studies
├── layouts/          default layout with nav + language switcher + footer
├── components/
└── assets/css/       Tailwind imports + design tokens (zinc + cyan)
content/
└── projects/
    ├── it/           IT case studies (MDC with frontmatter)
    └── en/           EN case studies
i18n/locales/         IT + EN translation files
content.config.ts     typed content collections schema
nuxt.config.ts
```

## Local development

Requires Node 20+.

```bash
# install dependencies
npm install

# dev server at http://localhost:3000
npm run dev

# production build (SSG, output in .output/public)
npm run generate

# preview the production build
npm run preview
```

### On lockfiles

This repo ships **no `package-lock.json`** (ignored via `.npmrc`). A `bun.lock` is committed for local-dev reproducibility only. The reason: npm's optional-dependency bug was recording only the host-platform native bindings in the lockfile, breaking builds on cross-platform CI. Running `npm install` fresh on each environment resolves optional deps correctly for the target platform.

## Writing a new case study

1. Drop a Markdown file in `content/projects/it/<slug>.md` (and its EN twin in `content/projects/en/<slug>.md`) with frontmatter matching `content.config.ts`:
   ```yaml
   title: Project Name
   slug: project-name
   subtitle: One-liner about the project.
   category: work        # or: studies
   role: Your role
   stack: [Tech, A, B]
   period: 2025 → ongoing
   featured: true        # show on home
   order: 1              # sort order within its category
   ```
2. Body in prose / MDC. Headings `##` and below are styled via `prose-invert`.
3. Commit + push → Cloudflare rebuilds in ~2 min.

## License

Source code is MIT-licensed. Case study copy, personal content and assets are © Tommaso Valenzano.
