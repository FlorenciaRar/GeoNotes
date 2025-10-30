import { useState } from 'react'
import { View, TextInput, Text, StyleSheet, Pressable, FlatList, Image, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { Formik } from 'formik'
import * as ImagePicker from 'expo-image-picker'
import { Stack, useRouter } from 'expo-router'
import { NoteSchema, NoteFormProps } from '../models/'
import { useTheme } from '../context/ThemeContextProvider'
import { DefaultTheme } from 'styled-components/native'
import { StyledText } from '../styled-components'
import { Icon } from '../utils'
import MediaOptionsMenu from './mediaOptions'
import useLocationSearch from '../hooks/useLocationSearch'
import LocationSearchBar from './LocationSearchBar'

export default function NoteForm({ initialValues, onSubmit }: NoteFormProps) {
	const { themes } = useTheme()
	const styles = getStyles(themes)
	// const router = useRouter()

	const { getCurrentLocation, location, setSearchText, searchResults, menuShown, setMenuShown, setLocation } = useLocationSearch()

	// Esto tiene que pasar a hook
	const [images, setImages] = useState<string[]>([])

	const pickImage: () => Promise<void> = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: false,
			allowsMultipleSelection: true,
			quality: 0.7,
		})

		if (!result.canceled) {
			setImages([...images, result.assets[0].uri])
		}
	}

	return (
		<Formik
			initialValues={{
				title: initialValues?.title ?? '',
				content: initialValues?.content ?? '',
				address: initialValues?.address ?? '',
				latitude: initialValues?.latitude ?? null,
				longitude: initialValues?.longitude ?? null,
			}}
			validationSchema={NoteSchema}
			onSubmit={(values, { resetForm }) => {
				onSubmit({
					title: values.title,
					content: values.content,
					address: values.address,
					latitude: values.latitude ?? 0,
					longitude: values.longitude ?? 0,
				})
				resetForm()
				// router.push('/')
			}}
		>
			{({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, isSubmitting }) => (
				<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
					<TouchableWithoutFeedback
						onPress={() => {
							Keyboard.dismiss
						}}
						accessible={false}
					>
						<ScrollView contentContainerStyle={{ paddingBottom: 50 }} keyboardShouldPersistTaps='handled'>
							<View style={{ gap: 8 }}>
								<Stack.Screen
									options={{
										headerRight: () => (
											<View style={{ flexDirection: 'row', gap: 8, marginRight: 8 }}>
												<MediaOptionsMenu pickImage={pickImage} />
												<Pressable onPress={() => handleSubmit()} disabled={isSubmitting}>
													<Icon iconName='save' color={themes.colors.onSurface} />
												</Pressable>
											</View>
										),
									}}
								/>

								<LocationSearchBar
									initialValue={values.address}
									onSelectLocation={({ address, latitude, longitude }) => {
										setFieldValue('address', address)
										setFieldValue('latitude', latitude)
										setFieldValue('longitude', longitude)
									}}
								/>

								<TextInput placeholder='Título' placeholderTextColor={themes.colors.onSurfaceVariant} style={[styles.input, { fontSize: 20 }]} value={values.title} onChangeText={handleChange('title')} onBlur={handleBlur('title')} />
								{touched.title && errors.title && <Text style={styles.error}>{errors.title}</Text>}

								<TextInput placeholder='Contenido' placeholderTextColor={themes.colors.onSurfaceVariant} style={styles.input} value={values.content} onChangeText={handleChange('content')} onBlur={handleBlur('content')} multiline />
								{touched.content && errors.content && <Text style={styles.error}>{errors.content}</Text>}

								{images.length > 0 && (
									<View>
										<StyledText>Imágenes</StyledText>
										<FlatList
											data={images}
											scrollEnabled={false}
											horizontal
											keyExtractor={(index) => index}
											renderItem={({ item }) => (
												<Image
													source={{ uri: item }}
													style={{
														width: 100,
														height: 100,
														borderRadius: 8,
														marginRight: 8,
													}}
												/>
											)}
										/>
									</View>
								)}
							</View>
						</ScrollView>
					</TouchableWithoutFeedback>
				</KeyboardAvoidingView>
			)}
		</Formik>
	)
}

function getStyles(themes: DefaultTheme) {
	return StyleSheet.create({
		input: {
			color: themes.colors.onBackground,
			borderWidth: 0,
			paddingVertical: 8,
			paddingHorizontal: 0,
			fontSize: themes.fontSizes.sm,
		},
		locationInputContainer: {
			backgroundColor: themes.colors.surface,
			borderRadius: 60,
			paddingHorizontal: themes.spacing.lg,
			flexDirection: 'row',
			alignItems: 'center',
		},
		locationInput: {
			marginLeft: themes.spacing.sm,
			color: themes.colors.onSurface,
			flex: 1,
		},
		error: {
			color: themes.colors.error,
			fontSize: themes.fontSizes.xm,
			marginTop: 0,
			marginBottom: 8,
		},
		menuContainer: {
			position: 'absolute',
			maxHeight: 400,
			width: '100%',
			top: 52,
			zIndex: 1,
			backgroundColor: themes.colors.surface,
			padding: themes.spacing.md,
			borderRadius: 16,
		},
		menuAddressOption: {
			marginTop: themes.spacing.md,
			paddingTop: themes.spacing.md,
			borderTopWidth: 1,
			borderTopColor: themes.colors.outline,
		},
	})
}
