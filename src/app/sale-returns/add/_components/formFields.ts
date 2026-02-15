const formFields = {
	saleInvoice: {
		name: 'saleInvoice',
		label: 'Sale Invoice',
		isRequired: true,
		placeholder: 'Enter invoice number',
	},
	warehouse: {
		name: 'warehouse',
		label: 'Return Warehouse',
		isRequired: true,
		model: 'warehouses',
	},
	returnDate: {
		name: 'returnDate',
		label: 'Return Date',
		type: 'date',
		isRequired: true,
	},
	reason: {
		name: 'reason',
		label: 'Return Reason',
		isRequired: true,
	},
	condition: {
		name: 'condition',
		label: 'Item Condition',
		isRequired: true,
	},
	refundMethod: {
		name: 'refundMethod',
		label: 'Refund Method',
		isRequired: true,
	},
	account: {
		name: 'account',
		label: 'Refund Account',
		model: 'assets',
	},
	restockingFee: {
		name: 'restockingFee',
		label: 'Restocking Fee',
		type: 'number',
	},
	subTotal: {
		name: 'subTotal',
		label: 'Sub Total',
		type: 'number',
		isReadOnly: true,
	},
	total: {
		name: 'total',
		label: 'Return Total',
		type: 'number',
		isReadOnly: true,
	},
	refundAmount: {
		name: 'refundAmount',
		label: 'Refund Amount',
		type: 'number',
		isReadOnly: true,
	},
	reasonNote: {
		name: 'reasonNote',
		label: 'Reason Note',
		type: 'textarea',
	},
	note: {
		name: 'note',
		label: 'Additional Notes',
		type: 'textarea',
	},
};

export default formFields;
