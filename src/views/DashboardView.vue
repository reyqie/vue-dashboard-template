<script setup lang="ts">
import { computed, ref, type Component } from 'vue'
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  MessageSquare,
  MousePointerClick,
  Target,
  TrendingUp,
  Upload,
  UserPlus,
  Users,
  Wallet,
} from '@lucide/vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import StatCard from '@/components/ui/StatCard.vue'
import AreaChart from '@/components/charts/AreaChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import DonutChart from '@/components/charts/DonutChart.vue'
import ProgressRing from '@/components/charts/ProgressRing.vue'
import { activities, revenueRanges, topChannels, trafficSources } from '@/data/mock'
import type { ActivityKind, Series } from '@/types'
import { useProjects } from '@/composables/useProjects'

interface KpiConfig {
  label: string
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  icon: Component
  data: number[]
  delta: number
  tone: 'primary' | 'accent' | 'success' | 'warning'
}

const kpis: KpiConfig[] = [
  {
    label: 'Total revenue',
    value: 48290,
    prefix: '$',
    icon: Wallet,
    data: [32, 38, 35, 44, 41, 52, 49, 58],
    delta: 12.4,
    tone: 'primary',
  },
  {
    label: 'Active users',
    value: 12842,
    icon: Users,
    data: [24, 30, 28, 36, 33, 41, 38, 46],
    delta: 8.2,
    tone: 'accent',
  },
  {
    label: 'Conversion rate',
    value: 4.7,
    suffix: '%',
    decimals: 1,
    icon: MousePointerClick,
    data: [3.1, 3.4, 3.2, 3.9, 3.8, 4.2, 4.1, 4.7],
    delta: 0.6,
    tone: 'success',
  },
  {
    label: 'Avg. session',
    value: 6.4,
    suffix: 'm',
    decimals: 1,
    icon: Clock3,
    data: [7.2, 7.0, 6.8, 7.1, 6.7, 6.6, 6.5, 6.4],
    delta: -1.8,
    tone: 'warning',
  },
]

const activityIcons: Record<ActivityKind, Component> = {
  member: UserPlus,
  upload: Upload,
  complete: CheckCircle2,
  payment: CreditCard,
  message: MessageSquare,
}

const ranges = ['7D', '30D', '90D'] as const
type RangeKey = (typeof ranges)[number]
const range = ref<RangeKey>('30D')

const chartData = computed(() => revenueRanges[range.value])
const revenueSeries = computed<Series[]>(() => [
  { name: 'This period', color: 'var(--chart-1)', data: chartData.value.current },
  { name: 'Previous', color: 'var(--chart-2)', data: chartData.value.previous },
])
const rangeTotal = computed(() => chartData.value.current.reduce((sum, value) => sum + value, 0))

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
})

const dateLabel = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
}).format(new Date())

const { projects } = useProjects()
const previewProjects = computed(() => projects.value.slice(0, 3))
</script>

