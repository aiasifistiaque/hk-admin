import { TableObjectProps } from '@/components/library';
import TableCustom from '../library/sections/table/TableCustom';

const viewAll: TableObjectProps = {
	title: 'Top Products',
	path: 'analytics/products/top-selling?orderDate_last=days_7',
	clickable: true,
	toPath: '/view/products',
	export: false,
	search: false,
	hidePreferences: true,
	filters: false,
	limit: 5,
	pagination: false,
	preferences: ['name', 'sku', 'category', 'price', 'totalQuantity'],

	data: [
		{
			dataKey: 'name',
			title: 'Product Name',
		},
		{
			dataKey: 'sku',
			title: 'SKU',
		},
		{
			dataKey: 'category',
			title: 'Category',
		},
		{
			dataKey: 'totalQuantity',
			title: 'Sold',
		},
	],
	showMenu: false,
};

const TopProducts = () => {
	return <TableCustom table={viewAll} />;
};

export default TopProducts;
