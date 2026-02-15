'use client';

import React, { FC, useState, useEffect } from 'react';
import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Input,
	Box,
	Text,
	Image,
	HStack,
	IconButton,
	Checkbox,
	useColorModeValue,
} from '@chakra-ui/react';
import { Icon, Section } from '@/components/library';
import { HEADINGS, HeadingProps } from '.';

type ReturnItemsTableProps = {
	saleItems: any[];
	returnItems: any[];
	onItemChange: (items: any[]) => void;
	isMobile?: boolean;
};

type ReturnItemRowProps = {
	item: any;
	index: number;
	onQtyChange: (index: number, qty: number) => void;
	onToggleSelect: (index: number, selected: boolean) => void;
};

const ReturnItemRow: FC<ReturnItemRowProps> = ({ item, index, onQtyChange, onToggleSelect }) => {
	const [returnQty, setReturnQty] = useState(item.returnQty || 0);
	const borderColor = useColorModeValue('gray.200', 'gray.600');

	useEffect(() => {
		setReturnQty(item.returnQty || 0);
	}, [item.returnQty]);

	const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let newQty = parseInt(e.target.value) || 0;
		// Limit to original qty
		if (newQty > item.qty) newQty = item.qty;
		if (newQty < 0) newQty = 0;

		setReturnQty(newQty);
		onQtyChange(index, newQty);
	};

	const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selected = e.target.checked;
		onToggleSelect(index, selected);
		if (selected && returnQty === 0) {
			setReturnQty(item.qty);
			onQtyChange(index, item.qty);
		} else if (!selected) {
			setReturnQty(0);
			onQtyChange(index, 0);
		}
	};

	return (
		<Tr
			borderBottom='1px solid'
			borderColor={borderColor}>
			<Td>
				<HStack>
					<Checkbox
						isChecked={returnQty > 0}
						onChange={handleSelectChange}
						colorScheme='brand'
					/>
					<Text>{index + 1}</Text>
				</HStack>
			</Td>
			<Td>
				<HStack>
					{item.image && (
						<Image
							src={item.image}
							alt={item.name}
							boxSize='40px'
							objectFit='cover'
							borderRadius='md'
						/>
					)}
					<Text fontSize='sm'>{item.name}</Text>
				</HStack>
			</Td>
			<Td isNumeric>
				<Text>{item.qty}</Text>
			</Td>
			<Td>
				<Input
					size='sm'
					type='number'
					value={returnQty}
					onChange={handleQtyChange}
					min={0}
					max={item.qty}
					width='80px'
					textAlign='center'
				/>
			</Td>
			<Td isNumeric>৳{item.unitPrice?.toLocaleString()}</Td>
			<Td isNumeric>
				<Text fontWeight={returnQty > 0 ? 'bold' : 'normal'}>
					৳{(item.unitPrice * returnQty).toLocaleString()}
				</Text>
			</Td>
			<Td>
				{returnQty > 0 && (
					<IconButton
						aria-label='Remove'
						icon={<Icon name='delete' />}
						size='sm'
						variant='ghost'
						colorScheme='red'
						onClick={() => {
							setReturnQty(0);
							onQtyChange(index, 0);
						}}
					/>
				)}
			</Td>
		</Tr>
	);
};

const ReturnItemsTable: React.FC<ReturnItemsTableProps> = ({
	saleItems,
	returnItems,
	onItemChange,
	isMobile,
}) => {
	const [items, setItems] = useState<any[]>([]);

	useEffect(() => {
		// Initialize items with returnQty from returnItems or 0
		const initializedItems = saleItems.map((saleItem: any) => {
			const existingReturn = returnItems.find((r: any) => r._id === saleItem._id);
			return {
				...saleItem,
				qty: saleItem.qty || saleItem.quantity || 0,
				unitPrice: saleItem.unitPrice || saleItem.price || 0,
				returnQty: existingReturn?.returnQty || 0,
			};
		});
		setItems(initializedItems);
	}, [saleItems]);

	const handleQtyChange = (index: number, qty: number) => {
		const updatedItems = [...items];
		updatedItems[index] = {
			...updatedItems[index],
			returnQty: qty,
		};
		setItems(updatedItems);
		onItemChange(updatedItems);
	};

	const handleToggleSelect = (index: number, selected: boolean) => {
		const updatedItems = [...items];
		updatedItems[index] = {
			...updatedItems[index],
			returnQty: selected ? updatedItems[index].qty : 0,
		};
		setItems(updatedItems);
		onItemChange(updatedItems);
	};

	const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selected = e.target.checked;
		const updatedItems = items.map(item => ({
			...item,
			returnQty: selected ? item.qty : 0,
		}));
		setItems(updatedItems);
		onItemChange(updatedItems);
	};

	const allSelected = items.length > 0 && items.every(item => item.returnQty > 0);
	const someSelected = items.some(item => item.returnQty > 0);

	return (
		<Section
			heading={`Select Items to Return (${items.filter(i => i.returnQty > 0).length} selected)`}>
			<Box
				overflowX='auto'
				border='1px solid'
				borderColor='gray.200'
				borderRadius='md'
				bg='white'
				_dark={{ borderColor: 'gray.600', bg: 'gray.800' }}>
				<Table
					size='sm'
					variant='simple'>
					<Thead
						bg='gray.50'
						_dark={{ bg: 'gray.700' }}>
						<Tr>
							<Th>
								<HStack>
									<Checkbox
										isChecked={allSelected}
										isIndeterminate={someSelected && !allSelected}
										onChange={handleSelectAll}
										colorScheme='brand'
									/>
									<Text>#</Text>
								</HStack>
							</Th>
							{HEADINGS.slice(1).map((heading: HeadingProps, i: number) => (
								<Th
									key={i}
									isNumeric={heading.isNumeric}>
									{heading.content}
								</Th>
							))}
						</Tr>
					</Thead>
					<Tbody>
						{items.map((item: any, i: number) => (
							<ReturnItemRow
								key={item._id || i}
								item={item}
								index={i}
								onQtyChange={handleQtyChange}
								onToggleSelect={handleToggleSelect}
							/>
						))}
					</Tbody>
				</Table>
			</Box>

			{items.length === 0 && (
				<Box
					textAlign='center'
					py={8}
					color='gray.500'>
					<Text>No items available for return</Text>
				</Box>
			)}
		</Section>
	);
};

export default ReturnItemsTable;
