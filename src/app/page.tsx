'use client';

import { Grid, Flex, Heading, Text, Button } from '@chakra-ui/react';

import {
	Layout,
	Count,
	useAppSelector,
	useGetByIdQuery,
	ShowSum,
	useGetSumQuery,
	FlexChild,
	Sum,
} from '@/components/library';
import { Column, DashContainer, SpaceBetween } from '@/components/library';

import { TopCustomers, TopProducts, OrderTable } from '@/components/dashboard';
import Link from 'next/link';

export default function UserFeedback() {
	const { filters } = useAppSelector((state: any) => state.table);

	const { data, isFetching, isError, error, isSuccess }: any = useGetByIdQuery({
		path: 'sms/check',
		id: 'balance',
	});

	const {
		data: storageData,
		isFetching: storageIsFetching,
		isError: storageError,
	} = useGetSumQuery({
		path: 'files',
		field: 'size',
	});

	const {
		data: awsBillData,
		isFetching: awsBillIsFetching,
		isError: awsBillError,
	} = useGetSumQuery({
		path: 'upload',
		field: 'awsbill',
	});

	const {
		data: s3Data,
		isFetching: s3IsFetching,
		isError: s3Error,
	} = useGetSumQuery({
		path: 'upload',
		field: 's3',
	});

	const convertSizeToKb = (size: number) => {
		if (size === undefined || size === null) return '--';

		const bytes = size;
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];

		if (bytes === 0) return '0 B';

		const i = Math.floor(Math.log(bytes) / Math.log(k));
		const convertedSize = bytes / Math.pow(k, i);

		return parseFloat(convertedSize.toFixed(2)) + ' ' + sizes[i];
	};

	return (
		<Layout
			title='Dashboard'
			path='dashboard'>
			<Grid
				pt={3}
				gridTemplateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }}
				gap={2}>
				<Sum
					title='Cash Balance'
					path='assets'
					field='openingBalance'
					filters={{
						category: 'cash',
					}}
				/>
				<Sum
					title='Bank Balance'
					path='assets'
					field='openingBalance'
					filters={{
						category: 'bank',
					}}
				/>
				<Sum
					title='MFS Balance'
					path='assets'
					field='openingBalance'
					filters={{
						category_in: 'mfs',
					}}
				/>
				<Sum
					title='Expense'
					path='expenses'
					field='openingBalance'
					filters={{
						type: 'expense',
					}}
				/>
			</Grid>

			{/* <Column gap={2}>
				<DashContainer pt={4}>
					<SpaceBetween
						align='center'
						px={4}>
						<Heading size='sm'>Top Selling Products</Heading>
					</SpaceBetween>
					<TopProducts />
				</DashContainer>
			</Column>
			<Column gap={2}>
				<DashContainer pt={4}>
					<SpaceBetween
						align='center'
						px={4}>
						<Heading size='sm'>Top Customers</Heading>
					</SpaceBetween>
					<TopCustomers />
				</DashContainer>
			</Column> */}
		</Layout>
	);
}

const Col = ({ children, ...props }: FlexChild) => (
	<Column
		gap={6}
		py={6}
		{...props}>
		{children}
	</Column>
);
const ColOptPadding = ({ children, ...props }: FlexChild) => (
	<Column
		gap={6}
		py={0}
		mt={-7}
		{...props}>
		{children}
	</Column>
);
