import { computed } from 'vue'
import type { Conversation } from '@/types'
import { conversations as seedConversations } from '@/data/mock'
import { useStoredState } from './useStoredState'

function isConversationList(value: unknown): value is Conversation[] {
  return (
    Array.isArray(value) &&
    value.every((item: unknown) => {
      if (typeof item !== 'object' || item === null) return false
      const conversation = item as Record<string, unknown>
      return (
        typeof conversation.id === 'string' &&
        typeof conversation.name === 'string' &&
        typeof conversation.initials === 'string' &&
        typeof conversation.role === 'string' &&
        typeof conversation.subject === 'string' &&
        typeof conversation.preview === 'string' &&
        typeof conversation.time === 'string' &&
        typeof conversation.unread === 'boolean' &&
        typeof conversation.online === 'boolean' &&
        Array.isArray(conversation.messages) &&
        conversation.messages.every((message: unknown) => {
          if (typeof message !== 'object' || message === null) return false
          const entry = message as Record<string, unknown>
          return (
            typeof entry.id === 'string' &&
            ['me', 'them'].includes(String(entry.from)) &&
            typeof entry.text === 'string' &&
            typeof entry.time === 'string'
          )
        })
      )
    })
  )
}

const conversations = useStoredState(
  'lumina-conversations',
  () =>
    seedConversations.map((conversation) => ({
      ...conversation,
      messages: conversation.messages.map((message) => ({ ...message })),
    })),
  isConversationList,
)

const unreadCount = computed(() => conversations.value.filter((conversation) => conversation.unread).length)

export function useConversations() {
  return { conversations, unreadCount }
}
