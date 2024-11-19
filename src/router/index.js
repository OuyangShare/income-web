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
      { path: '/user', name: 'user', meta: { title: '用户管理', isadmin: true }, component: () => import('../views/user/list.vue') },
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
  // 获取token
  const token = localStorage.getItem('token')
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  console.log(userInfo);
  
  if (to.path.startsWith('/web')) {
    next(to.path.replace('/web', ''))
    return
  }

  // 白名单路径直接放行
  if (to.path === '/login') {
    next()
    return
  }

  // 未登录跳转到登录页
  if (!token) {
    next('/login')
    return
  }

  // 权限验证
  if (to.meta.isadmin && !userInfo.isadmin) {
    next('/')
    return
  }

  next()
})

export default router