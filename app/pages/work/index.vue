<script setup lang="ts">
const { t } = useI18n()
useSeoMeta({ title: `${t('nav.work')} — Tommaso Valenzano` })
</script>

<template>
  <section class="mx-auto max-w-6xl px-6 py-24">
    <p class="font-mono text-sm text-[color:var(--color-accent)]">/work</p>
    <h1 class="mt-4 text-4xl md:text-6xl font-semibold tracking-tight">
      {{ t('nav.work') }}
    </h1>
    <p class="mt-6 text-lg text-[color:var(--color-muted)] max-w-2xl">
      Case study in arrivo.
    </p>
  </section>
</template>
