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
	Card,
	CardBody,
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

const SaleExchangeDetailPage = () => {
	const { id }: { id: string } = useParams();

	const { data, isFetching, isLoading } = useGetByIdQuery(
		{
			path: 'saleexchanges',
			id: id,
		},
		{
			skip: !id,
		},
	);

	return (
		<Layout
			path='sale-exchanges'
			isLoading={isLoading || isFetching}
			title={`Sale Exchange: ${data?.invoice || ''}`}>
			<Column
				gap={6}
				py={4}>
				{/* Header Section */}
				<Section heading='Exchange Information'>
					<Grid
						templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
						gap={4}
						w='full'>
						<GridItem>
							<Label>Exchange Invoice</Label>
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
							<Label>Exchange Date</Label>
							<Text>
								{data?.exchangeDate ? new Date(data.exchangeDate).toLocaleDateString() : 'N/A'}
							</Text>
						</GridItem>
						<GridItem>
							<Label>Warehouse</Label>
							<Text>{data?.warehouse?.name || 'N/A'}</Text>
						</GridItem>
					</Grid>
				</Section>

				{/* Exchange Reason Section */}
				<Section heading='Exchange Details'>
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
						{data?.reasonNote && (
							<GridItem colSpan={{ base: 1, md: 3 }}>
								<Label>Reason Note</Label>
								<Text>{data?.reasonNote}</Text>
							</GridItem>
						)}
					</Grid>
				</Section>

				{/* Return Items Table */}
				<Section heading='Items Returned'>
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
								{data?.returnItems?.map((item: any, index: number) => (
									<Tr
										key={index}
										bg='red.50'
										_dark={{ bg: 'red.900' }}>
										<Td>{item.name || item.product?.name || 'N/A'}</Td>
										<Td>
											<Badge colorScheme='red'>{item.variant || 'N/A'}</Badge>
										</Td>
										<Td isNumeric>{item.quantity}</Td>
										<Td isNumeric>৳{Number(item.price || 0).toLocaleString()}</Td>
										<Td isNumeric>৳{Number(item.total || 0).toLocaleString()}</Td>
									</Tr>
								))}
							</Tbody>
						</Table>
					</Box>
				</Section>

				{/* Exchange Items Table */}
				<Section heading='Items Given'>
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
								{data?.exchangeItems?.map((item: any, index: number) => (
									<Tr
										key={index}
										bg='green.50'
										_dark={{ bg: 'green.900' }}>
										<Td>{item.name || item.product?.name || 'N/A'}</Td>
										<Td>
											<Badge colorScheme='green'>{item.variant || 'N/A'}</Badge>
										</Td>
										<Td isNumeric>{item.quantity}</Td>
										<Td isNumeric>৳{Number(item.price || 0).toLocaleString()}</Td>
										<Td isNumeric>
											৳{((item.quantity || 0) * (item.price || 0)).toLocaleString()}
										</Td>
									</Tr>
								))}
							</Tbody>
						</Table>
					</Box>
				</Section>

				{/* Financial Summary */}
				<Section heading='Financial Summary'>
					<Card
						variant='outline'
						w='full'
						maxW='500px'>
						<CardBody>
							<Flex
								justify='space-between'
								py={2}>
								<Text>Return Value</Text>
								<Text color='red.500'>৳{Number(data?.returnTotal || 0).toLocaleString()}</Text>
							</Flex>
							<Divider />
							<Flex
								justify='space-between'
								py={2}>
								<Text>Exchange Value</Text>
								<Text color='green.500'>৳{Number(data?.exchangeTotal || 0).toLocaleString()}</Text>
							</Flex>
							<Divider />
							<Flex
								justify='space-between'
								py={2}
								fontWeight='bold'>
								<Text>Price Difference</Text>
								<Badge
									colorScheme={data?.customerOwes ? 'red' : 'green'}
									fontSize='md'
									p={2}>
									{data?.customerOwes ? 'Customer Paid: ' : 'Refunded: '}৳
									{Math.abs(Number(data?.priceDifference || 0)).toLocaleString()}
								</Badge>
							</Flex>
						</CardBody>
					</Card>
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

export default SaleExchangeDetailPage;
