'use client';

import React, { useState } from 'react';
import {
	useIsMobile,
	Column,
	useRedirect,
	usePostMutation,
	useCustomToast,
	CreateNav,
	CreateBody,
	VSection,
} from '@/components/library';

import { Box, Button, Alert, AlertIcon, useToast } from '@chakra-ui/react';
import { InvoiceLookup, FormSection, ReturnItemsTable, getReturnTotal } from './_components';

type FormType = {
	returnDate: string;
	reason: string;
	condition: string;
	refundMethod: string;
	account: string;
	restockingFee: number;
	reasonNote: string;
	note: string;
	warehouse: string;
};

const CreateSaleReturn = () => {
	const isMobile = useIsMobile();
	const toast = useToast();

	const [saleData, setSaleData] = useState<any>(null);
	const [formData, setFormData] = useState<FormType>({
		returnDate: new Date().toISOString(),
		reason: '',
		condition: 'unopened',
		refundMethod: 'cash',
		account: '',
		restockingFee: 0,
		reasonNote: '',
		note: '',
		warehouse: '',
	});

	const [returnItems, setReturnItems] = useState<any[]>([]);

	const returnTotals = getReturnTotal({
		items: returnItems,
		restockingFee: formData.restockingFee,
	});

	const handleChange = (e: any) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSaleFound = (sale: any) => {
		setSaleData(sale);
		// Pre-populate warehouse from original sale
		if (sale.warehouse) {
			setFormData(prev => ({
				...prev,
				warehouse: typeof sale.warehouse === 'object' ? sale.warehouse._id : sale.warehouse,
			}));
		}
		// Initialize return items from sale items
		const initialItems =
			sale.items?.map((item: any) => ({
				...item,
				qty: item.qty || item.quantity || 0,
				unitPrice: item.unitPrice || item.price || 0,
				returnQty: 0,
			})) || [];
		setReturnItems(initialItems);
	};

	const handleItemChange = (items: any[]) => {
		setReturnItems(items);
	};

	const handleClearSale = () => {
		setSaleData(null);
		setReturnItems([]);
		setFormData({
			returnDate: new Date().toISOString(),
			reason: '',
			condition: 'unopened',
			refundMethod: 'cash',
			account: '',
			restockingFee: 0,
			reasonNote: '',
			note: '',
			warehouse: '',
		});
	};

	const [trigger, result] = usePostMutation();

	useCustomToast({
		...result,
		successText: 'Sale Return created successfully',
	});

	useRedirect({
		isSuccess: result?.isSuccess,
		path: `/sale-returns/${result?.data?.doc?._id}`,
		isLoading: result?.isLoading,
	});

	const handleSubmit = (e: any) => {
		e.preventDefault();

		// Validation
		if (!saleData) {
			toast({
				title: 'Error',
				description: 'Please select a sale invoice first',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'top-right',
			});
			return;
		}

		if (returnTotals.items.length === 0) {
			toast({
				title: 'Error',
				description: 'Please select at least one item to return',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'top-right',
			});
			return;
		}

		if (!formData.reason) {
			toast({
				title: 'Error',
				description: 'Please select a return reason',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'top-right',
			});
			return;
		}

		if (!formData.warehouse) {
			toast({
				title: 'Error',
				description: 'Please select a warehouse for restocking',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'top-right',
			});
			return;
		}

		const createBody = {
			sale: saleData._id,
			saleInvoice: saleData.invoice,
			customer: saleData.customer?._id || saleData.customer,
			items: returnTotals.items,
			subTotal: returnTotals.subTotal,
			total: returnTotals.total,
			refundAmount: returnTotals.refundAmount,
			restockingFee: Number(formData.restockingFee) || 0,
			reason: formData.reason,
			reasonNote: formData.reasonNote,
			condition: formData.condition,
			refundMethod: formData.refundMethod,
			account: formData.account || undefined,
			warehouse: formData.warehouse,
			returnDate: formData.returnDate,
			note: formData.note,
			status: 'completed', // Auto-approve for now
		};

		trigger({
			invalidate: ['salereturns', 'sales', 'stocks', 'customers'],
			path: 'salereturns',
			body: createBody,
		});
	};

	return (
		<CreateBody>
			<form onSubmit={handleSubmit}>
				<CreateNav
					path='sale-returns'
					title='Create Sale Return'
					isLoading={result?.isLoading}
				/>

				<Column
					gap={6}
					py={4}>
					{/* Invoice Lookup Section */}
					{!saleData ? (
						<InvoiceLookup onSaleFound={handleSaleFound} />
					) : (
						<Box>
							<Button
								variant='outline'
								size='sm'
								onClick={handleClearSale}
								mb={4}>
								← Search Different Invoice
							</Button>

							{/* Form Section */}
							<FormSection
								handleChange={handleChange}
								formData={formData}
								returnTotals={returnTotals}
								saleData={saleData}
							/>

							{/* Items Selection Table */}
							<ReturnItemsTable
								saleItems={saleData.items || []}
								returnItems={returnItems}
								onItemChange={handleItemChange}
								isMobile={isMobile}
							/>

							{/* Summary Alert */}
							{returnTotals.totalItems > 0 && (
								<Alert
									status='info'
									borderRadius='md'
									mt={4}>
									<AlertIcon />
									Returning {returnTotals.totalItems} item(s) with total refund of ৳
									{returnTotals.refundAmount.toLocaleString()}
								</Alert>
							)}
						</Box>
					)}
				</Column>
			</form>
		</CreateBody>
	);
};

export default CreateSaleReturn;
