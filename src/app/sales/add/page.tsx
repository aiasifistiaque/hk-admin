'use client';

import React, { ReactNode, useEffect, useRef, useState } from 'react';
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
	useExportMutation,
} from '@/components/library';

import { Button, Grid, Table, Thead, Tbody, Th, useToast } from '@chakra-ui/react';
import {
	HEADINGS,
	HeadingProps,
	getInvoiceTotal,
	FormSection,
	AddressSection,
} from './_components';
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
	const printAfterSave = useRef(false);
	const formRef = useRef<HTMLFormElement>(null);

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
	const [exportTrigger, exportResult] = useExportMutation();

	useCustomToast({
		...result,
		successText: 'Invoice Created Successfully',
	});

	// Handle redirect & print after save
	useEffect(() => {
		if (!result?.isLoading && result?.isSuccess && result?.data?.doc?.id) {
			if (printAfterSave.current) {
				printAfterSave.current = false;
				exportTrigger({
					path: 'sales',
					body: { id: result.data.doc.id },
					type: 'invoice/dl',
				});
			}
			// Redirect after a brief delay to allow download to start
		}
	}, [result?.isLoading, result?.isSuccess]);

	useRedirect({
		isSuccess: result?.isSuccess,
		path: `/sales/${result?.data?.doc?.id}`,
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
			customer: formData?.customer,
			total: invoice?.total,
			subTotal: invoice?.subTotal,
			account: formData?.paymentMethod,
			paidAmount: Number(formData?.paidAmount),
			// origin: 'invoice',
			shippingCharge: Number(invoice?.shipping || 0),
			discount: Number(invoice?.discount || 0),
			dueAmount: invoice?.total - Number(formData?.paidAmount || 0),
			items: invoice?.items,
			orderDate: formData?.date,
			warehouse: formData?.warehouse,
		};

		trigger({
			invalidate: ['sales', 'products', 'orders'],
			path: 'sales',
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
					<PurchaseProduct
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
		<form ref={formRef} onSubmit={handleSubmit}>
			<CreateNav
				isLoading={result?.isLoading}
				title='Invoice'
				path='sales'
				extraButtons={
					<Button
						size='sm'
						colorScheme='green'
						isLoading={result?.isLoading || exportResult?.isLoading}
						onClick={() => {
							printAfterSave.current = true;
							formRef.current?.requestSubmit();
						}}>
						Save &amp; Print
					</Button>
				}
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
