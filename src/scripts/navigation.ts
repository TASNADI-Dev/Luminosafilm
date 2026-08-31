// Toggles the mobile navigation panel and syncs aria-expanded on the menu button.
export function initNavigation(root: HTMLElement): void {
	const toggle = root.querySelector<HTMLButtonElement>('[data-nav-toggle]');
	const panel = root.querySelector<HTMLElement>('[data-nav-panel]');
	const menuIcon = toggle?.querySelector<SVGElement>('[data-nav-icon="menu"]');
	const closeIcon = toggle?.querySelector<SVGElement>('[data-nav-icon="close"]');

	if (!toggle || !panel || !menuIcon || !closeIcon) return;

	const setOpen = (open: boolean) => {
		toggle.setAttribute('aria-expanded', String(open));
		toggle.setAttribute(
			'aria-label',
			open ? (toggle.dataset.labelClose ?? '') : (toggle.dataset.labelOpen ?? ''),
		);
		menuIcon.classList.toggle('hidden', open);
		closeIcon.classList.toggle('hidden', !open);
		panel.hidden = !open;
		document.body.classList.toggle('overflow-hidden', open);
	};

	toggle.addEventListener('click', () => {
		setOpen(panel.hidden);
	});

	panel.querySelectorAll('a').forEach((link) => {
		link.addEventListener('click', () => setOpen(false));
	});

	window.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && !panel.hidden) setOpen(false);
	});
}
