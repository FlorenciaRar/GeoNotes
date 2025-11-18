import { useEffect, useRef } from "react"
import * as Notifications from "expo-notifications"
import * as Location from "expo-location"
import * as TaskManager from "expo-task-manager"
import { Alert, Linking, AppState } from "react-native"
import { useNotes } from "../hooks/useNotes"
import { Note } from "../models/noteModel"
import { getNotificationPermission } from "../utils/getNotificationPermission"
import { getLocationPermission } from "./getLocationPermission"

const LOCATION_TASK = "background-location-task"

const perNoteState: Record<
  string,
  { count: number; pausedUntil: number | null }
> = {}

// -------------------------------------------
// PEDIR PERMISOS (centralizado)
// -------------------------------------------
async function requestAllPermissionsOnce() {
  const notifOk = await getNotificationPermission()
  if (!notifOk) {
    Alert.alert(
      "Permisos requeridos",
      "Debes habilitar las notificaciones.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Abrir configuración", onPress: () => Linking.openSettings() },
      ]
    )
    return false
  }

  const locOk = await getLocationPermission()
  if (!locOk) return false

  return true
}

// -------------------------------------------
// INICIALIZAR UBICACIÓN + NOTIFICACIONES
// -------------------------------------------
export async function initializeNotifications() {
  await Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  })

  const fg = await Location.getForegroundPermissionsAsync();

  if (!fg.granted) return false;

  const isActive = AppState.currentState === "active"
  if (!isActive) return false

  const running = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK)

  if (!running) {
    await Location.startLocationUpdatesAsync(LOCATION_TASK, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 30000,
      distanceInterval: 0,
      foregroundService: {
        notificationTitle: "Notas",
        notificationBody: "Buscando notas cercanas",
        killServiceOnDestroy: true,
      },
      pausesUpdatesAutomatically: false,
    })
  }

  return true
}

// -------------------------------------------
// BACKGROUND TASK
// -------------------------------------------
TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
  if (error) return
  const loc = (data as any)?.locations?.[0]?.coords
  if (!loc) return

  ;(globalThis as any).__checkNotesBackground?.(loc)
})

// -------------------------------------------
// COMPONENTE
// -------------------------------------------
export function NotificationManager({
  children,
}: {
  children: React.ReactNode
}) {
  const { notes } = useNotes()
  const notesRef = useRef<Note[]>([])

  useEffect(() => {
    notesRef.current = notes
  }, [notes])

  async function checkNearbyNotesInternal(
    coords: Location.LocationObjectCoords
  ) {
    const now = Date.now()

    for (const note of notesRef.current) {
      const dist =
        Math.sqrt(
          Math.pow(note.latitude - coords.latitude, 2) +
            Math.pow(note.longitude - coords.longitude, 2)
        )

      if (dist < 0.001) {
        if (!perNoteState[note.id]) {
          perNoteState[note.id] = { count: 0, pausedUntil: null }
        }

        const state = perNoteState[note.id]

        if (state.pausedUntil && now < state.pausedUntil) continue

        state.count++

        if (state.count <= 3) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Cerca de nota",
              body: `"${note.title}"`,
            },
            trigger: null,
          })
        }

        if (state.count === 4) {
          state.pausedUntil = now + 3600 * 1000
          state.count = 0

          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Pausa activada",
              body: `"${note.title}" pausada por 1 hora`,
            },
            trigger: null,
          })
        }
      }
    }
  }

  ;(globalThis as any).__checkNotesBackground = checkNearbyNotesInternal

  // Primer run
  useEffect(() => {
    requestAllPermissionsOnce().then(async ok => {
      if (ok) await initializeNotifications()
    })
  }, [])

  // Re-init al volver desde Settings
  useEffect(() => {
    let current = AppState.currentState

    const sub = AppState.addEventListener("change", async next => {
      if (current.match(/inactive|background/) && next === "active") {
        const notif = await getNotificationPermission()
        const loc = await getLocationPermission()
        if (notif && loc) await initializeNotifications()
      }
      current = next
    })

    return () => sub.remove()
  }, [])

  return children
}
