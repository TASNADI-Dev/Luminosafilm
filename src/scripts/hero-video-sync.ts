// Syncs the hero background video with the foreground player's play state and time.
export function initHeroVideoSync(section: HTMLElement): void {
	const main = section.querySelector<HTMLVideoElement>('[data-hero-video-main]');
	const background = section.querySelector<HTMLVideoElement>('[data-hero-video-bg]');
	const toggle = section.querySelector<HTMLButtonElement>('[data-hero-video-toggle]');
	const playIcon = toggle?.querySelector<SVGElement>('[data-hero-video-icon="play"]');
	const pauseIcon = toggle?.querySelector<SVGElement>('[data-hero-video-icon="pause"]');

	if (!main || !background) {
		return;
	}

	const syncTime = () => {
		if (Math.abs(background.currentTime - main.currentTime) > 0.2) {
			background.currentTime = main.currentTime;
		}
	};

	const syncPlayback = () => {
		syncTime();

		if (main.paused) {
			background.pause();
			return;
		}

		void background.play();
	};

	const updateToggle = () => {
		if (!toggle) {
			return;
		}

		const isPaused = main.paused;
		toggle.setAttribute(
			'aria-label',
			isPaused ? (toggle.dataset.labelPlay ?? 'Play video') : (toggle.dataset.labelPause ?? 'Pause video'),
		);
		playIcon?.classList.toggle('hidden', !isPaused);
		pauseIcon?.classList.toggle('hidden', isPaused);
	};

	toggle?.addEventListener('click', () => {
		if (main.paused) {
			void main.play();
			return;
		}

		main.pause();
	});

	main.addEventListener('play', syncPlayback);
	main.addEventListener('pause', syncPlayback);
	main.addEventListener('play', updateToggle);
	main.addEventListener('pause', updateToggle);
	main.addEventListener('timeupdate', syncTime);
	main.addEventListener('seeking', syncTime);

	syncPlayback();
	updateToggle();
}
