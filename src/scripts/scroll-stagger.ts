// Scroll-triggered fade-up stagger for [data-stagger] groups and items.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initScrollStaggers(): void {
	if (prefersReducedMotion()) {
		return;
	}

	document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((group) => {
		if (group.dataset.staggerInit === 'true') {
			return;
		}

		group.dataset.staggerInit = 'true';

		const nested = group.querySelectorAll<HTMLElement>('[data-stagger-item]');
		const items = nested.length > 0 ? nested : [group];

		gsap.fromTo(
			items,
			{ opacity: 0, y: '1.25rem' },
			{
				opacity: 1,
				y: 0,
				duration: 0.6,
				stagger: nested.length > 0 ? 0.1 : 0,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: group,
					start: 'top 90%',
					once: true,
				},
			},
		);
	});
}
