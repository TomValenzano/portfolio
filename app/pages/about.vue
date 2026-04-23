<script setup lang="ts">
const { t } = useI18n()
useSeoMeta({ title: `${t('nav.about')} — Tommaso Valenzano` })
</script>

<template>
  <section class="mx-auto max-w-3xl px-6 py-24">
    <p class="font-mono text-sm text-[color:var(--color-accent)]">/about</p>
    <h1 class="mt-4 text-4xl md:text-6xl font-semibold tracking-tight">
      {{ t('nav.about') }}
    </h1>
    <p class="mt-6 text-lg text-[color:var(--color-muted)]">
      Contenuto in arrivo.
    </p>
  </section>
</template>
