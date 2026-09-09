// Controls the hero background video play state and toggle button UI.
export function initHeroVideoSync(section: HTMLElement): void {
	const video = section.querySelector<HTMLVideoElement>('[data-hero-video-bg]');
	const toggle = section.querySelector<HTMLButtonElement>('[data-hero-video-toggle]');
	const playIcon = toggle?.querySelector<SVGElement>('[data-hero-video-icon="play"]');
	const pauseIcon = toggle?.querySelector<SVGElement>('[data-hero-video-icon="pause"]');

	if (!video) {
		return;
	}

	const updateToggle = () => {
		if (!toggle) {
			return;
		}

		const isPaused = video.paused;
		toggle.setAttribute(
			'aria-label',
			isPaused ? (toggle.dataset.labelPlay ?? 'Play video') : (toggle.dataset.labelPause ?? 'Pause video'),
		);
		playIcon?.classList.toggle('hidden', !isPaused);
		pauseIcon?.classList.toggle('hidden', isPaused);
	};

	toggle?.addEventListener('click', () => {
		if (video.paused) {
			void video.play();
			return;
		}

		video.pause();
	});

	video.addEventListener('play', updateToggle);
	video.addEventListener('pause', updateToggle);

	updateToggle();
}
