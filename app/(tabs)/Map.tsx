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
import { useNotes } from '../../hooks/useNotes'

export default function Map() {

	const mapRef = useRef<MapView>(null)
	
	const { themes } = useTheme()
	const { getCurrentLocation, setSearchText, searchResults, menuShown, setMenuShown, setLocation } = useLocationSearch()
	const [searchTextValue, setSearchTextValue] = useState('')
	const [searchedMarker, setSearchedMarker] = useState<{
		latitude: number
		longitude: number
		address: string
	} | null>(null)

	const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [calloutPos, setCalloutPos] = useState<{x:number, y:number} | null>(null);
  const [isFixed, setIsFixed] = useState(false)


	const { notes, loading, error } = useNotes()

const [userLocation, setUserLocation] = useState<{
  latitude: number
  longitude: number
} | null>(null)

const [locationLoaded, setLocationLoaded] = useState(false)

// función para calcular la posición y abrir el callout (usa requestAnimationFrame para asegurar render)
const openSearchedCallout = async () => {
  if (!searchedMarker || !mapRef.current) return

  // le damos una oportunidad al mapa a terminar la animación/paint
  requestAnimationFrame(async () => {
    try {
      const p = await mapRef.current?.pointForCoordinate({
        latitude: searchedMarker.latitude,
        longitude: searchedMarker.longitude,
      })
      if (p) setCalloutPos({ x: p.x, y: p.y })
    } catch (e) {
      console.log('Error calculando punto para searchedMarker', e)
    }
  })
}

useEffect(() => {
  (async () => {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      setLocationLoaded(true)
      return
    }

    const loc = await Location.getCurrentPositionAsync({})
    setUserLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    })
    setLocationLoaded(true)
  })()
}, [])

	if (!locationLoaded) return null
	if (!userLocation) return null
	if (loading) return null
	const first = notes[0]

const initialRegion = notes.length > 0
  ? {
      latitude: Number(notes[0].latitude),
      longitude: Number(notes[0].longitude),
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }
  : {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }

const handleSelectNote = async (note:Note) => {
  setSelectedNote(note);

  const p = await mapRef.current?.pointForCoordinate({
    latitude: note.latitude,
    longitude: note.longitude,
  });

  if (p) {
    setCalloutPos({ x: p.x, y: p.y });
  }
};
	

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
				initialRegion={
				initialRegion
				}
				onRegionChange={() => {
    			setIsFixed(false)
  			}}
				onRegionChangeComplete={() => {
    			setIsFixed(true)
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
								 onPress={() => handleSelectNote(note)}
							>								
								
							</Marker>
							
						)
						
				)}

				{searchedMarker && (
  <Marker
    coordinate={{
      latitude: searchedMarker.latitude,
      longitude: searchedMarker.longitude,
    }}
    pinColor="green"
    onPress={() => {
      // limpiar cualquier selectedNote para que no haya solapamientos
      setSelectedNote(null)
      // calcular y mostrar callout
      openSearchedCallout()
    }}
  />
)}
					

				
				
			</MapView>

			{searchedMarker && calloutPos && (
  <Pressable
    onPress={() =>
      router.push({
        pathname: '/NewNote',
        params: {
          adress: searchedMarker.address,
          latitude: String(searchedMarker.latitude),
          longitude: String(searchedMarker.longitude),
        },
      })
    }
    style={{
      position: 'absolute',
      left: calloutPos.x - 90,
      top: calloutPos.y - 192,
      zIndex: 50,
    }}
  >
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 14,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        maxWidth: 200,
				height: 150,
      }}
    >
      <Text numberOfLines={4} style={{ fontWeight: '600', marginBottom: 10 }}>
        {searchedMarker.address}
      </Text>

      <Text style={{ color: '#007AFF', fontSize: 15 }}>
        ＋ Crear nota
      </Text>
    </View>
  </Pressable>
)}


<Pressable
  onPress={() => {
  if (userLocation) {
    mapRef.current?.animateToRegion(
      {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      800
    )
    setIsFixed(false)
	}
}}

  style={{
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 50,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  }}
>
   <Icon
    iconName={isFixed  ? "gpsFixed" : "gps"}
    size={24}
    color="#000"
  />
</Pressable>

			{selectedNote && calloutPos && (
															<Pressable
														onPress={() => router.push(`/notes/${selectedNote.id}`)}
														style={{
															position: 'absolute',
															top: 95,     
															left: '50%',
															transform: [{ translateX: -90 }],
															justifyContent: 'center',
															alignItems: 'center',
															zIndex: 20,
														}}
													>
														<View
															style={{
																backgroundColor: '#fff',
																borderRadius: 12,
																paddingVertical: 12,
																paddingHorizontal: 12,
																//alignItems: 'center',
																shadowColor: '#000',
																shadowOpacity: 0.3,
																shadowRadius: 3,
																elevation: 4,																
																minWidth: 180,      // fuerza espacio para "Ver nota"
      													maxWidth: 240,      // evita estirarse demasiado
															}}
														>
															<Text style={{ fontWeight: '600', marginBottom: 4 }}>
																{selectedNote.title}
															</Text>
															<Text style={{ color: '#007AFF' }}>
																Ver <Icon iconName='note'/>
															</Text>
														</View>
													</Pressable>
															
														)}
														
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
