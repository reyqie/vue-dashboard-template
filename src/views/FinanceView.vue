<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import {
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  PiggyBank,
  Plus,
  Receipt,
  Search,
  Wallet,
} from '@lucide/vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import StatCard from '@/components/ui/StatCard.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import DonutChart from '@/components/charts/DonutChart.vue'
import ProgressRing from '@/components/charts/ProgressRing.vue'
import Sparkline from '@/components/ui/Sparkline.vue'
import { budgets, spendingBreakdown, transactions as seedTransactions } from '@/data/mock'
import { useCountUp } from '@/composables/useCountUp'
import { useStoredState } from '@/composables/useStoredState'
import { useToast } from '@/composables/useToast'
import type { Transaction } from '@/types'

const { toast } = useToast()

function isTransactionList(value: unknown): value is Transaction[] {
  return (
    Array.isArray(value) &&
    value.every((item: unknown) => {
      if (typeof item !== 'object' || item === null) return false
      const transaction = item as Record<string, unknown>
      return (
        typeof transaction.id === 'string' &&
        typeof transaction.merchant === 'string' &&
        typeof transaction.category === 'string' &&
        typeof transaction.date === 'string' &&
        typeof transaction.amount === 'number' &&
        Number.isFinite(transaction.amount) &&
        ['income', 'expense'].includes(String(transaction.type)) &&
        ['Completed', 'Pending'].includes(String(transaction.status))
      )
    })
  )
}

const transactions = useStoredState(
  'lumina-transactions',
  () => seedTransactions.map((item) => ({ ...item })),
  isTransactionList,
)

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

const balance = useCountUp(() => 128450.2)
const balanceFormatted = computed(() => money.format(balance.value))

const search = ref('')
const typeFilter = ref<'all' | 'income' | 'expense'>('all')

const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()
  return transactions.value.filter((item) => {
    const matchesType = typeFilter.value === 'all' || item.type === typeFilter.value
    const matchesTerm =
      !term || item.merchant.toLowerCase().includes(term) || item.category.toLowerCase().includes(term)
    return matchesType && matchesTerm
  })
})

function formatAmount(item: Transaction) {
  const sign = item.type === 'income' ? '+' : '−'
  return `${sign}${money.format(item.amount)}`
}

function exportCsv() {
  const rows = [
    ['Merchant', 'Category', 'Date', 'Amount', 'Type', 'Status'],
    ...filtered.value.map((item) => [
      item.merchant,
      item.category,
      item.date,
      item.amount.toFixed(2),
      item.type,
      item.status,
    ]),
  ]
  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'lumina-transactions.csv'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
  toast('Transactions exported as CSV')
}

const modalOpen = ref(false)
const formError = ref('')
const form = reactive({
  merchant: '',
  category: 'Software',
  amount: '',
  type: 'expense' as 'income' | 'expense',
})

function openAdd() {
  form.merchant = ''
  form.category = 'Software'
  form.amount = ''
  form.type = 'expense'
  formError.value = ''
  modalOpen.value = true
}

function addTransaction() {
  const amount = Number(form.amount)
  if (!form.merchant.trim()) {
    formError.value = 'Add a merchant or description.'
    return
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    formError.value = 'Enter an amount greater than zero.'
    return
  }
  const today = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit' }).format(new Date())
  transactions.value.unshift({
    id: `t-${Date.now()}`,
    merchant: form.merchant.trim(),
    category: form.category,
    date: today,
    amount: Math.round(amount * 100) / 100,
    type: form.type,
    status: 'Completed',
  })
  modalOpen.value = false
  toast(`Transaction for ${form.merchant.trim()} added`)
}

