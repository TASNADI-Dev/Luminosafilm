// Page-load fade-up for hero copy; fades intro blobs after that animation.
import gsap from 'gsap';

const prefersReducedMotion = () =>
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initHomeIntro(): void {
	if (prefersReducedMotion()) {
		return;
	}

	initHeroLoad();
}

function keepViewportAtTop(): void {
	if (window.scrollY > 0 && window.scrollY < 80) {
		window.scrollTo(0, 0);
	}
}

function initHeroLoad(): void {
	const section = document.querySelector<HTMLElement>('[data-hero-section]');
	if (!section) {
		return;
	}

	const copy = section.querySelector<HTMLElement>('[data-hero-copy]');
	const copyItems = section.querySelectorAll<HTMLElement>('[data-hero-copy-item]');
	const media = section.querySelector<HTMLElement>('[data-hero-media]');
	const background = section.querySelector<HTMLElement>('[data-hero-video-bg]');
	const blob = document.querySelector<HTMLElement>('[data-intro-blob]');

	if (!copy && copyItems.length === 0) {
		if (blob) {
			gsap.to(blob, { opacity: 1, duration: 0.9, ease: 'power2.out' });
		}
		return;
	}

	const startedAtTop = window.scrollY < 1;
	const timeline = gsap.timeline({
		defaults: { ease: 'power3.out' },
		onUpdate: startedAtTop ? keepViewportAtTop : undefined,
	});

	if (copyItems.length > 0) {
		timeline.fromTo(
			copyItems,
			{ opacity: 0, y: '2.5rem' },
			{ opacity: 1, y: 0, duration: 0.9, stagger: 0.1 },
		);
	} else if (copy) {
		timeline.fromTo(
			copy,
			{ opacity: 0, y: '2.5rem' },
			{ opacity: 1, y: 0, duration: 0.9 },
		);
	}

	const fadeInPlace = [media, background].filter(
		(element): element is HTMLElement => element !== null,
	);

	if (fadeInPlace.length > 0) {
		timeline.fromTo(
			fadeInPlace,
			{ opacity: 0 },
			{ opacity: 1, duration: 0.9, ease: 'power2.out' },
			'-=0.2',
		);
	}

	if (blob) {
		timeline.to(blob, { opacity: 1, duration: 0.9, ease: 'power2.out' });
	}
}
