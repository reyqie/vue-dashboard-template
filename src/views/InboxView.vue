<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { ArrowLeft, CheckCheck, Mail, Search, Send } from '@lucide/vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import { useConversations } from '@/composables/useConversations'
import { useToast } from '@/composables/useToast'
import type { Conversation } from '@/types'

const { toast } = useToast()
const { conversations: threads, unreadCount } = useConversations()

const search = ref('')
const activeId = ref(threads.value[0]?.id ?? '')
const mobileThread = ref(false)

const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) return threads.value
  return threads.value.filter(
    (conversation) =>
      conversation.name.toLowerCase().includes(term) ||
      conversation.subject.toLowerCase().includes(term) ||
      conversation.preview.toLowerCase().includes(term),
  )
})

const active = computed(() => threads.value.find((conversation) => conversation.id === activeId.value) ?? null)
const messageList = ref<HTMLElement | null>(null)

function scrollToBottom() {
  const element = messageList.value
  if (element) element.scrollTop = element.scrollHeight
}

function selectThread(conversation: Conversation) {
  activeId.value = conversation.id
  conversation.unread = false
  mobileThread.value = true
  void nextTick(scrollToBottom)
}

function markAllRead() {
  threads.value.forEach((conversation) => {
    conversation.unread = false
  })
  toast('All conversations marked as read')
}

const draft = ref('')

function sendMessage() {
  const thread = active.value
  const text = draft.value.trim()
  if (!thread || !text) return
  const time = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date())
  thread.messages.push({ id: `m-${Date.now()}`, from: 'me', text, time })
  thread.preview = text
  thread.time = 'now'
  draft.value = ''
  void nextTick(scrollToBottom)
}

onMounted(scrollToBottom)
</script>

<template>
  <div class="view">
    <PageHeader eyebrow="Inbox" title="Conversations" description="One calm place for the studio's messages, reviews and handoffs.">
      <button type="button" class="btn" :disabled="!unreadCount" @click="markAllRead">
        <CheckCheck />Mark all read
      </button>
    </PageHeader>

    <div class="inbox card" :class="{ 'is-thread': mobileThread }">
      <aside class="list-pane" aria-label="Conversations">
        <div class="list-head">
          <h2 class="list-title">Inbox <span class="badge badge-primary nums">{{ unreadCount }}</span></h2>
          <div class="search-field">
            <Search aria-hidden="true" />
            <input v-model="search" type="search" class="input" placeholder="Search messages" aria-label="Search conversations" />
          </div>
        </div>

        <ul class="thread-list">
          <li v-for="conversation in filtered" :key="conversation.id">
            <button
              type="button"
              class="thread-item"
              :class="{ unread: conversation.unread }"
              :aria-current="conversation.id === activeId ? 'true' : undefined"
              @click="selectThread(conversation)"
            >
              <span class="avatar" :data-tone="conversation.id === 'c1' ? 'rose' : conversation.id === 'c2' ? 'sky' : conversation.id === 'c3' ? 'teal' : conversation.id === 'c4' ? 'amber' : 'violet'">
                {{ conversation.initials }}
                <span v-if="conversation.online" class="presence" aria-label="Online" />
              </span>
              <span class="thread-copy">
                <span class="thread-top">
                  <strong>{{ conversation.name }}</strong>
                  <time>{{ conversation.time }}</time>
                </span>
                <span class="thread-subject">{{ conversation.subject }}</span>
                <span class="thread-preview">{{ conversation.preview }}</span>
              </span>
              <span v-if="conversation.unread" class="unread-dot" aria-label="Unread" />
            </button>
          </li>
          <li v-if="!filtered.length" class="list-empty">No conversations match “{{ search }}”.</li>
        </ul>
      </aside>

      <section v-if="active" class="thread" aria-label="Conversation">
        <header class="thread-head">
          <button type="button" class="icon-btn back-btn" aria-label="Back to conversations" @click="mobileThread = false">
            <ArrowLeft />
          </button>
          <span class="avatar" data-tone="rose">
            {{ active.initials }}
            <span v-if="active.online" class="presence" aria-label="Online" />
          </span>
          <div class="thread-identity">
            <strong>{{ active.name }}</strong>
            <span>{{ active.role }} · {{ active.online ? 'Online now' : 'Away' }}</span>
          </div>
          <button type="button" class="icon-btn" aria-label="Mark as unread" @click="active.unread = true">
            <Mail />
          </button>
        </header>

        <div ref="messageList" class="messages">
          <p class="thread-subject-line">{{ active.subject }}</p>
          <div class="day-divider"><span>Today</span></div>
          <div
            v-for="message in active.messages"
            :key="message.id"
            class="message-row"
            :class="{ mine: message.from === 'me' }"
          >
            <span v-if="message.from === 'them'" class="avatar avatar-sm" data-tone="rose">{{ active.initials }}</span>
            <div class="bubble-wrap">
              <div class="bubble">{{ message.text }}</div>
              <time class="bubble-time">{{ message.time }}</time>
            </div>
            <span v-if="message.from === 'me'" class="avatar avatar-sm me-avatar" data-tone="sky">AR</span>
          </div>
        </div>

        <form class="composer" @submit.prevent="sendMessage">
          <label for="composer-input" class="sr-only">Write a message</label>
          <textarea
            id="composer-input"
            v-model="draft"
            class="composer-input"
            rows="1"
            placeholder="Write a reply…"
            @keydown.enter.exact.prevent="sendMessage"
          />
          <button type="submit" class="btn btn-primary send-btn" :disabled="!draft.trim()" aria-label="Send message">
            <Send />
          </button>
        </form>
        <p class="composer-hint">Enter to send · Shift + Enter for a new line</p>
      </section>

      <div v-else class="thread-empty">
        <Mail />
        <p>Select a conversation to start reading.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.inbox {
  display: grid;
  grid-template-columns: 330px minmax(0, 1fr);
  height: min(680px, calc(100vh - 216px));
  min-height: 480px;
  overflow: hidden;
}

