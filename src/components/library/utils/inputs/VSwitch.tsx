'use client';
import { FC } from 'react';
import { FormControl, Switch, SwitchProps, Stack } from '@chakra-ui/react';

import { Label, HelperText } from '../..';

type InputContainerProps = SwitchProps & {
	label: string;
	isRequired?: boolean;
	helper?: string;
	value?: boolean | undefined;
	placeholder?: string;
};

const VSwitch: FC<InputContainerProps> = ({
	label,
	isRequired,
	placeholder,
	value,
	helper,
	...props
}) => {
	return (
		<FormControl
			isRequired={isRequired}
			gap={4}>
			<Stack
				spacing={2}
				w='full'>
				<Label>{label}</Label>
				<Stack
					direction='row'
					alignItems='center'
					spacing={3}>
					<Switch
						isChecked={value}
						id={`switch-${props.name}`}
						colorScheme='brand'
						{...props}
					/>
					<Label
						htmlFor={`switch-${props.name}`}
						mb={0}
						fontSize='md'
						fontWeight='600'
						textTransform='capitalize'>
						{placeholder || label}
					</Label>
				</Stack>
				{helper && <HelperText>{helper}</HelperText>}
			</Stack>
		</FormControl>
	);
};

export default VSwitch;
