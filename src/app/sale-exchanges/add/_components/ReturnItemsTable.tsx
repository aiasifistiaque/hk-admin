'use client';

import React from 'react';
import {
	Box,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Checkbox,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
	Badge,
	Text,
} from '@chakra-ui/react';
import { Section } from '@/components/library';
import { headings } from './headings';

interface ReturnItemsTableProps {
	saleItems: any[];
	returnItems: any[];
	onItemChange: (items: any[]) => void;
	isMobile?: boolean;
}

const ReturnItemsTable = ({
	saleItems,
	returnItems,
	onItemChange,
	isMobile,
}: ReturnItemsTableProps) => {
	const handleCheckboxChange = (index: number, checked: boolean) => {
		const updated = [...returnItems];
		if (checked) {
			updated[index] = {
				...updated[index],
				returnQty: 1,
			};
		} else {
			updated[index] = {
				...updated[index],
				returnQty: 0,
			};
		}
		onItemChange(updated);
	};

	const handleQtyChange = (index: number, value: number) => {
		const updated = [...returnItems];
		const maxQty = saleItems[index]?.qty || saleItems[index]?.quantity || 1;
		const qty = Math.min(Math.max(0, value), maxQty);
		updated[index] = {
			...updated[index],
			returnQty: qty,
		};
		onItemChange(updated);
	};

	const selectedCount = returnItems.filter(item => item.returnQty > 0).length;

	return (
		<Section heading={`Select Items to Return (${selectedCount} selected)`}>
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
							{headings.map(h => (
								<Th
									key={h.key}
									w={h.w}>
									{h.label}
								</Th>
							))}
						</Tr>
					</Thead>
					<Tbody>
						{returnItems.map((item, index) => {
							const isSelected = item.returnQty > 0;
							const originalItem = saleItems[index];
							return (
								<Tr
									key={index}
									bg={isSelected ? 'red.50' : undefined}
									_dark={isSelected ? { bg: 'red.900' } : undefined}>
									<Td>
										<Checkbox
											isChecked={isSelected}
											onChange={e => handleCheckboxChange(index, e.target.checked)}
											colorScheme='red'
										/>
									</Td>
									<Td>
										<Text fontWeight={isSelected ? 'bold' : 'normal'}>
											{item.name || originalItem?.product?.name || 'N/A'}
										</Text>
									</Td>
									<Td>
										<Badge>{item.variant || 'N/A'}</Badge>
									</Td>
									<Td>
										<Text>{originalItem?.qty || originalItem?.quantity || 0}</Text>
									</Td>
									<Td>
										<NumberInput
											size='sm'
											min={0}
											max={originalItem?.qty || originalItem?.quantity || 0}
											value={item.returnQty || 0}
											onChange={(_, val) => handleQtyChange(index, val)}
											isDisabled={!isSelected}
											w='100px'
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
										<Text>৳{Number(item.unitPrice || item.price || 0).toLocaleString()}</Text>
									</Td>
									<Td isNumeric>
										<Text fontWeight='bold'>
											৳
											{(
												(item.returnQty || 0) * (item.unitPrice || item.price || 0)
											).toLocaleString()}
										</Text>
									</Td>
								</Tr>
							);
						})}
					</Tbody>
				</Table>
			</Box>
		</Section>
	);
};

export default ReturnItemsTable;
