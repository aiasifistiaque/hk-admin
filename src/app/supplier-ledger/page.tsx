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
	const { data, isFetching } = useGetAllQuery({
		path: 'suppliers',
		limit: 999,
		sort: 'name',
	});

	return (
		<Layout title='Supplier Ledger'>
			<Column
				my={4}
				gap={4}>
				{data && (
					<GeneralReportTable
						headings={['Name', 'Code', 'Contact Number', 'Balance']}
						keys={['name', 'code', 'phone', 'openingBalance']}
						data={data}>
						<Td
							colSpan={5}
							textAlign='right'>
							Total:{' '}
							<strong>
								{data?.doc
									?.reduce((acc: number, curr: any) => acc + (curr.openingBalance || 0), 0)
									.toLocaleString() || '0'}
							</strong>
						</Td>
					</GeneralReportTable>
				)}
			</Column>
		</Layout>
	);
};

export default LiabilityPage;
