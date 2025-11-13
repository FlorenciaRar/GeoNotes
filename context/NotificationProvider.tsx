import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import * as Notifications from 'expo-notifications'
import * as Location from 'expo-location'
import { Note } from '../models/noteModel'
import { useNotes } from '../hooks/useNotes'

const NotificationContext = createContext({
	initialize: async () => {},
})

export function NotificationProvider({ children }: { children: React.ReactNode }) {
	const [notifiedNotes, setNotifiedNotes] = useState<string[]>([])
	const { notes } = useNotes()

	const notesRef = useRef<Note[]>([])
	useEffect(() => {
		notesRef.current = notes
	}, [notes])

	// Permisos
	const initialize = async () => {
		const { status: notifStatus } = await Notifications.requestPermissionsAsync()
		const { status: locStatus } = await Location.requestForegroundPermissionsAsync()
		if (notifStatus !== 'granted') console.warn('Notificaciones no permitidas')
		if (locStatus !== 'granted') console.warn('Ubicación no permitida')

		Notifications.setNotificationHandler({
			handleNotification: async () => ({
				shouldShowAlert: true,
				shouldPlaySound: true,
				shouldSetBadge: false,
				shouldShowBanner: true,
				shouldShowList: true,
			}),
		})
	}

	// Cerca de notas
	const checkNearbyNotes = async () => {
		try {
			const loc = await Location.getCurrentPositionAsync({
				accuracy: Location.Accuracy.Balanced,
			})

			if (!loc?.coords) return

			for (const note of notesRef.current) {
				const dist = Math.sqrt(Math.pow(note.latitude - loc.coords.latitude, 2) + Math.pow(note.longitude - loc.coords.longitude, 2))

				if (dist < 0.0005 && !notifiedNotes.includes(note.id)) {
					await Notifications.scheduleNotificationAsync({
						content: {
							title: '📍 Estás cerca de una nota',
							body: `Estás cerca de "${note.title}"`,
							data: { noteId: note.id },
						},
						trigger: null,
					})
					setNotifiedNotes((prev) => [...prev, note.id])
				}
			}
		} catch (e) {
			console.log('Error al verificar notas:', e)
		}
	}

	useEffect(() => {
		initialize()
		const interval = setInterval(() => checkNearbyNotes(), 1000 * 30)
		return () => clearInterval(interval)
	}, [])

	return <NotificationContext.Provider value={{ initialize }}>{children}</NotificationContext.Provider>
}

export const useNotifications = () => useContext(NotificationContext)
