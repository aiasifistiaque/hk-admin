const schema = {
	code: {
		label: 'Code',
		type: 'string',
		displayInTable: true,
		default: true,
		sort: true,
	},
	name: {
		label: 'Name',
		type: 'string',
		displayInTable: true,
		default: true,
		sort: true,
	},
	image: {
		label: 'Image',
		type: 'string',
		displayInTable: false,
	},
	barcode: {
		label: 'Barcode',
		type: 'string',
		displayInTable: true,
	},
	sku: {
		label: 'SKU',
		type: 'string',
		displayInTable: true,
	},
	hasVariant: {
		label: 'Has Variant',
		type: 'checkbox',
		displayInTable: true,
		colorScheme: (hasVariant: boolean) => (hasVariant ? 'green' : 'gray'),
	},
	categories: {
		label: 'Categories',
		type: 'array',
		displayInTable: true,
	},
	unit: {
		label: 'Unit',
		type: 'text',
		displayInTable: true,
		tableKey: 'unit.name',
	},
	description: {
		label: 'Description',
		type: 'string',
		displayInTable: true,
	},
	buyPrice: {
		label: 'Buy Price',
		type: 'number',
		displayInTable: true,
		default: true,
	},
	price: {
		label: 'Sale Price',
		type: 'number',
		displayInTable: true,
		default: true,
	},
	buyTax: {
		label: 'Buy Tax',
		type: 'text',
		displayInTable: true,
		tableKey: 'buyTax.name',
	},
	saleTax: {
		label: 'Sale Tax',
		type: 'text',
		displayInTable: true,
		tableKey: 'saleTax.name',
	},
	sizes: {
		label: 'Sizes',
		type: 'array',
		displayInTable: true,
	},
	colors: {
		label: 'Colors',
		type: 'array',
		displayInTable: true,
	},
	variant: {
		label: 'Variants',
		type: 'array',
		displayInTable: true,
	},
	primaryStock: {
		label: 'Stock',
		type: 'array',
		displayInTable: true,
	},
	status: {
		label: 'Status',
		type: 'text',
		tableType: 'tag',
		colorScheme: (status: string) => {
			if (status === 'published') return 'green';
			else if (status === 'draft') return 'blue';
			else if (status === 'archived') return 'red';
			else return 'gray';
		},
		displayInTable: true,
		default: true,
	},
};

export default schema;
