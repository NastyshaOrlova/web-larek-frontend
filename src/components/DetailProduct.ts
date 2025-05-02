import { Product } from './Product';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { getCategoryClassName } from '../utils/categoryUtils';

export class DetailProduct extends Product {
	protected imageElement: HTMLImageElement;
	protected categoryElement: HTMLElement;
	protected descriptionElement: HTMLElement;
	protected buttonAddElement: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		(this.imageElement = ensureElement<HTMLImageElement>(
			'.card__image',
			this.container
		)),
			(this.descriptionElement = ensureElement<HTMLElement>(
				'.card__text',
				this.container
			)),
			(this.categoryElement = ensureElement<HTMLElement>(
				'.card__category',
				this.container
			)),
			(this.buttonAddElement = ensureElement<HTMLButtonElement>(
				'.card__button',
				this.container
			)),
			this.bindButtonClick();
	}

	private inBasket: boolean = false;

	set image(src: string) {
		this.setImage(this.imageElement, src);
	}

	set description(value: string) {
		this.setText(this.descriptionElement, value);
	}

	set category(value: string) {
		this.setText(this.categoryElement, value);
		const categoryClass = getCategoryClassName(value);

		Array.from(this.categoryElement.classList)
			.filter((cls) => cls.startsWith('card__category_'))
			.forEach((cls) => {
				this.toggleClass(this.categoryElement, cls, false);
			});
		this.toggleClass(this.categoryElement, categoryClass, true);
	}

	setButtonStatus(inBasket: boolean): void {
		this.inBasket = inBasket;
		if (inBasket) {
			this.buttonAddElement.textContent = 'В корзину';
			this.toggleClass(this.buttonAddElement, 'button_in-basket', inBasket);
		} else {
			this.buttonAddElement.textContent = 'Купить';
			this.toggleClass(this.buttonAddElement, 'button_in-basket', inBasket);
		}
	}

	bindButtonClick(): void {
		this.buttonAddElement.addEventListener('click', (event) => {
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
