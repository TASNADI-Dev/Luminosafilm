// Submits the contact form to FormSubmit via AJAX and shows inline status messages.
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/madacsi.peter.98@gmail.com';

interface FormSubmitResponse {
	success?: string | boolean;
	message?: string;
}

function isValidEmail(value: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function setFieldError(
	field: HTMLElement | null,
	message: string | null,
): void {
	if (!field) return;

	const error = field.querySelector<HTMLElement>('[data-contact-field-error]');
	if (!error) return;

	if (message) {
		error.textContent = message;
		error.hidden = false;
		field.querySelector<HTMLElement>('input, textarea')?.setAttribute('aria-invalid', 'true');
		return;
	}

	error.textContent = '';
	error.hidden = true;
	field.querySelector<HTMLElement>('input, textarea')?.removeAttribute('aria-invalid');
}

function setStatus(
	status: HTMLElement | null,
	message: string,
	variant: 'success' | 'error',
): void {
	if (!status) return;

	status.textContent = message;
	status.dataset.variant = variant;
	status.hidden = false;
}

function clearStatus(status: HTMLElement | null): void {
	if (!status) return;

	status.textContent = '';
	status.hidden = true;
	delete status.dataset.variant;
}

export function initContactForm(root: HTMLFormElement): void {
	const status = root.querySelector<HTMLElement>('[data-contact-form-status]');
	const submitButton = root.querySelector<HTMLButtonElement>('button[type="submit"]');
	const submitLabel = submitButton?.querySelector<HTMLElement>('[data-contact-form-submit-label]');
	const defaultSubmitText = submitLabel?.textContent ?? '';
	const submittingText = root.dataset.submittingText ?? 'Sending…';

	const fields = {
		name: root.querySelector<HTMLElement>('[data-contact-field="name"]'),
		email: root.querySelector<HTMLElement>('[data-contact-field="email"]'),
		message: root.querySelector<HTMLElement>('[data-contact-field="message"]'),
	};

	const getInputValue = (fieldName: keyof typeof fields): string => {
		const input = fields[fieldName]?.querySelector<HTMLInputElement | HTMLTextAreaElement>(
			'input, textarea',
		);
		return input?.value.trim() ?? '';
	};

	const validate = (): boolean => {
		clearStatus(status);
		let valid = true;

		const name = getInputValue('name');
		const email = getInputValue('email');
		const message = getInputValue('message');

		if (!name) {
			setFieldError(fields.name, root.dataset.errorNameRequired ?? 'Required');
			valid = false;
		} else {
			setFieldError(fields.name, null);
		}

		if (!email) {
			setFieldError(fields.email, root.dataset.errorEmailRequired ?? 'Required');
			valid = false;
		} else if (!isValidEmail(email)) {
			setFieldError(fields.email, root.dataset.errorEmailInvalid ?? 'Invalid email');
			valid = false;
		} else {
			setFieldError(fields.email, null);
		}

		if (!message) {
			setFieldError(fields.message, root.dataset.errorMessageRequired ?? 'Required');
			valid = false;
		} else {
			setFieldError(fields.message, null);
		}

		return valid;
	};

	const setSubmitting = (submitting: boolean) => {
		if (!submitButton) return;

		submitButton.disabled = submitting;
		if (submitLabel) {
			submitLabel.textContent = submitting ? submittingText : defaultSubmitText;
		}
	};

	root.addEventListener('submit', async (event) => {
		event.preventDefault();

		if (!validate()) return;

		setSubmitting(true);
		clearStatus(status);

		const payload = {
			name: getInputValue('name'),
			email: getInputValue('email'),
			message: getInputValue('message'),
			_subject: root.dataset.subject ?? 'Contact form',
			_captcha: 'false',
		};

		try {
			const response = await fetch(FORM_ENDPOINT, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify(payload),
			});

			const data = (await response.json()) as FormSubmitResponse;
			const succeeded =
				response.ok && (data.success === true || data.success === 'true');

			if (succeeded) {
				root.reset();
				setFieldError(fields.name, null);
				setFieldError(fields.email, null);
				setFieldError(fields.message, null);
				setStatus(status, root.dataset.successText ?? 'Success', 'success');
				return;
			}

			setStatus(
				status,
				data.message ?? root.dataset.errorText ?? 'Error',
				'error',
			);
		} catch {
			setStatus(status, root.dataset.errorText ?? 'Error', 'error');
		} finally {
			setSubmitting(false);
		}
	});
}
