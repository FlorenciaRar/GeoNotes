import { useLocalSearchParams } from 'expo-router'
import { Dimensions, StyleSheet, View } from 'react-native'
import { useNotes } from '../../../hooks/useNotes'
import { useEffect } from 'react'
import { Container, StyledText } from '../../../styled-components'
import Loader from '../../../components/Loader'
import { FlatList } from 'react-native-gesture-handler'
import { useTheme } from '../../../context/ThemeContextProvider'
import { DefaultTheme } from 'styled-components/native'
import { BackgroundDecor } from '../../../components/ui/BackgroundDecor'
import ImageItem from '../../../components/ImageItem'

export default function SharedNote() {
	const { themes } = useTheme()
	const styles = getStyles(themes)

	const { SharedNote } = useLocalSearchParams<{ SharedNote: string }>()
	const { note, getNoteById, loading, error } = useNotes()

	const screenWidth = Dimensions.get('window').width
	const itemSize = screenWidth / 3 - 20

	useEffect(() => {
		if (SharedNote) getNoteById(SharedNote)
	}, [SharedNote])

	return (
		<>
			<Container>
				<BackgroundDecor theme={themes} />

				{loading && <Loader visible />}

				{note && (
					<>
						<View style={styles.field}>
							<StyledText color='onSurface' size='xm'>
								Ubicación
							</StyledText>
							<StyledText>{note.address}</StyledText>
						</View>

						<View style={styles.field}>
							<StyledText color='onSurface' size='xm'>
								Título
							</StyledText>
							<StyledText>{note.title}</StyledText>
						</View>

						<View style={styles.field}>
							<StyledText color='onSurface' size='xm'>
								Contenido
							</StyledText>
							<StyledText>{note.content}</StyledText>
						</View>

						{note.images && note.images.length > 0 && (
							<View style={styles.field}>
								<StyledText color='onSurface' size='xm'>
									Imágenes
								</StyledText>
								<FlatList
									data={note.images}
									numColumns={3}
									scrollEnabled={false}
									keyExtractor={(item, index) => `${item}-${index}`}
									renderItem={({ item }) => <ImageItem item={typeof item === 'string' ? item : item.url} itemSize={itemSize} showDelete={false} />}
								/>
							</View>
						)}
					</>
				)}
				{error && <StyledText color='error'>{error}</StyledText>}
			</Container>
		</>
	)
}

function getStyles(themes: DefaultTheme) {
	return StyleSheet.create({
		field: {
			marginBottom: themes.spacing.md,
			gap: themes.spacing.xm,
		},
	})
}
