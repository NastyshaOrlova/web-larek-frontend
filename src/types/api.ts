import { IProductDTO, IOrderDTO } from './models';

export interface IApiClient {
	getProducts(): Promise<IProductDTO[]>;
	getProduct(id: number): Promise<IProductDTO>;
	createOrder(order: IOrderDTO): Promise<{ orderId: number }>;
	handleResponse(response: Response): Promise<any>;
}
