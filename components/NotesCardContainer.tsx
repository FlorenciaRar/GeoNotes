import { View, FlatList, Alert, ActivityIndicator, Share } from 'react-native'
import NoteCardItem from './NoteCardItem'
import { StyledText } from '../styled-components'
import { useNotes } from '../hooks/useNotes'
import { useTheme } from '../context/ThemeContextProvider'
import { shortLink } from '../utils'
import * as Linking from 'expo-linking'
import { Note } from '../models'

interface NotesCardContainerProps {
	maxItems?: number
}

export default function NotesCardContainer({ maxItems }: NotesCardContainerProps) {
	const { themes } = useTheme()
	const { notes, loading, error, deleteNote, loadingMore, hasMore, loadMoreNotes } = useNotes()

	const handleDelete = (id: string) => {
		Alert.alert('Borrar nota', '¿Estás seguro de que querés borrar esta nota?', [
			{ text: 'Cancelar', style: 'cancel' },
			{
				text: 'Borrar',
				style: 'destructive',
				onPress: async () => {
					try {
						await deleteNote(id)
					} catch (err) {
						console.log('Error al borrar nota:', err)
						Alert.alert('Error', 'No se pudo borrar la nota')
					}
				},
			},
		])
	}

	const handleShare = async (data: Note) => {
		try {
			const deepLink = Linking.createURL(`/notes/shared/${data.id}`)
			const mapsLink = data.latitude && data.longitude ? `https://www.google.com/maps?q=${data.latitude},${data.longitude}` : ''

			const preview = data.content?.length > 50 ? data.content.substring(0, 50) + '...' : data.content || ''

			const shortDeepLink = await shortLink(deepLink)

			const message = `Ubicación: ${mapsLink || 'No disponible'}
    
  Titulo: ${data.title || 'Sin título'}
    
  Contenido: ${preview}
  
  👉 Ver nota completa: ${shortDeepLink}`

			await Share.share({ message })
		} catch (error) {
			console.log('Error al compartir nota:', error)
		}
	}

	const notesToRender = maxItems ? notes.slice(0, maxItems) : notes

	const EmptySearch = () => {
		if (loading) {
			return (
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<ActivityIndicator size='large' color={themes.colors.primary} />
				</View>
			)
		}

		if (error) {
			return (
				<View style={{ padding: 20 }}>
					<StyledText color='error'>{error}</StyledText>
				</View>
			)
		}

		if (notesToRender.length === 0) {
			return (
				<View style={{ padding: 20, alignItems: 'center' }}>
					<StyledText>No hay notas creadas</StyledText>
				</View>
			)
		}
	}
	return (
		<FlatList
			data={notesToRender}
			keyExtractor={(item) => item.id}
			ListEmptyComponent={EmptySearch}
			onEndReachedThreshold={0.2}
			onEndReached={hasMore ? loadMoreNotes : null}
			ListFooterComponent={loadingMore ? <ActivityIndicator size='small' color={themes.colors.primary} /> : null}
			renderItem={({ item }) => <NoteCardItem data={item} onDelete={handleDelete} onShare={handleShare} />}
		/>
	)
}
