<script setup lang="ts">
const { t, tm, locale } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: `${t('nav.about')} — Tommaso Valenzano`,
  description: () => t('about.meta_description'),
})

const stack = [
  {
    label: 'Frontend',
    items: ['Nuxt 3', 'Vue 3', 'Tailwind CSS', 'TypeScript'],
  },
  {
    label: 'Backend',
    items: ['NestJS', 'Node.js', 'Python', 'Flask', 'SOAP', 'REST'],
  },
  {
    label: 'Data · AI',
    items: ['Prisma', 'PostgreSQL', 'pandas', 'scikit-learn', 'PM4Py', 'LLM APIs'],
  },
  {
    label: 'Mobile · DevOps',
    items: ['Android (Java)', 'Firebase', 'Docker', 'Git'],
  },
]

const education = [
  {
    title: locale.value === 'it'
      ? 'MSc in Computer Science · curriculum AI'
      : 'MSc in Computer Science · AI track',
    org: 'Università degli Studi di Bari Aldo Moro',
    period: locale.value === 'it' ? '2024 → in corso' : '2024 → ongoing',
  },
  {
    title: locale.value === 'it'
      ? 'Triennale in Informatica e Tecnologie per la Produzione del Software'
      : 'BSc in Computer Science & Software Production Technologies',
    org: 'Università degli Studi di Bari Aldo Moro',
    period: '2021 – 2024',
  },
]

const coursework = [
  {
    exam: locale.value === 'it' ? 'Formal Methods in Computer Science' : 'Formal Methods in Computer Science',
    note: locale.value === 'it'
      ? 'Process mining: tre algoritmi di discovery + reasoning LLM.'
      : 'Process mining: three discovery algorithms + LLM reasoning.',
    project: { slug: 'process-mining-system', category: 'studies', title: 'Process Mining System' },
  },
  {
    exam: locale.value === 'it' ? 'Sviluppo di Mobile Software' : 'Mobile Software Development',
    note: locale.value === 'it'
      ? 'App Android multi-ruolo con Firebase e geolocalizzazione.'
      : 'Multi-role Android app with Firebase and geolocation.',
    project: { slug: 'puppypad', category: 'studies', title: 'PuppyPad' },
  },
  {
    exam: locale.value === 'it' ? 'Integrazione e Test di Sistemi Software' : 'Software Systems Testing & Integration',
    note: locale.value === 'it'
      ? 'Property-based testing in Java/JUnit, analisi di copertura, due homework documentati.'
      : 'Property-based testing in Java/JUnit, coverage analysis, two documented assignments.',
  },
]

const experience = [
  {
    role: locale.value === 'it' ? 'Full-stack developer' : 'Full-stack developer',
    company: 'C&C Apple Premium Partner',
    period: locale.value === 'it' ? '2025 → in corso' : '2025 → ongoing',
  },
  {
    role: locale.value === 'it' ? 'Prodotti personali' : 'Personal products',
    company: locale.value === 'it' ? 'Indie' : 'Indie',
    period: locale.value === 'it' ? '2023 → in corso' : '2023 → ongoing',
    detail: locale.value === 'it'
      ? 'Ospitio (gestionale SaaS) · Room N14 (vetrina SSG multilingue)'
      : 'Ospitio (management SaaS) · Room N14 (multilingual SSG vetrina)',
  },
]

const nowItems = computed(() => tm('about.now_items') as string[])
</script>

