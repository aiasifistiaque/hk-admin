'use client';
import {
	ModalFormSection,
	DiscardButton,
	usePostMutation,
	useIsMobile,
	Dialog,
	DialogBody,
	DialogCloseButton,
	DialogFooter,
	DialogHeader,
	Align,
	FormMain,
	createFormFields,
	useCustomToast,
} from '@/components/library';

import React, { KeyboardEvent, useEffect, useState } from 'react';
import { Button, Text, useDisclosure } from '@chakra-ui/react';

const schema = {
	partner: {
		type: 'select',
		title: 'Select Delivery Partner',
		required: true,
		options: [
			{ label: 'Steadfast', value: 'steadfast' },
			{ label: 'Pathao', value: 'pathao' },
		],
	},
	id: {
		type: 'read-only',
		title: 'Order ID',
	},
	name: {
		type: 'text',
		title: 'Name',
		required: true,
	},
	phone: {
		type: 'text',
		title: 'Phone',
		required: true,
	},
	amount: {
		type: 'number',
		title: 'Amount',
		required: true,
	},
	address: {
		type: 'textarea',
		title: 'Address',
		required: true,
	},
	note: {
		type: 'textarea',
		title: 'Note',
	},
};

const layout = [
	{
		sectionTitle: 'Steadfast Delivery Information',
		fields: ['partner', ['id', 'name'], ['phone', 'amount'], 'address'],
	},
	{
		sectionTitle: 'Additional Information',
		fields: ['note'],
	},
];

const SteadfastDelivery = ({ orderData }: any) => {
	const [formData, setFormData] = useState<any>({
		id: orderData?._id,
		name: orderData?.address?.name,
		phone: orderData?.address?.phone,
		address: orderData?.address?.address || orderData?.address?.street,
		amount: orderData?.dueAmount,
		note: '',
	});
	const isMobile = useIsMobile();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [changedData, setChangedData] = useState<any>({});

	const onModalOpen = () => {
		onOpen();
		setFormData({
			id: orderData?._id,
			name: orderData?.address?.name,
			phone: orderData?.address?.phone,
			address: orderData?.address?.address || orderData?.address?.street,
			amount: orderData?.dueAmount,
			note: '',
		});
	};

	const [trigger, result] = usePostMutation();
	const { isSuccess, isLoading } = result;

	const onModalClose = () => {
		setFormData({
			id: orderData?._id,
			name: orderData?.address?.name,
			phone: orderData?.address?.phone,
			address: orderData?.address?.address || orderData?.address?.street,
			amount: orderData?.dueAmount,
			note: '',
		});
		result.reset();
		onClose();
	};

	useEffect(() => {
		if (isLoading) return;
		if (isSuccess) onModalClose();
	}, [isLoading]);

	useCustomToast({
		successText: 'Order Created Successfully',
		...result,
	});

	const handleSubmit = (e: any) => {
		e.preventDefault();

		trigger({
			path: `deliveries/${formData?.partner}`,
			body: formData,
			invalidate: ['orders', 'deliveries'],
		});
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
		if (e.key === 'Enter') e.preventDefault();
	};

	const footer = (
		<>
			{!isMobile && (
				<DiscardButton
					isDisabled={isLoading}
					onClick={onModalClose}>
					Discard
				</DiscardButton>
			)}
			<Button
				{...(isMobile && { w: 'full' })}
				// loadingText='Processing'
				// spinnerPlacement='start'
				type='submit'
				size='sm'>
				{isLoading ? 'Processing...' : 'Confirm'}
			</Button>
		</>
	);

	return (
		<>
			<Button
				onClick={onModalOpen}
				size='sm'>
				Steadfast/Pathao Delivery
			</Button>

			<Dialog
				isOpen={isOpen}
				onClose={onModalClose}>
				<form
					onSubmit={handleSubmit}
					onKeyDown={handleKeyDown}>
					<DialogHeader>Create Steadfast Delivery from Order #{orderData?.invoice}</DialogHeader>
					<DialogCloseButton />

					<DialogBody>
						<Text mb={4}>
							Create and send a delivery request to pathao/steadfast for this order, choose a
							delivery partner, fill out the details and click confirm{' '}
						</Text>
						<ModalFormSection>
							<FormMain
								fields={createFormFields({ schema: schema, layout })}
								formData={formData}
								setFormData={setFormData}
								setChangedData={setChangedData}
								isModal={true}
							/>
						</ModalFormSection>
						{isMobile && <Align py={5}>{footer}</Align>}
					</DialogBody>
					{!isMobile && <DialogFooter>{footer}</DialogFooter>}
				</form>
			</Dialog>
		</>
	);
};

export default SteadfastDelivery;
