const formFields = {
	customer: {
		name: 'customer',
		label: 'Customer',
		isRequired: true,
		model: 'customers',
	},
	date: {
		name: 'date',
		label: 'Invoice Date',
		type: 'date',
		isRequired: true,
	},

	shippingCost: {
		name: 'shippingCost',
		label: 'Shipping Cost',
		type: 'number',
		isRequired: true,
	},
	paymentMethod: {
		name: 'paymentMethod',
		label: 'Payment Method',
	},
	discount: {
		name: 'discount',
		label: 'Discount',
		type: 'number',
		isRequired: true,
	},
	vat: {
		name: 'vat',
		label: 'VAT',
		type: 'number',
		isReadOnly: true,
		isRequired: true,
	},
	subTotal: {
		name: 'subTotal',
		label: 'Sub Total',
		type: 'number',
		isReadOnly: true,
		isRequired: true,
	},
	paidAmount: {
		name: 'paidAmount',
		label: 'Paid Amount',
		type: 'number',
		isRequired: true,
	},
	dueAmount: {
		name: 'dueAmount',
		label: 'Due Amount',
		type: 'number',
		isReadOnly: true,
	},
	total: {
		name: 'total',
		label: 'Total',
		type: 'number',
		isReadOnly: true,
	},
};

export default formFields;
