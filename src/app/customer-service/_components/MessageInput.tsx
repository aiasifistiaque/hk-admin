'use client';

import React, { useState } from 'react';
import { Box, Flex, Textarea, Button, useColorModeValue } from '@chakra-ui/react';
import { MdSend } from 'react-icons/md';

interface MessageInputProps {
	onSend: (content: string) => void;
	disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled }) => {
	const [message, setMessage] = useState('');
	const bgColor = useColorModeValue('white', 'black');
	const borderColor = useColorModeValue('gray.200', 'gray.700');

	const handleSend = () => {
		if (message.trim()) {
			onSend(message.trim());
			setMessage('');
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<Box sx={{ ...styles.container, bg: bgColor, borderColor }}>
			<Flex
				gap={2}
				align='flex-end'>
				<Textarea
					value={message}
					onChange={e => setMessage(e.target.value)}
					onKeyPress={handleKeyPress}
					placeholder='Type your message... (Shift + Enter for new line)'
					disabled={disabled}
					resize='none'
					rows={3}
					sx={styles.textarea}
				/>
				<Button
					colorScheme='blue'
					onClick={handleSend}
					disabled={disabled || !message.trim()}
					leftIcon={<MdSend />}
					sx={styles.button}>
					Send
				</Button>
			</Flex>
			{message.length > 0 && (
				<Box
					fontSize='xs'
					color='gray.500'
					mt={1}
					textAlign='right'>
					{message.length} characters
				</Box>
			)}
		</Box>
	);
};

const styles = {
	container: {
		p: 4,
		borderTop: '1px solid',
	},
	textarea: {
		flex: 1,
	},
	button: {
		minW: '100px',
		h: '48px',
	},
};

export default MessageInput;
