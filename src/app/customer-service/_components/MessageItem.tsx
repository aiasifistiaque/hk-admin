'use client';

import React from 'react';
import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { JsonView } from '@/components/library';

interface MessageItemProps {
	message: any;
	isAgent: boolean;
	chat: any;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isAgent, chat }) => {
	const agentBg = useColorModeValue('blue.400', 'blue.600');
	const customerBg = useColorModeValue('gray.200', 'gray.700');

	return (
		<Flex
			justify={isAgent ? 'flex-end' : 'flex-start'}
			mb={3}>
			{/* <JsonView data={message} />
			<JsonView data={chat} /> */}
			<Box
				sx={{
					...styles.messageBox,
					bg: isAgent ? agentBg : customerBg,
					color: isAgent ? 'white' : useColorModeValue('black', 'white'),
					borderRadius: isAgent ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
				}}>
				<Text
					fontSize='xs'
					fontWeight='semibold'
					mb={1}
					opacity={0.9}>
					{isAgent ? message?.senderName : chat?.chat?.customerId?.name}
				</Text>
				<Text
					fontSize='sm'
					whiteSpace='pre-wrap'>
					{message?.content}
				</Text>
				<Text
					fontSize='xs'
					opacity={0.7}
					mt={2}
					textAlign='right'>
					{new Date(message?.timestamp || message?.createdAt).toLocaleTimeString([], {
						hour: '2-digit',
						minute: '2-digit',
					})}
				</Text>
			</Box>
		</Flex>
	);
};

const styles = {
	messageBox: {
		maxW: '70%',
		p: 3,
		boxShadow: 'sm',
	},
};

export default MessageItem;
