import { View, Image, Pressable, Alert } from 'react-native'
import { Icon } from '../utils'

interface ImageItemProps {
	item: string
	itemSize: number
	onDelete: (uri: string) => void
}

export default function ImageItem({ item, onDelete, itemSize }: ImageItemProps) {
	const handleDelete = () => {
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

	return (
		<View style={{ position: 'relative', marginRight: 8 }}>
			{/* Imagen */}
			<Pressable>
				<Image
					source={{ uri: item }}
					style={{
						width: itemSize,
						height: itemSize,
						marginBottom: 10,
						borderRadius: 8,
					}}
				/>
			</Pressable>

			{/* Botón de eliminar */}
			<Pressable
				onPress={handleDelete}
				style={{
					position: 'absolute',
					top: 4,
					right: 4,
					backgroundColor: 'rgba(0,0,0,0.6)',
					borderRadius: 12,
					padding: 4,
				}}
			>
				<Icon iconName='trash' color='#fff' size={14} />
			</Pressable>
		</View>
	)
}
