import {
	ButtonProps,
	FlexProps,
	GridProps,
	HeadingProps,
	StackProps,
	TextProps,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

export type FlexChild = FlexProps & {
	children?: ReactNode;
};

export type StackChild = StackProps & {
	children: ReactNode;
};

export type GridChild = GridProps & {
	children?: ReactNode;
};

export type ButtonChild = ButtonProps & {
	children: ReactNode;
};

export type TextChild = TextProps &
	HeadingProps & {
		children: ReactNode;
	};
