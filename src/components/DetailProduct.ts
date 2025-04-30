import { Product } from './Product';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class DetailProduct extends Product {
	protected elements = {
		title: ensureElement<HTMLElement>('.card__title', this.container),
		price: ensureElement<HTMLElement>('.card__price', this.container),
		image: ensureElement<HTMLImageElement>('.card__image', this.container),
		description: ensureElement<HTMLElement>('.card__text', this.container),
		category: ensureElement<HTMLElement>('.card__category', this.container),
		buttonAdd: ensureElement<HTMLButtonElement>(
			'.card__button',
			this.container
		),
	};

	private inBasket: boolean = false;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this.bindButtonClick();
	}

	set image(src: string) {
		this.setImage(this.elements.image, src);
	}

	set description(value: string) {
		this.setText(this.elements.description, value);
	}

	set category(value: string) {
		this.setText(this.elements.category, value);
		const categoryClass = this.getCategoryClassName(value);
		this.elements.category.className = 'card__category ' + categoryClass;
	}

	setButtonStatus(inBasket: boolean): void {
		this.inBasket = inBasket;
		if (inBasket) {
			this.elements.buttonAdd.textContent = 'В корзину';
			this.elements.buttonAdd.classList.add('button_in-basket');
		} else {
			this.elements.buttonAdd.textContent = 'Купить';
			this.elements.buttonAdd.classList.remove('button_in-basket');
		}
	}

	bindButtonClick(): void {
		this.elements.buttonAdd.addEventListener('click', (event) => {
			event.stopPropagation();

			if (this.inBasket) {
				// Если товар уже в корзине - открываем корзину
				this.events.emit('basket:open');
				// Закрываем текущее модальное окно
				this.events.emit('modal:close');
			} else {
				// Если товара еще нет в корзине - добавляем его
				// Важно: здесь нужно использовать то же событие, что и в обработчике
				this.events.emit('product:button-click', {
					id: this.container.dataset.id,
				});
				// Меняем состояние кнопки
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
		this.title = data.title;
		this.price = data.price;
		this.image = data.image;
		this.category = data.category;
		this.description = data.description;

		this.setButtonStatus(Boolean(data.inBasket));

		return this.container;
	}
}
