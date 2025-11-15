import { useState } from 'react'
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { Icon } from '../utils'
import { StyledText } from '../styled-components'
import useLocationSearch from '../hooks/useLocationSearch'
import { useTheme } from '../context/ThemeContextProvider'
import { DefaultTheme } from 'styled-components/native'

type LocationSearchBarProps = {
	value: string
	onChangeValue?: (text: string) => void
	onSelectLocation: (location: { address: string; latitude: number; longitude: number }) => void
}

export default function LocationSearchBar({ value, onChangeValue, onSelectLocation }: LocationSearchBarProps) {
	const { themes } = useTheme()
	const styles = getStyles(themes)

	const { getCurrentLocation, setSearchText, searchResults, menuShown, setMenuShown, setLocation, searchText, loading } = useLocationSearch()

	const handleSelect = (address: string, lat: number, lon: number) => {
		onChangeValue?.(address)
		setMenuShown(false)
		setLocation({ address, latitude: lat, longitude: lon })
		onSelectLocation({ address, latitude: lat, longitude: lon })
	}

	const EmptySearch = () => {
		if (loading) {
			return (
				<View>
					<ActivityIndicator size='small' color={themes.colors.primary} />
				</View>
			)
		}

		if (searchText.trim().length > 0 && searchResults.length === 0)
			return (
				<StyledText style={styles.menuAddressOption} color='onSurface' size='sm'>
					No se encontraron resultados
				</StyledText>
			)
	}

	return (
		<View>
			<View style={styles.locationInputContainer}>
				<Icon iconName='search' size={20} color={themes.colors.onSurface} />
				<TextInput
					style={styles.locationInput}
					placeholder='Buscar una dirección...'
					placeholderTextColor={themes.colors.onSurfaceVariant}
					value={value}
					onChangeText={(text) => {
						onChangeValue?.(text)
						setSearchText(text)
						setMenuShown(true)
					}}
					onPress={() => setMenuShown(true)}
				/>
				{value.trim().length > 0 && (
					<Pressable
						onPress={() => {
							onChangeValue?.('')
							setSearchText('')
							setLocation(null)
							setMenuShown(false)
						}}
					>
						<Icon iconName='close' size={20} color={themes.colors.onSurface} />
					</Pressable>
				)}
			</View>

			{menuShown && (
				<View style={styles.menuContainer}>
					<Pressable
						onPress={async () => {
							const currentLocation = await getCurrentLocation()
							if (currentLocation) {
								handleSelect(currentLocation.address, currentLocation.latitude, currentLocation.longitude)
							}
						}}
					>
						<StyledText size='xm' color='onSurface'>
							Usar ubicación actual
						</StyledText>
					</Pressable>

					<FlatList
						data={searchResults}
						scrollEnabled={false}
						keyExtractor={(item) => item.place_id}
						ListEmptyComponent={EmptySearch}
						renderItem={({ item }) => (
							<Pressable style={styles.menuAddressOption} onPress={() => handleSelect(item.display_name, parseFloat(item.lat), parseFloat(item.lon))}>
								<StyledText size='xm' color='onSurface' numberOfLines={2}>
									{item.display_name}
								</StyledText>
							</Pressable>
						)}
					/>
				</View>
			)}
		</View>
	)
}

function getStyles(themes: DefaultTheme) {
	return StyleSheet.create({
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
