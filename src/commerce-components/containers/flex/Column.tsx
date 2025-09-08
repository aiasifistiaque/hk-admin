import { FlexChild } from '../..';
import React, { FC } from 'react';
import { Flex } from '@chakra-ui/react';

const Column: FC<FlexChild> = ({ children, ...props }) => {
	return (
		<Flex
			w='full'
			flexDir='column'
			gap={1}
			{...props}>
			{children}
		</Flex>
	);
};

export default Column;
