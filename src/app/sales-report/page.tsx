'use client';

import {
	Column,
	Layout,
	VDataMenu,
	VInput,
	useGetAllQuery,
	useGetQuery,
} from '@/components/library';
import { Button, Flex, Text } from '@chakra-ui/react';
import { useState } from 'react';
import ReportTable from '@/components/library/components/chart/ReportTable';

const LiabilityPage = () => {
	const [supplier, setSupplier] = useState('');
	const [to, setTo] = useState();
	const [from, setFrom] = useState();
	const [filters, setFilters] = useState({});
	const { data: getAccount, isFetching: isAccountFetching } = useGetQuery({
		path: `accounts/g/slug/sales`,
	});
	const handleGenerateReport = () => {
		if (!from || !to || isAccountFetching || !getAccount) return;
		setFilters({
			account: getAccount?._id,
			customer: supplier,
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
			skip:
				!getAccount?._id || isAccountFetching || !from || !to || Object.keys(filters).length === 0,
		},
	);
	const {
		data: prevData,
		isFetching: prevIsFetching,
		refetch,
	} = useGetAllQuery(
		{
			path: 'reports',
			sort: '-date',
			limit: 2,
			filters: {
				account: getAccount?._id,
				customer: supplier,
				date_lte: from,
			},
		},
		{ skip: isAccountFetching || !getAccount?._id },
	);

	return (
		<Layout title='Sales Statement'>
			<Column
				my={4}
				gap={4}>
				<Flex
					gap={4}
					alignItems='flex-end'>
					<VDataMenu
						value={supplier}
						onChange={(e: any) => setSupplier(e.target.value)}
						label='Select Customer'
						model='customers'
						menuKey='name'
						subMenuKey='phone'
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
						isDisabled={!from || !to}
						size='sm'
						w='200px'
						isLoading={isFetching || isAccountFetching}
						mt={6}>
						Generate
					</Button>
				</Flex>
				{/* <Text>Previous Balance: {prevData && prevData?.doc?.[1]?.balance}</Text>     */}
				{data && (
					<ReportTable
						filter={supplier && `customer=${supplier}`}
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
