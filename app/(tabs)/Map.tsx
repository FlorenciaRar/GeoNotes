import MapView, { Marker, Callout } from 'react-native-maps'
import { StyleSheet, View, TextInput, Text, Pressable, FlatList } from 'react-native'
import { Note } from '../../models/noteModel'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { useEffect, useRef, useState } from 'react'
import { db } from '../../src/firebase/config'
import * as Location from 'expo-location'
import { router } from 'expo-router'
import { useTheme } from '../../context/ThemeContextProvider'
import { StyledText } from '../../styled-components'
import { Icon } from '../../utils'
import useLocationSearch from '../../hooks/useLocationSearch'

export default function Map() {
	const [notes, setNotes] = useState<Note[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const mapRef = useRef<MapView>(null)
	const { themes } = useTheme()
	const { getCurrentLocation, setSearchText, searchResults, menuShown, setMenuShown, setLocation } = useLocationSearch()
	const [searchTextValue, setSearchTextValue] = useState('')
	const [searchedMarker, setSearchedMarker] = useState<{
		latitude: number
		longitude: number
		address: string
	} | null>(null)

	function mapearDocANota(doc: any): Note {
		const data = doc.data()
		const creation = data.creationDate?.toDate ? data.creationDate.toDate() : new Date(data.creationDate)
		const modification = data.modificationDate?.toDate ? data.modificationDate.toDate() : new Date(data.modificationDate)

		return {
			id: doc.id,
			title: data.title,
			content: data.content,
			address: data.adress,
			latitude: parseFloat(data.latitude),
			longitude: parseFloat(data.longitude),
			creationDate: creation.toISOString(),
			modificationDate: modification.toISOString(),
			userId: data.userId,
			images: data.images,
		}
	}

	useEffect(() => {
		async function cargarNotas() {
			try {
				const q = query(collection(db, 'notas'), orderBy('modificationDate', 'desc'))
				const snap = await getDocs(q)
				const resultado = snap.docs.map((d) => mapearDocANota(d))
				setNotes(resultado)
			} catch (e) {
				console.error('Error al obtener notas:', e)
			} finally {
				setLoading(false)
			}
		}
		cargarNotas()
	}, [])

	useEffect(() => {
		;(async () => {
			const { status } = await Location.requestForegroundPermissionsAsync()
			if (status !== 'granted') return
			const loc = await Location.getCurrentPositionAsync({})
			notes.forEach((note) => {
				const dist = Math.sqrt(Math.pow(note.latitude - loc.coords.latitude, 2) + Math.pow(note.longitude - loc.coords.longitude, 2))
				if (dist < 0.0005) console.log('Cerca de la nota:', note.title)
			})
		})()
	}, [notes])

	if (loading || notes.length === 0) return null
	const first = notes[0]

	return (
		<View style={{ flex: 1 }}>
			<View style={styles.searchContainer}>
				<Icon iconName='search' size={20} color={themes.colors.onSurface} />
				<TextInput
					style={[styles.searchInput, { color: themes.colors.onSurface }]}
					placeholder='Buscar dirección...'
					placeholderTextColor={themes.colors.onSurfaceVariant}
					value={searchTextValue}
					onChangeText={(text) => {
						setSearchTextValue(text)
						setSearchText(text)
						setMenuShown(true)
					}}
				/>
				{searchTextValue.trim().length > 0 && (
					<Pressable
						onPress={() => {
							setSearchTextValue('')
							setSearchText('')
							setMenuShown(false)
							setSearchedMarker(null)
						}}
					>
						<Icon iconName='close' size={20} color={themes.colors.onSurface} />
					</Pressable>
				)}
			</View>

			{menuShown && (
				<View style={styles.menuContainer}>
					<Pressable
						onPress={async () => {
							const current = await getCurrentLocation()
							if (current) {
								mapRef.current?.animateToRegion(
									{
										latitude: current.latitude,
										longitude: current.longitude,
										latitudeDelta: 0.01,
										longitudeDelta: 0.01,
									},
									1000
								)
								setSearchedMarker({
									latitude: current.latitude,
									longitude: current.longitude,
									address: 'Ubicación actual',
								})
							}
							setMenuShown(false)
						}}
					>
						<StyledText size='xm' color='onSurface'>
							Usar ubicación actual
						</StyledText>
					</Pressable>

					<FlatList
						data={searchResults}
						keyExtractor={(item) => item.place_id}
						scrollEnabled={false}
						renderItem={({ item }) => (
							<Pressable
								style={styles.menuOption}
								onPress={() => {
									const latitude = parseFloat(item.lat)
									const longitude = parseFloat(item.lon)
									const address = item.display_name

									setSearchedMarker({ latitude, longitude, address }) // primero guardamos el marker
									setSearchTextValue(address)
									setMenuShown(false)

									requestAnimationFrame(() => {
										mapRef.current?.animateToRegion(
											{
												latitude,
												longitude,
												latitudeDelta: 0.01,
												longitudeDelta: 0.01,
											},
											1000
										)
									})
								}}
							>
								<StyledText size='xm' color='onSurface' numberOfLines={2}>
									{item.display_name}
								</StyledText>
							</Pressable>
						)}
					/>
				</View>
			)}

			<MapView
				ref={mapRef}
				style={styles.map}
				initialRegion={{
					latitude: first.latitude,
					longitude: first.longitude,
					latitudeDelta: 0.01,
					longitudeDelta: 0.01,
				}}
			>
				{notes.map(
					(note) =>
						note.latitude &&
						note.longitude && (
							<Marker
								key={note.id}
								coordinate={{
									latitude: note.latitude,
									longitude: note.longitude,
								}}
							>
								<Callout tooltip onPress={() => router.push(`/notes/${note.id}`)}>
									<View
										style={{
											backgroundColor: '#fff',
											borderRadius: 12,
											paddingVertical: 8,
											paddingHorizontal: 12,
											alignItems: 'center',
											shadowColor: '#000',
											shadowOpacity: 0.3,
											shadowRadius: 3,
											elevation: 4,
										}}
									>
										<Text style={{ fontWeight: '600', marginBottom: 4 }}>{note.title}</Text>
										<Text style={{ color: '#007AFF' }}>→ Ver nota</Text>
									</View>
								</Callout>
							</Marker>
						)
				)}

				{searchedMarker && (
					<Marker
						coordinate={{
							latitude: searchedMarker.latitude,
							longitude: searchedMarker.longitude,
						}}
						pinColor='green'
					>
						<Callout
							onPress={() =>
								router.push({
									pathname: '/NewNote',
									params: {
										adress: searchedMarker.address,
										latitude: searchedMarker.latitude.toString(),
										longitude: searchedMarker.longitude.toString(),
									},
								})
							}
						>
							<View style={styles.callout}>
								<Text style={styles.plus}>＋</Text>
								<Text style={styles.link}>Crear nota</Text>
							</View>
						</Callout>
					</Marker>
				)}
			</MapView>
		</View>
	)
}

const styles = StyleSheet.create({
	map: { flex: 1, width: '100%', height: '100%' },
	callout: { width: 150, height: 300, alignItems: 'center' },
	title: { fontWeight: 'bold', marginBottom: 4 },
	link: { color: 'blue' },
	plus: { fontSize: 24, color: 'green', textAlign: 'center' },
	searchContainer: {
		position: 'absolute',
		top: 40,
		zIndex: 10,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'white',
		borderRadius: 50,
		paddingHorizontal: 16,
		marginHorizontal: 16,
		width: '90%',
		height: 48,
		elevation: 4,
	},
	searchInput: { flex: 1, marginLeft: 8 },
	menuContainer: {
		position: 'absolute',
		top: 100,
		left: 16,
		right: 16,
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 12,
		zIndex: 11,
	},
	menuOption: {
		marginTop: 8,
		paddingTop: 8,
		borderTopWidth: 1,
		borderTopColor: '#ccc',
	},
})
