<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

async function submit() {
  loading.value = true
  error.value = null
  try {
    await auth.login(username.value, password.value)
    const redirect = (route.query.redirect as string) || '/'
    router.replace(redirect)
  } catch (e: any) {
    error.value = e?.response?.data?.error || 'Login failed'
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
  </div>
</template>

<style scoped>
form { display: grid; gap: .5rem; max-width: 320px; }
button { cursor: pointer; }
</style>


