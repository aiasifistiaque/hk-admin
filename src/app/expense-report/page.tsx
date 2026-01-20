'use client';

import { Column, Layout, VInput, useGetAllQuery } from '@/components/library';
import { Button, Flex, Heading, Td, Text } from '@chakra-ui/react';
import { useState } from 'react';

import GeneralReportTable from '@/components/library/components/chart/GeneralReportTable';

const LiabilityPage = () => {
	const [to, setTo] = useState();
	const [from, setFrom] = useState();
	const [filters, setFilters] = useState({});

	const { data: getAccount, isFetching: isAccountFetching } = useGetAllQuery({
		path: `accounts`,
		limit: 999,
		filters: { category: 'expense', type: 'expense' },
	});

	const handleGenerateReport = () => {
		if (!from || !to || isAccountFetching) return;
		setFilters({
			account_in: getAccount?.doc?.map((acc: any) => acc._id).join(','),
			date_btwn: `${from}_${to}`,
		});
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

	return (
		<Layout title='Expense Report'>
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

				{data && (
					<GeneralReportTable
						data={data}
						headings={['Date', 'Expense Name', 'Amount']}
						keys={['date', 'name', 'receivedAmount']}>
						<Td></Td>
						<Td>Total:</Td>
						<Td textAlign='right'>
							{data?.doc
								?.reduce((acc: any, item: any) => acc + item.receivedAmount, 0)
								?.toLocaleString()}
						</Td>
					</GeneralReportTable>
				)}
			</Column>
		</Layout>
	);
};

export default LiabilityPage;
