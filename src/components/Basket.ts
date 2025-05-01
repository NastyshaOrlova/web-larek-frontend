import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { BasketItemProduct } from './BasketItemProduct';
import { cloneTemplate } from '../utils/utils';
import { IProduct } from '../types';

export class Basket extends Component<{}> {
	protected elements = {
		list: ensureElement<HTMLElement>('.basket__list', this.container),
		total: ensureElement<HTMLElement>('.basket__price', this.container),
		button: ensureElement<HTMLButtonElement>('.basket__button', this.container),
	};

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this.elements.button.addEventListener('click', this.checkout.bind(this));
	}

	renderItems(
		products: IProduct[],
		itemComponentSelector: string
	): HTMLElement[] {
		return products.map((item) => {
			const itemComponent = new BasketItemProduct(
				cloneTemplate(itemComponentSelector),
				this.events
			);
			return itemComponent.render({
				id: item.id,
				title: item.title,
				price: item.price || 0,
			});
		});
	}

	render(data?: {
		products?: IProduct[];
		total?: number;
		itemComponent?: string;
	}): HTMLElement {
		if (data?.products && data?.itemComponent) {
			this.elements.list.innerHTML = '';
			const itemElements = this.renderItems(data.products, data.itemComponent);
			itemElements.forEach((element) => {
				this.elements.list.append(element);
			});
		}

		if (data?.total !== undefined) {
			this.elements.total.textContent = `${data.total} синапсов`;
			const hasItems = (data?.products || []).length > 0;
			const hasPositiveTotal = (data?.total || 0) > 0;
			this.elements.button.disabled = !hasItems || !hasPositiveTotal;
		}

		return this.container;
	}

	checkout(): void {
		this.events.emit('basket:checkout');
	}
}
