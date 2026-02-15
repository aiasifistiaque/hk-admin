export const formFields = [
	{
		name: 'saleInvoice',
		label: 'Original Sale Invoice',
		type: 'text',
		required: true,
		disabled: true,
	},
	{
		name: 'warehouse',
		label: 'Warehouse',
		type: 'ref',
		model: 'warehouses',
		required: true,
	},
	{
		name: 'exchangeDate',
		label: 'Exchange Date',
		type: 'date',
		required: true,
	},
	{
		name: 'reason',
		label: 'Exchange Reason',
		type: 'select',
		options: 'reasonOptions',
		required: true,
	},
	{
		name: 'condition',
		label: 'Item Condition',
		type: 'select',
		options: 'conditionOptions',
		required: true,
	},
	{
		name: 'reasonNote',
		label: 'Reason Details',
		type: 'textarea',
		required: false,
	},
	{
		name: 'note',
		label: 'Notes',
		type: 'textarea',
		required: false,
	},
];
