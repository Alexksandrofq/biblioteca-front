import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Livros from '../pages/Livros.vue'
import Cadastro from '../pages/Cadastro.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/login', name: 'login', component: Login},
    {path: '/', redirect: '/login'},
    {path: '/cadastro', name: 'cadastro', component: Cadastro},
    {path: '/livros', name: 'livros', component: Livros},
  ],
})

export default router
