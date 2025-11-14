'use client';

import { useEffect, useState } from 'react';

import {
	useAppDispatch,
	useAppSelector,
	Column,
	EmptyCartModal,
	SpaceBetween,
	IconButton,
	useGetCartTotalMutation,
	deleteAllFromVariantCart,
	calculateVariantCartTotals,
	updateVariantCartUser,
	InputData,
} from '../';

import EditablePriceItem from './pos-card/EditablePriceItem';
import CartItem from './pos-card/CartItem/CartItem';
import PriceItem from './pos-card/PriceItem';
import PosSelect from './PosSelect';
import AddressWidget from './pos-card/AddressWidget';

import CartPriceContainer from './CartPriceContainer';

import { CartContainer } from '.';
import VariantCartItem from './pos-card/CartItem/VatiantCartItem';

const dataFields: InputData<any>[] = [
	{
		sectionTitle: 'Customer Info',
		name: 'name',
		label: 'Full Name',
		isRequired: true,
		type: 'text',
	},

	{
		name: 'email',
		label: 'Email',
		// isRequired: true,
		type: 'text',
		span: 1,
	},
	{
		name: 'phone',
		label: 'Phone Number',
		type: 'text',
		isRequired: true,
		span: 1,
	},
	{
		name: 'address',
		label: 'Address',
		type: 'textarea',
	},
];

const PosCart = () => {
	const dispatch: any = useAppDispatch();
	const [trigger, result] = useGetCartTotalMutation();
	const { isLoading, isSuccess, isError, error, data } = result;

	const { cartItems, subTotal, vat, discount, shipping, user, total }: any = useAppSelector(
		(state: any) => state.variantCart
	);

	const [val, setVal] = useState<{ discount: number; shipping: number }>({
		discount: Number(shipping),
		shipping: Number(discount),
	});

	const handleChange = (e: any) => {
		setVal({ ...val, [e.target.name]: e.target.value });
		if (e.target.name === 'discount') {
			trigger({ items: cartItems, discount: Number(e.target.value), shipping });
		} else {
			trigger({ items: cartItems, discount, shipping: Number(e.target.value) });
		}
	};
	const handleResetCart = () => {
		dispatch(deleteAllFromVariantCart());
		trigger({ items: [] });
	};

	useEffect(() => {
		setVal({ discount, shipping });
	}, [shipping, discount]);

	useEffect(() => {
		if (!isLoading && isSuccess) {
			dispatch(calculateVariantCartTotals(result?.data));
		}
	}, [result]);

	const selectCustomer = (
		<PosSelect
			insert={true}
			dataModel={dataFields}
			path='customers'
			value={user}
			setValue={(e: string) => dispatch(updateVariantCartUser(e))}
			defaultValue={{ _id: undefined, name: 'Walk in Customer' }}
		/>
	);

	const emptyCartButton = (
		<EmptyCartModal
			onClick={handleResetCart}
			title='Empty Cart'
			trigger={
				<IconButton
					size='sm'
					borderRadius='sm'
					tooltip='Empty Cart'
					aria-label='Empty Cart'
					colorScheme='red'
					variant='outline'
					iconName='delete'
					iconSize={18}
				/>
			}
		/>
	);

	return (
		<>
			<Column p='16px 8px 0 8px'>
				<SpaceBetween>
					<>{selectCustomer}</>
					<>{emptyCartButton}</>
				</SpaceBetween>
				<AddressWidget />
			</Column>
			<CartContainer>
				{cartItems?.map((item: any) => (
					<VariantCartItem
						key={item?.id}
						item={item}
					/>
				))}
			</CartContainer>
			<CartPriceContainer>
				<PriceItem title='Subtotal'>{subTotal}</PriceItem>
				<PriceItem title='VAT (+)'>{vat}</PriceItem>

				<EditablePriceItem
					title='Shipping (+)'
					value={val.shipping}
					name='shipping'
					onChange={handleChange}
				/>
				<EditablePriceItem
					title='Discount (-)'
					value={val.discount}
					name='discount'
					onChange={handleChange}
				/>

				<PriceItem
					title='Total'
					heading>
					{total}
				</PriceItem>
			</CartPriceContainer>
		</>
	);
};

export default PosCart;
