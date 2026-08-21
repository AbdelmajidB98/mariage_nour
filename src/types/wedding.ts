export type CustomQuestion = {
  id: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number' | 'email' | 'phone'
  required?: boolean
  options?: string[]
}
export type RSVPConfig = {
  enabled: boolean
  deadline: string | null
  maxGuests: number
  fields: Record<string, boolean>
  menuChoices: string[]
  customQuestions: CustomQuestion[]
}

export type RSVPValues = {
  attendance: 'yes' | 'no'
  firstName: string
  lastName: string
  phone?: string
  email?: string
  accompanied: 'yes' | 'no'
  companionName?: string
  guests: number
  dietaryRestrictions?: string
  message?: string
  transport?: string
  customAnswers?: Record<string, string | string[] | number | boolean | null | undefined>
}
