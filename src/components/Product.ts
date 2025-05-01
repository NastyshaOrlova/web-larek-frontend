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

	set title(value: string) {
		this.setText(this.elements.title, value);
	}

	set price(value: number | null) {
		if (value === null) {
			this.setText(this.elements.price, 'Бесценно');
		} else {
			this.setText(this.elements.price, `${value} синапсов`);
		}
	}
}
