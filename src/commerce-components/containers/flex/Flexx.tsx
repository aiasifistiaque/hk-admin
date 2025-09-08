import { FlexChild } from '../..';
import React, { FC } from 'react';
import { Flex } from '@chakra-ui/react';

const Flexx: FC<FlexChild> = ({ children, ...props }) => {
	return <Flex {...props}>{children}</Flex>;
};

export default Flexx;
