import NoteForm from '../../components/NoteForm'
import { useNotes } from '../../hooks/useNotes'
import { Note } from '../../models/noteModel'
import { Container } from '../../styled-components/StyledSafeAreaView'
import { Text } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

export default function NewNoteScreen() {
  const { addNote, error } = useNotes()
  const { adress, latitude, longitude } = useLocalSearchParams()

  const handleSubmit = async (
    note: Omit<Note, 'id' | 'creationDate' | 'modificationDate' | 'userId'>
  ) => {
    await addNote(note)
  }

  return (
    <Container>
      <NoteForm
        initialValues={{
          title: '',
          content: '',
          address: adress ? String(adress) : '',
          latitude: latitude ? Number(latitude) : undefined,
          longitude: longitude ? Number(longitude) : undefined,
          images: []
        }}
        onSubmit={handleSubmit}
      />

      {error && <Text style={{ color: 'red' }}>{error}</Text>}
    </Container>
  )
}
