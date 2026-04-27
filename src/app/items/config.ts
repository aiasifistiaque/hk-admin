
'use client';

import { FormLayout } from '@/components/library';

export const fields = [
	'code',
	'image',
	'name',
	'address',
	'phone',
	'price',
	'createdAt',
	'updatedAt',
];

export const tableFields = [
	'code',
	'name',
	'unit',
	'buyPrice',
	'price',
	'barcode',
	'sku',
	'status',
	'stock',
	'createdAt',
];

export const formFields: FormLayout = [
	{
		sectionTitle: 'Item details',
		fields: [
			['name', 'categories'],
			['status', 'unit'],
			['barcode', 'sku'],
		],
	},

	{
		sectionTitle: 'Item Pricing',
		fields: [
			['buyPrice', 'buyTax'],
			['price', 'saleTax'],
		],
	},
	{
		sectionTitle: 'Item Variation & Stock',
		fields: ['hasVariant', 'variant', 'stock'],
	},
	{
		sectionTitle: 'Item Description',
		fields: ['description'],
	},
	{
		sectionTitle: 'Item Image',
		fields: ['image'],
	},
];
