<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './AppSidebar.vue'
import AppTopbar from './AppTopbar.vue'
import CommandPalette from './CommandPalette.vue'
import ThemeBackground from '../ui/ThemeBackground.vue'

const route = useRoute()

function readCollapsed(): boolean {
  try {
    return window.localStorage.getItem('lumina-sidebar') === '1'
  } catch {
    return false
  }
}

const collapsed = ref(readCollapsed())
const mobileOpen = ref(false)
const paletteOpen = ref(false)

function toggleCollapse() {
  collapsed.value = !collapsed.value
  try {
    window.localStorage.setItem('lumina-sidebar', collapsed.value ? '1' : '0')
  } catch {
    /* storage unavailable */
  }
}

function onKeydown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    paletteOpen.value = !paletteOpen.value
    return
  }
  if (event.key === 'Escape') {
    mobileOpen.value = false
    paletteOpen.value = false
  }
}

watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false
  },
)

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="shell" :class="{ 'is-collapsed': collapsed }">
    <ThemeBackground />
    <a href="#main" class="skip-link">Skip to content</a>

    <AppSidebar
      :collapsed="collapsed"
      :mobile-open="mobileOpen"
      @toggle-collapse="toggleCollapse"
      @close="mobileOpen = false"
    />

    <button
      type="button"
      class="scrim"
      :class="{ show: mobileOpen }"
      aria-label="Close navigation"
      :tabindex="mobileOpen ? 0 : -1"
      @click="mobileOpen = false"
    />

    <div class="shell-main">
      <AppTopbar @toggle-sidebar="mobileOpen = !mobileOpen" @open-palette="paletteOpen = true" />
      <main id="main" class="shell-content" tabindex="-1">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <CommandPalette :open="paletteOpen" @close="paletteOpen = false" />
  </div>
</template>

<style scoped>
.shell {
  position: relative;
  min-height: 100vh;
}

.shell-main {
  position: relative;
  z-index: 1;
  margin-left: var(--sidebar-w);
  min-height: 100vh;
  transition: margin-left var(--dur-slow) var(--ease);
}

.is-collapsed .shell-main {
  margin-left: var(--sidebar-w-collapsed);
}

.shell-content {
  width: 100%;
  max-width: 1480px;
  margin: 0 auto;
  padding: 30px 32px 56px;
  outline: none;
}

.scrim {
  position: fixed;
  inset: 0;
  z-index: 60;
  border: 0;
  padding: 0;
  background: rgba(4, 8, 16, 0.45);
  backdrop-filter: blur(3px);
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--dur) var(--ease), visibility var(--dur) var(--ease);
}

.scrim.show {
  opacity: 1;
  visibility: visible;
}

@media (max-width: 1023px) {
  .shell-main,
  .is-collapsed .shell-main {
    margin-left: 0;
  }

  .shell-content {
    padding: 22px 20px 48px;
  }
}

@media (max-width: 640px) {
  .shell-content {
    padding: 18px 14px 40px;
  }
}
</style>
