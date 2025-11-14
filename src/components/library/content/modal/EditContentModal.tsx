import { FormEvent, useEffect, useState, ReactNode, MouseEvent } from 'react';
import {
	Flex,
	FlexProps,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalOverlay,
	useDisclosure,
} from '@chakra-ui/react';

import {
	ModalFormSection,
	useCustomToast,
	ModalContainer,
	useFormData,
	InputData,
	ModalHeader,
	ModalFooter,
	FormMain,
	DiscardButton,
	ModalSubmitButton,
	useGetContent,
	useUpdateByIdMutation,
	useLazyGetByIdToEditQuery,
	useGetSchemaQuery,
	useGetByIdQuery,
	usePostMutation,
} from '../..';

type CreateModalProps = FlexProps & {
	dataModel: InputData<any>[];
	children?: ReactNode;
	path?: string;
	title?: string;
	data: any;
	contentType?: 'basic' | 'content';
	setIsOpen?: any;
	setHover?: any;
	slug: string;
};

const EditContentModal = ({
	data,
	dataModel,
	children,
	path = 'nexa',
	title,
	contentType = 'content',
	setIsOpen,
	slug,
	setHover,
	...props
}: CreateModalProps) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const {
		data: contentData,
		isFetching: contentLoading,
		isSuccess: contentSuccess,
	} = useGetByIdQuery({
		path: path,
		id: `get/slug/${slug}`,
	});

	const [fetch, { data: prevData, isFetching, isUninitialized }] = useLazyGetByIdToEditQuery();
	const [formData, setFormData] = useFormData<any>(data, prevData);

	const { _id } = useGetContent(slug);

	const [trigger, result] = _id ? useUpdateByIdMutation() : usePostMutation();

	const onModalOpen = () => {
		onOpen();
		let newFieldData = {};

		fetch({ path: 'contents', id: _id });
	};

	const { isSuccess, isLoading, isError, error } = result;

	const [changedData, setChangedData] = useState({});

	useCustomToast({
		successText: 'Content Updated',
		isSuccess,
		isError,
		isLoading,
		error,
	});

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		e.stopPropagation();
		const { _id, ...rest } = formData;
		if (_id) {
			trigger({
				body: changedData,
				path: `contents`,
				id: _id,
			});
		} else {
			trigger({
				body: {
					slug: slug,
					name: `Content: ${slug}`,
					status: 'published',
					category: 'content',
					isVisible: true,
					...changedData,
				},
				path: `contents`,
				id: _id,
			});
		}
	};

	const onModalClose = () => {
		setFormData({});
		setHover && setHover(false);
		setIsOpen && setIsOpen(false);
		result.reset();
		onClose();
	};

	useEffect(() => {
		if (isSuccess && !isLoading) {
			onModalClose();
		}
	}, [isLoading]);

	useEffect(() => {
		if (prevData) setFormData(prevData);
	}, [prevData, isFetching]);

	return (
		<>
			<Flex
				onClick={onModalOpen}
				{...props}>
				{children || title || path}
			</Flex>

			<Modal
				size='2xl'
				isOpen={isOpen}
				onClose={onModalClose}
				closeOnOverlayClick={false}>
				<ModalOverlay />
				<ModalContainer onClick={(e: MouseEvent) => e.stopPropagation()}>
					<ModalHeader>{`Update Content`}</ModalHeader>
					<ModalCloseButton />
					<form onSubmit={handleSubmit}>
						<ModalBody px={6}>
							<ModalFormSection>
								<FormMain
									fields={dataModel}
									formData={formData}
									setFormData={setFormData}
									setChangedData={setChangedData}
									isModal={true}
								/>
							</ModalFormSection>
						</ModalBody>
						<ModalFooter>
							<DiscardButton
								mr={2}
								onClick={onModalClose}>
								Discard
							</DiscardButton>
							<ModalSubmitButton isLoading={isLoading}>Confirm</ModalSubmitButton>
						</ModalFooter>
					</form>
				</ModalContainer>
			</Modal>
		</>
	);
};

export default EditContentModal;
