'use client';

import React, { useState } from 'react';
import { Box, Grid, Flex, Text, Input, Select, useColorModeValue } from '@chakra-ui/react';
import QueryCard from './QueryCard';
import { Query, QueryStatus } from './types';
import { useRouter } from 'next/navigation';

interface QueryListProps {
	queries: any[];
	currentAgentId: string;
	activeQueryId?: string;
}

const QueryList: React.FC<QueryListProps> = ({ queries, currentAgentId, activeQueryId }) => {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState<QueryStatus | 'all'>('all');

	const filteredQueries = queries;

	const handleQueryClick = (query: Query) => {
		if (activeQueryId && activeQueryId !== query.id) {
			alert('Please close or change status of your current chat before opening another.');
			return;
		}
		router.push(`/customer-service/${query.id}`);
	};

	return (
		<Box sx={{ ...styles.container }}>
			<Flex
				gap={4}
				mb={6}
				direction={{ base: 'column', md: 'row' }}>
				<Input
					placeholder='Search by customer or subject...'
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					bg={useColorModeValue('white', 'black')}
				/>
				<Select
					value={statusFilter}
					onChange={e => setStatusFilter(e.target.value as QueryStatus | 'all')}
					bg={useColorModeValue('white', 'black')}
					maxW={{ base: 'full', md: '200px' }}>
					<option value='all'>All Status</option>
					<option value='unresolved'>Unresolved</option>
					<option value='ongoing'>Ongoing</option>
					<option value='resolved'>Resolved</option>
					<option value='for-later'>For Later</option>
					<option value='invalid'>Invalid</option>
					<option value='follow-up'>Follow Up</option>
				</Select>
			</Flex>

			{filteredQueries.length === 0 ? (
				<Text
					textAlign='center'
					color='gray.500'
					py={10}>
					No queries found
				</Text>
			) : (
				<Grid
					templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
					gap={3}>
					{filteredQueries?.map((query: any) => (
						<QueryCard
							key={query._id}
							query={query}
							currentAgentId={currentAgentId}
							onClick={handleQueryClick}
						/>
					))}
				</Grid>
			)}
		</Box>
	);
};

const styles = {
	container: {
		p: 6,
		borderRadius: 'lg',
	},
};

export default QueryList;
