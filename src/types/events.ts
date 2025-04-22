import { IProduct, IBasketItem } from './models';

export enum EventType {
	PRODUCT_SELECT = 'product:select',
	BASKET_ADD = 'basket:add',
	BASKET_REMOVE = 'basket:remove',
	BASKET_UPDATE = 'basket:update',
	ORDER_CREATE = 'order:create',
	ORDER_COMPLETE = 'order:complete',
	MODAL_OPEN = 'modal:open',
	MODAL_CLOSE = 'modal:close',
}

export interface IEventEmitter {
	on<T>(eventName: string | RegExp, callback: (data: T) => void): void;
	off(eventName: string | RegExp, callback: Function): void;
	emit<T>(eventName: string, data?: T): void;
	onAll(callback: (event: IEvent) => void): void;
	offAll(): void;
	trigger<T>(eventName: string, context?: Partial<T>): (data: T) => void;
}

export interface IEvent {
	eventName: string;
	data: unknown;
}

// Типы событий
export interface ProductSelectEvent {
	product: IProduct;
}

export interface BasketAddEvent {
	product: IProduct;
}

export interface BasketRemoveEvent {
	productId: number;
}

export interface BasketUpdateEvent {
	items: IBasketItem[];
	total: number;
	count: number;
}
