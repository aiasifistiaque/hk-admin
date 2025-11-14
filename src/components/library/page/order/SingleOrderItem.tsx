import React from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import { currency, OrderItemText, useGetByIdQuery } from '../..';

const SingleOrderItem = ({ item, index }: { item: any; index: number }) => {
	const { data } = useGetByIdQuery({ path: 'products', id: item?._id });
	return (
		<Grid gridTemplateColumns='2fr 1fr 1fr 1fr'>
			<OrderItemText fontWeight='600'>
				{index + 1}. {item?.name} (SKU: {data?.sku || '--'}){' '}
				{item?.variantName && `- ${item?.variantName}`}
			</OrderItemText>
			<GridItem textAlign='center'>{item?.unitPrice?.toFixed(2)?.toLocaleString()}</GridItem>
			<GridItem textAlign='center'>{item?.qty - item?.returnQty}</GridItem>
			<GridItem textAlign='right'>
				{currency.symbol}
				{(item?.unitPrice * item?.qty).toFixed(2)?.toLocaleString()}
			</GridItem>
		</Grid>
	);
};

export default SingleOrderItem;
