import { useEffect, useState } from 'react'
import axios from 'axios'
import { searchResults, LocationData } from '../models/'
import * as Location from 'expo-location'
import { getLocationPermission } from '../utils'

export default function useLocationSearch() {
	const [hasPermission, setHasPermission] = useState<boolean | null>(null)

	const [location, setLocation] = useState<LocationData | null>(null)

	const [searchResults, setSearchResults] = useState<searchResults[]>([])
	const [menuShown, setMenuShown] = useState<boolean>(false)
	const [searchText, setSearchText] = useState<string>('')

	const [loading, setLoading] = useState<boolean>(false)

	const askPermission = async () => {
		const permission = await getLocationPermission()
		setHasPermission(permission)
	}

	const getCurrentLocation: () => Promise<LocationData | void> = async () => {
		if (hasPermission) {
			setLoading(true)
			let location = await Location.getCurrentPositionAsync({})

			const { latitude, longitude } = location.coords

			const [address] = await Location.reverseGeocodeAsync({
				latitude,
				longitude,
			})
			const addressName: string = `${address.street ?? ''} ${address.name ?? ''}, ${address.city ?? ''}, ${address.region ?? ''}, ${address.country ?? ''}`
			const newLocation: LocationData = { address: addressName, latitude, longitude }

			if (newLocation) {
				setLocation(newLocation)
				setLoading(false)
			}

			return newLocation
		}
	}

	const fetchAddress = async (): Promise<void> => {
		if (searchText.trim().length) {
			setLoading(true)

			const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchText)}&format=json&addressdetails=1&limit=3&countrycodes=ar`

			try {
				const { data } = await axios.get<searchResults[]>(url, {
					headers: {
						'Content-Type': 'application/json',
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
	}

	useEffect(() => {
		const timeout = setTimeout(() => {
			fetchAddress()
		}, 1000)
		return () => clearTimeout(timeout)
	}, [searchText])

	useEffect(() => {
		askPermission()
	}, [])

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
