<script setup lang="ts">
const { locale, t } = useI18n()
const localePath = useLocalePath()

const collectionName = `projects_${locale.value}` as 'projects_it' | 'projects_en'

const { data: projects } = await useAsyncData(
  `work-list-${locale.value}`,
  () => queryCollection(collectionName)
    .where('category', '=', 'work')
    .order('order', 'ASC')
    .all(),
)

useSeoMeta({
  title: `${t('nav.work')} — Tommaso Valenzano`,
  description: t('work.index_description'),
})
</script>

<template>
  <section class="mx-auto max-w-5xl px-6 py-16 md:py-24">
    <header class="hero-stagger mb-14 space-y-4">
      <p class="font-mono text-sm text-[color:var(--color-accent)]">/work</p>
      <h1 class="text-4xl md:text-6xl font-semibold tracking-tight">
        {{ t('work.title') }}
      </h1>
      <p class="text-lg text-[color:var(--color-muted)] max-w-2xl">
        {{ t('work.intro') }}
      </p>
    </header>

    <div v-if="projects?.length" v-reveal class="grid gap-4">
      <NuxtLink
        v-for="project in projects"
        :key="project.slug"
        :to="localePath(`/work/${project.slug}`)"
        class="group block p-6 md:p-8 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/40 hover:bg-[color:var(--color-surface)] hover:border-[color:var(--color-accent)] hover:shadow-[0_0_0_1px_var(--color-accent),0_18px_40px_-12px_rgba(0,229,255,0.2)] hover:-translate-y-0.5 transition-all duration-300"
      >
        <div class="flex items-start justify-between gap-6 mb-3">
          <h2
            class="project-card-title text-2xl md:text-3xl font-semibold tracking-tight group-hover:text-[color:var(--color-accent)] transition-colors"
            :style="{ '--vt-name': `project-title-${project.slug}` } as any"
          >
            {{ project.title }}
          </h2>
          <span class="font-mono text-xs text-[color:var(--color-subtle)] whitespace-nowrap pt-2">
            {{ project.period || '' }}
          </span>
        </div>
        <p class="text-[color:var(--color-muted)] leading-relaxed">
          {{ project.subtitle }}
        </p>
        <div v-if="project.stack?.length" class="flex flex-wrap gap-2 pt-5">
          <span
            v-for="tech in project.stack.slice(0, 6)"
            :key="tech"
            class="font-mono text-[11px] px-2 py-0.5 rounded border border-[color:var(--color-border)] text-[color:var(--color-subtle)]"
          >
            {{ tech }}
          </span>
        </div>
      </NuxtLink>
    </div>

    <div v-else class="text-[color:var(--color-muted)] font-mono text-sm">
      {{ t('work.empty') }}
    </div>
  </section>
</template>
