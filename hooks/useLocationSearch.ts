import { useEffect, useState } from 'react'
import axios from 'axios'
import { NoteSchema, NoteFormProps, searchResults, LocationData } from '../models/'
import * as Location from 'expo-location'

export default function useLocationSearch() {
	const [location, setLocation] = useState<LocationData | null>(null)

	const [searchResults, setSearchResults] = useState<searchResults[]>([])
	const [menuShown, setMenuShown] = useState<boolean>(false)
	const [searchText, setSearchText] = useState<string>('')

	const [loading, setLoading] = useState<boolean>(false)

	const getCurrentLocation: () => Promise<LocationData | void> = async () => {
		let { status } = await Location.requestForegroundPermissionsAsync()
		if (status !== 'granted') {
			alert('Permiso de ubicación denegado')
			return
		}

		let location = await Location.getCurrentPositionAsync({})
		const { latitude, longitude } = location.coords

		const [address] = await Location.reverseGeocodeAsync({
			latitude,
			longitude,
		})
		const addressName: string = `${address.street ?? ''} ${address.name ?? ''}, ${address.city ?? ''}, ${address.region ?? ''}, ${address.country ?? ''}`
		const newLocation: LocationData = { address: addressName, latitude, longitude }
		setLocation(newLocation)

		return newLocation
	}

	const fetchAddress = async (): Promise<void> => {
		if (!searchText.trim().length) {
			setLocation(null)
			return
		}

		const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchText)}&format=json&addressdetails=1&limit=3&countrycodes=ar`

		try {
			setLoading(true)
			const { data } = await axios.get(url, {
				headers: {
					'User-Agent': 'tu-app/1.0 (tuemail@dominio.com)',
				},
			})

			setSearchResults(data)
		} catch (err) {
			console.log('Error al obtener dirección:', err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		const timeout = setTimeout(() => {
			fetchAddress()
		}, 1000)
		return () => clearTimeout(timeout)
	}, [searchText])

	return {
		getCurrentLocation,
		location,
		searchText,
		setSearchText,
		searchResults,
		menuShown,
		setMenuShown,
		setLocation,
		loading,
	}
}
