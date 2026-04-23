<script setup lang="ts">
const { locale, t } = useI18n()
const localePath = useLocalePath()

const collectionName = `projects_${locale.value}` as 'projects_it' | 'projects_en'

const { data: featured } = await useAsyncData(
  `featured-${locale.value}`,
  () => queryCollection(collectionName)
    .where('featured', '=', true)
    .order('order', 'ASC')
    .all(),
)

useSeoMeta({
  title: 'Tommaso Valenzano — Portfolio',
  ogTitle: 'Tommaso Valenzano — Portfolio',
  description: () => t('hero.intro'),
  ogDescription: () => t('hero.intro'),
})
</script>

<template>
  <section class="min-h-[calc(100dvh-3.5rem)] flex items-center px-6">
    <div class="mx-auto w-full max-w-4xl space-y-8 py-24">
      <p class="font-mono text-sm text-[color:var(--color-accent)] flex items-center gap-2">
        <span class="inline-block w-2 h-2 rounded-full bg-[color:var(--color-accent)]" />
        {{ t('hero.kicker') }}
      </p>

      <h1 class="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] text-balance">
        {{ t('hero.title') }}
      </h1>

      <p class="text-lg md:text-xl text-[color:var(--color-muted)] max-w-2xl leading-relaxed">
        {{ t('hero.intro') }}
      </p>

      <div class="flex flex-wrap gap-3 pt-4">
        <NuxtLink
          :to="localePath('/work')"
          class="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-[color:var(--color-accent)] text-[color:var(--color-bg)] font-medium hover:bg-[color:var(--color-accent-dim)] transition-colors"
        >
          {{ t('hero.cta_work') }}
          <span aria-hidden="true">→</span>
        </NuxtLink>
        <a
          href="mailto:tommaso.valenzano@gmail.com"
          class="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-[color:var(--color-border)] hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)] transition-colors"
        >
          {{ t('hero.cta_contact') }}
        </a>
      </div>
    </div>
  </section>

  <section v-if="featured?.length" class="mx-auto max-w-4xl px-6 pb-24">
    <div class="flex items-baseline justify-between mb-8">
      <h2 class="font-mono text-sm text-[color:var(--color-accent)]">// {{ t('home.featured') }}</h2>
      <NuxtLink
        :to="localePath('/work')"
        class="font-mono text-xs text-[color:var(--color-muted)] hover:text-[color:var(--color-accent)] transition-colors"
      >
        {{ t('home.all_work') }} →
      </NuxtLink>
    </div>

    <div class="grid gap-4">
      <NuxtLink
        v-for="project in featured"
        :key="project.slug"
        :to="localePath(`/${project.category}/${project.slug}`)"
        class="group block p-6 md:p-8 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/40 hover:bg-[color:var(--color-surface)] hover:border-[color:var(--color-accent)] transition-colors"
      >
        <div class="flex items-start justify-between gap-6 mb-3">
          <h3 class="text-xl md:text-2xl font-semibold tracking-tight group-hover:text-[color:var(--color-accent)] transition-colors">
            {{ project.title }}
          </h3>
          <span class="font-mono text-xs text-[color:var(--color-subtle)] whitespace-nowrap pt-1.5">
            {{ project.period || '' }}
          </span>
        </div>
        <p class="text-[color:var(--color-muted)] leading-relaxed line-clamp-2">
          {{ project.subtitle }}
        </p>
        <div v-if="project.stack?.length" class="flex flex-wrap gap-2 pt-4">
          <span
            v-for="tech in project.stack.slice(0, 5)"
            :key="tech"
            class="font-mono text-[11px] px-2 py-0.5 rounded border border-[color:var(--color-border)] text-[color:var(--color-subtle)]"
          >
            {{ tech }}
          </span>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
