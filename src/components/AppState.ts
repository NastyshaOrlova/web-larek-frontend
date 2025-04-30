import { EventEmitter, IEvents } from './base/events';
import { Model } from './base/Model';
import {
	IAppState,
	IProduct,
	IOrder,
	IFormErrors,
	OrderStep,
} from '../types/index';

export class AppState extends Model<IAppState> {
	protected catalog: IProduct[];
	basket: IProduct[];
	protected order: IOrder;
	protected preview: string | null;
	protected formErrors: IFormErrors;
	protected orderStep: OrderStep;

	constructor(data: Partial<IAppState> = {}, events?: IEvents) {
		super(data, events || new EventEmitter());

		this.catalog = data.catalog || [];
		this.basket = data.basket || [];
		this.order = data.order || {
			payment: '',
			address: '',
			email: '',
			phone: '',
		};
		this.preview = data.preview || null;
		this.formErrors = data.formErrors || {};
		this.orderStep = data.orderStep || 'basket';
	}

	setCatalog(items: IProduct[]): void {
		this.catalog = items;
		this.emitChanges('catalog:changed', { catalog: this.catalog });
	}

	addToBasket(id: string): void {
		const product = this.catalog.find((item) => item.id === id);
		if (product && !this.basket.find((item) => item.id === id)) {
			this.basket.push(product);
			this.emitChanges('basket:changed', { basket: this.basket });
		}
	}

	setOrderStep(step: OrderStep): void {
		this.orderStep = step;
		this.emitChanges('order:step', { step: this.orderStep });
	}

	getData(): IAppState {
		return {
			catalog: this.catalog,
			basket: this.basket,
			order: this.order,
			preview: this.preview,
			formErrors: this.formErrors,
			orderStep: this.orderStep,
		};
	}

	clearOrder(): void {
		this.order = {
			payment: '',
			address: '',
			email: '',
			phone: '',
		};
		this.formErrors = {};
		this.emitChanges('order:changed', { order: this.order });
	}

	removeFromBasket(id: string): void {
		this.basket = this.basket.filter((item) => item.id !== id);
		this.emitChanges('basket:changed', { basket: this.basket });
	}

	setPreview(id: string): void {
		const product = this.catalog.find((item) => item.id === id);

		if (product) {
			this.preview = id;
			this.emitChanges('preview:changed', product);
		} else {
			console.error('Товар с ID', id, 'не найден в каталоге');
		}
	}

	getTotal(): number {
		return this.basket.reduce((total, item) => total + (item.price || 0), 0);
	}

	setOrderField(field: keyof IOrder, value: string): void {
		this.order[field] = value;
		this.validateOrder();
		this.emitChanges('order:changed', { order: this.order });
	}

	validateOrder(): boolean {
		const errors: IFormErrors = {};

		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}

		if (!this.order.payment) {
			errors.payment = 'Необходимо выбрать способ оплаты';
		}

		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		} else if (!/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/i.test(this.order.email)) {
			errors.email = 'Некорректный email';
		}

		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		} else if (!/^\+?[0-9]{10,15}$/.test(this.order.phone.replace(/\D/g, ''))) {
			errors.phone = 'Некорректный телефон';
		}

		this.formErrors = errors;
		this.emitChanges('formErrors:changed', { errors: this.formErrors });
		return Object.keys(errors).length === 0;
	}
}
