// Syncs the hero background video with the foreground player's play state and time.
export function initHeroVideoSync(section: HTMLElement): void {
	const main = section.querySelector<HTMLVideoElement>('[data-hero-video-main]');
	const background = section.querySelector<HTMLVideoElement>('[data-hero-video-bg]');

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

	main.addEventListener('play', syncPlayback);
	main.addEventListener('pause', syncPlayback);
	main.addEventListener('timeupdate', syncTime);
	main.addEventListener('seeking', syncTime);

	syncPlayback();
}
