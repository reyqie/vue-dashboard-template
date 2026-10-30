<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Bell,
  Check,
  ImagePlus,
  KeyRound,
  LogOut,
  Palette,
  Shield,
  Trash2,
  UserRound,
} from '@lucide/vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import ToggleSwitch from '@/components/ui/ToggleSwitch.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import { useTheme } from '@/composables/useTheme'
import { useProfile } from '@/composables/useProfile'
import { useStoredState } from '@/composables/useStoredState'
import { usePreferences } from '@/composables/useSettings'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { toast } = useToast()
const { theme, themes, setTheme } = useTheme()
const { profile } = useProfile()
const preferences = usePreferences()
const profileForm = reactive({ ...profile.value })
const profileInitials = computed(() =>
  profile.value.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join(''),
)

type SectionId = 'profile' | 'appearance' | 'notifications' | 'security'

const sections = [
  { id: 'profile' as const, label: 'Profile', icon: UserRound },
  { id: 'appearance' as const, label: 'Appearance', icon: Palette },
  { id: 'notifications' as const, label: 'Notifications', icon: Bell },
  { id: 'security' as const, label: 'Security', icon: Shield },
]

const activeSection = ref<SectionId>('profile')

const errors = reactive<{ name?: string; email?: string }>({})

function saveProfile() {
  delete errors.name
  delete errors.email
  if (!profileForm.name.trim()) errors.name = 'Please keep a display name.'
  if (!/^\S+@\S+\.\S+$/.test(profileForm.email)) errors.email = 'Enter a valid email address.'
  if (errors.name || errors.email) return
  Object.assign(profile.value, profileForm)
  toast('Profile changes saved')
}

const fileInput = ref<HTMLInputElement | null>(null)
const avatarPreview = useStoredState<string | null>(
  'lumina-avatar',
  () => null,
  (value): value is string | null =>
    value === null || (typeof value === 'string' && value.startsWith('data:image/') && value.length <= 3_000_000),
)

function pickAvatar() {
  fileInput.value?.click()
}

function onAvatarChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    toast('Please choose an image file', 'danger')
    input.value = ''
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    toast('Image must be under 2 MB', 'danger')
    input.value = ''
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    if (typeof reader.result !== 'string') {
      toast('Could not read the selected image', 'danger')
      return
    }
    avatarPreview.value = reader.result
    toast('Profile photo updated')
  }
  reader.onerror = () => toast('Could not read the selected image', 'danger')
  reader.readAsDataURL(file)
  input.value = ''
}

function removeAvatar() {
  avatarPreview.value = null
  toast('Profile photo removed', 'info')
}

const twoFactor = ref(false)
const sessions = ref([
  { id: 's1', device: 'Chrome · macOS', location: 'Jakarta, ID', current: true, time: 'Active now' },
  { id: 's2', device: 'Safari · iPhone 15', location: 'Jakarta, ID', current: false, time: '2 hours ago' },
])

function toggleTwoFactor(value: boolean) {
  twoFactor.value = value
  toast(value ? 'Two-factor authentication enabled' : 'Two-factor authentication disabled', value ? 'success' : 'info')
}

function revokeSession(id: string) {
  sessions.value = sessions.value.filter((session) => session.id !== id)
  toast('Session revoked')
}

const passwordOpen = ref(false)
const passwordError = ref('')
const passwordForm = reactive({ current: '', next: '', confirm: '' })

function openPassword() {
  passwordForm.current = ''
  passwordForm.next = ''
  passwordForm.confirm = ''
  passwordError.value = ''
  passwordOpen.value = true
}

function updatePassword() {
  if (!passwordForm.current) {
    passwordError.value = 'Enter your current password.'
    return
  }
  if (passwordForm.next.length < 8) {
    passwordError.value = 'New password needs at least 8 characters.'
    return
  }
  if (passwordForm.next !== passwordForm.confirm) {
    passwordError.value = 'Passwords do not match.'
    return
  }
  passwordOpen.value = false
  toast('Password updated')
}

function signOut() {
  toast('Signed out of this device', 'info')
  void router.push('/login')
}
</script>

