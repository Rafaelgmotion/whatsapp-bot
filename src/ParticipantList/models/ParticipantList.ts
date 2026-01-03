export type ParticipantList = {
  present: string[]
  absent: string[]
  groupName: string
  date: string // ISO 8601
  slug?: string
}