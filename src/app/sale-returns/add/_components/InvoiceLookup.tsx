'use client';

import React, { useState, KeyboardEvent } from 'react';
import {
	Box,
	Button,
	Input,
	InputGroup,
	InputRightElement,
	Text,
	Alert,
	AlertIcon,
	Spinner,
	Card,
	CardBody,
	HStack,
	VStack,
	Badge,
} from '@chakra-ui/react';
import { Column, Section, Icon, useGetQuery } from '@/components/library';

type InvoiceLookupProps = {
	onSaleFound: (sale: any) => void;
	isDisabled?: boolean;
};

const InvoiceLookup: React.FC<InvoiceLookupProps> = ({ onSaleFound, isDisabled }) => {
	const [invoiceNumber, setInvoiceNumber] = useState('');
	const [searchTrigger, setSearchTrigger] = useState('');

	const { data, isFetching, isError, error } = useGetQuery(
		{ path: `sales/invoice/${searchTrigger}` },
		{ skip: !searchTrigger },
	);

	const handleSearch = () => {
		if (invoiceNumber.trim()) {
			setSearchTrigger(invoiceNumber.trim());
		}
	};

	const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSearch();
		}
	};

	const handleSelectSale = () => {
		if (data?.data) {
			onSaleFound(data.data);
			setInvoiceNumber('');
			setSearchTrigger('');
		}
	};

	return (
		<Section heading='Find Sale Invoice'>
			<Column gap={4}>
				<Box>
					<Text
						fontSize='sm'
						mb={2}
						color='gray.600'
						_dark={{ color: 'gray.400' }}>
						Enter the invoice number to process return
					</Text>
					<InputGroup size='md'>
						<Input
							placeholder='Enter invoice number (e.g., 0001)'
							value={invoiceNumber}
							onChange={e => setInvoiceNumber(e.target.value)}
							onKeyPress={handleKeyPress}
							isDisabled={isDisabled || isFetching}
							bg='white'
							_dark={{ bg: 'sidebar.dark' }}
						/>
						<InputRightElement width='4.5rem'>
							<Button
								h='1.75rem'
								size='sm'
								onClick={handleSearch}
								isLoading={isFetching}
								isDisabled={!invoiceNumber.trim() || isDisabled}
								colorScheme='brand'>
								Search
							</Button>
						</InputRightElement>
					</InputGroup>
				</Box>

				{isFetching && (
					<HStack
						justify='center'
						py={4}>
						<Spinner size='sm' />
						<Text>Searching for invoice...</Text>
					</HStack>
				)}

				{isError && (
					<Alert
						status='error'
						borderRadius='md'>
						<AlertIcon />
						{(error as any)?.data?.message || 'Sale not found. Please check the invoice number.'}
					</Alert>
				)}

				{data?.data && !isFetching && (
					<Card
						variant='outline'
						borderColor='brand.500'>
						<CardBody>
							<VStack
								align='stretch'
								spacing={3}>
								<HStack justify='space-between'>
									<Text fontWeight='bold'>Invoice #{data.data.invoice}</Text>
									<Badge colorScheme={data.data.status === 'pending' ? 'yellow' : 'green'}>
										{data.data.status}
									</Badge>
								</HStack>

								<HStack justify='space-between'>
									<Text
										fontSize='sm'
										color='gray.600'>
										Customer:
									</Text>
									<Text fontSize='sm'>
										{data.data.customer?.name || 'Guest'} ({data.data.phone || 'N/A'})
									</Text>
								</HStack>

								<HStack justify='space-between'>
									<Text
										fontSize='sm'
										color='gray.600'>
										Date:
									</Text>
									<Text fontSize='sm'>{new Date(data.data.orderDate).toLocaleDateString()}</Text>
								</HStack>

								<HStack justify='space-between'>
									<Text
										fontSize='sm'
										color='gray.600'>
										Total Items:
									</Text>
									<Text fontSize='sm'>{data.data.items?.length || 0} items</Text>
								</HStack>

								<HStack justify='space-between'>
									<Text
										fontSize='sm'
										color='gray.600'>
										Total Amount:
									</Text>
									<Text
										fontSize='sm'
										fontWeight='bold'>
										৳{data.data.total?.toLocaleString()}
									</Text>
								</HStack>

								{data.data.returnAmount > 0 && (
									<HStack justify='space-between'>
										<Text
											fontSize='sm'
											color='orange.600'>
											Previous Returns:
										</Text>
										<Text
											fontSize='sm'
											color='orange.600'>
											৳{data.data.returnAmount?.toLocaleString()}
										</Text>
									</HStack>
								)}

								<Button
									colorScheme='brand'
									onClick={handleSelectSale}
									isDisabled={isDisabled}
									mt={2}>
									Select This Invoice
								</Button>
							</VStack>
						</CardBody>
					</Card>
				)}
			</Column>
		</Section>
	);
};

export default InvoiceLookup;
