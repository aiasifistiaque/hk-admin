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
} from '@/components/library';

import { Box, Button, Alert, AlertIcon, useToast } from '@chakra-ui/react';
import {
	InvoiceLookup,
	FormSection,
	ReturnItemsTable,
	ExchangeItemsSection,
	getExchangeTotals,
} from './_components';

type FormType = {
	exchangeDate: string;
	reason: string;
	condition: string;
	reasonNote: string;
	note: string;
	warehouse: string;
};

const CreateSaleExchange = () => {
	const isMobile = useIsMobile();
	const toast = useToast();

	const [saleData, setSaleData] = useState<any>(null);
	const [formData, setFormData] = useState<FormType>({
		exchangeDate: new Date().toISOString(),
		reason: '',
		condition: 'unopened',
		reasonNote: '',
		note: '',
		warehouse: '',
	});

	const [returnItems, setReturnItems] = useState<any[]>([]);
	const [exchangeItems, setExchangeItems] = useState<any[]>([]);

	const exchangeTotals = getExchangeTotals({
		returnItems,
		exchangeItems,
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
				quantity: item.qty || item.quantity || 0,
				price: item.unitPrice || item.price || 0,
				returnQty: 0,
			})) || [];
		setReturnItems(initialItems);
	};

	const handleReturnItemChange = (items: any[]) => {
		setReturnItems(items);
	};

	const handleExchangeItemChange = (items: any[]) => {
		setExchangeItems(items);
	};

	const handleClearSale = () => {
		setSaleData(null);
		setReturnItems([]);
		setExchangeItems([]);
		setFormData({
			exchangeDate: new Date().toISOString(),
			reason: '',
			condition: 'unopened',
			reasonNote: '',
			note: '',
			warehouse: '',
		});
	};

	const [trigger, result] = usePostMutation();

	useCustomToast({
		...result,
		successText: 'Sale Exchange created successfully',
	});

	useRedirect({
		isSuccess: result?.isSuccess,
		path: `/sale-exchanges/${result?.data?.doc?._id}`,
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

		if (exchangeTotals.returnItems.length === 0) {
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

		if (exchangeTotals.exchangeItems.length === 0) {
			toast({
				title: 'Error',
				description: 'Please add at least one item for exchange',
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
				description: 'Please select an exchange reason',
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
				description: 'Please select a warehouse',
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
			returnItems: exchangeTotals.returnItems,
			exchangeItems: exchangeTotals.exchangeItems,
			returnTotal: exchangeTotals.returnTotal,
			exchangeTotal: exchangeTotals.exchangeTotal,
			priceDifference: exchangeTotals.priceDifference,
			customerOwes: exchangeTotals.customerOwes,
			reason: formData.reason,
			reasonNote: formData.reasonNote,
			condition: formData.condition,
			warehouse: formData.warehouse,
			exchangeDate: formData.exchangeDate,
			note: formData.note,
			status: 'completed', // Auto-approve for now
		};

		trigger({
			invalidate: ['saleexchanges', 'sales', 'stocks', 'customers'],
			path: 'saleexchanges',
			body: createBody,
		});
	};

	return (
		<CreateBody>
			<form onSubmit={handleSubmit}>
				<CreateNav
					path='sale-exchanges'
					title='Create Sale Exchange'
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

							{/* Return Items Selection */}
							<ReturnItemsTable
								saleItems={saleData.items || []}
								returnItems={returnItems}
								onItemChange={handleReturnItemChange}
								isMobile={isMobile}
							/>

							{/* Exchange Items Selection */}
							<ExchangeItemsSection
								exchangeItems={exchangeItems}
								onItemsChange={handleExchangeItemChange}
								isMobile={isMobile}
							/>

							{/* Form Section with Summary */}
							<FormSection
								handleChange={handleChange}
								formData={formData}
								exchangeTotals={exchangeTotals}
								saleData={saleData}
							/>

							{/* Summary Alert */}
							{(exchangeTotals.totalReturnItems > 0 || exchangeTotals.totalExchangeItems > 0) && (
								<Alert
									status={exchangeTotals.customerOwes ? 'warning' : 'success'}
									borderRadius='md'
									mt={4}>
									<AlertIcon />
									{exchangeTotals.customerOwes
										? `Customer needs to pay additional ৳${Math.abs(
												exchangeTotals.priceDifference,
											).toLocaleString()}`
										: `Refund ৳${Math.abs(
												exchangeTotals.priceDifference,
											).toLocaleString()} to customer`}
								</Alert>
							)}
						</Box>
					)}
				</Column>
			</form>
		</CreateBody>
	);
};

export default CreateSaleExchange;
