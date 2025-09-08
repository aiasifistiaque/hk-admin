import React, { FC } from 'react';
import { Link, Text } from '@chakra-ui/react';

const FooterText: FC<{ children: string; href: string }> = ({ children, href }) => {
	return (
		<Link href={href}>
			<Text
				fontSize='.9rem'
				color='etext.400'
				_hover={{
					color: 'etext.600',
				}}>
				{children}
			</Text>
		</Link>
	);
};

export default FooterText;
