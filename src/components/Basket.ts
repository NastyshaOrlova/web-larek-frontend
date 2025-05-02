import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class Basket extends Component<{}> {
	protected listElement: HTMLElement;
	protected totalElement: HTMLElement;
	protected buttonElement: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this.listElement = ensureElement<HTMLElement>(
			'.basket__list',
			this.container
		);
		this.totalElement = ensureElement<HTMLElement>(
			'.basket__price',
			this.container
		);
		this.buttonElement = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);

		this.buttonElement.addEventListener('click', this.checkout.bind(this));
	}

	render(data?: { items?: HTMLElement[]; total?: number }): HTMLElement {
		if (data?.items) {
			this.listElement.innerHTML = '';
			data.items.forEach((element) => {
				this.listElement.append(element);
			});
		}

		if (data?.total !== undefined) {
			this.totalElement.textContent = `${data.total} синапсов`;
			const hasItems = (data?.items || []).length > 0;
			const hasPositiveTotal = (data?.total || 0) > 0;
			this.buttonElement.disabled = !hasItems || !hasPositiveTotal;
		}

		return this.container;
	}

	checkout(): void {
		this.events.emit('basket:checkout');
	}
}
