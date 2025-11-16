import { useCallback, useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import { addNoteAPI, updateNoteAPI, deleteNoteAPI, getNoteByIdAPI, getNotesAPI, getMoreNotesAPI } from '../services/notesService'
import { ImageModel, Note } from '../models'
import { deleteImages, uploadImages } from '../services/imagesService'

export function useNotes() {
	const user = getAuth().currentUser

	const [notes, setNotes] = useState<Note[]>([])
	const [note, setNote] = useState<Note>()
	const [loading, setLoading] = useState<boolean>(true)
	const [loadingMore, setLoadingMore] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)
	const [lastDoc, setLastDoc] = useState<any>(null)
	const [hasMore, setHasMore] = useState<boolean>(true)

	async function getNotes() {
		if (!user) return

		setLoading(true)
		const unsubscribe = getNotesAPI(
			user.uid,
			10,
			(nuevasNotas: Note[], lastVisible: any) => {
				setNotes(nuevasNotas)
				setLastDoc(lastVisible)
				setHasMore(!!lastVisible)
				setLoading(false)
				setError(null)
			},
			() => {
				setError('Error al obtener notas')
				setLoading(false)
			}
		)

		return () => unsubscribe()
	}

	useEffect(() => {
		getNotes()
	}, [lastDoc])

	const loadMoreNotes = useCallback(async () => {
		if (!user || !lastDoc || loadingMore || !hasMore) return
		setLoadingMore(true)
		try {
			const { notas, lastVisible } = await getMoreNotesAPI(user.uid, lastDoc, 10)
			if (notas.length === 0) {
				setHasMore(false)
				return
			}
			setNotes((prev) => [...prev, ...notas])
			setLastDoc(lastVisible)
			setHasMore(!!lastVisible)
		} catch (err) {
			console.log('Error al cargar más notas:', err)
			setError('Error al cargar más notas')
		} finally {
			setLoadingMore(false)
		}
	}, [user, lastDoc, hasMore, loadingMore])

	async function getNoteById(id: string): Promise<void> {
		try {
			setLoading(true)
			const nota = await getNoteByIdAPI(id)
			if (nota && nota !== undefined) {
				setNote(nota)
			}
			if (nota == undefined) {
				setError('No se encontro la nota')
			}
		} catch (error) {
			console.log(error)
			setError('Error al obtener la nota')
		} finally {
			setLoading(false)
		}
	}

	async function addNote(data: Omit<Note, 'id' | 'creationDate' | 'modificationDate' | 'userId'>): Promise<void> {
		if (!user) {
			setError('Usuario no autenticado')
			return
		}

		try {
			setLoading(true)
			const noteId = await addNoteAPI(user.uid, { ...data, images: [] })

			if (data.images && data.images.length > 0) {
				const uploadedImages = await uploadImages(data.images)
				await updateNoteAPI(noteId, { images: uploadedImages })
			}
		} catch (error) {
			console.log(error)
			setError('Error subiendo la nota')
		} finally {
			setLoading(false)
		}
	}

	async function updateNote(id: string, data: Partial<Note>): Promise<void> {
		if (!user) {
			setError('Usuario no autenticado')
			return
		}

		try {
			setLoading(true)

			const note = await getNoteByIdAPI(id)

			const oldImages = note?.images || []

			let updatedImages = data.images || []

			const deletedImages = oldImages.filter((oldImg) => !updatedImages.some((img) => img.url === oldImg.url))

			if (deletedImages.length > 0) {
				await Promise.all(
					deletedImages.map(async (img) => {
						try {
							await deleteImages(img.deleteUrl)
						} catch (err) {
							console.log('Error:', err)
						}
					})
				)
			}

			const localImages = updatedImages.filter((img: any) => typeof img === 'string' && img.startsWith('file://'))

			const existingImages = updatedImages.filter((img: any) => typeof img === 'object' && img.url)

			let uploadedImages: ImageModel[] = []
			if (localImages.length > 0) {
				uploadedImages = await uploadImages(localImages)
			}

			updatedImages = [...existingImages, ...uploadedImages]

			await updateNoteAPI(id, { ...data, images: updatedImages })
		} catch (error) {
			console.log('Error actualizando nota:', error)
			setError('Error al actualizar nota')
		} finally {
			setLoading(false)
		}
	}

	const deleteNote = async (noteId: string): Promise<void> => {
		try {
			setLoading(true)
			setError(null)

			await deleteNoteAPI(noteId)

			setNotes((prev) => prev.filter((n) => n.id !== noteId))
		} catch (err) {
			console.log('Error:', err)
			setError('Error al borrar la nota')
		} finally {
			setLoading(false)
		}
	}

	return {
		notes,
		note,
		loading,
		error,
		getNoteById,
		addNote,
		updateNote,
		deleteNote,
		loadingMore,
		hasMore,
		loadMoreNotes,
	}
}
