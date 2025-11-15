import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import * as Notifications from 'expo-notifications'
import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'
import { Note } from '../models/noteModel'
import { useNotes } from '../hooks/useNotes'

const NotificationContext = createContext({
	initialize: async () => {},
})

const LOCATION_TASK = 'background-location-task'

// Estado global real
let notifCount = 0
let pausedUntil: number | null = null

// Task de ubicación en background
TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
	if (error) return;
	const loc = (data as any)?.locations?.[0]?.coords;
	if (!loc) return;
	globalThis.__checkNotesBackground?.(loc);
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
	const { notes } = useNotes()

	const notesRef = useRef<Note[]>([])
	useEffect(() => {
		notesRef.current = notes
	}, [notes])

	// Inicialización
	const initialize = async () => {
		await Notifications.requestPermissionsAsync()
		await Location.requestForegroundPermissionsAsync()
		await Location.requestBackgroundPermissionsAsync()

		Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

		const running = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK)
		if (!running) {
			await Location.startLocationUpdatesAsync(LOCATION_TASK, {
				accuracy: Location.Accuracy.Balanced,
				timeInterval: 30_000,
				distanceInterval: 0,
				foregroundService: {
					notificationTitle: 'Notas',
					notificationBody: 'Buscando notas cercanas',
				},
				pausesUpdatesAutomatically: false,
			})
		}
	}

	// Lógica de notificaciones cercanas
	async function checkNearbyNotesInternal(coords: Location.LocationObjectCoords) {
		const now = Date.now()
		if (pausedUntil && now < pausedUntil) return

		for (const note of notesRef.current) {
			const dist = Math.sqrt(
				Math.pow(note.latitude - coords.latitude, 2) +
				Math.pow(note.longitude - coords.longitude, 2)
			)

			if (dist < 0.001) {
				notifCount++

				if (notifCount <= 3) {
					await Notifications.scheduleNotificationAsync({
						content: {
							title: 'Cerca de nota',
							body: `"${note.title}"`,
						},
						trigger: null,
					})
				}

				if (notifCount === 4) {
					pausedUntil = now + 3600 * 1000
					notifCount = 0

					await Notifications.scheduleNotificationAsync({
						content: {
							title: 'Pausa activada',
							body: 'Notificaciones pausadas por 1 hora',
						},
						trigger: null,
					})
				}
			}
		}
	}

	// Registrar función global
;(globalThis as any).__checkNotesBackground = checkNearbyNotesInternal;


	useEffect(() => {
		initialize()
	}, [])

	return (
		<NotificationContext.Provider value={{ initialize }}>
			{children}
		</NotificationContext.Provider>
	)
}

export const useNotifications = () => useContext(NotificationContext)



/* export function NotificationProvider({ children }: { children: React.ReactNode }) {
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

				if (dist < 0.0009 && !notifiedNotes.includes(note.id)) {
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
 */