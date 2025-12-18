'use client';

import React from 'react';
import { Badge } from '@chakra-ui/react';
import { QueryStatus } from './types';

interface QueryStatusBadgeProps {
	status: QueryStatus;
	size?: 'sm' | 'md' | 'lg';
}

const QueryStatusBadge: React.FC<QueryStatusBadgeProps> = ({ status, size = 'md' }) => {
	const statusConfig = styles?.statusConfig[status];

	return (
		<Badge
			colorScheme={statusConfig?.color}
			fontSize={size === 'sm' ? 'xs' : size === 'md' ? 'sm' : 'md'}
			px={2}
			py={1}
			borderRadius='md'
			textTransform='capitalize'>
			{statusConfig?.icon} {statusConfig?.label}
		</Badge>
	);
};

const styles = {
	statusConfig: {
		pending: {
			color: 'blue',
			label: 'Unresolved',
			icon: '🆕',
		},
		unresolved: {
			color: 'blue',
			label: 'Unresolved',
			icon: '🆕',
		},
		ongoing: {
			color: 'orange',
			label: 'Ongoing',
			icon: '🔄',
		},
		resolved: {
			color: 'green',
			label: 'Resolved',
			icon: '✅',
		},
		'for-later': {
			color: 'purple',
			label: 'For Later',
			icon: '⏰',
		},
		invalid: {
			color: 'red',
			label: 'Invalid',
			icon: '❌',
		},
		'follow-up': {
			color: 'teal',
			label: 'Follow Up',
			icon: '📌',
		},
	},
};

export default QueryStatusBadge;
