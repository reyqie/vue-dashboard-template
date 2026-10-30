export type ProjectStatus = 'In progress' | 'Review' | 'Done'
export type ProjectTone = 'rose' | 'violet' | 'teal' | 'amber' | 'sky' | 'lime'

export interface Project {
  id: string
  name: string
  description: string
  progress: number
  status: ProjectStatus
  tone: ProjectTone
  members: string[]
  due: string
  tags: string[]
}

export interface Transaction {
  id: string
  merchant: string
  category: string
  date: string
  amount: number
  type: 'income' | 'expense'
  status: 'Completed' | 'Pending'
}

export interface Budget {
  category: string
  spent: number
  limit: number
  color: string
}

export type ActivityKind = 'member' | 'upload' | 'complete' | 'payment' | 'message'

export interface ActivityItem {
  id: string
  actor: string
  action: string
  target: string
  time: string
  kind: ActivityKind
}

export interface ChatMessage {
  id: string
  from: 'me' | 'them'
  text: string
  time: string
}

export interface Conversation {
  id: string
  name: string
  initials: string
  role: string
  subject: string
  preview: string
  time: string
  unread: boolean
  online: boolean
  messages: ChatMessage[]
}

export interface PageRow {
  path: string
  views: number
  avgTime: string
  bounce: number
  change: number
}

export interface RevenueRange {
  labels: string[]
  current: number[]
  previous: number[]
}

export interface Series {
  name: string
  color: string
  data: number[]
}

export interface DonutSegment {
  label: string
  value: number
  color: string
}

export interface BarItem {
  label: string
  value: number
  color?: string
}
