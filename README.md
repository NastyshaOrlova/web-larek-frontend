# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Описание Архитектуры проекта

## 1. Из каких основных частей состоит архитектура проекта? Нужно кратко рассказать о принципе MVP, на основе которого должна быть создана архитектура проекта.

MVP - это архитектурный паттерн, который разделяет приложение на три отдельных компонента(Model, View, Presenter), что позволяет независимо разрабатывать и тестировать каждый из них.


## 2. Зачем нужны эти части, какие функции они выполняют?

- Model нужен для хранения состояния приложения и реализации бизнес-логики независимо от интерфейса. Функии: хранит данные о товарах, корзине и заказах; обрабатывает добавление/удаление товаров; рассчитывает стоимость; валидирует данные заказа.

- View нужен для отображения данных пользователю и получения пользовательского ввода без непосредственной работы с данными. Функии: отрисовывает каталог товаров, модальные окна, корзину; перехватывает клики пользователя; отображает формы и сообщения об ошибках.

- Presenter нужен для соединения модели и представления, обработки пользовательских действий и обновления интерфейса. Функии: реагирует на действия пользователя из View; обращается к Model для получения или изменения данных; форматирует данные для отображения; обновляет интерфейс при изменении данных.

## 3. Как части взаимодействуют?

- Presenter знает о Model и View, является посредником между ними. Получает события от View, обращается к Model для обработки данных, затем обновляет View с результатами.

- View знает только о Presenter, отправляет ему пользовательские действия и получает от него данные для отображения.

- Model не знает ни о View, ни о Presenter, отвечает только за данные и бизнес-логику, уведомляет Presenter об изменениях через механизм событий.


## 4. Из каких компонентов (классов) состоит приложение?
### Классы моделей (Model) - отвечают за данные и бизнес-логику:
#### AppState - основная модель приложения, хранит состояние всего приложения(включает так же состояние корзины, состояние заказа и валидаия форм)
- Конструктор
constructor(data: Partial<IAppState> = {}, events?: IEvents) - инициализирует состояние приложения
data: Partial<IAppState> - начальные данные (опционально)
events: IEvents - система событий (опционально)
- Поля (наследуются от Model<IAppState>):
catalog: IProduct[] - список всех товаров
basket: string[] - идентификаторы товаров в корзине
order: IOrder - данные текущего заказа
preview: string | null - идентификатор просматриваемого товара
formErrors: IFormErrors - ошибки валидации форм
- Методы:
setCatalog(items: IProduct[]): void - устанавливает каталог товаров
addToBasket(id: string): void - добавляет товар в корзину
removeFromBasket(id: string): void - удаляет товар из корзины
setPreview(id: string): void - устанавливает просматриваемый товар
getTotal(): number - вычисляет общую стоимость товаров в корзине
setOrderField(field: keyof IOrder, value: string): void - устанавливает значение поля заказа
validateOrder(): boolean - проверяет валидность данных заказа

#### CardItem - модель отдельного продукта в каталоге
- Конструктор:
constructor(data: IProduct, events?: IEvents) - инициализирует модель товара
data: IProduct - данные товара
events: IEvents - система событий (опционально)
- Поля (наследуются от Model<IProduct>):
id: string - уникальный идентификатор товара
title: string - название товара
description: string - описание товара
category: string - категория товара
price: number - цена товара
image: string - путь к изображению товара
- Методы:
*Не знаю какие будут

#### Model - базовый класс для всех моделей
- Конструктор:
constructor(data: Partial<T> = {}, events?: IEvents) - инициализирует модель начальными данными и экземпляром системы событий
data: Partial<T> - начальные данные для модели (опционально)
events: IEvents - система событий для уведомления об изменениях (опционально)
- Поля:
protected events: IEvents - экземпляр EventEmitter для генерации событий
protected data: T - хранит все данные модели
- Методы:
emitChanges(event: string, payload?: object): void - генерирует событие об изменении модели
getData(): T - возвращает все данные модели
setData(data: Partial<T>): void - обновляет данные модели

