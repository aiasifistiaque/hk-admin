'use client';

import React, { useState, useEffect } from 'react';
import { Box, Flex, useToast } from '@chakra-ui/react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Query, Message, QueryStatus } from './types';
import { useSendMessageMutation, useUpdateChatStatusMutation } from '@/store/services/chatsApi';
import { Socket } from 'socket.io-client';

interface ChatWindowProps {
	query: Query;
	currentAgentId: string;
	currentAgentName: string;
	onLeaveChat: () => void;
	socket: Socket | null;
	queryId: string;
	messageData: any[];
	chatData: any;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
	query,
	currentAgentId,
	currentAgentName,
	messageData,
	onLeaveChat,
	queryId,
	chatData,
	socket,
}) => {
	const toast = useToast();
	const [messages, setMessages] = useState<Message[]>(messageData || []);
	const [currentQuery, setCurrentQuery] = useState<Query>(query);
	const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
	const [updateChatStatus] = useUpdateChatStatusMutation();

	useEffect(() => {
		// Mark as ongoing when entering chat
		if (chatData?.status !== 'ongoing') {
			handleStatusChange('ongoing');
		}
	}, []);

	const handleStatusChange = async (newStatus: QueryStatus) => {
		try {
			setCurrentQuery({ ...currentQuery, status: newStatus });
			updateChatStatus({ id: chatData?._id, status: newStatus });

			// Emit socket event for status change
			// if (socket && socket.connected) {
			// 	socket.emit('agent:update-status', {
			// 		chatId: chatData?._id,
			// 		status: newStatus,
			// 	});
			// }
		} catch (error: any) {
			console.error('Error updating status:', error);
			toast({
				title: 'Failed to update status',
				description: error?.data?.message || 'Please try again',
				status: 'error',
				duration: 3000,
			});
		}
	};
	const handleSendMessage = async (content: string) => {
		if (!content.trim() || isSending) return;

		try {
			// Emit socket event to broadcast message in real-time
			sendMessage({
				chatId: chatData?._id,

				// messageId: response.data._id,
				senderId: currentAgentId,
				senderName: currentAgentName,
				senderType: 'agent',
				content: content.trim(),
				attachments: [],
				createdAt: new Date(),
			});
			// if (socket && socket.connected) {
			// 	socket.emit('send-message', {
			// 		chatId: chatData?._id,
			// 		chatRef: chatData?._id,
			// 		// messageId: response.data._id,
			// 		senderId: currentAgentId,
			// 		senderName: currentAgentName,
			// 		senderType: 'agent',
			// 		content: content.trim(),
			// 		attachments: [],
			// 		createdAt: new Date(),
			// 	});
			// }

			// Optimistically update local state
			const newMessage: Message = {
				id: 'temp-id-' + Date.now(),
				queryId: queryId,
				senderId: currentAgentId,
				senderName: currentAgentName,
				senderType: 'agent',
				content: content.trim(),
				timestamp: new Date(),
			};
			setMessages([...messages, newMessage]);
		} catch (error: any) {
			console.error('Error sending message:', error);
			toast({
				title: 'Failed to send message',
				description: error?.data?.message || 'Please try again',
				status: 'error',
				duration: 3000,
			});
		}
	};

	return (
		<Flex
			direction='column'
			h='100vh'
			bg='red'>
			<ChatHeader
				data={chatData}
				query={currentQuery}
				onStatusChange={handleStatusChange}
				onLeaveChat={onLeaveChat}
			/>
			<MessageList
				chat={currentQuery}
				messages={messageData || []}
				currentAgentId={currentAgentId}
			/>
			<MessageInput onSend={handleSendMessage} />
		</Flex>
	);
};

export default ChatWindow;
