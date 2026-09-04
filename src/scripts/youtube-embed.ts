// Reveals a YouTube thumbnail skeleton, then fades in the iframe once it has loaded.
const PLACEHOLDER_THUMB_WIDTH = 120;

function revealIframe(root: HTMLElement, iframe: HTMLIFrameElement, skeleton: HTMLElement | null): void {
	iframe.classList.remove('opacity-0', 'pointer-events-none');
	iframe.classList.add('opacity-100');
	skeleton?.classList.add('opacity-0');
	root.setAttribute('aria-busy', 'false');
}

function revealThumbnail(img: HTMLImageElement, shimmer: HTMLElement | null): void {
	img.classList.remove('opacity-0');
	img.classList.add('opacity-100');
	shimmer?.classList.add('hidden');
}

function loadIframe(iframe: HTMLIFrameElement, src: string, onLoad: () => void): void {
	iframe.addEventListener('load', onLoad, { once: true });
	iframe.src = src;
}

export function initYoutubeEmbed(root: HTMLElement): void {
	if (root.dataset.youtubeInit === 'true') {
		return;
	}

	root.dataset.youtubeInit = 'true';

	const iframe = root.querySelector<HTMLIFrameElement>('[data-youtube-iframe]');
	const skeleton = root.querySelector<HTMLElement>('[data-youtube-skeleton]');
	const thumbnail = root.querySelector<HTMLImageElement>('[data-youtube-thumbnail]');
	const shimmer = root.querySelector<HTMLElement>('[data-youtube-shimmer]');
	const src = iframe?.dataset.src;
	const fallbackSrc = thumbnail?.dataset.fallbackSrc;

	if (!iframe || !src) {
		return;
	}

	if (thumbnail) {
		const applyThumbnail = () => {
			if (
				fallbackSrc &&
				thumbnail.dataset.fallbackApplied !== 'true' &&
				thumbnail.naturalWidth <= PLACEHOLDER_THUMB_WIDTH
			) {
				thumbnail.dataset.fallbackApplied = 'true';
				thumbnail.src = fallbackSrc;
				return;
			}

			revealThumbnail(thumbnail, shimmer);
		};

		if (thumbnail.complete && thumbnail.naturalWidth > 0) {
			applyThumbnail();
		} else {
			thumbnail.addEventListener('load', applyThumbnail);
			thumbnail.addEventListener(
				'error',
				() => {
					if (fallbackSrc && thumbnail.dataset.fallbackApplied !== 'true') {
						thumbnail.dataset.fallbackApplied = 'true';
						thumbnail.src = fallbackSrc;
					}
				},
				{ once: true },
			);
		}
	}

	const startIframe = () => {
		if (iframe.getAttribute('src')) {
			return;
		}

		loadIframe(iframe, src, () => revealIframe(root, iframe, skeleton));
	};

	if (root.dataset.youtubeEager === 'true') {
		startIframe();
		return;
	}

	const observer = new IntersectionObserver(
		(entries) => {
			if (!entries.some((entry) => entry.isIntersecting)) {
				return;
			}

			startIframe();
			observer.disconnect();
		},
		{ rootMargin: '200px 0px' },
	);

	observer.observe(root);
}
