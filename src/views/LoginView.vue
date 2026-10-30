<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowRight,
  Eye,
  EyeOff,
  Globe,
  Loader2,
  Lock,
  Mail,
  Shield,
  Sparkles,
  TrendingUp,
} from '@lucide/vue'
import ThemeBackground from '@/components/ui/ThemeBackground.vue'
import ThemeSwitcher from '@/components/ui/ThemeSwitcher.vue'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { toast } = useToast()

const form = reactive({
  email: 'aria@lumina.studio',
  password: 'lumina123',
  remember: true,
})

const errors = reactive<{ email?: string; password?: string }>({})
const showPassword = ref(false)
const loading = ref(false)

function submit() {
  delete errors.email
  delete errors.password
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email address.'
  if (form.password.length < 6) errors.password = 'Password needs at least 6 characters.'
  if (errors.email || errors.password) return

  loading.value = true
  window.setTimeout(() => {
    toast('Welcome back, Aria')
    void router.push('/')
  }, 700)
}

function forgotPassword() {
  toast('If an account exists, a reset link is on its way', 'info')
}

function sso(provider: string) {
  toast(`${provider} sign-in is unavailable in this demo`, 'info')
}

const bars = [38, 52, 46, 64, 58, 72, 62, 80, 74, 88]
</script>

<template>
  <div class="auth">
    <ThemeBackground />

    <div class="auth-top">
      <RouterLink to="/" class="brand" aria-label="Lumina home">
        <span class="brand-mark"><Sparkles /></span>
        <span class="brand-name">Lumina</span>
      </RouterLink>
      <ThemeSwitcher labels />
    </div>

    <div class="auth-grid">
      <section class="auth-hero">
        <p class="hero-eyebrow"><span class="pulse" />Calm analytics for modern teams</p>
        <h1>A quieter way to run your studio.</h1>
        <p class="hero-sub">
          Lumina brings revenue, projects and conversation into one considered space — designed to feel
          light, focused and unmistakably yours.
        </p>

        <div class="hero-visual" aria-hidden="true">
          <div class="preview-card">
            <div class="preview-top">
              <span class="preview-dots"><i /><i /><i /></span>
              <span class="preview-pill">Live</span>
            </div>
            <div class="preview-metric">
              <span>Monthly revenue</span>
              <strong class="nums">$128,450</strong>
              <em class="nums">+18.2%</em>
            </div>
            <div class="preview-bars">
              <span v-for="(height, index) in bars" :key="index" :style="{ height: `${height}%`, animationDelay: `${index * 60}ms` }" />
            </div>
          </div>

          <div class="float-card">
            <span class="float-icon"><TrendingUp /></span>
            <div>
              <strong class="nums">+28.4%</strong>
              <small>Growth this quarter</small>
            </div>
          </div>
        </div>

        <ul class="hero-points">
          <li><Sparkles />Three hand-tuned themes</li>
          <li><Shield />Private by design</li>
          <li><Globe />Works everywhere</li>
        </ul>
      </section>

      <section class="auth-card card" aria-labelledby="login-heading">
        <header class="auth-head">
          <p class="eyebrow">Welcome back</p>
          <h2 id="login-heading">Sign in to Lumina</h2>
          <p>Pick up exactly where you left off.</p>
        </header>

        <form class="auth-form" novalidate @submit.prevent="submit">
          <div class="field">
            <label for="login-email">Email</label>
            <div class="input-wrap" :class="{ invalid: errors.email }">
              <Mail aria-hidden="true" />
              <input
                id="login-email"
                v-model="form.email"
                class="input"
                type="email"
                autocomplete="email"
                placeholder="you@studio.com"
                :aria-invalid="Boolean(errors.email)"
                aria-describedby="login-email-error"
              />
            </div>
            <p v-if="errors.email" id="login-email-error" class="field-error" role="alert">{{ errors.email }}</p>
          </div>

          <div class="field">
            <div class="label-row">
              <label for="login-password">Password</label>
              <button type="button" class="text-link" @click="forgotPassword">Forgot password?</button>
            </div>
            <div class="input-wrap" :class="{ invalid: errors.password }">
              <Lock aria-hidden="true" />
              <input
                id="login-password"
                v-model="form.password"
                class="input"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="Enter your password"
                :aria-invalid="Boolean(errors.password)"
                aria-describedby="login-password-error"
              />
              <button
                type="button"
                class="reveal"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                :aria-pressed="showPassword"
                @click="showPassword = !showPassword"
              >
                <EyeOff v-if="showPassword" />
                <Eye v-else />
              </button>
            </div>
            <p v-if="errors.password" id="login-password-error" class="field-error" role="alert">{{ errors.password }}</p>
          </div>

          <label class="check">
            <input v-model="form.remember" type="checkbox" />
            <span class="check-box" aria-hidden="true" />
            <span>Remember me for 30 days</span>
          </label>

          <button type="submit" class="btn btn-primary submit" :disabled="loading">
            <Loader2 v-if="loading" class="spin" />
            <template v-else>
              Sign in
              <ArrowRight />
            </template>
          </button>
        </form>

        <div class="auth-divider"><span>or continue with</span></div>

        <div class="sso-row">
          <button type="button" class="btn" @click="sso('Google')"><Globe />Google</button>
          <button type="button" class="btn" @click="sso('SSO')"><Shield />SSO</button>
        </div>

        <p class="demo-hint">
          This is a demo workspace — the fields are prefilled. Just press <strong>Sign in</strong>.
        </p>

        <p class="auth-foot">New to Lumina? <button type="button" class="text-link" @click="sso('Sign up')">Create an account</button></p>
      </section>
    </div>

    <footer class="page-foot">
      <span>© 2026 Lumina Studio</span>
      <span>Made for calm, considered work.</span>
    </footer>
  </div>
