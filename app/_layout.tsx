// app/_layout.tsx
// --- Layout principal actualizado para usar Firebase Auth persistente ---
//
// Cambios clave:
// 1️⃣ Se elimina el uso de getUser() (ya no se necesita secure-store).
// 2️⃣ Se usa onAuthStateChanged a través del AuthProvider.
// 3️⃣ Mantiene tu sistema de temas, router y estructura (tabs / auth).
// 4️⃣ El estado de carga inicial lo toma del AuthProvider, no del layout.

import { useContext, useEffect } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { ThemeProvider } from 'styled-components/native'
import { MenuProvider } from 'react-native-popup-menu'
import { ThemeContextProvider, useTheme } from '../context/ThemeContextProvider'
import { AuthContext, AuthProvider } from '../context/AuthContext'
import Loader from '../components/Loader'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

function InnerLayout() {
	const { themes } = useTheme()
	const { state } = useContext(AuthContext)
	const router = useRouter()
	const segments = useSegments()

	useEffect(() => {
		const currentRoot = segments && segments.length > 0 ? segments[0] : null

		if (!state.isLoading) {
			if (state.user) {
				// Usuario logueado
				if (currentRoot !== '(tabs)') router.replace('/(tabs)')
			} else {
				// Usuario no logueado
				if (currentRoot !== '(auth)') router.replace('/(auth)')
			}
		}
	}, [state.user, state.isLoading])

	if (state.isLoading && !state.user) return <Loader visible transparent={true} />

	return (
		<ThemeProvider theme={themes}>
			<MenuProvider>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<Stack screenOptions={{ headerShown: false }}>
						{state.user ? <Stack.Screen name='(tabs)' /> : <Stack.Screen name='(auth)' />}
						<Stack.Screen name='settings' />
					</Stack>
				</GestureHandlerRootView>
			</MenuProvider>
		</ThemeProvider>
	)
}

export default function Layout() {
	return (
		<ThemeContextProvider>
			<AuthProvider>
				<InnerLayout />
			</AuthProvider>
		</ThemeContextProvider>
	)
}
