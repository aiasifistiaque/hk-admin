import React from 'react';
import { JsonView, TableObjectProps } from '@/components/library';
import { viewAllDataFields } from '@/models/order';
import TableCustom from '../library/sections/table/TableCustom';

const viewAll: TableObjectProps = {
	title: 'Orders',
	path: 'orders',
	clickable: true,
	toPath: '/orders',
	export: false,
	search: false,
	hidePreferences: true,
	filters: false,
	pagination: false,
	limit: 5,
	preferences: ['invoice', 'customer.name', 'status', 'orderDate', 'total', 'totalItems'],
	// select: {
	// 	show: true,
	// 	menu: multiSelectMenu,
	// },
	// button: {
	// 	title: 'Add Product',
	// 	path: '/products/create',
	// },
	// menu: itemMenu,
	// clickable: true,

	data: viewAllDataFields,
	showMenu: false,
};

const OrderTable = () => {
	return (
		<>
			<TableCustom
				// debug
				table={viewAll}
			/>
		</>
	);
};

export default OrderTable;
