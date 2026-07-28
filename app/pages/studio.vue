<script setup lang="ts">
definePageMeta({
  layout: 'studio',
})

defineI18nRoute({
  locales: false,
})

useSeoMeta({
  title: 'Tom Studio · Siti web',
  description: 'Tom Studio — siti web su misura per attività, professionisti e brand emergenti. Veloce, pulito, su misura.',
  ogTitle: 'Tom Studio · Siti web',
  ogDescription: 'Siti web su misura per attività, professionisti e brand. Niente template, niente fronzoli.',
  ogSiteName: 'Tom Studio',
  ogType: 'website',
  ogLocale: 'it_IT',
  ogLocaleAlternate: [],
  ogUrl: '',
  ogImage: '',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Tom Studio · Siti web',
  twitterDescription: 'Siti web su misura per attività, professionisti e brand.',
  twitterImage: '',
  themeColor: '#0A0A0A',
})

const currentYear = new Date().getFullYear()

const projects = [
  {
    name: 'Paninoteca da Daniele',
    description: 'Brand giocoso per una paninoteca street food a Bari. Ordini online, menù digitale, fedeltà con QR.',
    image: '/img/smash.jpg',
    href: 'https://comelosmash.it/',
  },
  {
    name: 'Room n.14',
    description: 'Brand minimal per un B&B di città. Performance 100/100, tipografia su misura.',
    image: '/img/room-n14.jpg',
    href: 'https://roomn14.it/',
  },
  {
    name: 'Capretti Guest House',
    description: 'Sito vetrina con identità calda e prenotazioni dirette. Mobile-first, multi lingua.',
    image: '/img/capretti.jpg',
    href: 'https://caprettiguesthouse.netlify.app/',
  },
]
</script>

<template>
  <div class="studio">
    <header class="studio-nav">
      <div class="brand">
        <span>TOM STUDIO</span>
        <span class="brand-dot" aria-hidden="true" />
      </div>
    </header>

    <section class="hero">
      <h1 class="hero-title">
        Tom<br>Studio<span class="accent">.</span>
      </h1>
      <p class="hero-lead">
        Siti web su misura per attività, professionisti, brand.
      </p>
      <a
        class="cta"
        href="https://instagram.com/tomstudio.it"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>Scrivimi su Instagram</span>
        <span class="cta-arrow" aria-hidden="true">→</span>
      </a>
    </section>

    <section class="what">
      <p class="kicker">SITI WEB PER</p>
      <h2 class="what-list">
        <span class="what-item">Attività<span class="dot">·</span></span>
        <span class="what-item">Professionisti<span class="dot">·</span></span>
        <span class="what-item">Brand<span class="dot">·</span></span>
      </h2>
      <ul class="what-detail">
        <li><strong>Attività</strong> — B&amp;B, ristoranti, locali, negozi.</li>
        <li><strong>Professionisti</strong> — studi, avvocati, consulenti, freelance.</li>
        <li><strong>Brand</strong> — progetti emergenti, label, idee da lanciare.</li>
      </ul>
    </section>

    <section class="projects">
      <p class="kicker">PROGETTI</p>
      <div class="projects-grid">
        <article
          v-for="project in projects"
          :key="project.name"
          class="project"
        >
          <div class="project-cover">
            <img
              v-if="project.image"
              class="project-img"
              :src="project.image"
              :alt="`Sito ${project.name}`"
              width="1400"
              height="893"
              loading="lazy"
              decoding="async"
            >
            <span v-else class="project-cover-mark" aria-hidden="true">{{ project.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() }}</span>
          </div>
          <h3 class="project-name">{{ project.name }}</h3>
          <p class="project-desc">{{ project.description }}</p>
          <a
            v-if="project.href && project.href !== '#'"
            class="project-link"
            :href="project.href"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>vedi il sito</span>
            <span aria-hidden="true">→</span>
          </a>
          <span v-else class="project-link is-soon">presto online</span>
        </article>
      </div>
    </section>

    <section class="method">
      <p class="kicker">COME LAVORO</p>
      <div class="method-lines">
        <p class="method-line">
          Veloce, pulito,<br>su <span class="accent">misura</span>.
        </p>
        <p class="method-line">
          Niente template,<br>niente fronzoli.
        </p>
        <p class="method-line">
          Tu pensi al locale,<br>al sito penso io.
        </p>
      </div>
    </section>

    <section class="contact">
      <p class="kicker">PARLIAMONE</p>
      <h2 class="contact-title">
        Ti serve<br>un sito<span class="accent">?</span>
      </h2>
      <a
        class="contact-link"
        href="https://instagram.com/tomstudio.it"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="contact-arrow" aria-hidden="true">→</span>
        <span>Instagram</span>
        <span class="contact-handle">@tomstudio.it</span>
      </a>
      <p class="contact-sub">Ti rispondo personalmente.</p>
    </section>

    <footer class="studio-foot">
      <span>© {{ currentYear }} Tom Studio</span>
      <a
        href="https://instagram.com/tomstudio.it"
        target="_blank"
        rel="noopener noreferrer"
      >Instagram →</a>
    </footer>
  </div>
