import react, { useEffect, useState } from 'react';

type GetOrderType = {
	items: any;
	discount: number;
	shipping: number;
};

const useGetOrderTotal = ({ items = [], discount = 0, shipping = 0 }: GetOrderType) => {
	const [subTotal, setSubTotal] = useState(0);
	const [vat, setVat] = useState(0);
	const [cartItems, setCartItems] = useState<any[]>([]);
	const [totalItems, setTotalItems] = useState(0);
	const [profit, setProfit] = useState(0);
	const [total, setTotal] = useState(0);
	const [totalProfit, setTotalProfit] = useState(0);

	useEffect(() => {
		let sTotal = 0;
		let sVat = 0;
		let sItems = [];
		for (const item of items) {
			sTotal += item.price * item.qty;

			const itemVat = (item.price * item.qty * (item.vat || 0)) / 100;
			sVat += itemVat;
			//setVat(vat + itemVat);

			// Calculate the total number of items
			setTotalItems(Number(totalItems) + Number(item.qty));

			// Calculate the profit per unit
			const unitProfit = item.price - item.cost;
			setProfit(Number(profit) + Number(unitProfit * item.qty));

			const cartItem: any = {
				_id: item._id,
				name: item.name,
				image: item.image,
				cost: item.cost,
				totalCost: item.cost * item.qty,
				totalPrice: item.price * item.qty,
				vat: itemVat,
				unitVat: itemVat / item.qty,
				qty: item.qty,
				unitPrice: item.price,
				unitProfit,
				profit: unitProfit * item.qty,
			};
			sItems.push(cartItem);
		}
		setCartItems(sItems);
		setSubTotal(sTotal);
		setTotal(sTotal + sVat - Number(discount) + Number(shipping));
		setVat(sVat);
		setTotalProfit(sItems.reduce((total: number, item: any) => total + item.profit, 0));
	}, [items, discount, shipping]);

	return {
		subTotal,
		total,
		vat,
		discount,
		shipping,
		totalItems,
		items: cartItems,
		profit: totalProfit - discount,
	};
};

export default useGetOrderTotal;
