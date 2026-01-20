'use client';

import {
	Column,
	Layout,
	VDataMenu,
	VInput,
	useGetAllQuery,
	useGetOneQuery,
	useGetQuery,
} from '@/components/library';
import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import { useState } from 'react';
import ReportTable from '@/components/library/components/chart/ReportTable';
import exp from 'constants';
import GeneralReportTable from '@/components/library/components/chart/GeneralReportTable';

const LiabilityPage = () => {
	const [supplier, setSupplier] = useState('');
	const [to, setTo] = useState();
	const [from, setFrom] = useState();
	const [filters, setFilters] = useState({});
	const [expenseFilter, setExpenseFilter] = useState({});
	const { data: getAccount, isFetching: isAccountFetching } = useGetAllQuery({
		path: `accounts`,
		limit: 999,
		filters: { category_in: 'income,sales' },
	});
	const { data: expAccounts, isFetching: expFetching } = useGetAllQuery({
		path: `accounts`,
		filters: { category_in: 'cogs,expense' },
	});
	const handleGenerateReport = () => {
		if (!from || !to || isAccountFetching) return;
		setFilters({
			account_in: getAccount?.doc?.map((acc: any) => acc._id).join(','),
			date_btwn: `${from}_${to}`,
		});
		setExpenseFilter({
			account_in: expAccounts?.doc?.map((acc: any) => acc._id).join(','),
			date_btwn: `${from}_${to}`,
		});
		// refetch();
	};
	const { data, isFetching } = useGetAllQuery(
		{
			path: 'reports',
			sort: 'date',
			limit: 9999,
			filters: filters,
		},
		{
			skip: isAccountFetching || !from || !to || Object.keys(filters).length === 0,
		},
	);
	const { data: expData, isFetching: expFetch } = useGetAllQuery(
		{
			path: 'reports',
			sort: 'date',
			limit: 9999,
			filters: expenseFilter,
		},
		{
			skip: expFetching || !from || !to || Object.keys(filters).length === 0,
		},
	);

	return (
		<Layout title='Profit & Loss Report'>
			<Column
				my={4}
				gap={4}>
				<Flex
					gap={4}
					alignItems='flex-end'>
					<VInput
						type='date'
						label='From'
						value={from}
						onChange={(e: any) => setFrom(e.target.value)}
					/>
					<VInput
						type='date'
						label='To'
						value={to}
						onChange={(e: any) => setTo(e.target.value)}
					/>
					<Button
						onClick={handleGenerateReport}
						isDisabled={!from || !to}
						size='sm'
						w='200px'
						isLoading={isFetching || isAccountFetching}
						mt={6}>
						Generate
					</Button>
				</Flex>
				{/* <Text>Previous Balance: {prevData && prevData?.doc?.[1]?.balance}</Text>     */}
				<Heading size='md'>Income</Heading>
				{data && (
					<GeneralReportTable
						data={data}
						headings={['Date', 'Description', 'Amount']}
						keys={['date', 'name', 'receivedAmount']}
					/>
				)}
				<Heading size='md'>Expense</Heading>
				{expData && (
					<GeneralReportTable
						data={expData}
						headings={['Date', 'Description', 'Amount']}
						keys={['date', 'name', 'receivedAmount']}
					/>
				)}
				<Text>
					Total Earnings:{' '}
					{data?.doc?.reduce((acc: number, item: any) => acc + item.receivedAmount, 0)}
				</Text>
				<Text>
					Total Expenses:{' '}
					{expData?.doc?.reduce((acc: number, item: any) => acc + item.receivedAmount, 0)}
				</Text>
				<Text>
					Net Profit:{' '}
					{(data?.doc?.reduce((acc: number, item: any) => acc + item.receivedAmount, 0) || 0) -
						(expData?.doc?.reduce((acc: number, item: any) => acc + item.receivedAmount, 0) || 0)}
				</Text>
			</Column>
		</Layout>
	);
};

export default LiabilityPage;
