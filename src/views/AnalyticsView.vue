<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Clock3,
  MousePointerClick,
  Share2,
  Users,
} from '@lucide/vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import StatCard from '@/components/ui/StatCard.vue'
import AreaChart from '@/components/charts/AreaChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import DonutChart from '@/components/charts/DonutChart.vue'
import Heatmap from '@/components/charts/Heatmap.vue'
import {
  deviceSegments,
  engagementHeatmap,
  heatmapDays,
  heatmapHours,
  topChannels,
  topPages,
  trafficData,
} from '@/data/mock'
import { useToast } from '@/composables/useToast'
import type { Series } from '@/types'

const { toast } = useToast()

const metric = ref<'sessions' | 'users'>('sessions')

const metricSeries = computed<Series[]>(() => {
  const current = metric.value === 'sessions' ? trafficData.sessions : trafficData.users
  const previous = metric.value === 'sessions' ? trafficData.sessionsPrev : trafficData.usersPrev
  return [
    { name: 'This year', color: 'var(--chart-1)', data: current },
    { name: 'Last year', color: 'var(--chart-2)', data: previous },
  ]
})

const metrics = computed(() => {
  const isSessions = metric.value === 'sessions'
  return [
    {
      label: isSessions ? 'Sessions' : 'Unique users',
      value: isSessions ? 806 : 520,
      suffix: 'k',
      icon: isSessions ? MousePointerClick : Users,
      data: isSessions ? trafficData.sessions : trafficData.users,
      delta: isSessions ? 14.2 : 9.6,
      tone: 'primary' as const,
    },
    {
      label: 'Avg. session',
      value: 4.7,
      suffix: 'm',
      decimals: 1,
      icon: Clock3,
      data: [3.8, 4.0, 3.9, 4.2, 4.1, 4.4, 4.3, 4.7],
      delta: 6.1,
      tone: 'accent' as const,
    },
    {
      label: 'Bounce rate',
      value: 28.4,
      suffix: '%',
      decimals: 1,
      icon: ArrowDown,
      data: [34, 33, 32.4, 31.8, 30.6, 29.9, 29.1, 28.4],
      delta: -3.1,
      invertDelta: true,
      tone: 'success' as const,
    },
    {
      label: 'New users',
      value: 42.8,
      suffix: 'k',
      decimals: 1,
      icon: Users,
      data: [22, 25, 24, 29, 31, 30, 36, 39, 42.8],
      delta: 9.6,
      tone: 'warning' as const,
    },
  ]
})

type SortKey = 'views' | 'bounce' | 'change'
const sortKey = ref<SortKey>('views')
const sortDir = ref<'asc' | 'desc'>('desc')

const sortedPages = computed(() =>
  [...topPages].sort((a, b) => {
    const first = a[sortKey.value]
    const second = b[sortKey.value]
    return sortDir.value === 'asc' ? first - second : second - first
  }),
)

function toggleSort(key: SortKey) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
    return
  }
  sortKey.value = key
  sortDir.value = 'desc'
}

function ariaSort(key: SortKey): 'ascending' | 'descending' | 'none' {
  if (sortKey.value !== key) return 'none'
  return sortDir.value === 'asc' ? 'ascending' : 'descending'
}

const numberFormat = new Intl.NumberFormat('en-US')

async function shareReport() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    toast('Report link copied to clipboard', 'info')
  } catch {
    toast('Copying is not available in this browser', 'danger')
  }
}
</script>

