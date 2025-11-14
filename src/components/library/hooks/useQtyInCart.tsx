import { useEffect, useState } from 'react';
import { useAppSelector } from '..';

const useQtyInCart = (id: string) => {
	const [qty, setQty] = useState<number>(0);
	const { cartItems } = useAppSelector(state => state.variantCart);

	useEffect(() => {
		const cartItem = cartItems.find(
			(cartItem: { variantId: string; qty: number }) => cartItem.variantId === id
		);
		setQty(cartItem ? cartItem.qty : 0);
	}, [id, cartItems]);

	return qty;
};

export default useQtyInCart;
