import { FlexChild } from '../..';
import { Flex } from '@chakra-ui/react';
import React from 'react';

const SpaceBetween: React.FC<FlexChild> = ({ children, ...props }) => {
	return (
		<Flex
			w='100%'
			alignItems='center'
			justifyContent='space-between'
			gap={2}
			{...props}>
			{children}
		</Flex>
	);
};

export default SpaceBetween;
