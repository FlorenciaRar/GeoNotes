import { Note } from './noteModel'

export interface NoteFormProps {
  initialValues?: Partial<Note>
  onSubmit: (
    note: Omit<Note, 'id' | 'creationDate' | 'modificationDate' | 'userId'>
  ) => void
}

export interface searchResults {
  place_id: string
  display_name: string
  lat: string
  lon: string
}

export interface LocationData {
  address: string
  latitude: number
  longitude: number
}
