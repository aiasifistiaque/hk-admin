interface ExchangeItem {
	returnQty?: number;
	quantity?: number;
	qty?: number;
	price?: number;
	unitPrice?: number;
	total?: number;
	product?: string;
	name?: string;
	variant?: string;
	[key: string]: any;
}

interface ExchangeTotalsProps {
	returnItems: ExchangeItem[];
	exchangeItems: ExchangeItem[];
}

interface ExchangeTotalsResult {
	returnItems: ExchangeItem[];
	exchangeItems: ExchangeItem[];
	returnTotal: number;
	exchangeTotal: number;
	priceDifference: number;
	customerOwes: boolean;
	totalReturnItems: number;
	totalExchangeItems: number;
}

export const getExchangeTotals = ({
	returnItems,
	exchangeItems,
}: ExchangeTotalsProps): ExchangeTotalsResult => {
	// Filter and calculate return items
	const itemsToReturn = returnItems
		.filter(item => item.returnQty && item.returnQty > 0)
		.map(item => {
			const price = item.unitPrice || item.price || 0;
			return {
				...item,
				quantity: item.returnQty,
				price: price,
				total: (item.returnQty || 0) * price,
			};
		});

	const returnTotal = itemsToReturn.reduce((sum, item) => sum + (item.total || 0), 0);
	const totalReturnItems = itemsToReturn.reduce((sum, item) => sum + (item.quantity || 0), 0);

	// Calculate exchange items
	const itemsToExchange = exchangeItems.filter(item => item.quantity && item.quantity > 0);
	const exchangeTotal = itemsToExchange.reduce(
		(sum, item) => sum + (item.unitPrice || item.price || 0) * (item.quantity || 0),
		0,
	);
	const totalExchangeItems = itemsToExchange.reduce((sum, item) => sum + (item.quantity || 0), 0);

	// Calculate price difference (positive = customer pays, negative = store owes)
	const priceDifference = exchangeTotal - returnTotal;
	const customerOwes = priceDifference > 0;

	return {
		returnItems: itemsToReturn,
		exchangeItems: itemsToExchange,
		returnTotal,
		exchangeTotal,
		priceDifference,
		customerOwes,
		totalReturnItems,
		totalExchangeItems,
	};
};
