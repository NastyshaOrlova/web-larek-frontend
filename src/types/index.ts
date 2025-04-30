export type OrderStep = 'basket' | 'order' | 'contacts' | 'success';

export interface IAppState {
	catalog: IProduct[];
	basket: IProduct[];
	order: IOrder;
	preview: string | null;
	formErrors: IFormErrors;
	orderStep: OrderStep;
}

// Интерфейс товар. Используется в AppState для хранения каталога, Card и CardDetail для отображения информации о товаре.
export interface IProduct {
	id: string;
	title: string;
	description: string;
	category: string;
	price: number | null;
	image: string;
}

// Интерфейс заказа. Используется в AppState для формирования заказа, Order для отображения формы заказа.
export interface IOrder {
	payment: string;
	address: string;
	email: string;
	phone: string;
}

// Интерфейс ошибок валидации. Используется в AppState для валидации, Form для отображения ошибок.
export interface IFormErrors {
	email?: string;
	phone?: string;
	address?: string;
	payment?: string;
}
