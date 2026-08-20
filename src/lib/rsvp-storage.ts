import type { RSVPValues } from '../types/wedding'

const STORAGE_KEY = 'nour-hassene:rsvp:v1'
type StoredResponse = RSVPValues & { updatedAt: string; invitationToken?: string }

function readAll(): Record<string, StoredResponse> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Record<string, StoredResponse>
  } catch {
    return {}
  }
}

export function readResponse(token = 'open-invitation') {
  return readAll()[token] ?? null
}

export async function saveResponse(values: RSVPValues, token = 'open-invitation') {
  await new Promise((resolve) => window.setTimeout(resolve, 650))
  const responses = readAll()
  responses[token] = { ...values, updatedAt: new Date().toISOString(), invitationToken: token }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(responses))
  return responses[token]
}
