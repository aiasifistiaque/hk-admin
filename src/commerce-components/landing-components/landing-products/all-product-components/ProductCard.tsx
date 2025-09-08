'use client';

import React, { FC, ReactNode } from 'react';
import {
	Column,
	SubHeading,
	Title,
	sizes,
	Text,
	BgImage,
	Button,
	ButtonChild,
	currency,
} from '../../..';
import { FlexProps } from '@chakra-ui/react';

const IMAGE_SIZE = { base: '100%', md: '100%', lg: '100%' };

type ProductCardProps = FlexProps & {
	name: string;
	price: number | string;
	src: string;
	category: {
		name: string;
	};
};

const ProductCard: FC<ProductCardProps> = ({ name, price, src, category, ...props }) => {
	return (
		<Container {...props}>
			<CardImage src={src}>
				<AddToCartButton>Add to Cart</AddToCartButton>
			</CardImage>
			<Column>
				<Text fontSize='1.2rem'>
					{currency?.symbol} {price}
				</Text>
				<Title type='h6'>{name}</Title>
				<SubHeading fontSize='1.1rem'>{category?.name}</SubHeading>
			</Column>
		</Container>
	);
};

const Container = ({ children, ...props }: FlexProps & { children: ReactNode }) => (
	<Column
		pb={8}
		pt={4}
		userSelect='none'
		w='full'
		gap={4}
		{...props}>
		{children}
	</Column>
);

const CardImage = ({ src, children }: { src: string; children: ReactNode }) => (
	<BgImage
		src={src}
		minH={sizes.PRODUCT_CARD_HEIGHT}
		maxH={sizes.PRODUCT_CARD_HEIGHT}
		p='16px'
		align='flex-end'
		justify='center'
		borderRadius={sizes.RADIUS}>
		{children}
	</BgImage>
);

const AddToCartButton: FC<ButtonChild> = ({ children, ...props }) => (
	<Button
		fontSize='13px'
		fontWeight='800'
		borderRadius='lg'
		textTransform='uppercase'
		w='full'
		variant='secondary'
		{...props}>
		{children}
	</Button>
);

export default ProductCard;