<template>
  <article class="mx-auto max-w-3xl px-6 py-16 md:py-24 space-y-16">
    <header class="space-y-5">
      <p class="font-mono text-sm text-[color:var(--color-accent)]">/about</p>
      <h1 class="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
        {{ t('about.title') }}
      </h1>
      <p class="text-lg md:text-xl text-[color:var(--color-muted)] leading-relaxed">
        {{ t('about.bio_1') }}
      </p>
      <p class="text-lg md:text-xl text-[color:var(--color-muted)] leading-relaxed">
        {{ t('about.bio_2') }}
      </p>
    </header>

    <section class="space-y-5">
      <h2 class="font-mono text-sm text-[color:var(--color-accent)]">// {{ t('about.now_title') }}</h2>
      <ul class="space-y-2 text-[color:var(--color-muted)]">
        <li
          v-for="item in nowItems"
          :key="item"
          class="flex items-start gap-3"
        >
          <span class="font-mono text-[color:var(--color-accent)] pt-1" aria-hidden="true">→</span>
          <span>{{ item }}</span>
        </li>
      </ul>
    </section>

    <section class="space-y-5">
      <h2 class="font-mono text-sm text-[color:var(--color-accent)]">// {{ t('about.stack_title') }}</h2>
      <div class="grid sm:grid-cols-2 gap-6">
        <div
          v-for="group in stack"
          :key="group.label"
          class="p-5 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/40"
        >
          <p class="font-mono text-[10px] uppercase tracking-wider text-[color:var(--color-subtle)] mb-3">
            {{ group.label }}
          </p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="item in group.items"
              :key="item"
              class="font-mono text-xs px-2 py-0.5 rounded border border-[color:var(--color-border)] text-[color:var(--color-fg)]"
            >
              {{ item }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-5">
      <h2 class="font-mono text-sm text-[color:var(--color-accent)]">// {{ t('about.education_title') }}</h2>
      <ul class="space-y-5">
        <li
          v-for="item in education"
          :key="item.title"
          class="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 pb-5 border-b border-[color:var(--color-border)] last:border-0 last:pb-0"
        >
          <span class="font-medium text-[color:var(--color-fg)]">{{ item.title }}</span>
          <span class="font-mono text-xs text-[color:var(--color-subtle)] whitespace-nowrap pt-1">{{ item.period }}</span>
          <span class="text-sm text-[color:var(--color-muted)] col-span-2">{{ item.org }}</span>
        </li>
      </ul>
    </section>

    <section class="space-y-5">
      <h2 class="font-mono text-sm text-[color:var(--color-accent)]">// {{ t('about.coursework_title') }}</h2>
      <ul class="space-y-4">
        <li
          v-for="item in coursework"
          :key="item.exam"
          class="p-5 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/40"
        >
          <div class="flex items-start justify-between gap-4 mb-1">
            <p class="font-medium text-[color:var(--color-fg)]">{{ item.exam }}</p>
            <NuxtLink
              v-if="item.project"
              :to="localePath(`/${item.project.category}/${item.project.slug}`)"
              class="font-mono text-[11px] text-[color:var(--color-accent)] hover:underline whitespace-nowrap pt-0.5"
            >
              {{ t('about.view_case_study') }} →
            </NuxtLink>
          </div>
          <p class="text-sm text-[color:var(--color-muted)]">{{ item.note }}</p>
        </li>
      </ul>
    </section>

    <section class="space-y-5">
      <h2 class="font-mono text-sm text-[color:var(--color-accent)]">// {{ t('about.experience_title') }}</h2>
      <ul class="space-y-5">
        <li
          v-for="item in experience"
          :key="item.role + item.company"
          class="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 pb-5 border-b border-[color:var(--color-border)] last:border-0 last:pb-0"
        >
          <span class="font-medium text-[color:var(--color-fg)]">{{ item.role }}</span>
          <span class="font-mono text-xs text-[color:var(--color-subtle)] whitespace-nowrap pt-1">{{ item.period }}</span>
          <span class="text-sm text-[color:var(--color-muted)]">{{ item.company }}</span>
          <span v-if="item.detail" class="text-sm text-[color:var(--color-subtle)] col-span-2">{{ item.detail }}</span>
        </li>
      </ul>
    </section>

    <section class="space-y-5">
      <h2 class="font-mono text-sm text-[color:var(--color-accent)]">// {{ t('about.contact_title') }}</h2>
      <p class="text-[color:var(--color-muted)] max-w-xl leading-relaxed">
        {{ t('about.contact_description') }}
      </p>
      <div class="flex flex-wrap gap-3 pt-2">
        <a
          href="mailto:tommaso.valenzano@gmail.com"
          class="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-[color:var(--color-accent)] text-[color:var(--color-bg)] font-medium hover:bg-[color:var(--color-accent-dim)] transition-colors"
        >
          Email
          <span aria-hidden="true">→</span>
        </a>
        <a
          href="https://www.linkedin.com/in/tommasovalenzano/"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-[color:var(--color-border)] hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)] transition-colors"
        >
          LinkedIn
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  </article>
</template>
