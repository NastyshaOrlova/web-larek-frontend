import { Product } from './Product';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class BasketItemProduct extends Product {
	protected deleteButtonElement: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		(this.deleteButtonElement = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			this.container
		)),
			this.bindDeleteButton();
	}

	bindDeleteButton(): void {
		this.deleteButtonElement.addEventListener('click', (event) => {
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
