import * as Location from 'expo-location'
import { Alert } from 'react-native'

export const getLocationPermission = async (): Promise<boolean> => {
	const { status, granted, canAskAgain } = await Location.requestForegroundPermissionsAsync()

	if (status !== 'granted') {
		if (canAskAgain) {
			Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a tu ubicación', [
				{ text: 'Cancelar', style: 'cancel' },
				{
					text: 'Reintentar',
					onPress: () => getLocationPermission(),
				},
			])
		} else {
			Alert.alert('Permiso denegado', 'Habilitalo en configuración', [{ text: 'Cancelar', style: 'cancel' }, { text: 'OK' }])
		}
	}

	return granted
}
