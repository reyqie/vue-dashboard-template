import type { Project } from '@/types'
import { projects as seedProjects } from '@/data/mock'
import { useStoredState } from './useStoredState'

function isProjectList(value: unknown): value is Project[] {
  return (
    Array.isArray(value) &&
    value.every((item: unknown) => {
      if (typeof item !== 'object' || item === null) return false
      const project = item as Record<string, unknown>
      return (
        typeof project.id === 'string' &&
        typeof project.name === 'string' &&
        typeof project.description === 'string' &&
        typeof project.progress === 'number' &&
        ['In progress', 'Review', 'Done'].includes(String(project.status)) &&
        ['rose', 'violet', 'teal', 'amber', 'sky', 'lime'].includes(String(project.tone)) &&
        Array.isArray(project.members) &&
        project.members.every((member: unknown) => typeof member === 'string') &&
        typeof project.due === 'string' &&
        Array.isArray(project.tags) &&
        project.tags.every((tag: unknown) => typeof tag === 'string')
      )
    })
  )
}

const projects = useStoredState(
  'lumina-projects',
  () =>
    seedProjects.map((project) => ({
      ...project,
      members: [...project.members],
      tags: [...project.tags],
    })),
  isProjectList,
)

export function useProjects() {
  return { projects }
}
