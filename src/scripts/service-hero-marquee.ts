// Clones the service-hero image set until it fills the viewport so the marquee has no trailing gap.
const BASE_DURATION_SECONDS = 60;

export function initServiceHeroMarquee(): void {
	document.querySelectorAll<HTMLElement>('[data-service-hero-marquee]').forEach(setupMarquee);
}

function setupMarquee(root: HTMLElement): void {
	const track = root.querySelector<HTMLElement>('.service-hero-marquee-track');
	const sets = [...root.querySelectorAll<HTMLElement>('[data-marquee-set]')];
	if (!track || sets.length < 2) {
		return;
	}

	const originals = sets.map((set) => [...set.children] as HTMLElement[]);
	if (originals.some((items) => items.length === 0)) {
		return;
	}

	const sourceWidth = sets[0].scrollWidth;

	const fill = () => {
		const targetWidth = root.clientWidth;
		if (targetWidth === 0) {
			return;
		}

		sets.forEach((set, setIndex) => {
			const sourceItems = originals[setIndex];
			let guard = 0;
			while (set.scrollWidth < targetWidth && guard < 24) {
				sourceItems.forEach((item) => {
					const clone = item.cloneNode(true) as HTMLElement;
					clone.setAttribute('aria-hidden', 'true');
					const img = clone.querySelector('img');
					if (img instanceof HTMLImageElement) {
						img.alt = '';
						img.loading = 'lazy';
					}
					set.appendChild(clone);
				});
				guard += 1;
			}
		});

		if (sourceWidth > 0) {
			const repeats = Math.max(1, Math.round(sets[0].scrollWidth / sourceWidth));
			track.style.setProperty('--marquee-duration', `${repeats * BASE_DURATION_SECONDS}s`);
		}
	};

	fill();
	new ResizeObserver(fill).observe(root);
}
