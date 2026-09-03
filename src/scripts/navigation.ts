// Toggles the mobile navigation panel and desktop/mobile dropdown submenus.
export function initNavigation(root: HTMLElement): void {
	const toggle = root.querySelector<HTMLButtonElement>('[data-nav-toggle]');
	const panel = root.querySelector<HTMLElement>('[data-nav-panel]');
	const menuIcon = toggle?.querySelector<SVGElement>('[data-nav-icon="menu"]');
	const closeIcon = toggle?.querySelector<SVGElement>('[data-nav-icon="close"]');
	const dropdowns = root.querySelectorAll<HTMLElement>('[data-nav-dropdown]');

	if (!toggle || !panel || !menuIcon || !closeIcon) return;

	const setDropdownOpen = (dropdown: HTMLElement, open: boolean) => {
		const button = dropdown.querySelector<HTMLButtonElement>('[data-nav-dropdown-toggle]');
		const submenu = dropdown.querySelector<HTMLElement>('[data-nav-dropdown-panel]');
		const chevron = dropdown.querySelector<SVGElement>('[data-nav-dropdown-chevron]');
		if (!button || !submenu) return;

		button.setAttribute('aria-expanded', String(open));
		submenu.hidden = !open;
		chevron?.classList.toggle('rotate-180', open);

		const labelOpen = button.dataset.labelOpen;
		const labelClose = button.dataset.labelClose;
		if (labelOpen && labelClose) {
			const itemLabel = button.querySelector('span')?.textContent?.trim() ?? '';
			button.setAttribute('aria-label', `${itemLabel}: ${open ? labelClose : labelOpen}`);
		}
	};

	const closeAllDropdowns = (except?: HTMLElement) => {
		dropdowns.forEach((dropdown) => {
			if (dropdown !== except) setDropdownOpen(dropdown, false);
		});
	};

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
		if (!open) closeAllDropdowns();
	};

	toggle.addEventListener('click', () => {
		setOpen(panel.hidden);
	});

	dropdowns.forEach((dropdown) => {
		const button = dropdown.querySelector<HTMLButtonElement>('[data-nav-dropdown-toggle]');
		if (!button) return;

		button.addEventListener('click', (event) => {
			event.stopPropagation();
			const nextOpen = button.getAttribute('aria-expanded') !== 'true';
			closeAllDropdowns(dropdown);
			setDropdownOpen(dropdown, nextOpen);
		});
	});

	panel.querySelectorAll('a').forEach((link) => {
		link.addEventListener('click', () => setOpen(false));
	});

	root.querySelectorAll<HTMLAnchorElement>('[data-nav-dropdown-panel] a').forEach((link) => {
		link.addEventListener('click', () => closeAllDropdowns());
	});

	document.addEventListener('click', (event) => {
		if (!(event.target instanceof Node) || !root.contains(event.target)) {
			closeAllDropdowns();
			return;
		}

		const clickedDropdown = (event.target as HTMLElement).closest('[data-nav-dropdown]');
		if (!clickedDropdown) closeAllDropdowns();
	});

	window.addEventListener('keydown', (event) => {
		if (event.key !== 'Escape') return;
		if (!panel.hidden) {
			setOpen(false);
			return;
		}
		closeAllDropdowns();
	});
}
