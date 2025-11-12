import { collection, doc, addDoc, updateDoc, deleteDoc, query, orderBy, where, onSnapshot, getDoc, limit, getDocs, startAfter } from 'firebase/firestore'
import { db } from '../src/firebase/config'
import { Note } from '../models'

const notesCollection = collection(db, 'notas')

function mapDocToNote(doc: any): Note {
	const data = doc.data()
	return {
		id: doc.id,
		title: data.title,
		content: data.content,
		address: data.address,
		latitude: data.latitude ?? 0,
		longitude: data.longitude ?? 0,
		creationDate: data.creationDate?.toDate?.()?.toISOString() ?? new Date().toISOString(),
		modificationDate: data.modificationDate?.toDate?.()?.toISOString() ?? new Date().toISOString(),
		images: data.images || [],
		userId: data.userId,
	}
}

// Buscar todas por ususairo con limite
export function getNotesAPI(userId: string, limitCount: number, onSuccess: (notas: Note[], lastVisible: any) => void, onError?: (err: any) => void) {
	const q = query(notesCollection, where('userId', '==', userId), orderBy('creationDate', 'desc'), limit(limitCount))
	return onSnapshot(
		q,
		(snap) => {
			const notas = snap.docs.map(mapDocToNote)
			const lastVisible = snap.docs[snap.docs.length - 1]
			onSuccess(notas, lastVisible)
		},
		(err) => {
			console.log('Error al escuchar notas:', err)
			if (onError) onError(err)
		}
	)
}

// Busca las proximas
export async function getMoreNotesAPI(userId: string, lastDoc: any, limitCount: number): Promise<{ notas: Note[]; lastVisible: any }> {
	const q = query(notesCollection, where('userId', '==', userId), orderBy('creationDate', 'desc'), startAfter(lastDoc), limit(limitCount))

	const snap = await getDocs(q)
	const notas = snap.docs.map(mapDocToNote)
	const lastVisible = snap.docs[snap.docs.length - 1]
	return { notas, lastVisible }
}

// Buscar una
export async function getNoteByIdAPI(id: string): Promise<Note | null> {
	try {
		const docRef = doc(db, 'notas', id)
		const nota = await getDoc(docRef)
		if (!nota.exists()) return null
		return mapDocToNote(nota)
	} catch (err) {
		console.log('Error:', err)
		return null
	}
}

// Crear
export async function addNoteAPI(userId: string, data: Partial<Note>): Promise<string> {
	const docRef = await addDoc(notesCollection, {
		...data,
		userId,
		creationDate: new Date(),
		modificationDate: new Date(),
	})
	return docRef.id
}

// Actualizar
export function updateNoteAPI(id: string, data: Partial<Note>): Promise<void> {
	return updateDoc(doc(db, 'notas', id), {
		...data,
		modificationDate: new Date(),
	})
}

// Borrar
export async function deleteNoteAPI(id: string): Promise<void> {
	await deleteDoc(doc(db, 'notas', id))
}
