import axios from 'axios'
import * as FileSystem from 'expo-file-system/legacy'
import { ImgBBConfig } from '../src/imgbb/config'
import { ImageModel } from '../models'

const { ImgbbEndpoint, apiKey } = ImgBBConfig

export const fileUriToBase64 = async (uri: string) => {
	try {
		const base64 = await FileSystem.readAsStringAsync(uri, {
			encoding: FileSystem.EncodingType.Base64,
		})
		return base64
	} catch (error) {
		console.log('Error leyendo archivo:', error)
		throw new Error('No se pudo leer el archivo')
	}
}

export const uploadToImgbb = async (file: string) => {
	if (!file) throw new Error('No se recibió ningún archivo de imagen')

	try {
		const base64 = await fileUriToBase64(file)

		const form = new FormData()
		form.append('key', apiKey)
		form.append('image', base64)

		const response = await axios.post(ImgbbEndpoint, form, {
			headers: { 'Content-Type': 'multipart/form-data' },
		})

		const json = response.data

		if (!response.status || !json?.success) {
			const message = json?.error?.message || 'Error al subir la imagen'
			throw new Error(message)
		}

		if (json?.data) {
			return {
				url: json.data.display_url || json.data.url,
				deleteUrl: json.data.delete_url,
			}
		}

		throw new Error('No se recibió una URL válida desde imgbb')
	} catch (error: any) {
		console.log('Error subiendo imagen a IMGBB:', error?.message || error)
		throw new Error('Fallo al subir la imagen a IMGBB')
	}
}

export async function uploadImages(images: ({ url: string; deleteUrl?: string } | string)[]): Promise<ImageModel[]> {
	if (!images.length) return []

	const imageObjects = images.map((img) => (typeof img === 'string' ? { url: img, deleteUrl: '' } : img))

	const localImages = imageObjects.filter((img) => img.url.startsWith('file://'))

	if (!localImages.length) {
		return imageObjects.map((img) => ({
			url: String(img.url),
			deleteUrl: img.deleteUrl ?? '',
		}))
	}

	const uploaded = await Promise.all(localImages.map((img) => uploadToImgbb(img.url)))

	const updated: ImageModel[] = imageObjects.map((img) => {
		if (img.url.startsWith('file://')) {
			const newImg = uploaded.shift()
			if (newImg) {
				return {
					url: String(newImg.url),
					deleteUrl: newImg.deleteUrl || '',
				}
			}
		}
		return {
			url: String(img.url),
			deleteUrl: img.deleteUrl ?? '',
		}
	})

	return updated
}

export async function deleteImages(deleteUrl: string) {
	if (!deleteUrl) return
	try {
		await axios.get(deleteUrl)
	} catch (error: any) {
		console.log('Error eliminando imagen de IMGBB:', error?.message || error)
	}
}
