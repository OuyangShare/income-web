import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../components/layout.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', name: 'home', meta: { title: '首页' }, component: () => import('../views/home.vue') },
      { path: '/commodity', name: 'commodity', meta: { title: '商品管理' }, component: () => import('../views/commodity/index.vue') },
      { path: '/commodity/edit', name: 'commodityEdit', meta: { title: '商品管理' }, component: () => import('../views/commodity/edit.vue') },
      { path: '/commodity/add', name: 'commodityAdd', meta: { title: '商品管理' }, component: () => import('../views/commodity/edit.vue') },
      { path: '/commodity/improve', name: 'commodityImprove', meta: { title: '商品管理' }, component: () => import('../views/commodity/improve.vue') },
      { path: '/commodity/info', name: 'commodityInfo', meta: { title: '商品管理' }, component: () => import('../views/commodity/info.vue') },
    ]
  },
  { path: '/login', component: () => import('../views/login/index.vue') },
  // 其他页面路由
]

const router = createRouter({
  history: createWebHistory('/web'),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 如果路径包含/web,则重定向到去掉/web的路径
  if (to.path.startsWith('/web')) {
    next(to.path.replace('/web', ''))
  } else {
    next()
  }
})

export default router