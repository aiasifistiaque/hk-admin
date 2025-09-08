import React from 'react';
import {
	PopoverContent,
	PopoverContentProps,
	PopoverHeader as PHeader,
	PopoverHeaderProps,
} from '@chakra-ui/react';

import { shadow, sizes } from '@/lib/constants';

type PopoverBodyProps = PopoverContentProps & {
	children: React.ReactNode;
};

const PopoverContainer: React.FC<PopoverBodyProps> = ({ children, ...props }) => {
	return (
		<PopoverContent
			boxShadow={shadow.MENU}
			borderRadius={sizes.RADIUS_MENU}
			bg='menu.light'
			_focusVisible={{
				outline: 'none',
			}}
			_dark={{
				bg: 'menu.dark',
			}}
			maxW={sizes.POPOVER_WIDTH}
			{...props}>
			{children}
		</PopoverContent>
	);
};

type PopoverHeaderPropsType = PopoverHeaderProps & {
	children: React.ReactNode;
};

export const PopoverHeader: React.FC<PopoverHeaderPropsType> = ({ children, ...props }) => {
	return (
		<PHeader
			color='header.500'
			_dark={{ color: 'header.200' }}
			fontSize='.875rem'
			fontWeight='700'
			border='none'
			{...props}>
			{children}
		</PHeader>
	);
};

export default PopoverContainer;
