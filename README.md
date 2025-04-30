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

- View не знает ни о Model, ни о Presenter, генерирует события и содержит методы, с помощью которых можно обновлять отображения, передавая в эти методы нужные данные.

- Model не знает ни о View, ни о Presenter, отвечает только за данные и бизнес-логику, уведомляет Presenter об изменениях через механизм событий.

## 4. Из каких компонентов (классов) состоит приложение?

### Классы моделей (Model) - отвечают за данные и бизнес-логику:

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

#### AppState - основная модель приложения, хранит состояние всего приложения(включает так же состояние корзины, состояние заказа и валидаия форм)

- Конструктор
  constructor(data: Partial<IAppState> = {}, events?: IEvents) - инициализирует состояние приложения
  data: Partial<IAppState> - начальные данные (опционально)
  events: IEvents - система событий (опционально)
- Поля (наследуются от Model<IAppState>):
  catalog: IProduct[] - список всех товаров
  basket: IProduct[] - массив товаров в корзине
  order: IOrder - данные текущего заказа
  preview: string | null - идентификатор просматриваемого товара
  formErrors: IFormErrors - ошибки валидации форм
  orderStep: OrderStep - шаг состояния заказа
- Методы:
  setCatalog(items: IProduct[]): void - устанавливает каталог товаров
  addToBasket(id: string): void - добавляет товар в корзину
  removeFromBasket(id: string): void - удаляет товар из корзины
  setPreview(id: string): void - устанавливает просматриваемый товар
  getTotal(): number - вычисляет общую стоимость товаров в корзине
  setOrderField(field: keyof IOrder, value: string): void - устанавливает значение поля заказа
  validateOrder(): boolean - проверяет валидность данных заказа
  setOrderStep(step: OrderStep): void - для отслеживания текущего шага заказа
  getData(): IAppState - для получения текущих данных модели
  clearOrder(): void - очистка заказа

### Классы представлений (View) - компоненты интерфейса(все классы наследуются от класса Component):

#### Component - базовый класс для всех компонентов

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

#### Product - базовый класс для всех представлений товара

- Конструктор:
  constructor(container: HTMLElement, events: IEvents) - инициализирует базовый компонент представления товара
  container: HTMLElement - DOM-элемент для отображения
  events: IEvents - система событий
- Поля:
  elements: {
  title: HTMLElement,
  price: HTMLElement
  } - базовые DOM-элементы, общие для всех представлений товара
- Методы:
  set title(value: string): void - устанавливает название товара
  set price(value: number): void - устанавливает цену товара
  getCategoryClassName(category: string): string - перебор классов из API

#### CardProduct - представление товара в каталоге. Наследуется от Product.

- Конструктор:
  constructor(container: HTMLElement, events: IEvents) - инициализирует компонент
- Поля:
  elements: {
  image: HTMLImageElement,
  category: HTMLElement
  } - дополнительные элементы для представления в каталоге
- Методы:
  set image(src: string): void - устанавливает изображение товара
  bindCardClick(): void - привязывает обработчик клика к карточке, который генерирует событие card:click с ID товара для открытия детального представления

#### DetailProduct - детальное представление товара. Наследуется от Product.

- Конструктор:
  constructor(container: HTMLElement, events: IEvents) - инициализирует компонент
- Поля:
  elements: {
  image: HTMLImageElement,
  description: HTMLElement,
  category: HTMLElement,
  buttonAdd: HTMLButtonElement
  } - элементы для детального просмотра
- Методы:
  set image(src: string): void - устанавливает изображение товара
  set description(value: string): void - устанавливает описание товара
  bindButtonClick(): void - привязывает обработчик к кнопке, который генерирует событие product:button-click с ID товара

#### BasketItemProduct - представление товара в корзине. Наследуется от Product.

- Конструктор:
  constructor(container: HTMLElement, events: IEvents) - инициализирует компонент
- Поля:
  elements: {
  deleteButton: HTMLButtonElement
  } - элементы для представления в корзине
- Методы:
  bindDeleteButton(): void - привязывает обработчик события к кнопке удаления, который генерирует событие basket:remove с ID товара

#### Form - базовый класс для всех форм

- Конструктор:
  constructor(container: HTMLFormElement, events: IEvents) - инициализирует базовый компонент формы
  container: HTMLFormElement - DOM-элемент формы
  events: IEvents - система событий
- Поля:
  protected \_submit: HTMLButtonElement - кнопка отправки формы
  protected \_errors: HTMLElement - элемент для отображения ошибок
- Методы:
  protected onInputChange(field: string, value: string): void - обработчик изменения полей ввода
  set valid(value: boolean): void - устанавливает валидность формы (активирует/деактивирует кнопку)
  set errors(value: string): void - устанавливает текст ошибок

#### OrderForm - форма выбора способа оплаты и адреса. Наследует класс Form.

- Конструктор:
  constructor(container: HTMLFormElement, events: IEvents) - инициализирует форму заказа
- Поля:
  elements: {
  address: HTMLInputElement,
  payment: NodeListOf<HTMLInputElement>
  } - элементы формы выбора оплаты и адреса
- Методы:
  set address(value: string): void - устанавливает адрес доставки
  set payment(value: string): void - устанавливает способ оплаты

#### ContactsForm - форма ввода контактных данных. Наследует класс Form.

- Конструктор:
  constructor(container: HTMLFormElement, events: IEvents) - инициализирует форму контактов
- Поля:
  elements: {
  email: HTMLInputElement,
  phone: HTMLInputElement
  } - элементы формы контактных данных
- Методы:
  set email(value: string): void - устанавливает email
  set phone(value: string): void - устанавливает телефон

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
  checkout(): void - обработчик нажатия кнопки "Оформить заказ"

#### Modal - класс для модальных окон

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
  hasBasket(): boolean - проверяет, содержит ли текущее модальное окно корзину
  isOpen(): boolean - проверяет, открыто ли в данный момент модальное окно

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
  \_events: Map<EventName, Set<Subscriber>> - хранит карту событий и их обработчиков, где ключ - имя события (строка или регулярное выражение), а значение - набор функций-обработчиков
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