<template>
  <div class="view">
    <PageHeader
      eyebrow="Analytics"
      title="Signals, not noise"
      description="Traffic quality, engagement and conversion health across every surface of the product."
    >
      <div class="seg" role="group" aria-label="Traffic metric">
        <button type="button" :aria-pressed="metric === 'sessions'" @click="metric = 'sessions'">Sessions</button>
        <button type="button" :aria-pressed="metric === 'users'" @click="metric = 'users'">Users</button>
      </div>
      <button type="button" class="btn" @click="shareReport"><Share2 />Share report</button>
    </PageHeader>

    <section class="kpi-grid stagger" aria-label="Traffic metrics">
      <StatCard
        v-for="(item, index) in metrics"
        :key="item.label"
        :style="{ '--i': index }"
        :label="item.label"
        :value="item.value"
        :suffix="item.suffix"
        :decimals="item.decimals"
        :icon="item.icon"
        :data="item.data"
        :delta="item.delta"
        :invert-delta="item.invertDelta"
        :tone="item.tone"
      />
    </section>

    <section class="grid-wide">
      <article class="card card-pad">
        <div class="card-head">
          <div>
            <h2 class="card-title">Audience growth</h2>
            <p class="card-sub">Year over year, measured in thousands</p>
          </div>
          <span class="badge badge-success">+14.2% YoY</span>
        </div>
        <AreaChart
          :labels="trafficData.labels"
          :series="metricSeries"
          suffix="k"
          :height="256"
        />
      </article>

      <article class="card card-pad">
        <div class="card-head">
          <div>
            <h2 class="card-title">Devices</h2>
            <p class="card-sub">Sessions by device class</p>
          </div>
        </div>
        <DonutChart :segments="deviceSegments" center-value="58%" center-label="Desktop" />
        <p class="device-note">Mobile traffic grew <strong>6.4%</strong> this quarter.</p>
      </article>
    </section>

    <section class="grid-mid">
      <article class="card card-pad">
        <div class="card-head">
          <div>
            <h2 class="card-title">Acquisition</h2>
            <p class="card-sub">Sessions by channel, last 30 days</p>
          </div>
        </div>
        <BarChart :items="topChannels" />
      </article>

      <article class="card card-pad">
        <div class="card-head">
          <div>
            <h2 class="card-title">Engagement rhythm</h2>
            <p class="card-sub">When your audience is most active</p>
          </div>
          <span class="badge">Local time</span>
        </div>
        <div class="heat-scroll">
          <Heatmap
            class="heat-chart"
            :values="engagementHeatmap"
            :day-labels="heatmapDays"
            :hour-labels="heatmapHours"
            label="Engagement by day and time"
          />
        </div>
      </article>
    </section>

    <section class="card card-pad">
      <div class="card-head">
        <div>
          <h2 class="card-title">Top pages</h2>
          <p class="card-sub">Most visited destinations this month</p>
        </div>
        <span class="badge">{{ topPages.length }} pages</span>
      </div>

      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th scope="col">Page</th>
              <th scope="col" :aria-sort="ariaSort('views')">
                <button type="button" @click="toggleSort('views')">
                  Views
                  <ArrowUp v-if="sortKey === 'views' && sortDir === 'asc'" />
                  <ArrowDown v-else-if="sortKey === 'views'" />
                  <ArrowUpDown v-else />
                </button>
              </th>
              <th scope="col">Avg. time</th>
              <th scope="col" :aria-sort="ariaSort('bounce')">
                <button type="button" @click="toggleSort('bounce')">
                  Bounce
                  <ArrowUp v-if="sortKey === 'bounce' && sortDir === 'asc'" />
                  <ArrowDown v-else-if="sortKey === 'bounce'" />
                  <ArrowUpDown v-else />
                </button>
              </th>
              <th scope="col" :aria-sort="ariaSort('change')">
                <button type="button" @click="toggleSort('change')">
                  Change
                  <ArrowUp v-if="sortKey === 'change' && sortDir === 'asc'" />
                  <ArrowDown v-else-if="sortKey === 'change'" />
                  <ArrowUpDown v-else />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="page in sortedPages" :key="page.path">
              <td><span class="page-path">{{ page.path }}</span></td>
              <td class="num">{{ numberFormat.format(page.views) }}</td>
              <td class="num">{{ page.avgTime }}</td>
              <td class="num">{{ page.bounce.toFixed(1) }}%</td>
              <td>
                <span class="change" :class="page.change >= 0 ? 'up' : 'down'">
                  <ArrowUp v-if="page.change >= 0" />
                  <ArrowDown v-else />
                  {{ Math.abs(page.change).toFixed(1) }}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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

.grid-wide {
  display: grid;
  grid-template-columns: minmax(0, 1.85fr) minmax(0, 1fr);
  gap: 18px;
}

.grid-mid {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  gap: 18px;
}

.device-note {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
  font-size: 11.5px;
  color: var(--text-muted);
}

.device-note strong {
  color: var(--success);
  font-weight: 700;
}

.heat-scroll {
  overflow-x: auto;
  padding-bottom: 4px;
}

.heat-chart {
  min-width: 430px;
}

.data-table th button svg {
  width: 12px;
  height: 12px;
  opacity: 0.55;
}

.page-path {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  color: var(--text);
}

.change {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-family: var(--font-mono);
  font-size: 11.5px;
  font-weight: 600;
}

.change svg {
  width: 12px;
  height: 12px;
}

.change.up {
  color: var(--success);
}

.change.down {
  color: var(--danger);
}

@media (max-width: 1180px) {
  .kpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .grid-wide,
  .grid-mid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 640px) {
  .kpi-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
