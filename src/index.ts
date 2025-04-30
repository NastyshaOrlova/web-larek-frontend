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
	const isInBasket = appState.basket.some((item) => item.id === product.id);

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
		modal.setContent(
			basket.render({
				items: data.basket,
				total: appState.getTotal(),
			})
		);
	}
});

events.on('basket:remove', (data: { id: string }) => {
	appState.removeFromBasket(data.id);
});

events.on('basket:open', () => {
	const basketItems = appState.basket || [];
	modal.setContent(
		basket.render({
			items: basketItems,
			total: appState.getTotal(),
		})
	);
	modal.open();
});

const basketButton = document.querySelector('.header__basket');
if (basketButton) {
	basketButton.addEventListener('click', () => {
		const basketItems = appState.basket || [];
		modal.setContent(
			basket.render({
				items: basketItems,
				total: appState.getTotal(),
			})
		);

		modal.open();
	});
}

events.on('basket:checkout', () => {
	appState.setOrderStep('order');
	const isValid = appState.validateOrder();
	modal.setContent(
		orderForm.render({
			valid: isValid,
			errors: [],
		})
	);
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
	const currentStep = appState.getData().orderStep;
	if (currentStep === 'order') {
		const errorMessages = [];
		if (errors.address) errorMessages.push(errors.address);
		if (errors.payment) errorMessages.push(errors.payment);

		orderForm.valid = !errors.address && !errors.payment;
		orderForm.errors = errorMessages.join(', ');
	} else if (currentStep === 'contacts') {
		const errorMessages = [];
		if (errors.email) errorMessages.push(errors.email);
		if (errors.phone) errorMessages.push(errors.phone);

		contactsForm.valid = !errors.email && !errors.phone;
		contactsForm.errors = errorMessages.join(', ');
	}
});

events.on('order:submit', () => {
	appState.setOrderStep('contacts');
	modal.setContent(
		contactsForm.render({
			valid: false,
			errors: [],
		})
	);
});

events.on('contacts:submit', () => {
	if (appState.validateOrder()) {
		appState.setOrderStep('success');

		const order = {
			payment: appState.getData().order.payment,
			address: appState.getData().order.address,
			email: appState.getData().order.email,
			phone: appState.getData().order.phone,
			items: appState.basket.map((item) => item.id),
			total: appState.getTotal(),
		};

		api
			.orderProducts(order)
			.then((result) => {
				modal.setContent(
					success.render({
						order: appState.getData().order,
						total: result.total,
					})
				);

				const basketItems = [...appState.basket];
				basketItems.forEach((item) => {
					appState.removeFromBasket(item.id);
				});

				appState.clearOrder();
			})
			.catch((error) => {
				console.error('Ошибка при оформлении заказа:', error);
			});
	}
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
