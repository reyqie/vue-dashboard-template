<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { CalendarDays, CheckCheck, FolderKanban, Plus, Users } from '@lucide/vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import ProgressRing from '@/components/charts/ProgressRing.vue'
import { useToast } from '@/composables/useToast'
import { useProjects } from '@/composables/useProjects'
import type { Project, ProjectStatus, ProjectTone } from '@/types'

const { toast } = useToast()
const { projects: list } = useProjects()

type Filter = 'All' | ProjectStatus
const filters: Filter[] = ['All', 'In progress', 'Review', 'Done']
const activeFilter = ref<Filter>('All')

const filtered = computed(() =>
  activeFilter.value === 'All' ? list.value : list.value.filter((project) => project.status === activeFilter.value),
)

function countFor(filter: Filter) {
  return filter === 'All' ? list.value.length : list.value.filter((project) => project.status === filter).length
}

const tones: ProjectTone[] = ['violet', 'sky', 'teal', 'rose', 'amber', 'lime']

const createOpen = ref(false)
const formError = ref('')
const form = reactive({
  name: '',
  description: '',
  status: 'In progress' as ProjectStatus,
  due: '',
})

function openCreate() {
  form.name = ''
  form.description = ''
  form.status = 'In progress'
  form.due = ''
  formError.value = ''
  createOpen.value = true
}

function createProject() {
  if (!form.name.trim()) {
    formError.value = 'Give the project a name so the team can find it.'
    return
  }
  const due = form.due
    ? new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit' }).format(new Date(`${form.due}T12:00:00`))
    : 'No date'
  const project: Project = {
    id: `p-${Date.now()}`,
    name: form.name.trim(),
    description: form.description.trim() || 'A fresh project ready for its first milestone.',
    progress: form.status === 'Done' ? 100 : 0,
    status: form.status,
    tone: tones[list.value.length % tones.length] ?? 'violet',
    members: ['AR'],
    due,
    tags: ['New'],
  }
  list.value.unshift(project)
  activeFilter.value = 'All'
  createOpen.value = false
  toast(`“${project.name}” created`)
}

const selected = ref<Project | null>(null)

function openProject(project: Project) {
  selected.value = project
}

function markComplete() {
  if (!selected.value) return
  selected.value.progress = 100
  selected.value.status = 'Done'
  const target = list.value.find((project) => project.id === selected.value?.id)
  if (target) {
    target.progress = 100
    target.status = 'Done'
  }
  toast(`“${selected.value.name}” marked complete`)
}
</script>

<template>
  <div class="view">
    <PageHeader
      eyebrow="Projects"
      title="Studio projects"
      description="Every initiative, milestone and handoff — organised in a calm, scannable space."
    >
      <button type="button" class="btn btn-primary" @click="openCreate"><Plus />New project</button>
    </PageHeader>

    <div class="filter-row" role="group" aria-label="Filter projects">
      <button
        v-for="filter in filters"
        :key="filter"
        type="button"
        class="chip"
        :aria-pressed="activeFilter === filter"
        @click="activeFilter = filter"
      >
        {{ filter }}
        <span class="chip-count nums">{{ countFor(filter) }}</span>
      </button>
      <span class="filter-meta">{{ filtered.length }} shown</span>
    </div>

    <section v-if="filtered.length" class="project-grid stagger" aria-label="Projects">
      <article
        v-for="(project, index) in filtered"
        :key="project.id"
        class="project-card card card-hover"
        :style="{ '--i': index }"
      >
        <div class="project-top">
          <span class="project-mark" :data-tone="project.tone">{{ project.name.slice(0, 2).toUpperCase() }}</span>
          <span class="badge" :data-status="project.status">{{ project.status }}</span>
        </div>

        <div class="project-body">
          <h2>{{ project.name }}</h2>
          <p>{{ project.description }}</p>
          <div class="tags">
            <span v-for="tag in project.tags" :key="tag" class="tag">#{{ tag }}</span>
          </div>
        </div>

        <div class="project-progress">
          <div class="progress-meta">
            <span>Progress</span>
            <span class="nums">{{ project.progress }}%</span>
          </div>
          <div class="progress-track">
            <span :style="{ width: `${project.progress}%` }" />
          </div>
        </div>

        <footer class="project-foot">
          <div class="avatar-stack" aria-label="Team members">
            <span
              v-for="member in project.members.slice(0, 4)"
              :key="member"
              class="avatar avatar-sm"
              :data-tone="project.tone"
            >
              {{ member }}
            </span>
            <span v-if="project.members.length > 4" class="avatar avatar-sm more">
              +{{ project.members.length - 4 }}
            </span>
          </div>
          <span class="due"><CalendarDays />{{ project.due }}</span>
          <button type="button" class="btn btn-sm" @click="openProject(project)">Open</button>
        </footer>
      </article>
    </section>

    <div v-else class="empty card card-pad">
      <FolderKanban />
      <h2>No projects in this stage</h2>
      <p>Move a project here or create a new one to keep momentum visible.</p>
      <button type="button" class="btn btn-primary" @click="openCreate"><Plus />New project</button>
    </div>

    <BaseModal
      :open="createOpen"
      title="Create a project"
      description="Add a new initiative to the studio workspace."
      @close="createOpen = false"
    >
      <form class="form-grid" novalidate @submit.prevent="createProject">
        <div class="field">
          <label for="project-name">Project name</label>
          <input
            id="project-name"
            v-model="form.name"
            class="input"
            placeholder="e.g. Aurora Design System"
            :aria-invalid="Boolean(formError)"
            aria-describedby="project-name-error"
          />
          <p v-if="formError" id="project-name-error" class="field-error" role="alert">{{ formError }}</p>
        </div>

        <div class="field">
          <label for="project-desc">Description</label>
          <textarea
            id="project-desc"
            v-model="form.description"
            class="textarea"
            rows="3"
            placeholder="What is this project here to achieve?"
          />
        </div>

        <div class="form-row">
          <div class="field">
            <label for="project-status">Status</label>
            <select id="project-status" v-model="form.status" class="select">
              <option value="In progress">In progress</option>
              <option value="Review">Review</option>
              <option value="Done">Done</option>
            </select>
          </div>
          <div class="field">
            <label for="project-due">Due date</label>
            <input id="project-due" v-model="form.due" type="date" class="input" />
          </div>
        </div>

        <footer class="modal-actions">
          <button type="button" class="btn" @click="createOpen = false">Cancel</button>
          <button type="submit" class="btn btn-primary"><Plus />Create project</button>
        </footer>
      </form>
    </BaseModal>

    <BaseModal
      :open="Boolean(selected)"
      :title="selected?.name ?? 'Project'"
      :description="selected?.description"
      @close="selected = null"
    >
      <div v-if="selected" class="detail">
        <div class="detail-summary">
          <ProgressRing :value="selected.progress" :size="76" :thickness="7" label="Project progress" />
          <div class="detail-copy">
            <span class="badge" :data-status="selected.status">{{ selected.status }}</span>
            <p class="detail-progress nums">{{ selected.progress }}% complete</p>
            <p class="detail-due">Due {{ selected.due }}</p>
          </div>
        </div>

        <div class="detail-tags">
          <span v-for="tag in selected.tags" :key="tag" class="tag">#{{ tag }}</span>
        </div>

        <div class="detail-meta">
          <div class="meta-row">
            <span><Users />Team</span>
            <div class="avatar-stack">
              <span v-for="member in selected.members" :key="member" class="avatar avatar-sm" :data-tone="selected.tone">
                {{ member }}
              </span>
            </div>
          </div>
          <div class="meta-row">
            <span><CalendarDays />Due date</span>
            <strong>{{ selected.due }}</strong>
          </div>
        </div>

        <footer class="modal-actions">
          <button type="button" class="btn" @click="selected = null">Close</button>
          <button
            type="button"
            class="btn btn-primary"
            :disabled="selected.status === 'Done'"
            @click="markComplete"
          >
            <CheckCheck />Mark complete
          </button>
        </footer>
      </div>
    </BaseModal>
  </div>
