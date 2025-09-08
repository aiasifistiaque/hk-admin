import { FlexChild } from '../..';
import React, { FC } from 'react';
import { Flex } from '@chakra-ui/react';

const ColRow: FC<FlexChild> = ({ children, ...props }) => {
	return (
		<Flex
			flexDir={{ base: 'column', md: 'row' }}
			gap={1}
			w='full'
			{...props}>
			{children}
		</Flex>
	);
};

export default ColRow;
