import { IProduct, IBasketItem, IOrder } from './models';

export interface IProductModel {
	getProducts(): Promise<IProduct[]>;
	getProduct(id: number): Promise<IProduct>;
	onUpdate(callback: () => void): void;
}

export interface IBasketModel {
	items: IBasketItem[];
	total: number;
	count: number;

	addItem(product: IProduct): void;
	removeItem(productId: number): void;
	hasItem(productId: number): boolean;
	clearBasket(): void;
	calculateTotal(): number;

	onUpdate(callback: () => void): void;
}

export interface IOrderModel {
	order: IOrder;

	setPaymentMethod(method: 'online' | 'onDelivery'): void;
	setDeliveryAddress(address: string): void;
	setContacts(email: string, phone: string): void;
	setItems(items: IBasketItem[]): void;
	validateAddress(): boolean;
	validateContacts(): boolean;
	createOrder(): Promise<{ orderId: number }>;

	onUpdate(callback: () => void): void;
}
