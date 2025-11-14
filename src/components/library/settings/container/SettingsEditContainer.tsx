import { FC, Fragment, ReactNode } from 'react';
import {
	Flex,
	Heading,
	Button,
	ButtonProps,
	useColorModeValue,
	Grid,
	FlexProps,
	HeadingProps,
	Text,
	Link,
} from '@chakra-ui/react';
import { Align, Icon, padding, radius, shadow } from '../..';
import { ExternalLinkIcon } from '@chakra-ui/icons';

const P = { base: padding.CONTAINER.BASE, md: padding.CONTAINER.MD, lg: padding.CONTAINER.LG };

type SettingsEditContainerProps = {
	editing: boolean;
	openEdit: () => void;
	closeEdit: () => void;
	handleSubmit: (e: any) => void;
	isLoading: boolean;
	children: ReactNode;
	heading: string;
	cols?: string;
	subTitle?: string;
	footerData?: { title: string; link?: string; href?: string };
};

const headingContainerProps: FlexProps = {
	pt: P,
	px: { base: 4, md: 6 },
	w: '100%',
	// alignItems: 'center',
	justifyContent: 'space-between',
	gap: 4,
};

const headingProps: HeadingProps = {
	fontWeight: '700',
	textTransform: 'uppercase',
	fontSize: { base: '1.15rem', md: '1.3rem' },
};

const containerProps: FlexProps = {
	w: 'full',
	flexDirection: 'column',
	bg: 'container.newLight',
	borderColor: 'container.borderLight',
	shadow: shadow.DASH,
	_dark: {
		bg: 'container.newDark',
		borderColor: 'container.borderDark',
	},
	borderRadius: '8px',
	borderWidth: 1,
};

const SettingsEditContainer: FC<SettingsEditContainerProps> = ({
	editing,
	openEdit,
	closeEdit,
	handleSubmit,
	subTitle,
	isLoading,
	children,
	heading,
	cols,
	footerData,
}) => {
	const editState = editing ? (
		<EditButtons
			isLoading={isLoading}
			closeEdit={closeEdit}
		/>
	) : (
		<ToEditButton onClick={openEdit}>Edit</ToEditButton>
	);

	const bodyProps = {
		px: { base: 4, md: 6 },
		pt: 6,
		pb: 2,
		row: 2,
		rowGap: 2,
		gridTemplateColumns: { base: '1fr', md: cols || '1fr' },
	};

	return (
		<Flex {...containerProps}>
			{heading && (
				<Flex
					{...headingContainerProps}
					flexDir={subTitle ? 'column' : 'row'}>
					<Heading {...headingProps}>{heading}</Heading>
					{subTitle && (
						<Heading
							maxW={{ base: 'full', md: '90%' }}
							fontSize='.85rem'
							color='gray.700'
							fontWeight='300'>
							{subTitle}
						</Heading>
					)}
				</Flex>
			)}
			<form
				onSubmit={handleSubmit}
				style={{ width: '100%' }}>
				<Grid {...bodyProps}>{children}</Grid>
				<Footer justifyContent={footerData ? 'space-between' : 'flex-end'}>
					{footerData && (
						<Align gap={2}>
							<Text fontSize='.85rem'>
								{footerData?.title}{' '}
								{footerData?.link && (
									<Link
										fontSize='.85rem'
										color='dodgerblue'
										href={footerData?.href}
										isExternal>
										{footerData?.link} <ExternalLinkIcon mx='2px' />
									</Link>
								)}
							</Text>
						</Align>
					)}
					<Fragment>{editState}</Fragment>
				</Footer>
			</form>
		</Flex>
	);
};

const footerProps: FlexProps = {
	px: { base: 4, md: 6 },

	borderTopWidth: 1,
	h: '52px',
	_light: { bg: 'background.light', borderColor: 'container.borderLight' },
	w: '100%',
	alignItems: 'center',
	bg: 'background.dark',

	gap: 2,
	borderBottomRadius: '8px',
	justifyContent: 'flex-end',
};

const Footer = ({ children, ...props }: FlexProps & { children: ReactNode }) => {
	return (
		<Flex
			{...footerProps}
			{...props}>
			{children}
		</Flex>
	);
};

const EditButtons: FC<ButtonProps & { closeEdit: () => void }> = ({ closeEdit, ...props }) => (
	<Flex align='center'>
		<Button
			mr={2}
			size='sm'
			variant='white'
			onClick={closeEdit}>
			Discard
		</Button>
		<Button
			size='sm'
			type='submit'
			{...props}>
			Confirm
		</Button>
	</Flex>
);

const ToEditButton: FC<ButtonProps & { children: ReactNode }> = ({ children, ...props }) => {
	const iconColor = useColorModeValue('white', '#222');
	return (
		<Button
			size='sm'
			pl={3}
			leftIcon={
				<Icon
					name='edit'
					color={iconColor}
				/>
			}
			{...props}>
			{children}
		</Button>
	);
};

export default SettingsEditContainer;