.list-pane {
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-right: 1px solid var(--border);
}

.list-head {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid var(--border);
}

.list-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  letter-spacing: -0.02em;
}

.badge-primary {
  background: var(--primary-soft);
  color: var(--primary-strong);
}

[data-theme='space'] .badge-primary,
[data-theme='ocean'] .badge-primary {
  color: var(--primary);
}

.search-field {
  position: relative;
}

.search-field svg {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 15px;
  height: 15px;
  color: var(--text-faint);
  pointer-events: none;
}

.search-field .input {
  width: 100%;
  min-height: 36px;
  padding-left: 36px;
  font-size: 12.5px;
}

.thread-list {
  list-style: none;
  margin: 0;
  padding: 6px;
  overflow-y: auto;
  flex: 1;
}

.thread-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 11px;
  width: 100%;
  padding: 11px;
  border: 0;
  border-radius: var(--radius-md);
  background: transparent;
  text-align: left;
  color: inherit;
  transition: background 0.18s var(--ease);
}

.thread-item:hover {
  background: color-mix(in srgb, var(--text-faint) 8%, transparent);
}

.thread-item[aria-current='true'] {
  background: color-mix(in srgb, var(--primary) 12%, transparent);
}

.avatar {
  position: relative;
  flex: none;
}

.presence {
  position: absolute;
  right: -1px;
  bottom: -1px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--success);
  border: 2px solid var(--surface-solid);
}

[data-theme='space'] .presence,
[data-theme='ocean'] .presence {
  border-color: var(--surface-solid);
}

.thread-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}

.thread-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.thread-top strong {
  font-size: 12.5px;
  font-weight: 600;
}

.thread-top time {
  flex: none;
  font-family: var(--font-mono);
  font-size: 9.5px;
  color: var(--text-faint);
}

