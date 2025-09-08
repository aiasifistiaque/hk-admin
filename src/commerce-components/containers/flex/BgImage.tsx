import React, { FC, ReactNode } from 'react';
import { Flex, FlexProps } from '@chakra-ui/react';

type BgImageProps = FlexProps & {
	src: string;
	children?: ReactNode;
};

const BgImage: FC<BgImageProps> = ({ src, children, ...props }) => (
	<Flex
		flex={1}
		w='full'
		bgSize='cover'
		bgPosition='center center'
		bgImage={`url(${src})`}
		{...props}>
		{children}
	</Flex>
);

export default BgImage;
