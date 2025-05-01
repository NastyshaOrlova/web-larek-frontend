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
	protected basket: IProduct[];
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

	getBasket(): IProduct[] {
		return [...this.basket];
	}

	getOrder(): IOrder {
		return { ...this.order };
	}

	getOrderStep(): OrderStep {
		return this.orderStep;
	}

	clearOrder(): void {
		const payment = this.order.payment;
		const address = this.order.address;
		const email = this.order.email;
		const phone = this.order.phone;

		this.order = {
			payment: payment,
			address: address,
			email: email,
			phone: phone,
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
		const errors = this.validateOrder();
		this.emitChanges('order:changed', {
			order: this.order,
			errors: errors,
			field: field,
		});
	}

	clearBasket(): void {
		this.basket = [];
		this.emitChanges('basket:changed', { basket: this.basket });
	}

	getFormErrors(): IFormErrors {
		return { ...this.formErrors };
	}

	validateOrder(): boolean {
		const errors: IFormErrors = {};

		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}

		if (!this.order.payment) {
			errors.payment = '';
		}

		if (!this.order.email || !this.order.phone) {
			errors.email = errors.phone = 'Заполните все поля';
		}

		this.formErrors = errors;
		this.emitChanges('formErrors:changed', { errors: this.formErrors });

		return Object.keys(errors).length === 0;
	}
}
