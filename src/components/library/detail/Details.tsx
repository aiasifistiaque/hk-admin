import { FC } from 'react';
import {
	Grid,
	Input,
	Text,
	InputProps,
	Button,
	Box,
	Textarea,
	TextareaProps,
	useColorModeValue,
	Image,
	GridItem,
} from '@chakra-ui/react';
import UpdatePasswordModal from '../modals/update-password/UpdatePasswordModal';
import { VImage } from '../utils/inputs';
import { PLACEHOLDER_IMAGE } from '../config';
import { CreateModal } from '../modals';
import { HelperText } from '../form';

type DetailProps = InputProps &
	TextareaProps &
	any & {
		title: string;
		children: any;
		editing: boolean;
		isPassword?: boolean;
		type?: 'input' | 'textarea' | 'image';
		body?: string;
		path?: string;
		dataModel?: any;
		prompt?: {
			title?: string;
			body?: string;
			btnText?: string;
			successMsg?: string;
		};
		id?: string;
		invalidate?: string[];
	};

const Details: FC<DetailProps> = ({
	title,
	children,
	editing,
	type,
	isPassword,
	body,
	path,
	dataModel,
	prompt,
	id,
	invalidate,
	populate,
	...props
}) => {
	const textBox =
		type == 'image' ? (
			<Image
				src={children || PLACEHOLDER_IMAGE}
				h='100px'
				w='100px'
				objectFit='contain'
			/>
		) : (
			<Text
				px={3}
				py={1}
				fontSize='.9rem'>
				{children || <i>N/A</i>}
			</Text>
		);

	const passwordBox = (
		<Box>
			<UpdatePasswordModal trigger={<Button size='sm'>Change Password</Button>} />
		</Box>
	);

	const modalBox = (
		<Box>
			<CreateModal
				type='update'
				data={dataModel}
				prompt={prompt}
				id={id}
				populate={populate}
				invalidate={invalidate}
				path={path}>
				<Button size='sm'>{body}</Button>
			</CreateModal>
		</Box>
	);

	const styleProps = {
		borderRadius: 'lg',
		color: 'text.500',
		_dark: { color: '#ebebeb', bg: 'background.dark' },
		size: 'sm',
		w: { base: '100%', md: '400px' },
	};

	const inputBox =
		type == 'textarea' ? (
			<Textarea
				{...styleProps}
				value={children}
				{...props}
			/>
		) : type == 'image' ? (
			<VImage
				value={children}
				{...props}
			/>
		) : (
			<Input
				{...styleProps}
				value={children}
				{...props}
			/>
		);

	return (
		<Grid
			gridTemplateColumns={{ base: '1fr 2fr', md: '1fr 3fr' }}
			w='100%'
			pb={3}
			borderBottomWidth={1}
			py={4}
			_last={{
				borderBottomWidth: 0,
			}}
			borderColor='container.borderLight'
			_dark={{
				borderColor: 'container.borderDark',
			}}>
			<Text
				py={1}
				fontWeight='600'
				fontSize='.9rem'>
				{title}
			</Text>
			{isPassword ? passwordBox : type == 'modal' ? modalBox : editing ? inputBox : textBox}
			{props?.helper && (
				<GridItem
					colSpan={{ base: 2, md: 2 }}
					mt={4}>
					<Text
						fontSize='.75rem'
						fontStyle='italic'>
						{props?.helper}
					</Text>
				</GridItem>
			)}
		</Grid>
	);
};

export default Details;