</template>

<style scoped>
.studio {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 24px 0;
}

.studio-nav {
  padding: 8px 0 64px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'Anton', Impact, sans-serif;
  font-size: 16px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: 0.7;
}

.brand-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--studio-accent);
  align-self: center;
  margin-bottom: 0;
}

.kicker {
  font-family: 'Anton', Impact, sans-serif;
  font-size: 14px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  opacity: 0.55;
  margin-bottom: 28px;
}

.hero {
  padding: 32px 0 96px;
}

.hero-title {
  font-family: 'Anton', Impact, sans-serif;
  font-weight: 400;
  font-size: clamp(72px, 18vw, 192px);
  line-height: 0.92;
  letter-spacing: 0.01em;
  margin: 0 0 28px;
}

.accent {
  color: var(--studio-accent);
}

.hero-lead {
  font-family: 'Inter', sans-serif;
  font-size: clamp(18px, 2.4vw, 24px);
  line-height: 1.45;
  max-width: 28ch;
  opacity: 0.88;
  margin: 0 0 40px;
}

.cta {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  font-family: 'Anton', Impact, sans-serif;
  font-size: clamp(18px, 2.2vw, 22px);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--studio-fg);
  text-decoration: none;
  padding: 18px 0;
  border-top: 1px solid rgba(245, 241, 232, 0.25);
  border-bottom: 1px solid rgba(245, 241, 232, 0.25);
  width: 100%;
  max-width: 420px;
  justify-content: space-between;
  transition: color 180ms ease, border-color 180ms ease;
}

.cta:hover,
.cta:focus-visible {
  color: var(--studio-accent);
  border-color: var(--studio-accent);
}

.cta-arrow {
  color: var(--studio-accent);
  font-size: 1.1em;
  transition: transform 180ms ease;
}

.cta:hover .cta-arrow {
  transform: translateX(4px);
}

.what {
  padding: 80px 0;
  border-top: 1px solid rgba(245, 241, 232, 0.1);
}

.what-list {
  font-family: 'Anton', Impact, sans-serif;
  font-weight: 400;
  font-size: clamp(48px, 11vw, 128px);
  line-height: 1.05;
  letter-spacing: 0.03em;
  margin: 0 0 56px;
}

.what-item {
  display: block;
}

.dot {
  color: var(--studio-accent);
  margin-left: 8px;
}

.what-detail {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 14px;
  font-family: 'Inter', sans-serif;
  font-size: clamp(15px, 1.6vw, 18px);
  line-height: 1.5;
  opacity: 0.85;
  max-width: 60ch;
}

.what-detail strong {
  font-weight: 600;
}

.projects {
  padding: 80px 0;
  border-top: 1px solid rgba(245, 241, 232, 0.1);
}

.projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 56px;
}

@media (min-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr 1fr;
    gap: 56px 40px;
  }
}

