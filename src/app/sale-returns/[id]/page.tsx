'use client';
import React from 'react';
import { Layout, useGetByIdQuery, Column, Section, Label } from '@/components/library';
import { useParams } from 'next/navigation';
import {
	Box,
	Grid,
	GridItem,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Badge,
	Flex,
	Divider,
	Text,
} from '@chakra-ui/react';

const getStatusColor = (status: string) => {
	switch (status) {
		case 'completed':
			return 'green';
		case 'approved':
			return 'blue';
		case 'pending':
			return 'yellow';
		case 'rejected':
			return 'red';
		default:
			return 'gray';
	}
};

const SaleReturnDetailPage = () => {
	const { id }: { id: string } = useParams();

	const { data, isFetching, isLoading } = useGetByIdQuery(
		{
			path: 'salereturns',
			id: id,
		},
		{
			skip: !id,
		},
	);

	return (
		<Layout
			path='sale-returns'
			isLoading={isLoading || isFetching}
			title={`Sale Return: ${data?.invoice || ''}`}>
			<Column
				gap={6}
				py={4}>
				{/* Header Section */}
				<Section heading='Return Information'>
					<Grid
						templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
						gap={4}
						w='full'>
						<GridItem>
							<Label>Return Invoice</Label>
							<Text fontWeight='bold'>{data?.invoice}</Text>
						</GridItem>
						<GridItem>
							<Label>Original Sale Invoice</Label>
							<Text>{data?.saleInvoice}</Text>
						</GridItem>
						<GridItem>
							<Label>Status</Label>
							<Badge colorScheme={getStatusColor(data?.status)}>{data?.status}</Badge>
						</GridItem>
						<GridItem>
							<Label>Customer</Label>
							<Text>{data?.customer?.name || 'N/A'}</Text>
						</GridItem>
						<GridItem>
							<Label>Return Date</Label>
							<Text>
								{data?.returnDate ? new Date(data.returnDate).toLocaleDateString() : 'N/A'}
							</Text>
						</GridItem>
						<GridItem>
							<Label>Warehouse</Label>
							<Text>{data?.warehouse?.name || 'N/A'}</Text>
						</GridItem>
					</Grid>
				</Section>

				{/* Return Reason Section */}
				<Section heading='Return Details'>
					<Grid
						templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
						gap={4}
						w='full'>
						<GridItem>
							<Label>Reason</Label>
							<Text textTransform='capitalize'>{data?.reason?.replace(/_/g, ' ')}</Text>
						</GridItem>
						<GridItem>
							<Label>Item Condition</Label>
							<Text textTransform='capitalize'>{data?.condition}</Text>
						</GridItem>
						<GridItem>
							<Label>Refund Method</Label>
							<Text textTransform='capitalize'>{data?.refundMethod}</Text>
						</GridItem>
						{data?.reasonNote && (
							<GridItem colSpan={{ base: 1, md: 3 }}>
								<Label>Reason Note</Label>
								<Text>{data?.reasonNote}</Text>
							</GridItem>
						)}
					</Grid>
				</Section>

				{/* Items Table */}
				<Section heading='Returned Items'>
					<Box
						overflowX='auto'
						w='full'>
						<Table variant='simple'>
							<Thead>
								<Tr>
									<Th>Product</Th>
									<Th>Variant</Th>
									<Th isNumeric>Quantity</Th>
									<Th isNumeric>Unit Price</Th>
									<Th isNumeric>Total</Th>
								</Tr>
							</Thead>
							<Tbody>
								{data?.items?.map((item: any, index: number) => (
									<Tr key={index}>
										<Td>{item.name || item.product?.name || 'N/A'}</Td>
										<Td>{item.variant || 'N/A'}</Td>
										<Td isNumeric>{item.quantity}</Td>
										<Td isNumeric>৳{Number(item.price || 0).toLocaleString()}</Td>
										<Td isNumeric>৳{Number(item.total || 0).toLocaleString()}</Td>
									</Tr>
								))}
							</Tbody>
						</Table>
					</Box>
				</Section>

				{/* Summary Section */}
				<Section heading='Financial Summary'>
					<Grid
						templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
						gap={4}
						w='full'>
						<GridItem>
							<Flex
								justify='space-between'
								py={2}>
								<Text>Subtotal</Text>
								<Text>৳{Number(data?.subTotal || 0).toLocaleString()}</Text>
							</Flex>
							<Divider />
							<Flex
								justify='space-between'
								py={2}>
								<Text>Restocking Fee</Text>
								<Text color='red.500'>- ৳{Number(data?.restockingFee || 0).toLocaleString()}</Text>
							</Flex>
							<Divider />
							<Flex
								justify='space-between'
								py={2}>
								<Text fontWeight='bold'>Total Refund</Text>
								<Text fontWeight='bold'>৳{Number(data?.refundAmount || 0).toLocaleString()}</Text>
							</Flex>
						</GridItem>
					</Grid>
				</Section>

				{/* Notes */}
				{data?.note && (
					<Section heading='Notes'>
						<Text>{data?.note}</Text>
					</Section>
				)}
			</Column>
		</Layout>
	);
};

export default SaleReturnDetailPage;
