<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { isAxiosError } from 'axios'
import { signup } from '@/api/auth'

const email = ref('')
const username = ref('')
const password = ref('')
const firstName = ref('')
const lastName = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

const router = useRouter()

defineOptions({ name: 'SignupView' })

async function submit() {
  loading.value = true
  error.value = null
  try {
    await signup({ email: email.value, username: username.value, password: password.value, firstName: firstName.value, lastName: lastName.value })
    router.replace('/')
  } catch (err: unknown) {
    let message: string | undefined
    if (isAxiosError(err)) {
      const data = err.response?.data as { error?: string } | undefined
      message = data?.error
    }
    error.value = message || 'Signup failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h2>Sign up</h2>
    <form @submit.prevent="submit">
      <label>
        Email
        <input v-model="email" type="email" autocomplete="email" />
      </label>
      <label>
        Username
        <input v-model="username" autocomplete="username" />
      </label>
      <label>
        Password
        <input type="password" v-model="password" autocomplete="new-password" />
      </label>
      <label>
        First name
        <input v-model="firstName" autocomplete="given-name" />
      </label>
      <label>
        Last name
        <input v-model="lastName" autocomplete="family-name" />
      </label>
      <button :disabled="loading">{{ loading ? 'Creating…' : 'Create account' }}</button>
    </form>
    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>

<style scoped>
form { display: grid; gap: .5rem; max-width: 420px; }
button { cursor: pointer; }
</style>