<template>
  <div class="view">
    <PageHeader
      eyebrow="Overview"
      :title="`${greeting}, Aria`"
      description="A calm look at how your workspace is moving today — revenue, reach and momentum in one place."
    >
      <span class="chip"><CalendarDays />{{ dateLabel }}</span>
      <RouterLink to="/analytics" class="btn"><TrendingUp />View analytics</RouterLink>
    </PageHeader>

    <section class="kpi-grid stagger" aria-label="Key metrics">
      <StatCard
        v-for="(kpi, index) in kpis"
        :key="kpi.label"
        :style="{ '--i': index }"
        :label="kpi.label"
        :value="kpi.value"
        :prefix="kpi.prefix"
        :suffix="kpi.suffix"
        :decimals="kpi.decimals"
        :icon="kpi.icon"
        :data="kpi.data"
        :delta="kpi.delta"
        :tone="kpi.tone"
      />
    </section>

    <section class="grid-main">
      <article class="card card-pad revenue-card">
        <div class="card-head">
          <div>
            <h2 class="card-title">Revenue overview</h2>
            <p class="card-sub">Net revenue across all workspaces</p>
          </div>
          <div class="seg" role="group" aria-label="Revenue range">
            <button
              v-for="option in ranges"
              :key="option"
              type="button"
              :aria-pressed="range === option"
              @click="range = option"
            >
              {{ option }}
            </button>
          </div>
        </div>

        <div class="revenue-summary">
          <p class="revenue-total nums">${{ rangeTotal.toFixed(1) }}k</p>
          <span class="badge badge-success"><ArrowUpRight />12.4%</span>
          <span class="revenue-note">vs previous period</span>
        </div>

        <AreaChart
          :labels="chartData.labels"
          :series="revenueSeries"
          prefix="$"
          suffix="k"
          :height="252"
        />
      </article>

      <article class="card card-pad traffic-card">
        <div class="card-head">
          <div>
            <h2 class="card-title">Traffic sources</h2>
            <p class="card-sub">Where sessions come from</p>
          </div>
          <span class="live-chip"><span class="live-dot" />Live</span>
        </div>
        <DonutChart :segments="trafficSources" center-value="24.8k" center-label="Sessions" />
      </article>
    </section>

    <section class="grid-main">
      <article class="card card-pad">
        <div class="card-head">
          <div>
            <h2 class="card-title">Top channels</h2>
            <p class="card-sub">Sessions by acquisition channel</p>
          </div>
          <span class="badge">Last 30 days</span>
        </div>
        <BarChart :items="topChannels" />
      </article>

      <article class="card card-pad">
        <div class="card-head">
          <div>
            <h2 class="card-title">Activity</h2>
            <p class="card-sub">Latest across your workspace</p>
          </div>
          <span class="live-chip"><span class="live-dot" />Live</span>
        </div>
        <ul class="activity-list">
          <li v-for="item in activities" :key="item.id">
            <span class="activity-icon" :data-kind="item.kind">
              <component :is="activityIcons[item.kind]" />
            </span>
            <div class="activity-copy">
              <p><strong>{{ item.actor }}</strong> {{ item.action }} <em>{{ item.target }}</em></p>
              <span class="activity-time">{{ item.time }}</span>
            </div>
          </li>
        </ul>
      </article>
    </section>

    <section class="grid-main">
      <article class="card card-pad">
        <div class="card-head">
          <div>
            <h2 class="card-title">Active projects</h2>
            <p class="card-sub">Momentum across the studio</p>
          </div>
          <RouterLink to="/projects" class="chip">View all</RouterLink>
        </div>

        <ul class="project-list">
          <li v-for="project in previewProjects" :key="project.id" class="project-row">
            <span class="project-dot" :data-tone="project.tone" />
            <div class="project-info">
              <p class="project-name">{{ project.name }}</p>
              <span class="project-meta">{{ project.members.length }} members · Due {{ project.due }}</span>
            </div>
            <span class="badge" :data-status="project.status">{{ project.status }}</span>
            <div class="mini-progress">
              <div class="progress-track">
                <span :style="{ width: `${project.progress}%` }" />
              </div>
              <span class="progress-value nums">{{ project.progress }}%</span>
            </div>
          </li>
        </ul>
      </article>

      <article class="card card-pad">
        <div class="card-head">
          <div>
            <h2 class="card-title">Quarterly goals</h2>
            <p class="card-sub">Two priorities this quarter</p>
          </div>
          <Target class="head-icon" />
        </div>

        <div class="goal-row">
          <ProgressRing :value="78" :size="58" label="Revenue goal" />
          <div class="goal-copy">
            <p class="goal-title">Revenue target</p>
            <span class="goal-sub">$483k of $620k closed</span>
          </div>
        </div>
        <div class="goal-row">
          <ProgressRing :value="64" :size="58" label="New customer goal" />
          <div class="goal-copy">
            <p class="goal-title">New customers</p>
            <span class="goal-sub">1,280 of 2,000 onboarded</span>
          </div>
        </div>

        <p class="goal-note">
          <Target />
          You are pacing 9 days ahead of the quarterly plan.
        </p>
      </article>
    </section>
  </div>
</template>

<style scoped>
.view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.grid-main {
  display: grid;
  grid-template-columns: minmax(0, 1.85fr) minmax(0, 1fr);
  gap: 18px;
  align-items: stretch;
}

.revenue-card {
  min-width: 0;
}

