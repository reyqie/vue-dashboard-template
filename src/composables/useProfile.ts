import { useStoredState } from './useStoredState'

export interface UserProfile {
  name: string
  email: string
  role: string
  timezone: string
  bio: string
}

function isProfile(value: unknown): value is UserProfile {
  if (typeof value !== 'object' || value === null) return false
  const profile = value as Record<string, unknown>
  return (
    typeof profile.name === 'string' &&
    typeof profile.email === 'string' &&
    typeof profile.role === 'string' &&
    typeof profile.timezone === 'string' &&
    typeof profile.bio === 'string'
  )
}

const profile = useStoredState(
  'lumina-profile',
  () => ({
    name: 'Aria Reinhart',
    email: 'aria@lumina.studio',
    role: 'Product Designer',
    timezone: 'GMT+7 · Jakarta',
    bio: 'Designing calm, considered interfaces for data-heavy products.',
  }),
  isProfile,
)

export function useProfile() {
  return { profile }
}
