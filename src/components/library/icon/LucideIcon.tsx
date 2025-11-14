'use client';

import { FC, memo } from 'react';
import { DynamicIcon } from 'lucide-react/dynamic';
import { useColorModeValue } from '@chakra-ui/react';

type IconProps = {
	size?: number;
	color?: string;
	name: string;
};

const LucideIcon: FC<IconProps> = ({ name, ...props }) => {
	const defaultColor = useColorModeValue('#4a4a4a', 'white');

	return (
		<DynamicIcon
			name={name as any}
			size={props.size}
			color={props?.color || defaultColor}
			{...props}
		/>
	);
};

export default memo(LucideIcon);
