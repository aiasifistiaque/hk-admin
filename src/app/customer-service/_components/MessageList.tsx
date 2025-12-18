'use client';

import React, { useEffect, useRef } from 'react';
import { Box, Flex, Text, Spinner, useColorModeValue } from '@chakra-ui/react';
import MessageItem from './MessageItem';
import { Message } from './types';

interface MessageListProps {
	messages: Message[];
	currentAgentId: string;
	isLoading?: boolean;
	chat: any;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentAgentId, isLoading, chat }) => {
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const bgColor = useColorModeValue('gray.50', 'gray.900');

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	if (isLoading) {
		return (
			<Flex
				sx={styles.container}
				justify='center'
				align='center'>
				<Spinner size='lg' />
			</Flex>
		);
	}

	if (messages.length === 0) {
		return (
			<Flex
				sx={styles.container}
				justify='center'
				align='center'>
				<Text color='gray.500'>No messages yet. Start the conversation!</Text>
			</Flex>
		);
	}

	return (
		<Box sx={{ ...styles.container, bg: bgColor }}>
			<Flex
				direction='column'
				px={4}
				py={4}>
				{messages?.map(message => (
					<MessageItem
						chat={chat}
						key={message.id}
						message={message}
						isAgent={message.senderId === currentAgentId}
					/>
				))}
				<div ref={messagesEndRef} />
			</Flex>
		</Box>
	);
};

const styles = {
	container: {
		flex: 1,
		overflowY: 'auto' as const,
		maxH: 'calc(100vh - 200px)',
	},
};

export default MessageList;
