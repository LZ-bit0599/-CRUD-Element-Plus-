import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import { userStore } from '../stores/user'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', component: Login },
  {
    path: '/',
    component: AdminLayout,
    children: [
      { path: 'dashboard', component: () => import('../views/Dashboard.vue') },
      { path: 'book-list', component: () => import('../views/BookList.vue') },
      { path: 'borrow-records', component: () => import('../views/BorrowRecords.vue') },
      { path: 'borrow-calendar', component: () => import('../views/BorrowCalendar.vue') },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 全局前置守卫：未登录访问业务页则跳回登录
router.beforeEach((to) => {
  if (to.path !== '/login' && !userStore.token) {
    return '/login'
  }
})

export default router