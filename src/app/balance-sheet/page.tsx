'use client';

import {
	Column,
	Layout,
	VDataMenu,
	VInput,
	useGetAllQuery,
	useGetOneQuery,
	useGetQuery,
	useGetSumQuery,
} from '@/components/library';
import { Button, Flex, Heading, Td, Text, Tr } from '@chakra-ui/react';
import { useState } from 'react';
import ReportTable from '@/components/library/components/chart/ReportTable';
import exp from 'constants';
import GeneralReportTable from '@/components/library/components/chart/GeneralReportTable';
import BasicReportTable from '@/components/library/components/chart/BasicReportTable';

const LiabilityPage = () => {
	const [to, setTo] = useState();

	const [filters, setFilters] = useState({});

	const { data: getAccount, isFetching: isAccountFetching } = useGetAllQuery(
		{
			path: `accounts`,
			sort: '-name',
			limit: 999,
		},
		{
			skip: !to || !filters,
		},
	);

	const handleGenerateReport = () => {
		if (!to) return;
		setFilters({
			date_lte: `${to}`,
		});

		// refetch();
	};

	return (
		<Layout title='Balance Sheet'>
			<Column
				my={4}
				gap={4}>
				<Flex
					gap={4}
					alignItems='flex-end'>
					{/* <VInput
						type='date'
						label='From'
						value={from}
						onChange={(e: any) => setFrom(e.target.value)}
					/> */}
					<VInput
						type='date'
						label='Balance On'
						value={to}
						onChange={(e: any) => setTo(e.target.value)}
					/>
					<Button
						onClick={handleGenerateReport}
						isDisabled={!to}
						size='sm'
						w='200px'
						isLoading={isAccountFetching}
						mt={6}>
						Generate
					</Button>
				</Flex>
				{/* <Text>Previous Balance: {prevData && prevData?.doc?.[1]?.balance}</Text>     */}

				<GetAccount
					title='Assets'
					type='asset'
					date={to}
				/>
				<GetAccount
					title='Liabilities'
					type='liability'
					date={to}
				/>
				<GetAccount
					title='Income'
					type='income'
					date={to}
				/>
				<GetAccount
					title='Expense'
					type='expense'
					date={to}
				/>
				{/* <Heading size='md'>Expense</Heading> */}

				{/* <Text>
					Net Profit:{' '}
					{(data?.doc?.reduce((acc: number, item: any) => acc + item.receivedAmount, 0) || 0) -
						(expData?.doc?.reduce((acc: number, item: any) => acc + item.receivedAmount, 0) || 0)}
				</Text> */}
			</Column>
		</Layout>
	);
};

const GetAccount = ({ title, type, date }: any) => {
	const { data, isFetching, isError } = useGetAllQuery({
		path: 'accounts',
		sort: '-category',
		filters: {
			type: type,
		},
	});

	if (!date) return null;

	return (
		<Column pt={4}>
			<Heading
				size='md'
				mb={4}>
				{title}
			</Heading>
			<BasicReportTable headings={['Type', 'Name', 'Balance']}>
				{data?.doc?.map((item: any, i: number) => (
					<Tr
						key={item?._id}
						py={2}>
						<Td>{item?.category}</Td>
						<Td>{item?.name}</Td>
						<Td textAlign='right'>
							<Balance
								accountId={item._id}
								filter={`date_lte=${date}`}
							/>
						</Td>
					</Tr>
				))}
			</BasicReportTable>
		</Column>
	);
};

const Balance = ({ accountId, filter }: { accountId: string; filter?: string }) => {
	const { data } = useGetQuery({ path: `acc/get-account-balance/${accountId}?${filter || ''}` });
	return <>{data?.balance?.toLocaleString() || 0}</>;
};

export default LiabilityPage;
