export interface IButton {
	text: string;
	onClick: () => void;
	element: HTMLElement;

	render(): HTMLElement;
	setDisabled(isDisabled: boolean): void;
}

// Интерфейс для базового класса Modal
export interface IModal {
	element: HTMLElement;
	content: HTMLElement;

	render(): HTMLElement;
	open(): void;
	close(): void;
	setContent(content: HTMLElement | string): void;
}

// Общий интерфейс для всех Presenter
export interface IPresenter {
	init(): void;
	destroy(): void;
}
