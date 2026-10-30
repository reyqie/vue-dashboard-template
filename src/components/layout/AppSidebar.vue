<script setup lang="ts">
import { useRoute } from 'vue-router'
import { PanelLeftClose, PanelLeftOpen, Sparkles } from '@lucide/vue'
import { navGroups } from '@/composables/useNav'
import { useConversations } from '@/composables/useConversations'
import { useTheme } from '@/composables/useTheme'

defineProps<{
  collapsed: boolean
  mobileOpen: boolean
}>()

const emit = defineEmits<{
  'toggle-collapse': []
  close: []
}>()

const route = useRoute()
const { currentTheme } = useTheme()
const { unreadCount } = useConversations()
</script>

<template>
  <aside class="sidebar" :class="{ collapsed, 'mobile-open': mobileOpen }">
    <div class="sidebar-inner">
      <RouterLink to="/" class="brand" aria-label="Lumina home" @click="emit('close')">
        <span class="brand-mark">
          <span class="brand-orb" />
        </span>
        <span class="brand-copy">
          <strong>Lumina</strong>
          <small>Design OS</small>
        </span>
      </RouterLink>

      <nav class="nav" aria-label="Main navigation">
        <div v-for="group in navGroups" :key="group.title" class="nav-group">
          <p class="nav-group-title">{{ group.title }}</p>
          <RouterLink
            v-for="item in group.items"
            :key="item.to"
            :to="item.to"
            class="nav-link"
            :class="{ active: route.path === item.to }"
            :aria-current="route.path === item.to ? 'page' : undefined"
            @click="emit('close')"
          >
            <component :is="item.icon" class="nav-icon" />
            <span class="nav-label">{{ item.label }}</span>
            <span v-if="item.to === '/inbox' && unreadCount" class="nav-badge">{{ unreadCount }}</span>
            <span v-else-if="item.badge" class="nav-badge">{{ item.badge }}</span>
          </RouterLink>
        </div>
      </nav>

      <div class="sidebar-foot">
        <div class="theme-card">
          <span class="theme-orb" :style="{ background: currentTheme.swatch }" />
          <div class="theme-copy">
            <span class="theme-name">{{ currentTheme.label }}</span>
            <span class="theme-desc">{{ currentTheme.description }}</span>
          </div>
        </div>

        <div class="promo">
          <span class="promo-icon"><Sparkles /></span>
          <div class="promo-copy">
            <strong>Lumina Pro</strong>
            <small>Unlock every template & theme.</small>
          </div>
          <button type="button" class="promo-btn" @click="emit('close')">Explore</button>
        </div>

        <button
          type="button"
          class="collapse-btn"
          :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          :aria-expanded="!collapsed"
          @click="emit('toggle-collapse')"
        >
          <PanelLeftOpen v-if="collapsed" />
          <PanelLeftClose v-else />
          <span class="nav-label">Collapse</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 70;
  width: var(--sidebar-w);
  background: var(--sidebar-bg);
  border-right: 1px solid var(--border);
  backdrop-filter: blur(24px) saturate(140%);
  -webkit-backdrop-filter: blur(24px) saturate(140%);
  transition: width var(--dur-slow) var(--ease), transform var(--dur-slow) var(--ease),
    background-color var(--dur-slow) var(--ease);
}

.sidebar-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px 14px;
  overflow-y: auto;
  overflow-x: hidden;
}

.brand {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 6px 8px;
  margin-bottom: 26px;
  border-radius: var(--radius-md);
  transition: background-color var(--dur) var(--ease);
}

.brand:hover {
  background: color-mix(in srgb, var(--text-faint) 8%, transparent);
}

.brand-mark {
  position: relative;
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  flex: none;
  border-radius: 13px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  box-shadow: 0 10px 22px -12px color-mix(in srgb, var(--primary) 80%, transparent);
}

.brand-orb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: radial-gradient(circle at 32% 30%, #fff 0%, rgba(255, 255, 255, 0.45) 45%, transparent 70%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35);
}

.brand-copy {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
  white-space: nowrap;
}

.brand-copy strong {
  font-size: 16px;
  letter-spacing: -0.03em;
}

.brand-copy small {
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: var(--text-faint);
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.nav-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.nav-group-title {
  padding: 0 10px;
  margin-bottom: 6px;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-faint);
  white-space: nowrap;
}

.nav-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 11px;
  min-height: 42px;
  padding: 0 10px;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  transition: color var(--dur) var(--ease), background-color var(--dur) var(--ease);
}

.nav-link:hover {
  color: var(--text);
  background: color-mix(in srgb, var(--text-faint) 8%, transparent);
}

.nav-link.active {
  color: var(--text);
  background: var(--primary-soft);
}

.nav-link.active::before {
  content: '';
  position: absolute;
  left: -14px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  border-radius: 0 4px 4px 0;
  background: linear-gradient(180deg, var(--primary), var(--accent));
  box-shadow: 0 0 12px var(--primary);
}

.nav-icon {
  width: 18px;
  height: 18px;
  flex: none;
  transition: color var(--dur) var(--ease);
}

