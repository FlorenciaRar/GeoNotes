import { Note } from '../models'

export function mapearDocANota(doc: any): Note {
  const data = doc.data()
  const creation = data.creationDate?.toDate
    ? data.creationDate.toDate()
    : new Date(data.creationDate)
  const modification = data.modificationDate?.toDate
    ? data.modificationDate.toDate()
    : new Date(data.modificationDate)

  return {
    id: doc.id,
    title: data.title || '',
    content: data.content || '',
    address: data.address,
    latitude: data.latitude || null,
    longitude: data.longitude || null,
    creationDate: creation.toISOString(),
    modificationDate: modification.toISOString(),
    userId: data.userId,
  }
}
