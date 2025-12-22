'use client';

import { Layout } from '@/components/library';
import { Button, Flex } from '@chakra-ui/react';
import ChartTable from '@/components/library/components/chart/ChartTable';
import Link from 'next/link';
import AccountLinks from '@/components/library/components/chart/AccountLinks';

const LiabilityPage = () => {
	return (
		<Layout title='Chart of Accounts'>
			<AccountLinks activeTab='liability' />

			<ChartTable
				title='Payable'
				type='payable'
				path='liabilities'
				showBalance={true}
				addButtonText='+ Add New Payble'
				filters={{
					category: 'payable',
				}}
			/>

			<ChartTable
				title='Tax'
				type='tax'
				path='liabilities'
				showBalance={true}
				addButtonText='+ Add New Tax'
				filters={{
					category: 'tax',
				}}
			/>
			<ChartTable
				title='Equity'
				type='equity'
				showBalance={true}
				filters={{
					category: 'equity',
				}}
				path='liabilities'
				addButtonText='+ Add New Equity'
			/>
		</Layout>
	);
};

export default LiabilityPage;
