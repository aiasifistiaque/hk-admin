import {
	Modal,
	ModalOverlay,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	Button,
	useDisclosure,
	Flex,
	ModalFooter,
	Text,
} from '@chakra-ui/react';

import {
	IconButton,
	useFormData,
	FormContent,
	ModalContainer,
	Column,
	InputData,
	useAppDispatch,
	useAppSelector,
	useGetByIdQuery,
	DiscardButton,
	Address,
	setVariantCartAddress,
} from '../..';
import { useEffect } from 'react';

const inputFields: InputData<Address>[] = [
	{
		name: 'name',
		label: 'Recipient Name',
		isRequired: true,
		type: 'text',
	},
	{
		name: 'email',
		label: 'Recipient Email',
		type: 'text',
		span: 1,
	},
	{
		name: 'phone',
		label: 'Recipient Phone',
		isRequired: true,
		type: 'text',
		span: 1,
	},
	{
		name: 'address',
		label: 'Full Address',
		isRequired: true,
		type: 'textarea',
	},
];

const AddressWidget = ({ id }: { id?: string }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const dispatch = useAppDispatch();
	const { isAddressSet, address, user }: any = useAppSelector(state => state.variantCart);

	const { data, isFetching } = useGetByIdQuery(
		{
			path: 'customers',
			id: user,
		},
		{
			skip: !user,
		}
	);

	const [formData, setFormData] = useFormData<any>(inputFields);

	useEffect(() => {
		if (address) {
			setFormData({
				name: address?.name,
				email: address?.email,
				phone: address?.phone,
				address: address?.address,
			});
		}
	}, [address]);

	const onModalOpen = () => {
		onOpen();
	};

	const onModalClose = () => {
		setFormData({});
		onClose();
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		dispatch(setVariantCartAddress(formData));
		onModalClose();
	};

	const deleteAddress = (e: any) => {
		setFormData({
			name: address?.name,
			email: address?.email,
			phone: address?.phone,
			address: address?.address,
		});
		onOpen();
	};

	const addressIsSet = (
		<Flex
			justify='space-between'
			flex={1}>
			<Column gap={1}>
				<Text
					fontSize='.85rem'
					fontWeight='600'>
					{`${address?.name} (${address?.phone})`}
				</Text>
				<Text fontSize='.8rem'>
					<strong>Address: </strong>
					{address?.address}
				</Text>
			</Column>

			<IconButton
				tooltip='Edit Address'
				aria-label='Edit Address'
				colorScheme='brand'
				variant='outline'
				borderRadius='sm'
				iconName='edit'
				size='xs'
				onClick={deleteAddress}
			/>
		</Flex>
	);

	const addressNotSet = (
		<Button
			size='sm'
			fontWeight='700'
			variant='link'
			onClick={onModalOpen}>
			Add Delivery Address
		</Button>
	);

	return (
		<>
			<Flex
				py={1}
				pl={3}>
				{isAddressSet ? addressIsSet : addressNotSet}
			</Flex>

			<Modal
				size='4xl'
				isOpen={isOpen}
				onClose={onClose}>
				<ModalOverlay />

				<ModalContainer>
					<ModalCloseButton />
					<ModalHeader>Delivery Address</ModalHeader>
					<form onSubmit={handleSubmit}>
						<ModalBody>
							<FormContent
								formData={formData}
								setFormData={setFormData}
								data={inputFields}
							/>
						</ModalBody>
						<ModalFooter>
							<DiscardButton
								size='sm'
								_light={{
									borderWidth: 1,
									borderColor: 'container.borderLight',
									bg: 'container.newLight',
								}}
								mr={2}
								onClick={onModalClose}>
								Discard
							</DiscardButton>
							<Button
								size='sm'
								type='submit'>
								Submit
							</Button>
						</ModalFooter>
					</form>
				</ModalContainer>
			</Modal>
		</>
	);
};

export default AddressWidget;
