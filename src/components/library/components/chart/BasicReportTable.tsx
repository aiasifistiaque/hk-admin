'use client';

import { FC } from 'react';
import { Box, Button, Flex, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { TableContainer, Title, useGetAllQuery, useGetQuery } from '../../';
import moment from 'moment';

type ChartTableProps = {
	data?: any;
	balance?: number;
	filter?: string;
	headings: string[];
	// keys: string[];
	children: React.ReactNode;
};

const BasicReportTable: FC<ChartTableProps> = ({
	data,
	headings,

	balance,
	filter,

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
					<Tbody _dark={{ bg: 'container.dark' }}>{children}</Tbody>
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

export default BasicReportTable;
