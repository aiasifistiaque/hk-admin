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
} from '@/components/library';

import { Grid, Table, Thead, Tbody, Th, useToast } from '@chakra-ui/react';
import { HEADINGS, HeadingProps, getInvoiceTotal, FormSection } from './_components';
import PurchaseProduct from '@/components/library/page/order/AdjustProduct';
// import QcMain from '@/components/new/QcMain';

const CreatePurchase = () => {
	const isMobile = useIsMobile();
	const toast = useToast();

	const [formData, setFormData] = useState<any>({
		date: new Date().toISOString(),
		warehouse: '',
		reason: 'Regular Adjustment',
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

	const setItem = ({ adjustmentQty, adjustedQty, item }: any) => {
		// Create a new array with the updated items
		const newItems: any[] = items.map((existingItem: any) => {
			if (existingItem._id === item._id) {
				return {
					...existingItem,
					adjustedQty: adjustedQty,
					adjustmentQty: adjustmentQty,
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
		successText: 'Stock Adjustment Created successfully',
	});

	useRedirect({
		isSuccess: result?.isSuccess,
		path: `/adjustments`,
		isLoading: result?.isLoading,
	});

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
			date: formData?.date,
			reason: formData?.reason,
			warehouse: formData?.warehouse,
			items: items,
		};

		trigger({
			invalidate: ['adjustments', 'stocks', 'items'],
			path: 'adjustments',
			body: createBody,
		});
	};

	useEffect(() => {
		setItems([]);
	}, [formData.warehouse]);

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
		<form onSubmit={handleSubmit}>
			<CreateNav
				isLoading={result?.isLoading}
				title='Stock Adjustment'
				path='adjustments'
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
					{/* <JsonView data={items} /> */}

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
