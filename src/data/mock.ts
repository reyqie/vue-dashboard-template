import type {
  ActivityItem,
  BarItem,
  Budget,
  Conversation,
  DonutSegment,
  PageRow,
  Project,
  RevenueRange,
  Transaction,
} from '../types'

export const revenueRanges: Record<'7D' | '30D' | '90D', RevenueRange> = {
  '7D': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    current: [5.2, 6.8, 6.1, 8.4, 7.9, 9.6, 10.4],
    previous: [4.4, 5.1, 5.7, 6.2, 6.8, 7.1, 7.6],
  },
  '30D': {
    labels: ['01', '04', '07', '10', '13', '16', '19', '22', '25', '28'],
    current: [8.1, 8.9, 8.4, 10.2, 9.6, 11.8, 11.1, 12.6, 12.1, 13.8],
    previous: [6.9, 7.2, 7.6, 8.1, 8.4, 8.9, 9.2, 9.6, 10.1, 10.4],
  },
  '90D': {
    labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12', 'W13'],
    current: [28, 31, 29, 34, 33, 38, 36, 41, 39, 45, 44, 49, 53],
    previous: [24, 25, 27, 28, 30, 31, 33, 34, 36, 38, 40, 41, 44],
  },
}

export const trafficSources: DonutSegment[] = [
  { label: 'Direct', value: 38, color: 'var(--chart-1)' },
  { label: 'Organic', value: 27, color: 'var(--chart-2)' },
  { label: 'Social', value: 21, color: 'var(--chart-3)' },
  { label: 'Referral', value: 14, color: 'var(--chart-4)' },
]

export const topChannels: BarItem[] = [
  { label: 'Organic search', value: 12480, color: 'var(--chart-1)' },
  { label: 'Direct', value: 9860, color: 'var(--chart-2)' },
  { label: 'Social', value: 7420, color: 'var(--chart-3)' },
  { label: 'Email', value: 5140, color: 'var(--chart-4)' },
  { label: 'Referral', value: 3620, color: 'var(--chart-5)' },
]

export const activities: ActivityItem[] = [
  { id: 'a1', actor: 'Maya Chen', action: 'joined', target: 'Aurora Design System', time: '12m ago', kind: 'member' },
  { id: 'a2', actor: 'Sofia Ortiz', action: 'exported', target: 'Q4 revenue report', time: '48m ago', kind: 'upload' },
  { id: 'a3', actor: 'Ocean Analytics', action: 'moved to', target: 'Review', time: '2h ago', kind: 'complete' },
  { id: 'a4', actor: 'Stripe', action: 'sent a payout of', target: '$8,420.00', time: '3h ago', kind: 'payment' },
  { id: 'a5', actor: 'Daniel Kim', action: 'commented on', target: 'Nebula Mobile App', time: '5h ago', kind: 'message' },
]

export const projects: Project[] = [
  {
    id: 'p1',
    name: 'Aurora Design System',
    description: 'Unified component library and theme tokens for the new product suite.',
    progress: 72,
    status: 'In progress',
    tone: 'violet',
    members: ['AR', 'MC', 'JL', 'SO'],
    due: 'Nov 12',
    tags: ['Design', 'Core'],
  },
  {
    id: 'p2',
    name: 'Nebula Mobile App',
    description: 'Companion app for iOS and Android with offline-first sync.',
    progress: 46,
    status: 'In progress',
    tone: 'sky',
    members: ['DK', 'AR', 'PN'],
    due: 'Nov 28',
    tags: ['Mobile', 'Product'],
  },
  {
    id: 'p3',
    name: 'Ocean Analytics',
    description: 'Real-time revenue intelligence and cohort reporting.',
    progress: 88,
    status: 'Review',
    tone: 'teal',
    members: ['SO', 'MC'],
    due: 'Nov 05',
    tags: ['Data', 'Web'],
  },
  {
    id: 'p4',
    name: 'Sakura Marketing Site',
    description: 'Landing pages, editorial stories and the season launch campaign.',
    progress: 100,
    status: 'Done',
    tone: 'rose',
    members: ['JL', 'AR', 'PN', 'DK'],
    due: 'Oct 22',
    tags: ['Marketing', 'Web'],
  },
  {
    id: 'p5',
    name: 'Pulse CRM',
    description: 'Customer timeline, deal pipeline and lightweight automation rules.',
    progress: 34,
    status: 'In progress',
    tone: 'amber',
    members: ['MC', 'SO', 'JL'],
    due: 'Dec 09',
    tags: ['CRM', 'Product'],
  },
  {
    id: 'p6',
    name: 'Voyager Onboarding',
    description: 'Guided onboarding flow with contextual product tours and checklists.',
    progress: 61,
    status: 'Review',
    tone: 'lime',
    members: ['PN', 'DK'],
    due: 'Nov 18',
    tags: ['Growth', 'UX'],
  },
]

