import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const Home = () => import('@/views/Home.vue')
const Login = () => import('@/views/Login.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Home, meta: { requiresAuth: true } },
    { path: '/login', name: 'login', component: Login },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (auth.initializing) {
    await auth.bootstrap()
  }
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    // Attempt a one-time silent refresh before redirecting to login
    const refreshed = await auth.tryRefresh()
    if (refreshed) {
      await auth.bootstrap()
      if (auth.isAuthenticated) return
    }
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})

export default router
