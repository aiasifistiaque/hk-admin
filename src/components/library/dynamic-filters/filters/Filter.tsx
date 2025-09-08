import { Flex, Tag, TagLabel, TagProps } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

import { Icon, radius } from '../..';

type FilterProps = TagProps & {
	children: ReactNode;
	isActive?: boolean;
	onCancel?: any;
};

const Filter: FC<FilterProps> = ({ children, isActive = false, onCancel, ...props }) => {
	return (
		<Tag
			userSelect='none'
			cursor='pointer'
			bg='transparent'
			borderRadius={'full'}
			border='1px dashed'
			mr={0.5}
			mb={0.5}
			borderColor='text.secondary.dark'
			color='gray.600'
			fontWeight='600'
			_dark={{
				borderColor: 'border.dark',
				color: 'text.secondary.dark',
				bg: 'table.row.dark',
			}}
			size='sm'
			pl={1}
			py={1}
			{...props}>
			{!isActive && (
				<Icon
					name='add-tag'
					size={16}
				/>
			)}
			<TagLabel mx={1}>{children}</TagLabel>
			{isActive && (
				<Flex onClick={onCancel}>
					<Icon
						name='close'
						size={16}
					/>
				</Flex>
			)}
		</Tag>
	);
};

export default Filter;
