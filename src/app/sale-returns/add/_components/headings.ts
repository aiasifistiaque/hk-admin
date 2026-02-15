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
		content: 'Original Qty',
	},
	{
		content: 'Return Qty',
	},
	{
		content: 'Unit Price',
		isNumeric: true,
	},
	{
		content: 'SubTotal',
		isNumeric: true,
	},
	{
		content: 'Action',
	},
];

export default headings;
