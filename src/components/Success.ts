import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { IOrder } from '../types';

export class Success extends Component<{ order: IOrder; total: number }> {
	protected elements = {
		message: ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		),
		button: ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		),
	};

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this.elements.button.addEventListener(
			'click',
			this.continueHandler.bind(this)
		);
	}

	continueHandler(): void {
		this.events.emit('success:continue');
	}

	render(data: { order?: IOrder; total?: number }): HTMLElement {
		if (data.total !== undefined) {
			this.elements.message.textContent = `Списано ${data.total} синапсов`;
		}
		return this.container;
	}
}
