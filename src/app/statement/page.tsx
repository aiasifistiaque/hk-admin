'use client';

import { Column, Layout, VDataMenu, VInput, useGetAllQuery } from '@/components/library';
import { Button, Flex, Text } from '@chakra-ui/react';
import { useState } from 'react';
import ReportTable from '@/components/library/components/chart/ReportTable';

const LiabilityPage = () => {
	const [account, setAccount] = useState('');
	const [to, setTo] = useState();
	const [from, setFrom] = useState();
	const [filters, setFilters] = useState({});
	const handleGenerateReport = () => {
		if (!account || !from || !to) return;
		setFilters({
			account,
			date_btwn: `${from}_${to}`,
		});
		refetch();
	};
	const { data, isFetching } = useGetAllQuery(
		{
			path: 'reports',
			sort: 'date',
			limit: 9999,
			filters: filters,
		},
		{
			skip: !account || !from || !to || Object.keys(filters).length === 0,
		}
	);
	const {
		data: prevData,
		isFetching: prevIsFetching,
		refetch,
	} = useGetAllQuery({
		path: 'reports',
		sort: '-date',
		limit: 2,
		filters: {
			account,
			date_lte: from,
		},
	});

	return (
		<Layout title='Account Statement'>
			<Column
				my={4}
				gap={4}>
				<Flex
					gap={4}
					alignItems='flex-end'>
					<VDataMenu
						value={account}
						onChange={(e: any) => setAccount(e.target.value)}
						label='Select Account'
						model='accounts'
					/>
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
						isDisabled={!account || !from || !to}
						size='sm'
						w='200px'
						isLoading={isFetching}
						mt={6}>
						Generate
					</Button>
				</Flex>
				{/* <Text>Previous Balance: {prevData && prevData?.doc?.[1]?.balance}</Text>     */}
				{data && (
					<ReportTable
						data={data}
						balance={
							prevData &&
							prevData?.doc?.[
								data?.totalDocs == 0 ? 0 : data?.totalDocs == 1 && prevData?.totalDocs > 1 ? 0 : 1
							]?.balance
						}
					/>
				)}
				{/* {prevData && <ReportTable data={prevData} />} */}
			</Column>
		</Layout>
	);
};

export default LiabilityPage;
