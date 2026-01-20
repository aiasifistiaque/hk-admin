import react, { useEffect, useState } from 'react';

type GetOrderType = {
	items: any;
	discount: number;
	shipping: number;
	prevData?: any;
};

const useGetOrderTotal = ({ prevData, items = [], discount = 0, shipping = 0 }: GetOrderType) => {
	const [subTotal, setSubTotal] = useState(0);
	const [vat, setVat] = useState(0);
	const [cartItems, setCartItems] = useState<any[]>([]);
	const [totalItems, setTotalItems] = useState(0);
	const [profit, setProfit] = useState(0);
	const [total, setTotal] = useState(0);
	const [totalProfit, setTotalProfit] = useState(0);

	useEffect(() => {
		if (prevData) {
			setSubTotal(prevData?.subTotal || 0);
			setVat(prevData?.vat || 0);
			setTotal(prevData?.total || 0);
			setTotalItems(prevData?.totalItems || 0);
			setProfit(prevData?.profit || 0);
			setTotalProfit(prevData?.profit || 0);
			setCartItems(prevData?.items || []);
		}
	}, [prevData]);

	useEffect(() => {
		let sTotal = 0;
		let sVat = 0;
		let sItems = [];
		for (const item of items) {
			sTotal += item?.price * item.qty;

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
				totalPrice: item.price * item.qty,
				vat: itemVat,
				unitVat: itemVat / item.qty,
				variantId: item?.variantId,
				variantName: item?.variantName,
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
