import { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import { addNoteAPI, updateNoteAPI, deleteNoteAPI, getNoteByIdAPI, getNotesAPI } from '../services/notesServices'
import { Note } from '../models'

export function useNotes() {
	const user = getAuth().currentUser

	const [notes, setNotes] = useState<Note[]>([])
	const [loading, setLoading] = useState<Boolean>(true)
	const [error, setError] = useState<any>(null)

	useEffect(() => {
		if (!user) {
			return
		}

		const unsubscribe = getNotesAPI(
			user.uid,

			// onSuccess
			(nuevasNotas: Note[]) => {
				setNotes(nuevasNotas)
				setLoading(false)
				setError(null)
			},
			// onError
			() => {
				setError('Error al obtener notas')
				setLoading(false)
			}
		)

		return () => unsubscribe()
	}, [])

	async function getNoteById(id: string): Promise<Note | null> {
		try {
			setLoading(true)
			const nota = await getNoteByIdAPI(id)
			return nota
		} catch {
			setError('Error al obtener la nota')
			return null
		} finally {
			setLoading(false)
		}
	}

	async function addNote(data: Partial<Note>) {
		if (!user) {
			setError('Usuario no autenticado')
			return
		}
		try {
			setLoading(true)
			await addNoteAPI(user.uid, data)
		} catch {
			setError('Error al crear nota')
		} finally {
			setLoading(false)
		}
	}

	async function updateNote(id: string, data: Partial<Note>) {
		try {
			await updateNoteAPI(id, data)
		} catch {
			setError('Error al actualizar nota')
		}
	}

	async function deleteNote(id: string) {
		try {
			await deleteNoteAPI(id)
		} catch {
			setError('Error al eliminar nota')
		}
	}

	return {
		notes,
		loading,
		error,
		getNoteById,
		addNote,
		updateNote,
		deleteNote,
	}
}
