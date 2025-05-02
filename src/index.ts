import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { AppState } from './components/AppState';
import { LarekAPI } from './components/LarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { CardProduct } from './components/CardProduct';
import { cloneTemplate } from './utils/utils';
import { Page } from './components/Page';
import { IProduct, IOrder } from './types/index';
import { Modal } from './components/common/Modal';
import { DetailProduct } from './components/DetailProduct';
import { Basket } from './components/Basket';
import { OrderForm } from './components/OrderForm';
import { ContactsForm } from './components/ContactsForm';
import { Success } from './components/Success';
import { BasketItemProduct } from './components/BasketItemProduct';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);
const appState = new AppState({}, events);

// Для отладки - логирование всех событий
events.onAll(({ eventName, data }) => {
	console.log('Event:', eventName, data);
});

const cardCatalogTemplate = '#card-catalog';
const cardPreviewTemplate = '#card-preview';
const modalContainerSelector = '#modal-container';
const basketTemplate = '#basket';
const orderTemplate = '#order';
const contactsTemplate = '#contacts';
const successTemplate = '#success';
const basketItemTemplate = '#card-basket';

const page = new Page(document.querySelector('.page') as HTMLElement, events);
const modal = new Modal(
	document.querySelector(modalContainerSelector) as HTMLElement,
	events
);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const detailProduct = new DetailProduct(
	cloneTemplate(cardPreviewTemplate),
	events
);
const orderForm = new OrderForm(
	cloneTemplate(orderTemplate) as HTMLFormElement,
	events
);
const contactsForm = new ContactsForm(
	cloneTemplate(contactsTemplate) as HTMLFormElement,
	events
);
const success = new Success(cloneTemplate(successTemplate), events);

// ---- Обработчики событий ----

events.on('catalog:changed', (data: { catalog: IProduct[] }) => {
	const cardElements = data.catalog.map((product) => {
		const card = new CardProduct(cloneTemplate(cardCatalogTemplate), events);
		return card.render({
			id: product.id,
			title: product.title,
			image: product.image,
			price: product.price,
			category: product.category,
		});
	});

	page.setCatalog(cardElements);
});

events.on('card:click', (data: { id: string }) => {
	appState.setPreview(data.id);
});

events.on('preview:changed', (product: IProduct) => {
	const isInBasket = appState
		.getBasket()
		.some((item) => item.id === product.id);

	const detailElement = detailProduct.render({
		id: product.id,
		title: product.title,
		image: product.image,
		price: product.price,
		category: product.category,
		description: product.description,
		inBasket: isInBasket,
	});

	modal.setContent(detailElement);
	modal.open();
});

events.on('modal:open', () => {
	page.toggleLock(true);
});

events.on('modal:close', () => {
	page.toggleLock(false);
});

events.on('product:button-click', (data: { id: string }) => {
	appState.addToBasket(data.id);
	console.log(`Товар ${data.id} добавлен в корзину`);
});

events.on('basket:changed', (data: { basket: IProduct[] }) => {
	page.setBasketCounter(data.basket.length);
	if (modal.isOpen() && modal.hasBasket()) {
		basket.render({
			items: data.basket.map((item) => {
				const basketItem = new BasketItemProduct(
					cloneTemplate(basketItemTemplate),
					events
				);
				return basketItem.render({
					id: item.id,
					title: item.title,
					price: item.price,
				});
			}),
			total: appState.getTotal(),
		});
	}
});

events.on('basket:open', () => {
	const basketItems = appState.getBasket();

	if (!modal.hasBasket()) {
		modal.setContent(
			basket.render({
				items: basketItems.map((item) => {
					const basketItem = new BasketItemProduct(
						cloneTemplate(basketItemTemplate),
						events
					);
					return basketItem.render({
						id: item.id,
						title: item.title,
						price: item.price,
					});
				}),
				total: appState.getTotal(),
			})
		);
	}

	modal.open();
});

events.on('basket:remove', (data: { id: string }) => {
	appState.removeFromBasket(data.id);
});

events.on('basket:checkout', () => {
	appState.setOrderStep('order');
	const currentOrder = appState.getOrder();
	appState.validateOrder();

	modal.setContent(
		orderForm.render({
			payment: currentOrder.payment,
			address: currentOrder.address,
			valid: !!(currentOrder.payment && currentOrder.address),
			errors: appState.getFormErrors().address || '',
		})
	);
});

events.on('order:changed', (data: { order: IOrder }) => {
	const currentStep = appState.getOrderStep();
	if (currentStep === 'order') {
		orderForm.render({
			payment: data.order.payment,
			address: data.order.address,
			valid: !!(data.order.payment && data.order.address),
			errors:
				appState.getFormErrors().address ||
				appState.getFormErrors().payment ||
				'',
		});
	}
});

events.on('order.payment:change', (data: { field: string; value: string }) => {
	appState.setOrderField(data.field as keyof IOrder, data.value);
});

events.on('order.address:change', (data: { field: string; value: string }) => {
	appState.setOrderField(data.field as keyof IOrder, data.value);
});

events.on('contacts.email:change', (data: { field: string; value: string }) => {
	appState.setOrderField(data.field as keyof IOrder, data.value);
});

events.on('contacts.phone:change', (data: { field: string; value: string }) => {
	appState.setOrderField(data.field as keyof IOrder, data.value);
});

events.on('formErrors:changed', (data: { errors: Record<string, string> }) => {
	const { errors } = data;
	const currentStep = appState.getOrderStep();

	if (currentStep === 'order') {
		orderForm.valid = !errors.address && !errors.payment;
		if (errors.address) {
			orderForm.errors = errors.address;
		} else if (errors.payment) {
			orderForm.errors = errors.payment;
		} else {
			orderForm.errors = '';
		}
	} else if (currentStep === 'contacts') {
		contactsForm.valid = !errors.email && !errors.phone;
		contactsForm.errors = errors.email || '';
	}
});

events.on('order:submit', () => {
	appState.setOrderStep('contacts');
	const currentOrder = appState.getOrder();

	appState.validateOrder();

	modal.setContent(
		contactsForm.render({
			email: currentOrder.email,
			phone: currentOrder.phone,
			valid: !!(currentOrder.email && currentOrder.phone),
			errors: appState.getFormErrors().email || '',
		})
	);
});

events.on('contacts:submit', () => {
	appState.setOrderStep('success');
	const itemsWithPrice = appState
		.getBasket()
		.filter((item) => item.price !== null);

	const order = {
		payment: appState.getOrder().payment,
		address: appState.getOrder().address,
		email: appState.getOrder().email,
		phone: appState.getOrder().phone,
		items: itemsWithPrice.map((item) => item.id),
		total: appState.getTotal(),
	};

	api
		.orderProducts(order)
		.then((result) => {
			modal.setContent(
				success.render({
					order: appState.getOrder(),
					total: result.total,
				})
			);

			appState.clearBasket();
			appState.clearOrder();
		})
		.catch((error) => {
			console.error('Ошибка при оформлении заказа:', error);
		});
});

events.on('success:continue', () => {
	appState.setOrderStep('basket');
	appState.clearOrder();
	modal.close();
});

api
	.getProducts()
	.then((products) => {
		appState.setCatalog(products);
	})
	.catch((error) => {
		console.error('Ошибка при загрузке товаров:', error);
	});
