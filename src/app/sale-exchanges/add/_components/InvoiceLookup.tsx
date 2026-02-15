'use client';

import React, { useState } from 'react';
import {
	Box,
	Input,
	Button,
	Alert,
	AlertIcon,
	Card,
	CardBody,
	Grid,
	GridItem,
	Badge,
	Spinner,
	Flex,
	Text,
} from '@chakra-ui/react';
import { Section, Label, useGetOneQuery } from '@/components/library';

interface InvoiceLookupProps {
	onSaleFound: (sale: any) => void;
}

const InvoiceLookup = ({ onSaleFound }: InvoiceLookupProps) => {
	const [invoice, setInvoice] = useState('');
	const [searchInvoice, setSearchInvoice] = useState('');

	const { data, isFetching, isError } = useGetOneQuery(
		{
			path: `sales/invoice/${searchInvoice}`,
		},
		{
			skip: !searchInvoice,
		},
	);

	const handleSearch = () => {
		if (invoice.trim()) {
			setSearchInvoice(invoice.trim());
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSearch();
		}
	};

	const handleSelect = () => {
		if (data) {
			onSaleFound(data);
		}
	};

	return (
		<Section heading='Find Sale Invoice'>
			<Box w='full'>
				<Flex
					gap={2}
					mb={4}>
					<Input
						placeholder='Enter sale invoice number (e.g., INV-0001)'
						value={invoice}
						onChange={e => setInvoice(e.target.value)}
						onKeyPress={handleKeyPress}
						flex={1}
						bg='white'
						_dark={{ bg: 'gray.800' }}
					/>
					<Button
						colorScheme='blue'
						onClick={handleSearch}
						isLoading={isFetching}>
						Search
					</Button>
				</Flex>

				{isFetching && (
					<Flex
						justify='center'
						py={4}>
						<Spinner />
					</Flex>
				)}

				{isError && searchInvoice && (
					<Alert
						status='error'
						borderRadius='md'>
						<AlertIcon />
						Sale invoice not found. Please check the invoice number and try again.
					</Alert>
				)}

				{data && !isFetching && (
					<Card
						variant='outline'
						borderColor='green.300'>
						<CardBody>
							<Grid
								templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }}
								gap={4}
								mb={4}>
								<GridItem>
									<Label>Invoice</Label>
									<Text fontWeight='bold'>{data.invoice}</Text>
								</GridItem>
								<GridItem>
									<Label>Customer</Label>
									<Text>{data.customer?.name || 'Walk-in Customer'}</Text>
								</GridItem>
								<GridItem>
									<Label>Date</Label>
									<Text>{new Date(data.date).toLocaleDateString()}</Text>
								</GridItem>
								<GridItem>
									<Label>Status</Label>
									<Badge colorScheme={data.status === 'completed' ? 'green' : 'yellow'}>
										{data.status}
									</Badge>
								</GridItem>
								<GridItem>
									<Label>Items</Label>
									<Text>{data.items?.length || 0} item(s)</Text>
								</GridItem>
								<GridItem>
									<Label>Total Amount</Label>
									<Text fontWeight='bold'>৳{Number(data.total || 0).toLocaleString()}</Text>
								</GridItem>
								<GridItem>
									<Label>Warehouse</Label>
									<Text>{data.warehouse?.name || 'N/A'}</Text>
								</GridItem>
								<GridItem>
									<Label>Payment Status</Label>
									<Badge colorScheme={data.paymentStatus === 'paid' ? 'green' : 'orange'}>
										{data.paymentStatus || 'N/A'}
									</Badge>
								</GridItem>
							</Grid>

							<Button
								colorScheme='green'
								onClick={handleSelect}
								w='full'>
								Proceed with Exchange
							</Button>
						</CardBody>
					</Card>
				)}
			</Box>
		</Section>
	);
};

export default InvoiceLookup;
