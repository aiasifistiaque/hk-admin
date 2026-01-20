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
	const [from, setFrom] = useState();
	const [filters, setFilters] = useState({});
	const [expenseFilter, setExpenseFilter] = useState({});
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
		<Layout title='Trial Balance'>
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

				{getAccount && (
					<BasicReportTable headings={['Name', 'Debit', 'Credit']}>
						{getAccount?.doc?.map((item: any, i: number) => (
							<Tr
								key={item?._id}
								py={2}>
								<Td>{item?.name}</Td>
								<Td>
									<Debit filters={{ account: item._id, date_lte: `${to}` }} />
								</Td>
								<Td textAlign='right'>
									<Credit filters={{ account: item._id, date_lte: `${to}` }} />
								</Td>
							</Tr>
						))}
					</BasicReportTable>
				)}
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

const Debit = ({ filters }: any) => {
	const { data, isFetching, isError } = useGetSumQuery({
		path: 'payments',
		field: 'paidAmount',
		filters,
	});

	return <>{data?.total?.toLocaleString()}</>;
};

const Credit = ({ filters }: any) => {
	const { data, isFetching, isError } = useGetSumQuery({
		path: 'payments',
		field: 'receivedAmount',
		filters,
	});

	return <>{data?.total?.toLocaleString()}</>;
};

export default LiabilityPage;
