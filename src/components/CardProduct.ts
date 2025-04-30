import { Product } from './Product';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class CardProduct extends Product {
	protected elements!: {
		title: HTMLElement;
		price: HTMLElement;
		image: HTMLImageElement;
		category: HTMLElement;
	};

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this.elements = {
			title: ensureElement<HTMLElement>('.card__title', this.container),
			price: ensureElement<HTMLElement>('.card__price', this.container),
			image: ensureElement<HTMLImageElement>('.card__image', this.container),
			category: ensureElement<HTMLElement>('.card__category', this.container),
		};

		this.bindCardClick();
	}

	set image(src: string) {
		this.setImage(this.elements.image, src);
	}

	set category(value: string) {
		this.setText(this.elements.category, value);
		const categoryClass = this.getCategoryClassName(value);
		const classList = this.elements.category.classList;
		Array.from(classList)
			.filter((cls) => cls.startsWith('card__category_'))
			.forEach((cls) => classList.remove(cls));
		classList.add(categoryClass);
	}

	bindCardClick(): void {
		this.container.addEventListener('click', () => {
			this.events.emit('card:click', { id: this.container.dataset.id });
		});
	}

	render(data: {
		id: string;
		title: string;
		image: string;
		price: number;
		category: string;
	}): HTMLElement {
		this.container.dataset.id = data.id;
		this.title = data.title;
		this.price = data.price;
		this.image = data.image;
		this.category = data.category;
		return this.container;
	}
}
