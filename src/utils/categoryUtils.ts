export function getCategoryClassName(category: string): string {
	const categoryMap: { [key: string]: string } = {
		'софт-скил': 'card__category_soft',
		'хард-скил': 'card__category_hard',
		дополнительное: 'card__category_additional',
		другое: 'card__category_other',
		кнопка: 'card__category_button',
	};

	return categoryMap[category] || 'card__category_other';
}
