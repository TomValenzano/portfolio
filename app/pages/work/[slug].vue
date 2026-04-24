<script setup lang="ts">
const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()

const slug = route.params.slug as string
const collectionName = `projects_${locale.value}` as 'projects_it' | 'projects_en'

const { data: project } = await useAsyncData(
  `work-${locale.value}-${slug}`,
  () => queryCollection(collectionName)
    .where('slug', '=', slug)
    .where('category', '=', 'work')
    .first(),
)

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

useSeoMeta({
  title: `${project.value.title} — Tommaso Valenzano`,
  description: project.value.subtitle,
  ogTitle: project.value.title,
  ogDescription: project.value.subtitle,
})
</script>

<template>
  <article class="mx-auto max-w-3xl px-6 py-16 md:py-24">
    <header class="hero-stagger space-y-5 mb-14">
      <NuxtLink
        :to="localePath('/work')"
        class="group inline-flex items-center gap-2 font-mono text-xs text-[color:var(--color-muted)] hover:text-[color:var(--color-accent)] transition-colors"
      >
        <span aria-hidden="true" class="inline-block transition-transform duration-200 group-hover:-translate-x-0.5">←</span> {{ t('project.back_to_work') }}
      </NuxtLink>

      <h1
        class="project-hero-title text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] text-balance"
        :style="{ '--vt-name': `project-title-${project.slug}` } as any"
      >
        {{ project.title }}
      </h1>

      <p class="text-lg md:text-xl text-[color:var(--color-muted)] leading-relaxed">
        {{ project.subtitle }}
      </p>

      <dl class="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6 pt-4 border-t border-[color:var(--color-border)]">
        <div v-if="project.role">
          <dt class="font-mono text-[10px] uppercase tracking-wider text-[color:var(--color-subtle)]">{{ t('project.role') }}</dt>
          <dd class="mt-1 text-sm">{{ project.role }}</dd>
        </div>
        <div v-if="project.period">
          <dt class="font-mono text-[10px] uppercase tracking-wider text-[color:var(--color-subtle)]">{{ t('project.period') }}</dt>
          <dd class="mt-1 text-sm">{{ project.period }}</dd>
        </div>
        <div v-if="project.links?.live" class="col-span-full sm:col-span-1">
          <dt class="font-mono text-[10px] uppercase tracking-wider text-[color:var(--color-subtle)]">{{ t('project.link') }}</dt>
          <dd class="mt-1 text-sm">
            <a :href="project.links.live" target="_blank" rel="noopener" class="text-[color:var(--color-accent)] hover:underline">
              {{ project.links.live.replace(/^https?:\/\//, '') }} ↗
            </a>
          </dd>
        </div>
      </dl>

      <div v-if="project.stack?.length" class="flex flex-wrap gap-2 pt-2">
        <span
          v-for="tech in project.stack"
          :key="tech"
          class="font-mono text-xs px-2.5 py-1 rounded border border-[color:var(--color-border)] text-[color:var(--color-muted)]"
        >
          {{ tech }}
        </span>
      </div>
    </header>

    <ContentRenderer
      :value="project"
      class="prose prose-invert max-w-none prose-headings:tracking-tight prose-headings:font-semibold prose-a:text-[color:var(--color-accent)] prose-a:no-underline hover:prose-a:underline prose-code:text-[color:var(--color-accent)] prose-code:bg-[color:var(--color-surface)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:hidden prose-code:after:hidden prose-pre:bg-[color:var(--color-surface)] prose-pre:border prose-pre:border-[color:var(--color-border)] prose-strong:text-[color:var(--color-fg)] prose-hr:border-[color:var(--color-border)]"
    />
  </article>
</template>
