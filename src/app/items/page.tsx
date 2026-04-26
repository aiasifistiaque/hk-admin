'use client';

import { NextPage } from 'next';
import {
	BackendPageTable,
	BackendTableObjectProps,
} from '@/components/library';
import { formFields, tableFields } from './config';
import itemMenu from '@/models/items/itemMenu';

const table: BackendTableObjectProps = {
	title: 'Items',
	path: 'items',
	export: true,
	button: {
		title: 'Add Item',
		isModal: true,
		layout: formFields,
	},
	fields: tableFields,
	menu: itemMenu
};

const ItemPage: NextPage = () => {
	return <BackendPageTable table={table} />;
};

export default ItemPage;
