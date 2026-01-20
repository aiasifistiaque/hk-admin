'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import {
	useIsMobile,
	Column,
	useRedirect,
	usePostMutation,
	ShadowContainer as Container,
	useCustomToast,
	Tr,
	JsonView,
	CreateNav,
	CreateBody,
	MintTableContainer,
	useGetByIdQuery,
	PurchaseProduct,
} from '@/components/library';

import { Grid, Table, Thead, Tbody, Th, useToast } from '@chakra-ui/react';
import {
	HEADINGS,
	HeadingProps,
	getInvoiceTotal,
	FormSection,
	AddressSection,
} from './_components';
import RestockProduct from '@/components/library/page/order/RestockProduct';
// import QcMain from '@/components/new/QcMain';

type FormType = {
	shippingCost: number;
	paidAmount: number;
	date: string;
	customer: string;
	discount: number;
	warehouse: string;
	paymentMethod: string;
};

const CreatePurchase = ({ params }: any) => {
	const isMobile = useIsMobile();
	const toast = useToast();

	const [formData, setFormData] = useState<FormType>({
		shippingCost: 0,
		paidAmount: 0,
		date: new Date().toISOString(),
		customer: '',
		paymentMethod: '',
		discount: 0,
		warehouse: '',
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

	const [items, setItems] = useState<any>([]);

	const invoice = getInvoiceTotal({
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

	const setItem = ({ item, qty, price }: { item: any; price: any; qty: number }) => {
		// Create a new array with the updated items
		const newItems: any[] = items.map((existingItem: any) => {
			if (existingItem._id === item._id) {
				return {
					...existingItem,
					qty: qty,
					price: price,
					subTotal: price * qty,
				};
			}
			return existingItem;
		});

		setItems(newItems);
	};

	const deleteItem = (_id: string) => {
		setItems((prevItems: any) => prevItems.filter((item: any) => item._id !== _id));
	};

	const [trigger, result] = usePostMutation();

	useCustomToast({
		...result,
		successText: 'Purchase Created successfully',
	});

	useRedirect({
		isSuccess: result?.isSuccess,
		path: `/purchases/${result?.data?.doc?._id}`,
		isLoading: result?.isLoading,
	});

	const { data, isFetching, isSuccess } = useGetByIdQuery(
		{
			path: 'suppliers',
			id: formData?.customer,
		},
		{
			skip: !formData?.customer,
		},
	);

	useEffect(() => {
		if (!isFetching && isSuccess) {
			setAddress({
				...address,
				name: data?.name,
				email: data?.email,
				phone: data?.phone,
			});
		}
	}, [isFetching]);

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

		const createBody = {
			address: address?.address,
			supplier: formData?.customer,
			total: invoice?.total,
			subTotal: invoice?.subTotal,
			// account: '',
			paidAmount: 0,
			// origin: 'invoice',
			shippingCharge: Number(invoice?.shipping || 0),
			discount: Number(invoice?.discount || 0),
			dueAmount: invoice?.total,
			items: invoice?.items,
			orderDate: formData?.date,
			warehouse: formData?.warehouse,
		};

		trigger({
			invalidate: ['purchaseorders', 'products', 'items'],
			path: 'purchaseorders',
			body: createBody,
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
					<RestockProduct
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

	return (
		<form onSubmit={handleSubmit}>
			<CreateNav
				isLoading={result?.isLoading}
				title='Purchase Invoice'
				path='purchases'
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
					{/* <QcMain phone={address?.phone} /> */}

					<MintTableContainer>{table}</MintTableContainer>
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
