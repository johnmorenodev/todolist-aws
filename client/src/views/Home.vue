<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
defineOptions({ name: 'HomeView' })
</script>

<template>
  <div>
    <h2>Home</h2>
    <p>Welcome, {{ auth.username }}!</p>
    <button @click="auth.logout">Logout</button>
  </div>
  
</template>

<style scoped>
button { cursor: pointer; }
</style>


