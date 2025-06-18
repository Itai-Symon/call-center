import type { Tag, Call, Task, TaskStatus } from '../types/index'

// Use environment variable for API base URL, fallback to localhost for development
export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const api = {
  // Tag
  getTags: (): Promise<Tag[]> => fetch(`${API_BASE}/tags/`).then(r => r.json()),
  createTag: (name: string): Promise<Tag>  => fetch(`${API_BASE}/tags/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  }).then(r => r.json()),
  updateTag: (id:number, name:string): Promise<Tag>  => fetch(`${API_BASE}/tags/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  }).then(r => r.json()),

  // Call
  getCalls: (): Promise<Call[]> => fetch(`${API_BASE}/calls/`).then(r => r.json()),
  getCall: (id: number): Promise<Call> => fetch(`${API_BASE}/calls/${id}`).then(r => r.json()),
  createCall: (title: string): Promise<Call> => fetch(`${API_BASE}/calls/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, tag_ids: [] })
  }).then(r => r.json()),
  updateCall: (id: number, data: { title: string, tag_ids: number[] }): Promise<Call> => fetch(`${API_BASE}/calls/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),

  // Task
  getTasks: (): Promise<Task[]> => fetch(`${API_BASE}/tasks/`).then(r => r.json()),
  createTask: (name: string, callId: number): Promise<Task> => fetch(`${API_BASE}/tasks/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, call_id: callId })
  }).then(r => r.json()),
  updateTask: (id: number, data: Partial<Task>): Promise<Task> => fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
};