// Types for Customer Service Chat System

export type QueryStatus =
	| 'unresolved'
	| 'ongoing'
	| 'resolved'
	| 'for-later'
	| 'invalid'
	| 'follow-up';

export interface Query {
	id: string;
	customerId: string;
	customerName: string;
	subject: string;
	status: QueryStatus;
	assignedAgent?: string;
	assignedAgentId?: string;
	createdAt: Date;
	updatedAt: Date;
	messages?: Message[];
	messageCount?: number;
}

export interface Message {
	id: string;
	queryId: string;
	senderId: string;
	senderName: string;
	senderType: 'customer' | 'agent';
	content: string;
	timestamp: Date;
}

export interface Agent {
	id: string;
	name: string;
	activeQueryId?: string;
}
