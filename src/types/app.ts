import { IPresenter } from './base';
import { IProductModel, IBasketModel, IOrderModel } from './model';
import {
	ICatalogView,
	IProductModalView,
	IBasketModalView,
	IOrderAddressModalView,
	IOrderContactModalView,
	ISuccessModalView,
} from './view';

// Интерфейс для основного Presenter приложения
export interface IAppPresenter extends IPresenter {
	showCatalog(): void;
	showProduct(productId: number): void;
	showBasket(): void;
	showOrderAddress(): void;
	showOrderContact(): void;
	showSuccess(total: number): void;
}

// Конфигурация приложения
export interface IAppConfig {
	apiUrl: string;
	rootElement: HTMLElement;
}

// Фабрика для создания компонентов приложения
export interface IAppFactory {
	createProductModel(): IProductModel;
	createBasketModel(): IBasketModel;
	createOrderModel(): IOrderModel;

	createCatalogView(container: HTMLElement): ICatalogView;
	createProductModalView(): IProductModalView;
	createBasketModalView(): IBasketModalView;
	createOrderAddressModalView(): IOrderAddressModalView;
	createOrderContactModalView(): IOrderContactModalView;
	createSuccessModalView(): ISuccessModalView;

	createAppPresenter(): IAppPresenter;
}
