import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export class Modal extends Component<{}> {
	protected elements: {
		content: HTMLElement;
		closeButton: HTMLElement;
		overlay: HTMLElement;
	};

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.elements = {
			content: ensureElement<HTMLElement>('.modal__content', this.container),
			closeButton: ensureElement<HTMLElement>('.modal__close', this.container),
			overlay: this.container,
		};

		this.elements.closeButton.addEventListener('click', this.close.bind(this));
		this.elements.overlay.addEventListener('click', (event) => {
			if (event.target === this.elements.overlay) {
				this.close();
			}
		});
	}

	open(): void {
		console.log('Modal.open - генерируем событие modal:open');
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	close(): void {
		console.log('Modal.close - генерируем событие modal:close');
		this.container.classList.remove('modal_active');
		this.events.emit('modal:close');
	}

	setContent(content: HTMLElement): void {
		this.elements.content.innerHTML = '';
		this.elements.content.append(content);
	}

	isOpen(): boolean {
		return this.container.classList.contains('modal_active');
	}

	hasBasket(): boolean {
		return !!this.elements.content.querySelector('.basket');
	}

	render(): HTMLElement {
		return this.container;
	}
}
