'use client';

import React from 'react';
import { Box, Flex, Text, Heading, useColorModeValue } from '@chakra-ui/react';
import QueryStatusBadge from './QueryStatusBadge';
import StatusControl from './StatusControl';
import { Query, QueryStatus } from './types';
import { JsonView, SpaceBetween } from '@/components/library';

interface ChatHeaderProps {
	query: any;
	onStatusChange: (newStatus: QueryStatus) => Promise<void>;
	onLeaveChat: () => void;
	data: any;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ query, onStatusChange, onLeaveChat, data }) => {
	const bgColor = useColorModeValue('white', 'black');
	const borderColor = useColorModeValue('gray.200', 'gray.700');

	return (
		<Box sx={{ ...styles.container, bg: bgColor, borderColor }}>
			<SpaceBetween
				align='start'
				flexWrap='wrap'
				gap={4}>
				<Box flex={1}>
					<Flex
						align='center'
						gap={3}
						mb={2}>
						<Heading size='md'>{data?.customerId?.name}</Heading>
						<QueryStatusBadge status={data?.status} />
					</Flex>
					<Text
						fontSize='sm'
						mb={1}>
						{data?.subject}
					</Text>
					<Flex
						gap={4}
						fontSize='xs'
						color='gray.500'>
						<Text>ID: {data?._id}</Text>
						<Text>Customer ID: {data?.customerId?._id}</Text>
						<Text>Created: {new Date(data?.createdAt).toLocaleString()}</Text>
					</Flex>
				</Box>

				<Box>
					<StatusControl
						currentStatus={data?.status}
						onStatusChange={onStatusChange}
						onLeaveChat={onLeaveChat}
					/>
				</Box>
			</SpaceBetween>
		</Box>
	);
};

const styles = {
	container: {
		p: 4,
		borderBottom: '1px solid',
		boxShadow: 'sm',
	},
};

export default ChatHeader;
