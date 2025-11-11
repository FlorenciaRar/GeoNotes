import axios from 'axios'

const TINYURL_TOKEN = process.env.EXPO_PUBLIC_TINYURL_API_KEY

export async function shortLink(longUrl: string): Promise<string> {
	try {
		const response = await axios.post(
			'https://api.tinyurl.com/create',
			{
				url: longUrl,
				domain: 'tinyurl.com',
			},
			{
				headers: {
					Authorization: `Bearer ${TINYURL_TOKEN}`,
					'Content-Type': 'application/json',
				},
			}
		)

		return response.data?.data?.tiny_url || longUrl
	} catch (error) {
		console.error('Error al acortar enlace con TinyURL API:', error)
		return longUrl
	}
}
