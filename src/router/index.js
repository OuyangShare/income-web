import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../components/layout.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', redirect: '/web' },
      { path: '/web', name: 'home', meta: { title: '首页' }, component: () => import('../views/home.vue') },
      { path: '/web/commodity', name: 'commodity', meta: { title: '商品管理' }, component: () => import('../views/commodity/index.vue') },
      { path: '/web/commodity/edit', name: 'commodityEdit', meta: { title: '商品编辑' }, component: () => import('../views/commodity/edit.vue') },
    ]
  },
  { path: '/web/login', component: () => import('../views/login/index.vue') },
  // 其他页面路由
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router