### Классы представлений (View) - компоненты интерфейса(все классы наследуются от класса Component):
#### Component - вероятно, базовый класс для всех компонентов
- Конструктор:
protected constructor(protected readonly container: HTMLElement) - инициализирует компонент
container: HTMLElement - DOM-элемент, в который будет отрисован компонент
- Поля:
protected readonly container: HTMLElement - DOM-контейнер компонента
- Методы:
toggleClass(element: HTMLElement, className: string, force?: boolean): void - добавляет или удаляет CSS-класс у элемента
protected setText(element: HTMLElement, value: unknown): void - устанавливает текстовое содержимое элемента
setDisabled(element: HTMLElement, state: boolean): void - блокирует или разблокирует элемент
protected setHidden(element: HTMLElement): void - скрывает элемент (display: none)
protected setVisible(element: HTMLElement): void - показывает элемент
protected setImage(element: HTMLImageElement, src: string, alt?: string): void - устанавливает изображение и альтернативный текст
render(data?: Partial<T>): HTMLElement - обновляет данные компонента и возвращает корневой DOM-элемент

#### Card - для отображения карточки товара в каталоге
- Конструктор:
constructor(container: HTMLElement, events?: IEvents) - инициализирует компонент карточки
container: HTMLElement - шаблон карточки товара
events: IEvents - система событий
- Поля:
elements: {
title: HTMLElement,
image: HTMLImageElement,
category: HTMLElement,
price: HTMLElement
} - элементы DOM для отображения данных товара
- Методы:
setTitle(title: string): void - устанавливает название товара
setImage(url: string): void - устанавливает изображение товара
setCategory(category: string): void - устанавливает категорию товара
setPrice(price: number): void - устанавливает цену товара
render(item: IProduct): HTMLElement - рендерит карточку товара с данными

#### Order - форма оформления заказа
- Конструктор:
constructor(container: HTMLElement, events?: IEvents) - инициализирует компонент заказа
container: HTMLElement - шаблон формы заказа
events: IEvents - система событий
- Поля:
elements: {
address: HTMLInputElement,
payment: NodeListOf<HTMLInputElement>,
email: HTMLInputElement,
phone: HTMLInputElement,
submit: HTMLButtonElement,
errors: HTMLElement
} - элементы формы заказа
- Методы:
render(data: IOrder): HTMLElement - рендерит форму заказа
setPaymentMethod(method: string): void - устанавливает способ оплаты
submit(): void - обработчик отправки заказа

#### Page - основной контейнер страницы
- Конструктор:
constructor(container: HTMLElement, events?: IEvents) - инициализирует компонент страницы
container: HTMLElement - корневой элемент страницы
events: IEvents - система событий
- Поля:
elements: {
catalog: HTMLElement,
basket: HTMLElement,
counter: HTMLElement
} - основные элементы страницы
- Методы:
render(): HTMLElement - рендерит основную структуру страницы
setCatalog(items: HTMLElement[]): void - устанавливает содержимое каталога
setBasketCounter(count: number): void - обновляет счетчик товаров в корзине
toggleLock(locked: boolean): void - блокирует/разблокирует прокрутку страницы

#### Basket - корзина с выбранными товарами
- Конструктор:
constructor(container: HTMLElement, events?: IEvents) - инициализирует компонент корзины
container: HTMLElement - шаблон корзины
events: IEvents - система событий
- Поля:
elements: {
list: HTMLElement,
total: HTMLElement,
button: HTMLButtonElement
} - элементы DOM для отображения списка товаров и итогов
- Методы:
render(items: IBasketItem[], total: number): HTMLElement - рендерит корзину с товарами
removeItemHandler(id: string): void - обработчик удаления товара из корзины
checkout(): void - обработчик нажатия кнопки "Оформить заказ"

#### Form - компонент работы с формами ввода
- Конструктор:
constructor(container: HTMLElement, events?: IEvents) - инициализирует компонент формы
container: HTMLElement - шаблон формы
events: IEvents - система событий
- Поля:
elements: {
inputs: NodeListOf<HTMLInputElement>,
submit: HTMLButtonElement,
errors: HTMLElement
} - элементы формы
- Методы:
render(data?: object): HTMLElement - рендерит форму
setFieldValue(name: string, value: string): void - устанавливает значение поля
validateField(field: HTMLInputElement): boolean - проверяет валидность поля
showErrors(errors: IFormErrors): void - отображает ошибки валидации
submit(): void - обработчик отправки формы

