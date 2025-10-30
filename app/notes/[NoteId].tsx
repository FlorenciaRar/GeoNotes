import { ActivityIndicator, Text } from 'react-native'
import { Stack, useLocalSearchParams } from 'expo-router'
import NoteForm from '../../components/NoteForm'
import { Note } from '../../models/noteModel'
import { Container, StyledText } from '../../styled-components'
import { useTheme } from '../../context/ThemeContextProvider'
// import { initialNotes } from "../../mocks/notes";
import { useEffect, useState } from 'react'
import { useNotes } from '../../hooks/useNotes'

export default function EditNote() {
	const { NoteId } = useLocalSearchParams<{ NoteId: string }>()

	const { getNoteById, loading, error } = useNotes()
	const [note, setNote] = useState<Note | null>(null)

	async function buscarNota() {
		const nota = await getNoteById(NoteId)
		setNote(nota)
	}

	useEffect(() => {
		buscarNota()
	}, [NoteId])

	const handleSubmit = async (updatedNote: Partial<Note>) => {
		console.log(updatedNote)
	}

	if (loading) return <ActivityIndicator size='large' />
	if (error) return <StyledText>{error}</StyledText>
	if (!note) return <StyledText>Nota no encontrada</StyledText>

	return (
		<Container>
			{/* <Stack.Screen
				options={{
					title: note.title,
					headerShown: true,
					headerStyle: { backgroundColor: themes.colors.surface },
					headerTintColor: themes.colors.onSurface,
					headerBackButtonDisplayMode: 'default',
				}}
			/> */}
			<NoteForm initialValues={note} onSubmit={handleSubmit} />
		</Container>
	)
}
