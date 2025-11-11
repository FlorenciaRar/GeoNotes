// app/(tabs)/Notes.tsx
import React, { useMemo } from 'react'
import { View, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useTheme } from '../../context/ThemeContextProvider'
import { DefaultTheme } from 'styled-components/native'
import NotesCardContainer from '../../components/NotesCardContainer'
import { Container } from '../../styled-components/StyledSafeAreaView'

/* Util: aplicar alpha a un color hex (#RRGGBB -> #RRGGBBAA) */
function hexWithAlpha(hex: string, alpha: number) {
	const a = Math.round(alpha * 255)
		.toString(16)
		.padStart(2, '0')
	return hex.length === 7 ? `${hex}${a}` : hex
}

/* Fondo decorativo consistente con Login/Registro/Home */
function BackgroundDecor({ theme }: { theme: DefaultTheme }) {
	const bg = theme.colors.background
	const surf = theme.colors.surface

	return (
		<View style={StyleSheet.absoluteFill}>
			{/* Gradiente base */}
			<LinearGradient colors={[bg, surf]} start={{ x: 0.15, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />

			{/* Blob superior derecho (primary) */}
			<LinearGradient
				colors={[hexWithAlpha(theme.colors.primary, 0.16), hexWithAlpha(theme.colors.primary, 0)]}
				start={{ x: 0.35, y: 0.2 }}
				end={{ x: 1, y: 1 }}
				style={{
					position: 'absolute',
					width: 260,
					height: 260,
					borderRadius: 260,
					right: -70,
					top: -30,
				}}
			/>

			{/* Blob inferior izquierdo (secondary) */}
			<LinearGradient
				colors={[hexWithAlpha(theme.colors.secondary, 0.12), hexWithAlpha(theme.colors.secondary, 0)]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={{
					position: 'absolute',
					width: 320,
					height: 320,
					borderRadius: 320,
					left: -90,
					bottom: -60,
				}}
			/>
		</View>
	)
}

export default function Notes() {
	const { themes } = useTheme()
	const styles = useMemo(() => getStyles(themes), [themes])

	return (
		<Container style={styles.container}>
			<BackgroundDecor theme={themes} />

			{/* Contenido sin paneles: solo padding */}
			<View style={styles.content}>
				<NotesCardContainer />
			</View>
		</Container>
	)
}

function getStyles(theme: DefaultTheme) {
	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.colors.background, // color base detrás del gradiente
			position: 'relative',
		},
		content: {
			flex: 1,
			// paddingHorizontal: theme.spacing.lg,
			// paddingBottom: theme.spacing.lg,
		},
	})
}
