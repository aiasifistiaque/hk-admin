'use client';

import { FC } from 'react';
import { Box, Button, Flex, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { TableContainer, Title, useGetAllQuery, useGetQuery } from '../../';
import moment from 'moment';

type ChartTableProps = {
	data: any;
	balance?: number;
	filter?: string;
	headings: string[];
	keys: string[];
	children?: React.ReactNode;
};

const GeneralReportTable: FC<ChartTableProps> = ({
	data,
	keys,
	balance,
	filter,
	headings,
	children,
}) => {
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
							{headings.map((heading, index) => (
								<Title
									key={index}
									{...headCss}
									textAlign={index === headings.length - 1 ? 'right' : 'left'}>
									{heading}
								</Title>
							))}
						</Tr>
					</Thead>
					<Tbody _dark={{ bg: 'container.dark' }}>
						{data?.doc?.map((item: any) => {
							return (
								<Tr
									key={item?._id}
									py={2}>
									{keys?.map((key: string, index: number) => (
										<Td
											key={index}
											_last={{ textAlign: 'right' }}>
											{item?.[key]?.toLocaleString
												? item?.[key]?.toLocaleString()
												: item?.[key] || '--'}
										</Td>
									))}
								</Tr>
							);
						})}
						{children}

						{/* <Td
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
						</Td> */}
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
	textAlign: 'left',
};

export default GeneralReportTable;
