// Extracts a YouTube video ID from common watch, short, embed, and youtu.be URLs,
// and builds thumbnail URLs used as embed posters.
export function extractYoutubeId(url: string): string | undefined {
	try {
		const parsed = new URL(url)
		const host = parsed.hostname.replace(/^www\./, '')

		if (host === 'youtu.be') {
			const id = parsed.pathname.split('/').filter(Boolean)[0]
			return id || undefined
		}

		if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
			const watchId = parsed.searchParams.get('v')
			if (watchId) {
				return watchId
			}

			const parts = parsed.pathname.split('/').filter(Boolean)
			if (
				(parts[0] === 'embed' || parts[0] === 'shorts' || parts[0] === 'live') &&
				parts[1]
			) {
				return parts[1]
			}
		}
	} catch {
		return undefined
	}

	return undefined
}

export function youtubeThumbnailUrl(
	youtubeId: string,
	quality: 'maxresdefault' | 'hqdefault' = 'maxresdefault',
): string {
	return `https://i.ytimg.com/vi/${youtubeId}/${quality}.jpg`
}
