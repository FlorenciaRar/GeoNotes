import { View, FlatList, Alert, ActivityIndicator } from 'react-native'
import NoteCardItem from './NoteCardItem'
import { StyledText } from '../styled-components'
import { useNotes } from '../hooks/useNotes'

interface NotesCardContainerProps {
  maxItems?: number
}

export default function NotesCardContainer({
  maxItems,
}: NotesCardContainerProps) {
  const { notes, loading, error, deleteNote } = useNotes()

  // Función para borrar con confirmación
  const handleDelete = (id: string) => {
    Alert.alert(
      'Borrar nota',
      '¿Estás seguro de que querés borrar esta nota?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(id)
            } catch (err) {
              console.error('Error al borrar nota:', err)
              Alert.alert('Error', 'No se pudo borrar la nota')
            }
          },
        },
      ]
    )
  }

  // Limitar la cantidad de notas si se pasa maxItems
  const notesToRender = maxItems ? notes.slice(0, maxItems) : notes

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    )
  }

  if (error) {
    return (
      <View style={{ padding: 20 }}>
        <StyledText>{error}</StyledText>
      </View>
    )
  }

  if (notesToRender.length === 0) {
    return (
      <View style={{ padding: 20 }}>
        <StyledText>No hay notas creadas</StyledText>
      </View>
    )
  }

  return (
    <FlatList
      data={notesToRender}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <NoteCardItem data={item} onDelete={handleDelete} />
      )}
    />
  )
}
