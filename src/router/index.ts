import { createRouter, createWebHistory } from 'vue-router'

import DMScreen from '../components/DMScreen.vue'
import WidgetLibraryPage from '../pages/WidgetLibraryPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'screen',
      component: DMScreen,
    },
    {
      path: '/widget-library',
      name: 'widget-library',
      component: WidgetLibraryPage,
    },
  ],
})

export default router
