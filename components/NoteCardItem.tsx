// import { View, StyleSheet, TouchableOpacity } from 'react-native'
// import { Note } from '../models/'
// import { Link } from 'expo-router'
// import { StyledText } from '../styled-components/StyledText'
// import NoteCardOptionsMenu from './NoteCardOptions'
// import { useTheme } from '../context/ThemeContextProvider'
// import { DefaultTheme } from 'styled-components/native'

// interface NoteItemProps {
// 	data: Note
// 	onDelete: (id: string) => void
// 	onShare: (data: Note) => void
// }

// export default function NoteCardItem({ data, onDelete, onShare }: NoteItemProps) {
// 	const { themes } = useTheme()
// 	const styles = getStyles(themes)
// 	return (
// 		<View style={styles.noteCardContainer}>
// 			<Link href={`/notes/${data.id}`} asChild>
// 				<TouchableOpacity>
// 					<StyledText size='xm'>{data.creationDate}</StyledText>
// 					<StyledText variant='bold' size='sm' numberOfLines={1}>
// 						{data.title}
// 					</StyledText>
// 					<StyledText size='xm' numberOfLines={1}>
// 						{data.content}
// 					</StyledText>
// 				</TouchableOpacity>
// 			</Link>
// 			<NoteCardOptionsMenu
// 				onDelete={() => {
// 					onDelete(data.id)
// 				}}
// 				onShare={() => {
// 					onShare(data)
// 				}}
// 			/>
// 		</View>
// 	)
// }
// function getStyles(themes: DefaultTheme) {
// 	return StyleSheet.create({
// 		noteCardContainer: {
// 			backgroundColor: themes.colors.surface,
// 			padding: themes.spacing.md,
// 			borderRadius: 16,
// 			marginBottom: 16,
// 			position: 'relative',
// 		},
// 	})
// }

import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, runOnJS } from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { Note } from '../models/'
import { Link } from 'expo-router'
import { StyledText } from '../styled-components/StyledText'
import NoteCardOptionsMenu from './NoteCardOptions'
import { useTheme } from '../context/ThemeContextProvider'
import { DefaultTheme } from 'styled-components/native'

interface NoteItemProps {
	data: Note
	onDelete: (id: string) => void
	onShare: (data: Note) => void
}

export default function NoteCardItem({ data, onDelete, onShare }: NoteItemProps) {
	const { themes } = useTheme()
	const styles = getStyles(themes)

	const translateX = useSharedValue(0)
	const SWIPE_DISTANCE = -80 // cuánto se mueve en la animación de swipe

	const pan = Gesture.Pan()
		.activeOffsetX([-15, 15]) // 🔹 Solo se activa si se mueve más de 15px horizontalmente
		.failOffsetY([-15, 15]) // 🔹 Si el movimiento vertical supera 15px, falla (y deja scrollear)
		.onUpdate((event) => {
			translateX.value = event.translationX
		})
		.onEnd(() => {
			if (Math.abs(translateX.value) > SWIPE_DISTANCE) {
				const direction = translateX.value > 0 ? 1 : -1
				translateX.value = withTiming(direction * SWIPE_DISTANCE, { duration: 150 }, () => {
					translateX.value = withSpring(0)
					runOnJS(onDelete)(data.id)
				})
			} else {
				translateX.value = withSpring(0)
			}
		})

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: translateX.value }],
	}))

	return (
		<GestureDetector gesture={pan}>
			<Animated.View style={[styles.noteCardContainer, animatedStyle]}>
				<Link href={`/notes/${data.id}`} asChild>
					<TouchableOpacity>
						<StyledText size='xm'>{data.creationDate}</StyledText>
						<StyledText variant='bold' size='sm' numberOfLines={1}>
							{data.title}
						</StyledText>
						<StyledText size='xm' numberOfLines={1}>
							{data.content}
						</StyledText>
					</TouchableOpacity>
				</Link>

				<NoteCardOptionsMenu onDelete={() => onDelete(data.id)} onShare={() => onShare(data)} />
			</Animated.View>
		</GestureDetector>
	)
}

function getStyles(themes: DefaultTheme) {
	return StyleSheet.create({
		noteCardContainer: {
			backgroundColor: themes.colors.surface,
			padding: themes.spacing.md,
			borderRadius: 16,
			marginBottom: 16,
			position: 'relative',
			shadowColor: '#000',
			shadowOpacity: 0.05,
			shadowRadius: 4,
			elevation: 2,
		},
	})
}
