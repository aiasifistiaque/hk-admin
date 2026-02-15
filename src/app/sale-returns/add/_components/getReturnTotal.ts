import { useEffect, useState } from 'react';

type GetReturnTotalType = {
	items: any[];
	restockingFee?: number;
};

const useGetReturnTotal = ({ items = [], restockingFee = 0 }: GetReturnTotalType) => {
	const [subTotal, setSubTotal] = useState(0);
	const [total, setTotal] = useState(0);
	const [refundAmount, setRefundAmount] = useState(0);
	const [returnItems, setReturnItems] = useState<any[]>([]);
	const [totalItems, setTotalItems] = useState(0);

	useEffect(() => {
		let sTotal = 0;
		let itemCount = 0;
		const processedItems: any[] = [];

		for (const item of items) {
			if (item.returnQty && item.returnQty > 0) {
				const price = item.unitPrice || item.price || 0;
				const itemTotal = price * item.returnQty;
				sTotal += itemTotal;
				itemCount += item.returnQty;

				processedItems.push({
					_id: item._id,
					name: item.name,
					image: item.image,
					qty: item.returnQty,
					unitPrice: price,
					totalPrice: itemTotal,
					cost: item.cost,
					totalCost: (item.cost || 0) * item.returnQty,
				});
			}
		}

		const calculatedTotal = sTotal;
		const calculatedRefund = Math.max(0, calculatedTotal - restockingFee);

		setSubTotal(sTotal);
		setTotal(calculatedTotal);
		setRefundAmount(calculatedRefund);
		setReturnItems(processedItems);
		setTotalItems(itemCount);
	}, [items, restockingFee]);

	return {
		subTotal,
		total,
		refundAmount,
		items: returnItems,
		totalItems,
		restockingFee,
	};
};

export default useGetReturnTotal;
