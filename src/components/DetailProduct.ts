import { Product } from './Product';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { getCategoryClassName } from '../utils/categoryUtils';

export class DetailProduct extends Product {
	protected elements!: {
		title: HTMLElement;
		price: HTMLElement;
		image: HTMLImageElement;
		description: HTMLElement;
		category: HTMLElement;
		buttonAdd: HTMLButtonElement;
	};

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this.elements = {
			...this.elements,
			image: ensureElement<HTMLImageElement>('.card__image', this.container),
			description: ensureElement<HTMLElement>('.card__text', this.container),
			category: ensureElement<HTMLElement>('.card__category', this.container),
			buttonAdd: ensureElement<HTMLButtonElement>(
				'.card__button',
				this.container
			),
		};
		this.bindButtonClick();
	}

	private inBasket: boolean = false;

	set image(src: string) {
		this.setImage(this.elements.image, src);
	}

	set description(value: string) {
		this.setText(this.elements.description, value);
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

	setButtonStatus(inBasket: boolean): void {
		this.inBasket = inBasket;
		if (inBasket) {
			this.elements.buttonAdd.textContent = 'В корзину';
			this.toggleClass(this.elements.buttonAdd, 'button_in-basket', inBasket);
		} else {
			this.elements.buttonAdd.textContent = 'Купить';
			this.toggleClass(this.elements.buttonAdd, 'button_in-basket', inBasket);
		}
	}

	bindButtonClick(): void {
		this.elements.buttonAdd.addEventListener('click', (event) => {
			event.stopPropagation();

			if (this.inBasket) {
				this.events.emit('modal:close');
				setTimeout(() => {
					this.events.emit('basket:open');
				}, 100);
				this.events.emit('basket:open');
			} else {
				this.events.emit('product:button-click', {
					id: this.container.dataset.id,
				});
				this.setButtonStatus(true);
			}
		});
	}

	render(data: {
		id: string;
		title: string;
		image: string;
		price: number;
		category: string;
		description: string;
		inBasket?: boolean;
	}): HTMLElement {
		this.container.dataset.id = data.id;

		super.render({
			title: data.title,
			price: data.price,
		});

		this.image = data.image;
		this.category = data.category;
		this.description = data.description;
		this.setButtonStatus(Boolean(data.inBasket));

		return this.container;
	}
}
