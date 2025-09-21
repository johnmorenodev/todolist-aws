<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { isAxiosError } from 'axios'

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

defineOptions({ name: 'LoginView' })

async function submit() {
  loading.value = true
  error.value = null
  try {
    await auth.login(username.value, password.value)
    const redirect = (route.query.redirect as string) || '/'
    router.replace(redirect)
  } catch (err: unknown) {
    let message: string | undefined
    if (isAxiosError(err)) {
      const data = err.response?.data as { error?: string } | undefined
      message = data?.error
    }
    error.value = message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="submit">
      <label>
        Username
        <input v-model="username" autocomplete="username" />
      </label>
      <label>
        Password
        <input type="password" v-model="password" autocomplete="current-password" />
      </label>
      <button :disabled="loading">{{ loading ? 'Logging in…' : 'Login' }}</button>
    </form>
    <p v-if="error" style="color: red">{{ error }}</p>
    <p>Don't have an account? <router-link to="/signup">Sign up</router-link></p>
  </div>
</template>

<style scoped>
form { display: grid; gap: .5rem; max-width: 320px; }
button { cursor: pointer; }
</style>


