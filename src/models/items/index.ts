import { convertToTableFields, TableObjectProps } from '@/components/library';
import itemMenu from './itemMenu';
import { itemSchema } from '..';
import multiSelectMenu from '../products/data/multiSelect';
import { tableFields } from '@/app/items/config';

export const viewAllDataFields = convertToTableFields({
	schema: itemSchema,
	fields: tableFields,
});

const viewAll: TableObjectProps = {
	title: 'Items',
	path: 'items',
	clickable: true,
	toPath: '/items/edit',
	export: true,
	select: {
		show: true,
		menu: multiSelectMenu,
	},
	button: {
		title: 'Add Item',
		path: '/items/create',
	},
	menu: itemMenu,
	data: viewAllDataFields,
};

export { viewAll as viewAll };
