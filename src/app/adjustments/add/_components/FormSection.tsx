import React from 'react';
import {
	VInput,
	InputRow as Row,
	VDataMenu,
	createFormFields,
	VSection,
	VSelect,
} from '@/components/library';
import { formFields } from '.';
import schema from '@/models/supplier/supplier.schema';
import { useToast } from '@chakra-ui/react';

const addSupplierModel = createFormFields({
	schema,
	layout: [
		{
			sectionTitle: 'Customer Information',
			fields: ['name', 'email', 'phone'],
		},
	],
});

type FormSectionProps = {
	setItems: any;
	handleChange: (e: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>) => void;
	formData: any;
	invoice: {
		subTotal: number;
		vat: number;
		total: number;
		shipping: number;
		discount: number;
	};
	items: any;
};

const FormSection: React.FC<FormSectionProps> = ({
	handleChange,
	formData,
	invoice,
	items,
	setItems,
}) => {
	const toast = useToast();

	const handleSelectProduct = (e: any) => {
		const { value } = e.target;
		const ifExists = items?.some((item: any) => item?._id === value?._id);

		if (ifExists) {
			toast({
				title: 'Error',
				description: 'Item already added',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'top-right',
			});
			return;
		} else {
			const newItem = {
				_id: value?._id,
				name: value?.item?.name,
				qty: value?.quantity,
				adjustmentQty: 0,
				adjustedQty: 0,
			};

			setItems((prevData: any) => [...prevData, newItem]);
		}
	};

	const formattedValue = formData.date ? new Date(formData.date).toISOString().split('T')[0] : '';

	return (
		<>
			<Row cols='1fr 1fr 1fr'>
				<VDataMenu
					{...formFields.warehouse}
					value={formData.warehouse}
					model='warehouses'
					unselect={false}
					onChange={handleChange}
				/>
				<VInput
					{...formFields.date}
					value={formattedValue}
					onChange={handleChange}
				/>
				<VInput
					{...formFields.reason}
					value={formData.reason}
					type='text'
					onChange={handleChange}
				/>
			</Row>

			<Row gridTemplateColumns='1fr'>
				<VDataMenu
					label='Select item'
					model={`stocks?warehouse=${formData.warehouse}`}
					type='object'
					menuKey='item.name'
					value={''}
					unselect={false}
					onChange={handleSelectProduct}
				/>
			</Row>
		</>
	);
};

export default FormSection;
