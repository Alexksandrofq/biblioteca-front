import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Livros from '../pages/Livros.vue'
import Cadastro from '../pages/Cadastro.vue'
import Categoria from '../pages/Categoria.vue'
import Autor from '../pages/Autor.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: Login },
    { path: '/', redirect: '/login' },
    { path: '/cadastro', name: 'cadastro', component: Cadastro },
    { path: '/livros', name: 'livros', component: Livros },
    { path: '/categoria', name: 'categoria', component: Categoria },
    { path: '/autor', name: 'autor', component: Autor }
  ],
})

export default router
