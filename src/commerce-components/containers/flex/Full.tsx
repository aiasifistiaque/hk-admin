import { FlexChild } from '../..';
import React, { FC } from 'react';
import { Flex } from '@chakra-ui/react';

const Full: FC<FlexChild> = ({ children, ...props }) => {
	return (
		<Flex
			w='full'
			{...props}>
			{children}
		</Flex>
	);
};

export default Full;