function scrollToTransactions() {
  document.getElementById('transactions')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const budgetRows = computed(() =>
  budgets.map((budget) => ({
    ...budget,
    percent: Math.min(100, Math.round((budget.spent / budget.limit) * 100)),
  })),
)
</script>

<template>
  <div class="view">
    <PageHeader
      eyebrow="Finance"
      title="Money, in focus"
      description="Balance, spending and runway — a clean financial pulse for the studio."
    >
      <button type="button" class="btn" @click="exportCsv"><Download />Export CSV</button>
      <button type="button" class="btn btn-primary" @click="openAdd"><Plus />Add transaction</button>
    </PageHeader>

    <section class="finance-top">
      <article class="balance card">
        <div class="balance-glow" aria-hidden="true" />
        <div class="balance-head">
          <span class="balance-label">Total balance</span>
          <span class="balance-currency">USD · Checking</span>
        </div>
        <p class="balance-value nums">{{ balanceFormatted }}</p>
        <div class="balance-meta">
          <span class="balance-badge"><ArrowUpRight />8.6%</span>
          <span>vs October</span>
        </div>

        <Sparkline
          class="balance-spark"
          :data="[42, 48, 45, 53, 50, 58, 61, 68]"
          color="var(--on-primary)"
          :width="260"
          :height="58"
        />

        <div class="balance-foot">
          <div class="card-chip" aria-hidden="true">
            <span /><span />
          </div>
          <span class="balance-number nums">•••• 4821</span>
          <button type="button" class="balance-link" @click="scrollToTransactions">
            View statement <ArrowUpRight />
          </button>
        </div>
      </article>

      <article class="card card-pad">
        <div class="card-head">
          <div>
            <h2 class="card-title">Spending mix</h2>
            <p class="card-sub">Where the budget goes</p>
          </div>
          <Receipt class="head-icon" />
        </div>
        <DonutChart :segments="spendingBreakdown" :size="168" center-value="$18.4k" center-label="Monthly" />
      </article>
    </section>

    <section class="kpi-grid stagger" aria-label="Financial metrics">
      <StatCard
        label="Monthly income"
        :value="52840"
        prefix="$"
        :icon="Wallet"
        :data="[38, 41, 40, 46, 44, 49, 51, 54]"
        :delta="18.2"
        tone="success"
        :style="{ '--i': 0 }"
      />
      <StatCard
        label="Monthly expense"
        :value="18420"
        prefix="$"
        :icon="Receipt"
        :data="[26, 24, 25, 22, 23, 21, 19, 18.4]"
        :delta="-4.6"
        invert-delta
        tone="warning"
        :style="{ '--i': 1 }"
      />
      <StatCard
        label="Savings rate"
        :value="34"
        suffix="%"
        :icon="PiggyBank"
        :data="[26, 27, 29, 28, 31, 30, 33, 34]"
        :delta="3.1"
        tone="accent"
        :style="{ '--i': 2 }"
      />
    </section>

    <section class="finance-mid">
      <article class="card card-pad">
        <div class="card-head">
          <div>
            <h2 class="card-title">Budget health</h2>
            <p class="card-sub">Spent against monthly limits</p>
          </div>
          <span class="badge badge-success">On track</span>
        </div>

        <ul class="budget-list">
          <li v-for="budget in budgetRows" :key="budget.category">
            <div class="budget-meta">
              <span class="budget-category">{{ budget.category }}</span>
              <span class="budget-value nums">{{ money.format(budget.spent) }} / {{ money.format(budget.limit) }}</span>
            </div>
            <div class="budget-track">
              <span :style="{ width: `${budget.percent}%`, background: budget.color }" />
            </div>
            <span class="budget-percent nums">{{ budget.percent }}%</span>
          </li>
        </ul>
      </article>

      <article class="card card-pad">
        <div class="card-head">
          <div>
            <h2 class="card-title">Savings goal</h2>
            <p class="card-sub">Emergency runway fund</p>
          </div>
          <PiggyBank class="head-icon" />
        </div>
        <div class="savings-body">
          <ProgressRing :value="82" :size="108" :thickness="9" label="Savings goal" />
          <div class="savings-copy">
            <p class="savings-value nums">$34,800</p>
            <span class="savings-note">of $42,000 target</span>
            <span class="badge badge-success">On track for January</span>
          </div>
        </div>
        <p class="savings-foot">
          You are saving <strong class="nums">{{ money.format(2400) }}</strong> each month. Keep this pace to hit the goal
          five days early.
        </p>
      </article>
    </section>

    <section id="transactions" class="card card-pad">
      <div class="card-head">
        <div>
          <h2 class="card-title">Transactions</h2>
          <p class="card-sub">{{ filtered.length }} of {{ transactions.length }} entries</p>
        </div>
        <div class="table-tools">
          <div class="search-field">
            <Search aria-hidden="true" />
            <input v-model="search" type="search" class="input" placeholder="Search merchant or category" aria-label="Search transactions" />
          </div>
          <div class="seg" role="group" aria-label="Filter by type">
            <button type="button" :aria-pressed="typeFilter === 'all'" @click="typeFilter = 'all'">All</button>
            <button type="button" :aria-pressed="typeFilter === 'income'" @click="typeFilter = 'income'">Income</button>
            <button type="button" :aria-pressed="typeFilter === 'expense'" @click="typeFilter = 'expense'">Expense</button>
          </div>
        </div>
      </div>

      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th scope="col">Merchant</th>
              <th scope="col">Date</th>
              <th scope="col">Status</th>
              <th scope="col" class="num">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filtered" :key="item.id">
              <td>
                <div class="merchant">
                  <span class="merchant-icon" :data-type="item.type">
                    <component :is="item.type === 'income' ? ArrowDownLeft : ArrowUpRight" />
                  </span>
                  <span class="merchant-copy">
                    <strong>{{ item.merchant }}</strong>
                    <small>{{ item.category }}</small>
                  </span>
                </div>
              </td>
              <td class="nums date-cell">{{ item.date }}</td>
              <td>
                <span class="badge" :class="item.status === 'Completed' ? 'badge-success' : 'badge-warning'">
                  {{ item.status }}
                </span>
              </td>
              <td class="num">
                <span class="amount" :data-type="item.type">{{ formatAmount(item) }}</span>
              </td>
            </tr>
            <tr v-if="!filtered.length">
              <td colspan="4">
                <p class="empty-row">No transactions match this search.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <BaseModal
      :open="modalOpen"
      title="Add transaction"
      description="Record a payment or payout in the studio ledger."
      @close="modalOpen = false"
    >
      <form class="form-grid" novalidate @submit.prevent="addTransaction">
        <div class="field">
          <label for="tx-merchant">Merchant or description</label>
          <input
            id="tx-merchant"
            v-model="form.merchant"
            class="input"
            placeholder="e.g. Figma"
            :aria-invalid="Boolean(formError)"
            aria-describedby="tx-error"
          />
        </div>

        <div class="form-row">
          <div class="field">
            <label for="tx-category">Category</label>
            <select id="tx-category" v-model="form.category" class="select">
              <option>Software</option>
              <option>Revenue</option>
              <option>Client payment</option>
              <option>Marketing</option>
              <option>Hosting</option>
              <option>Equipment</option>
              <option>Team</option>
            </select>
          </div>
          <div class="field">
            <label for="tx-type">Type</label>
            <select id="tx-type" v-model="form.type" class="select">
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>

        <div class="field">
          <label for="tx-amount">Amount (USD)</label>
          <input
            id="tx-amount"
            v-model="form.amount"
            class="input nums"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            :aria-invalid="Boolean(formError)"
            aria-describedby="tx-error"
          />
          <p v-if="formError" id="tx-error" class="field-error" role="alert">{{ formError }}</p>
        </div>

        <footer class="modal-actions">
          <button type="button" class="btn" @click="modalOpen = false">Cancel</button>
          <button type="submit" class="btn btn-primary"><Plus />Add transaction</button>
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

.finance-top {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  gap: 18px;
}

.balance {
  position: relative;
  overflow: hidden;
  padding: 24px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-strong) 55%, var(--accent) 130%);
  border-color: transparent;
  color: var(--on-primary);
  display: flex;
  flex-direction: column;
  min-height: 250px;
}