</template>

<style scoped>
.auth {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 26px clamp(20px, 5vw, 56px);
  isolation: isolate;
}

.auth-top {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: var(--text);
  text-decoration: none;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 11px;
  background: linear-gradient(135deg, var(--primary), var(--primary-strong));
  color: var(--on-primary);
  box-shadow: 0 10px 22px -10px color-mix(in srgb, var(--primary) 70%, transparent);
}

.brand-mark svg {
  width: 17px;
  height: 17px;
}

.brand-name {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.03em;
}

.auth-grid {
  position: relative;
  z-index: 1;
  flex: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(360px, 440px);
  align-items: center;
  gap: clamp(32px, 6vw, 88px);
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 40px 0;
}

.auth-hero {
  animation: rise 0.6s var(--ease) both;
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px 5px 8px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface);
  backdrop-filter: blur(12px);
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
}

.pulse {
  position: relative;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--success);
}

.pulse::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 1px solid var(--success);
  animation: ping 2.4s var(--ease) infinite;
}

@keyframes ping {
  0% {
    opacity: 0.7;
    transform: scale(0.7);
  }
  70%,
  100% {
    opacity: 0;
    transform: scale(1.7);
  }
}

.auth-hero h1 {
  margin-top: 20px;
  max-width: 13ch;
  font-size: clamp(34px, 4.6vw, 52px);
  font-weight: 700;
  line-height: 1.04;
  letter-spacing: -0.045em;
}

.hero-sub {
  margin-top: 16px;
  max-width: 46ch;
  font-size: 13.5px;
  line-height: 1.65;
  color: var(--text-muted);
}

.hero-visual {
  position: relative;
  width: min(100%, 430px);
  margin-top: 30px;
  animation: rise 0.7s var(--ease) 0.1s both;
}

.preview-card {
  padding: 16px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  background: var(--surface);
  backdrop-filter: blur(20px);
  box-shadow: var(--shadow-lg);
}

.preview-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.preview-dots {
  display: flex;
  gap: 4px;
}

.preview-dots i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--text-faint) 45%, transparent);
}

.preview-pill {
  padding: 2px 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--success) 14%, transparent);
  color: var(--success);
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.preview-metric {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
  margin: 14px 0 12px;
}

.preview-metric span {
  width: 100%;
  font-size: 10.5px;
  color: var(--text-faint);
}

.preview-metric strong {
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.045em;
}

.preview-metric em {
  font-style: normal;
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 600;
  color: var(--success);
}

.preview-bars {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 92px;
  padding: 8px 6px 0;
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--text-faint) 6%, transparent);
}

.preview-bars span {
  flex: 1;
  border-radius: 4px 4px 2px 2px;
  background: linear-gradient(180deg, var(--primary), color-mix(in srgb, var(--primary) 35%, transparent));
  transform-origin: bottom;
  animation: bar-rise 0.7s var(--ease) both;
}

