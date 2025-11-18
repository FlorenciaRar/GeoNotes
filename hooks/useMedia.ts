import * as ImagePicker from 'expo-image-picker'
import { useEffect, useState } from 'react'
import { ImageModel } from '../models'
import { getCameraPermission, getGalleryPermission } from '../utils'
import { Alert } from 'react-native'

export default function useMedia() {
	const [images, setImages] = useState<ImageModel[]>([])

	const pickFromGallery = async () => {
		const galleryPermission = await getGalleryPermission()
		if (galleryPermission) {
			const result = await ImagePicker.launchImageLibraryAsync({
				allowsMultipleSelection: true,
				selectionLimit: 0,
				quality: 0.7,
			})

			if (!result.canceled) {
				setImages((prev) => [
					...prev,
					...result.assets.map((a) => ({
						url: a.uri,
						deleteUrl: '',
					})),
				])
			}
		} else {
			return
		}
	}

	const takePhoto = async () => {
		const cameraPermission = await getCameraPermission()
		if (cameraPermission) {
			const result = await ImagePicker.launchCameraAsync({ quality: 0.7 })

			if (!result.canceled) {
				setImages((prev) => [...prev, { url: result.assets[0].uri, deleteUrl: '' }])
			}
		} else {
			return
		}
	}

	return { images, setImages, pickFromGallery, takePhoto }
}
