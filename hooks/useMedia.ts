import * as ImagePicker from 'expo-image-picker'
import { useEffect, useState } from 'react'
import { ImageModel } from '../models'
import { getCameraPermission, getGalleryPermission } from '../utils'

export default function useMedia() {
	const [hasGalleryPermission, setHasGalleryPermission] = useState<boolean | null>(null)
	const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null)

	const [images, setImages] = useState<ImageModel[]>([])

	const askGalleryPermission = async () => {
		const permission = await getGalleryPermission()
		setHasGalleryPermission(permission)
	}

	const askCameraPermission = async () => {
		const permission = await getCameraPermission()
		setHasCameraPermission(permission)
	}

	const pickFromGallery = async () => {
		if (hasGalleryPermission) {
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
		}
	}

	const takePhoto = async () => {
		if (hasCameraPermission) {
			const result = await ImagePicker.launchCameraAsync({ quality: 0.7 })

			if (!result.canceled) {
				setImages((prev) => [...prev, { url: result.assets[0].uri, deleteUrl: '' }])
			}
		}
	}

	useEffect(() => {
		askGalleryPermission()
		askCameraPermission()
	}, [])

	return { images, setImages, pickFromGallery, takePhoto }
}
