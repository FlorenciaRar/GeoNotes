import { View, StyleSheet, Pressable } from 'react-native'
import { Link } from 'expo-router'
import QuickAccessItem from '../../components/QuickAccessItem'
import NotesCardContainer from '../../components/NotesCardContainer'
import { useTheme } from '../../context/ThemeContextProvider'
import { StyledText } from '../../styled-components/StyledText'
import { Container } from '../../styled-components/StyledSafeAreaView'
import { DefaultTheme } from 'styled-components/native'
import { useContext, useMemo } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { LinearGradient } from 'expo-linear-gradient'

/* — util transparencia — */
function hexWithAlpha(hex: string, alpha: number) {
	const a = Math.round(alpha * 255)
		.toString(16)
		.padStart(2, '0')
	return hex.length === 7 ? `${hex}${a}` : hex
}

/* — fondo decorativo — */
function BackgroundDecor({ theme }: { theme: DefaultTheme }) {
	const bg = theme.colors.background
	const surf = theme.colors.surface
	return (
		<View style={StyleSheet.absoluteFill}>
			<LinearGradient colors={[bg, surf]} start={{ x: 0.15, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
			<LinearGradient
				colors={[hexWithAlpha(theme.colors.primary, 0.16), hexWithAlpha(theme.colors.primary, 0)]}
				start={{ x: 0.4, y: 0.2 }}
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
			<LinearGradient
				colors={[hexWithAlpha(theme.colors.secondary, 0.12), hexWithAlpha(theme.colors.secondary, 0)]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={{
					position: 'absolute',
					width: 300,
					height: 300,
					borderRadius: 300,
					left: -80,
					bottom: -60,
				}}
			/>
		</View>
	)
}

export default function HomeScreen() {
	const { themes } = useTheme()
	const styles = useMemo(() => getStyles(themes), [themes])

	const { state } = useContext(AuthContext)
	const userName = state?.user?.name

	return (
		<Container style={styles.container}>
			{/* Fondo */}
			<BackgroundDecor theme={themes} />

			{/* Contenido */}
			<View style={styles.content}>
				<View>
					<StyledText variant='bold' size='lg' style={{ color: themes.colors.onBackground }}>
						{`Hola ${userName || 'Usuario'}`}
					</StyledText>
					<StyledText size='md' style={{ color: themes.colors.onBackground }}>
						Que haremos hoy?
					</StyledText>
				</View>

				<View style={styles.quickGrid}>
					<View style={styles.tileWrap}>
						<QuickAccessItem link='/Notes' iconName='note' name='Todas mis notas' />
					</View>
					<View style={styles.tileWrap}>
						<QuickAccessItem link='/NewNote' iconName='plus' name='Crear nota' />
					</View>
					<View style={styles.tileWrap}>
						<QuickAccessItem link='/Map' iconName='map' name='Ver mapa' />
					</View>
					<View style={styles.tileWrap}>
						<QuickAccessItem link='/SharedNotes' iconName='profile' name='Compartidas conmigo' />
					</View>
				</View>

				<View style={styles.lastNotesTextContainer}>
					<StyledText variant='bold' size='md' style={{ color: themes.colors.onBackground }}>
						Últimas notas
					</StyledText>
					<Link href='/Notes'>
						<StyledText size='xm' style={{ color: themes.colors.primary }}>
							Ver todo
						</StyledText>
					</Link>
				</View>

				<NotesCardContainer maxItems={3} />
			</View>
		</Container>
	)
}

function getStyles(themes: DefaultTheme) {
	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: themes.colors.background,
			position: 'relative',
		},
		content: {
			flex: 1,
			paddingRight: themes.spacing.lg,
			paddingBottom: themes.spacing.lg,
			gap: themes.spacing.md,
		},

		quickGrid: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			justifyContent: 'space-between',
			rowGap: themes.spacing.md,
		},
		tileWrap: {
			width: '45%',
		},

		lastNotesTextContainer: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginTop: themes.spacing.sm,
		},
	})
}
