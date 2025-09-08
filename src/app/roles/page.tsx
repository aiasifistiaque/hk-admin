'use client';

import React from 'react';
import { NextPage } from 'next';
import {
	ServerPageTable,
	ServerTableObjectProps,
} from '@/components/library';

const table: ServerTableObjectProps = {
	title: 'Admin Role',
	path: 'roles',
	export: true,
	button: {
		title: 'New Role',
		isModal: true,
	},

	menu: [
		{ type: 'view-server-modal', title: 'View' },
		{ type: 'view-item', title: 'Go To Post' },
		{
			title: 'Edit Details',
			type: 'edit-server-modal',
		},

		{ type: 'delete', title: 'Delete' },
	],
};
const page: NextPage = () => {
	return <ServerPageTable table={table} />;
};

export default page;
