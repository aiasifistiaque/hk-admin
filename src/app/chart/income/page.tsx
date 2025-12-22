'use client';

import { Layout } from '@/components/library';
import { Button, Flex } from '@chakra-ui/react';
import ChartTable from '@/components/library/components/chart/ChartTable';
import Link from 'next/link';
import AccountLinks from '@/components/library/components/chart/AccountLinks';

const IncomePage = () => {
	return (
		<Layout title='Chart of Accounts'>
			<AccountLinks activeTab='income' />

			<ChartTable
				title='Sales'
				type='sales'
				addButtonText='+ Add New Sales'
				path='incomes'
				filters={{
					category: 'sales',
				}}
			/>
			<ChartTable
				title='Income'
				type='income'
				addButtonText='+ Add New Income'
				path='incomes'
				filters={{
					category: 'income',
				}}
			/>
			<ChartTable
				title='Revenue'
				type='revenue'
				addButtonText='+ Add New Revenue'
				path='incomes'
				filters={{
					category: 'revenue',
				}}
			/>
		</Layout>
	);
};

export default IncomePage;