@keyframes bar-rise {
  from {
    transform: scaleY(0.12);
    opacity: 0.4;
  }
  to {
    transform: scaleY(1);
    opacity: 1;
  }
}

.float-card {
  position: absolute;
  right: -18px;
  bottom: -24px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: var(--surface-strong);
  backdrop-filter: blur(20px);
  box-shadow: var(--shadow-lg);
  animation: float 5.5s var(--ease) infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-7px);
  }
}

.float-icon {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: var(--primary-soft);
  color: var(--primary-strong);
}

[data-theme='space'] .float-icon,
[data-theme='ocean'] .float-icon {
  color: var(--primary);
}

.float-icon svg {
  width: 15px;
  height: 15px;
}

.float-card strong {
  display: block;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.float-card small {
  font-size: 9.5px;
  color: var(--text-faint);
}

.hero-points {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  margin: 34px 0 0;
  padding: 0;
  list-style: none;
}

.hero-points li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10.5px;
  font-weight: 500;
  color: var(--text-faint);
}

.hero-points svg {
  width: 13px;
  height: 13px;
}

.auth-card {
  padding: 28px;
  animation: rise 0.6s var(--ease) 0.08s both;
}

.auth-head {
  margin-bottom: 22px;
}

.auth-head h2 {
  margin-top: 6px;
  font-size: 23px;
  letter-spacing: -0.035em;
}

.auth-head > p:last-child {
  margin-top: 5px;
  font-size: 12px;
  color: var(--text-muted);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.label-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.text-link {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--primary-strong);
  font-size: 10.5px;
  font-weight: 600;
}

[data-theme='space'] .text-link,
[data-theme='ocean'] .text-link {
  color: var(--primary);
}

.text-link:hover {
  text-decoration: underline;
}

.input-wrap {
  position: relative;
}

.input-wrap > svg {
  position: absolute;
  left: 13px;
  top: 50%;
  transform: translateY(-50%);
  width: 15px;
  height: 15px;
  color: var(--text-faint);
  pointer-events: none;
}

.input-wrap .input {
  padding-left: 38px;
  padding-right: 40px;
}

.input-wrap.invalid .input {
  border-color: color-mix(in srgb, var(--danger) 55%, transparent);
}

.reveal {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--text-faint);
}

.reveal:hover {
  color: var(--text);
}

.reveal svg {
  width: 15px;
  height: 15px;
}

.check {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11.5px;
  color: var(--text-muted);
  cursor: pointer;
  user-select: none;
}

.check input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.check-box {
  position: relative;
  width: 16px;
  height: 16px;
  border-radius: 5px;
  border: 1px solid var(--border-strong);
  background: var(--input-bg);
  transition: background 0.18s var(--ease), border-color 0.18s var(--ease);
}

.check input:checked + .check-box {
  background: linear-gradient(135deg, var(--primary), var(--primary-strong));
  border-color: transparent;
}

.check input:checked + .check-box::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid var(--on-primary);
  border-width: 0 1.5px 1.5px 0;
  transform: rotate(45deg);
}

.check input:focus-visible + .check-box {
  box-shadow: 0 0 0 3px var(--primary-soft);
}

.submit {
  width: 100%;
  min-height: 44px;
  margin-top: 4px;
}

.spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.auth-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0 14px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-faint);
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}

.sso-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
}

.demo-hint {
  margin-top: 16px;
  padding: 9px 12px;
  border-radius: var(--radius-sm);
  background: var(--primary-soft);
  font-size: 10.5px;
  line-height: 1.5;
  color: var(--text-muted);
  text-align: center;
}

.demo-hint strong {
  color: var(--text);
  font-weight: 600;
}

.auth-foot {
  margin-top: 16px;
  font-size: 11px;
  color: var(--text-faint);
  text-align: center;
}

.page-foot {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-top: 18px;
  font-size: 10px;
  color: var(--text-faint);
}

@media (max-width: 980px) {
  .auth-grid {
    grid-template-columns: minmax(0, 1fr);
    max-width: 460px;
    padding: 32px 0;
  }

  .auth-hero {
    display: none;
  }

  .page-foot {
    justify-content: center;
  }

  .page-foot span:last-child {
    display: none;
  }
}

@media (max-width: 480px) {
  .auth {
    padding: 18px;
  }

  .auth-card {
    padding: 22px;
  }

  .auth-top :deep(.switcher-label) {
    display: none;
  }
}
</style>
