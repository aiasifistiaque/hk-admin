'use client';

import { FC, useEffect, useRef, useState } from 'react';
import {
	Input,
	InputGroup,
	InputGroupProps,
	InputLeftAddon,
	useDisclosure,
} from '@chakra-ui/react';
import { Icon, SideDrawer, Align, useGetQuery } from '../';
import BarcodeModal from '../components/modals/delete/BarcodeModal';

type PosBarcodeProps = InputGroupProps & {};

const PosBarcode: FC<PosBarcodeProps> = ({ ...props }) => {
	const [value, setValue] = useState<string>('');
	const [isFocused, setIsFocused] = useState<boolean>(false);

	const { isOpen, onOpen, onClose } = useDisclosure();

	const { data, isSuccess, isFetching } = useGetQuery(
		{ path: `products/get/barcode/${value}` },
		{ skip: !value }
	);

	const onModalClose = () => {
		setValue('');
		onClose();
	};

	useEffect(() => {
		if (value == '') return;
		if (isFetching) return;

		if (isSuccess && data) {
			if (isOpen) return;
			onOpen();
		}
	}, [isSuccess, isFetching, value]);

	const handleSearch = (e: any) => {
		setValue(e.target.value);
	};

	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Check if F1 key is pressed
			if (e.key === 'F1') {
				e.preventDefault();
				inputRef.current?.focus();
			}
			// Check if Command/Control + Delete/Backspace is pressed
			if ((e.metaKey || e.ctrlKey) && (e.key === 'Delete' || e.key === 'Backspace')) {
				e.preventDefault();
				setValue('');
				inputRef.current?.focus();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	return (
		<Align w='100%'>
			<SideDrawer />
			<BarcodeModal
				isOpen={isOpen}
				onClose={onModalClose}
				onOpen={onOpen}
				item={data?.data}
				selectedVariant={data?.variantId}
			/>
			<InputGroup {...props}>
				<InputLeftAddon
					borderRadius='sm'
					bg={isFocused ? 'black' : '#ddd'}
					_dark={{ bg: isFocused ? 'black' : 'background.dark' }}>
					<Icon
						name='barcode'
						color={isFocused ? 'white' : 'inherit'}
					/>
				</InputLeftAddon>
				<Input
					ref={inputRef}
					bg='white'
					_dark={{ bg: 'sidebar.dark' }}
					borderRadius='sm'
					placeholder='Search By Barcode'
					value={value}
					onChange={handleSearch}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
				/>
			</InputGroup>
		</Align>
	);
};

export default PosBarcode;