export const transactions: Transaction[] = [
  { id: 't1', merchant: 'Stripe payout', category: 'Revenue', date: 'Nov 02', amount: 8420, type: 'income', status: 'Completed' },
  { id: 't2', merchant: 'Figma', category: 'Software', date: 'Nov 01', amount: 48, type: 'expense', status: 'Completed' },
  { id: 't3', merchant: 'Linear', category: 'Software', date: 'Oct 31', amount: 96, type: 'expense', status: 'Completed' },
  { id: 't4', merchant: 'Notion', category: 'Software', date: 'Oct 30', amount: 120, type: 'expense', status: 'Completed' },
  { id: 't5', merchant: 'Arclight Studio', category: 'Client payment', date: 'Oct 29', amount: 12800, type: 'income', status: 'Pending' },
  { id: 't6', merchant: 'Vercel', category: 'Hosting', date: 'Oct 28', amount: 240, type: 'expense', status: 'Completed' },
  { id: 't7', merchant: 'Apple Store', category: 'Equipment', date: 'Oct 26', amount: 2499, type: 'expense', status: 'Completed' },
  { id: 't8', merchant: 'Lumen Coffee', category: 'Team', date: 'Oct 25', amount: 86.4, type: 'expense', status: 'Completed' },
  { id: 't9', merchant: 'Google Ads', category: 'Marketing', date: 'Oct 24', amount: 1240, type: 'expense', status: 'Completed' },
]

export const budgets: Budget[] = [
  { category: 'Design ops', spent: 2400, limit: 3400, color: 'var(--chart-2)' },
  { category: 'Product', spent: 4200, limit: 6000, color: 'var(--chart-1)' },
  { category: 'Marketing', spent: 2100, limit: 2800, color: 'var(--chart-3)' },
  { category: 'Infrastructure', spent: 980, limit: 1600, color: 'var(--chart-4)' },
]

export const spendingBreakdown: DonutSegment[] = [
  { label: 'Software', value: 38, color: 'var(--chart-1)' },
  { label: 'Payroll', value: 27, color: 'var(--chart-2)' },
  { label: 'Marketing', value: 18, color: 'var(--chart-3)' },
  { label: 'Equipment', value: 10, color: 'var(--chart-4)' },
  { label: 'Other', value: 7, color: 'var(--chart-5)' },
]