<template>
  <div class="view">
    <PageHeader eyebrow="Settings" title="Workspace settings" description="Tune your profile, theme and preferences to feel at home." />

    <div class="settings-grid">
      <nav class="settings-nav card" aria-label="Settings sections">
        <button
          v-for="section in sections"
          :key="section.id"
          type="button"
          class="nav-item"
          :class="{ active: activeSection === section.id }"
          :aria-pressed="activeSection === section.id"
          @click="activeSection = section.id"
        >
          <component :is="section.icon" />
          {{ section.label }}
        </button>
        <div class="nav-foot">
          <span class="avatar avatar-sm" data-tone="rose">{{ profileInitials }}</span>
          <div class="nav-user">
            <strong>{{ profile.name }}</strong>
            <span>Free workspace</span>
          </div>
        </div>
      </nav>

      <section v-if="activeSection === 'profile'" class="panel card card-pad" aria-labelledby="profile-heading">
        <header class="panel-head">
          <h2 id="profile-heading">Profile</h2>
          <p>How you appear across the Lumina workspace.</p>
        </header>

        <div class="avatar-row">
          <span class="avatar avatar-lg profile-avatar">
            <img v-if="avatarPreview" :src="avatarPreview" alt="Profile photo preview" />
            <template v-else>{{ profileInitials }}</template>
          </span>
          <div class="avatar-actions">
            <div class="avatar-buttons">
              <button type="button" class="btn btn-sm" @click="pickAvatar"><ImagePlus />Upload photo</button>
              <button v-if="avatarPreview" type="button" class="btn btn-sm btn-ghost" @click="removeAvatar">
                <Trash2 />Remove
              </button>
            </div>
            <p class="field-hint">JPG, PNG or WebP · max 2 MB</p>
            <input ref="fileInput" type="file" accept="image/*" class="sr-only" @change="onAvatarChange" />
          </div>
        </div>

        <form class="form-stack" novalidate @submit.prevent="saveProfile">
          <div class="form-row">
            <div class="field">
              <label for="profile-name">Display name</label>
              <input
                id="profile-name"
                v-model="profileForm.name"
                class="input"
                :aria-invalid="Boolean(errors.name)"
                aria-describedby="profile-name-error"
              />
              <p v-if="errors.name" id="profile-name-error" class="field-error" role="alert">{{ errors.name }}</p>
            </div>
            <div class="field">
              <label for="profile-email">Email</label>
              <input
                id="profile-email"
                v-model="profileForm.email"
                type="email"
                class="input"
                :aria-invalid="Boolean(errors.email)"
                aria-describedby="profile-email-error"
              />
              <p v-if="errors.email" id="profile-email-error" class="field-error" role="alert">{{ errors.email }}</p>
            </div>
          </div>

          <div class="form-row">
            <div class="field">
              <label for="profile-role">Role</label>
              <input id="profile-role" v-model="profileForm.role" class="input" />
            </div>
            <div class="field">
              <label for="profile-timezone">Timezone</label>
              <select id="profile-timezone" v-model="profileForm.timezone" class="select">
                <option>GMT+7 · Jakarta</option>
                <option>GMT+8 · Singapore</option>
                <option>GMT+1 · Berlin</option>
                <option>GMT-5 · New York</option>
                <option>GMT-8 · Los Angeles</option>
              </select>
            </div>
          </div>

          <div class="field">
            <label for="profile-bio">Bio</label>
            <textarea id="profile-bio" v-model="profileForm.bio" class="textarea" rows="3" />
            <p class="field-hint">A short line shown on shared project pages.</p>
          </div>

          <div class="panel-actions">
            <button type="submit" class="btn btn-primary"><Check />Save changes</button>
          </div>
        </form>
      </section>

      <section v-else-if="activeSection === 'appearance'" class="panel card card-pad" aria-labelledby="appearance-heading">
        <header class="panel-head">
          <h2 id="appearance-heading">Appearance</h2>
          <p>Switch the atmosphere. Every theme ships in light-aware surfaces.</p>
        </header>

        <div class="theme-grid" role="radiogroup" aria-label="Color theme">
          <button
            v-for="item in themes"
            :key="item.id"
            type="button"
            class="theme-card"
            :class="{ active: theme === item.id }"
            role="radio"
            :aria-checked="theme === item.id"
            @click="setTheme(item.id)"
          >
            <span class="theme-preview" :style="{ background: item.swatch }">
              <span class="preview-ui">
                <span class="preview-side" />
                <span class="preview-main">
                  <span class="preview-line" />
                  <span class="preview-line short" />
                </span>
              </span>
            </span>
            <span class="theme-copy">
              <strong>{{ item.label }}</strong>
              <small>{{ item.description }}</small>
            </span>
            <span v-if="theme === item.id" class="theme-check"><Check /></span>
          </button>
        </div>

        <div class="pref-list">
          <div class="pref-row">
            <div>
              <strong>Reduce motion</strong>
              <p>Calm down background animations and transitions.</p>
            </div>
            <ToggleSwitch v-model="preferences.reduceMotion" label="Reduce motion" />
          </div>
        </div>
      </section>

      <section v-else-if="activeSection === 'notifications'" class="panel card card-pad" aria-labelledby="notifications-heading">
        <header class="panel-head">
          <h2 id="notifications-heading">Notifications</h2>
          <p>Choose what reaches you, and when.</p>
        </header>

        <div class="pref-list">
          <div class="pref-row">
            <div>
              <strong>Product updates</strong>
              <p>New features, theme drops and release notes.</p>
            </div>
            <ToggleSwitch v-model="preferences.productUpdates" label="Product updates" />
          </div>
          <div class="pref-row">
            <div>
              <strong>Weekly digest</strong>
              <p>A Monday summary of activity across your projects.</p>
            </div>
            <ToggleSwitch v-model="preferences.weeklyDigest" label="Weekly digest" />
          </div>
          <div class="pref-row">
            <div>
              <strong>Desktop notifications</strong>
              <p>Ping the browser when someone mentions you.</p>
            </div>
            <ToggleSwitch v-model="preferences.desktopNotifications" label="Desktop notifications" />
          </div>
        </div>

        <p class="panel-note">Preference changes are saved to this browser automatically.</p>
      </section>

      <section v-else class="panel card card-pad" aria-labelledby="security-heading">
        <header class="panel-head">
          <h2 id="security-heading">Security</h2>
          <p>Protect your account and review where it is signed in.</p>
        </header>

        <div class="pref-list">
          <div class="pref-row">
            <div>
              <strong>Password</strong>
              <p>Last changed 3 months ago.</p>
            </div>
            <button type="button" class="btn btn-sm" @click="openPassword"><KeyRound />Change</button>
          </div>
          <div class="pref-row">
            <div>
              <strong>Two-factor authentication</strong>
              <p>Add a one-time code on top of your password.</p>
            </div>
            <ToggleSwitch :model-value="twoFactor" label="Two-factor authentication" @update:model-value="toggleTwoFactor" />
          </div>
        </div>

        <h3 class="sub-head">Active sessions</h3>
        <ul class="session-list">
          <li v-for="session in sessions" :key="session.id">
            <div class="session-copy">
              <strong>{{ session.device }}</strong>
              <span>{{ session.location }} · {{ session.time }}</span>
            </div>
            <span v-if="session.current" class="badge badge-success">This device</span>
            <button v-else type="button" class="btn btn-sm btn-danger" @click="revokeSession(session.id)">Revoke</button>
          </li>
          <li v-if="!sessions.length" class="session-empty">No other sessions are active.</li>
        </ul>

        <div class="danger-zone">
          <div>
            <strong>Sign out</strong>
            <p>End this session and return to the login screen.</p>
          </div>
          <button type="button" class="btn btn-danger" @click="signOut"><LogOut />Sign out</button>
        </div>
      </section>
    </div>

    <BaseModal
      :open="passwordOpen"
      title="Change password"
      description="Use at least 8 characters with a mix of letters and numbers."
      @close="passwordOpen = false"
    >
      <form class="form-stack" novalidate @submit.prevent="updatePassword">
        <div class="field">
          <label for="current-password">Current password</label>
          <input id="current-password" v-model="passwordForm.current" type="password" class="input" autocomplete="current-password" />
        </div>
        <div class="field">
          <label for="new-password">New password</label>
          <input id="new-password" v-model="passwordForm.next" type="password" class="input" autocomplete="new-password" />
        </div>
        <div class="field">
          <label for="confirm-password">Confirm new password</label>
          <input
            id="confirm-password"
            v-model="passwordForm.confirm"
            type="password"
            class="input"
            autocomplete="new-password"
            :aria-invalid="Boolean(passwordError)"
            aria-describedby="password-error"
          />
          <p v-if="passwordError" id="password-error" class="field-error" role="alert">{{ passwordError }}</p>
        </div>
        <footer class="modal-actions">
          <button type="button" class="btn" @click="passwordOpen = false">Cancel</button>
          <button type="submit" class="btn btn-primary"><KeyRound />Update password</button>
        </footer>
      </form>
    </BaseModal>
  </div>
