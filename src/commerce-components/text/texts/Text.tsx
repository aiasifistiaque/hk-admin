import { TextChild } from '../..';
import React, { FC } from 'react';
import { Text as CText } from '@chakra-ui/react';

const SubHeading: FC<TextChild> = ({ children, ...props }) => {
	return (
		<CText
			color='etext.600'
			fontSize={{ base: '1rem', md: '1rem' }}
			_dark={{
				color: 'whitesmoke',
			}}
			{...props}>
			{children}
		</CText>
	);
};

export default SubHeading;