export const conversations: Conversation[] = [
  {
    id: 'c1',
    name: 'Maya Chen',
    initials: 'MC',
    role: 'Product Lead',
    subject: 'Re: Aurora handoff',
    preview: 'The tokens are looking gorgeous — can we ship the dark variant this week?',
    time: '2m',
    unread: true,
    online: true,
    messages: [
      { id: 'm1', from: 'them', text: 'Hey Aria! I pushed the final theme tokens to the shared library.', time: '09:41' },
      { id: 'm2', from: 'me', text: 'Amazing. I am reviewing the contrast pairs now — the ocean palette is my favorite.', time: '09:44' },
      { id: 'm3', from: 'them', text: 'The tokens are looking gorgeous. Can we ship the dark variant this week?', time: '09:46' },
    ],
  },
  {
    id: 'c2',
    name: 'Daniel Kim',
    initials: 'DK',
    role: 'Engineering',
    subject: 'Deploy pipeline is green',
    preview: 'All checks passed on the release candidate. Ready when you are.',
    time: '18m',
    unread: true,
    online: true,
    messages: [
      { id: 'm1', from: 'them', text: 'All checks passed on the release candidate.', time: '09:20' },
      { id: 'm2', from: 'me', text: 'Perfect. Let us hold the deploy until the copy review lands.', time: '09:24' },
      { id: 'm3', from: 'them', text: 'Ready when you are. I will keep the pipeline warm.', time: '09:26' },
    ],
  },
  {
    id: 'c3',
    name: 'Sofia Ortiz',
    initials: 'SO',
    role: 'Data Science',
    subject: 'Q4 metric definitions',
    preview: 'I updated the revenue model with the new attribution window.',
    time: '1h',
    unread: false,
    online: false,
    messages: [
      { id: 'm1', from: 'them', text: 'I updated the revenue model with the new attribution window.', time: '08:32' },
      { id: 'm2', from: 'me', text: 'Got it. Does it change the cohort totals much?', time: '08:40' },
      { id: 'm3', from: 'them', text: 'Only by 2.4% on enterprise. I will drop a note in the report.', time: '08:42' },
    ],
  },
  {
    id: 'c4',
    name: 'Priya Nair',
    initials: 'PN',
    role: 'Growth',
    subject: 'Launch checklist v3',
    preview: 'Added owners and dates — we are two days ahead of schedule.',
    time: '2h',
    unread: true,
    online: true,
    messages: [
      { id: 'm1', from: 'them', text: 'Added owners and dates to the launch checklist.', time: '07:58' },
      { id: 'm2', from: 'them', text: 'We are two days ahead of schedule. Want to pull the announcement forward?', time: '07:59' },
    ],
  },
  {
    id: 'c5',
    name: 'Jonah Lee',
    initials: 'JL',
    role: 'Design',
    subject: 'Sakura launch assets',
    preview: 'Uploaded the final illustrations to the campaign folder.',
    time: '3h',
    unread: true,
    online: false,
    messages: [
      { id: 'm1', from: 'them', text: 'Uploaded the final illustrations to the campaign folder.', time: '06:12' },
      { id: 'm2', from: 'me', text: 'They look beautiful. The petal motion is so subtle.', time: '06:30' },
    ],
  },
]

export const trafficData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  sessions: [42, 48, 45, 58, 62, 59, 71, 76, 72, 84, 91, 98],
  sessionsPrev: [36, 40, 42, 47, 52, 54, 60, 64, 65, 71, 78, 84],
  users: [26, 30, 29, 36, 40, 38, 46, 49, 47, 54, 60, 65],
  usersPrev: [22, 25, 27, 31, 34, 35, 39, 42, 43, 46, 51, 56],
}

export const engagementHeatmap: number[][] = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 20 }, (_, hour) => {
    const wave = (Math.sin((day + 1) * (hour + 2) * 0.7) + 1) / 2
    const daytime = hour < 5 || hour > 17 ? 0.28 : 1
    return Math.round(wave * daytime * 100)
  }),
)

export const heatmapDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const heatmapHours = ['12a', '4a', '8a', '12p', '4p', '8p']

export const deviceSegments: DonutSegment[] = [
  { label: 'Desktop', value: 58, color: 'var(--chart-1)' },
  { label: 'Mobile', value: 31, color: 'var(--chart-2)' },
  { label: 'Tablet', value: 11, color: 'var(--chart-3)' },
]

export const topPages: PageRow[] = [
  { path: '/pricing', views: 18420, avgTime: '3m 12s', bounce: 24.1, change: 12.4 },
  { path: '/product/aurora', views: 15280, avgTime: '4m 48s', bounce: 18.6, change: 8.9 },
  { path: '/blog/design-tokens', views: 12640, avgTime: '6m 04s', bounce: 32.4, change: 22.1 },
  { path: '/changelog', views: 9840, avgTime: '2m 41s', bounce: 41.2, change: -3.8 },
  { path: '/customers', views: 7620, avgTime: '5m 18s', bounce: 21.7, change: 6.4 },
  { path: '/docs/getting-started', views: 6480, avgTime: '8m 32s', bounce: 15.9, change: 14.2 },
]
