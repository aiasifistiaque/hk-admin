// import { URL } from '../..';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const URL = process.env.NEXT_PUBLIC_BACKEND || 'http://localhost:5000';

const tags = [
	'donors',
	'donations',
	'roles',
	'groups',
	'expenses',
	'documents',
	'blogs',
	'users',
	'emails',
	'subscriptions',
	'newsletters',
	'auth',
	'/sidebar/crm/page',
	'schema',
	'self',
	'config',
	'uploads',
	'chats',
	'messages',
	'items',
	'/sidebar/crm/server',
	'filters',
	'stocks',
	'files',
	'sms/check',
	'assets',
	'sales',
	'upload',
	'analytics/products/top-selling?orderDate_last=days_7',
	'analytics/customers/top-buying?orderDate_last=days_7',
	'analytics/yearly-profit-loss',
];

export const mainApi = createApi({
	reducerPath: 'mainApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${URL}`,
		prepareHeaders: (headers, { getState }) => {
			const token: string = (getState() as any).auth?.token;
			if (token) {
				headers.set('authorization', token);
			}
		},
	}),
	tagTypes: tags,
	endpoints: builder => ({}),
});

export default mainApi;