.thread-subject {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.thread-preview {
  font-size: 10.5px;
  color: var(--text-faint);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.thread-item.unread .thread-subject {
  color: var(--text);
}

.thread-item.unread .thread-top strong::after {
  content: '';
  display: inline-block;
  width: 5px;
  height: 5px;
  margin-left: 6px;
  border-radius: 50%;
  background: var(--primary);
  vertical-align: middle;
}

.unread-dot {
  flex: none;
  align-self: center;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--primary);
}

.list-empty {
  padding: 26px 14px;
  text-align: center;
  font-size: 11.5px;
  color: var(--text-faint);
}

.thread {
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
}

.thread-head {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 13px 18px;
  border-bottom: 1px solid var(--border);
}

.thread-identity {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
  min-width: 0;
}

.thread-identity strong {
  font-size: 13px;
  font-weight: 600;
}

.thread-identity span {
  font-size: 10.5px;
  color: var(--text-faint);
}

.icon-btn {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  margin-left: auto;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: transparent;
  color: var(--text-muted);
  transition: all 0.18s var(--ease);
}

.icon-btn:hover {
  color: var(--text);
  background: color-mix(in srgb, var(--text-faint) 9%, transparent);
}

.icon-btn svg {
  width: 15px;
  height: 15px;
}

.back-btn {
  display: none;
  margin-left: 0;
}

.messages {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  scroll-behavior: smooth;
}

.thread-subject-line {
  align-self: center;
  padding: 4px 12px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--surface-solid) 40%, transparent);
  font-size: 10.5px;
  font-weight: 600;
  color: var(--text-muted);
}

.day-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-faint);
}

.day-divider::before,
.day-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}

.message-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  max-width: 78%;
}

.message-row.mine {
  align-self: flex-end;
  flex-direction: row;
}

.bubble-wrap {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.mine .bubble-wrap {
  align-items: flex-end;
}

.bubble {
  padding: 9px 13px;
  border-radius: 14px 14px 14px 4px;
  background: color-mix(in srgb, var(--surface-solid) 55%, transparent);
  border: 1px solid var(--border);
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--text);
  animation: bubble-in 0.32s var(--ease) both;
}

.mine .bubble {
  border-radius: 14px 14px 4px 14px;
  background: linear-gradient(135deg, var(--primary), var(--primary-strong));
  border-color: transparent;
  color: var(--on-primary);
}

[data-theme='space'] .mine .bubble,
[data-theme='ocean'] .mine .bubble {
  background: var(--primary-soft);
  border-color: color-mix(in srgb, var(--primary) 35%, transparent);
  color: var(--text);
}

@keyframes bubble-in {
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.bubble-time {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-faint);
  padding: 0 3px;
}

.me-avatar {
  background: var(--primary-soft);
  color: var(--primary-strong);
}

[data-theme='space'] .me-avatar,
[data-theme='ocean'] .me-avatar {
  color: var(--primary);
}

.composer {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin: 0 18px;
  padding: 8px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--surface-solid) 45%, transparent);
  transition: border-color 0.18s var(--ease), box-shadow 0.18s var(--ease);
}

.composer:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-soft);
}

.composer-input {
  flex: 1;
  min-height: 34px;
  max-height: 120px;
  padding: 7px 8px;
  border: 0;
  background: transparent;
  color: var(--text);
  font-family: inherit;
  font-size: 12.5px;
  line-height: 1.5;
  resize: none;
  outline: none;
}

.send-btn {
  flex: none;
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 10px;
}

.send-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.composer-hint {
  padding: 6px 20px 12px;
  font-size: 9.5px;
  color: var(--text-faint);
  text-align: right;
}

.thread-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px;
  color: var(--text-faint);
}

.thread-empty svg {
  width: 28px;
  height: 28px;
}

.thread-empty p {
  font-size: 12px;
}

@media (max-width: 860px) {
  .inbox {
    grid-template-columns: minmax(0, 1fr);
    height: calc(100vh - 230px);
    min-height: 420px;
  }

  .list-pane {
    border-right: 0;
  }

  .thread {
    display: none;
  }

  .inbox.is-thread .list-pane {
    display: none;
  }

  .inbox.is-thread .thread {
    display: flex;
  }

  .back-btn {
    display: grid;
  }

  .message-row {
    max-width: 88%;
  }
}
</style>
