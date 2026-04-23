<script setup lang="ts">
const { t } = useI18n()
useSeoMeta({ title: `${t('nav.studies')} — Tommaso Valenzano` })
</script>

<template>
  <section class="mx-auto max-w-6xl px-6 py-24">
    <p class="font-mono text-sm text-[color:var(--color-accent)]">/studies</p>
    <h1 class="mt-4 text-4xl md:text-6xl font-semibold tracking-tight">
      {{ t('nav.studies') }}
    </h1>
    <p class="mt-6 text-lg text-[color:var(--color-muted)] max-w-2xl">
      Case study in arrivo.
    </p>
  </section>
</template>
