// Page-load fade-up for hero copy (home left column, about heading/image).
import gsap from 'gsap';

const prefersReducedMotion = () =>
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initHomeIntro(): void {
	if (prefersReducedMotion()) {
		return;
	}

	initHeroLoad();
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

	if (!copy && copyItems.length === 0) {
		return;
	}

	const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

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
}
