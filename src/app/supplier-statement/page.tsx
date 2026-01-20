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
import { Button, Flex, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import ReportTable from '@/components/library/components/chart/ReportTable';

const LiabilityPage = () => {
	const [supplier, setSupplier] = useState('');
	const [to, setTo] = useState();
	const [from, setFrom] = useState();
	const [filters, setFilters] = useState({});
	const { data: getAccount, isFetching: isAccountFetching } = useGetQuery({
		path: `accounts/g/slug/accounts-payable`,
	});
	const [account, setAccount] = useState(getAccount?._id);
	useEffect(() => {
		if (!isAccountFetching) setAccount(getAccount?._id);
	}, [isAccountFetching]);

	const handleGenerateReport = () => {
		if (!supplier || !from || !to || isAccountFetching) return;
		setFilters({
			account: account,
			supplier: supplier,
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
				isAccountFetching ||
				!account ||
				!supplier ||
				!from ||
				!to ||
				Object.keys(filters).length === 0,
		}
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
				account: account,
				supplier: supplier,
				date_lte: from,
			},
		},
		{ skip: !account || isAccountFetching || !supplier }
	);

	return (
		<Layout title='Supplier Statement'>
			<Column
				my={4}
				gap={4}>
				<Flex
					gap={4}
					alignItems='flex-end'>
					<VDataMenu
						value={supplier}
						onChange={(e: any) => setSupplier(e.target.value)}
						label='Select Supplier'
						model='suppliers'
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
						isDisabled={!supplier || !from || !to}
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
						data={data}
						filter={`supplier=${supplier}`}
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
