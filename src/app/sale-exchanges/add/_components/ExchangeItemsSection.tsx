'use client';

import React, { useState } from 'react';
import {
	Box,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Button,
	IconButton,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
	Badge,
	Flex,
	Input,
	Alert,
	AlertIcon,
	Text,
} from '@chakra-ui/react';
import { Section, useGetAllQuery } from '@/components/library';
import { exchangeHeadings } from './headings';
import { DeleteIcon, AddIcon, SearchIcon } from '@chakra-ui/icons';

interface ExchangeItemsSectionProps {
	exchangeItems: any[];
	onItemsChange: (items: any[]) => void;
	isMobile?: boolean;
}

const ExchangeItemsSection = ({
	exchangeItems,
	onItemsChange,
	isMobile,
}: ExchangeItemsSectionProps) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [isSearching, setIsSearching] = useState(false);

	const { data: stockData, isFetching } = useGetAllQuery(
		{
			path: 'stocks',
			limit: 20,
			filters: {
				search: searchTerm,
				quantity_gte: 1, // Only show items in stock
			},
		},
		{
			skip: !searchTerm || searchTerm.length < 2,
		},
	);

	const handleSearch = () => {
		if (searchTerm.length >= 2) {
			setIsSearching(true);
		}
	};

	const handleAddItem = (stock: any) => {
		// Check if already added
		const existingIndex = exchangeItems.findIndex(
			item => item.product === stock.product?._id && item.variant === stock.variant,
		);

		if (existingIndex >= 0) {
			// Increase quantity
			const updated = [...exchangeItems];
			updated[existingIndex] = {
				...updated[existingIndex],
				quantity: updated[existingIndex].quantity + 1,
			};
			onItemsChange(updated);
		} else {
			// Add new item
			const newItem = {
				product: stock.product?._id || stock.product,
				name: stock.product?.name || stock.name || 'N/A',
				variant: stock.variant || '',
				stock: stock.quantity || 0,
				quantity: 1,
				price: stock.product?.price || stock.price || 0,
				cost: stock.product?.cost || stock.cost || 0,
				stockId: stock._id,
			};
			onItemsChange([...exchangeItems, newItem]);
		}
	};

	const handleRemoveItem = (index: number) => {
		const updated = exchangeItems.filter((_, i) => i !== index);
		onItemsChange(updated);
	};

	const handleQtyChange = (index: number, value: number) => {
		const updated = [...exchangeItems];
		const maxQty = updated[index].stock || 999;
		const qty = Math.min(Math.max(1, value), maxQty);
		updated[index] = {
			...updated[index],
			quantity: qty,
		};
		onItemsChange(updated);
	};

	return (
		<Section heading='Select Items for Exchange'>
			{/* Search Box */}
			<Box mb={4}>
				<Flex gap={2}>
					<Input
						placeholder='Search products by name, SKU, barcode...'
						value={searchTerm}
						onChange={e => {
							setSearchTerm(e.target.value);
							if (e.target.value.length >= 2) {
								setIsSearching(true);
							}
						}}
						onKeyPress={e => e.key === 'Enter' && handleSearch()}
						bg='white'
						_dark={{ bg: 'gray.800' }}
					/>
					<IconButton
						aria-label='Search'
						icon={<SearchIcon />}
						onClick={handleSearch}
						isLoading={isFetching}
					/>
				</Flex>

				{/* Search Results */}
				{isSearching && searchTerm.length >= 2 && (
					<Box
						mt={2}
						p={2}
						borderWidth={1}
						borderRadius='md'
						maxH='200px'
						overflowY='auto'
						bg='white'
						_dark={{ bg: 'gray.800' }}>
						{isFetching && <Text>Searching...</Text>}
						{!isFetching && (!stockData?.data || stockData.data.length === 0) && (
							<Text color='gray.500'>No products found</Text>
						)}
						{stockData?.data?.map((stock: any) => (
							<Flex
								key={stock._id}
								justify='space-between'
								align='center'
								p={2}
								borderBottomWidth={1}
								_last={{ borderBottomWidth: 0 }}
								_hover={{ bg: 'gray.50' }}
								cursor='pointer'>
								<Box>
									<Text fontWeight='bold'>{stock.product?.name || stock.name}</Text>
									<Text
										fontSize='sm'
										color='gray.500'>
										{stock.variant && `Variant: ${stock.variant} | `}
										In Stock: {stock.quantity} | Price: ৳
										{Number(stock.product?.price || stock.price || 0).toLocaleString()}
									</Text>
								</Box>
								<IconButton
									aria-label='Add'
									icon={<AddIcon />}
									size='sm'
									colorScheme='green'
									onClick={() => handleAddItem(stock)}
								/>
							</Flex>
						))}
					</Box>
				)}
			</Box>

			{/* Selected Exchange Items Table */}
			{exchangeItems.length === 0 ? (
				<Alert
					status='info'
					borderRadius='md'>
					<AlertIcon />
					No items added for exchange. Search and add items above.
				</Alert>
			) : (
				<Box
					overflowX='auto'
					w='full'
					bg='white'
					_dark={{ bg: 'gray.800' }}
					borderRadius='md'>
					<Table
						variant='simple'
						size={isMobile ? 'sm' : 'md'}>
						<Thead>
							<Tr>
								{exchangeHeadings.map(h => (
									<Th
										key={h.key}
										w={h.w}>
										{h.label}
									</Th>
								))}
							</Tr>
						</Thead>
						<Tbody>
							{exchangeItems.map((item, index) => (
								<Tr
									key={index}
									bg='green.50'
									_dark={{ bg: 'green.900' }}>
									<Td>
										<Text fontWeight='bold'>{item.name}</Text>
									</Td>
									<Td>
										<Badge colorScheme='blue'>{item.variant || 'N/A'}</Badge>
									</Td>
									<Td>
										<Text>{item.stock}</Text>
									</Td>
									<Td>
										<NumberInput
											size='sm'
											min={1}
											max={item.stock || 999}
											value={item.quantity || 1}
											onChange={(_, val) => handleQtyChange(index, val)}
											w='80px'
											bg='white'
											_dark={{ bg: 'gray.700' }}>
											<NumberInputField />
											<NumberInputStepper>
												<NumberIncrementStepper />
												<NumberDecrementStepper />
											</NumberInputStepper>
										</NumberInput>
									</Td>
									<Td isNumeric>
										<Text>৳{Number(item.price || 0).toLocaleString()}</Text>
									</Td>
									<Td isNumeric>
										<Text fontWeight='bold'>
											৳{((item.quantity || 0) * (item.price || 0)).toLocaleString()}
										</Text>
									</Td>
									<Td>
										<IconButton
											aria-label='Remove'
											icon={<DeleteIcon />}
											size='sm'
											colorScheme='red'
											variant='ghost'
											onClick={() => handleRemoveItem(index)}
										/>
									</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</Box>
			)}
		</Section>
	);
};

export default ExchangeItemsSection;
