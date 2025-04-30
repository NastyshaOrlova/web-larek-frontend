import { Form } from './common/Form';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

interface IContactsFormData {
	email: string;
	phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
	protected elements = {
		email: ensureElement<HTMLInputElement>('[name="email"]', this.container),
		phone: ensureElement<HTMLInputElement>('[name="phone"]', this.container),
	};

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set email(value: string) {
		this.elements.email.value = value;
	}

	set phone(value: string) {
		this.elements.phone.value = value;
	}
}
