import type { Component } from 'vue'
import { BarChart3, FolderKanban, Inbox, LayoutDashboard, Settings, Wallet } from '@lucide/vue'

export interface NavItem {
  label: string
  to: string
  icon: Component
  badge?: string
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    title: 'Workspace',
    items: [
      { label: 'Overview', to: '/', icon: LayoutDashboard },
      { label: 'Analytics', to: '/analytics', icon: BarChart3 },
      { label: 'Projects', to: '/projects', icon: FolderKanban },
      { label: 'Finance', to: '/finance', icon: Wallet },
      { label: 'Inbox', to: '/inbox', icon: Inbox },
    ],
  },
  {
    title: 'System',
    items: [{ label: 'Settings', to: '/settings', icon: Settings }],
  },
]

export const flatNav = navGroups.flatMap((group) => group.items)
