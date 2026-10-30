<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Bell, ChevronRight, Menu, Search } from '@lucide/vue'
import { useConversations } from '@/composables/useConversations'
import { useProfile } from '@/composables/useProfile'
import ThemeSwitcher from '../ui/ThemeSwitcher.vue'

const emit = defineEmits<{
  'toggle-sidebar': []
  'open-palette': []
}>()

const route = useRoute()
const { profile } = useProfile()
const { unreadCount } = useConversations()
const pageTitle = computed(() => (typeof route.meta.title === 'string' ? route.meta.title : 'Dashboard'))
const inboxLabel = computed(() =>
  unreadCount.value ? `Open inbox, ${unreadCount.value} unread` : 'Open inbox',
)
const initials = computed(() =>
  profile.value.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join(''),
)
</script>

<template>
  <header class="topbar">
    <div class="topbar-left">
      <button type="button" class="icon-btn menu-btn" aria-label="Toggle navigation" @click="emit('toggle-sidebar')">
        <Menu />
      </button>
      <div class="crumb" aria-label="Breadcrumb">
        <span class="crumb-root">Lumina</span>
        <ChevronRight aria-hidden="true" />
        <strong>{{ pageTitle }}</strong>
      </div>
    </div>

    <div class="topbar-right">
      <button
        type="button"
        class="search-trigger"
        aria-label="Search pages (Control K)"
        @click="emit('open-palette')"
      >
        <Search aria-hidden="true" />
        <span class="search-text">Search pages…</span>
        <kbd>⌘K</kbd>
      </button>

      <ThemeSwitcher class="topbar-theme" />

      <RouterLink to="/inbox" class="icon-btn bell" :aria-label="inboxLabel">
        <Bell />
        <span v-if="unreadCount" class="bell-dot" aria-hidden="true" />
      </RouterLink>

      <RouterLink to="/settings" class="profile" aria-label="Open profile settings">
        <span class="avatar">{{ initials }}</span>
        <span class="profile-copy">
          <strong>{{ profile.name }}</strong>
          <small>{{ profile.role }}</small>
        </span>
      </RouterLink>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  height: var(--topbar-h);
  padding: 0 32px;
  border-bottom: 1px solid var(--border);
  background: var(--topbar-bg);
  backdrop-filter: blur(22px) saturate(150%);
  -webkit-backdrop-filter: blur(22px) saturate(150%);
  transition: background-color var(--dur-slow) var(--ease), border-color var(--dur-slow) var(--ease);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.menu-btn {
  display: none;
}

.crumb {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12.5px;
  white-space: nowrap;
}

.crumb-root {
  color: var(--text-faint);
}

.crumb svg {
  width: 14px;
  height: 14px;
  color: var(--text-faint);
}

.crumb strong {
  font-weight: 600;
  letter-spacing: -0.01em;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 10px 0 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-faint);
  font-size: 12px;
  transition: border-color var(--dur) var(--ease), background-color var(--dur) var(--ease), color var(--dur) var(--ease);
}

.search-trigger:hover {
  border-color: var(--border-strong);
  color: var(--text-muted);
  background: var(--surface-strong);
}

.search-trigger svg {
  width: 15px;
  height: 15px;
}

.search-text {
  min-width: 92px;
  text-align: left;
}

.search-trigger kbd {
  padding: 2px 5px;
  border-radius: 5px;
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--text-faint) 9%, transparent);
  font-family: var(--font-mono);
  font-size: 9.5px;
}

.bell-dot {
  position: absolute;
  top: 10px;
  right: 11px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--danger);
  box-shadow: 0 0 0 2px var(--surface-solid);
}

.profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 8px 4px 4px;
  margin-left: 2px;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  transition: background-color var(--dur) var(--ease), border-color var(--dur) var(--ease);
}

.profile:hover {
  background: color-mix(in srgb, var(--text-faint) 8%, transparent);
  border-color: var(--border);
}

.profile-copy {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  white-space: nowrap;
}

.profile-copy strong {
  font-size: 11.5px;
  font-weight: 700;
}

.profile-copy small {
  font-size: 9.5px;
  color: var(--text-faint);
}

@media (max-width: 1279px) {
  .search-text {
    display: none;
  }

  .search-trigger kbd {
    display: none;
  }

  .search-trigger {
    width: 40px;
    justify-content: center;
    padding: 0;
  }
}

@media (max-width: 1023px) {
  .topbar {
    padding: 0 20px;
  }

  .menu-btn {
    display: inline-grid;
  }
}

@media (max-width: 860px) {
  .profile-copy {
    display: none;
  }

  .profile {
    padding: 3px;
  }

  .topbar-theme {
    display: none;
  }
}

@media (max-width: 560px) {
  .topbar {
    padding: 0 14px;
    gap: 10px;
  }

  .crumb-root,
  .crumb svg {
    display: none;
  }

  .bell {
    display: none;
  }
}
</style>
