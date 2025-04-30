import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export class Page extends Component<IPage> {
	protected elements = {
		catalog: ensureElement<HTMLElement>('.gallery'),
		basket: ensureElement<HTMLElement>('.header__basket'),
		counter: ensureElement<HTMLElement>('.header__basket-counter'),
	};

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.elements.basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	setCatalog(items: HTMLElement[]): void {
		this.elements.catalog.innerHTML = '';
		this.elements.catalog.append(...items);
	}

	setBasketCounter(count: number): void {
		this.setText(this.elements.counter, String(count));
	}

	toggleLock(locked: boolean): void {
		const pageWrapper = document.querySelector('.page__wrapper');
		if (pageWrapper) {
			if (locked) {
				pageWrapper.classList.add('page__wrapper_locked');
			} else {
				pageWrapper.classList.remove('page__wrapper_locked');
			}
		}
	}

	render(data?: Partial<IPage>): HTMLElement {
		if (data?.catalog) {
			this.setCatalog(data.catalog);
		}

		if (data?.counter !== undefined) {
			this.setBasketCounter(data.counter);
		}

		if (data?.locked !== undefined) {
			this.toggleLock(data.locked);
		}

		return this.container;
	}
}
