import * as ImagePicker from 'expo-image-picker'
import { Alert } from 'react-native'

export const getGalleryPermission = async (): Promise<boolean> => {
	const { status, granted, canAskAgain } = await ImagePicker.requestMediaLibraryPermissionsAsync()

	if (status !== 'granted') {
		if (!canAskAgain) {
			Alert.alert('Permiso denegado', 'Habilitalo en configuración', [{ text: 'Cancelar', style: 'cancel' }, { text: 'OK' }])
		}

		Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a la galeria', [
			{ text: 'Cancelar', style: 'cancel' },
			{
				text: 'Reintentar',
				onPress: () => getGalleryPermission(),
			},
		])
	}

	return granted
}
