import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class Product extends Component<{}> {
	protected titleElement: HTMLElement;
	protected priceElement: HTMLElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);

		this.titleElement = ensureElement<HTMLElement>(
			'.card__title',
			this.container
		);
		this.priceElement = ensureElement<HTMLElement>(
			'.card__price',
			this.container
		);
	}

	set title(value: string) {
		this.setText(this.titleElement, value);
	}

	set price(value: number | null) {
		if (value === null) {
			this.setText(this.priceElement, 'Бесценно');
		} else {
			this.setText(this.priceElement, `${value} синапсов`);
		}
	}
}
