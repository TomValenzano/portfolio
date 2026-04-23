<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

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
</template>
