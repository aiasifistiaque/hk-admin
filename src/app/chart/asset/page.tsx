'use client';

import { Layout } from '@/components/library';
import { Box, Button, Flex } from '@chakra-ui/react';
import ChartTable from '@/components/library/components/chart/ChartTable';
import Link from 'next/link';
import AccountLinks from '@/components/library/components/chart/AccountLinks';

const AssetPage = () => {
	return (
		<Layout title='Chart of Accounts'>
			<AccountLinks activeTab='asset' />

			<ChartTable
				title='Cash'
				type='cash'
				path='assets'
				showBalance={true}
				filters={{ category: 'cash' }}
				addButtonText='+ Add New Cash'
			/>

			<ChartTable
				title='Bank'
				type='asset'
				showBalance={true}
				addButtonText='+ Add New Bank'
				path='assets'
				filters={{ category: 'bank' }}
			/>

			<ChartTable
				title='Mobile Bank'
				type='asset'
				showBalance={true}
				addButtonText='+ Add New Mobile Bank'
				path='assets'
				filters={{ category: 'mfs' }}
			/>
		</Layout>
	);
};

export default AssetPage;
