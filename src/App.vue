<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const hideHeader = computed(() => {
  return route.path === '/login' || route.path === '/cadastro'
})
</script>

<template>
  <header v-if="!hideHeader" class="app-header">
    <nav class="app-nav">
      <router-link to="/livros">Livros</router-link>
      <router-link to="/categoria">Categoria</router-link>
      <router-link to="/autor">Autor</router-link>
      <router-link to="/login">Sair</router-link>
    </nav>
  </header>

  <main :class="{ 'with-header': !hideHeader }">
    <router-view></router-view>
  </main>
</template>

<style>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 0.85rem 1rem;
  background: rgba(15, 23, 42, 0.92);
  border-bottom: 1px solid rgba(148, 163, 184, 0.3);
  backdrop-filter: blur(8px);
}

.app-nav {
  max-width: 1080px;
  margin: 0 auto;
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.app-nav a {
  color: #f8fafc;
  text-decoration: none;
  padding: 0.45rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid transparent;
  transition: background-color 160ms ease, border-color 160ms ease;
}

.app-nav a:hover {
  background: rgba(30, 41, 59, 0.9);
  border-color: rgba(148, 163, 184, 0.4);
}

.app-nav .router-link-active {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(96, 165, 250, 0.7);
}

main.with-header {
  padding-top: 4.1rem;
}

@media (max-width: 640px) {
  .app-header {
    padding: 0.7rem 0.75rem;
  }

  main.with-header {
    padding-top: 4.8rem;
  }
}
</style>
