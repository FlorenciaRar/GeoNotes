import { Stack } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import Icon from '../../utils/icons'
import { useTheme } from '../../context/ThemeContextProvider'

export default function SettingsLayout() {
	const { themes } = useTheme()
	return (
		<Stack
			screenOptions={({ navigation }) => ({
				headerShown: true,
				headerTitle: 'Editar nota',
				headerBackButtonDisplayMode: 'default',
				headerStyle: { backgroundColor: themes.colors.surface },
				headerTintColor: themes.colors.onSurface,
				headerLeft: () =>
					navigation.canGoBack() ? (
						<TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel='Volver'>
							<Icon iconName='back' size={22} color={themes.colors.onSurface} />
						</TouchableOpacity>
					) : undefined,
			})}
		/>
	)
}
