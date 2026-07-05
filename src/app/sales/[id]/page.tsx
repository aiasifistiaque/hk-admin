'use client';
import React from 'react';
import {
	Layout,
	useGetByIdQuery,
	OrderItems,
	Column,
	Section,
	OrderListGrid,
	convertToFormFields,
	CreateModal,
	useExportMutation,
} from '@/components/library';
import { useParams } from 'next/navigation';
import { Button, ButtonGroup, Flex } from '@chakra-ui/react';
import {
	LeftSection,
	BasicDetails,
	OrderPayments,
	OrderDelivery,
	updateAddressModel,
} from './_components';
import { orderStatus } from '@/models/order/order.schema';

const updateForm = convertToFormFields({
	schema: {
		status: {
			label: 'Order Status',
			type: 'select',
			options: orderStatus,
		},
	},
	layout: [
		{
			sectionTitle: 'Update Order Status',
			fields: ['status'],
		},
	],
	type: 'update',
});

const OrderDetailPage = () => {
	const { id }: { id: string } = useParams();

	const [trigger, result] = useExportMutation();

	const { data, isFetching, isLoading } = useGetByIdQuery(
		{
			path: 'sales',
			id: id,
		},
		{
			skip: !id,
		}
	);


	const handleExport = () => {
		trigger({
			path: 'sales',
			body: { id: data?._id },
			type: 'invoice/dl',
		});
	};

	if (!data || isLoading)
		return (
			<Layout
				title='Loading...'
				path='sales'>
				...
			</Layout>
		);

	return (
		<Layout
			title={`Invoice #${data?.invoice}`}
				path='sales'>
			<Column
				gap={{ base: 4, md: 6 }}
				pt={{ base: 2, md: 0 }}>
				<Section
					heading='Order DETAILS'
					rightComponent={
						<CreateModal
							path='sales'
							id={id}
							type='update'
							data={updateAddressModel}>
							<Button size='sm'>Update Address</Button>
						</CreateModal>
					}>
					<BasicDetails data={data} />
					<Flex>
						<Button
							size='xs'
							onClick={handleExport}
							loadingText='Preparing...'
							isLoading={result.isLoading}>
							Download Invoice
						</Button>
					</Flex>
				</Section>
				<Section
					mb={2}
					heading='Order Details'
					rightComponent={
						<CreateModal
							path='sales'
							id={id}
							type='update'
							data={updateForm}
							invalidate={['sales', 'items']}>
							<Button size='sm'>Update Order Status</Button>
						</CreateModal>
					}>
					<OrderListGrid>
						<Flex flexDirection='column'>
							<OrderItems data={data} />
						</Flex>
						<Column
							flex={1}
							gap={4}>
							<Column
								gap={2}
								flex={1}>
								<LeftSection data={data} />
							</Column>
						</Column>
					</OrderListGrid>
				</Section>

				<OrderPayments
					order={id}
					invoice={data?.invoice}
				/>
			</Column>
		</Layout>
	);
};

export default OrderDetailPage;
