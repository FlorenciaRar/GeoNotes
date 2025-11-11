import { useLocalSearchParams } from 'expo-router'
import NoteForm from '../../components/NoteForm'
import { Note } from '../../models/noteModel'
import { Container, StyledText } from '../../styled-components'
import { useEffect } from 'react'
import { useNotes } from '../../hooks/useNotes'
import Loader from '../../components/Loader'

export default function EditNote() {
	const { NoteId } = useLocalSearchParams<{ NoteId: string }>()

	const { note, getNoteById, updateNote, loading, error } = useNotes()

	useEffect(() => {
		if (NoteId) getNoteById(NoteId)
	}, [NoteId])

	const handleSubmit = async (updatedNote: Partial<Note>) => {
		await updateNote(NoteId, updatedNote)
	}

	return (
		<Container>
			{loading && <Loader visible />}

			{note && <NoteForm initialValues={note} onSubmit={handleSubmit} />}

			{error && <StyledText color='error'>{error}</StyledText>}
		</Container>
	)
}
