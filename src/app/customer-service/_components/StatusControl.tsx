'use client';

import React from 'react';
import { Box, Flex, Button, Select, Text, useToast, useColorModeValue } from '@chakra-ui/react';
import { QueryStatus } from './types';

interface StatusControlProps {
	currentStatus: QueryStatus;
	onStatusChange: (newStatus: QueryStatus) => Promise<void>;
	onLeaveChat: () => void;
	disabled?: boolean;
}

const StatusControl: React.FC<StatusControlProps> = ({
	currentStatus,
	onStatusChange,
	onLeaveChat,
	disabled,
}) => {
	const toast = useToast();
	const [isChanging, setIsChanging] = React.useState(false);
	const bgColor = useColorModeValue('white', 'black');

	const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newStatus = e.target.value as QueryStatus;
		if (newStatus === currentStatus) return;

		setIsChanging(true);
		try {
			await onStatusChange(newStatus);
			toast({
				title: 'Status updated',
				status: 'success',
				duration: 2000,
			});
		} catch (error) {
			toast({
				title: 'Failed to update status',
				status: 'error',
				duration: 3000,
			});
		} finally {
			setIsChanging(false);
		}
	};

	const handleLeave = () => {
		if (currentStatus === 'ongoing') {
			toast({
				title: 'Change status before leaving',
				description: 'Please update the query status before closing the chat.',
				status: 'warning',
				duration: 4000,
			});
			return;
		}
		onLeaveChat();
	};

	return (
		<Flex
			gap={3}
			align='center'>
			<Box>
				<Text
					fontSize='xs'
					color='gray.500'
					mb={1}>
					Status
				</Text>
				<Select
					value={currentStatus}
					onChange={handleStatusChange}
					disabled={disabled || isChanging}
					size='sm'
					bg={bgColor}
					minW='140px'>
					<option value='ongoing'>Ongoing</option>
					<option value='resolved'>Resolved</option>
					<option value='for-later'>For Later</option>
					<option value='unresolved'>Unresolved</option>
					<option value='invalid'>Invalid</option>
					<option value='follow-up'>Follow Up</option>
				</Select>
			</Box>
			<Button
				size='sm'
				colorScheme='red'
				variant='outline'
				onClick={handleLeave}
				disabled={disabled}
				mt={5}>
				Leave Chat
			</Button>
		</Flex>
	);
};

export default StatusControl;
