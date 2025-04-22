import { IProduct, IBasketItem } from './models';

export interface ICatalogView {
	render(products: IProduct[]): void;
	onProductSelect(callback: (productId: number) => void): void;
}

export interface IProductCardView {
	render(product: IProduct): void;
	onClick(callback: () => void): void;
}

export interface IModalView {
	open(): void;
	close(): void;
	onClose(callback: () => void): void;
}

export interface IProductModalView extends IModalView {
	render(product: IProduct, isInBasket: boolean): void;
	onBuyClick(callback: () => void): void;
	onBasketClick(callback: () => void): void;
	setButtonState(isInBasket: boolean): void;
}

export interface IBasketModalView extends IModalView {
	render(items: IBasketItem[], total: number): void;
	onItemRemove(callback: (productId: number) => void): void;
	onCheckoutClick(callback: () => void): void;
}

export interface IOrderAddressModalView extends IModalView {
	render(): void;
	onAddressInput(callback: (address: string) => void): void;
	onPaymentMethodSelect(
		callback: (method: 'online' | 'onDelivery') => void
	): void;
	onNextClick(callback: () => void): void;
	setNextButtonState(isActive: boolean): void;
}

export interface IOrderContactModalView extends IModalView {
	render(): void;
	onEmailInput(callback: (email: string) => void): void;
	onPhoneInput(callback: (phone: string) => void): void;
	onNextClick(callback: () => void): void;
	setNextButtonState(isActive: boolean): void;
}

export interface ISuccessModalView extends IModalView {
	render(total: number): void;
	onContinueClick(callback: () => void): void;
}
