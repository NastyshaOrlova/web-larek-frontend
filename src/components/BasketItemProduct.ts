import { Product } from './Product';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class BasketItemProduct extends Product {
	protected elements!: {
		title: HTMLElement;
		price: HTMLElement;
		deleteButton: HTMLButtonElement;
	};

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this.elements = {
			...this.elements,
			deleteButton: ensureElement<HTMLButtonElement>(
				'.basket__item-delete',
				this.container
			),
		};

		this.bindDeleteButton();
	}

	bindDeleteButton(): void {
		this.elements.deleteButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.events.emit('basket:remove', { id: this.container.dataset.id });
		});
	}

	render(data: { id: string; title: string; price: number }): HTMLElement {
		this.container.dataset.id = data.id;

		super.render({
			title: data.title,
			price: data.price,
		});

		return this.container;
	}
}