</template>

<style scoped>
.view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.settings-grid {
  display: grid;
  grid-template-columns: 232px minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}

.settings-nav {
  position: sticky;
  top: 88px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 38px;
  padding: 0 11px;
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-muted);
  font-size: 12.5px;
  font-weight: 600;
  text-align: left;
  transition: color 0.18s var(--ease), background-color 0.18s var(--ease);
}

.nav-item svg {
  width: 16px;
  height: 16px;
}

.nav-item:hover {
  color: var(--text);
  background: color-mix(in srgb, var(--text-faint) 8%, transparent);
}

.nav-item.active {
  color: var(--primary-strong);
  background: var(--primary-soft);
}

[data-theme='space'] .nav-item.active,
[data-theme='ocean'] .nav-item.active {
  color: var(--primary);
}

.nav-foot {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-top: 6px;
  padding: 12px 8px 6px;
  border-top: 1px solid var(--border);
}

.nav-user {
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.3;
}

.nav-user strong {
  font-size: 11.5px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-user span {
  font-size: 10px;
  color: var(--text-faint);
}

.panel {
  animation: rise 0.4s var(--ease) both;
}

.panel-head {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.panel-head h2 {
  font-size: 17px;
  letter-spacing: -0.025em;
}

.panel-head p {
  margin-top: 5px;
  font-size: 12px;
  color: var(--text-muted);
}

.avatar-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border);
}

