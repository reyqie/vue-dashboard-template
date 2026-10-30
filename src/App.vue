<script setup lang="ts">
import { useRoute } from 'vue-router'
import AppShell from './components/layout/AppShell.vue'
import ToastHost from './components/ui/ToastHost.vue'

const route = useRoute()
</script>

<template>
  <AppShell v-if="route.meta.layout !== 'auth'" />
  <router-view v-else v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
  <ToastHost />
</template>
