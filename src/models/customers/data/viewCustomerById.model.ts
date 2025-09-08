import { ViewModalDataModelProps } from '@/components/library';

const viewCustomerDataFields: ViewModalDataModelProps[] = [
	{
		title: 'Image',
		dataKey: 'image',
		type: 'image',
	},
	{
		title: 'Name',
		dataKey: 'name',
		type: 'string',
	},
	{
		title: 'Email',
		dataKey: 'email',
		type: 'string',
	},
	{
		title: 'Phone',
		dataKey: 'phone',
		type: 'string',
	},

	{
		title: 'Is Registered Online',
		dataKey: 'isRegisteredOnline',
		type: 'tag',
		colorScheme: (data: boolean) => (data ? 'green' : 'red'),
	},

	{
		title: 'Is Active',
		dataKey: 'isActive',
		type: 'tag',

		colorScheme: (data: boolean) => (data ? 'green' : 'red'),
	},

	{ title: 'Created', dataKey: 'createdAt', type: 'date' },
];

export default viewCustomerDataFields;
