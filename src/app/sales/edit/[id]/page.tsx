'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import {
	useIsMobile,
	Column,
	useRedirect,
	ShadowContainer as Container,
	useCustomToast,
	Tr,
	CreateNav,
	CreateBody,
	MintTableContainer,
	useGetByIdQuery,
	useUpdateByIdMutation,
} from '@/components/library';

import { Grid, Table, Thead, Tbody, Th, useToast } from '@chakra-ui/react';
import {
	HEADINGS,
	HeadingProps,
	getInvoiceTotal,
	FormSection,
	AddressSection,
} from './_components';
import PurchaseVariantProduct from '@/components/library/page/order/PurchaseVariantProduct';

type FormType = {
	shippingCost: number;
	paidAmount: number;
	date: string;
	customer: string;
	discount: number;
	paymentMethod: string;
};

const CreatePurchase = ({ params }: any) => {
	const isMobile = useIsMobile();
	const toast = useToast();

	const {
		data: orderData,
		isFetching: orderFetching,
		isSuccess: orderIsSuccess,
	} = useGetByIdQuery({ path: 'orders', id: params?.id }, { skip: !params?.id });

	const [formData, setFormData] = useState<FormType>({
		shippingCost: 0,
		paidAmount: 0,
		date: new Date().toISOString(),
		customer: '',
		paymentMethod: 'COD',
		discount: 0,
	});

	const [address, setAddress] = useState<any>({
		name: '',
		email: '',
		phone: '',
		city: '',
		address: '',
		state: '',
		street: '',
		postalCode: '',
		country: 'Bangladesh',
	});

	const [items, setItems] = useState<any[]>([]);

	const invoice = getInvoiceTotal({
		prevData: orderData,
		items,
		discount: formData?.discount,
		shipping: formData?.shippingCost,
	});

	const handleChange = (e: any) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleAddress = (e: any) => {
		setAddress({ ...address, [e.target.name]: e.target.value });
	};

	const setItem = ({
		item,
		qty,
		price,
		variantId,
		variantName,
	}: {
		item: any;
		price: any;
		qty: number;
		variantId: string;
		variantName?: string;
	}) => {
		// Create a new array with the updated items
		const newItems: any[] = items.map((existingItem: any) => {
			if (existingItem._id === item._id) {
				return {
					...existingItem,
					qty: qty,
					price: price,
					variantId: variantId,
					variantName: variantName,
					subTotal: price * qty,
				};
			}
			return existingItem;
		});

		setItems(newItems);
	};

	useEffect(() => {
		if (!orderFetching && orderData) {
			setFormData({
				shippingCost: orderData?.shippingCharge || 0,
				paidAmount: orderData?.paidAmount || 0,
				date: orderData?.orderDate
					? new Date(orderData?.orderDate).toISOString()
					: new Date().toISOString(),
				customer: orderData?.customer?._id || '',
				paymentMethod: orderData?.paymentMethod || 'COD',
				discount: orderData?.cart?.discount || 0,
			});

			setAddress({
				address: orderData?.address?.address || '',
				name: orderData?.address?.name || '',
				email: orderData?.address?.email || '',
				phone: orderData?.address?.phone || '',
				city: orderData?.address?.city || '',
				state: orderData?.address?.state || '',
				street: orderData?.address?.street || '',
				postalCode: orderData?.address?.postalCode || '',
				country: orderData?.address?.country || 'Bangladesh',
			});
			const newItems: any[] = orderData?.items?.map((existingItem: any) => {
				const populatedItems: any[] = [
					...items,
					{
						name: existingItem?.name,
						id: existingItem?._id,
						_id: existingItem?._id,
						qty: existingItem?.qty,
						price: existingItem?.unitPrice,
						variantId: existingItem?.variantId,
						variantName: existingItem?.variantName,
						subTotal: existingItem?.unitPrice * existingItem?.qty,
					},
				];

				setItems(populatedItems as any[]);
			});
		}
	}, [orderIsSuccess, orderFetching]);

	const deleteItem = (_id: string) => {
		setItems((prevItems: any) => prevItems.filter((item: any) => item._id !== _id));
	};

	const [trigger, result] = useUpdateByIdMutation();

	useCustomToast({
		...result,
		successText: 'Invoice Updated successfully',
	});

	useRedirect({
		isSuccess: result?.isSuccess,
		path: `/orders/${result?.data?._id}`,
		isLoading: result?.isLoading,
	});

	useEffect(() => {
		if (!orderFetching && orderIsSuccess) {
			setAddress({
				...address,
				name: orderData?.address?.name || '',
				email: orderData?.address?.email || '',
				phone: orderData?.address?.phone || '',
				address: orderData?.address?.address || '',
			});
		}
	}, [orderFetching]);

	const handleSubmit = (e: any) => {
		e.preventDefault();
		if (items?.length === 0) {
			toast({
				title: 'Error',
				description: 'Please add at least one product',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'top-right',
			});
			return;
		}

		trigger({
			invalidate: ['orders', 'products'],
			path: 'orders/frompos',
			id: params?.id,
			body: {
				cart: invoice,
				address: address,
				customer: formData?.customer,
				paymentAmount: formData?.paidAmount,
				paymentMethod: formData?.paymentMethod,
				paidAmount: formData?.paidAmount,
			},
		});
	};

	const table = (
		<Table size='sm'>
			<Thead {...(isMobile && { display: 'none' })}>
				<Tr>
					{HEADINGS?.map((heading: HeadingProps, i: number) => (
						<Th
							isNumeric={heading?.isNumeric}
							key={i}>
							{heading?.content}
						</Th>
					))}
				</Tr>
			</Thead>

			<Tbody>
				{items?.map((item: any, i: number) => (
					<PurchaseVariantProduct
						isMobile={isMobile}
						key={i}
						item={item}
						i={i}
						setItem={setItem}
						deleteItem={deleteItem}
					/>
				))}
			</Tbody>
		</Table>
	);

	if (orderFetching) {
		return (
			<div>
				<CreateNav
					isLoading={result?.isLoading}
					title='Edit Order'
					path='orders'
				/>
				<CreateBody
					justify='flex-start'
					pt='92px'>
					Loading
				</CreateBody>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit}>
			<CreateNav
				isLoading={result?.isLoading}
				title='Edit Order'
				path='orders'
				// btnText='Update'
			/>
			<CreateBody
				justify='flex-start'
				pt='92px'>
				<Column
					gap={4}
					pb='64px'>
					<Section>
						<FormSection
							formData={formData}
							handleChange={handleChange}
							items={items}
							invoice={invoice}
							setItems={setItems}
						/>
					</Section>

					<MintTableContainer>{table}</MintTableContainer>
					<Section>
						<AddressSection
							address={address}
							handleAddress={handleAddress}
						/>
					</Section>
				</Column>
			</CreateBody>
		</form>
	);
};

const Section = ({ children }: { children: ReactNode }) => (
	<Grid
		gridTemplateColumns={{ base: '1fr', md: '1fr' }}
		gap={4}>
		<Container>{children}</Container>
	</Grid>
);

export default CreatePurchase;
