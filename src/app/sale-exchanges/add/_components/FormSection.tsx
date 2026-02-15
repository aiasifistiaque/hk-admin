'use client';

import React from 'react';
import {
	Box,
	Grid,
	GridItem,
	Select,
	Input,
	Textarea,
	Card,
	CardBody,
	Divider,
	Flex,
	Badge,
	Text,
} from '@chakra-ui/react';
import { Section, Label, VDataMenu } from '@/components/library';
import { reasonOptions, conditionOptions } from './options';

interface FormSectionProps {
	handleChange: (e: any) => void;
	formData: any;
	exchangeTotals: any;
	saleData: any;
}

const FormSection = ({ handleChange, formData, exchangeTotals, saleData }: FormSectionProps) => {
	return (
		<Box w='full'>
			{/* Sale Information */}
			<Section heading='Original Sale Information'>
				<Grid
					templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }}
					gap={4}
					w='full'>
					<GridItem>
						<Label>Sale Invoice</Label>
						<Text fontWeight='bold'>{saleData?.invoice}</Text>
					</GridItem>
					<GridItem>
						<Label>Customer</Label>
						<Text>{saleData?.customer?.name || 'Walk-in Customer'}</Text>
					</GridItem>
					<GridItem>
						<Label>Sale Date</Label>
						<Text>{new Date(saleData?.date).toLocaleDateString()}</Text>
					</GridItem>
					<GridItem>
						<Label>Original Amount</Label>
						<Text fontWeight='bold'>৳{Number(saleData?.total || 0).toLocaleString()}</Text>
					</GridItem>
				</Grid>
			</Section>

			{/* Exchange Details */}
			<Section heading='Exchange Details'>
				<Grid
					templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
					gap={4}
					w='full'>
					<GridItem>
						<Label>Warehouse for Restocking</Label>
						<VDataMenu
							model='warehouses'
							name='warehouse'
							value={formData.warehouse}
							onChange={handleChange}
						/>
					</GridItem>
					<GridItem>
						<Label>Exchange Date</Label>
						<Input
							type='date'
							name='exchangeDate'
							value={formData.exchangeDate?.split('T')[0] || ''}
							onChange={handleChange}
							bg='white'
							_dark={{ bg: 'gray.800' }}
						/>
					</GridItem>
					<GridItem>
						<Label>Exchange Reason</Label>
						<Select
							name='reason'
							value={formData.reason}
							onChange={handleChange}
							placeholder='Select reason'
							bg='white'
							_dark={{ bg: 'gray.800' }}>
							{reasonOptions.map((option: { label: string; value: string }) => (
								<option
									key={option.value}
									value={option.value}>
									{option.label}
								</option>
							))}
						</Select>
					</GridItem>
					<GridItem>
						<Label>Item Condition</Label>
						<Select
							name='condition'
							value={formData.condition}
							onChange={handleChange}
							bg='white'
							_dark={{ bg: 'gray.800' }}>
							{conditionOptions.map((option: { label: string; value: string }) => (
								<option
									key={option.value}
									value={option.value}>
									{option.label}
								</option>
							))}
						</Select>
					</GridItem>
					<GridItem colSpan={{ base: 1, md: 2 }}>
						<Label>Reason Note</Label>
						<Textarea
							name='reasonNote'
							value={formData.reasonNote}
							onChange={handleChange}
							placeholder='Additional details about the exchange reason...'
							bg='white'
							_dark={{ bg: 'gray.800' }}
						/>
					</GridItem>
					<GridItem colSpan={{ base: 1, md: 2 }}>
						<Label>Notes</Label>
						<Textarea
							name='note'
							value={formData.note}
							onChange={handleChange}
							placeholder='Any additional notes...'
							bg='white'
							_dark={{ bg: 'gray.800' }}
						/>
					</GridItem>
				</Grid>
			</Section>

			{/* Exchange Summary */}
			<Section heading='Exchange Summary'>
				<Card
					variant='outline'
					w='full'
					bg='white'
					_dark={{ bg: 'gray.800' }}>
					<CardBody>
						<Grid
							templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
							gap={4}>
							<GridItem>
								<Label>Items Being Returned</Label>
								<Text
									fontSize='lg'
									fontWeight='bold'>
									{exchangeTotals.totalReturnItems} item(s)
								</Text>
							</GridItem>
							<GridItem>
								<Label>Items Being Exchanged</Label>
								<Text
									fontSize='lg'
									fontWeight='bold'>
									{exchangeTotals.totalExchangeItems} item(s)
								</Text>
							</GridItem>
						</Grid>
						<Divider my={4} />
						<Flex
							justify='space-between'
							align='center'
							py={2}>
							<Text>Return Value</Text>
							<Text fontWeight='bold'>৳{exchangeTotals.returnTotal.toLocaleString()}</Text>
						</Flex>
						<Flex
							justify='space-between'
							align='center'
							py={2}>
							<Text>New Items Value</Text>
							<Text fontWeight='bold'>৳{exchangeTotals.exchangeTotal.toLocaleString()}</Text>
						</Flex>
						<Divider my={2} />
						<Flex
							justify='space-between'
							align='center'
							py={2}>
							<Text fontWeight='bold'>Price Difference</Text>
							<Box>
								<Badge
									colorScheme={exchangeTotals.customerOwes ? 'red' : 'green'}
									fontSize='md'
									p={2}>
									{exchangeTotals.customerOwes ? 'Customer Pays: ' : 'Refund to Customer: '}৳
									{Math.abs(exchangeTotals.priceDifference).toLocaleString()}
								</Badge>
							</Box>
						</Flex>
					</CardBody>
				</Card>
			</Section>
		</Box>
	);
};

export default FormSection;
