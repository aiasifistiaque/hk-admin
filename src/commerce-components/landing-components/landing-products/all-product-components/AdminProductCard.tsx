'use client';

import React, { FC, ReactNode } from 'react';
import { Column, SubHeading, Title, sizes, Text, BgImage, Button, ButtonChild } from '../../..';
import { FlexProps, Image } from '@chakra-ui/react';

const IMAGE_SIZE = { base: '100%', md: '100%', lg: '100%' };

type ProductCardProps = FlexProps & {
	name: string;
	price: number | string;
	src: string;
	category: {
		name: string;
	};
};

const AdminProductCard: FC<ProductCardProps> = ({ name, price, src, category, ...props }) => {
	return (
		<Container {...props}>
			<CardImage src={src} />

			<Column>
				<Text fontSize='.9rem'>BDT. {price}</Text>
				<Title
					type='h6'
					fontSize='1rem'>
					{name}
				</Title>
				{/* <SubHeading fontSize='1.1rem'>{category?.name}</SubHeading> */}
			</Column>
		</Container>
	);
};

const Container = ({ children, ...props }: FlexProps & { children: ReactNode }) => (
	<Column
		border='1px dashed'
		borderRadius={sizes.RADIUS}
		p={2}
		userSelect='none'
		w='full'
		gap={4}
		{...props}>
		{children}
	</Column>
);

const CardImage = ({ src, children }: { src: string; children?: ReactNode }) => (
	<Image
		src={src}
		w='100%'
		h='100px'
		objectFit='contain'
	/>
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

export default AdminProductCard;
