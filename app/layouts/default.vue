<script setup lang="ts">
const { locale, locales, t } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="min-h-dvh flex flex-col relative">
    <div class="bg-layer bg-grid" aria-hidden="true" />
    <div class="bg-layer bg-glow" aria-hidden="true" />

    <header class="sticky top-0 z-20 backdrop-blur-md bg-[color:var(--color-bg)]/70 border-b border-[color:var(--color-border)]">
      <nav class="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <NuxtLink :to="localePath('/')" class="flex items-center gap-2.5 group">
          <span class="flex items-center justify-center w-7 h-7 rounded-md border border-[color:var(--color-border)] font-mono text-[11px] font-semibold tracking-wider group-hover:border-[color:var(--color-accent)] group-hover:text-[color:var(--color-accent)] transition-colors">
            TV
          </span>
          <span class="hidden sm:inline text-sm tracking-tight group-hover:text-[color:var(--color-accent)] transition-colors">
            Tommaso Valenzano
          </span>
        </NuxtLink>

        <div class="flex items-center gap-6 text-sm">
          <NuxtLink :to="localePath('/work')" class="text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)] transition-colors">
            {{ t('nav.work') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/studies')" class="text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)] transition-colors">
            {{ t('nav.studies') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/about')" class="text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)] transition-colors">
            {{ t('nav.about') }}
          </NuxtLink>

          <div class="font-mono text-xs flex gap-1 pl-4 border-l border-[color:var(--color-border)]">
            <NuxtLink
              v-for="l in locales"
              :key="l.code"
              :to="switchLocalePath(l.code) || '/'"
              :class="[
                'hover:text-[color:var(--color-accent)] transition-colors',
                locale === l.code ? 'text-[color:var(--color-fg)]' : 'text-[color:var(--color-subtle)]',
              ]"
            >
              {{ l.code }}
            </NuxtLink>
          </div>
        </div>
      </nav>
    </header>

    <main class="flex-1 relative z-10">
      <slot />
    </main>

    <footer class="relative z-10 border-t border-[color:var(--color-border)] font-mono text-xs text-[color:var(--color-subtle)] bg-[color:var(--color-bg)]/50 backdrop-blur-sm">
      <div class="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row justify-between gap-4">
        <span>© {{ currentYear }} Tommaso Valenzano</span>
        <div class="flex gap-5">
          <a
            href="mailto:tommaso.valenzano@gmail.com"
            class="hover:text-[color:var(--color-accent)] transition-colors"
          >{{ t('footer.email') }}</a>
          <a
            href="https://www.linkedin.com/in/tommasovalenzano/"
            target="_blank"
            rel="noopener"
            class="hover:text-[color:var(--color-accent)] transition-colors"
          >{{ t('footer.linkedin') }}</a>
        </div>
      </div>
    </footer>
  </div>
</template>
