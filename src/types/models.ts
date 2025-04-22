// Типы данных, получаемые от API
export interface IProductDTO {
	id: number;
	title: string;
	category: string;
	image: string;
	price: number;
	description: string;
}

export interface IOrderDTO {
	paymentMethod: 'online' | 'onDelivery';
	deliveryAddress: string;
	email: string;
	phone: string;
	items: {
		productId: number;
		quantity: number;
	}[];
	total: number;
}

// Типы данных для отображения
export interface IProduct {
	id: number;
	title: string;
	category: string;
	image: string;
	price: number;
	description: string;
}

export interface IBasketItem {
	id: number;
	product: IProduct;
	quantity: number;
}

export interface IOrder {
	paymentMethod: 'online' | 'onDelivery';
	deliveryAddress: string;
	email: string;
	phone: string;
	items: IBasketItem[];
	total: number;
}