.balance::after {
  background: linear-gradient(140deg, rgba(255, 255, 255, 0.22), transparent 40%);
}

.balance-glow {
  position: absolute;
  width: 280px;
  height: 280px;
  right: -60px;
  top: -120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
  filter: blur(10px);
  pointer-events: none;
}

.balance-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.balance-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0.78;
}

.balance-currency {
  font-size: 10.5px;
  font-weight: 600;
  opacity: 0.72;
}

.balance-value {
  margin-top: 12px;
  font-size: clamp(32px, 4vw, 44px);
  font-weight: 600;
  letter-spacing: -0.055em;
  line-height: 1;
}

.balance-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  font-size: 11px;
  opacity: 0.82;
}

.balance-badge {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 600;
}

.balance-badge svg {
  width: 11px;
  height: 11px;
}

.balance-spark {
  width: 220px;
  margin-top: 6px;
  opacity: 0.9;
}

.balance-foot {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto;
  padding-top: 18px;
}

.card-chip {
  display: flex;
  align-items: center;
  gap: 3px;
  width: 30px;
  height: 22px;
  padding: 0 5px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.35);
}

.card-chip span {
  flex: 1;
  height: 9px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.55);
}

.balance-number {
  font-size: 12px;
  letter-spacing: 0.14em;
  opacity: 0.85;
}