#### Modal - базовый класс для модальных окон
- Конструктор:
constructor(container: HTMLElement, events?: IEvents) - инициализирует компонент модального окна
container: HTMLElement - контейнер для модальных окон
events: IEvents - система событий
- Поля:
elements: {
content: HTMLElement,
closeButton: HTMLElement,
overlay: HTMLElement
} - элементы модального окна
- Методы:
render(content: HTMLElement): HTMLElement - рендерит модальное окно с указанным содержимым
open(): void - открывает модальное окно
close(): void - закрывает модальное окно
setContent(content: HTMLElement): void - устанавливает содержимое окна

#### Success - окно успешного оформления заказа
- Конструктор:
constructor(container: HTMLElement, events?: IEvents) - инициализирует компонент
container: HTMLElement - шаблон окна успешного оформления
events: IEvents - система событий
- Поля:
elements: {
message: HTMLElement,
button: HTMLButtonElement
} - элементы окна успешного оформления
- Методы:
render(order: IOrder): HTMLElement - рендерит окно с информацией о заказе
continueHandler(): void - обработчик нажатия кнопки "За новыми покупками"

#### CardDetail - для детального отображения товара
Конструктор:
constructor(container: HTMLElement, events?: IEvents) - инициализирует компонент
container: HTMLElement - шаблон детального просмотра
events: IEvents - система событий
Поля:
elements: {
title: HTMLElement,
image: HTMLImageElement,
description: HTMLElement,
category: HTMLElement,
price: HTMLElement,
buttonAdd: HTMLButtonElement
} - элементы DOM для отображения данных товара
Методы:
render(item: IProduct): HTMLElement - рендерит детальную информацию о товаре
addToBasketHandler(): void - обработчик нажатия кнопки "Добавить в корзину"

### Презентёр (Presenter) - связующее звено:
Выступает в роли главного файла index.ts, где происходит инициализация всех необходимых компонентов и подписка и обработка событий. 


### Вспомогательные классы:
#### Класс Api для общения с сервером.
- Конструктор:
constructor(baseUrl: string, options: RequestInit = {})
baseUrl: string - базовый URL для всех запросов
options: RequestInit - дополнительные параметры запросов (опционально)Ь
- Поля:
readonly baseUrl: string - хранит базовый URL API
protected options: RequestInit - хранит настройки запросов, включая заголовки
- Методы:
protected handleResponse(response: Response): Promise<object> - обрабатывает ответ от сервера, преобразует его в JSON или возвращает ошибку
get(uri: string): Promise<object> - выполняет GET-запрос по указанному URI
post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object> - выполняет POST-запрос (или другие методы) с передачей данных
#### EventEmitter реализует систему событий, позволяющую компонентам взаимодействовать друг с другом без прямых зависимостей.
- Конструктор:
constructor() - создает пустую карту событий
- Поля:
_events: Map<EventName, Set<Subscriber>> - хранит карту событий и их обработчиков, где ключ - имя события (строка или регулярное выражение), а значение - набор функций-обработчиков
- Методы:
on<T extends object>(eventName: EventName, callback: (event: T) => void): void - подписывает обработчик на указанное событие
off(eventName: EventName, callback: Subscriber): void - отписывает обработчик от указанного события
emit<T extends object>(eventName: string, data?: T): void - генерирует событие с опциональными данными
onAll(callback: (event: EmitterEvent) => void): void - подписывает обработчик на все события
offAll(): void - удаляет все обработчики событий
trigger<T extends object>(eventName: string, context?: Partial<T>): (data: T) => void - создает функцию-триггер, которая при вызове генерирует указанное событие

## 5. Какие данные используются в приложении? Нужно записать конкретные типы данных и интерфейсов, пояснив их функции, и обязательно указав, в каких классах эти типы и интерфейсы используются и каким образом.
Опсиание этого пункта находится в types/index.ts

## 6. Как реализованы процессы в приложении? Через события или как-то иначе?
Через систему событий с использованием класса EventEmitter. Компоненты представления генерируют события при действиях пользователя, центральный презентер (index.ts) обрабатывает эти события, обновляет модели данных и перерисовывает необходимые компоненты интерфейса.