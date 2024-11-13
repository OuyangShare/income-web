import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('../views/home.vue') },
  // { path: '/dashboard', component: () => import('../views/dashboard.vue') },
  // 其他页面路由
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router