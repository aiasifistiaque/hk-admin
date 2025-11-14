'use client';

import { Button, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { MenuItem } from '../../../menu';
import { useExportManyMutation } from '../../../store';
import { useAppSelector, useCustomToast } from '../../../hooks';
import { DiscardButton } from '../../buttons';

import {
	MenuModal,
	MenuModalHeader,
	MenuModalBody,
	MenuModalCloseButton,
	MenuModalFooter,
} from '../../table/table-components/menu-modals';

const BulkInvoiceExport = ({
	path,
	ids,
	icon,
	prompt,
}: {
	path: string;
	ids: string[];
	icon?: string;
	prompt?: any;
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { fields = [], preferences = [] } = useAppSelector(state => state.table);
	const [selected, setSelected] = useState<string[]>([]);

	const [trigger, result] = useExportManyMutation();

	const handleSubmit = (e: any) => {
		e.preventDefault();
		trigger({
			path: path,
			body: {
				fields: selected,
				ids: ids,
			},
			type: 'pdf',
		});
	};

	const closeModal = () => {
		setSelected(preferences);
		onClose();
	};

	useEffect(() => {
		setSelected(preferences);
	}, [preferences]);

	useEffect(() => {
		if (result?.isSuccess) {
			closeModal();
		}
	}, [result]);

	useCustomToast({
		successText: prompt?.successMsg || `Download Successful`,
		...result,
	});

	const titleText = prompt?.title || 'Download Items (PDF)';
	const bodyText = prompt?.body || 'Press Continue to donload Invoices for the selected Orders';

	return (
		<>
			<MenuItem
				onClick={onOpen}
				icon='export-doc'>
				{prompt?.menuBtnText || 'Download Invoices (PDF)'}
			</MenuItem>

			<MenuModal
				isOpen={isOpen}
				onClose={closeModal}>
				<MenuModalHeader>{titleText}</MenuModalHeader>
				<MenuModalCloseButton />
				<MenuModalBody>{bodyText}</MenuModalBody>
				<MenuModalFooter>
					<DiscardButton onClick={closeModal}>Discard</DiscardButton>
					<Button
						size='sm'
						onClick={handleSubmit}
						isLoading={result?.isLoading}>
						{prompt?.actionBtnText || 'Download'}
					</Button>
				</MenuModalFooter>
			</MenuModal>
		</>
	);
};

export default BulkInvoiceExport;
