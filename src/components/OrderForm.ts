import { Form } from './common/Form';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

interface IOrderFormData {
	payment: string;
	address: string;
}

export class OrderForm extends Form<IOrderFormData> {
	protected elements = {
		address: ensureElement<HTMLInputElement>(
			'[name="address"]',
			this.container
		),
		payment: this.container.querySelectorAll<HTMLInputElement>(
			'.order__buttons button'
		),
	};

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.elements.payment.forEach((button) => {
			button.addEventListener('click', () => {
				this.elements.payment.forEach((btn) =>
					btn.classList.remove('button_alt-active')
				);
				button.classList.add('button_alt-active');
				this.onInputChange('payment', button.name);
			});
		});
	}

	set address(value: string) {
		this.elements.address.value = value;
	}

	set payment(value: string) {
		this.elements.payment.forEach((button) => {
			if (button.name === value) {
				button.classList.add('button_alt-active');
			} else {
				button.classList.remove('button_alt-active');
			}
		});
	}
}
