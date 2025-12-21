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
		content: 'In Hand',
	},
	// {
	// 	content: 'Variant',
	// },
	{
		content: 'New In Hand',
	},
	// {
	// 	content: 'Discount',
	// },
	{
		content: 'Adjusted Qty',
		isNumeric: true,
	},
	{
		content: 'delete',
	},
];

export default headings;
