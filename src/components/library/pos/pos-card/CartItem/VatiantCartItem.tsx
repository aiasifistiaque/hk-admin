import { useEffect, useState } from 'react';
import {
	addToVariantCart,
	calculateVariantCartTotals,
	deleteOneFromVariantCart,
	deleteSingleItemFromVariantCart,
	JsonView,
	useGetCartTotalMutation,
} from '../../../';
import { Flex, Heading, Text } from '@chakra-ui/react';
import { CartItemContainer as Container, QtyButtons, CartItemDeleteButton } from '.';

import {
	useAppDispatch,
	useAppSelector,
	Column,
	addToCart,
	deleteOneFromCart,
	deleteSingleItemFromCart,
	calculateCartTotals,
	ImageContainer,
	Align,
	Price,
	PLACEHOLDER_IMAGE,
} from '../../../';

type CartItem = {
	item: {
		id: string;
		name: string;
		price: number;
		qty: number;
		image: string;
		vat?: number;
		uniqueId?: string;
		variantName?: string;
		sku?: string;
		unitPrice: number;
	};
};

const VariantCartItem = ({ item }: CartItem) => {
	const { id, name, price, qty, image, vat, uniqueId, unitPrice } = item;
	const dispatch = useAppDispatch();

	const [trigger, { isSuccess, isLoading, data }] = useGetCartTotalMutation();
	const { cartItems, discount, shipping } = useAppSelector(state => state.cart);

	const [itemsInCart, setItemsInCart] = useState<CartItem[]>([]);

	useEffect(() => {
		setItemsInCart(cartItems);
	}, [cartItems]);

	useEffect(() => {
		trigger({ items: cartItems, shipping, discount });
	}, [itemsInCart]);

	useEffect(() => {
		if (!isLoading && isSuccess) {
			dispatch(calculateVariantCartTotals(data));
		}
	}, [isLoading]);

	const handleAddToCart = () => {
		dispatch(addToVariantCart({ item: item, qty: 1 }));
	};

	const handleDeleteFromCart = () => {
		dispatch(deleteOneFromVariantCart(uniqueId));
	};

	const handleDelete = () => {
		dispatch(deleteSingleItemFromVariantCart(uniqueId));
	};

	return (
		<Container py={2}>
			<Flex align='flex-start'>
				<QtyButtons
					name={name}
					addOne={handleAddToCart}
					deleteOne={handleDeleteFromCart}
					deleteAll={handleDelete}>
					{qty}
				</QtyButtons>
			</Flex>

			<Align gap={3}>
				<ImageContainer
					src={image || PLACEHOLDER_IMAGE}
					size={40}
				/>
				<Column>
					<Text
						fontSize='.9rem'
						lineHeight='1.2'
						fontWeight='500'>
						{name} ({item?.variantName || 'No Variant'}) SKU: {item?.sku}
					</Text>
					{/* <JsonView data={item} /> */}
					<CartItemDeleteButton
						onClick={handleDelete}
						qty={qty}
						name={name}
					/>
				</Column>
			</Align>

			<Column
				justify='center'
				textAlign='right'>
				<Text fontSize='.8rem'>
					{unitPrice?.toLocaleString()} x {qty}
				</Text>
				<Heading size='xs'>
					<Price>{unitPrice * qty}</Price>
				</Heading>

				{vat && vat > 0 ? (
					<Text
						fontSize='.8rem'
						textAlign='right'>
						+<Price>{price * qty * (Number(vat) / 100)}</Price>
					</Text>
				) : null}
			</Column>
		</Container>
	);
};

export default VariantCartItem;
