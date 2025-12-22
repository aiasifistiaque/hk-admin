'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Spinner, Flex, Text, Center } from '@chakra-ui/react';
import { ChatWindow } from '../_components';
import { Query, Message } from '../_components/types';
import { io, Socket } from 'socket.io-client';
import {
	useGetChatByIdQuery,
	useGetMessagesByChatIdQuery,
	useAssignChatMutation,
} from '@/store/services/chatsApi';
import Link from 'next/link';
import { JsonView, useGetSelfQuery } from '@/components/library';

const ChatPage = () => {
	const params = useParams();
	const router = useRouter();
	const queryId = params.id as string;

	const [query, setQuery] = useState<Query | null>(null);
	const [socket, setSocket] = useState<Socket | null>(null);
	const [error, setError] = useState<string | null>(null);
	const { data: selfData } = useGetSelfQuery({});

	// Fetch chat and messages from API
	const { data: chatData, isLoading: isChatLoading } = useGetChatByIdQuery(queryId, {
		pollingInterval: 2000,
	});
	const {
		data: messagesData,
		isLoading: isMessagesLoading,
		error: messagesError,
	} = useGetMessagesByChatIdQuery(queryId, { pollingInterval: 2000 });
	const [assignChat] = useAssignChatMutation();

	const isLoading = isChatLoading || isMessagesLoading;

	// Mock current agent - Replace with actual auth
	const currentAgentId = selfData?._id || 'agent_123';
	const currentAgentName = selfData?.name || 'Agent';

	useEffect(() => {
		// if (!chatData?.data || !messagesData?.data) return;
		// Handle nested data structure from API
		const chat = chatData?.data?.chat || chatData?.data;

		// Check if query is locked by another agent
		if (chat?.status === 'ongoing' && chat?.assignedAgent !== currentAgentId) {
			setError(`This query is currently being handled by ${chat?.assignedAgentName}`);
			return;
		}

		// Handle customerId as object or string
		const customerId =
			typeof chat?.customerId === 'object' ? chat?.customerId._id : chat?.customerId;
		const customerName =
			typeof chat?.customerId === 'object'
				? chat?.customerId.name
				: chat?.customerName || 'Customer';

		// Transform chat
		const transformedQuery: Query = {
			id: chat?._id,
			customerId: customerId,
			customerName: customerName,
			subject: chat?.subject,
			status: chat?.status,
			assignedAgent: chat?.assignedAgentName,
			assignedAgentId: chat?.assignedAgent,
			createdAt: new Date(chat?.createdAt),
			updatedAt: new Date(chat?.updatedAt),
			messageCount: chat?.messageCount || 0,
			messages: messagesData?.data,
		};

		setQuery(transformedQuery);

		// Assign chat to current agent if not already assigned
		if (!chat?.assignedAgent || chat?.status === 'pending') {
			assignChat(queryId).then(() => {
				console.log('Chat assigned to agent');
			});
		}

		// Initialize socket connection
		const newSocket = io('http://localhost:5000', {
			auth: {
				userId: currentAgentId,
				userType: 'agent',
			},
		});

		newSocket.on('connect', () => {
			console.log('Connected to socket server for chat');
			// Join the chat room
			newSocket.emit('join-chat', { chatId: queryId });
		});

		// Listen for new messages
		// newSocket.on('new-message', (message: any) => {
		// 	console.log('New message received:', message);
		// 	setQuery(prev => {
		// 		if (!prev) return prev;
		// 		return {
		// 			...prev,
		// 			messages: [
		// 				...(prev.messages || []),
		// 				{
		// 					id: message.messageId,
		// 					queryId: message.chatId,
		// 					senderId: message.senderId,
		// 					senderName: message.senderName,
		// 					senderType: message.senderType,
		// 					content: message.content,
		// 					timestamp: new Date(message.createdAt),
		// 				},
		// 			],
		// 		};
		// 	});
		// });

		// Listen for status changes
		newSocket.on('chat:status-changed', data => {
			console.log('Status changed:', data);
			if (data.chatId === queryId) {
				setQuery(prev => {
					if (!prev) return prev;
					return { ...prev, status: data.status };
				});
			}
		});

		setSocket(newSocket);

		return () => {
			if (newSocket) {
				newSocket.emit('leave-chat', { chatId: queryId });
				newSocket.disconnect();
			}
		};
	}, [chatData, messagesData, queryId, currentAgentId, assignChat]);

	const handleLeaveChat = () => {
		if (socket) {
			socket.emit('leave-chat', { chatId: queryId });
			socket.disconnect();
		}
		router.push('/customer-service');
	};

	if (isLoading) {
		return (
			<Center h='100vh'>
				<Spinner size='xl' />
			</Center>
		);
	}

	if (!chatData?.data && !isLoading) {
		return (
			<Center
				h='100vh'
				flexDirection='column'
				gap={4}>
				<Text
					fontSize='xl'
					color='red.500'>
					{error || 'Query not found'}
				</Text>
				<JsonView data={{ chatData }} />
				<Link href='/customer-service'>
					<Text
						color='dodgerblue'
						textDecoration='underline'>
						Back to queries
					</Text>
				</Link>
			</Center>
		);
	}

	return (
		<Box h='100vh'>
			{/* <JsonView data={{ chatData, messagesData, messagesError, query }} /> */}
			{query && (
				<ChatWindow
					chatData={chatData?.data?.chat}
					queryId={queryId}
					messageData={messagesData?.data}
					query={query}
					currentAgentId={currentAgentId}
					currentAgentName={currentAgentName}
					onLeaveChat={handleLeaveChat}
					socket={socket}
				/>
			)}
		</Box>
	);
};

export default ChatPage;
