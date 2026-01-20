'use client';

import {
	Column,
	Layout,
	VDataMenu,
	VInput,
	useGetAllQuery,
	useGetQuery,
} from '@/components/library';
import { Button, Flex, Td, Text, Tr } from '@chakra-ui/react';
import { useState } from 'react';
import ReportTable from '@/components/library/components/chart/ReportTable';
import GeneralReportTable from '@/components/library/components/chart/GeneralReportTable';

const LiabilityPage = () => {
	const [to, setTo] = useState();
	const [from, setFrom] = useState();
	const [filters, setFilters] = useState({});

	const handleGenerateReport = () => {
		if (!from || !to) return;
		setFilters({
			orderDate_btwn: `${from}_${to}`,
		});
		refetch();
	};
	const { data, isFetching } = useGetAllQuery(
		{
			path: 'analytics/products/top-selling?sort=name',
			limit: 999,
			filters: filters,
		},
		{
			skip: !from || !to || Object.keys(filters).length === 0,
		},
	);
	const {
		data: prevData,
		isFetching: prevIsFetching,
		refetch,
	} = useGetAllQuery(
		{
			path: 'analytics/products/top-selling',
			limit: 2,
			filters: {
				date_lte: from,
			},
		},
		{ skip: !from },
	);

	return (
		<Layout title='Top Products Report'>
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
						isLoading={isFetching}
						mt={6}>
						Generate
					</Button>
				</Flex>
				{/* <Text>Previous Balance: {prevData && prevData?.doc?.[1]?.balance}</Text>     */}
				{data && (
					<GeneralReportTable
						headings={['Product Name', 'Quantity', 'Sale Amount', 'Cost', 'Gross profit']}
						keys={['name', 'totalQuantity', 'totalPrice', 'totalCost', 'netProfit']}
						data={data}
						balance={
							prevData &&
							prevData?.doc?.[
								data?.totalDocs == 0 ? 0 : data?.totalDocs == 1 && prevData?.totalDocs > 1 ? 0 : 1
							]?.balance
						}></GeneralReportTable>
				)}
				{/* {prevData && <ReportTable data={prevData} />} */}
			</Column>
		</Layout>
	);
};

export default LiabilityPage;
