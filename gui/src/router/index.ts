import { createRouter, createWebHistory } from 'vue-router'
import Construction from '@/views/Construction.vue'
import List from '@/views/List.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'create',
      component: Construction,
    },
    {
      path: '/:id',
      name: 'update',
      component: Construction,
    },
    {
      path: '/list',
      name: 'list',
      component: List,
    },
  ],
})

export default router
