'use client';

import React, { useState, useEffect } from 'react';
import { JsonView, Layout, useGetAllQuery, useGetSelfQuery } from '@/components/library';
import { QueryList } from './_components';
import { Query } from './_components/types';

const Page = () => {
	const [queries, setQueries] = useState<Query[]>([]);
	const [activeQueryId, setActiveQueryId] = useState<string | undefined>();

	// Get current agent from auth
	const { data: selfData } = useGetSelfQuery({});
	const currentAgentId = selfData?.data?._id;

	// Fetch chats from API
	const { data: chatsData, isLoading } = useGetAllQuery({
		path: 'chats',
		page: 1,
		limit: 100,
		sort: '-createdAt',
	});

	useEffect(() => {
		// Transform API data to Query format
		if ((chatsData as any)?.doc) {
			const transformedQueries: Query[] = (chatsData as any).doc.map((chat: any) => ({
				id: chat._id,
				customerId: chat.customerId,
				customerName: chat.customerName || 'Customer',
				subject: chat.subject,
				status: chat.status,
				assignedAgent: chat.assignedAgentName,
				assignedAgentId: chat.assignedAgent,
				createdAt: new Date(chat.createdAt),
				updatedAt: new Date(chat.updatedAt),
				messageCount: chat.messageCount || 0,
			}));
			setQueries(transformedQueries);

			// Check if agent has active query
			if (currentAgentId) {
				const activeQuery = transformedQueries.find(
					q => q.status === 'ongoing' && q.assignedAgentId === currentAgentId
				);
				setActiveQueryId(activeQuery?.id);
			}
		}
	}, [chatsData, currentAgentId]);

	return (
		<Layout
			title='Customer Service'
			path='customer-service'>
			{/* <JsonView data={chatsData} /> */}
			<QueryList
				queries={chatsData?.doc || []}
				currentAgentId={currentAgentId}
				activeQueryId={activeQueryId}
			/>
		</Layout>
	);
};

export default Page;
