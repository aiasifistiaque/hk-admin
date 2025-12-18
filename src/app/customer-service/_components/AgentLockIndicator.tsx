'use client';

import React from 'react';
import { Box, Flex, Text, Icon } from '@chakra-ui/react';
import { MdLock } from 'react-icons/md';

interface AgentLockIndicatorProps {
	agentName: string;
	duration?: string;
	variant?: 'compact' | 'full';
}

const AgentLockIndicator: React.FC<AgentLockIndicatorProps> = ({
	agentName,
	duration,
	variant = 'full',
}) => {
	if (variant === 'compact') {
		return (
			<Flex
				align='center'
				gap={1}
				color='orange.500'>
				<Icon
					as={MdLock}
					boxSize={3}
				/>
				<Text
					fontSize='xs'
					fontWeight='medium'>
					{agentName}
				</Text>
			</Flex>
		);
	}

	return (
		<Box sx={styles.container}>
			<Flex
				align='center'
				gap={2}>
				<Icon
					as={MdLock}
					boxSize={4}
					color='orange.500'
				/>
				<Box>
					<Text
						fontSize='sm'
						fontWeight='semibold'
						color='orange.600'>
						Currently being handled
					</Text>
					<Text
						fontSize='xs'
						color='gray.600'>
						by {agentName} {duration && `• ${duration}`}
					</Text>
				</Box>
			</Flex>
		</Box>
	);
};

const styles = {
	container: {
		p: 3,
		bg: 'orange.50',
		borderRadius: 'md',
		border: '1px solid',
		borderColor: 'orange.200',
	},
};

export default AgentLockIndicator;
