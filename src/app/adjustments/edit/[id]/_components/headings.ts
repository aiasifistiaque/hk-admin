export type HeadingProps = {
	content: string;
	isNumeric?: boolean;
};

const headings: HeadingProps[] = [
	{
		content: '#',
	},
	{
		content: 'Product Name',
	},
	{
		content: 'Qty',
	},
	{
		content: 'Variant',
	},
	{
		content: 'Unit Price',
	},
	// {
	// 	content: 'Discount',
	// },
	{
		content: 'SubTotal',
		isNumeric: true,
	},
	{
		content: 'delete',
	},
];

export default headings;
