import { fields, formFields } from '@/app/items/config';
import { MenuItemProps } from '@/components/library';
import ViewOrderModal from '@/components/library/pos/ViewOrderModel';
import ViewStockModal from '@/components/library/pos/ViewStockModal';

const itemMenu: MenuItemProps[] = [
	{
		title: 'View Stocks',
		type: 'custom-modal',
		modal: ViewStockModal,
	},
	{
		title: 'View Items',
		type: 'view-modal',
		fields: fields,
	},
	{ type: 'view-item', title: 'View Details' },
	{
		title: 'Edit Details',
		type: 'edit-modal',
		layout: formFields,
	},
	{
		title: 'Make Copy',
		type: 'duplicate',
	},
	{
		title: 'Delete',
		type: 'delete',
	},
];

export default itemMenu;
