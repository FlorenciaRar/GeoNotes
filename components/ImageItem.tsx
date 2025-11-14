import { useState } from 'react'
import { View, Pressable, Image, Modal, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native'
import { Icon } from '../utils'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import { FadeIn, FadeOut } from 'react-native-reanimated'

interface ImageItemProps {
	item: string
	itemSize: number
	onDelete?: (uri: string) => void
	showDelete?: boolean
}

const { width, height } = Dimensions.get('window')

export default function ImageItem({ item, onDelete, itemSize, showDelete = true }: ImageItemProps) {
	const [visible, setVisible] = useState(false)

	const scale = useSharedValue(1)
	const savedScale = useSharedValue(1)
	const translateX = useSharedValue(0)
	const translateY = useSharedValue(0)
	const savedTranslateX = useSharedValue(0)
	const savedTranslateY = useSharedValue(0)

	const handleDelete = () => {
		if (onDelete) {
			Alert.alert(
				'Eliminar imagen',
				'¿Querés eliminar esta imagen?',
				[
					{ text: 'Cancelar', style: 'cancel' },
					{
						text: 'Eliminar',
						style: 'destructive',
						onPress: () => onDelete(item),
					},
				],
				{ cancelable: true }
			)
		}
	}

	const pinchGesture = Gesture.Pinch()
		.onStart(() => {
			savedScale.value = scale.value
		})
		.onUpdate((event) => {
			const newScale = savedScale.value * event.scale
			scale.value = Math.min(Math.max(newScale, 1), 3)
		})
		.onEnd(() => {
			scale.value = withTiming(1, { duration: 200 })
			translateX.value = withTiming(0, { duration: 200 })
			translateY.value = withTiming(0, { duration: 200 })
		})

	const panGesture = Gesture.Pan()
		.onStart(() => {
			savedTranslateX.value = translateX.value
			savedTranslateY.value = translateY.value
		})
		.onUpdate((event) => {
			translateX.value = savedTranslateX.value + event.translationX
			translateY.value = savedTranslateY.value + event.translationY
		})
		.onEnd(() => {
			if (scale.value === 1) {
				translateX.value = withTiming(0, { duration: 200 })
				translateY.value = withTiming(0, { duration: 200 })
			}
		})

	const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture)

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }, { translateX: translateX.value }, { translateY: translateY.value }],
	}))

	return (
		<>
			{/* miniatura */}
			<View style={{ position: 'relative', marginRight: 8 }}>
				<Pressable onPress={() => setVisible(true)}>
					<Image
						source={{ uri: item }}
						style={{
							width: itemSize,
							height: itemSize,
							borderRadius: 8,
							resizeMode: 'cover',
						}}
					/>
				</Pressable>

				{/* eliminar miniatura */}
				{showDelete && (
					<Pressable onPress={handleDelete} style={styles.deleteButtonSmall}>
						<Icon iconName='trash' color='#fff' size={14} />
					</Pressable>
				)}
			</View>

			{/* lightbox */}
			<Modal visible={visible} transparent animationType='fade'>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(150)} style={styles.lightboxContainer}>
						<Pressable style={StyleSheet.absoluteFill} onPress={() => setVisible(false)} />

						<GestureDetector gesture={composedGesture}>
							<Animated.Image source={{ uri: item }} style={[styles.fullImage, animatedStyle]} />
						</GestureDetector>

						{/* cerrar */}
						<TouchableOpacity style={[styles.iconButton, { top: 40, right: 20 }]} onPress={() => setVisible(false)}>
							<Icon iconName='close' color='#fff' size={22} />
						</TouchableOpacity>
					</Animated.View>
				</GestureHandlerRootView>
			</Modal>
		</>
	)
}

const styles = StyleSheet.create({
	deleteButtonSmall: {
		position: 'absolute',
		top: 4,
		right: 4,
		backgroundColor: 'rgba(0,0,0,0.6)',
		borderRadius: 12,
		padding: 4,
	},
	lightboxContainer: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.9)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	fullImage: {
		width: width * 0.9,
		height: height * 0.6,
		resizeMode: 'contain',
		borderRadius: 12,
	},
	iconButton: {
		position: 'absolute',
		backgroundColor: 'rgba(0,0,0,0.5)',
		padding: 8,
		borderRadius: 20,
	},
})
