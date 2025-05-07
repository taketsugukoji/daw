import { createRouter, createWebHistory } from 'vue-router'
import ConstructionView from '@/views/ConstructionView.vue'
import ListView from '@/views/ListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'create',
      component: ConstructionView,
    },
    {
      path: '/:id',
      name: 'update',
      component: ConstructionView,
    },
    {
      path: '/list',
      name: 'list',
      component: ListView,
    },
  ],
})

export default router
