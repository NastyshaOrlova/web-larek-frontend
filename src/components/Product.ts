import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class Product extends Component<{}> {
	protected elements: {
		title: HTMLElement;
		price: HTMLElement;
	};

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);

		this.elements = {
			title: ensureElement<HTMLElement>('.card__title', this.container),
			price: ensureElement<HTMLElement>('.card__price', this.container),
		};
	}

	protected getCategoryClassName(category: string): string {
		const categoryMap: { [key: string]: string } = {
			'софт-скил': 'card__category_soft',
			'хард-скил': 'card__category_hard',
			дополнительное: 'card__category_additional',
			другое: 'card__category_other',
			кнопка: 'card__category_button',
		};

		return categoryMap[category] || 'card__category_other';
	}

	set title(value: string) {
		this.setText(this.elements.title, value);
	}

	set price(value: number) {
		this.setText(this.elements.price, `${value} синапсов`);
	}
}
