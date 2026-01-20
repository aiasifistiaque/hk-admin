'use client';

import { FC } from 'react';
import { Box, Button, Flex, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { TableContainer, Title, useGetAllQuery } from '../../';
import DynamicCreateModal from '../../modals/CreateModal/DynamicCreateModal';

type ChartTableProps = {
	title: string;
	type: string;
	addButtonText?: string;
	onAdd?: () => void;
	path?: string;
	filters?: any;
	showBalance?: boolean;
};

const ChartTable: FC<ChartTableProps> = ({
	title,
	type,
	showBalance,
	path,
	filters,
	addButtonText,
	onAdd,
}) => {
	const { data, isLoading } = useGetAllQuery({
		path: path || 'account',
		limit: '999',
		filters: filters,
	});

	return (
		<Box
			mb={6}
			borderRadius='4px'
			overflow='hidden'>
			<TableContainer>
				<Table size='sm'>
					<Thead
						py={2}
						bg='container.dark'>
						<Tr bg='inherit'>
							<Title
								py={2}
								bg='inherit'
								color='white'>
								{title}
							</Title>
							{showBalance && (
								<Title
									py={2}
									bg='inherit'
									color='white'
									textAlign='center'>
									Current Balance(৳)
								</Title>
							)}
							{/* <Title
								py={2}
								bg='inherit'
								color='white'
								textAlign='right'>
								Action
							</Title> */}
						</Tr>
					</Thead>
					<Tbody _dark={{ bg: 'container.dark' }}>
						{data?.doc?.map((account: any) => (
							<Tr key={account._id}>
								<Td>{account.name}</Td>
								{showBalance && (
									<Td textAlign='center'>{account.openingBalance?.toLocaleString() || '0.00'}</Td>
								)}
							</Tr>
						))}
					</Tbody>
				</Table>
			</TableContainer>

			{addButtonText && (
				<DynamicCreateModal
					path={path || ''}
					readonlyFields={['category']}
					populate={filters}>
					<Button
						my={3}
						size='sm'
						onClick={onAdd}>
						{addButtonText}
					</Button>
				</DynamicCreateModal>
			)}
		</Box>
	);
};

export default ChartTable;
