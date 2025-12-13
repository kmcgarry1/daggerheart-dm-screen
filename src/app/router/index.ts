import { createRouter, createWebHistory } from 'vue-router'

import { DMScreenPage, WidgetLibraryPage } from '@/features/dm-screen'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'screen',
      component: DMScreenPage,
    },
    {
      path: '/widget-library',
      name: 'widget-library',
      component: WidgetLibraryPage,
    },
  ],
})

export default router
