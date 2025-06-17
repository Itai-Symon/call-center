import type { Tag, Call } from '../types/index'

export const API_BASE = 'http://localhost:8000';

export const api = {
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
  getCalls: (): Promise<Call[]> => fetch(`${API_BASE}/calls/`).then(r => r.json()),
  createCall: (title: string): Promise<Call> => fetch(`${API_BASE}/calls/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, tag_ids: [] })
  }).then(r => r.json()),
};