import * as ImagePicker from 'expo-image-picker'
import { Alert } from 'react-native'

export const getCameraPermission = async (): Promise<boolean> => {
	const { status, granted, canAskAgain } = await ImagePicker.requestCameraPermissionsAsync()

	if (status !== 'granted') {
		if (canAskAgain) {
			Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a la camara', [
				{ text: 'Cancelar', style: 'cancel' },
				{
					text: 'Reintentar',
					onPress: () => getCameraPermission(),
				},
			])
		} else {
			Alert.alert('Permiso denegado', 'Habilitalo en configuración', [{ text: 'Cancelar', style: 'cancel' }, { text: 'OK' }])
		}
	}

	return granted
}
