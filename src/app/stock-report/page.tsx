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
import BasicReportTable from '@/components/library/components/chart/BasicReportTable';

const LiabilityPage = () => {
	const [to, setTo] = useState();
	const [from, setFrom] = useState();
	const [filters, setFilters] = useState({});

	const { data, isFetching } = useGetAllQuery({
		path: 'stocks',
		limit: 999,
		sort: 'name',
	});

	return (
		<Layout title='Top Products Report'>
			<Column
				my={4}
				gap={4}>
				{/* <Text>Previous Balance: {prevData && prevData?.doc?.[1]?.balance}</Text>     */}
				{data && (
					<BasicReportTable
						headings={[
							'Item Name',
							'Warehouse',
							'Qty',
							'Av. Cost',
							'Stock Value',
							'Retail Value',
							'Retail Value Total',
						]}
						data={data}>
						{data?.doc?.map((item: any, index: number) => {
							return (
								<Tr
									key={item?._id}
									py={2}>
									<Td>{item?.variantName}</Td>
									<Td>{item?.warehouse?.name}</Td>
									<Td>{item?.quantity?.toLocaleString()}</Td>
									<Td>{item?.variantBuyPrice?.toLocaleString()}</Td>
									<Td>
										{item?.stockValue?.toLocaleString(undefined, {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})}
									</Td>
									<Td>{item?.variantPrice?.toLocaleString()}</Td>
									<Td>
										{item?.sellingStockValue?.toLocaleString(undefined, {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})}
									</Td>
								</Tr>
							);
						})}
						<Tr py={2}>
							<Td></Td>
							<Td>Total:</Td>
							<Td>
								{data?.doc
									?.reduce((acc: any, item: any) => acc + item.quantity, 0)
									?.toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
							</Td>
							<Td></Td>
							<Td>
								{data?.doc
									?.reduce((acc: any, item: any) => acc + item.stockValue, 0)
									?.toLocaleString()}
							</Td>
							<Td></Td>
							<Td>
								{data?.doc
									?.reduce((acc: any, item: any) => acc + item.sellingStockValue, 0)
									?.toLocaleString()}
							</Td>
						</Tr>
					</BasicReportTable>
				)}
				{/* {prevData && <ReportTable data={prevData} />} */}
			</Column>
		</Layout>
	);
};

export default LiabilityPage;
