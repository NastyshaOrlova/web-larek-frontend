import { Product } from './Product';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { getCategoryClassName } from '../utils/categoryUtils';

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
			...this.elements,
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
		const categoryClass = getCategoryClassName(value);

		Array.from(this.elements.category.classList)
			.filter((cls) => cls.startsWith('card__category_'))
			.forEach((cls) => {
				this.toggleClass(this.elements.category, cls, false);
			});
		this.toggleClass(this.elements.category, categoryClass, true);
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

		super.render({
			title: data.title,
			price: data.price,
		});

		this.image = data.image;
		this.category = data.category;

		return this.container;
	}
}
