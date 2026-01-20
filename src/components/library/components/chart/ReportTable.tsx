'use client';

import { FC } from 'react';
import { Box, Button, Flex, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { TableContainer, Title, useGetAllQuery, useGetQuery } from '../../';
import moment from 'moment';

type ChartTableProps = {
	data: any;
	balance?: number;
	filter?: string;
};

const ReportTable: FC<ChartTableProps> = ({ data, balance, filter }) => {
	return (
		<Box
			mb={6}
			borderRadius='4px'
			overflow='hidden'>
			<TableContainer>
				<Table
					size='sm'
					variant='striped'>
					<Thead
						py={2}
						bg='container.dark'>
						<Tr bg='inherit'>
							<Title {...headCss}>Date</Title>
							<Title {...headCss}>Reference</Title>
							<Title {...headCss}>In</Title>
							<Title {...headCss}>Out</Title>
							<Title
								{...headCss}
								textAlign='right'>
								Balance
							</Title>
						</Tr>
					</Thead>
					<Tbody _dark={{ bg: 'container.dark' }}>
						<Tr>
							<Td
								colSpan={5}
								textAlign='right'>
								Previous Balance:{' '}
								<strong>
									<PreviousBalance
										accountId={data?.doc?.[0]?._id}
										filter={filter}
									/>
								</strong>
							</Td>
						</Tr>
						{data?.doc?.map((item: any) => (
							<Tr
								key={item?._id}
								py={2}>
								<Td>{moment(item?.date).format('DD-MM-YYYY') || '--'}</Td>
								<Td>{item?.name}</Td>
								<Td>{item?.receivedAmount?.toLocaleString() || '--'}</Td>
								<Td>{item?.paidAmount?.toLocaleString() || '--'}</Td>
								{/* <Td textAlign='right'>{item?.balance?.toLocaleString() || '--'}</Td> */}
								<Td textAlign='right'>
									<Balance
										accountId={item?._id}
										filter={filter}
									/>
								</Td>
							</Tr>
						))}
						<Td
							colSpan={5}
							textAlign='right'>
							Total In:{' '}
							<strong>
								{data?.doc
									?.reduce((acc: number, curr: any) => acc + (curr.receivedAmount || 0), 0)
									.toLocaleString() || '0'}
							</strong>
							{'  '} | Total Out:{' '}
							<strong>
								{data?.doc
									?.reduce((acc: number, curr: any) => acc + (curr.paidAmount || 0), 0)
									.toLocaleString() || '0'}
							</strong>
						</Td>
					</Tbody>
				</Table>
			</TableContainer>
		</Box>
	);
};

const Balance = ({ accountId, filter }: { accountId: string; filter?: string }) => {
	const { data } = useGetQuery({ path: `acc/get-balance/${accountId}?${filter || ''}` });
	return <>{data?.balance?.toLocaleString() || 0}</>;
};

const PreviousBalance = ({ accountId, filter }: { accountId: string; filter?: string }) => {
	const { data } = useGetQuery({ path: `acc/get-balance/${accountId}?${filter || ''}` });
	return <>{data?.previousBalance?.toLocaleString() || 0}</>;
};

const headCss: any = {
	py: 2,
	bg: 'inherith',
	color: 'white',
};

export default ReportTable;
