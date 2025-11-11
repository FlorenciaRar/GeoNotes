import { View, StyleSheet, Dimensions } from 'react-native'
import { Link } from 'expo-router'
import QuickAccessItem from '../../components/QuickAccessItem'
import NotesCardContainer from '../../components/NotesCardContainer'
import { useTheme } from '../../context/ThemeContextProvider'
import { StyledText } from '../../styled-components/StyledText'
import { Container } from '../../styled-components/StyledSafeAreaView'
import { DefaultTheme } from 'styled-components/native'
import { useContext, useMemo } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { BackgroundDecor } from '../../components/ui/BackgroundDecor'

const screenWidth = Dimensions.get('window').width
const itemSize = screenWidth / 2 - 24
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
				<>
					<StyledText variant='bold' size='lg' style={{ color: themes.colors.onBackground }}>
						{`Hola ${userName || 'Usuario'}`}
					</StyledText>
					<StyledText size='md' style={{ color: themes.colors.onBackground }}>
						Que haremos hoy?
					</StyledText>
				</>

				<View style={styles.quickGrid}>
					<View style={styles.tileWrap}>
						<QuickAccessItem link='/Notes' iconName='note' name='Todas mis notas' />
					</View>
					<View style={styles.tileWrap}>
						<QuickAccessItem link='/NewNote' iconName='plus' name='Crear nota' />
					</View>
				</View>
				<View>
					<QuickAccessItem link='/Map' iconName='map' name='Ver mapa' />
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
			paddingBottom: themes.spacing.lg,
			gap: themes.spacing.md,
		},

		quickGrid: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			justifyContent: 'space-between',
			rowGap: themes.spacing.xm,
		},
		tileWrap: {
			width: itemSize,
		},

		lastNotesTextContainer: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginTop: themes.spacing.sm,
		},
	})
}
