import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

export const getNotificationPermission = async (): Promise<boolean> => {
	try {
		const { status: existingStatus } = await Notifications.requestPermissionsAsync()
		let finalStatus = existingStatus
		if (existingStatus !== Notifications.PermissionStatus.GRANTED) {
			const { status } = await Notifications.getPermissionsAsync()
			finalStatus = status
		}

		if (finalStatus !== Notifications.PermissionStatus.GRANTED) {
			return false
		}

		if (Platform.OS === 'android') {
			await Notifications.setNotificationChannelAsync('default', {
				name: 'default',
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: '#FF231F7C',
				sound: 'default',
			})
		}

		return true
	} catch (error) {
		console.error('Error al solicitar permisos de notificaciones:', error)
		return false
	}
}