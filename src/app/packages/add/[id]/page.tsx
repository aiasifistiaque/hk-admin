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
	PackProduct,
} from '@/components/library';

const HEADINGS: HeadingProps[] = [
	{
		content: '#',
	},
	{
		content: 'Product Name',
	},
	{
		content: 'Qty',
	},
	// {
	// 	content: 'Variant',
	// },
	{
		content: 'Batch',
	},
	// {
	// 	content: 'Discount',
	// },
	{
		content: 'SubTotal',
		isNumeric: true,
	},
	{
		content: 'delete',
	},
];

import {
	Grid,
	Table,
	Thead,
	Tbody,
	Th,
	useToast,
	Flex,
	Text,
	Heading,
	GridProps,
	FlexProps,
	Badge,
} from '@chakra-ui/react';
import { HeadingProps, getInvoiceTotal, AddressSection } from '../../../orders/add/_components';
import { useParams } from 'next/navigation';
// import QcMain from '@/components/new/QcMain';
import FormSection from './_components/FormSection';

type FormType = {
	shippingCost: number;
	paidAmount: number;
	date: string;
	customer: string;
	discount: number;
	paymentMethod: string;
};

const CreatePurchase = () => {
	const isMobile = useIsMobile();
	const toast = useToast();
	// const orderId = await params?.id;

	const getParams = useParams<{ id: string }>();
	const { id: orderId } = getParams;

	const { data: orderData, isFetching: orderFetching } = useGetByIdQuery(
		{ path: 'orders', id: orderId },
		{ skip: !orderId }
	);

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

	const setItem = ({
		item,
		qty,
		batch,
		index,
	}: {
		item: any;
		batch: any;
		qty: number;
		index: number;
	}) => {
		// Create a new array with the updated items
		const newItems: any[] = items.map((existingItem: any, i: number) => {
			if (i === index) {
				return {
					...existingItem,
					qty: qty,
					batchNo: batch,
					subTotal: existingItem.sellPrice * qty,
				};
			}
			return existingItem;
		});

		setItems(newItems);
	};

	const deleteItem = (index: number) => {
		setItems((prevItems: any) => prevItems.filter((_: any, i: number) => i !== index));
	};

	const [trigger, result] = usePostMutation();

	useCustomToast({
		...result,
		successText: 'Invoice Created successfully',
	});

	useRedirect({
		isSuccess: result?.isSuccess,
		path: `/packages`,
		isLoading: result?.isLoading,
	});

	const { data, isFetching, isSuccess } = useGetByIdQuery(
		{
			path: 'customers',
			id: formData?.customer,
		},
		{
			skip: !formData?.customer,
		}
	);

	useEffect(() => {
		if (!orderFetching && orderData) {
			setAddress({
				name: orderData?.address?.name,
				email: orderData?.address?.email,
				phone: orderData?.address?.phone,
				address: orderData?.address?.address,
			});
			setFormData({
				...formData,
				date: orderData?.date || new Date().toISOString(),
				customer: orderData?.customer || '',
				paidAmount: orderData?.paidAmount || 0,
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

		const body = {
			invoice: orderData?.invoice,
			orderId: orderId,
			items: items,
			totalAmount: invoice?.total,
			dueAmount: orderData?.dueAmount,
			isPaid: invoice?.total <= formData?.paidAmount,
			shippingCharge: orderData?.shippingCharge,
			status: 'pending',
			address: address,
			customer: orderData?.customer?._id,
		};

		trigger({
			invalidate: ['packages', 'products'],
			path: 'packages',
			body: body,
		});
	};

	const ifExists = (id: string, requiredQty: number, excludeIndex?: number) => {
		// Sum up quantities from all items with the same id
		const totalQty = items?.reduce((sum: number, item: any, index: number) => {
			// Skip the current index if provided (to avoid checking against itself)
			if (excludeIndex !== undefined && index === excludeIndex) {
				return sum;
			}
			if (item?._id === id) {
				return sum + (item?.qty || 0);
			}
			return sum;
		}, 0);

		return totalQty >= (requiredQty || 1);
	};

	const handleSelectProduct = (value: any) => {
		// Calculate total quantity already added for this product
		const totalAddedQty = items?.reduce((sum: number, item: any) => {
			if (item?._id === value?._id) {
				return sum + (item?.qty || 0);
			}
			return sum;
		}, 0);

		// Check if adding this would exceed or match the required quantity
		if (totalAddedQty >= (value?.qty || 1)) {
			toast({
				title: 'Error',
				description: `Already added ${totalAddedQty} out of ${value?.qty} required`,
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'top-right',
			});
			return;
		}

		const newItem = {
			_id: value?._id,
			image: value?.image,
			name: value?.name,
			price: value?.unitPrice,
			cost: value?.cost,
			vat: value?.vat,
			subTotal: value?.unitPrice * (value.qty || 1),
			qty: value.qty || 1,
		};

		setItems((prevData: any) => [...prevData, newItem]);
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
					<PackProduct
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
				title={`Package for Invoice #${orderData?.invoice}`}
				path='packages'
			/>
			{/* <JsonView data={orderData} /> */}
			<CreateBody
				justify='flex-start'
				pt='82px'>
				<Grid
					gap={4}
					gridTemplateColumns='4fr 1fr'>
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
						{/* <Section>
							<AddressSection
								address={address}
								handleAddress={handleAddress}
							/>
						</Section> */}
					</Column>
					<Section
						maxH='85vh'
						overflowY='scroll'>
						<Column gap={4}>
							{orderData?.items?.map((item: any, i: number) => (
								<Column
									cursor='pointer'
									onClick={() => handleSelectProduct(item)}
									pb={2}
									key={i}
									borderBottomWidth={1}>
									<Heading fontSize='1rem'>{item.name}</Heading>
									<Text fontSize='.8rem'>
										Qty: <strong>{item?.qty}</strong>
									</Text>
									<Text fontSize='.8rem'>
										Price: <strong>BDT. {item?.unitPrice}</strong>
									</Text>
									<div>
										{ifExists(item._id, item?.qty) ? (
											<Badge colorScheme='green'>
												Added ({items.filter((it: any) => it._id === item._id).length}x)
											</Badge>
										) : (
											<Badge colorScheme='red'>Not Added</Badge>
										)}
									</div>
								</Column>
							))}
						</Column>
					</Section>
				</Grid>
			</CreateBody>
		</form>
	);
};

const Section = ({ children, ...props }: FlexProps & { children: ReactNode }) => (
	<Grid
		gridTemplateColumns={{ base: '1fr', md: '1fr' }}
		gap={4}>
		<Container {...props}>{children}</Container>
	</Grid>
);

export default CreatePurchase;
