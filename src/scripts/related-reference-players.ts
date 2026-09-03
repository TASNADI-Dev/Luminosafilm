// Initializes Plyr YouTube players for service page related reference videos.
const PLYR_JS = 'https://cdn.jsdelivr.net/npm/plyr@3.8.4/dist/plyr.min.js';
const PLYR_CSS = 'https://cdn.jsdelivr.net/npm/plyr@3.8.4/dist/plyr.css';

interface PlyrInstance {
	on(event: string, callback: () => void): void;
	pause(): void;
}

type PlyrConstructor = new (
	target: HTMLElement | string,
	options?: Record<string, unknown>,
) => PlyrInstance;

declare global {
	interface Window {
		Plyr?: PlyrConstructor;
	}
}

let plyrAssetsPromise: Promise<PlyrConstructor> | null = null;

function loadStylesheet(href: string): void {
	if (document.querySelector(`link[href="${href}"]`)) {
		return;
	}

	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = href;
	document.head.appendChild(link);
}

function loadScript(src: string): Promise<void> {
	const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
	if (existing) {
		if (window.Plyr) {
			return Promise.resolve();
		}

		return new Promise((resolve, reject) => {
			existing.addEventListener('load', () => resolve(), { once: true });
			existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), {
				once: true,
			});
		});
	}

	return new Promise((resolve, reject) => {
		const script = document.createElement('script');
		script.src = src;
		script.async = true;
		script.onload = () => resolve();
		script.onerror = () => reject(new Error(`Failed to load ${src}`));
		document.head.appendChild(script);
	});
}

function ensurePlyr(): Promise<PlyrConstructor> {
	if (window.Plyr) {
		return Promise.resolve(window.Plyr);
	}

	if (!plyrAssetsPromise) {
		plyrAssetsPromise = (async () => {
			loadStylesheet(PLYR_CSS);
			await loadScript(PLYR_JS);
			if (!window.Plyr) {
				throw new Error('Plyr failed to initialize');
			}
			return window.Plyr;
		})().catch((error) => {
			plyrAssetsPromise = null;
			throw error;
		});
	}

	return plyrAssetsPromise;
}

export async function initRelatedReferencePlayers(
	root: ParentNode = document,
): Promise<void> {
	const targets = root.querySelectorAll<HTMLElement>('[data-plyr-youtube]');
	if (targets.length === 0) {
		return;
	}

	const Plyr = await ensurePlyr();
	const players: PlyrInstance[] = [];

	targets.forEach((element) => {
		if (element.dataset.plyrReady === 'true') {
			return;
		}

		const player = new Plyr(element, {
			controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'fullscreen'],
			youtube: {
				noCookie: true,
				rel: 0,
				showinfo: 0,
				iv_load_policy: 3,
				modestbranding: 1,
			},
		});

		players.push(player);
		element.dataset.plyrReady = 'true';
	});

	players.forEach((player) => {
		player.on('play', () => {
			players.forEach((other) => {
				if (other !== player) {
					other.pause();
				}
			});
		});
	});
}