.profile-avatar {
  overflow: hidden;
  flex: none;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.avatar-buttons {
  display: flex;
  gap: 8px;
}

.field-hint {
  font-size: 10.5px;
  color: var(--text-faint);
}

.form-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.panel-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 6px;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.theme-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--surface-solid) 35%, transparent);
  text-align: left;
  color: inherit;
  transition: border-color 0.2s var(--ease), transform 0.2s var(--ease), box-shadow 0.2s var(--ease);
}

.theme-card:hover {
  transform: translateY(-2px);
  border-color: var(--border-strong);
  box-shadow: var(--shadow-sm);
}

.theme-card.active {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-soft);
}

.theme-preview {
  position: relative;
  display: block;
  height: 92px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18);
}

.preview-ui {
  position: absolute;
  inset: 12px;
  display: flex;
  gap: 5px;
  padding: 6px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.28);
  backdrop-filter: blur(3px);
}

.preview-side {
  width: 26%;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.55);
}

.preview-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-top: 4px;
}

.preview-line {
  height: 8px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.65);
}

.preview-line.short {
  width: 58%;
  background: rgba(255, 255, 255, 0.45);
}

.theme-copy {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 0 2px 4px;
}

.theme-copy strong {
  font-size: 12.5px;
  font-weight: 600;
}

.theme-copy small {
  font-size: 10.5px;
  line-height: 1.45;
  color: var(--text-faint);
}

.theme-check {
  position: absolute;
  top: 16px;
  right: 16px;
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--surface-solid);
  color: var(--primary);
  box-shadow: var(--shadow-sm);
}

.theme-check svg {
  width: 12px;
  height: 12px;
}

.pref-list {
  display: flex;
  flex-direction: column;
  margin-top: 6px;
}

.pref-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 15px 0;
  border-bottom: 1px solid var(--border);
}

.pref-row:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.pref-row strong {
  font-size: 12.5px;
  font-weight: 600;
}

.pref-row p {
  margin-top: 3px;
  font-size: 11px;
  color: var(--text-faint);
}

.panel-note {
  margin-top: 16px;
  font-size: 10.5px;
  color: var(--text-faint);
}

.sub-head {
  margin: 24px 0 10px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--text-muted);
}

.session-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.session-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 11px 13px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--surface-solid) 30%, transparent);
}

.session-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.session-copy strong {
  font-size: 12px;
  font-weight: 600;
}

.session-copy span {
  font-size: 10.5px;
  color: var(--text-faint);
}

.session-empty {
  justify-content: center;
  font-size: 11.5px;
  color: var(--text-faint);
}

.danger-zone {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-top: 24px;
  padding: 16px;
  border-radius: var(--radius-md);
  border: 1px solid color-mix(in srgb, var(--danger) 30%, transparent);
  background: color-mix(in srgb, var(--danger) 7%, transparent);
}

.danger-zone strong {
  font-size: 12.5px;
}

.danger-zone p {
  margin-top: 3px;
  font-size: 11px;
  color: var(--text-muted);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 9px;
  margin-top: 6px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
}

@media (max-width: 1020px) {
  .settings-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .settings-nav {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 6px;
  }

  .nav-foot {
    display: none;
  }

  .theme-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .theme-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .danger-zone {
    flex-direction: column;
    align-items: flex-start;
  }

  .avatar-row {
    flex-wrap: wrap;
  }
}
</style>
