import { Flex } from '@chakra-ui/react';
import React, { FC } from 'react';
import { FlexChild } from '../..';

const AlignCenter: FC<FlexChild> = ({ children, ...props }) => {
	return (
		<Flex
			align='center'
			{...props}>
			{children}
		</Flex>
	);
};

export default AlignCenter;
