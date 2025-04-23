// Какие данные используются в приложении? 
// Нужно записать конкретные типы данных и интерфейсов,
// пояснив их функции, и обязательно указав, в каких
// классах эти типы и интерфейсы используются и каким образом.

// Интерфейс товар. Используется в AppState для хранения каталога, Card и CardDetail для отображения информации о товаре.
interface IProduct { 
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  image: string;
}

// Интерфейс товара в корзине. Используется в AppState для хранения выбранных товаров, Basket для отображения корзины.
interface IBasketItem { 
  id: string;
  title: string;
  price: number;
}

// Интерфейс заказа. Используется в AppState для формирования заказа, Order для отображения формы заказа.
interface IOrder { 
  payment: string;
  address: string;
  email: string;
  phone: string;
  items: string[]; // id товаров
  total: number;
}

// Интерфейс ошибок валидации. Используется в AppState для валидации, Form для отображения ошибок.
interface IFormErrors {
  email?: string;
  phone?: string;
  address?: string;
  payment?: string;
}

// Интерфейс состояния приложения. Используется в AppState для хранения полного состояния приложения.
interface IAppState {
  catalog: IProduct[];
  basket: string[]; // массив id товаров в корзине
  order: IOrder;
  preview: string | null; // id открытого товара
  formErrors: IFormErrors;
}

