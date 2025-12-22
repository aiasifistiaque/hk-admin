'use client';

import { Layout } from '@/components/library';
import { Button, Flex } from '@chakra-ui/react';
import ChartTable from '@/components/library/components/chart/ChartTable';
import Link from 'next/link';
import AccountLinks from '@/components/library/components/chart/AccountLinks';

const ExpensePage = () => {
	return (
		<Layout title='Chart of Accounts'>
			<AccountLinks activeTab='expense' />

			<ChartTable
				title='Expense'
				type='expense'
				addButtonText='+ Add New Expense'
				path='expenses'
				filters={{
					category: 'expense',
				}}
			/>
			<ChartTable
				title='Purchase'
				type='purchase'
				addButtonText='+ Add New Purchase'
				path='expenses'
				filters={{
					category: 'purchase',
				}}
			/>
			<ChartTable
				title='Cost Of Sales'
				type='cogs'
				addButtonText='+ Add New Cost Of Sales'
				path='expenses'
				filters={{
					category: 'cogs',
				}}
			/>
			<ChartTable
				title='Inventory'
				type='inventory'
				addButtonText='+ Add New Inventory'
				path='expenses'
				filters={{
					category: 'inventory',
				}}
			/>
		</Layout>
	);
};

export default ExpensePage;