.balance-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  border: 0;
  padding: 0;
  background: transparent;
  color: inherit;
  font-size: 11.5px;
  font-weight: 600;
  opacity: 0.9;
}

.balance-link:hover {
  opacity: 1;
  text-decoration: underline;
}

.balance-link svg {
  width: 13px;
  height: 13px;
}

.head-icon {
  width: 18px;
  height: 18px;
  color: var(--text-faint);
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.finance-mid {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
  gap: 18px;
}

.budget-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.budget-list li {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 6px 12px;
  align-items: center;
}

.budget-meta {
  grid-column: 1 / -1;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.budget-category {
  font-size: 12.5px;
  font-weight: 600;
}

.budget-value {
  font-size: 10.5px;
  color: var(--text-faint);
}

.budget-track {
  height: 7px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--text-faint) 14%, transparent);
  overflow: hidden;
}

.budget-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  transition: width 1s var(--ease);
}

.budget-percent {
  font-size: 10px;
  color: var(--text-muted);
}

.savings-body {
  display: flex;
  align-items: center;
  gap: 20px;
}

.savings-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
}

.savings-value {
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.045em;
  line-height: 1;
}

.savings-note {
  font-size: 11px;
  color: var(--text-faint);
}

.savings-foot {
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
  font-size: 11.5px;
  line-height: 1.55;
  color: var(--text-muted);
}

.savings-foot strong {
  color: var(--text);
  font-weight: 600;
}

.table-tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
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
  width: 238px;
  min-height: 36px;
  padding-left: 36px;
  font-size: 12.5px;
}

.merchant {
  display: flex;
  align-items: center;
  gap: 10px;
}

.merchant-icon {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  flex: none;
  border-radius: 10px;
  background: color-mix(in srgb, var(--text-faint) 13%, transparent);
  color: var(--text-muted);
}

.merchant-icon[data-type='income'] {
  background: color-mix(in srgb, var(--success) 13%, transparent);
  color: var(--success);
}

.merchant-icon svg {
  width: 15px;
  height: 15px;
}

.merchant-copy {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.merchant-copy strong {
  font-size: 12.5px;
  font-weight: 600;
}

.merchant-copy small {
  font-size: 10px;
  color: var(--text-faint);
}

.date-cell {
  color: var(--text-muted);
  font-size: 11.5px;
}

.amount {
  font-weight: 600;
  font-size: 12.5px;
}

.amount[data-type='income'] {
  color: var(--success);
}

.amount[data-type='expense'] {
  color: var(--text);
}

.empty-row {
  padding: 24px;
  text-align: center;
  font-size: 12.5px;
  color: var(--text-muted);
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 9px;
  margin-top: 6px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
}

@media (max-width: 1180px) {
  .finance-top,
  .finance-mid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 860px) {
  .kpi-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .table-tools {
    width: 100%;
  }

  .search-field {
    flex: 1;
  }

  .search-field .input {
    width: 100%;
  }
}

@media (max-width: 560px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .savings-body {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
