import { Flex, Center, Text, Button, Grid, Link } from '@chakra-ui/react';
import React from 'react';
import {
	useGetByIdQuery,
	createFormFields,
	CreateModal,
	Column,
	DetailItem,
	Section,
	DeleteItemModal,
} from '@/components/library';

import { deliverySchema } from '@/models/delivery/delivery.schema';
import SteadfastDelivery from './SteadfastDelivery';

const OrderDelivery = ({ id, order, orderData }: { id: string; order: string; orderData: any }) => {
	const extendSchema = {
		...deliverySchema,
		order: {
			type: 'read-only',
			title: 'Order',
			required: true,
			value: order,
		},
	};

	const formFields = createFormFields({
		schema: extendSchema,
		layout: [
			{
				sectionTitle: 'Basic Information',
				fields: ['order', 'invoice', 'receiveAmount', 'status'],
			},
			{
				sectionTitle: 'Delivery Information',
				fields: ['deliveryCompany', 'trackingId', 'trackingUrl', 'estimatedDeliveryData'],
			},
			{
				sectionTitle: 'Additional Information',
				fields: ['tags', 'note'],
			},
		],
	});

	const editFields = createFormFields({
		schema: extendSchema,
		layout: [
			{
				sectionTitle: 'Basic Information',
				fields: ['order', 'receiveAmount', 'status'],
			},
			{
				sectionTitle: 'Delivery Information',
				fields: ['deliveryCompany', 'trackingId', 'trackingUrl', 'estimatedDeliveryData'],
			},
			{
				sectionTitle: 'Additional Information',
				fields: ['tags', 'note'],
			},
		],
	});

	const { data, isFetching, isLoading } = useGetByIdQuery(
		{
			path: 'deliveries',
			id,
		},
		{
			skip: !id,
		}
	);

	return (
		<Section
			heading='Delivery Information'
			rightComponent={
				id &&
				data &&
				data?.status != 'deleted' && (
					<Flex gap={2}>
						<CreateModal
							data={editFields}
							title='Update Delivery Info'
							invalidate={['deliveries', 'orders']}
							type='update'
							id={id}
							path='deliveries'>
							<Button size='sm'>Update</Button>
						</CreateModal>
						<DeleteItemModal
							item={{
								invalidate: ['orders', 'deliveries'],
								prompt: {
									title: 'Are you sure you want to delete this delivery?',
									body: 'This action cannot be undone.',
								},
							}}
							id={id}
							path='deliveries/order'>
							<Button
								size='sm'
								colorScheme='red'>
								Delete
							</Button>
						</DeleteItemModal>
					</Flex>
				)
			}>
			<>
				{orderData?.status == 'cancelled' ? (
					<Center
						textAlign='center'
						minH='44px'>
						<Text>Order Has Been Cancelled</Text>
					</Center>
				) : isFetching ? (
					<Center
						textAlign='center'
						minH='44px'>
						<Text>Delivery Information Loading...</Text>
					</Center>
				) : data && data?.status != 'deleted' ? (
					<Grid
						gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
						gap={2}>
						<Sec>
							<Item title='Invoice:'>#{data?.invoice}</Item>
							<Item title='Delivery Invoice:'>#{data?.deliveryInvoice}</Item>
							<Item title='Courier:'>{data?.deliveryCompany}</Item>
							<Item title='Tracking ID:'>{data?.trackingId}</Item>

							<Item title='Tracking URL:'>
								<Link
									isExternal
									href={data?.trackingUrl}
									color='blue.500'>
									{data?.trackingUrl}
								</Link>
							</Item>
							<Item title='Status:'>{data?.status}</Item>

							{/* <Item title='Address:'>{convertAddress(data?.address)}</Item> */}
						</Sec>
						<Sec>
							<Item title='Consignment ID:'>{data?.consignmentId}</Item>
							<Item title='Receivable:'>{data?.receiveAmount}</Item>
							<Item title='Note:'>{data?.note}</Item>
							<Item title='Est. Delivery date:'>
								{data?.estimatedDeliveryDate
									? new Date(data?.estimatedDeliveryDate).toLocaleDateString()
									: ''}
							</Item>
						</Sec>
					</Grid>
				) : (
					<Flex flexDir={'column'}>
						<Center
							flexDir='column'
							textAlign='center'
							gap={4}
							minH='64px'>
							<Text>No Delivery Information Found</Text>
							<Center gap={2}>
								<CreateModal
									data={formFields}
									title='Add Delivery Info'
									invalidate={['deliveries', 'orders']}
									path='deliveries'>
									<Button size='sm'>Add Delivery</Button>
								</CreateModal>

								<SteadfastDelivery orderData={orderData} />
							</Center>
						</Center>
					</Flex>
				)}
			</>
		</Section>
	);
};

const Item = ({ children, title }: { children: React.ReactNode; title: string }) => (
	<DetailItem
		row
		title={title}>
		{children}
	</DetailItem>
);

const Sec = ({ children }: { children: React.ReactNode }) => (
	<Column
		gap={1.5}
		fontSize='.95rem'>
		{children}
	</Column>
);

export default OrderDelivery;
