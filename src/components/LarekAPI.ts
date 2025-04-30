import { Api, ApiListResponse } from './base/api';
import { IProduct, IOrder } from '../types';

interface IOrderResult {
	id: string;
	total: number;
}

export interface ILarekAPI {
	getProducts: () => Promise<IProduct[]>;
	getProduct: (id: string) => Promise<IProduct>;
	orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

export class LarekAPI extends Api implements ILarekAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProducts(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) => {
			return data.items.map((item) => ({
				...item,
				image: this.cdn + item.image.replace('.svg', '.png'),
			}));
		});
	}

	getProduct(id: string): Promise<IProduct> {
		return this.get(`/product/${id}`).then((item: IProduct) => ({
			...item,
			image:
				this.cdn + (item.image.startsWith('/') ? item.image : `/${item.image}`),
		}));
	}

	orderProducts(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data) => data as IOrderResult);
	}
}