.nav-link.active .nav-icon {
  color: var(--primary);
}

.nav-badge {
  margin-left: auto;
  display: grid;
  place-items: center;
  min-width: 20px;
  height: 19px;
  padding: 0 6px;
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 9.5px;
  font-weight: 600;
  color: var(--primary-strong);
  background: color-mix(in srgb, var(--primary) 16%, transparent);
}

[data-theme='space'] .nav-badge,
[data-theme='ocean'] .nav-badge {
  color: var(--primary);
}

.sidebar-foot {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: auto;
  padding-top: 22px;
}

.theme-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--surface-solid) 28%, transparent);
}

.theme-orb {
  width: 32px;
  height: 32px;
  flex: none;
  border-radius: 10px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.3);
}

.theme-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
  white-space: nowrap;
}

.theme-name {
  font-size: 12px;
  font-weight: 700;
}

.theme-desc {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 9.5px;
  color: var(--text-faint);
}

.promo {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  border-radius: var(--radius-md);
  border: 1px solid color-mix(in srgb, var(--primary) 22%, transparent);
  background: linear-gradient(150deg, var(--primary-soft), transparent 70%);
  overflow: hidden;
}

.promo-icon {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  color: var(--primary);
  background: color-mix(in srgb, var(--primary) 14%, transparent);
}

.promo-icon svg {
  width: 14px;
  height: 14px;
}

.promo-copy {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.promo-copy strong {
  font-size: 11.5px;
}

.promo-copy small {
  font-size: 9.5px;
  line-height: 1.4;
  color: var(--text-faint);
}

.promo-btn {
  align-self: flex-start;
  min-height: 28px;
  padding: 0 12px;
  border: 0;
  border-radius: 999px;
  background: var(--surface-strong);
  color: var(--text);
  font-size: 10.5px;
  font-weight: 700;
  box-shadow: var(--shadow-xs);
}

.collapse-btn {
  display: flex;
  align-items: center;
  gap: 11px;
  min-height: 38px;
  padding: 0 10px;
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-faint);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.collapse-btn:hover {
  color: var(--text);
  background: color-mix(in srgb, var(--text-faint) 8%, transparent);
}

.collapse-btn svg {
  width: 17px;
  height: 17px;
  flex: none;
}

/* Collapsed state */
.sidebar.collapsed {
  width: var(--sidebar-w-collapsed);
}

.sidebar.collapsed .brand {
  justify-content: center;
  padding: 6px 0;
}

.sidebar.collapsed .brand-copy,
.sidebar.collapsed .nav-label,
.sidebar.collapsed .nav-group-title,
.sidebar.collapsed .theme-copy,
.sidebar.collapsed .promo-copy,
.sidebar.collapsed .promo-btn {
  display: none;
}

.sidebar.collapsed .nav-link,
.sidebar.collapsed .collapse-btn {
  justify-content: center;
  padding: 0;
}

.sidebar.collapsed .nav-link.active::before {
  left: -14px;
}

.sidebar.collapsed .nav-badge {
  position: absolute;
  top: 7px;
  right: 10px;
  min-width: 7px;
  height: 7px;
  padding: 0;
  font-size: 0;
  border-radius: 50%;
  background: var(--primary);
}

.sidebar.collapsed .theme-card {
  justify-content: center;
  padding: 8px 0;
  border: 0;
  background: transparent;
}

.sidebar.collapsed .promo {
  display: none;
}

.sidebar.collapsed .nav-group {
  gap: 4px;
}

.sidebar.collapsed .nav {
  gap: 16px;
}

@media (max-width: 1023px) {
  .sidebar {
    width: 284px;
    transform: translateX(-104%);
    box-shadow: none;
  }

  .sidebar.mobile-open {
    transform: translateX(0);
    box-shadow: var(--shadow-lg);
  }

  .sidebar.collapsed {
    width: 284px;
  }

  .sidebar.collapsed .brand {
    justify-content: flex-start;
    padding: 6px 8px;
  }

  .sidebar.collapsed .brand-copy,
  .sidebar.collapsed .nav-label,
  .sidebar.collapsed .nav-group-title,
  .sidebar.collapsed .theme-copy,
  .sidebar.collapsed .promo-copy,
  .sidebar.collapsed .promo-btn {
    display: flex;
  }

  .sidebar.collapsed .nav-group-title {
    display: block;
  }

  .sidebar.collapsed .nav-link,
  .sidebar.collapsed .collapse-btn {
    justify-content: flex-start;
    padding: 0 10px;
  }

  .sidebar.collapsed .nav-badge {
    position: static;
    min-width: 20px;
    height: 19px;
    padding: 0 6px;
    font-size: 9.5px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--primary) 16%, transparent);
  }

  .sidebar.collapsed .theme-card {
    justify-content: flex-start;
    padding: 10px;
    border: 1px solid var(--border);
    background: color-mix(in srgb, var(--surface-solid) 28%, transparent);
  }

  .sidebar.collapsed .promo {
    display: flex;
  }

  .collapse-btn {
    display: none;
  }
}
</style>