.revenue-summary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin: 2px 0 14px;
}

.revenue-total {
  font-size: clamp(26px, 2.6vw, 32px);
  font-weight: 600;
  letter-spacing: -0.05em;
  line-height: 1;
}

.revenue-note {
  font-size: 11px;
  color: var(--text-faint);
}

.live-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--success) 24%, transparent);
  background: color-mix(in srgb, var(--success) 9%, transparent);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--success);
}

.traffic-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.activity-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.activity-list li {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  padding: 9px 0;
  border-bottom: 1px solid var(--border);
}

.activity-list li:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.activity-icon {
  display: grid;
  place-items: center;
  width: 31px;
  height: 31px;
  flex: none;
  border-radius: 10px;
  background: var(--primary-soft);
  color: var(--primary);
}

.activity-icon svg {
  width: 15px;
  height: 15px;
}

.activity-icon[data-kind='payment'] {
  background: color-mix(in srgb, var(--success) 13%, transparent);
  color: var(--success);
}

.activity-icon[data-kind='complete'] {
  background: color-mix(in srgb, var(--accent) 14%, transparent);
  color: var(--accent);
}

.activity-icon[data-kind='message'] {
  background: color-mix(in srgb, var(--warning) 14%, transparent);
  color: var(--warning);
}

.activity-copy p {
  font-size: 12px;
  line-height: 1.45;
  color: var(--text-muted);
}

.activity-copy strong {
  font-weight: 700;
  color: var(--text);
}

.activity-copy em {
  font-style: normal;
  font-weight: 600;
  color: var(--text);
}

.activity-time {
  font-size: 10px;
  color: var(--text-faint);
}

.project-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.project-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}

.project-row:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.project-dot {
  width: 10px;
  height: 10px;
  flex: none;
  border-radius: 3px;
  background: var(--primary);
}

.project-dot[data-tone='violet'] {
  background: #a78bfa;
}
.project-dot[data-tone='sky'] {
  background: #38bdf8;
}
.project-dot[data-tone='teal'] {
  background: #2dd4bf;
}
.project-dot[data-tone='rose'] {
  background: #f472b6;
}
.project-dot[data-tone='amber'] {
  background: #fbbf24;
}
.project-dot[data-tone='lime'] {
  background: #a3e635;
}

.project-info {
  flex: 1;
  min-width: 0;
}

.project-name {
  font-size: 12.5px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.project-meta {
  font-size: 10.5px;
  color: var(--text-faint);
}

.badge[data-status='In progress'] {
  background: var(--primary-soft);
  color: var(--primary-strong);
}

[data-theme='space'] .badge[data-status='In progress'],
[data-theme='ocean'] .badge[data-status='In progress'] {
  color: var(--primary);
}

.badge[data-status='Review'] {
  background: color-mix(in srgb, var(--warning) 14%, transparent);
  color: var(--warning);
}

.badge[data-status='Done'] {
  background: color-mix(in srgb, var(--success) 14%, transparent);
  color: var(--success);
}

.mini-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 132px;
  flex: none;
}

.progress-track {
  flex: 1;
  height: 6px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--text-faint) 14%, transparent);
  overflow: hidden;
}

.progress-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--primary), var(--accent));
  transition: width 1s var(--ease);
}

.progress-value {
  font-size: 10px;
  color: var(--text-muted);
  min-width: 28px;
  text-align: right;
}

.head-icon {
  width: 18px;
  height: 18px;
  color: var(--text-faint);
}

.goal-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 11px 0;
  border-bottom: 1px solid var(--border);
}

.goal-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.goal-title {
  font-size: 12.5px;
  font-weight: 600;
}

.goal-sub {
  font-size: 10.5px;
  color: var(--text-faint);
}

.goal-note {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 14px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: var(--primary-soft);
  font-size: 11px;
  line-height: 1.45;
  color: var(--text-muted);
}

.goal-note svg {
  width: 14px;
  height: 14px;
  flex: none;
  margin-top: 1px;
  color: var(--primary);
}

@media (max-width: 1180px) {
  .kpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .grid-main {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 640px) {
  .kpi-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .mini-progress {
    display: none;
  }

  .badge[data-status] {
    display: none;
  }
}
</style>
