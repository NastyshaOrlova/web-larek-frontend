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

	render(data?: { items?: IProduct[]; total?: number }): HTMLElement {
		if (data?.items) {
			this.elements.list.innerHTML = '';
			data.items.forEach((item) => {
				const basketItemTemplate = '#card-basket';
				const basketItem = new BasketItemProduct(
					cloneTemplate(basketItemTemplate),
					this.events
				);

				const element = basketItem.render({
					id: item.id,
					title: item.title,
					price: item.price || 0,
				});

				this.elements.list.append(element);
			});
		}

		if (data?.total !== undefined) {
			this.elements.total.textContent = `${data.total} синапсов`;
			const hasItems = (data?.items || []).length > 0;
			const hasPositiveTotal = (data?.total || 0) > 0;
			this.elements.button.disabled = !hasItems || !hasPositiveTotal;
			if (hasItems && !hasPositiveTotal) {
				console.log(
					'В корзине есть товары, но общая сумма равна 0. Кнопка оформления неактивна.'
				);
			}
		}

		return this.container;
	}

	checkout(): void {
		this.events.emit('basket:checkout');
	}
}
