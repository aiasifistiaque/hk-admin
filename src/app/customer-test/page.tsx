'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
	Box,
	Container,
	VStack,
	HStack,
	Input,
	Button,
	Text,
	Card,
	CardBody,
	Heading,
	Badge,
	Textarea,
	useToast,
	Flex,
	List,
	ListItem,
} from '@chakra-ui/react';
import { io, Socket } from 'socket.io-client';
import { JsonView } from '@/components/library';

interface Message {
	messageId: string;
	chatId: string;
	senderId: string;
	senderName: string;
	senderType: 'customer' | 'agent' | 'system';
	content: string;
	isRead: boolean;
	createdAt: string;
}

interface Chat {
	_id: string;
	chatId: string;
	customerId: string;
	subject: string;
	status: 'pending' | 'ongoing' | 'resolved' | 'for-later' | 'invalid' | 'escalated';
	assignedAgent?: string;
	assignedAgentName?: string;
	createdAt: string;
	lastMessageAt?: string;
}

const CustomerTestPage = () => {
	const [customerId, setCustomerId] = useState('');
	const [isConnected, setIsConnected] = useState(false);
	const [socket, setSocket] = useState<Socket | null>(null);
	const [chats, setChats] = useState<Chat[]>([]);
	const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState('');
	const [newChatSubject, setNewChatSubject] = useState('');
	const [firstMessage, setFirstMessage] = useState('');
	const toast = useToast();
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Connect to socket
	const handleConnect = () => {
		if (!customerId) {
			toast({
				title: 'Error',
				description: 'Please enter a customer ID',
				status: 'error',
				duration: 3000,
			});
			return;
		}

		const newSocket = io('http://localhost:5000', {
			auth: {
				userId: customerId,
				userType: 'customer',
			},
		});

		newSocket.on('connect', () => {
			console.log('Connected to socket server');
			setIsConnected(true);
			toast({
				title: 'Connected',
				description: 'Successfully connected to chat server',
				status: 'success',
				duration: 2000,
			});
		});

		newSocket.on('disconnect', () => {
			console.log('Disconnected from socket server');
			setIsConnected(false);
			toast({
				title: 'Disconnected',
				description: 'Disconnected from chat server',
				status: 'warning',
				duration: 2000,
			});
		});

		// Listen for chat creation response
		newSocket.on('chat:created', (data: any) => {
			console.log('Chat created:', data);
			setChats(prev => [data.chat, ...prev]);
			toast({
				title: 'Chat Created',
				description: `Chat ${data.chat.chatId} created successfully`,
				status: 'success',
				duration: 3000,
			});
		});

		// Listen for new messages
		newSocket.on('new-message', (message: Message) => {
			console.log('New message:', message);
			if (selectedChat && message.chatId === selectedChat.chatId) {
				setMessages(prev => [...prev, message]);
			}
		});

		// Listen for chat status changes
		newSocket.on('chat:status-changed', data => {
			console.log('Chat status changed:', data);
			setChats(prev =>
				prev.map(chat =>
					chat.chatId === data.chatId
						? {
								...chat,
								status: data.status,
								assignedAgent: data.assignedAgent,
								assignedAgentName: data.assignedAgentName,
						  }
						: chat
				)
			);
			if (selectedChat && selectedChat.chatId === data.chatId) {
				setSelectedChat(prev => (prev ? { ...prev, status: data.status } : null));
			}
		});

		// Listen for chat assignment
		newSocket.on('chat:assigned', data => {
			console.log('Chat assigned:', data);
			setChats(prev =>
				prev.map(chat =>
					chat.chatId === data.chatId
						? {
								...chat,
								assignedAgent: data.assignedAgent,
								assignedAgentName: data.assignedAgentName,
								status: data.status,
						  }
						: chat
				)
			);
			if (selectedChat && selectedChat.chatId === data.chatId) {
				setSelectedChat(prev =>
					prev
						? {
								...prev,
								assignedAgent: data.assignedAgent,
								assignedAgentName: data.assignedAgentName,
								status: data.status,
						  }
						: null
				);
			}
			toast({
				title: 'Agent Assigned',
				description: `${data.assignedAgentName} has joined the chat`,
				status: 'info',
				duration: 3000,
			});
		});

		setSocket(newSocket);
	};

	// Disconnect from socket
	const handleDisconnect = () => {
		if (socket) {
			socket.disconnect();
			setSocket(null);
			setIsConnected(false);
			setChats([]);
			setSelectedChat(null);
			setMessages([]);
		}
	};

	// Create new chat
	const handleCreateChat = () => {
		if (!socket || !isConnected) {
			toast({
				title: 'Error',
				description: 'Not connected to server',
				status: 'error',
				duration: 3000,
			});
			return;
		}

		if (!firstMessage) {
			toast({
				title: 'Error',
				description: 'message',
				status: 'error',
				duration: 3000,
			});
			return;
		}

		socket.emit('customer:create-chat', {
			customerId,
			subject: newChatSubject,
			firstMessage,
		});

		setNewChatSubject('');
		setFirstMessage('');
	};

	// Select chat and load messages
	const handleSelectChat = async (chat: Chat) => {
		setSelectedChat(chat);
		setMessages([]);

		// Join chat room
		if (socket) {
			socket.emit('join-chat', { chatId: chat.chatId });
		}

		// Load messages from API
		try {
			const response = await fetch(`http://localhost:5000/api/messages/chat/${chat.chatId}`);
			const data = await response.json();
			if (data.success) {
				setMessages(data.data);
			}
		} catch (error) {
			console.error('Error loading messages:', error);
			toast({
				title: 'Error',
				description: 'Failed to load messages',
				status: 'error',
				duration: 3000,
			});
		}
	};

	// Send message
	const handleSendMessage = () => {
		if (!socket || !selectedChat || !newMessage.trim()) return;

		socket.emit('send-message', {
			chatId: selectedChat?._id,
			content: newMessage,
			senderType: 'customer',
			senderId: selectedChat?.customerId,
		});

		// Add message optimistically
		const tempMessage: Message = {
			messageId: `temp-${Date.now()}`,
			chatId: selectedChat._id,
			senderId: customerId,
			senderName: 'You',
			senderType: 'customer',
			content: newMessage,
			isRead: false,
			createdAt: new Date().toISOString(),
		};
		setMessages(prev => [...prev, tempMessage]);
		setNewMessage('');
	};

	// Scroll to bottom
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	// Load customer's chats
	useEffect(() => {
		if (isConnected && customerId) {
			fetch(`http://localhost:5000/api/chats/customer/${customerId}`)
				.then(res => res.json())
				.then(data => {
					if (data.success) {
						setChats(data.data);
					}
				})
				.catch(error => console.error('Error loading chats:', error));
		}
	}, [isConnected, customerId]);

	return (
		<Container
			maxW='container.xl'
			py={8}>
			<VStack
				spacing={6}
				align='stretch'>
				{/* Header */}
				<Box>
					<Heading
						size='lg'
						mb={2}>
						Customer Chat Test Interface
					</Heading>
					<Text color='gray.600'>Test the customer service chat system as a customer</Text>
				</Box>

				{/* Connection Section */}
				<Card>
					<CardBody>
						<VStack spacing={4}>
							<HStack w='full'>
								<Input
									placeholder='Enter Customer ID'
									value={customerId}
									onChange={e => setCustomerId(e.target.value)}
									isDisabled={isConnected}
								/>
								{!isConnected ? (
									<Button
										colorScheme='blue'
										onClick={handleConnect}
										isDisabled={!customerId}>
										Connect
									</Button>
								) : (
									<Button
										colorScheme='red'
										onClick={handleDisconnect}>
										Disconnect
									</Button>
								)}
							</HStack>
							{isConnected && (
								<Badge
									colorScheme='green'
									fontSize='md'
									px={3}
									py={1}>
									Connected as {customerId}
								</Badge>
							)}
						</VStack>
					</CardBody>
				</Card>

				{isConnected && (
					<>
						{/* Create New Chat Section */}
						<Card>
							<CardBody>
								<Heading
									size='md'
									mb={4}>
									Create New Chat
								</Heading>
								<VStack spacing={3}>
									<Input
										placeholder='Subject (e.g., Order Issue, Product Inquiry)'
										value={newChatSubject}
										onChange={e => setNewChatSubject(e.target.value)}
									/>
									<Textarea
										placeholder='First message...'
										value={firstMessage}
										onChange={e => setFirstMessage(e.target.value)}
										rows={3}
									/>
									<Button
										colorScheme='blue'
										w='full'
										onClick={handleCreateChat}>
										Create Chat
									</Button>
								</VStack>
							</CardBody>
						</Card>

						{/* Chat List and Messages */}
						<Flex
							gap={4}
							h='600px'>
							{/* Chat List */}
							<Card
								flex='0 0 350px'
								overflow='hidden'>
								<CardBody p={0}>
									<Box
										p={4}
										borderBottomWidth={1}>
										<Heading size='md'>My Chats ({chats.length})</Heading>
									</Box>
									<List
										spacing={0}
										overflowY='auto'
										maxH='540px'>
										{chats.map(chat => (
											<ListItem
												key={chat.chatId}
												p={4}
												borderBottomWidth={1}
												cursor='pointer'
												bg={selectedChat?.chatId === chat.chatId ? 'blue.50' : 'white'}
												_hover={{ bg: 'gray.50' }}
												onClick={() => handleSelectChat(chat)}>
												<VStack
													align='start'
													spacing={2}>
													<HStack
														justify='space-between'
														w='full'>
														<Text
															fontWeight='bold'
															fontSize='sm'
															noOfLines={1}>
															{chat.subject}
														</Text>
														<Badge
															colorScheme={chat.status === 'ongoing' ? 'green' : 'gray'}
															fontSize='xs'>
															{chat.status}
														</Badge>
													</HStack>
													<Text
														fontSize='xs'
														color='gray.500'>
														Chat ID: {chat.chatId}
													</Text>
													{chat.assignedAgentName && (
														<Text
															fontSize='xs'
															color='blue.600'>
															Agent: {chat.assignedAgentName}
														</Text>
													)}
												</VStack>
											</ListItem>
										))}
										{chats.length === 0 && (
											<Box
												p={8}
												textAlign='center'>
												<Text color='gray.500'>No chats yet. Create one to start!</Text>
											</Box>
										)}
									</List>
								</CardBody>
							</Card>

							{/* Messages */}
							<Card
								flex='1'
								overflow='hidden'>
								{selectedChat ? (
									<CardBody
										p={0}
										display='flex'
										flexDirection='column'
										h='full'>
										{/* Chat Header */}
										<Box
											p={4}
											borderBottomWidth={1}>
											<VStack
												align='start'
												spacing={1}>
												<Heading size='md'>{selectedChat.subject}</Heading>
												<HStack>
													<Badge colorScheme={selectedChat.status === 'ongoing' ? 'green' : 'gray'}>
														{selectedChat.status}
													</Badge>
													{selectedChat.assignedAgentName && (
														<Text
															fontSize='sm'
															color='gray.600'>
															Agent: {selectedChat.assignedAgentName}
														</Text>
													)}
												</HStack>
											</VStack>
										</Box>

										{/* Messages */}
										<Box
											flex='1'
											overflowY='auto'
											p={4}>
											<VStack
												spacing={3}
												align='stretch'>
												{messages.map(msg => (
													<Box
														key={msg.messageId}
														alignSelf={msg.senderType === 'customer' ? 'flex-end' : 'flex-start'}
														maxW='70%'>
														<Box
															bg={
																msg.senderType === 'customer'
																	? 'blue.500'
																	: msg.senderType === 'system'
																	? 'gray.200'
																	: 'white'
															}
															color={msg.senderType === 'customer' ? 'white' : 'black'}
															p={3}
															borderRadius='lg'
															borderWidth={msg.senderType === 'agent' ? 1 : 0}>
															{msg.senderType !== 'customer' && (
																<Text
																	fontSize='xs'
																	fontWeight='bold'
																	mb={1}>
																	{msg.senderName}
																</Text>
															)}
															<Text fontSize='sm'>{msg.content}</Text>
															<Text
																fontSize='xs'
																opacity={0.7}
																mt={1}>
																{new Date(msg.createdAt).toLocaleTimeString()}
															</Text>
														</Box>
													</Box>
												))}
												<div ref={messagesEndRef} />
											</VStack>
										</Box>

										{/* Message Input */}
										<Box
											p={4}
											borderTopWidth={1}>
											{selectedChat.status === 'resolved' || selectedChat.status === 'invalid' ? (
												<Box
													textAlign='center'
													py={2}>
													<Text
														color='red.500'
														fontWeight='bold'>
														This chat is {selectedChat.status}. No new messages can be sent.
													</Text>
												</Box>
											) : (
												<HStack>
													<JsonView data={selectedChat} />
													<Input
														placeholder='Type a message...'
														value={newMessage}
														onChange={e => setNewMessage(e.target.value)}
														onKeyPress={e => {
															if (e.key === 'Enter' && !e.shiftKey) {
																e.preventDefault();
																handleSendMessage();
															}
														}}
													/>

													<Button
														colorScheme='blue'
														onClick={handleSendMessage}
														isDisabled={!newMessage.trim()}>
														Send
													</Button>
												</HStack>
											)}
										</Box>
									</CardBody>
								) : (
									<CardBody>
										<Flex
											h='full'
											align='center'
											justify='center'>
											<Text color='gray.500'>Select a chat to view messages</Text>
										</Flex>
									</CardBody>
								)}
							</Card>
						</Flex>
					</>
				)}
			</VStack>
		</Container>
	);
};

export default CustomerTestPage;
