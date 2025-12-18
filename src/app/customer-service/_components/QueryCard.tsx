'use client';

import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import QueryStatusBadge from './QueryStatusBadge';
import AgentLockIndicator from './AgentLockIndicator';
import { Column, JsonView, radius, shadow, SpaceBetween } from '@/components/library';
import Link from 'next/link';

interface QueryCardProps {
	query: any;
	currentAgentId: string;
	onClick: (query: any) => void;
}

const QueryCard: React.FC<QueryCardProps> = ({ query, currentAgentId, onClick }) => {
	const isLocked = query.status === 'ongoing' && query.assignedAgentId !== currentAgentId;
	const isMyActive = query.status === 'ongoing' && query.assignedAgentId === currentAgentId;

	return (
		<Container
			isLocked={isLocked}
			id={query?._id}>
			<Box
				{...containerStyles}
				cursor={isLocked ? 'not-allowed' : 'pointer'}>
				<Column gap={3}>
					{/* <JsonView data={query} /> */}
					<SpaceBetween align='start'>
						<Box flex={1}>
							<Text
								fontSize='lg'
								fontWeight='semibold'
								noOfLines={1}>
								{query?.customerId?.name}
							</Text>
						</Box>
						<QueryStatusBadge
							status={query?.status}
							size='sm'
						/>
					</SpaceBetween>

					{isLocked && query?.assignedAgent && (
						<AgentLockIndicator
							agentName={query?.assignedAgent?.name}
							variant='compact'
						/>
					)}

					<SpaceBetween fontSize='xs'>
						<Text>{new Date(query.createdAt).toLocaleDateString()}</Text>
						<Text>{query?.messageCount || 0} messages</Text>
					</SpaceBetween>
					{query?.subject && (
						<Text
							fontSize='sm'
							noOfLines={2}
							mt={1}>
							<strong>Message:</strong> {query?.subject}
						</Text>
					)}
				</Column>
			</Box>
		</Container>
	);
};

const containerStyles: any = {
	borderRadius: radius.CONTAINER,
	alignItems: 'center',
	w: 'full',
	p: 4,
	bg: 'container.newLight',
	borderColor: 'container.borderLight',
	borderWidth: 1,
	boxShadow: shadow?.DASH,
	_dark: {
		bg: 'menu.dark',
		borderColor: 'container.borderDark',
	},
};

const Container = ({
	children,
	isLocked,
	id,
}: {
	children: React.ReactNode;
	isLocked: boolean;
	id: string;
}) => {
	return isLocked ? (
		children
	) : (
		<Link
			style={{
				display: 'flex',
				height: '100%',
			}}
			href={`/customer-service/${id}`}>
			{children}
		</Link>
	);
};

export default QueryCard;