.project {
  display: flex;
  flex-direction: column;
}

.project-cover {
  aspect-ratio: 4 / 3;
  background: #141414;
  border: 1px solid rgba(245, 241, 232, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
}

.project-cover::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg, transparent 0%, transparent 60%, rgba(199, 62, 29, 0.18) 100%);
  pointer-events: none;
}

.project-cover-mark {
  font-family: 'Anton', Impact, sans-serif;
  font-size: clamp(48px, 8vw, 88px);
  letter-spacing: 0.04em;
  opacity: 0.18;
}

.project-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  display: block;
  transition: transform 400ms ease;
}

.project:hover .project-img {
  transform: scale(1.03);
}

.project-name {
  font-family: 'Anton', Impact, sans-serif;
  font-weight: 400;
  font-size: clamp(28px, 3.4vw, 38px);
  letter-spacing: 0.02em;
  line-height: 1.1;
  margin: 0 0 12px;
}

.project-desc {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  line-height: 1.55;
  opacity: 0.82;
  margin: 0 0 18px;
  max-width: 42ch;
}

.project-link {
  font-family: 'Anton', Impact, sans-serif;
  font-size: 16px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--studio-fg);
  display: inline-flex;
  gap: 10px;
  align-items: center;
  align-self: flex-start;
  transition: color 180ms ease;
}

.project-link:hover,
.project-link:focus-visible {
  color: var(--studio-accent);
}

.project-link.is-soon {
  opacity: 0.45;
  pointer-events: none;
}

.method {
  padding: 96px 0;
  border-top: 1px solid rgba(245, 241, 232, 0.1);
}

.method-lines {
  display: grid;
  gap: 48px;
}

.method-line {
  font-family: 'Anton', Impact, sans-serif;
  font-weight: 400;
  font-size: clamp(40px, 7vw, 88px);
  line-height: 1.02;
  letter-spacing: 0.02em;
  margin: 0;
}

.contact {
  padding: 96px 0;
  border-top: 1px solid rgba(245, 241, 232, 0.1);
}

.contact-title {
  font-family: 'Anton', Impact, sans-serif;
  font-weight: 400;
  font-size: clamp(56px, 12vw, 144px);
  line-height: 0.95;
  letter-spacing: 0.01em;
  margin: 0 0 48px;
}

.contact-link {
  display: inline-flex;
  align-items: baseline;
  gap: 18px;
  font-family: 'Anton', Impact, sans-serif;
  font-size: clamp(24px, 3.4vw, 36px);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--studio-fg);
  transition: color 180ms ease;
}

.contact-link:hover,
.contact-link:focus-visible {
  color: var(--studio-accent);
}

.contact-arrow {
  color: var(--studio-accent);
  transition: transform 180ms ease;
}

.contact-link:hover .contact-arrow {
  transform: translateX(4px);
}

.contact-handle {
  font-family: 'Inter', sans-serif;
  font-size: 0.55em;
  letter-spacing: 0.04em;
  text-transform: none;
  opacity: 0.7;
}

.contact-sub {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  line-height: 1.5;
  opacity: 0.7;
  margin: 24px 0 0;
}

.studio-foot {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
  justify-content: space-between;
  align-items: center;
  padding: 32px 0 40px;
  border-top: 1px solid rgba(245, 241, 232, 0.12);
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  letter-spacing: 0.04em;
  opacity: 0.55;
}

.studio-foot a {
  color: inherit;
  text-decoration: none;
  transition: color 180ms ease, opacity 180ms ease;
}

.studio-foot a:hover,
.studio-foot a:focus-visible {
  color: var(--studio-accent);
  opacity: 1;
}

@media (min-width: 768px) {
  .studio {
    padding: 40px 56px 0;
  }

  .studio-nav {
    padding: 8px 0 96px;
  }

  .hero {
    padding: 24px 0 128px;
  }

  .what,
  .projects,
  .method,
  .contact {
    padding: 120px 0;
  }
}
</style>