</template>

<style scoped>
.view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.chip-count {
  display: grid;
  place-items: center;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--text-faint) 16%, transparent);
  font-size: 9.5px;
}

.chip[aria-pressed='true'] .chip-count {
  background: color-mix(in srgb, var(--primary) 18%, transparent);
}

.filter-meta {
  margin-left: auto;
  font-size: 11px;
  color: var(--text-faint);
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.project-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
}

.project-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.project-mark {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 13px;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #fff;
  background: linear-gradient(135deg, #a78bfa, #6d28d9);
}

.project-mark[data-tone='sky'] {
  background: linear-gradient(135deg, #38bdf8, #0369a1);
}
.project-mark[data-tone='teal'] {
  background: linear-gradient(135deg, #2dd4bf, #0f766e);
}
.project-mark[data-tone='rose'] {
  background: linear-gradient(135deg, #f472b6, #be185d);
}
.project-mark[data-tone='amber'] {
  background: linear-gradient(135deg, #fbbf24, #b45309);
}
.project-mark[data-tone='lime'] {
  background: linear-gradient(135deg, #a3e635, #4d7c0f);
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

.project-body h2 {
  font-size: 15px;
  letter-spacing: -0.02em;
}

.project-body p {
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.tag {
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid var(--border);
  font-size: 10px;
  font-weight: 600;
  color: var(--text-faint);
}

.project-progress {
  margin-top: auto;
}

.progress-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 10.5px;
  font-weight: 600;
  color: var(--text-muted);
}

.progress-track {
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

.project-foot {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 13px;
  border-top: 1px solid var(--border);
}

.avatar.more {
  background: color-mix(in srgb, var(--text-faint) 18%, transparent);
  color: var(--text-muted);
  border-color: transparent;
}

.due {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10.5px;
  color: var(--text-faint);
  white-space: nowrap;
}

.due svg {
  width: 12px;
  height: 12px;
}

.project-foot .btn {
  margin-left: auto;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  padding: 48px 24px;
}

.empty > svg {
  width: 32px;
  height: 32px;
  color: var(--text-faint);
}

.empty h2 {
  font-size: 17px;
}

.empty p {
  font-size: 12.5px;
  color: var(--text-muted);
  max-width: 42ch;
}

.empty .btn {
  margin-top: 8px;
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

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-summary {
  display: flex;
  align-items: center;
  gap: 18px;
}

.detail-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
}

.detail-progress {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.03em;
}

.detail-due {
  font-size: 11px;
  color: var(--text-faint);
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.detail-meta {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--surface-solid) 26%, transparent);
}

.meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 11.5px;
}

.meta-row > span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
}

.meta-row svg {
  width: 14px;
  height: 14px;
}

.meta-row strong {
  font-weight: 600;
}

@media (max-width: 1180px) {
  .project-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .project-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .filter-meta {
    display: none;
  }
}
</style>
